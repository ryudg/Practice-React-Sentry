import React from "react";

// 예시 : 1
// function User({ user }) {
//   if (!user) {
//     return null;
//   }

//   return (
//     <div>
//       <div>
//         <b>ID</b> : {user.id}
//       </div>
//       <div>
//         <b>Username : </b> {user.username}
//       </div>
//     </div>
//   );
// }

// 예시 : 2
// function Users({ users }) {
//   if (!users) return null;
//   return (
//     <ul>
//       {users.map((user) => (
//         <li key={user.id}>{user.username}</li>
//       ))}
//     </ul>
//   );
// }

// 예시 : 3
function Users({ users, onToggle }) {
  if (!users) return null;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onClick={() => onToggle(user.id)}>
          {user.username}
        </li>
      ))}
    </ul>
  );
}

Users.defaultProps = {
  onToggle: () => {
    console.warn("onToggle is missing!");
  },
};

export default Users;
