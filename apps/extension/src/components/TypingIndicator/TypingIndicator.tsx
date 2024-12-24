import React from "react";

import classes from "./styles.module.css";

const TypingIndicator: React.FC = () => {
  return (
    <div className={classes.typingIndicator}>
      <div className={classes.typingDot} />
      <div className={classes.typingDot} />
      <div className={classes.typingDot} />
    </div>
  );
};

export default TypingIndicator;
