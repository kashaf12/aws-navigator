import { ActionExecutorProps } from "./types";
import classes from "./styles.module.css";
import { ActionStatus, ValidationStatus } from "@/contexts";
import { useTask } from "@/hooks";
import ActionItem from "../ActionItem";

const ActionExecutor = ({ flow, stepNumber }: ActionExecutorProps) => {
  const { currentTask } = useTask();

  const getCurrentActionIndex = () => {
    if (!currentTask) return -1;

    const actionProgress =
      currentTask.stepProgress[stepNumber]?.flowProgress[flow.id]
        ?.actionProgress;
    if (!actionProgress) return 0;

    const inProgressAction = flow.actions.find(
      (action) => actionProgress[action.id]?.status === ActionStatus.IN_PROGRESS
    );

    if (inProgressAction) {
      return flow.actions.indexOf(inProgressAction);
    }

    // Find the first non-completed action
    const nextAction = flow.actions.find(
      (action) => actionProgress[action.id]?.status !== ActionStatus.COMPLETED
    );

    return nextAction ? flow.actions.indexOf(nextAction) : -1;
  };

  const currentActionIndex = getCurrentActionIndex();

  return (
    <div className={classes.actionExecutor}>
      {flow.actions.map((action, index) => {
        const actionProgress =
          currentTask?.stepProgress[stepNumber]?.flowProgress[flow.id]
            ?.actionProgress[action.id];

        return (
          <ActionItem
            key={action.id}
            id={action.id}
            description={action.description}
            type={action.ui_interaction.type}
            action={action.ui_interaction.action}
            status={actionProgress?.status || ActionStatus.PENDING}
            validationStatus={
              actionProgress?.validationStatus || ValidationStatus.PENDING
            }
            isActive={index === currentActionIndex}
            isManualIntervention={action.ui_interaction.manual_intervention}
          />
        );
      })}
    </div>
  );
};

export default ActionExecutor;
