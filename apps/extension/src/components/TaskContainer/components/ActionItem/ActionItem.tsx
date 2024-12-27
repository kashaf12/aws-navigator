import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  HandMetal,
} from "lucide-react";
import { ActionStatus, ValidationStatus } from "@/contexts";
import { ActionItemProps } from "./types";
import classes from "./styles.module.css";
import Tooltip from "@/components/Tooltip";
import { PositionType } from "@/components/Navigation";

const ActionItem = ({
  id,
  description,
  type,
  action,
  status,
  validationStatus,
  isActive,
  isManualIntervention,
}: ActionItemProps) => {
  const getStatusIcon = () => {
    if (status === ActionStatus.COMPLETED) {
      return <CheckCircle className={classes.completedIcon} size={16} />;
    }

    if (status === ActionStatus.INVALID) {
      return <XCircle className={classes.invalidIcon} size={16} />;
    }

    if (status === ActionStatus.IN_PROGRESS) {
      return (
        <Loader2
          className={`${classes.loadingIcon} ${classes.spin}`}
          size={16}
        />
      );
    }

    if (isManualIntervention) {
      return <HandMetal className={classes.manualIcon} size={16} />;
    }

    return <AlertCircle className={classes.pendingIcon} size={16} />;
  };

  const getStatusText = () => {
    switch (status) {
      case ActionStatus.COMPLETED:
        return "Completed";
      case ActionStatus.IN_PROGRESS:
        return "In Progress";
      case ActionStatus.INVALID:
        return "Failed";
      case ActionStatus.PENDING:
        return isManualIntervention ? "Manual Action Required" : "Pending";
      default:
        return "Unknown";
    }
  };

  const getValidationText = () => {
    switch (validationStatus) {
      case ValidationStatus.VALID:
        return "Prerequisites met";
      case ValidationStatus.INVALID:
        return "Prerequisites not met";
      case ValidationStatus.PENDING:
        return "Checking prerequisites";
      default:
        return "";
    }
  };

  return (
    <div
      className={`${classes.actionItem} ${isActive ? classes.active : ""} ${
        status === ActionStatus.COMPLETED ? classes.completed : ""
      } ${status === ActionStatus.INVALID ? classes.failed : ""}`}
    >
      <div className={classes.actionHeader}>
        <div className={classes.actionInfo}>
          <span className={classes.actionNumber}>{id}</span>
          <div className={classes.actionDetails}>
            <h4 className={classes.actionTitle}>{description}</h4>
            <span className={classes.actionType}>
              {type} • {action}
            </span>
          </div>
        </div>
        <Tooltip
          content={`${getStatusText()} - ${getValidationText()}`}
          position={PositionType.Left}
          delay={300}
        >
          <div className={classes.actionStatus}>{getStatusIcon()}</div>
        </Tooltip>
      </div>

      {isActive && status === ActionStatus.IN_PROGRESS && (
        <div className={classes.progressBar}>
          <div className={classes.progressIndicator} />
        </div>
      )}

      {isActive && isManualIntervention && (
        <div className={classes.manualIntervention}>
          <HandMetal size={16} />
          <p>Please perform this action manually, then click Continue</p>
        </div>
      )}

      {status === ActionStatus.INVALID && (
        <div className={classes.errorMessage}>
          <XCircle size={16} />
          <p>Action failed to complete. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default ActionItem;
