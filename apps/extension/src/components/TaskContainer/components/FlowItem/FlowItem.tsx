import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { ValidationStatus } from "@/contexts";
import { FlowItemProps } from "./types";
import classes from "./styles.module.css";
import Tooltip from "@/components/Tooltip";
import { PositionType } from "@/components/Navigation";

const FlowItem = ({
  flow,
  isSelected,
  validationStatus,
  onSelect,
  isDisabled,
}: FlowItemProps) => {
  const getStatusIcon = () => {
    switch (validationStatus) {
      case ValidationStatus.VALID:
        return <CheckCircle className={classes.validIcon} size={16} />;
      case ValidationStatus.INVALID:
        return <XCircle className={classes.invalidIcon} size={16} />;
      case ValidationStatus.PENDING:
        return <AlertCircle className={classes.pendingIcon} size={16} />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationStatus) {
      case ValidationStatus.VALID:
        return "Flow is available";
      case ValidationStatus.INVALID:
        return "Prerequisites not met";
      case ValidationStatus.PENDING:
        return "Checking availability";
      default:
        return "";
    }
  };

  return (
    <button
      className={`${classes.flowItem} ${isSelected ? classes.selected : ""} ${
        isDisabled ? classes.disabled : ""
      }`}
      onClick={onSelect}
      disabled={isDisabled || validationStatus === ValidationStatus.INVALID}
      aria-selected={isSelected}
    >
      <div className={classes.flowInfo}>
        <h4 className={classes.flowTitle}>{flow.description}</h4>
        <div className={classes.flowMetrics}>
          <span className={classes.actionCount}>
            {flow.actions.length} action{flow.actions.length !== 1 ? "s" : ""}
          </span>
          {flow.priority > 1 && (
            <span className={classes.priorityBadge}>
              Priority {flow.priority}
            </span>
          )}
        </div>
      </div>

      <div className={classes.flowStatus}>
        <Tooltip
          content={getValidationMessage()}
          position={PositionType.Left}
          delay={300}
        >
          <div className={classes.statusIcon}>{getStatusIcon()}</div>
        </Tooltip>
      </div>
    </button>
  );
};

export default FlowItem;
