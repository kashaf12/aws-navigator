import {
  CheckCircle,
  Circle,
  MessageSquare,
  SquarePlay,
  XCircle,
} from "lucide-react";
import classes from "./styles.module.css";
import { TaskStatus, ViewType } from "@/contexts";
import Tooltip from "../Tooltip";
import { PositionType } from "../Navigation";
import { useTask, useView, useChats } from "@/hooks";
import EmptyContainer from "../EmptyContainer";

const TaskContainer = () => {
  const { currentTask } = useTask();
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
      <div className={classes.header}>
        <div className={classes.taskHeader}>
          <h3 className={classes.taskTitle}>Current Task</h3>
          {status === TaskStatus.IN_PROGRESS && (
            <span className={classes.stepCount}>
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          )}
        </div>
        {isChatAvailable && (
          <Tooltip
            content="Return to Chat"
            position={PositionType.Left}
            delay={300}
          >
            <button
              onClick={handleReturnToChat}
              className={classes.returnToChat}
            >
              <MessageSquare size={20} />
            </button>
          </Tooltip>
        )}
      </div>

      <div className={classes.stepsProgress}>
        {steps.map((step, index) => (
          <Tooltip
            key={index}
            content={step.description}
            position={PositionType.Right}
            delay={300}
          >
            <div
              className={`${classes.stepIndicator} ${
                index === currentStepIndex ? classes.active : ""
              }`}
            >
              {getStepIcon(index)}
              <div className={classes.stepLine} />
            </div>
          </Tooltip>
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
