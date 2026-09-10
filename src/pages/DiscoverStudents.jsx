import { useEffect, useState } from "react";

function DiscoverStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStudents(data.students);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Students error:", error);
        alert("Unable to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search students
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
    return <p>Loading students...</p>;
  }

  return (
    <div>
      <h1>LinkVerse</h1>

      <h2>Discover Students</h2>

      <input
        type="text"
        placeholder="Search by name, course, skill or interest..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <hr />

      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        filteredStudents.map((student) => (
          <div key={student._id}>
            <h3>{student.name}</h3>

            <p>
              <strong>College:</strong> {student.college}
            </p>

            <p>
              <strong>Course:</strong> {student.course}
            </p>

            <p>
              <strong>Year:</strong> {student.year}
            </p>

            <p>
              <strong>Bio:</strong> {student.bio || "No bio added"}
            </p>

            <p>
              <strong>Skills:</strong>{" "}
              {student.skills?.join(", ") || "No skills added"}
            </p>

            <p>
              <strong>Interests:</strong>{" "}
              {student.interests?.join(", ") || "No interests added"}
            </p>

            <button>Connect</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default DiscoverStudents;