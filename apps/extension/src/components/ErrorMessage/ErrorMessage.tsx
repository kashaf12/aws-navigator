import classes from "./styles.module.css";
import { ErrorMessageProps } from "./types";

const ErrorMessage = ({
  message = " Something went wrong. Please reload the extension.",
}: ErrorMessageProps) => {
  return <div className={classes.errorMessageContainer}>{message}</div>;
};

export default ErrorMessage;
