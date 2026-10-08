import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";

function Recommendations() {
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/recommendations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setRecommendations(data.recommendations || []);
        } else {
          setError(data.message || "Unable to load recommendations");
        }
      } catch (error) {
        console.error("Recommendation error:", error);
        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="recommendation-loading">
        <div className="recommendation-loading-card">
          <div className="recommendation-loading-icon">✧</div>
          <h3>Generating recommendations...</h3>
          <p>Analyzing student profiles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">

      {/* Header */}
      <header className="recommendations-header">

        <div>
          <p className="recommendations-eyebrow">
            AI POWERED
          </p>

          <h1>Student Recommendations</h1>

          <p>
            Discover students who share your skills,
            interests and academic background.
          </p>
        </div>

        <button
          className="recommendations-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>


      {/* Main */}
      <main className="recommendations-main">

        <div className="recommendations-intro">

          <div>
            <p>PERSONALIZED FOR YOU</p>
            <h2>People you may want to connect with</h2>
          </div>

          <span>
            {recommendations.length} recommendation
            {recommendations.length !== 1 ? "s" : ""}
          </span>

        </div>


        {error ? (

          <div className="recommendation-empty">
            <div className="recommendation-empty-icon">
              !
            </div>

            <h3>{error}</h3>

            <p>
              Please try again later.
            </p>
          </div>

        ) : recommendations.length === 0 ? (

          <div className="recommendation-empty">

            <div className="recommendation-empty-icon">
              ✧
            </div>

            <h3>No recommendations yet</h3>

            <p>
              Add more skills and interests to your profile
              to receive personalized recommendations.
            </p>

            <button
              onClick={() => navigate("/profile")}
            >
              Update Profile
            </button>

          </div>

        ) : (

          <div className="recommendation-grid">

            {recommendations.map((item) => {

              const student = item.student;

              return (
                <div
                  className="recommendation-card"
                  key={student._id}
                >

                  {/* Card Top */}
                  <div className="recommendation-card-top">

                    <div className="recommendation-avatar">
                      {student.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="match-score">
                      <strong>
                        {item.matchScore}%
                      </strong>

                      <span>Match</span>
                    </div>

                  </div>


                  {/* Student Info */}
                  <div className="recommendation-student">

                    <h3>{student.name}</h3>

                    <p>
                      {student.course} · Year {student.year}
                    </p>

                    <span>
                      {student.college}
                    </span>

                  </div>


                  {/* Bio */}
                  {student.bio && (
                    <p className="recommendation-bio">
                      {student.bio}
                    </p>
                  )}


                  {/* Reasons */}
                  <div className="recommendation-reasons">

                    <h4>Why we recommend them</h4>

                    {item.matchingSkills.length > 0 && (
                      <div className="reason-row">
                        <span className="reason-icon">
                          ✓
                        </span>

                        <span>
                          Shared skills:{" "}
                          <strong>
                            {item.matchingSkills.join(", ")}
                          </strong>
                        </span>
                      </div>
                    )}

                    {item.matchingInterests.length > 0 && (
                      <div className="reason-row">
                        <span className="reason-icon">
                          ✓
                        </span>

                        <span>
                          Shared interests:{" "}
                          <strong>
                            {item.matchingInterests.join(", ")}
                          </strong>
                        </span>
                      </div>
                    )}
                    {item.sameCollege && (
  <div className="reason-row">
    <span className="reason-icon">
      ✓
    </span>

    <span>
      Same college
    </span>
  </div>
)}

                    {item.sameCourse && (
                      <div className="reason-row">
                        <span className="reason-icon">
                          ✓
                        </span>

                        <span>
                          Same course
                        </span>
                      </div>
                    )}

                    {item.sameYear && (
                      <div className="reason-row">
                        <span className="reason-icon">
                          ✓
                        </span>

                        <span>
                          Same academic year
                        </span>
                      </div>
                    )}

                  </div>


                  {/* Button */}
                  <button
                    className="view-profile-button"
                    onClick={() =>
                      navigate(
                        `/profile/${student._id}`
                      )
                    }
                  >
                    View Profile
                    <span>→</span>
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}

export default Recommendations;