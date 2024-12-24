import classes from "./styles.module.css";
import { MarkdownLinkProps } from "./types";

const MarkdownLink = ({ children, ...props }: MarkdownLinkProps) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    className={classes.markdownLink}
  >
    {children}
  </a>
);

export default MarkdownLink;
