import { ActiveTask } from "@/contexts";

export interface TaskStepGuideProps {
  task: ActiveTask;
  onCompleteStep: (index: number) => void;
}
