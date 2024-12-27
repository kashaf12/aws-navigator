import { z } from "zod";
import { uiInteractionSchema } from "./uiInteraction";
import { preConditionSchema } from "./preCondition";
import { postConditionSchema } from "./postCondition";

export const actionSchema = z.object({
  id: z.number().int().min(1).describe("The sequence number of the action."),
  description: z
    .string()
    .describe("A user-friendly explanation of the action."),
  ui_interaction: uiInteractionSchema,
  pre_conditions: preConditionSchema.optional(),
  post_conditions: postConditionSchema.optional(),
});

export const isActionAvailableSchema = z.object({
  handle: actionSchema,
});

export type isActionAvailableInput = z.infer<typeof isActionAvailableSchema>;

export type Action = z.infer<typeof actionSchema>;
