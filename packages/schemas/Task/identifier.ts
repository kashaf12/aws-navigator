import { z } from "zod";

export const identifierSchema = z.object({
  css_selector: z.string().describe("CSS selector for locating the element."),
  text_content: z
    .string()
    .optional()
    .describe("Optional text content for further identification."),
});

export const isIdentifierAvailableSchema = z.object({
  handle: identifierSchema,
});

export type isIdentifierAvailableInput = z.infer<
  typeof isIdentifierAvailableSchema
>;
