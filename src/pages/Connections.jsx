import { useEffect, useState } from "react";
import "./Connections.css";

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
    <div className="connections-page">

      {/* TOP BAR */}

      <header className="connections-topbar">

        <div className="connections-logo">
          <div className="connections-logo-box">L</div>
          <span>LinkVerse</span>
        </div>

        <div className="connections-topbar-text">
          My Network
        </div>

      </header>


      {/* HERO */}

      <section className="connections-hero">

        <div className="connections-hero-content">

          <p className="connections-eyebrow">
            LINKVERSE NETWORK
          </p>

          <h1>
            My Connections
          </h1>

          <p className="connections-description">
            View the students you are connected with and
            stay connected with your growing network.
          </p>

        </div>

      </section>


      {/* MAIN */}

      <main className="connections-main">

        <div className="connections-results-header">

          <div>
            <h2>Your Network</h2>

            <p>
              Students you have connected with
            </p>
          </div>

          <div className="connections-count">
            {connections.length}
          </div>

        </div>


        {/* CONNECTIONS */}

        {connections.length === 0 ? (

          <div className="connections-empty">

            <div className="connections-empty-icon">
              +
            </div>

            <h3>No connections yet</h3>

            <p>
              Start discovering students and send connection
              requests to grow your network.
            </p>

          </div>

        ) : (

          <div className="connections-grid">

            {connections.map((connection) => {

              const currentUser =
                JSON.parse(localStorage.getItem("user"));

              const currentUserId =
                currentUser?.id || currentUser?._id;

              const otherUser =
                connection.sender._id === currentUserId
                  ? connection.receiver
                  : connection.sender;

              return (

                <div
                  className="connection-card"
                  key={connection._id}
                >

                  {/* USER HEADER */}

                  <div className="connection-card-header">

                    <div className="connection-avatar">
                      {otherUser.name
                        ? otherUser.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div className="connection-user-info">

                      <h3>
                        {otherUser.name}
                      </h3>

                      <span>
                        Connected Student
                      </span>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="connection-details">

                    <div className="connection-detail">

                      <span>
                        EMAIL
                      </span>

                      <p>
                        {otherUser.email}
                      </p>

                    </div>

                  </div>


                  {/* STATUS */}

                  <div className="connection-status">

                    <span className="connection-status-dot"></span>

                    <span>
                      Connected
                    </span>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </main>

    </div>
  );
}

export default Connections;