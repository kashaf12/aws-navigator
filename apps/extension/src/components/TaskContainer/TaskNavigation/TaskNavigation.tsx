import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, SkipForward } from "lucide-react";
import { PositionType } from "../../Navigation/types";
import Tooltip from "../../Tooltip";
import { TaskNavigationProps } from "./types";
import classes from "./styles.module.css";

const TaskNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSkip,
  onDone,
}: TaskNavigationProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    action: () => Promise<void>,
    buttonId: string
  ) => {
    setLoading(buttonId);
    setError(null);
    try {
      await action();
    } catch (err) {
      console.error("[AWS Navigator] : TaskNavigation : handleAction : ", err);
      setError("Failed to process step. Please try again. : ");
    } finally {
      setLoading(null);
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={classes.container}>
      {error && <div className={classes.error}>{error}</div>}
      <div className={classes.navigationButtons}>
        <Tooltip
          content="Go to previous step"
          position={PositionType.Top}
          delay={300}
        >
          <button
            className={`${classes.button} ${classes.secondaryButton}`}
            onClick={() => handleAction(onPrevious, "prev")}
            disabled={isFirstStep || loading !== null}
          >
            {loading === "prev" ? (
              <Loader2 className={classes.loadingSpinner} size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
            Previous
          </button>
        </Tooltip>
        <div className={classes.rightButtons}>
          {!isLastStep && (
            <>
              <Tooltip
                content="Skip current step"
                position={PositionType.Top}
                delay={300}
              >
                <button
                  className={`${classes.button} ${classes.skipButton}`}
                  onClick={() => handleAction(onSkip, "skip")}
                  disabled={loading !== null}
                >
                  {loading === "skip" ? (
                    <Loader2 className={classes.loadingSpinner} size={16} />
                  ) : (
                    <SkipForward size={16} />
                  )}
                  Skip
                </button>
              </Tooltip>

              <Tooltip
                content="Continue to next step"
                position={PositionType.Top}
                delay={300}
              >
                <button
                  className={`${classes.button} ${classes.primaryButton}`}
                  onClick={() => handleAction(onNext, "next")}
                  disabled={loading !== null}
                >
                  {loading === "next" ? (
                    <Loader2 className={classes.loadingSpinner} size={16} />
                  ) : (
                    <>
                      Next
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </Tooltip>
            </>
          )}

          {isLastStep && (
            <Tooltip
              content="Complete the task"
              position={PositionType.Top}
              delay={300}
            >
              <button
                className={`${classes.button} ${classes.primaryButton}`}
                onClick={() => handleAction(onDone, "done")}
                disabled={loading !== null}
              >
                {loading === "done" ? (
                  <Loader2 className={classes.loadingSpinner} size={16} />
                ) : (
                  "Done"
                )}
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskNavigation;
