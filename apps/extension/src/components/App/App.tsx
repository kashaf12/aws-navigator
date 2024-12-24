import { useState, useEffect } from "react";

import { isAWSConsole } from "@/utils/aws-detection";
import NotAWSWarning from "../NotAWSWarning";
import ErrorMessage from "../ErrorMessage";
import ChatContainer from "../ChatContainer";

import classes from "./styles.module.css";

const App = () => {
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
        setLoading(false);
      });

      // Example of sending message to background
      chrome.runtime.sendMessage({ type: "POPUP_OPENED" }, (response) =>
        console.log("[AWS Navigator] Background Response:", response),
      );
    } catch (err) {
      console.error("[AWS Navigator] Popup Error:", err);
      setError(true);
      setLoading(false);
    }

    return () => {
      console.log("[AWS Navigator] Popup Closed");
    };
  }, []);

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage />;
  }

  const handleHighlight = (selectors: string[]) => {
    // Implement your highlighting logic here
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        // Add highlighting effect
      }
    });
  };

  return (
    <div className={classes.appContainer}>
      {isAWS ? (
        <>
          <header className={classes.appHeader}>
            <h1 className={classes.appTitle}>AWS Navigator</h1>
          </header>
          <main className={classes.appMain}>
            <ChatContainer onHighlight={handleHighlight} />
          </main>
        </>
      ) : (
        <NotAWSWarning />
      )}
    </div>
  );
};

export default App;
