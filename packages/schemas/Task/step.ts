import { z } from "zod";
import { uiElementSchema } from "./uiElement";
import { preconditionSchema } from "./precondition";

export const stepSchema = z.object({
  step_number: z
    .number()
    .int()
    .min(1)
    .describe("The sequence number of the step."),
  description: z.string().describe("A user-friendly explanation of the step."),
  ui_elements: z
    .array(uiElementSchema)
    .min(1)
    .describe("List of UI elements involved in this step."),
  preconditions: preconditionSchema.optional(),
  navigation: z
    .array(z.string())
    .optional()
    .describe("Optional navigation guidance if preconditions fail."),
});

export const isStepAvailableSchema = z.object({
  handle: stepSchema,
});

export type isStepAvailableInput = z.infer<typeof isStepAvailableSchema>;
