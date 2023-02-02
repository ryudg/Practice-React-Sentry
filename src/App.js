import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import User from "./User";
import * as Sentry from "@sentry/react";

function App() {
  const user = {
    id: 1,
    username: "Son",
  };
  return (
    <>
      <h1>App</h1>
      <ErrorBoundary>
        <User />
      </ErrorBoundary>
    </>
  );
}

export default Sentry.withProfiler(App);
