import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

                navigate("/opportunities");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating opportunity:", error);
            alert("Unable to connect to server");
        }
    };

    if (!user || user.role !== "admin") {
        return <h2>Access denied. Admins only.</h2>;
    }

    return (
        <div>
            <h1>Create Opportunity</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="title"
                    placeholder="Opportunity Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="Internship">Internship</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Exchange">Exchange</option>
                </select>

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="organization"
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                />

                <input
                    type="url"
                    name="link"
                    placeholder="Opportunity Link"
                    value={formData.link}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                />

                <button type="submit">
                    Create Opportunity
                </button>

            </form>
        </div>
    );
}

export default CreateOpportunity;