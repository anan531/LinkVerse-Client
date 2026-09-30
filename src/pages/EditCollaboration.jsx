import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCollaboration.css";

function EditCollaboration() {
    const { collaborationId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: "",
        status: "open"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCollaboration();
    }, []);

    const fetchCollaboration = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/collaborations",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch collaborations"
                );
            }

            const collaboration = data.find(
                (item) => item._id === collaborationId
            );

            if (!collaboration) {
                setError("Collaboration not found");
                setLoading(false);
                return;
            }

            setFormData({
                title: collaboration.title || "",
                description: collaboration.description || "",
                requiredSkills: collaboration.requiredSkills
                    ? collaboration.requiredSkills.join(", ")
                    : "",
                status: collaboration.status || "open"
            });

            setLoading(false);

        } catch (error) {
            console.error(error);
            setError("Failed to load collaboration");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            const requiredSkills = formData.requiredSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "");

            const response = await fetch(
                `http://localhost:5000/api/collaborations/${collaborationId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description,
                        requiredSkills,
                        status: formData.status
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update collaboration"
                );
            }

            alert("Collaboration updated successfully!");

            navigate("/collaborations");

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-collab-loading">
                Loading collaboration...
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-collab-error">
                <h2>{error}</h2>

                <button onClick={() => navigate("/collaborations")}>
                    Back to Collaborations
                </button>
            </div>
        );
    }

    return (
        <div className="edit-collab-page">

            <div className="edit-collab-header">
                <div>
                    <p className="edit-collab-label">
                        COLLABORATION HUB
                    </p>

                    <h1>Edit Collaboration</h1>

                    <p>
                        Update your collaboration details and requirements.
                    </p>
                </div>

                <button
                    className="edit-collab-back"
                    onClick={() => navigate("/collaborations")}
                >
                    ← Back
                </button>
            </div>

            <form
                className="edit-collab-form"
                onSubmit={handleSubmit}
            >

                <div className="edit-collab-section">
                    <h2>Basic Information</h2>

                    <div className="edit-collab-field">
                        <label>Collaboration Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="edit-collab-field">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            required
                        />
                    </div>
                </div>

                <div className="edit-collab-section">
                    <h2>Project Requirements</h2>

                    <div className="edit-collab-field">
                        <label>Required Skills</label>

                        <input
                            type="text"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            placeholder="Python, React, MongoDB"
                        />

                        <small>
                            Separate multiple skills with commas.
                        </small>
                    </div>

                    <div className="edit-collab-field">
                        <label>Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="open">
                                Open
                            </option>

                            <option value="closed">
                                Closed
                            </option>
                        </select>
                    </div>
                </div>

                <div className="edit-collab-actions">

                    <button
                        type="button"
                        className="edit-collab-cancel"
                        onClick={() => navigate("/collaborations")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="edit-collab-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default EditCollaboration;