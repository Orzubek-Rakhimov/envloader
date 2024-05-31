// src/envLoader.test.ts
import { loadEnv, EnvConfig } from "./index";
import * as fs from "fs";
import * as path from "path";

describe("loadEnv", () => {
  const envFilePath = path.resolve(__dirname, ".env.test");

  beforeAll(() => {
    fs.writeFileSync(
      envFilePath,
      "TEST_KEY=test_value\nANOTHER_KEY=another_value"
    );
  });

  afterAll(() => {
    fs.unlinkSync(envFilePath);
  });

  it("loads environment variables from .env file", () => {
    const config: EnvConfig = loadEnv(envFilePath);

    expect(config.TEST_KEY).toBe("test_value");
    expect(config.ANOTHER_KEY).toBe("another_value");
  });

  it("throws an error if the .env file is not found", () => {
    expect(() => loadEnv("nonexistent.env")).toThrowError(
      "Environment file nonexistent.env not found"
    );
  });

  it("skips empty lines and comments", () => {
    fs.writeFileSync(
      envFilePath,
      "# This is a comment\nTEST_KEY=test_value\n\nANOTHER_KEY=another_value"
    );
    const config: EnvConfig = loadEnv(envFilePath);

    expect(config.TEST_KEY).toBe("test_value");
    expect(config.ANOTHER_KEY).toBe("another_value");
  });

  it("throws an error for invalid lines in the .env file", () => {
    fs.writeFileSync(envFilePath, "INVALID_LINE");
    expect(() => loadEnv(envFilePath)).toThrowError(
      "Invalid format in .env file: INVALID_LINE"
    );
  });
});
