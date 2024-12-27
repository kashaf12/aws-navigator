import { z } from "zod";
import { identifierSchema } from "./identifier";

export const preConditionSchema = z.object({
  url: z
    .string()
    .optional()
    .describe(
      "URL substring to match for determining if the user is already on the correct page."
    ),
  ui_element: identifierSchema.optional(),
});
export const isPreConditionAvailableSchema = z.object({
  handle: preConditionSchema,
});

export type isPreConditionAvailableInput = z.infer<
  typeof isPreConditionAvailableSchema
>;
