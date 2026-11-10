/**
 * Custom summary handler for k6 test runs.
 * Produces:
 * 1. Clean stdout text summary
 * 2. Formatted standalone HTML report
 * 3. Machine-readable JSON summary for CI/CD metrics collection
 */

export function generateHtmlReport(data) {
  const metrics = data.metrics || {};
  const dateStr = new Date().toISOString();

  const getMetric = (name, key, fallback = '-') => {
    if (metrics[name] && metrics[name].values && metrics[name].values[key] !== undefined) {
      const val = metrics[name].values[key];
      return typeof val === 'number' ? val.toFixed(2) : val;
    }
    return fallback;
  };

  const reqCount = getMetric('http_reqs', 'count', 0);
  const reqRate = getMetric('http_reqs', 'rate', 0);
  const failRate = getMetric('http_req_failed', 'rate', 0);
  const failPercent = (parseFloat(failRate) * 100).toFixed(2);
  const avgDuration = getMetric('http_req_duration', 'avg', '-');
  const p90Duration = getMetric('http_req_duration', 'p(90)', '-');
  const p95Duration = getMetric('http_req_duration', 'p(95)', '-');
  const p99Duration = getMetric('http_req_duration', 'p(99)', '-');
  const maxDuration = getMetric('http_req_duration', 'max', '-');
  const vusMax = getMetric('vus_max', 'value', getMetric('vus', 'value', '-'));

  // Thresholds evaluation
  const thresholdRows = Object.keys(data.root_group ? (data.metrics || {}) : {})
    .filter(m => metrics[m] && metrics[m].thresholds)
    .map(m => {
      const ths = metrics[m].thresholds;
      return Object.keys(ths).map(thName => {
        const passed = ths[thName].ok;
        return `
          <tr class="${passed ? 'pass' : 'fail'}">
            <td><strong>${m}</strong></td>
            <td><code>${thName}</code></td>
            <td><span class="badge ${passed ? 'badge-pass' : 'badge-fail'}">${passed ? 'PASS' : 'FAIL'}</span></td>
          </tr>
        `;
      }).join('');
    }).join('');

  // Checks evaluation
  const checksList = [];
  function collectChecks(group) {
    if (group.checks && group.checks.length) {
      group.checks.forEach(c => checksList.push(c));
    }
    if (group.groups && group.groups.length) {
      group.groups.forEach(g => collectChecks(g));
    }
  }
  if (data.root_group) collectChecks(data.root_group);

  const checkRows = checksList.map(c => {
    const passed = c.fails === 0;
    const rate = ((c.passes / (c.passes + c.fails)) * 100).toFixed(1);
    return `
      <tr class="${passed ? 'pass' : 'fail'}">
        <td>${c.name}</td>
        <td>${c.passes} / ${c.passes + c.fails} (${rate}%)</td>
        <td><span class="badge ${passed ? 'badge-pass' : 'badge-fail'}">${passed ? 'PASSED' : 'FAILED'}</span></td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopLab k6 Performance Test Report</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --pass: #22c55e;
      --fail: #ef4444;
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: var(--bg); color: var(--text); font-family: var(--font); line-height: 1.5; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
    h1 { font-size: 1.8rem; color: var(--accent); }
    .timestamp { color: var(--text-muted); font-size: 0.9rem; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; }
    .card-title { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .card-value { font-size: 1.8rem; font-weight: 700; color: var(--text); }
    .card-value.pass { color: var(--pass); }
    .card-value.fail { color: var(--fail); }
    table { width: 100%; border-collapse: collapse; background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 2rem; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
    th { background: #162032; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; }
    tr:last-child td { border-bottom: none; }
    .badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
    .badge-pass { background: rgba(34, 197, 94, 0.2); color: var(--pass); }
    .badge-fail { background: rgba(239, 68, 68, 0.2); color: var(--fail); }
    h2 { font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--text); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>ShopLab API Performance Report</h1>
        <p class="timestamp">Generated on ${dateStr}</p>
      </div>
      <div>
        <span class="badge ${parseFloat(failPercent) === 0 ? 'badge-pass' : 'badge-fail'}">
          ${parseFloat(failPercent) === 0 ? 'ALL CHECKS HEALTHY' : 'DEVIATIONS DETECTED'}
        </span>
      </div>
    </header>

    <div class="cards-grid">
      <div class="card">
        <div class="card-title">Total Requests</div>
        <div class="card-value">${reqCount}</div>
        <small style="color:var(--text-muted);">${reqRate} req/s</small>
      </div>
      <div class="card">
        <div class="card-title">Failure Rate</div>
        <div class="card-value ${parseFloat(failPercent) === 0 ? 'pass' : 'fail'}">${failPercent}%</div>
        <small style="color:var(--text-muted);">Threshold: &lt;1.0%</small>
      </div>
      <div class="card">
        <div class="card-title">Avg Latency</div>
        <div class="card-value">${avgDuration} ms</div>
        <small style="color:var(--text-muted);">Max: ${maxDuration} ms</small>
      </div>
      <div class="card">
        <div class="card-title">p(95) Latency</div>
        <div class="card-value">${p95Duration} ms</div>
        <small style="color:var(--text-muted);">p(90): ${p90Duration} ms | p(99): ${p99Duration} ms</small>
      </div>
      <div class="card">
        <div class="card-title">Max VUs</div>
        <div class="card-value">${vusMax}</div>
        <small style="color:var(--text-muted);">Concurrent virtual users</small>
      </div>
    </div>

    ${checkRows ? `
      <h2>Checks Summary</h2>
      <table>
        <thead>
          <tr><th>Check Description</th><th>Pass / Total</th><th>Status</th></tr>
        </thead>
        <tbody>${checkRows}</tbody>
      </table>
    ` : ''}

    ${thresholdRows ? `
      <h2>Thresholds Summary</h2>
      <table>
        <thead>
          <tr><th>Metric</th><th>Condition</th><th>Status</th></tr>
        </thead>
        <tbody>${thresholdRows}</tbody>
      </table>
    ` : ''}
  </div>
</body>
</html>`;
}

export function generateTextSummary(data) {
  const metrics = data.metrics || {};
  const getVal = (name, key, def = '0') => {
    if (metrics[name] && metrics[name].values && metrics[name].values[key] !== undefined) {
      const val = metrics[name].values[key];
      return typeof val === 'number' ? val.toFixed(2) : val;
    }
    return def;
  };

  const reqCount = getVal('http_reqs', 'count');
  const reqRate = getVal('http_reqs', 'rate');
  const failRate = (parseFloat(getVal('http_req_failed', 'rate')) * 100).toFixed(2);
  const avg = getVal('http_req_duration', 'avg');
  const p95 = getVal('http_req_duration', 'p(95)');
  const p99 = getVal('http_req_duration', 'p(99)');

  return `
======================================================================
                  k6 PERFORMANCE TEST SUMMARY
======================================================================
  Total Requests : ${reqCount} (${reqRate} req/s)
  Failed Requests: ${failRate}%
  Avg Latency    : ${avg} ms
  p(95) Latency  : ${p95} ms
  p(99) Latency  : ${p99} ms
======================================================================
`;
}

export function customHandleSummary(data) {
  return {
    stdout: generateTextSummary(data),
    'reports/k6/summary.html': generateHtmlReport(data),
    'reports/k6/summary.json': JSON.stringify(data, null, 2),
  };
}

