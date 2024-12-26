import { CheckCircle, Circle, SquarePlay, XCircle } from "lucide-react";
import classes from "./styles.module.css";
import { TaskStatus, ViewType } from "@/contexts";
import { useTask, useView, useChats } from "@/hooks";
import EmptyContainer from "../EmptyContainer";
import TaskDetails from "../TaskDetails";

const TaskContainer = () => {
  const { currentTask, resetTask } = useTask();
  const { setActiveView } = useView();
  const { chats, updateActiveChat } = useChats();

  if (!currentTask) {
    return (
      <EmptyContainer
        Icon={SquarePlay}
        title="No Active Task"
        description="Select a task from any chat to start the guided navigation through AWS
          Console."
        buttonText="Go to Chat"
        onClick={() => setActiveView(ViewType.CurrentChat)}
      />
    );
  }

  const { steps, currentStepIndex, status, chatReference } = currentTask;

  const handleReturnToChat = () => {
    updateActiveChat(chatReference.chatId);
    setActiveView(ViewType.CurrentChat);
  };

  const isChatAvailable = chats.some(
    (chat) => chat.id === chatReference.chatId
  );

  const getStepIcon = (index: number) => {
    if (index < currentStepIndex) {
      return <CheckCircle className={classes.completedStep} size={20} />;
    } else if (index === currentStepIndex) {
      return <Circle className={classes.currentStep} size={20} />;
    } else {
      return <Circle className={classes.pendingStep} size={20} />;
    }
  };
  return (
    <div className={classes.progressContainer}>
      <TaskDetails
        task={currentTask}
        onReset={resetTask}
        onReturnToChat={handleReturnToChat}
        isChatAvailable={isChatAvailable}
      />

      <div className={classes.stepsProgress}>
        {steps.map((step, index) => (
          <div
            className={`${classes.stepIndicator} ${
              index === currentStepIndex ? classes.active : ""
            }`}
            key={step.step_number}
          >
            {getStepIcon(index)}
            {step.description}
            <div className={classes.stepLine} />
          </div>
        ))}
      </div>

      {status === TaskStatus.COMPLETED && (
        <div className={classes.completedMessage}>
          <CheckCircle className={classes.completedIcon} size={20} />
          Task Completed
        </div>
      )}

      {status === TaskStatus.FAILED && (
        <div className={classes.failedMessage}>
          <XCircle className={classes.failedIcon} size={20} />
          Task Failed
        </div>
      )}
    </div>
  );
};

export default TaskContainer;
