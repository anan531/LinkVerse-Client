import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        college: "",
        department: "",
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
                        department: data.user.department || "",
                        course: data.user.course || "",
                        year: data.user.year || "",
                        bio: data.user.bio || "",
                        skills:
                            data.user.skills?.join(", ") || "",
                        interests:
                            data.user.interests?.join(", ") || "",
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
                            .filter(
                                (skill) => skill !== ""
                            ),
                        interests: formData.interests
                            .split(",")
                            .map((interest) =>
                                interest.trim()
                            )
                            .filter(
                                (interest) => interest !== ""
                            ),
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
        return (
            <div className="profile-loading">
                <div className="profile-loading-card">
                    <div className="profile-loading-icon">
                        L
                    </div>

                    <h3>Loading Profile</h3>

                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* Top Bar */}
            <header className="profile-topbar">
                <div className="profile-brand">

                    <div className="profile-logo-box">
                        L
                    </div>

                    <div>
                        <h2>LinkVerse</h2>
                        <span>
                            Student Networking Platform
                        </span>
                    </div>

                </div>
            </header>


            {/* Hero */}
            <section className="profile-hero">

                <div className="profile-hero-content">

                    <p className="profile-eyebrow">
                        MY ACCOUNT
                    </p>

                    <h1>My Profile</h1>

                    <p>
                        Manage your academic details, skills
                        and interests to help other students
                        discover you.
                    </p>

                </div>

            </section>


            {/* Main */}
            <main className="profile-main">

                <div className="profile-layout">

                    {/* Profile Summary */}
                    <aside className="profile-summary">

                        <div className="profile-avatar">
                            {profile.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <h2>{profile.name}</h2>

                        <p className="profile-email">
                            {profile.email}
                        </p>

                        <div className="profile-summary-line" />

                        <div className="profile-summary-item">
                            <span>College</span>
                            <strong>
                                {profile.college ||
                                    "Not specified"}
                            </strong>
                        </div>
                        
<div className="profile-summary-item">
    <span>Department</span>
    <strong>
        {profile.department || "Not specified"}
    </strong>
</div>

                        <div className="profile-summary-item">
                            <span>Course</span>
                            <strong>
                                {profile.course ||
                                    "Not specified"}
                            </strong>
                        </div>

                        <div className="profile-summary-item">
                            <span>Year</span>
                            <strong>
                                {profile.year ||
                                    "Not specified"}
                            </strong>
                        </div>

                    </aside>


                    {/* Edit Profile */}
                    <section className="profile-form-card">

                        <div className="profile-form-heading">

                            <div className="profile-heading-icon">
                                ✎
                            </div>

                            <div>
                                <h2>Edit Profile</h2>

                                <p>
                                    Keep your information up to date.
                                </p>
                            </div>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* Basic Details */}
                            <div className="profile-form-section">

                                <h3>Basic Information</h3>

                                <div className="profile-form-grid">

                                    <div className="profile-field">
                                        <label>Name</label>

                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>

                                    <div className="profile-field">
                                        <label>College</label>

                                        <input
                                            type="text"
                                            name="college"
                                            placeholder="Your college"
                                            value={
                                                formData.college
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>

                                <div className="profile-field">
    <label>Department</label>

    <input
        type="text"
        name="department"
        placeholder="e.g. Computer Applications"
        value={formData.department}
        onChange={handleChange}
    />
</div>


                                    <div className="profile-field">
                                        <label>Course</label>

                                        <input
                                            type="text"
                                            name="course"
                                            placeholder="Your course"
                                            value={
                                                formData.course
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>

                                    <div className="profile-field">
                                        <label>Year</label>

                                        <input
                                            type="text"
                                            name="year"
                                            placeholder="Academic year"
                                            value={formData.year}
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>

                                </div>

                            </div>


                            {/* About */}
                            <div className="profile-form-section">

                                <h3>About You</h3>

                                <div className="profile-field">

                                    <label>Bio</label>

                                    <textarea
                                        name="bio"
                                        placeholder="Tell other students a little about yourself..."
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            {/* Skills & Interests */}
                            <div className="profile-form-section">

                                <h3>Skills & Interests</h3>

                                <div className="profile-form-grid">

                                    <div className="profile-field">

                                        <label>
                                            Skills
                                        </label>

                                        <input
                                            type="text"
                                            name="skills"
                                            placeholder="Python, React, SQL..."
                                            value={
                                                formData.skills
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <small>
                                            Separate multiple
                                            skills with commas.
                                        </small>

                                    </div>


                                    <div className="profile-field">

                                        <label>
                                            Interests
                                        </label>

                                        <input
                                            type="text"
                                            name="interests"
                                            placeholder="AI, Web Development, Music..."
                                            value={
                                                formData.interests
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <small>
                                            Separate multiple
                                            interests with commas.
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Submit */}
                            <div className="profile-form-footer">

                                <button type="submit">
                                    Update Profile
                                    <span>→</span>
                                </button>

                            </div>

                        </form>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Profile;