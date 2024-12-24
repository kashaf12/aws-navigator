import { z } from "zod";
import { identifierSchema } from "./identifier";

export const uiElementSchema = z.object({
  type: z
    .enum(["button", "input", "link", "dropdown", "checkbox", "text"])
    .describe("Type of the UI element."),
  identifier: identifierSchema,
  action: z
    .enum(["highlight", "click", "scroll", "tooltip", "select"])
    .describe("Action to perform on the element."),
});

export const isUIElementAvailableSchema = z.object({
  handle: uiElementSchema,
});

export type isUIElementAvailableInput = z.infer<
  typeof isUIElementAvailableSchema
>;
