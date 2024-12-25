import { useContext } from "react";
import { ViewContext } from "@/contexts";

const useView = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};

export default useView;
