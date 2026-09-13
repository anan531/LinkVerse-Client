import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");

  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

const handleAccept = (connectionId) => {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5000/api/connections/${connectionId}/accept`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.message === "Connection request accepted") {
        setRequests(
          requests.filter((request) => request._id !== connectionId)
        );
      }
    })
    .catch((error) => {
      console.error("Error accepting connection request:", error);
    });
};

const handleReject = (connectionId) => {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5000/api/connections/${connectionId}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.message === "Connection request rejected") {
        setRequests(
          requests.filter((request) => request._id !== connectionId)
        );
      }
    })
    .catch((error) => {
      console.error("Error rejecting connection request:", error);
    });
};


  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  const token = localStorage.getItem("token");

  if (token) {
    fetch("http://localhost:5000/api/connections/requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRequests(data.requests);
      })
      .catch((error) => {
        console.error("Error fetching connection requests:", error);
      });
  }
}, []);

  return (
    <div>
      <h1>LinkVerse</h1>

      {user ? (
        <>
          <h2>Welcome, {user.name}! 👋</h2>

          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>

          <hr />

          <h3>Student Dashboard</h3>

          <div>
<button onClick={() => navigate("/discover-students")}>
  Discover Students
</button>

<button onClick={() => navigate("/connections")}>
  Connections
</button>

<button>Messages</button>

<button>Opportunities</button>

<button onClick={() => navigate("/profile")}>
  My Profile
</button>
          </div>

          <hr />

<h3>Connection Requests</h3>

{requests.length === 0 ? (
  <p>No pending connection requests.</p>
) : (
  requests.map((request) => (
    <div key={request._id}>
      <p>
        <strong>{request.sender.name}</strong> sent you a connection request.
      </p>

      <p>Email: {request.sender.email}</p>

        <button onClick={() => handleAccept(request._id)}>Accept</button>
        <button onClick={() => handleReject(request._id)}>Reject</button>
    </div>
  ))
)}

          <br />

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;