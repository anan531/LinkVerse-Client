import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

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
            <button>Discover Students</button>
            <button>Connections</button>
            <button>Messages</button>
            <button>Opportunities</button>
            <button>My Profile</button>
          </div>

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