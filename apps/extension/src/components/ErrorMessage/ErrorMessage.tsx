import classes from "./styles.module.css";

const ErrorMessage = () => {
  return (
    <div className={classes.errorMessageContainer}>
      Something went wrong. Please reload the extension.
    </div>
  );
};

export default ErrorMessage;
