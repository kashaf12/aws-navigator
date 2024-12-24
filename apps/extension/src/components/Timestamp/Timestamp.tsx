import classes from "./styles.module.css";
import { TimestampProps } from "./types";

const Timestamp = ({ date }: TimestampProps) => (
  <span className={classes.timestamp}>
    {date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </span>
);

export default Timestamp;
