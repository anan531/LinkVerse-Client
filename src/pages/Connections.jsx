import { useEffect, useState } from "react";
import "./Connections.css";

function Connections() {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    // Fetch accepted connections
    fetch("http://localhost:5000/api/connections/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Connections:", data);
        setConnections(data.connections || []);
      })
      .catch((error) => {
        console.error(
          "Error fetching connections:",
          error
        );
      });


    // Fetch pending connection requests
    fetch(
      "http://localhost:5000/api/connections/requests",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Connection Requests:", data);
        setRequests(data.requests || []);
      })
      .catch((error) => {
        console.error(
          "Error fetching connection requests:",
          error
        );
      });

  }, []);


  // Accept connection request

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

        if (
          data.message ===
          "Connection request accepted"
        ) {

          // Remove from pending requests
          setRequests(
            requests.filter(
              (request) =>
                request._id !== connectionId
            )
          );


          // Add the newly accepted connection
          setConnections([
            ...connections,
            data.connection,
          ]);

        }

      })
      .catch((error) => {
        console.error(
          "Error accepting request:",
          error
        );
      });

  };


  // Reject connection request

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

        if (
          data.message ===
          "Connection request rejected"
        ) {

          setRequests(
            requests.filter(
              (request) =>
                request._id !== connectionId
            )
          );

        }

      })
      .catch((error) => {
        console.error(
          "Error rejecting request:",
          error
        );
      });

  };


  return (
    <div className="connections-page">

      {/* TOP BAR */}

      <header className="connections-topbar">

        <div className="connections-logo">

          <div className="connections-logo-box">
            L
          </div>

          <span>
            LinkVerse
          </span>

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
            View your connection requests and stay
            connected with your growing network.
          </p>

        </div>

      </section>


      {/* MAIN */}

      <main className="connections-main">





        {/* =========================================
            MY CONNECTIONS
        ========================================= */}

        <div
          className="connections-results-header"
          style={{
            marginTop: "60px",
          }}
        >

          <div>

            <h2>
              My Connections
            </h2>

            <p>
              Students you have connected with
            </p>

          </div>

          <div className="connections-count">
            {connections.length}
          </div>

        </div>


        {connections.length === 0 ? (

          <div className="connections-empty">

            <div className="connections-empty-icon">
              +
            </div>

            <h3>
              No connections yet
            </h3>

            <p>
              Start discovering students and send
              connection requests to grow your network.
            </p>

          </div>

        ) : (

          <div className="connections-grid">

            {connections.map((connection) => {

              const currentUser =
                JSON.parse(
                  localStorage.getItem("user")
                );

              const currentUserId =
                currentUser?.id ||
                currentUser?._id;

              const otherUser =
                connection.sender._id ===
                currentUserId
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
                {/* =========================================
            CONNECTION REQUESTS
        ========================================= */}
<br></br>
<br></br>
<br></br>
        <div className="connections-results-header">

          <div>

            <h2>
              Connection Requests
            </h2>

            <p>
              Students who want to connect with you
            </p>

          </div>

          <div className="connections-count">
            {requests.length}
          </div>

        </div>


        {requests.length === 0 ? (

          <div className="connections-empty">

            <div className="connections-empty-icon">
              +
            </div>

            <h3>
              No pending requests
            </h3>

            <p>
              You do not have any connection requests
              at the moment.
            </p>

          </div>

        ) : (

          <div className="connections-grid">

            {requests.map((request) => (

              <div
                className="connection-card"
                key={request._id}
              >

                {/* REQUEST USER HEADER */}

                <div className="connection-card-header">

                  <div className="connection-avatar">

                    {request.sender.name
                      ? request.sender.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                  <div className="connection-user-info">

                    <h3>
                      {request.sender.name}
                    </h3>

                    <span>
                      Wants to connect with you
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
                      {request.sender.email}
                    </p>

                  </div>

                </div>


                {/* REQUEST ACTIONS */}

                <div
                  className="connection-request-actions"
                >

                  <button
                    className="connection-accept-btn"
                    onClick={() =>
                      handleAccept(request._id)
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="connection-reject-btn"
                    onClick={() =>
                      handleReject(request._id)
                    }
                  >
                    Decline
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Connections;