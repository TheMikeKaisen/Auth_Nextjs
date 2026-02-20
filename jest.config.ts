import type { Config } from "jest";
import nextJest from "next/jest.js";

const create_jest_config = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleNameMapper: {
    // 1. Keep your existing mapping
    "^@/(.*)$": "<rootDir>/src/$1",
    
    // 2. Add the fix for jose
    "^jose$": "<rootDir>/node_modules/jose/dist/node/webapi/index.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  
  // Keep this from before as a backup
  transformIgnorePatterns: [
    "/node_modules/(?!jose)/",
  ],
};

export default create_jest_config(config);