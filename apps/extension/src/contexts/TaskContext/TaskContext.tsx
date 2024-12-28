import { createContext, useState, useEffect } from "react";
import { Task, Step, Flow } from "@aws-navigator/schemas";
import {
  TaskContextType,
  TaskProviderProps,
  TaskStatus,
  ValidationStatus,
  ActionStatus,
  ActiveTask,
  ChatReference,
  FlowProgress,
  StepProgress,
  ActionProgress,
} from "./types";
import { TaskLocalStorageManager } from "@/services";
// import { findElement } from "@/utils";

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

const storageManager = new TaskLocalStorageManager();

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [currentTask, setCurrentTask] = useState<ActiveTask | null>(null);

  useEffect(() => {
    const loadActiveTask = async () => {
      try {
        const storedTask = await storageManager.getActiveTask();
        if (storedTask) {
          setCurrentTask(storedTask);
        }
      } catch (error) {
        console.error("[AWS Navigator] Error loading active task:", error);
      }
    };
    loadActiveTask();
  }, []);

  const startTask = async (task: Task, chatRef: ChatReference) => {
    const activeTask: ActiveTask = {
      ...task,
      status: TaskStatus.IN_PROGRESS,
      currentStepIndex: 0,
      stepProgress: task.steps.reduce(
        (stepAcc: Record<number, StepProgress>, step, index) => {
          stepAcc[index] = {
            status: TaskStatus.IN_PROGRESS,
            validationStatus: ValidationStatus.PENDING,
            flowProgress: step.flows.reduce(
              (acc: Record<number, FlowProgress>, flow) => {
                acc[flow.id] = {
                  flowId: flow.id,
                  validationStatus: ValidationStatus.PENDING,
                  isSelected: false,
                  actionProgress: flow.actions.reduce(
                    (actionAcc: Record<number, ActionProgress>, action) => {
                      actionAcc[action.id] = {
                        status: ActionStatus.PENDING,
                        validationStatus: ValidationStatus.PENDING,
                      };
                      return actionAcc;
                    },
                    {}
                  ),
                };
                return acc;
              },
              {}
            ),
          };

          return stepAcc;
        },
        {}
      ),
      chatReference: chatRef,
    };

    try {
      await storageManager.setActiveTask(activeTask);
      setCurrentTask(activeTask);
    } catch (error) {
      console.error("[AWS Navigator] Error starting task:", error);
    }
  };

  const validateStep = async (step: Step): Promise<ValidationStatus> => {
    if (!step.pre_conditions && !step.post_conditions) {
      return ValidationStatus.VALID;
    }

    // TODO: we'll need to implement these validations in service as a class

    // Validate URL if specified
    // if (step.pre_conditions?.url) {
    //   const currentUrl = window.location.href;
    //   if (!currentUrl.includes(step.pre_conditions.url)) {
    //     return ValidationStatus.INVALID;
    //   }
    // }

    // Validate UI elements if specified
    // if (step.pre_conditions?.ui_element) {
    //   const element = findElement(step.pre_conditions.ui_element);
    //   if (!element) return ValidationStatus.INVALID;
    // }

    // if (step.post_conditions?.ui_element) {
    //   const element = findElement(step.post_conditions.ui_element);
    //   if (!element) return ValidationStatus.INVALID;
    // }

    return ValidationStatus.VALID;
  };

  const validateFlow = async (
    flow: Flow,
    stepIndex: number
  ): Promise<ValidationStatus> => {
    if (!flow.pre_conditions && !flow.post_conditions) {
      return ValidationStatus.VALID;
    }

    console.info(stepIndex);

    // if (!stepIndex) return ValidationStatus.INVALID; // remove
    // TODO: we'll need to implement these validations in service as a class

    // Check pre-conditions
    // if (flow.pre_conditions?.ui_element) {
    //   const element = findElement(flow.pre_conditions.ui_element);
    //   if (!element) return ValidationStatus.INVALID;
    // }

    // // Check URL pre-condition
    // if (flow.pre_conditions?.url) {
    //   const currentUrl = window.location.href;
    //   if (!currentUrl.includes(flow.pre_conditions.url)) {
    //     return ValidationStatus.INVALID;
    //   }
    // }

    return ValidationStatus.VALID;
  };

  const validateAction = async (
    actionId: number,
    flowId: number,
    stepIndex: number
  ): Promise<ValidationStatus> => {
    if (!currentTask) return ValidationStatus.INVALID;

    const step = currentTask.steps[stepIndex];
    const flow = step.flows.find((f) => f.id === flowId);
    const action = flow?.actions.find((a) => a.id === actionId);

    if (!action) return ValidationStatus.INVALID;

    // Check if previous actions in the flow are completed
    const flowProgress =
      currentTask.stepProgress[stepIndex]?.flowProgress[flowId];
    const previousActions = flow?.actions.filter((a) => a.id < actionId) || [];

    const allPreviousActionsCompleted = previousActions.every(
      (prevAction) =>
        flowProgress?.actionProgress[prevAction.id]?.status ===
        ActionStatus.COMPLETED
    );

    if (!allPreviousActionsCompleted) {
      return ValidationStatus.INVALID;
    }

    // Validate UI element if specified
    // TODO: we'll need to implement these validations in service as a class

    // if (action.ui_interaction.identifier) {
    //   const element = findElement(action.ui_interaction.identifier);
    //   if (!element) return ValidationStatus.INVALID;
    // }

    return ValidationStatus.VALID;
  };

  const selectFlow = async (flowId: number, stepIndex: number) => {
    if (!currentTask) return;

    try {
      const step = currentTask.steps[stepIndex];
      const flow = step.flows.find((f) => f.id === flowId);
      console.log({ step, flow });
      if (!flow) return;

      const validationStatus = await validateFlow(flow, stepIndex);
      console.log({ validationStatus, currentTask, stepIndex });
      if (validationStatus === ValidationStatus.INVALID) return;

      const updatedStepProgress = {
        ...currentTask.stepProgress[stepIndex],
        selectedFlowId: flowId,
        flowProgress: {
          ...currentTask.stepProgress[stepIndex].flowProgress,
          [flowId]: {
            ...currentTask.stepProgress[stepIndex].flowProgress[flowId],
            isSelected: true,
          },
        },
      };

      const updates = {
        stepProgress: {
          ...currentTask.stepProgress,
          [stepIndex]: updatedStepProgress,
        },
      };

      console.log({ updates });

      await storageManager.updateTaskProgress(currentTask.id, updates);
      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("[AWS Navigator] Error selecting flow:", error);
    }
  };

  const completeAction = async (
    actionId: number,
    flowId: number,
    stepIndex: number
  ) => {
    if (!currentTask) return;

    try {
      const validationStatus = await validateAction(
        actionId,
        flowId,
        stepIndex
      );
      if (validationStatus === ValidationStatus.INVALID) return;

      const updatedActionProgress = {
        status: ActionStatus.COMPLETED,
        validationStatus: ValidationStatus.VALID,
      };

      const stepProgress = currentTask.stepProgress[stepIndex];
      const flowProgress = stepProgress.flowProgress[flowId];

      const updatedFlowProgress = {
        ...flowProgress,
        actionProgress: {
          ...flowProgress.actionProgress,
          [actionId]: updatedActionProgress,
        },
      };

      const updates = {
        stepProgress: {
          ...currentTask.stepProgress,
          [stepIndex]: {
            ...stepProgress,
            flowProgress: {
              ...stepProgress.flowProgress,
              [flowId]: updatedFlowProgress,
            },
          },
        },
      };

      await storageManager.updateTaskProgress(currentTask.id, updates);
      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("[AWS Navigator] Error completing action:", error);
    }
  };

  const completeStep = async (stepIndex: number) => {
    if (!currentTask) return;

    try {
      const validationStatus = await validateStep(currentTask.steps[stepIndex]);
      if (validationStatus === ValidationStatus.INVALID) return;

      const updates = {
        stepProgress: {
          ...currentTask.stepProgress,
          [stepIndex]: {
            ...currentTask.stepProgress[stepIndex],
            status: TaskStatus.COMPLETED,
            validationStatus: ValidationStatus.VALID,
          },
        },
        currentStepIndex: stepIndex + 1,
        status:
          stepIndex === currentTask.steps.length - 1
            ? TaskStatus.COMPLETED
            : TaskStatus.IN_PROGRESS,
      };

      await storageManager.updateTaskProgress(currentTask.id, updates);
      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("[AWS Navigator] Error completing step:", error);
    }
  };

  const skipStep = async (stepIndex: number) => {
    if (!currentTask) return;

    try {
      const updates = {
        stepProgress: {
          ...currentTask.stepProgress,
          [stepIndex]: {
            ...currentTask.stepProgress[stepIndex],
            status: TaskStatus.SKIPPED,
          },
        },
        currentStepIndex: stepIndex + 1,
      };

      await storageManager.updateTaskProgress(currentTask.id, updates);
      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("[AWS Navigator] Error skipping step:", error);
    }
  };

  const resetTask = async () => {
    if (!currentTask) return;

    try {
      // Reset all progress tracking
      const initialStepProgress = currentTask.steps.reduce(
        (acc: Record<number, StepProgress>, step, index) => {
          acc[index] = {
            status: TaskStatus.IDLE,
            validationStatus: ValidationStatus.PENDING,
            flowProgress: step.flows.reduce(
              (flowAcc: Record<number, FlowProgress>, flow) => {
                flowAcc[flow.id] = {
                  flowId: flow.id,
                  validationStatus: ValidationStatus.PENDING,
                  isSelected: false,
                  actionProgress: flow.actions.reduce(
                    (actionAcc: Record<number, ActionProgress>, action) => {
                      actionAcc[action.id] = {
                        status: ActionStatus.PENDING,
                        validationStatus: ValidationStatus.PENDING,
                      };
                      return actionAcc;
                    },
                    {}
                  ),
                };
                return flowAcc;
              },
              {}
            ),
          };
          return acc;
        },
        {}
      );

      const updates = {
        status: TaskStatus.IN_PROGRESS,
        currentStepIndex: 0,
        stepProgress: initialStepProgress,
      };

      await storageManager.updateTaskProgress(currentTask.id, updates);
      setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error("[AWS Navigator] Error resetting task:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await storageManager.clearActiveTask();
      setCurrentTask(null);
    } catch (error) {
      console.error("[AWS Navigator] Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        currentTask,
        startTask,
        validateStep,
        validateFlow,
        validateAction,
        selectFlow,
        completeAction,
        completeStep,
        skipStep,
        resetTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
