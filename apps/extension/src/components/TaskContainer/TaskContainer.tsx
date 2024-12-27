import { SquarePlay } from "lucide-react";
import classes from "./styles.module.css";
import { ViewType } from "@/contexts";
import { useTask, useView, useChats } from "@/hooks";
import EmptyContainer from "../EmptyContainer";
import TaskDetails from "./TaskDetails";
import TaskStepGuide from "./TaskStepGuide";

const TaskContainer = () => {
  const { currentTask, resetTask, deleteTask } = useTask();
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

  const { chatReference } = currentTask;

  const handleReturnToChat = () => {
    updateActiveChat(chatReference.chatId);
    setActiveView(ViewType.CurrentChat);
  };

  const isChatAvailable = chats.some(
    (chat) => chat.id === chatReference.chatId
  );
  return (
    <div className={classes.progressContainer}>
      <TaskDetails
        task={currentTask}
        onReset={resetTask}
        onReturnToChat={handleReturnToChat}
        isChatAvailable={isChatAvailable}
        onDelete={deleteTask}
      />
      <TaskStepGuide task={currentTask} onCompleteStep={console.log} />
    </div>
  );
};

export default TaskContainer;
