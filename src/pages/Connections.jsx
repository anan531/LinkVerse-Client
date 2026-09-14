import { useEffect, useState } from "react";

function Connections() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/connections/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setConnections(data.connections);
        })
        .catch((error) => {
          console.error("Error fetching connections:", error);
        });
    }
  }, []);

  return (
    <div>
      <h1>My Connections</h1>

      {connections.length === 0 ? (
        <p>No connections yet.</p>
      ) : (
connections.map((connection) => {
  const currentUserId = JSON.parse(localStorage.getItem("user")).id;

  const otherUser =
    connection.sender._id === currentUserId
      ? connection.receiver
      : connection.sender;

  return (
    <div key={connection._id}>
      <h3>{otherUser.name}</h3>

      <p>Email: {otherUser.email}</p>

      <hr />
    </div>
  );
})
      )}
    </div>
  );
}

export default Connections;