import classes from "./styles.module.css";
import ChatContainer from "../ChatContainer";
import { ViewType } from "@/contexts";
import { useView } from "@/hooks";
import ChatHistory from "../ChatHistory";
import { FC } from "react";
import ErrorMessage from "../ErrorMessage";
import TaskContainer from "../TaskContainer";
import SettingsContainer from "../SettingsContainer";
import DocumentationContainer from "../DocumentationContainer";
import ProfileContainer from "../ProfileContainer";

const ViewMapping: Record<ViewType, FC> = {
  [ViewType.CurrentChat]: ChatContainer,
  [ViewType.History]: ChatHistory,
  [ViewType.TaskContainer]: TaskContainer,
  [ViewType.Settings]: SettingsContainer,
  [ViewType.Documentation]: DocumentationContainer,
  [ViewType.UserProfile]: ProfileContainer,
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
