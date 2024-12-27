import classes from "./styles.module.css";
import { StepContentProps } from "./types";
const StepContent = ({ step }: StepContentProps) => {
  return (
    <div className={classes.stepDetails}>
      {step.preconditions && (
        <div className={classes.section}>
          <h4 className={classes.sectionTitle}>Preconditions</h4>
          <ul className={classes.preconditionsList}>
            {step.preconditions.current_url_contains && (
              <li>
                URL must contain: {step.preconditions.current_url_contains}
              </li>
            )}
            {step.preconditions.ui_element_exists && (
              <li>
                Required element:{" "}
                {step.preconditions.ui_element_exists.css_selector}
              </li>
            )}
          </ul>
        </div>
      )}

      <div className={classes.section}>
        <h4 className={classes.sectionTitle}>UI Elements</h4>
        <ul className={classes.elementsList}>
          {step.ui_elements.map((element, index) => (
            <li key={index} className={classes.elementItem}>
              <span className={classes.elementType}>{element.type}:</span>
              <span className={classes.elementDetails}>
                {element.identifier.text_content ||
                  element.identifier.css_selector}
                {element.action && (
                  <span className={classes.elementAction}>
                    ({element.action})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {step.navigation && step.navigation.length > 0 && (
        <div className={classes.section}>
          <h4 className={classes.sectionTitle}>Navigation Steps</h4>
          <ol className={classes.navigationList}>
            {step.navigation.map((nav, index) => (
              <li key={index}>{nav}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default StepContent;
