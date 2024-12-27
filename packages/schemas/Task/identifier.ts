import { z } from "zod";

export const identifierSchema = z
  .object({
    css_selector: z
      .string()
      .describe("Optional CSS selector for locating the element.")
      .optional(),
    id: z
      .string()
      .describe("Optional ID selector for locating the element.")
      .optional(),
    xpath: z
      .string()
      .describe("Optional Xpath selector for locating the element.")
      .optional(),
    custom_attribute: z
      .string()
      .describe("Optional data-[] selector for locating the element.")
      .optional(),
    text_content: z
      .string()
      .optional()
      .describe("Optional text content for further identification."),
  })
  .refine((data) => Object.values(data).some((value) => value), {
    message: "At least one selector must be provided",
  });

export const isIdentifierAvailableSchema = z.object({
  handle: identifierSchema,
});

export type isIdentifierAvailableInput = z.infer<
  typeof isIdentifierAvailableSchema
>;
