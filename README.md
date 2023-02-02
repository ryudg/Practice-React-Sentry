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

# 2. Sentry
  
  
  
  
  
  
  
  
