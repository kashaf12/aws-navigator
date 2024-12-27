import { SquarePlay } from "lucide-react";
import classes from "./styles.module.css";
import { ViewType } from "@/contexts";
import { useTask, useView, useChats } from "@/hooks";
import EmptyContainer from "../EmptyContainer";
import { StepNavigator, TaskNavigation, TaskDetails } from "./components";

const TaskContainer = () => {
  const { currentTask, resetTask, deleteTask, completeStep } = useTask();
  const { setActiveView } = useView();
  const { chats, updateActiveChat } = useChats();
  const [selectedFlows, setSelectedFlows] = useState<Record<number, number>>(
    {}
  );

  if (!currentTask) {
    return (
      <EmptyContainer
        Icon={SquarePlay}
        title="No Active Task"
        description="Select a task from any chat to start the guided navigation through AWS Console."
        buttonText="Go to Chat"
        onClick={() => setActiveView(ViewType.CurrentChat)}
      />
    );
  }

  const { chatReference } = currentTask;

  const handleReturnToChat = () => {
    updateActiveChat(chatReference.chatId);
    setActiveView(ViewType.CurrentChat);
  };

  const handlePrevious = async () => {
    if (currentTask.currentStepIndex > 0) {
      await completeStep(currentTask.currentStepIndex - 2); // Go back one step
    }
  };

  const handleNext = async () => {
    await completeStep(currentTask.currentStepIndex);
  };

  const handleSkip = async () => {
    await completeStep(currentTask.currentStepIndex);
  };

  const handleDone = async () => {
    await completeStep(currentTask.currentStepIndex);
    setActiveView(ViewType.CurrentChat);
  };

  const isChatAvailable = chats.some(
    (chat) => chat.id === chatReference.chatId
  );

  const handleFlowSelect = (stepIndex: number, flowId: number) => {
    setSelectedFlows((prev) => ({
      ...prev,
      [stepIndex]: flowId,
    }));
  };

  return (
    <div className={classes.progressContainer}>
      <TaskDetails
        task={currentTask}
        onReset={resetTask}
        onReturnToChat={handleReturnToChat}
        isChatAvailable={isChatAvailable}
        onDelete={deleteTask}
      />

      <StepNavigator
        task={currentTask}
        selectedFlows={selectedFlows}
        onFlowSelect={handleFlowSelect}
      />

      <footer className={classes.footer}>
        <TaskNavigation
          currentStep={currentTask.currentStepIndex}
          totalSteps={currentTask.steps.length}
          status={currentTask.status}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSkip={handleSkip}
          onDone={handleDone}
        />
      </footer>
    </div>
  );
};

export default TaskContainer;
