import * as fs from "fs";
import * as path from "path";

export interface EnvVariableOptions {
  default?: string;
  required?: boolean;
  type?: "string" | "number" | "boolean";
}

export interface LoadEnvOptions {
  prefix?: string;
  variables: {
    [key: string]: EnvVariableOptions;
  };
}

export interface EnvConfig {
  [key: string]: string | number | boolean;
}

function parseValue(
  value: string,
  type: "string" | "number" | "boolean"
): string | number | boolean {
  switch (type) {
    case "number":
      const parsedNumber = Number(value);
      if (isNaN(parsedNumber))
        throw new Error(`Value "${value}" is not a valid number`);
      return parsedNumber;
    case "boolean":
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      throw new Error(`Value "${value}" is not a valid boolean`);
    default:
      return value;
  }
}

export function loadEnv(
  filePath: string = ".env",
  options: LoadEnvOptions
): EnvConfig {
  const envPath = path.resolve(process.cwd(), filePath);
  const parsedConfig: EnvConfig = {};
  const prefix = options.prefix || "";

  try {
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file ${filePath} not found`);
    }

    const envConfig = fs.readFileSync(envPath, "utf-8");

    const envVariables = envConfig.split("\n").reduce((acc, line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...rest] = trimmedLine.split("=");
        const value = rest.join("=").trim();
        acc[key.trim()] = value;
      }
      return acc;
    }, {} as { [key: string]: string });

    // Validate and load variables with the specified prefix
    for (const [key, config] of Object.entries(options.variables)) {
      const envKey = prefix + key;
      const envValue = envVariables[envKey] ?? config.default;

      if (config.required && envValue === undefined) {
        throw new Error(`Missing required environment variable: ${envKey}`);
      }
      if (envValue !== undefined) {
        parsedConfig[envKey] = config.type
          ? parseValue(envValue, config.type)
          : envValue;
      }
    }

    // Include additional prefixed variables
    for (const [key, value] of Object.entries(envVariables)) {
      if (key.startsWith(prefix)) {
        if (!parsedConfig.hasOwnProperty(key)) {
          parsedConfig[key] = value;
        }
      } else {
        throw new Error(
          `Environment variable ${key} does not start with the required prefix: ${prefix}`
        );
      }
    }

    return parsedConfig;
  } catch (error: any) {
    console.error(`Failed to load environment file: ${error.message}`);
    throw error;
  }
}
