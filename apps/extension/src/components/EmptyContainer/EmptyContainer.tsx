import classes from "./styles.module.css";
import { EmptyContainerProps } from "./types";

const EmptyContainer = ({
  Icon,
  title,
  description,
  buttonText,
  onClick,
}: EmptyContainerProps) => {
  return (
    <div className={classes.emptyState}>
      {Icon && <Icon size={48} className={classes.emptyStateIcon} />}
      <h3 className={classes.emptyStateTitle}>{title}</h3>
      {description && (
        <p className={classes.emptyStateDescription}>{description}</p>
      )}
      {onClick && (
        <button onClick={onClick} className={classes.emptyStateButton}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyContainer;
