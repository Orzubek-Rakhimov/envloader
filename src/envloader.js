"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
var fs = require("fs");
var path = require("path");
function parseValue(value, type) {
    switch (type) {
        case "number":
            var parsedNumber = Number(value);
            if (isNaN(parsedNumber))
                throw new Error("Value \"".concat(value, "\" is not a valid number"));
            return parsedNumber;
        case "boolean":
            if (value.toLowerCase() === "true")
                return true;
            if (value.toLowerCase() === "false")
                return false;
            throw new Error("Value \"".concat(value, "\" is not a valid boolean"));
        default:
            return value;
    }
}
function loadEnv(filePath, options) {
    var _a;
    if (filePath === void 0) { filePath = ".env"; }
    var envPath = path.resolve(process.cwd(), filePath);
    var parsedConfig = {};
    var prefix = options.prefix || "";
    try {
        if (!fs.existsSync(envPath)) {
            throw new Error("Environment file ".concat(filePath, " not found"));
        }
        var envConfig = fs.readFileSync(envPath, "utf-8");
        var envVariables = envConfig.split("\n").reduce(function (acc, line) {
            var trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith("#")) {
                var _a = trimmedLine.split("="), key = _a[0], rest = _a.slice(1);
                var value = rest.join("=").trim();
                acc[key.trim()] = value;
            }
            return acc;
        }, {});
        // Validate and load variables with the specified prefix
        for (var _i = 0, _b = Object.entries(options.variables); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], config = _c[1];
            var envKey = prefix + key;
            var envValue = (_a = envVariables[envKey]) !== null && _a !== void 0 ? _a : config.default;
            if (config.required && envValue === undefined) {
                throw new Error("Missing required environment variable: ".concat(envKey));
            }
            if (envValue !== undefined) {
                parsedConfig[envKey] = config.type
                    ? parseValue(envValue, config.type)
                    : envValue;
            }
        }
        // Include additional prefixed variables
        for (var _d = 0, _e = Object.entries(envVariables); _d < _e.length; _d++) {
            var _f = _e[_d], key = _f[0], value = _f[1];
            if (key.startsWith(prefix)) {
                if (!parsedConfig.hasOwnProperty(key)) {
                    parsedConfig[key] = value;
                }
            }
            else {
                throw new Error("Environment variable ".concat(key, " does not start with the required prefix: ").concat(prefix));
            }
        }
        return parsedConfig;
    }
    catch (error) {
        console.error("Failed to load environment file: ".concat(error.message));
        throw error;
    }
}
exports.loadEnv = loadEnv;
