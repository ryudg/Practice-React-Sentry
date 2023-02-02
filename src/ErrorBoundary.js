import React, { Component } from "react";
import * as Sentry from "@sentry/browser";

class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  // 두개의 파라미터 (error, info)
  // 첫번째 파라미터 error 는 에러의 내용
  // 두번째 파라미터 info 는 에러가 발생한 위치
  componentDidCatch(error, info) {
    console.log("에러가 발생했습니다.");
    console.log({
      error,
      info,
    });
    this.setState({
      error: true,
    });
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error, { extra: info });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>에러 발생!</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
