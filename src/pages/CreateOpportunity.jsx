import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateOpportunity.css";
import "./AdminDashboard.css";

function CreateOpportunity() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        title: "",
        type: "Internship",
        description: "",
        organization: "",
        location: "",
        link: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/opportunities",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Opportunity created successfully!");
                navigate("/admin-dashboard?section=opportunities");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating opportunity:", error);
            alert("Unable to connect to server");
        }
    };

    if (!user || user.role !== "admin") {
        return (
            <div className="create-access-denied">
                <div className="access-denied-card">
                    <div className="access-denied-icon">!</div>

                    <h2>Access Denied</h2>

                    <p>
                        Only administrators can create opportunities.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin-dashboard?section=opportunities"
                            )
                        }
                    >
                        Back to Opportunities
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* ADMIN SIDEBAR */}

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="admin-brand-mark">
                        L
                    </div>

                    <span>
                        LinkVerse
                    </span>

                </div>

                <div className="admin-sidebar-content">

                    <p className="admin-panel-label">
                        ADMIN PANEL
                    </p>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard?section=dashboard"
                            )
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard?section=students"
                            )
                        }
                    >
                        <span>♙</span>
                        Students
                    </button>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard?section=posts"
                            )
                        }
                    >
                        <span>◫</span>
                        Posts
                    </button>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard?section=opportunities"
                            )
                        }
                    >
                        <span>◆</span>
                        Opportunities
                    </button>

                    <button
                        className="admin-sidebar-item active"
                        onClick={() =>
                            navigate("/create-opportunity")
                        }
                    >
                        <span>＋</span>
                        Create Opportunity
                    </button>

                </div>

                <div className="admin-sidebar-footer">

                    <span>
                        Administrator
                    </span>

                    <button
                        className="admin-logout-button"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            navigate("/login");
                        }}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>

            {/* CREATE OPPORTUNITY CONTENT */}

            <main className="admin-main">

                <div className="create-opportunity-page">

                    {/* Top Bar */}

                    <header className="create-opportunity-topbar">

                        <div className="create-opportunity-brand">

                            <div className="create-logo-box">
                                LV
                            </div>

                            <div>
                                <h2>LinkVerse</h2>

                                <span>
                                    Student Opportunity Network
                                </span>
                            </div>

                        </div>

                        <button
                            className="back-opportunity-button"
                            onClick={() =>
                                navigate(
                                    "/admin-dashboard?section=opportunities"
                                )
                            }
                        >
                            ← Opportunities
                        </button>

                    </header>

                    {/* Hero */}

                    <section className="create-opportunity-hero">

                        <div className="create-opportunity-hero-content">

                            <span className="create-opportunity-eyebrow">
                                ADMIN PANEL
                            </span>

                            <h1>
                                Create Opportunity
                            </h1>

                            <p>
                                Add internships, workshops, hackathons,
                                scholarships and other opportunities for
                                LinkVerse students.
                            </p>

                        </div>

                    </section>

                    {/* Main */}

                    <main className="create-opportunity-main">

                        <div className="create-opportunity-card">

                            <div className="create-form-heading">

                                <div className="create-form-icon">
                                    +
                                </div>

                                <div>
                                    <h2>
                                        Opportunity Details
                                    </h2>

                                    <p>
                                        Provide the details students need
                                        to discover and apply for this
                                        opportunity.
                                    </p>
                                </div>

                            </div>

                            <form
                                className="create-opportunity-form"
                                onSubmit={handleSubmit}
                            >

                                {/* Basic Information */}

                                <div className="create-form-section">

                                    <h3>
                                        Basic Information
                                    </h3>

                                    <div className="create-form-grid">

                                        <div className="create-form-group full-width">

                                            <label>
                                                Opportunity Title
                                            </label>

                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="e.g. Google Summer Internship"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        <div className="create-form-group">

                                            <label>
                                                Opportunity Type
                                            </label>

                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                            >
                                                <option value="Internship">
                                                    Internship
                                                </option>

                                                <option value="Workshop">
                                                    Workshop
                                                </option>

                                                <option value="Hackathon">
                                                    Hackathon
                                                </option>

                                                <option value="Scholarship">
                                                    Scholarship
                                                </option>

                                                <option value="Exchange">
                                                    Exchange
                                                </option>
                                            </select>

                                        </div>

                                        <div className="create-form-group">

                                            <label>
                                                Organization
                                            </label>

                                            <input
                                                type="text"
                                                name="organization"
                                                placeholder="e.g. Google"
                                                value={formData.organization}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Description */}

                                <div className="create-form-section">

                                    <h3>
                                        Description
                                    </h3>

                                    <div className="create-form-group">

                                        <label>
                                            Opportunity Description
                                        </label>

                                        <textarea
                                            name="description"
                                            placeholder="Describe the opportunity, eligibility, benefits, application details, etc."
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="6"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* Additional Details */}

                                <div className="create-form-section">

                                    <h3>
                                        Additional Details
                                    </h3>

                                    <div className="create-form-grid">

                                        <div className="create-form-group">

                                            <label>
                                                Location
                                            </label>

                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g. Bangalore / Online"
                                                value={formData.location}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        <div className="create-form-group">

                                            <label>
                                                Application Deadline
                                            </label>

                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        <div className="create-form-group full-width">

                                            <label>
                                                Opportunity Link
                                            </label>

                                            <input
                                                type="url"
                                                name="link"
                                                placeholder="https://example.com/apply"
                                                value={formData.link}
                                                onChange={handleChange}
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Footer */}

                                <div className="create-form-footer">

                                    <button
                                        type="button"
                                        className="cancel-opportunity-button"
                                        onClick={() =>
                                            navigate(
                                                "/admin-dashboard?section=opportunities"
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="create-opportunity-button"
                                    >
                                        Create Opportunity
                                    </button>

                                </div>

                            </form>

                        </div>

                    </main>

                </div>

            </main>

        </div>
    );
}

export default CreateOpportunity;