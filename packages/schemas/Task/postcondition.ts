import { z } from "zod";
import { identifierSchema } from "./identifier";

export const postConditionSchema = z.object({
  url: z
    .string()
    .optional()
    .describe(
      "URL substring to match for determining if the user is already on the correct page."
    ),
  ui_element: identifierSchema.optional(),
});
export const isPostConditionAvailableSchema = z.object({
  handle: postConditionSchema,
});

export type isPostConditionAvailableInput = z.infer<
  typeof isPostConditionAvailableSchema
>;
