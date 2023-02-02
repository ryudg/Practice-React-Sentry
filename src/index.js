import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://33b31d9187c2406098d80e3713d4ed4f@o4504608884326400.ingest.sentry.io/4504608890748928", // 복사한 DSN 값을 여기에 붙여넣으세요.
  release: "release version",
  environment: "production",
  normalizeDepth: 6,
  integrations: [
    new Sentry.Integrations.Breadcrumbs({ console: true }),
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// import React from "react";
// import ReactDOM from "react-dom";
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";
// import App from "./App";

// Sentry.init({
//   dsn: "https://33b31d9187c2406098d80e3713d4ed4f@o4504608884326400.ingest.sentry.io/4504608890748928",
//   integrations: [new BrowserTracing()],

// Set tracesSampleRate to 1.0 to capture 100%
// of transactions for performance monitoring.
// We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

// ReactDOM.render(<App />, document.getElementById("root"));

// Can also use with React Concurrent Mode
// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
