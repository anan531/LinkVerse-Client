import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminDashboard.css";
import "./EditOpportunity.css";

function EditOpportunity() {
    const { opportunityId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        type: "Internship",
        description: "",
        organization: "",
        location: "",
        link: "",
        deadline: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/opportunities"
                );

                const data = await response.json();

                const opportunity = data.find(
                    (item) => item._id === opportunityId
                );

                if (!opportunity) {
                    setError("Opportunity not found");
                    return;
                }

                setFormData({
                    title: opportunity.title || "",
                    type: opportunity.type || "Internship",
                    description: opportunity.description || "",
                    organization: opportunity.organization || "",
                    location: opportunity.location || "",
                    link: opportunity.link || "",
                    deadline: opportunity.deadline || ""
                });

            } catch (error) {
                console.error(error);
                setError("Unable to load opportunity");
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [opportunityId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/opportunities/${opportunityId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to update opportunity"
                );
                return;
            }

alert("Opportunity updated successfully!");
window.location.href = "/admin-dashboard?section=opportunities";

        } catch (error) {
            console.error(error);
            setError("Unable to connect to server");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
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
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>▦</span>
                            Dashboard
                        </button>

                        <button
                            className="admin-sidebar-item"
                            onClick={() =>
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>♙</span>
                            Students
                        </button>

                        <button
                            className="admin-sidebar-item"
                            onClick={() =>
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>◫</span>
                            Posts
                        </button>

                        <button
                            className="admin-sidebar-item active"
                            onClick={() =>
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>◆</span>
                            Opportunities
                        </button>

                        <button
                            className="admin-sidebar-item"
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
                            onClick={handleLogout}
                        >
                            ↪ Logout
                        </button>

                    </div>

                </aside>

                <main className="admin-main">
                    <div className="edit-opportunity-loading">
                        <div>
                            <div className="edit-loading-icon">
                                ✧
                            </div>

                            <h3>
                                Loading opportunity...
                            </h3>

                            <p>
                                Please wait
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="admin-dashboard">

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
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>▦</span>
                            Dashboard
                        </button>

                        <button
                            className="admin-sidebar-item"
                            onClick={() =>
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>♙</span>
                            Students
                        </button>

                        <button
                            className="admin-sidebar-item"
                            onClick={() =>
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>◫</span>
                            Posts
                        </button>

                        <button
                            className="admin-sidebar-item active"
                            onClick={() =>
                                navigate("/admin-dashboard")
                            }
                        >
                            <span>◆</span>
                            Opportunities
                        </button>

                        <button
                            className="admin-sidebar-item"
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
                            onClick={handleLogout}
                        >
                            ↪ Logout
                        </button>

                    </div>

                </aside>

                <main className="admin-main">

                    <div className="edit-opportunity-error">

                        <div className="edit-error-icon">
                            !
                        </div>

                        <h3>
                            {error}
                        </h3>

                        <button
                            onClick={() =>
                                navigate("/admin-dashboard?section=opportunities")
                            }
                        >
                            ← Back to Opportunities
                        </button>

                    </div>

                </main>

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
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>♙</span>
                        Students
                    </button>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>◫</span>
                        Posts
                    </button>

                    <button
                        className="admin-sidebar-item active"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>◆</span>
                        Opportunities
                    </button>

                    <button
                        className="admin-sidebar-item"
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
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>

            {/* EDIT PAGE */}

            <main className="admin-main">

                <div className="edit-opportunity-page">

                    {/* Top Bar */}

                    <header className="edit-opportunity-topbar">

                        <div className="edit-opportunity-brand">

                            <div className="edit-logo-box">
                                L
                            </div>

                            <div>
                                <h2>
                                    LinkVerse
                                </h2>

                                <span>
                                    Student Networking Platform
                                </span>
                            </div>

                        </div>

                        <button
                            className="back-opportunity-button"
                            onClick={() =>
                                navigate("/admin-dashboard?section=opportunities")
                            }
                        >
                            ← Back to Opportunities
                        </button>

                    </header>

                    {/* Hero */}

                    <section className="edit-opportunity-hero">

                        <p className="edit-opportunity-eyebrow">
                            ADMINISTRATION
                        </p>

                        <h1>
                            Edit Opportunity
                        </h1>

                        <p>
                            Update the opportunity details and keep
                            students informed with the latest information.
                        </p>

                    </section>

                    {/* Form */}

                    <main className="edit-opportunity-main">

                        <div className="edit-opportunity-card">

                            <div className="edit-form-heading">

                                <div className="edit-form-icon">
                                    ✎
                                </div>

                                <div>
                                    <h2>
                                        Opportunity Details
                                    </h2>

                                    <p>
                                        Update the information below.
                                    </p>
                                </div>

                            </div>

                            {error && (
                                <div className="edit-form-error">
                                    {error}
                                </div>
                            )}

                            <form
                                className="edit-opportunity-form"
                                onSubmit={handleSubmit}
                            >

                                {/* Basic Information */}

                                <div className="edit-form-section">

                                    <h3>
                                        Basic Information
                                    </h3>

                                    <div className="edit-form-grid">

                                        <div className="edit-form-group">

                                            <label>
                                                Opportunity Title
                                            </label>

                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        <div className="edit-form-group">

                                            <label>
                                                Opportunity Type
                                            </label>

                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                required
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

                                    </div>

                                </div>

                                {/* Organization */}

                                <div className="edit-form-section">

                                    <h3>
                                        Organization
                                    </h3>

                                    <div className="edit-form-grid">

                                        <div className="edit-form-group">

                                            <label>
                                                Organization Name
                                            </label>

                                            <input
                                                type="text"
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        <div className="edit-form-group">

                                            <label>
                                                Location
                                            </label>

                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="e.g. Bangalore / Online"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Description */}

                                <div className="edit-form-section">

                                    <h3>
                                        Description
                                    </h3>

                                    <div className="edit-form-group">

                                        <label>
                                            Opportunity Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="6"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* Additional Information */}

                                <div className="edit-form-section">

                                    <h3>
                                        Additional Information
                                    </h3>

                                    <div className="edit-form-grid">

                                        <div className="edit-form-group">

                                            <label>
                                                Opportunity Link
                                            </label>

                                            <input
                                                type="url"
                                                name="link"
                                                value={formData.link}
                                                onChange={handleChange}
                                                placeholder="https://example.com"
                                            />

                                        </div>

                                        <div className="edit-form-group">

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

                                    </div>

                                </div>

                                {/* Footer */}

                                <div className="edit-form-footer">

                                    <button
                                        type="button"
                                        className="cancel-edit-button"
                                        onClick={() =>
window.location.href = "/admin-dashboard?section=opportunities"                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-opportunity-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
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

export default EditOpportunity;