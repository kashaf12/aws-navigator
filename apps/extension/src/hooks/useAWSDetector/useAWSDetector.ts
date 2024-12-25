import { useState, useEffect } from "react";
import { isAWSConsole } from "@/utils/aws-detection";

const useAWSDetector = () => {
  const [isAWS, setIsAWS] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    console.log("[AWS Navigator] Popup Opened");

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const url = currentTab?.url || "";
        console.log("[AWS Navigator] Current Tab URL:", url);

        const isAWSTab = isAWSConsole(url);
        console.log("[AWS Navigator] Is AWS Console Tab:", isAWSTab);

        setIsAWS(isAWSTab);
      });

      // Example of sending message to background
      chrome.runtime.sendMessage({ type: "POPUP_OPENED" }, (response) =>
        console.log("[AWS Navigator] Background Response:", response)
      );
    } catch (err) {
      console.error("[AWS Navigator] Popup Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }

    return () => {
      console.log("[AWS Navigator] Popup Closed");
    };
  }, []);

  return { isAWS, loading, error };
};

export default useAWSDetector;
