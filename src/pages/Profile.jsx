import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    course: "",
    year: "",
    bio: "",
    skills: "",
    interests: "",
  });

  // Get profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProfile(data.user);

          setFormData({
            name: data.user.name || "",
            college: data.user.college || "",
            course: data.user.course || "",
            year: data.user.year || "",
            bio: data.user.bio || "",
            skills: data.user.skills?.join(", ") || "",
            interests: data.user.interests?.join(", ") || "",
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Profile error:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/profile/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),
            interests: formData.interests
              .split(",")
              .map((interest) => interest.trim())
              .filter((interest) => interest !== ""),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        setProfile(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to update profile");
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>LinkVerse</h1>
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          name="interests"
          placeholder="Interests (comma separated)"
          value={formData.interests}
          onChange={handleChange}
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;