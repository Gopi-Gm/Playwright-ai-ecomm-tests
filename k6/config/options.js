/**
 * Scenario configurations, thresholds, and execution profiles for k6.
 *
 * Supported execution modes via __ENV.SCENARIO:
 * - "smoke"  : Quick sanity check (1-2 VUs, ~30s)
 * - "load"   : Realistic everyday and peak traffic (~4m)
 * - "stress" : High concurrency test to identify breaking points (~4m)
 * - "all"    : Runs smoke, load, and stress scenarios sequentially or concurrently
 */

export const THRESHOLDS = {
  // Global failure rate must remain below 1% under normal conditions
  http_req_failed: ['rate<0.01'],

  // Global latency targets: 95% of requests under 1.2s, 99% under 2.5s
  http_req_duration: ['p(95)<1200', 'p(99)<2500', 'avg<800'],

  // Tagged endpoint thresholds
  'http_req_duration{endpoint:products_list}': ['p(95)<800'],
  'http_req_duration{endpoint:product_detail}': ['p(95)<800'],
  'http_req_duration{endpoint:cart_operations}': ['p(95)<1000'],
  'http_req_duration{endpoint:chat_assistant}': ['p(95)<3000'],
};

export const SCENARIO_DEFINITIONS = {
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '30s',
    exec: 'default',
    tags: { scenario_type: 'smoke' },
  },

  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 10 }, // Warm up to 10 VUs
      { duration: '1m',  target: 10 }, // Steady state standard traffic
      { duration: '30s', target: 20 }, // Spike to peak traffic
      { duration: '1m',  target: 20 }, // Steady state peak traffic
      { duration: '30s', target: 0 },  // Cool down ramp down
    ],
    exec: 'default',
    tags: { scenario_type: 'load' },
  },

  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 15 }, // Initial ramp
      { duration: '1m',  target: 30 }, // Push beyond normal capacity
      { duration: '1m',  target: 50 }, // Maximum stress load
      { duration: '1m',  target: 50 }, // Sustained heavy stress
      { duration: '30s', target: 0 },  // Recovery and ramp down
    ],
    exec: 'default',
    tags: { scenario_type: 'stress' },
  },
};

/**
 * Generates the k6 options object dynamically based on environment variables.
 */
export function getOptions() {
  const selected = (__ENV.SCENARIO || 'smoke').toLowerCase();

  let scenarios = {};

  if (selected === 'all') {
    scenarios = {
      smoke_run: {
        ...SCENARIO_DEFINITIONS.smoke,
        startTime: '0s',
      },
      load_run: {
        ...SCENARIO_DEFINITIONS.load,
        startTime: '35s',
      },
      stress_run: {
        ...SCENARIO_DEFINITIONS.stress,
        startTime: '4m15s',
      },
    };
  } else if (SCENARIO_DEFINITIONS[selected]) {
    scenarios[selected] = SCENARIO_DEFINITIONS[selected];
  } else {
    scenarios.smoke = SCENARIO_DEFINITIONS.smoke;
  }

  return {
    scenarios,
    thresholds: THRESHOLDS,
    // Discard response bodies when not needed to conserve memory under high load
    discardResponseBodies: false,
    userAgent: 'k6-ShopLab-Performance-Test/1.0',
  };
}
