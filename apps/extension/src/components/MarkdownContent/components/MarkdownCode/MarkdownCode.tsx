import classes from "./styles.module.css";
import { MarkdownCodeProps } from "./types";

const MarkdownCode = ({ children, ...props }: MarkdownCodeProps) => (
  <code {...props} className={classes.markdownCode}>
    {children}
  </code>
);

export default MarkdownCode;
