import ReactMarkdown from "react-markdown";
import { MarkdownContentProps } from "./types";
import { MarkdownCode, MarkdownLink, MarkdownPre } from "./components";

const MarkdownContent = ({ content }: MarkdownContentProps) => (
  <ReactMarkdown
    components={{
      a: MarkdownLink,
      code: MarkdownCode,
      pre: MarkdownPre,
    }}
  >
    {content}
  </ReactMarkdown>
);

export default MarkdownContent;
