import { useEffect, useState } from "react";
import "./Ooportunities.css";

function Opportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("All");


    const user = JSON.parse(localStorage.getItem("user"));  
    useEffect(() => {
        fetch("http://localhost:5000/api/opportunities")
            .then((response) => response.json())
            .then((data) => {
                setOpportunities(data);
            })
            .catch((error) => {
                console.error("Error fetching opportunities:", error);
            });
    }, []);

    const filteredOpportunities = opportunities.filter((opportunity) => {
        const matchesSearch =
            opportunity.title.toLowerCase().includes(search.toLowerCase()) ||
            opportunity.organization.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            type === "All" || opportunity.type === type;

        return matchesSearch && matchesType;
    });

return (
    <div className="opportunity-page">
        <h1>Opportunity Board</h1>
        {user && user.role === "admin" && (
    <button onClick={() => window.location.href = "/create-opportunity"}>
        Create Opportunity
    </button>
)}

        <div className="opportunity-filters">
            <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="All">All</option>
                <option value="Internship">Internship</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Exchange">Exchange</option>
            </select>
        </div>

        {filteredOpportunities.length === 0 ? (
            <p>No opportunities found.</p>
        ) : (
            <div className="opportunity-list">
                {filteredOpportunities.map((opportunity) => (
                    <div
                        className="opportunity-card"
                        key={opportunity._id}
                    >
                        <h2>{opportunity.title}</h2>

                        <p className="opportunity-type">
                            {opportunity.type}
                        </p>

                        <p>
                            <strong>Organization:</strong>{" "}
                            {opportunity.organization}
                        </p>

                        <p>
                            <strong>Description:</strong>{" "}
                            {opportunity.description}
                        </p>

                        <p>
                            <strong>Location:</strong>{" "}
                            {opportunity.location}
                        </p>

                        <p>
                            <strong>Deadline:</strong>{" "}
                            {opportunity.deadline}
                        </p>

                        <a
                            href={opportunity.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Opportunity
                        </a>
                    </div>
                ))}
            </div>
        )}
    </div>
);
}

export default Opportunities;