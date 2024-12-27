import { useContext } from "react";
import { TabContext } from "@/contexts";

const useTabs = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabProvider");
  }
  return context;
};

export default useTabs;
