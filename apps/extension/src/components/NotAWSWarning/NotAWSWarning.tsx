import classes from "./styles.module.css";

const NotAWSWarning = () => {
  return (
    <div className={classes.warningContainer}>
      <h2 className={classes.warningTitle}>Not on AWS Console</h2>
      <p className={classes.warningMessage}>
        Please navigate to AWS Console to use AWS Navigator.
      </p>
      <a
        href="https://console.aws.amazon.com"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.warningLink}
      >
        Go to AWS Console
      </a>
    </div>
  );
};

export default NotAWSWarning;
