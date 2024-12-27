import { Step, Task } from "@aws-navigator/schemas";

export const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
};

export const extractIdentifiersFromStep = (step: Step) => {
  return step.ui_interaction.flatMap((element) => element.identifier);
};

export const extractIdentifiersFromTask = (task: Task) => {
  const selectors = task.steps.flatMap((step) =>
    step.ui_interaction.map((element) => element.identifier)
  );
  return selectors;
};
