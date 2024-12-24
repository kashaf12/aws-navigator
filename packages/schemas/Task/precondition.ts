import { z } from "zod";

export const preconditionSchema = z.object({
  current_url_contains: z
    .string()
    .optional()
    .describe(
      "URL substring to match for determining if the user is already on the correct page.",
    ),
  ui_element_exists: z
    .object({
      css_selector: z
        .string()
        .describe(
          "CSS selector to check for the presence of a specific UI element.",
        ),
    })
    .optional(),
});
export const isPreconditionAvailableSchema = z.object({
  handle: preconditionSchema,
});

export type isPreconditionAvailableInput = z.infer<
  typeof isPreconditionAvailableSchema
>;
