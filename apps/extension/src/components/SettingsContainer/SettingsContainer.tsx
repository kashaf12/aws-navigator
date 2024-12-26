import EmptyContainer from "../EmptyContainer";
import { Settings } from "lucide-react";

const SettingsContainer = () => {
  return (
    <EmptyContainer
      Icon={Settings}
      title="Coming Soon"
      description="This feature is not implemented yet."
      buttonText="Start New Chat"
    />
  );
};

export default SettingsContainer;
