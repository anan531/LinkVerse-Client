import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleAccept = (connectionId) => {
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:5000/api/connections/${connectionId}/accept`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Connection request accepted") {
          setRequests(
            requests.filter(
              (request) => request._id !== connectionId
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = (connectionId) => {
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:5000/api/connections/${connectionId}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Connection request rejected") {
          setRequests(
            requests.filter(
              (request) => request._id !== connectionId
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRequests(data.requests || []);
        })
        .catch((error) => {
          console.error(
            "Error fetching connection requests:",
            error
          );
        });
    }
  }, []);

  const features = [
    {
      title: "Discover Students",
      description: "Find students with similar interests and skills.",
      icon: "⌕",
      path: "/discover-students",
    },
    {
      title: "Connections",
      description: "Build your academic and professional network.",
      icon: "◈",
      path: "/connections",
    },
    {
      title: "Collaboration Hub",
      description: "Find projects, teams and collaboration opportunities.",
      icon: "✦",
      path: "/collaborations",
    },
    {
      title: "Messages",
      description: "Connect privately with other students.",
      icon: "◌",
      path: "/chat",
    },
    {
      title: "Opportunities",
      description: "Explore internships, workshops and opportunities.",
      icon: "◎",
      path: "/opportunities",
    },
    {
      title: "Student Feed",
      description: "Share updates with your student community.",
      icon: "▤",
      path: "/feed",
    },
    {
      title: "My Profile",
      description: "Manage your profile, skills and interests.",
      icon: "○",
      path: "/profile",
    },
  ];

  return (
    <div className="dashboard">

      {/* Background decoration */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">L</div>

          <div>
            <h1>LinkVerse</h1>
            <span>Student Network</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="nav-label">MAIN</p>

          <button
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/discover-students")}
          >
            <span>⌕</span>
            Discover
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/connections")}
          >
            <span>◈</span>
            Connections
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/collaborations")}
          >
            <span>✦</span>
            Collaborate
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/chat")}
          >
            <span>◌</span>
            Messages
          </button>

          <p className="nav-label second-label">EXPLORE</p>

          <button
            className="nav-item"
            onClick={() => navigate("/opportunities")}
          >
            <span>◎</span>
            Opportunities
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/feed")}
          >
            <span>▤</span>
            Student Feed
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            <span>○</span>
            My Profile
          </button>

        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {user ? (
          <>

            {/* Top bar */}
            <div className="topbar">
              <div>
                <p className="page-label">STUDENT DASHBOARD</p>
                <h2>Welcome back, {user.name}</h2>
              </div>

              <div className="profile-mini">
                <div className="profile-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <section className="hero-card">

              <div className="hero-content">

                <div className="hero-tag">
                  YOUR DIGITAL CAMPUS
                </div>

                <h1>
                  Connect.
                  <br />
                  Collaborate.
                  <br />
                  <span>Grow together.</span>
                </h1>

                <p>
                  Discover people, opportunities and
                  collaborations that move your student journey
                  forward.
                </p>

                <button
                  className="hero-button"
                  onClick={() => navigate("/discover-students")}
                >
                  Discover Students
                  <span>→</span>
                </button>

              </div>

              <div className="hero-visual">

                <div className="orbit orbit-one"></div>
                <div className="orbit orbit-two"></div>

                <div className="hero-orb">
                  <span>L</span>
                </div>

                <div className="floating-card card-one">
                  <span>✦</span>
                  Collaboration
                </div>

                <div className="floating-card card-two">
                  <span>◈</span>
                  Connections
                </div>

                <div className="floating-card card-three">
                  <span>◎</span>
                  Opportunities
                </div>

              </div>

            </section>

            {/* Explore */}
            <section className="explore-section">

              <div className="section-title">
                <div>
                  <p>EXPLORE</p>
                  <h2>Your LinkVerse</h2>
                </div>

                <span>
                  Everything in one place
                </span>
              </div>

              <div className="feature-grid">

                {features.map((feature) => (
                  <div
                    className="feature-card"
                    key={feature.path}
                    onClick={() => navigate(feature.path)}
                  >

                    <div className="feature-top">
                      <div className="feature-icon">
                        {feature.icon}
                      </div>

                      <span className="arrow">
                        ↗
                      </span>
                    </div>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                  </div>
                ))}

              </div>

            </section>

            {/* Connection Requests */}
            <section className="requests-section">

              <div className="section-title">
                <div>
                  <p>NETWORK</p>
                  <h2>Connection Requests</h2>
                </div>

                <span>
                  {requests.length} pending
                </span>
              </div>

              {requests.length === 0 ? (

                <div className="empty-state">
                  <div className="empty-icon">◈</div>
                  <h3>Your network is waiting</h3>
                  <p>
                    No pending connection requests at the moment.
                  </p>
                </div>

              ) : (

                <div className="request-grid">

                  {requests.map((request) => (

                    <div
                      className="request-card"
                      key={request._id}
                    >

                      <div className="request-avatar">
                        {request.sender.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="request-info">

                        <h3>{request.sender.name}</h3>

                        <p>{request.sender.email}</p>

                        <span>
                          wants to connect with you
                        </span>

                        <div className="request-buttons">

                          <button
                            className="accept"
                            onClick={() =>
                              handleAccept(request._id)
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="reject"
                            onClick={() =>
                              handleReject(request._id)
                            }
                          >
                            Decline
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </>
        ) : (
          <div className="loading">
            Loading LinkVerse...
          </div>
        )}

      </main>

    </div>
  );
}

export default Dashboard;