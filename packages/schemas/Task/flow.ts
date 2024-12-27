import { z } from "zod";
import { preConditionSchema } from "./preCondition";
import { postConditionSchema } from "./postCondition";
import { actionSchema } from "./action";

export const flowSchema = z.object({
  id: z.number().int().min(1).describe("The sequence number of the flow."),
  priority: z
    .number()
    .int()
    .min(1)
    .describe(
      "The priority number of the flow. more the priority number, more the priority."
    ),
  description: z.string().describe("A user-friendly explanation of the flow."),
  pre_conditions: preConditionSchema.optional(),
  post_conditions: postConditionSchema.optional(),
  actions: z
    .array(actionSchema)
    .min(1)
    .describe("An ordered list of actions to complete the flow."),
});

export const isFlowAvailableSchema = z.object({
  handle: flowSchema,
});

export type isFlowAvailableInput = z.infer<typeof isFlowAvailableSchema>;

export type Flow = z.infer<typeof flowSchema>;
