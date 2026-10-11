import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const [connectionRequestCount, setConnectionRequestCount] = useState(0);
  const [collaborationRequestCount, setCollaborationRequestCount] = useState(0);

  useEffect(() => {
    const fetchConnectionRequestCount = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/connections/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch connection requests");
        }

        const data = await response.json();
        setConnectionRequestCount(data.requests?.length || 0);
      } catch (error) {
        console.error("Error fetching connection request count:", error);
      }
    };

    fetchConnectionRequestCount();
  }, [location.pathname]);

  useEffect(() => {
    const fetchCollaborationRequestCount = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(

"http://localhost:5000/api/collaboration-requests/my-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collaboration requests");
        }

        const data = await response.json();

        setCollaborationRequestCount(
          Array.isArray(data) ? data.length : 0
        );
      } catch (error) {
        console.error(
          "Error fetching collaboration request count:",
          error
        );
      }
    };

    fetchCollaborationRequestCount();
  }, [location.pathname]);

  // Keep your existing menuItems, handleLogout, and return below.


  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "⌂",
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: "◯",
    },
    {
      label: "Discover Students",
      path: "/discover-students",
      icon: "◎",
    },
    {
      label: "Connections",
      path: "/connections",
      icon: "♧",
    },
    {
      label: "Collaboration Hub",
      path: "/collaborations",
      icon: "◇",
    },
    {
      label: "Messages",
      path: "/chat",
      icon: "▱",
    },
    {
      label: "Opportunities",
      path: "/opportunities",
      icon: "↗",
    },
    {
      label: "Student Feed",
      path: "/feed",
      icon: "▤",
    },
    {
      label: "AI Recommendations",
      path: "/recommendations",
      icon: "✦",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-box">L</div>

        <div>
          <h2>LinkVerse</h2>
          <span>Student Network</span>
        </div>
      </div>


      {/* User */}
      <div className="sidebar-user">

        <div className="sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">
          <strong>{user?.name || "Student"}</strong>
          <span>{user?.role === "admin" ? "Administrator" : "Student"}</span>
        </div>

      </div>


      {/* Navigation */}
      <nav className="sidebar-navigation">

        <p className="sidebar-heading">
          MAIN MENU
        </p>

        {menuItems.map((item) => (

          <button
            key={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >


<span className="sidebar-icon">{item.icon}</span>

<span className="sidebar-item-label">
  {item.label}
</span>

{item.label === "Connections" &&
  connectionRequestCount > 0 && (
    <span className="sidebar-badge">
      {connectionRequestCount}
    </span>
  )}

{item.label === "Collaboration Hub" &&
  collaborationRequestCount > 0 && (
    <span className="sidebar-badge">
      {collaborationRequestCount}
    </span>
  )}


          </button>

        ))}

      </nav>


      {/* Bottom */}
      <div className="sidebar-bottom">

        <button
          className="sidebar-home-button"
          onClick={() => navigate("/")}
        >
          <span className="sidebar-icon">⌂</span>
          Home
        </button>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;