import EmptyContainer from "../EmptyContainer";
import { FileText } from "lucide-react";

const DocumentationContainer = () => {
  return (
    <EmptyContainer
      Icon={FileText}
      title="Coming Soon"
      description="This feature is not implemented yet."
      buttonText="Start New Chat"
    />
  );
};

export default DocumentationContainer;
