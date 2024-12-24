import classes from "./styles.module.css";

const TypingIndicator = () => {
  return (
    <div className={classes.typingIndicator}>
      <div className={classes.typingDot} />
      <div className={classes.typingDot} />
      <div className={classes.typingDot} />
    </div>
  );
};

export default TypingIndicator;
