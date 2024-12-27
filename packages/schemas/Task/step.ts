import { optional, z } from "zod";
import { preConditionSchema } from "./preCondition";
import { postConditionSchema } from "./postCondition";
import { flowSchema } from "./flow";

export const stepSchema = z.object({
  id: z.number().int().min(1).describe("The sequence number of the step."),
  description: z.string().describe("A user-friendly explanation of the step."),
  pre_conditions: preConditionSchema.optional(),
  post_conditions: postConditionSchema.optional(),
  flows: z
    .array(flowSchema)
    .min(1)
    .describe("An ordered list of flows to complete the step."),
  optional: z
    .boolean()
    .optional()
    .describe("Whether the step is optional or not."),
});

export const isStepAvailableSchema = z.object({
  handle: stepSchema,
});

export type isStepAvailableInput = z.infer<typeof isStepAvailableSchema>;

export type Step = z.infer<typeof stepSchema>;
