import * as fs from "fs";
import * as path from "path";

export interface EnvConfig {
  [key: string]: string;
}

export function loadEnv(filePath: string = ".env"): EnvConfig {
  const envPath = path.resolve(process.cwd(), filePath);
  try {
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file ${filePath} not found`);
    }
    const envConfig = fs.readFileSync(envPath, "utf-8");
    const parsedConfig: EnvConfig = {};

    envConfig.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, value] = trimmedLine.split("=");
        if (!key || !value) {
          throw new Error(`Invalid format in .env file: ${line}`);
        }
        parsedConfig[key.trim()] = value.trim();
      }
    });

    return parsedConfig;
  } catch (error: any) {
    console.error(`Failed to load environment file: ${error.message}`);
    throw error;
  }
}
