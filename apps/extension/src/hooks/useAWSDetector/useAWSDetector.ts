import { useState, useEffect } from "react";
import { isAWSConsole } from "@/utils";

const useAWSDetector = () => {
  const [isAWS, setIsAWS] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const checkCurrentTab = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const url = tab?.url || "";
        console.log("[AWS Navigator] Current Tab URL:", url);
        setIsAWS(isAWSConsole(url));
      } catch (err) {
        console.error("[AWS Navigator] Tab Query Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Listen for tab update messages from background script
    const messageListener = (message: {
      type: string;
      data: { isAWS: boolean; url: string };
    }) => {
      if (message.type === BACKGROUND_MESSAGE_TOPIC.TAB_UPDATE) {
        checkCurrentTab();
      }
    };

    // Initial check
    checkCurrentTab();

    // Set up message listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return { isAWS, loading, error };
};

export default useAWSDetector;
