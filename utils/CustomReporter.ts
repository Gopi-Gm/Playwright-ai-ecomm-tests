import {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
  Suite,
} from "@playwright/test/reporter";
import fs from "fs";
import path from "path";

interface TestEntry {
  title: string;
  status: string;
  duration: number;
  error?: string;
}

class CustomReporter implements Reporter {
  private results: TestEntry[] = [];
  private startTime: number = 0;

  onBegin(_config: unknown, _suite: Suite): void {
    this.startTime = Date.now();
    console.log("\n🎭 ShopLab Test Execution Started\n");
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const entry: TestEntry = {
      title: test.title,
      status: result.status,
      duration: result.duration,
    };

    if (result.error) {
      entry.error = result.error.message;
    }

    this.results.push(entry);

    const icon =
      result.status === "passed"
        ? "✅"
        : result.status === "failed"
          ? "❌"
          : result.status === "skipped"
            ? "⏭️"
            : "⚠️";

    console.log(
      `${icon} ${test.title} [${result.status.toUpperCase()}] — ${result.duration}ms`
    );
  }

  onEnd(result: FullResult): void {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const passed = this.results.filter((r) => r.status === "passed").length;
    const failed = this.results.filter((r) => r.status === "failed").length;
    const skipped = this.results.filter((r) => r.status === "skipped").length;

    console.log("\n─────────────────────────────────────────────");
    console.log("📊 ShopLab Test Execution Summary");
    console.log("─────────────────────────────────────────────");
    console.log(`✅ Passed : ${passed}`);
    console.log(`❌ Failed : ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`⏱️  Duration: ${totalDuration}s`);
    console.log(`🏁 Status : ${result.status.toUpperCase()}`);
    console.log("─────────────────────────────────────────────\n");

    // Write custom HTML report
    const html = this.generateHtml(passed, failed, skipped, totalDuration, result.status);
    const reportDir = path.join(process.cwd(), "custom-report");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    fs.writeFileSync(path.join(reportDir, "report.html"), html, "utf8");
    console.log("📄 Custom report saved to: custom-report/report.html");
  }

  private generateHtml(
    passed: number,
    failed: number,
    skipped: number,
    duration: string,
    status: string
  ): string {
    const rows = this.results
      .map(
        (r) => `
      <tr class="${r.status}">
        <td>${r.title}</td>
        <td class="status">${r.status.toUpperCase()}</td>
        <td>${r.duration}ms</td>
        <td>${r.error ?? ""}</td>
      </tr>`
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>ShopLab Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { display: flex; gap: 20px; margin-bottom: 20px; }
    .card { padding: 16px 24px; border-radius: 8px; color: #fff; font-size: 1.1em; }
    .card.pass { background: #22c55e; }
    .card.fail { background: #ef4444; }
    .card.skip { background: #f59e0b; }
    .card.time { background: #6366f1; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
    th { background: #334155; color: #fff; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    tr.passed td.status { color: #16a34a; font-weight: bold; }
    tr.failed td.status { color: #dc2626; font-weight: bold; }
    tr.skipped td.status { color: #d97706; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🎭 ShopLab Playwright Test Report</h1>
  <p>Overall Status: <strong>${status.toUpperCase()}</strong> | Total Duration: ${duration}s</p>
  <div class="summary">
    <div class="card pass">✅ Passed: ${passed}</div>
    <div class="card fail">❌ Failed: ${failed}</div>
    <div class="card skip">⏭️ Skipped: ${skipped}</div>
    <div class="card time">⏱️ ${duration}s</div>
  </div>
  <table>
    <thead>
      <tr><th>Test</th><th>Status</th><th>Duration</th><th>Error</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
  }
}

export default CustomReporter;

