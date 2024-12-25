import classes from "./styles.module.css";
import ChatDashboard from "../ChatDashboard";
import { ViewType } from "@/contexts";
import { useView } from "@/hooks";
import ConversationList from "../ConversationList";
import { FC } from "react";
import ErrorMessage from "../ErrorMessage";

const ViewMapping: Record<ViewType, FC> = {
  [ViewType.CurrentChat]: ChatDashboard,
  [ViewType.History]: ConversationList,
  [ViewType.Settings]: () => <div>Settings</div>,
  [ViewType.Documentation]: () => <div>Documentation</div>,
  [ViewType.UserProfile]: () => <div>UserProfile</div>,
};

const AppContent = () => {
  const { activeView } = useView();
  const Component = ViewMapping[activeView];

  if (!Component) {
    return <ErrorMessage message="View not found!!" />; // Fallback for invalid views
  }

  return (
    <>
      <main className={classes.appMain}>
        <Component />
      </main>
    </>
  );
};

export default AppContent;
