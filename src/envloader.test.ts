import { loadEnv, EnvConfig, LoadEnvOptions } from "./envloader";
import * as fs from "fs";
import * as path from "path";

describe("loadEnv", () => {
  const envFilePath = path.resolve(__dirname, ".env.test");

  beforeAll(() => {
    fs.writeFileSync(
      envFilePath,
      "APP_TEST_KEY=test_value\nAPP_ANOTHER_KEY=another_value\nAPP_PORT=3000\nAPP_DEBUG=true\nAPP_DATABASE_URL=postgres://localhost:5432/mydb\nAPP_API_KEY=api_key_value\nAPP_CUSTOM_DELIM=default_custom_value"
    );
  });

  afterAll(() => {
    fs.unlinkSync(envFilePath); // Clean up
  });

  it("loads environment variables from .env file with prefix", () => {
    const options: LoadEnvOptions = {
      prefix: "APP_",
      variables: {
        DATABASE_URL: { required: true },
        API_KEY: { required: true },
        CUSTOM_DELIM: { default: "default_custom_value" },
      },
    };
    const config: EnvConfig = loadEnv(envFilePath, options);
    console.log(config);
    expect(config.APP_DATABASE_URL).toBe("postgres://localhost:5432/mydb");
    expect(config.APP_API_KEY).toBe("api_key_value");
    expect(config.APP_CUSTOM_DELIM).toBe("default_custom_value");
  });

  it("applies default values", () => {
    const options: LoadEnvOptions = {
      prefix: "APP_",
      variables: {
        DEFAULT_KEY: { default: "default_value" },
      },
    };
    const config: EnvConfig = loadEnv(envFilePath, options);

    expect(config.APP_DEFAULT_KEY).toBe("default_value");
  });

  it("validates required variables", () => {
    const options: LoadEnvOptions = {
      prefix: "APP_",
      variables: {
        TEST_KEY: { required: true },
        MISSING_KEY: { required: true },
      },
    };
    expect(() => loadEnv(envFilePath, options)).toThrow(
      "Missing required environment variable: APP_MISSING_KEY"
    );
  });

  it("validates and parses types", () => {
    const options: LoadEnvOptions = {
      prefix: "APP_",
      variables: {
        PORT: { type: "number" },
        DEBUG: { type: "boolean" },
      },
    };
    const config: EnvConfig = loadEnv(envFilePath, options);

    expect(config.APP_PORT).toBe(3000);
    expect(config.APP_DEBUG).toBe(true);
  });

  it("throws an error if an environment variable does not start with the required prefix", () => {
    const options: LoadEnvOptions = {
      prefix: "APP_",
      variables: {},
    };

    // Add a variable without the prefix
    fs.writeFileSync(envFilePath, "TEST_KEY=test_value\n");
    expect(() => loadEnv(envFilePath, options)).toThrow(
      "Environment variable TEST_KEY does not start with the required prefix: APP_"
    );
  });
});
