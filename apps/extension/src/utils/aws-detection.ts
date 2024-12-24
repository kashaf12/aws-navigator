import { AWS_CONSOLE_REGEX } from "./constants";

export const isAWSConsole = (url: string): boolean => {
  return AWS_CONSOLE_REGEX.test(url);
};
