import { useEffect, useState } from "react";
import "./DiscoverStudents.css";

function DiscoverStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);

useEffect(() => {
  const fetchStudentsAndRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch students
      const studentsResponse = await fetch(
        "http://localhost:5000/api/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const studentsData = await studentsResponse.json();

      if (!studentsResponse.ok) {
        throw new Error(
          studentsData.message || "Unable to fetch students"
        );
      }

      setStudents(studentsData.students);

    } catch (error) {
      console.error("Students fetch error:", error);
      alert(error.message || "Unable to fetch students");
    }

    try {
      // Fetch requests sent by current user
      const requestsResponse = await fetch(
        "http://localhost:5000/api/connections/sent-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const requestsData = await requestsResponse.json();

      if (requestsResponse.ok) {
        const sentUserIds = requestsData.requests.map(
          (request) => request.receiver._id
        );

        setSentRequests(sentUserIds);
      } else {
        console.error(
          "Sent requests error:",
          requestsData.message
        );
      }

    } catch (error) {
      console.error("Sent requests fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStudentsAndRequests();
}, []);

const handleConnect = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/connections/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Mark this student as having a request sent
      setSentRequests((previous) => [
        ...previous,
        userId,
      ]);

      alert("Connection request sent successfully");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Unable to send connection request");
  }
};

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(searchText) ||
      student.course?.toLowerCase().includes(searchText) ||
      student.college?.toLowerCase().includes(searchText) ||
      student.skills?.some((skill) =>
        skill.toLowerCase().includes(searchText)
      ) ||
      student.interests?.some((interest) =>
        interest.toLowerCase().includes(searchText)
      )
    );
  });

  if (loading) {
    return (
      <div className="discover-loading">
        <div className="discover-loading-box">
          Loading students...
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">

      {/* HEADER */}

      <header className="discover-topbar">

        <div className="discover-logo">
          <div className="discover-logo-box">L</div>
          <span>LinkVerse</span>
        </div>

        <div className="discover-topbar-text">
          Student Network
        </div>

      </header>


      {/* HERO */}

      <section className="discover-hero">

        <div className="discover-hero-content">

          <p className="discover-eyebrow">
            LINKVERSE NETWORK
          </p>

          <h1>
            Discover Students
          </h1>

          <p className="discover-description">
            Connect with students, explore their skills and interests,
            and build meaningful connections.
          </p>

        </div>

      </section>


      {/* MAIN */}

      <main className="discover-main">

        {/* SEARCH */}

        <div className="discover-search-card">

          <div className="discover-search-label">
            Find students
          </div>

          <input
            className="discover-search"
            type="text"
            placeholder="Search by name, course, college, skill or interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        {/* RESULTS HEADER */}

        <div className="discover-results-header">

          <div>
            <h2>Students</h2>

            <p>
              {search
                ? `Showing results for "${search}"`
                : "Explore students in the LinkVerse community"}
            </p>
          </div>

          <div className="discover-count">
            {filteredStudents.length}
          </div>

        </div>


        {/* STUDENTS */}

        {filteredStudents.length === 0 ? (

          <div className="discover-empty">

            <div className="discover-empty-icon">
              ?
            </div>

            <h3>No students found</h3>

            <p>
              Try searching with another name, course,
              skill or interest.
            </p>

          </div>

        ) : (

          <div className="discover-grid">

            {filteredStudents.map((student) => (

              <div
                className="discover-card"
                key={student._id}
              >

                {/* CARD HEADER */}

                <div className="discover-card-header">

                  <div className="discover-avatar">
                    {student.name
                      ? student.name.charAt(0).toUpperCase()
                      : "S"}
                  </div>

                  <div className="discover-user-info">

                    <h3>
                      {student.name}
                    </h3>

                    <p>
                      {student.course || "Student"}
                    </p>

                  </div>

                </div>


 {/* COLLEGE / DEPARTMENT / YEAR */}

<div className="discover-basic-info">

  <div>
    <span>COLLEGE</span>
    <p>
      {student.college || "Not specified"}
    </p>
  </div>

  <div>
    <span>DEPARTMENT</span>
    <p>
      {student.department || "Not specified"}
    </p>
  </div>

  <div>
    <span>YEAR</span>
    <p>
      {student.year || "Not specified"}
    </p>
  </div>

</div>


                {/* BIO */}

                <div className="discover-info-section">

                  <span>ABOUT</span>

                  <p>
                    {student.bio || "No bio added"}
                  </p>

                </div>


                {/* SKILLS */}

                <div className="discover-info-section">

                  <span>SKILLS</span>

                  <div className="discover-tags">

                    {student.skills?.length > 0 ? (

                      student.skills.map((skill, index) => (

                        <span
                          className="discover-tag"
                          key={index}
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <p>No skills added</p>

                    )}

                  </div>

                </div>


                {/* INTERESTS */}

                <div className="discover-info-section">

                  <span>INTERESTS</span>

                  <div className="discover-tags">

                    {student.interests?.length > 0 ? (

                      student.interests.map(
                        (interest, index) => (

                          <span
                            className="discover-tag discover-interest"
                            key={index}
                          >
                            {interest}
                          </span>

                        )
                      )

                    ) : (

                      <p>No interests added</p>

                    )}

                  </div>

                </div>


                {/* CONNECT */}
<button
  className={`discover-connect ${
    sentRequests.includes(student._id)
      ? "request-sent"
      : ""
  }`}
  onClick={() => handleConnect(student._id)}
  disabled={sentRequests.includes(student._id)}
>
  {sentRequests.includes(student._id)
    ? "Request Sent ✓"
    : "Connect"}
</button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default DiscoverStudents;