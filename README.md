# envloader

`env-loader` is a simple and robust library for loading environment variables from a `.env` file into your Node.js application. It helps manage environment-specific configurations in a centralized and organized manner.

## Features

- **Centralized Configuration Management** : Keep all your environment-specific configurations in one place.
- **Separation of Configuration from Code** : Store configuration values like database credentials and API keys securely in environment variables.
- **Ease of Environment-Specific Configurations** : Easily switch configurations for different environments (development, testing, production) by changing the `.env` file.
- **Error Handling** : Gracefully handle common issues such as missing files, read permission issues, and invalid file formats.

## Installation

Install `env-loader` using npm:

```sh
npm install env-loader
```

## Usage

### Basic Usage

Create a `.env` file in the root of your project with your environment variables:

```.env
DATABASE_URL=postgres://user:password@localhost:5432/mydb
API_KEY=your_api_key_here
```

Load the environment variables in your application:

```typescript
import { loadEnv, EnvConfig } from "@orzubek/envloader";

const config: EnvConfig = loadEnv();
console.log("Database URL:", config.DATABASE_URL);
console.log("API Key:", config.API_KEY);
```

### Specifying a Custom Path

You can specify a custom path to your `.env` file:

```typescript
import { loadEnv, EnvConfig } from "@orzubek/envloader";

const config: EnvConfig = loadEnv("path/to/your/.env");
console.log("Custom Config Loaded:", config);
```

### Error Handling

`env-loader` provides detailed error messages for common issues:

```typescript
import { loadEnv, EnvConfig } from "@orzubek/envloader";

try {
  const config: EnvConfig = loadEnv();
  console.log("Configuration loaded:", config);
} catch (error) {
  console.error("Failed to load configuration:", error);
}
```

## API

### `loadEnv(filePath?: string): EnvConfig`

- **filePath** (optional): The path to the `.env` file. Defaults to `.env` in the current working directory.
- **Returns** : An object with the parsed key-value pairs from the `.env` file.

### `EnvConfig`

A TypeScript interface representing the configuration object:

```typescript
export interface EnvConfig {
  [key: string]: string;
}
```

## Example

Here’s an example of how to use `env-loader` in a project:

1. Create a `.env` file:

```makefile
  PORT=3000
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=password
```

- Load the environment variables in your application:

```typescript
import { loadEnv, EnvConfig } from "@orzubek/envloader";

const config: EnvConfig = loadEnv();
console.log(`Server is running on port ${config.PORT}`);
console.log(`Database is hosted on ${config.DB_HOST}`);
```

- Run your application, and the environment variables will be loaded and accessible.

## Contribution

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please create an issue or submit a pull request. Make sure to follow the code style and include tests for any new features or bug fixes.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and add tests.
4. Ensure all tests pass.
5. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.
