import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

// Load environment config from config.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
const configJson = require("./config.json") as {
  environments: Record<string, { baseUrl: string }>;
  activeEnvironment: string;
};

const env = configJson.activeEnvironment;
const baseURL = configJson.environments[env]?.baseUrl ?? "http://localhost:3000";

export default defineConfig({
  timeout: 30 * 1000, // 30 seconds per test
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "reports" }],
    ["junit", { outputFile: "reports/results.xml" }],
    ["./utils/CustomReporter.ts"],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /*
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    */
  ],
});
