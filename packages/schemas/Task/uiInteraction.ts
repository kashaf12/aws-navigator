import { z } from "zod";
import { identifierSchema } from "./identifier";

export const uiInteractionSchema = z.object({
  type: z
    .enum(["button", "input", "link", "dropdown", "checkbox", "text"])
    .describe("Type of the UI element."),
  identifier: identifierSchema,
  manual_intervention: z
    .boolean()
    .default(false)
    .describe("Indicates if manual intervention is required."),
  action: z
    .enum(["highlight", "click", "scroll", "tooltip", "select", "type"])
    .describe("Action to perform on the element."),
});

export const isUIInteractionAvailableSchema = z.object({
  handle: uiInteractionSchema,
});

export type isUIInteractionAvailableInput = z.infer<
  typeof isUIInteractionAvailableSchema
>;
