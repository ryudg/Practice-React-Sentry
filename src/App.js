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
