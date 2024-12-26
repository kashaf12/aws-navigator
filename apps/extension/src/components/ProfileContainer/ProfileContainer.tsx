import EmptyContainer from "../EmptyContainer";
import { User } from "lucide-react";

const ProfileContainer = () => {
  return (
    <EmptyContainer
      Icon={User}
      title="Coming Soon"
      description="This feature is not implemented yet."
      buttonText="Start New Chat"
    />
  );
};

export default ProfileContainer;
