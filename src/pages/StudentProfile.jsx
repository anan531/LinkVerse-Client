import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StudentProfile.css";

function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/students/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStudent(data.user);
        } else {
          setError(data.message || "Unable to load student profile");
        }
      } catch (error) {
        console.error("Student profile error:", error);
        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="student-profile-loading">
        <div className="student-profile-loading-card">
          <div className="student-profile-loading-icon">○</div>
          <h3>Loading profile...</h3>
          <p>Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-error">
          <div className="student-profile-error-icon">!</div>
          <h3>{error || "Student not found"}</h3>
          <button onClick={() => navigate("/recommendations")}>
            ← Back to Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-page">
      <header className="student-profile-header">
        <button
          className="student-profile-back"
          onClick={() => navigate("/recommendations")}
        >
          ← Recommendations
        </button>

        <div className="student-profile-header-content">
          <div className="student-profile-avatar">
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="student-profile-eyebrow">STUDENT PROFILE</p>
            <h1>{student.name}</h1>
            <p>
              {student.course} · Year {student.year}
            </p>
          </div>
        </div>
      </header>

      <main className="student-profile-main">
        <section className="student-profile-card">
          <div className="student-profile-section">
            <p className="student-profile-label">ABOUT</p>
            <h2>Profile Information</h2>

            <div className="student-profile-info-grid">
              <div>
                <span>College</span>
                <strong>{student.college || "Not provided"}</strong>
              </div>

              <div>
  <span>Department</span>
  <strong>{student.department || "Not provided"}</strong>
</div>

              <div>
                <span>Course</span>
                <strong>{student.course || "Not provided"}</strong>
              </div>

              <div>
                <span>Academic Year</span>
                <strong>{student.year || "Not provided"}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{student.email || "Not available"}</strong>
              </div>
            </div>

            {student.bio && (
              <div className="student-profile-bio">
                <span>Bio</span>
                <p>{student.bio}</p>
              </div>
            )}
          </div>

          <div className="student-profile-section">
            <p className="student-profile-label">SKILLS</p>
            <h2>Skills</h2>

            {student.skills && student.skills.length > 0 ? (
              <div className="student-profile-tags">
                {student.skills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            ) : (
              <p className="student-profile-muted">
                No skills added yet.
              </p>
            )}
          </div>

          <div className="student-profile-section">
            <p className="student-profile-label">INTERESTS</p>
            <h2>Interests</h2>

            {student.interests && student.interests.length > 0 ? (
              <div className="student-profile-tags">
                {student.interests.map((interest, index) => (
                  <span key={index}>{interest}</span>
                ))}
              </div>
            ) : (
              <p className="student-profile-muted">
                No interests added yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentProfile;