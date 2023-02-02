# 1. React App에서 Error가 발생하는 상황

## 예시 : 1
- User.js는 `user`라는 props를 받아와서 해당 데이터의 `id`와 `username` 값을 보여준다.
```javascript
// User.js

import React from "react";

function User({ user }) {
  return (
    <div>
      <div>
        <b>ID</b> : {user.id}
      </div>
      <div>
        <b>Username : </b> {user.username}
      </div>
    </div>
  );
}

export default User;
```

```javascript
// App.js
import "./App.css";
import User from "./User";

function App() {
  const user = {
    id: 1,
    username: "Son",
  };
  return (
    <>
      <h1>App</h1>
      <User user={user} />
    </>
  );
}

export default App;
```
![화면 캡처 2023-02-02 135205](https://user-images.githubusercontent.com/103430498/216234643-a256c905-2fa0-4d88-aec3-b67b7d949445.png)

```javascript
...
  <User user={user} />
...
```
- 하지만 App.js에서 user의 props를 제대로 설정하지 않게되면 실제 환경에서는 아무것도 렌더링되지 않고 흰 페이지만 나타나게된다.
- 위와 같은 에러를 방지하기 위해서
```javascript
// User.js
...
  if (!user) {
    return null;
  }

  return (
    ...
  )
```
- user 값이 존재하지 않는다면 null 을 렌더링하게 된다. 
- 리액트 컴포넌트에서 null 을 렌더링하게되면 아무것도 나타나지 않게 된다. 이를 "null checking" 이라고 함.
- 이렇게 코드를 작성하면 User.js는 렌더링 되지 않지만 에러는 발생하지 않는다.
- 보통 데이터를 네트워크 요청을 통하여 나중에 데이터를 받아오게 되는 상황이 발생하는 경우 이렇게 데이터가 없으면 null 을 보여주거나, 아니면 `<div>Loading....</div>`과 같은 결과물을 렌더링하면 된다.


## 예시 : 2
```javascript
function Users({ users }) {
  // if (!users) return null;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.username}</li>
      ))}
    </ul>
  );
}
```
- 같은 컴포넌트에 users 값을 설정해주지 않았을 때에도 렌더링 과정에서 오류가 발생
- users 가 undefined 이면 당연히 배열의 내장함수 map 또한 존재하지 않음
- 따라서 users 가 없으면 `if (!users) return null;`와 같이 다른 결과물을 반환하는 작업을 해야함 

## 예시 : 3
```javascript
function Users({ users, onToggle }) {
  if (!users) return null;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onToggle(user.id)}>
          {user.username}
        </li>
      ))}
    </ul>
  );
}

Users.defaultProps = {
  onToggle: () => {
    console.warn('onToggle is missing!');
  }
};
```
- 위 컴포넌트에 onToggle props 를 전달하지 않으면, 에러가 발생하게 됨.
- 에러를 방지하기 위해선 onToggle 을 props 로 넣어주는 것을 까먹지 않기 위해서 위와 같이 `defaultProps` 설정을 해주는 방법이 있다.

# 2. componentDidCatch 로 에러 잡아내기
```javascript
// /src/ErrorBoundary.js

import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  componentDidCatch(error, info) {
    console.log("에러가 발생했습니다.");
    console.log({
      error,
      info,
    });
    this.setState({
      error: true,
    });
  }

  render() {
    if (this.state.error) {
      return <h1>에러 발생!</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```
- `componentDidCatch`는 두개의 파라미터를 사용하는데 (error, info)
  - 첫번째 파라미터 error 는 에러의 내용
  - 두번째 파라미터 info 는 에러가 발생한 위치
  
- App.js를 `ErrorBoundary` 컴포넌트로 감싸고
```javascript
// App.js

...

return (
    <ErrorBoundary>
      <User />
    </ErrorBoundary>
  );
  
...
```

- `User` 컴포넌트에서 null checking 을 하는 코드를 주석을 제거하면
```javascript
// User.js
...

// if (!user) {
//   return null;
// }

...
```
- 에러가 나지만 흰 화면이 아닌 `ErrorBoundary` 컴포넌트에서 작성한 에러 발생! 문구가 나오게 된다.
- `componentDidCatch` 를 사용해서 앱에서 에러가 발생했을 때 사용자에게 에러가 발생했음을 인지시켜줄 수 는 있지만, <br>
  `componentDidCatch` 가 실제로 호출되는 일은 서비스에서 "없어야 하는게" 맞다.
- 만약 놓친 에러가 있다면, 이를 알아내어 예외 처리를 해주어야 하고
- 개발자는 발견해내지 못했지만, 사용자가 발견하게 되는 그런 오류를 `componentDidCatch` 에서 `error` 와 `info` 값을 네트워크를 통하여 다른 곳으로 전달해주어야 한다.
- 하지만 이를 위해 서버를 따로 만드는 것은 번거롭기 때문에 Sentry를 사용한다.

# 3. Sentry (실시간 로그 취합 및 분석 도구이자 모니터링 플랫폼)
> 참고 [pay tech Sentry로 우아하게 프론트엔드 에러 추적하기](https://tech.kakaopay.com/post/frontend-sentry-monitoring/)

> **프론트엔드에서의 오류**<br>
> 프론트엔드에서의 오류는 크게 데이터 영역, 화면 영역 두 가지 영역에서의 오류,<br>
> 그리고 예상할 수 없는 네트워크 이슈나 특정 브라우저 버전, 단말기 OS 업데이트 같은 외부 요인에 의한 오류나 예상치 못한 런타임 오류로 나눌 수 있다.<br>
> 데이터 영역, 화면 영역에서 발생하는 오류는 충분히 조심하고 방어할 수 있지만, <br>
> 외부 요인에 의한 오류나 런타임 오류들은 언제든지 발생할 수 있지만 개발자가 이런 오류를 모두 예측하는것은 거의 불가능에 가깝다.

> **프런트엔드 모니터링**이란 <br>
> 프런트엔드 모니터링은 웹 사이트 또는 앱의 성능을 추적하는 데 사용되는 일련의 프로세스 및 도구. <br>
> 프런트엔드 모니터링은 주로 사용자가 최종적으로 보는 부분에 중. 여기에는 다음과 같은 문제가 포함됩니다. <br>
> - 느린 렌더링
> - 일관되지 않거나 응답하지 않는 사용자 경험
> - 네트워크 요청/API 오류
> - 프레임워크 관련 문제

> **프런트엔드 모니터링의 중요성**<br>
> 웹 사이트가 더욱 강력해지고 복잡해짐에 따라 성능 유지 관리가 점점 더 어려워지고 있다.<br>
> 프런트엔드 성능은 사용자 경험의 일부이다다. <br>
> 때때로 사용자는 웹사이트에서 처음 보고 경험하는 것을 기반으로 그 기업의 품질을 평가한다. <br>
> 사이트가 중단되거나 오류가 발생한다면 웹사이트의 신뢰와 신뢰성이 상실될 수 있다. <br>
> 따라서 프런트엔드 모니터링은 견고한 웹 사이트와 앱을 개발하는 데 필수적인 부분이다.<br>
  
## 3.1 Sentry의 기능
- 로그에 대해 다양한 정보를 제공하고 이벤트별, 타임라인으로 얼마나 많은 이벤트가 발생하는지 알 수 있고 설정에 따라 알림을 받을 수 있다. 
- 그리고 로그를 수집하는데서 그치지 않고 발생한 로그들을 시각화 도구로 쉽게 분석할 수 있도록 도와줌.
  
## 3.2 Sentry의 특징

### 3.2.1 이벤트 로그에 대한 다양한 정보 제공
> Sentry는 발생한 이벤트 로그에 대하여 다양한 정보를 제공한다.

- Exception & Message: 이벤트 로그 메시지 및 코드 라인 정보 (source map 설정을 해야 정확한 코드라인을 파악할 수 있습니다.)
- Device: 이벤트 발생 장비 정보 (name, family, model, memory 등)
- Browser: 이벤트 발생 브라우저 정보 (name, version 등)
- OS: 이벤트 발생 OS 정보 (name, version, build, kernelVersion 등)
- Breadcrumbs: 이벤트 발생 과정 

Context 기능으로 기본적으로 제공되는 정보 외에 특정 이벤트에 대한 추가 정보를 수집할 수도 있다.

### 3.2.2 비슷한 오류 통합
> Sentry는 Issue Grouping 기능으로 비슷한 이벤트 로그를 하나의 이슈로 통합한다. 이는 비슷한 오류를 파악하고 추적하는 데 큰 도움이 됨.

### 3.2.3 다양한 플랫폼 지원
> 프론트엔드 뿐만 아니라 .NET, Android, Apple(Cocoa), Go, Java, Kotlin, Python 등의 다양한 플랫폼을 지원

### 3.2.4 다양한 알림 채널 지원
> 발생한 이슈에 대해 실시간으로 알림을 받을 수 있도록 Slack, Teams, Jira, GitHub 등 다양한 채널을 지원

## 3.3 Install & Run
### 3.3.1 [Sentry](https://sentry.io/)에 접속 후 회원가입을 한 후
![화면 캡처 2023-02-02 144844](https://user-images.githubusercontent.com/103430498/216242549-5657f9a5-5d22-49ba-b0e5-3e9f7eb6f711.png)
### 3.3.2. 위와 같이 React 프로젝트를 생성한다.
### 3.3.3. Sentry 사용에 필요한 패키지를 설치한다. Sentry는 애플리케이션 런타임 내에서 SDK를 사용하여 데이터를 캡쳐하기 때문에 패키지 설치를 해야함
```
> npm install --save @sentry/react @sentry/tracing
```
- `@Sentry/browser`에서 사용 가능한 모든 메소드는 `@Sentry/react`에서 가져올 수 있다.
### 3.3.4. Configure
```javascript
import * as Sentry from '@Sentry/react';
import { BrowserTracing } from '@Sentry/tracing';
Sentry.init({
  dsn: 'dsn key', // dsn key 붙여넣으세요.
  release: 'release version',
  environment: 'production',
  normalizeDepth: 6,
  integrations: [
    new Sentry.Integrations.Breadcrumbs({ console: true }),
    new BrowserTracing(),
  ],
});
```
> Sentry 설정에 필요한 기본 정보
> - dsn: 이벤트를 전송하기 위한 식별 키
> - release: 애플리케이션 버전 (보통 package.json에 명시한 버전을 사용합니다. 이는 버전별 오류 추적을 용이하게 한다.)
> - environment: 애플리케이션 환경 (dev, production 등)
> - normalizeDepth: 컨텍스트 데이터를 주어진 깊이로 정규화 (기본값: 3)
> - integrations: 플랫폼 SDK별 통합 구성 설정 (React의 경우 react-router integration 설정 가능)

- hooks 설정도 지원하고 있는데, Sentry에 이벤트를 전송하기 전에 이벤트를 선택적으로 수정해서 데이터를 보낼 수 있는 beforeSend와 같은 옵션도 제공함
- 추가적으로 React SDK는 자동으로 JavaScript 오류를 탐지하고 Sentry로 전송할 수 있도록 Error Boundary 컴포넌트를 제공하며 다음과 같이 사용할 수 있다.
```javascript
import React from 'react';
import * as Sentry from '@Sentry/react';

<Sentry.ErrorBoundary
  fallback={<p>에러가 발생하였습니다. 잠시 후 다시 시도해주세요.</p>}
>
  <Example />
</Sentry.ErrorBoundary>;
```
> 샘플 비율(SampleRate) 정보
> 테스트하는 동안, tracesSampleRate를 1.0으로 유지해도 됨. 이것은 브라우저에서 수행된 모든 작업이 Sentry에 트랜잭션으로 전송됨을 의미.
> 프로덕션에서 Sentry의 트랜잭션 할당량에 도달하지 않고 균일한 샘플 데이터 크기를 수집하려면 이 값을 낮춰야 함.
> 또는 샘플 데이터를 동적으로 수집하기 위해 traceSampler를 사용하여 이러한 트랜잭션을 필터링할 수 있다.

- Error 확인
![화면 캡처 2023-02-02 153635](https://user-images.githubusercontent.com/103430498/216250099-bb3bd8e6-ac46-4895-95bc-57d278b3873a.png)



### 3.3.5 Capture errors
- Sentry는 captureException과 captureMessage 두 가지 이벤트 전송 API를 제공. 두 API는 다음과 같은 특성을 가지고 있다.
  - **captureException** : error 객체나 문자열 전송 가능
  ```javascript
    try {
    aFunctionThatMightFail();
  } catch (err) {
    Sentry.captureException(err);
  }
  ```
  - **captureMessage** : 문자열 전송 가능
  ```javascript
  Sentry.captureMessage('에러가 발생하였습니다!');
  ```
### 3.3.6 성능 모니터링 활성화
- 오류 추적 외에도 export문에서 App 컴포넌트에 Sentry.withProfiler()를 감싸주어 Sentry 대시보드에서 성능 모니터링을 활성화할 수 있다.
```javascript
export default Sentry.withProfiler(App);
```
- 성능 탭으로 이동하여 FCP(최초로 컨텐츠를 볼 수 있는 페인트 단계), API 요청의 대기 시간 또는 중단되는 시간 등과 같은 중요한 항목을 모니터링하고 측정

![화면 캡처 2023-02-02 151825](https://user-images.githubusercontent.com/103430498/216247030-d2604cc2-c991-4976-bf3c-b0ec40409411.png)



### 3.3.7 captureException
- 이렇게 에러가 발생 했을 때 Sentry 쪽으로 전달이 되는 것은 개발모드일땐 별도의 작업을 하지 않아도 잘 되지만, <br>
나중에 프로젝트를 완성하여 실제 배포를 하게 됐을 때는 componentDidCatch 로 이미 에러를 잡아줬을 경우 Sentry 에게 자동으로 전달이 되지 않는다.

```javascript
// 
import React, { Component } from "react";
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
  state = {
    error: false,
  };
  componentDidCatch(error, info) {
      console.log("에러가 발생했습니다.");
      console.log({
        error,
        info,
      });
      this.setState({
        error: true,
      });
      if (process.env.NODE_ENV === 'production') {
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
```

- componentDidCatch 에서 process.env.NODE_ENV 값을 조회했는데요, 이를 통하여 현재 환경에 개발 환경인지 프로덕션 환경인지 (production / development) 확인 할 수 있다. 
- 개발 환경에서는 captureException 을 사용 할 필요가 없으므로 프로덕션에서만 이 작업을 해줌.

## 3.4 프로덕션 환경에서 잘 작동하는지 확인하기
- 프로덕션 환경에서도 잘 작동하는지 확인하기 위해서는 프로젝트를 빌드해주어야 함. 프로젝트 디렉터리에서 다음 명령어를 실행.
```bash
> npm run build
```
- 조금 기다리면 결과물이 build 디렉터리에 나타나는데, build 디렉터리에 있는 파일들을 제공하는 서버를 실행하기 위해서는 다음 명령어를 실행.
```bash
> npx serve ./build
```
- serve 는 웹서버를 열어서 특정 디렉터리에 있는 파일을 제공해주는 도구.
- http://localhost:3000/ 을 브라우저로 들어가본 뒤, Sentry 에 새로운 항목이 추가됐는지 확인

![화면 캡처 2023-02-02 153832](https://user-images.githubusercontent.com/103430498/216250392-6e724508-1b4e-4a45-a7cd-5d72e6eac6e6.png)

- 에러가 어디서 발생했는지 상세한 정보를 알아보기 쉽지않음
- 이는, 빌드 과정에서 코드가 minify 되면서 이름이 c, Xo, Ui, qa 이런식으로 축소됐기 때문


