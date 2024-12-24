import { z } from "zod";
import { stepSchema } from "./step";

export const taskSchema = z.object({
  task: z.string().describe("The name or title of the task."),
  steps: z
    .array(stepSchema)
    .min(1)
    .describe("An ordered list of steps to complete the task."),
});

export const isTaskAvailableSchema = z.object({
  handle: taskSchema,
});

export type isTaskAvailableInput = z.infer<typeof isTaskAvailableSchema>;

export type Task = z.infer<typeof taskSchema>;
