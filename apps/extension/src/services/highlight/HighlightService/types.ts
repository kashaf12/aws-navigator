export interface HighlightStyles {
  outline?: string;
  backgroundColor?: string;
  transition?: string;
}

export interface HighlightOptions {
  styles?: HighlightStyles;
  scrollIntoView?: boolean;
  animate?: boolean;
}
