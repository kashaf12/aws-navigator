import classes from "./styles.module.css";
import { MarkdownPreProps } from "./types";

const MarkdownPre = ({ children, ...props }: MarkdownPreProps) => (
  <pre {...props} className={classes.markdownPre}>
    {children}
  </pre>
);

export default MarkdownPre;
