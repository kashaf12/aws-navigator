import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AccordionProps } from "./types";
import classes from "./styles.module.css";

const Accordion = ({
  trigger,
  children,
  className = "",
  defaultOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${classes.accordion} ${className}`}>
      <button
        className={classes.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={classes.triggerContent}>{trigger}</div>
        <ChevronDown
          className={`${classes.chevron} ${isOpen ? classes.rotate : ""}`}
          size={16}
        />
      </button>
      <div
        className={`${classes.content} ${isOpen ? classes.expanded : ""}`}
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
