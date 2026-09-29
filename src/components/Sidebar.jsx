import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

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

            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>

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