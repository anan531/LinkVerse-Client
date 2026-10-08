import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    setUser(storedUser);

    const token = localStorage.getItem("token");

    if (!token) return;

    // Connections
    fetch("http://localhost:5000/api/connections/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setConnections(data.connections || []);
      })
      .catch((error) => {
        console.error(
          "Error fetching connections:",
          error
        );
      });

    // Requests
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
          "Error fetching requests:",
          error
        );
      });

    // Collaborations
    fetch("http://localhost:5000/api/collaborations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCollaborations(
          data.collaborations || data || []
        );
      })
      .catch((error) => {
        console.error(
          "Error fetching collaborations:",
          error
        );
      });

    // Opportunities
    fetch("http://localhost:5000/api/opportunities")
      .then((response) => response.json())
      .then((data) => {
        setOpportunities(
          data.opportunities || data || []
        );
      })
      .catch((error) => {
        console.error(
          "Error fetching opportunities:",
          error
        );
      });

    // AI Recommendations
    fetch("http://localhost:5000/api/recommendations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(
          data.recommendations || []
        );
      })
      .catch((error) => {
        console.error(
          "Error fetching recommendations:",
          error
        );
      });
  }, []);

  const getInitial = (name) => {
    if (!name) return "U";

    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard">

      <main className="main-content">

        {/* =========================================
            KEEPING ORIGINAL TOP BAR
        ========================================= */}

<header className="student-topbar">

  <div className="student-topbar-left">

    <p>
      STUDENT DASHBOARD
    </p>

    <h1>
      Welcome back, {user?.name || "Student"}
    </h1>

  </div>


  {user && (
    <div className="student-profile">

      <div className="student-profile-avatar">
        {getInitial(user.name)}
      </div>

      <div className="student-profile-info">

        <strong>
          {user.name}
        </strong>

        <span>
          student
        </span>

      </div>

    </div>
  )}

</header>


        {/* =========================================
            ORIGINAL BANNER
            DO NOT CHANGE
        ========================================= */}

       <section className="hero-card">

  <div className="hero-content">

    <p className="hero-tag">
      YOUR DIGITAL CAMPUS
    </p>

    <h1>
      Connect.
      <br />
      Collaborate.
      <br />
      <span>Grow together.</span>
    </h1>

    <p>
      Discover people, opportunities and
      collaborations that move your
      student journey forward.
    </p>



  </div>


  {/* =====================================
      ORIGINAL HERO VISUAL
  ===================================== */}

  <div className="hero-visual">

    <div className="orbit orbit-one"></div>

    <div className="orbit orbit-two"></div>


    <div className="hero-orb">

      <span>
        L
      </span>

    </div>


    <div className="floating-card card-one">

      <span>
        ✦
      </span>

      Collaboration

    </div>


    <div className="floating-card card-two">

      <span>
        ◉
      </span>

      Opportunities

    </div>


    <div className="floating-card card-three">

      <span>
        ◇
      </span>

      Connections

    </div>

  </div>

</section>


        {/* =================================================
            EVERYTHING BELOW HERE IS THE NEW STUDENT DASHBOARD
        ================================================= */}


        {/* =========================================
            OVERVIEW
        ========================================= */}

        <section className="student-overview">

          <div className="student-section-heading">

            <div>

              <p>
                OVERVIEW
              </p>

              <h2>
                Your LinkVerse at a glance
              </h2>

            </div>

            <span>
              LIVE SUMMARY
            </span>

          </div>


          <div className="student-stat-grid">

            <div className="student-stat">

              <span className="student-stat-number">
                {connections.length}
              </span>

              <span className="student-stat-label">
                Connections
              </span>

            </div>


            <div className="student-stat">

              <span className="student-stat-number">
                {requests.length}
              </span>

              <span className="student-stat-label">
                Requests
              </span>

            </div>


            <div className="student-stat">

              <span className="student-stat-number">
                {collaborations.length}
              </span>

              <span className="student-stat-label">
                Projects
              </span>

            </div>


            <div className="student-stat">

              <span className="student-stat-number">
                {opportunities.length}
              </span>

              <span className="student-stat-label">
                Opportunities
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            NETWORK PULSE + OPPORTUNITY RADAR
        ========================================= */}

        <section className="student-dashboard-grid">


          {/* NETWORK PULSE */}

          <div className="student-dashboard-card">

            <div className="student-card-heading">

              <div>

                <p>
                  NETWORK PULSE
                </p>

                <h2>
                  Your network
                </h2>

              </div>

              <span className="student-card-symbol">
                ◇
              </span>

            </div>


            <div className="network-pulse">

              <div className="pulse-row">

                <span>
                  Students in your network
                </span>

                <strong>
                  {connections.length}
                </strong>

              </div>


              <div className="pulse-row">

                <span>
                  Pending requests
                </span>

                <strong>
                  {requests.length}
                </strong>

              </div>


              <div className="pulse-row">

                <span>
                  Active collaborations
                </span>

                <strong>
                  {collaborations.length}
                </strong>

              </div>

            </div>


            <button
              className="student-text-button"
              onClick={() =>
                navigate("/discover-students")
              }
            >
              Grow your network →
            </button>

          </div>


          {/* OPPORTUNITY RADAR */}

          <div className="student-dashboard-card">

            <div className="student-card-heading">

              <div>

                <p>
                  OPPORTUNITY RADAR
                </p>

                <h2>
                  What's open now
                </h2>

              </div>

              <span className="student-card-symbol">
                ✦
              </span>

            </div>


            <div className="opportunity-radar">

              {opportunities.length === 0 ? (

                <p className="student-muted">
                  No opportunities available.
                </p>

              ) : (

                opportunities
                  .slice(0, 3)
                  .map((opportunity) => (

                    <div
                      className="radar-item"
                      key={opportunity._id}
                    >

                      <div>

                        <strong>
                          {opportunity.title}
                        </strong>

                        <span>
                          {opportunity.type}
                        </span>

                      </div>

                      {opportunity.deadline && (

                        <small>
                          {opportunity.deadline}
                        </small>

                      )}

                    </div>

                  ))
              )}

            </div>


            <button
              className="student-text-button"
              onClick={() =>
                navigate("/opportunities")
              }
            >
              Explore opportunities →
            </button>

          </div>

        </section>


        {/* =========================================
            AI PICKS + UPCOMING
        ========================================= */}

        <section className="student-dashboard-grid">


          {/* AI PICKS */}

          <div className="student-dashboard-card">

            <div className="student-card-heading">

              <div>

                <p>
                  AI PICKS
                </p>

                <h2>
                  Students you may know
                </h2>

              </div>

              <span className="student-card-symbol">
                AI
              </span>

            </div>


            <div className="ai-picks">

              {recommendations.length === 0 ? (

                <p className="student-muted">
                  No recommendations available.
                </p>

              ) : (

                recommendations
                  .slice(0, 2)
                  .map((recommendation) => (

                    <div
                      className="ai-pick"
                      key={recommendation.student._id}
                    >

                      <div className="ai-avatar">
                        {getInitial(
                          recommendation.student.name
                        )}
                      </div>

                      <div>

                        <strong>
                          {recommendation.student.name}
                        </strong>

                        <span>
                          {recommendation.matchScore}%
                          match
                        </span>

                      </div>

                    </div>

                  ))
              )}

            </div>


            <button
              className="student-text-button"
              onClick={() =>
                navigate("/recommendations")
              }
            >
              See all recommendations →
            </button>

          </div>


          {/* UPCOMING */}

          <div className="student-dashboard-card">

            <div className="student-card-heading">

              <div>

                <p>
                  UPCOMING
                </p>

                <h2>
                  Don't miss out
                </h2>

              </div>

              <span className="student-card-symbol">
                ◷
              </span>

            </div>


            <div className="upcoming-list">

              {opportunities.length === 0 ? (

                <p className="student-muted">
                  Nothing upcoming.
                </p>

              ) : (

                opportunities
                  .slice(0, 3)
                  .map((opportunity) => (

                    <div
                      className="upcoming-item"
                      key={opportunity._id}
                    >

                      <div className="upcoming-date">

                        <span>
                          {opportunity.deadline
                            ? opportunity.deadline
                                .split("-")[2]
                            : "—"}
                        </span>

                      </div>

                      <div>


                        <span>
                          {opportunity.organization}
                        </span>

                        <strong>
                          {opportunity.title}
                        </strong>



                      </div>

                    </div>

                  ))
              )}

            </div>

          </div>

        </section>


        {/* =========================================
            LINKVERSE ACTIVITY
        ========================================= */}

        <section className="student-activity-card">

          <div className="student-section-heading">

            <div>

              <p>
                YOUR LINKVERSE
              </p>

              <h2>
                Activity snapshot
              </h2>

            </div>

          </div>


          <div className="student-activity-grid">

            <div className="activity-stat">

              <span className="activity-dot"></span>

              <div>

                <strong>
                  {connections.length}
                </strong>

                <span>
                  connections in your network
                </span>

              </div>

            </div>


            <div className="activity-stat">

              <span className="activity-dot"></span>

              <div>

                <strong>
                  {collaborations.length}
                </strong>

                <span>
                  collaboration projects available
                </span>

              </div>

            </div>


            <div className="activity-stat">

              <span className="activity-dot"></span>

              <div>

                <strong>
                  {opportunities.length}
                </strong>

                <span>
                  opportunities currently open
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;