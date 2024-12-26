import { Task } from "@aws-navigator/schemas";

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

export const extractUniqueSelectors = (task: Task): string[] => {
  const selectors = task.steps.flatMap((step) =>
    step.ui_elements.map((element) => element.identifier.css_selector)
  );
  return [...new Set(selectors)];
};
