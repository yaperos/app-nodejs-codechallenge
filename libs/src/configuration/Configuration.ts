import { ConfigurationError } from "../exception/ConfigurationError";

export function configurationString(variable: string | undefined) {
  if (!variable) {
    throw new ConfigurationError();
  }
  return variable;
}

export function configurationBoolean(variable: string | undefined) {
  if (!variable) {
    return false;
  }
  return variable === "true";
}

export function configurationNumber(variable: string | undefined) {
  if (!variable) {
    throw new ConfigurationError();
  }

  return parseInt(variable, 10);
}
