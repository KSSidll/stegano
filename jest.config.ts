import nextJest from "next/jest.js";
import { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/*.test.ts"],
  coverageReporters: ["json", "json-summary"],
  reporters: ["default", "jest-junit"],
};

export default createJestConfig(customJestConfig);
