import { useEffect, useState } from "react";

function CollaborationHub() {
    const [collaborations, setCollaborations] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: "",
    });

    const fetchCollaborations = () => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/collaborations", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCollaborations(data);
            })
            .catch((error) => {
                console.error("Error fetching collaborations:", error);
            });
    };

    useEffect(() => {
        fetchCollaborations();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const skills = formData.requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        try {
            const response = await fetch(
                "http://localhost:5000/api/collaborations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description,
                        requiredSkills: skills,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Collaboration created successfully!");

                setFormData({
                    title: "",
                    description: "",
                    requiredSkills: "",
                });

                fetchCollaborations();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating collaboration:", error);
            alert("Unable to connect to server");
        }
    };

    return (
        <div>
            <h1>Collaboration Hub</h1>

            <h2>Create Collaboration</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Collaboration Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="description"
                    placeholder="Describe your project or collaboration"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="requiredSkills"
                    placeholder="Required skills (e.g. Python, React, MongoDB)"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Create Collaboration
                </button>
            </form>

            <hr />

            <h2>Available Collaborations</h2>

            {collaborations.length === 0 ? (
                <p>No collaborations available.</p>
            ) : (
                collaborations.map((collaboration) => (
                    <div key={collaboration._id}>
                        <h3>{collaboration.title}</h3>

                        <p>{collaboration.description}</p>

                        <p>
                            <strong>Required Skills:</strong>{" "}
                            {collaboration.requiredSkills.join(", ")}
                        </p>

                        <p>
                            <strong>Posted by:</strong>{" "}
                            {collaboration.createdBy.name}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {collaboration.status}
                        </p>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default CollaborationHub;