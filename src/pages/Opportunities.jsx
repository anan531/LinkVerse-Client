import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ooportunities.css";

function Opportunities() {
    const navigate = useNavigate();

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
            opportunity.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            opportunity.organization
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesType =
            type === "All" || opportunity.type === type;

        return matchesSearch && matchesType;
    });

    return (
        <div className="opportunity-page">

            {/* ================================
                TOP BAR
            ================================= */}

            <header className="opportunity-topbar">

                <div className="opportunity-brand">

                    <div className="opportunity-logo-box">
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


            {/* ================================
                HERO
            ================================= */}

            <section className="opportunity-hero">

                <div className="opportunity-hero-content">

                    <p className="opportunity-eyebrow">
                        EXPLORE & GROW
                    </p>

                    <h1>
                        Opportunities
                    </h1>

                    <p>
                        Discover internships, workshops,
                        hackathons, scholarships and other
                        opportunities to grow your career.
                    </p>

                </div>

            </section>


            {/* ================================
                MAIN
            ================================= */}

            <main className="opportunity-main">

                {/* Heading */}

                <div className="opportunity-heading">

                    <div>
                        <h2>
                            Available Opportunities
                        </h2>

                        <p>
                            Find opportunities that match
                            your interests and career goals.
                        </p>
                    </div>


                    {/* Admin Create Button */}

                    {user && user.role === "admin" && (
                        <button
                            className="create-opportunity-button"
                            onClick={() =>
                                navigate("/create-opportunity")
                            }
                        >
                            + Create Opportunity
                        </button>
                    )}

                </div>


                {/* ================================
                    FILTERS
                ================================= */}

                <div className="opportunity-filter-card">

                    <div className="search-wrapper">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search opportunities or organizations..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                    >

                        <option value="All">
                            All Types
                        </option>

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


                {/* Result count */}

                <div className="opportunity-result-info">

                    Showing {filteredOpportunities.length}{" "}
                    {filteredOpportunities.length === 1
                        ? "opportunity"
                        : "opportunities"}

                </div>


                {/* ================================
                    OPPORTUNITY LIST
                ================================= */}

                {filteredOpportunities.length === 0 ? (

                    <div className="opportunity-empty">

                        <div className="opportunity-empty-icon">
                            ◎
                        </div>

                        <h3>
                            No opportunities found
                        </h3>

                        <p>
                            Try changing your search or
                            filter.
                        </p>

                    </div>

                ) : (

                    <div className="opportunity-list">

                        {filteredOpportunities.map(
                            (opportunity) => (

                                <div
                                    className="opportunity-card"
                                    key={opportunity._id}
                                >

                                    {/* Card top */}

                                    <div className="opportunity-card-top">

                                        <div className="opportunity-icon">
                                            ✦
                                        </div>

                                        <span className="opportunity-type">
                                            {opportunity.type}
                                        </span>

                                    </div>


                                    {/* Content */}

                                    <h2>
                                        {opportunity.title}
                                    </h2>

                                    <p className="opportunity-organization">
                                        {opportunity.organization}
                                    </p>

                                    <p className="opportunity-description">
                                        {opportunity.description}
                                    </p>


                                    {/* Details */}

                                    <div className="opportunity-details">

                                        <div className="opportunity-detail">

                                            <span className="detail-label">
                                                Location
                                            </span>

                                            <span className="detail-value">
                                                {opportunity.location ||
                                                    "Not specified"}
                                            </span>

                                        </div>


                                        <div className="opportunity-detail">

                                            <span className="detail-label">
                                                Deadline
                                            </span>

                                            <span className="detail-value">
                                                {opportunity.deadline ||
                                                    "Not specified"}
                                            </span>

                                        </div>

                                    </div>


                                    {/* ================================
                                        ACTION BUTTONS
                                    ================================= */}

                                    <div className="opportunity-card-actions">

                                        <a
                                            className="view-opportunity-button"
                                            href={opportunity.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Opportunity

                                            <span>
                                                →
                                            </span>

                                        </a>


                                        {/* ADMIN EDIT BUTTON */}

                                        {user && user.role === "admin" && (

                                            <button
                                                type="button"
                                                className="edit-opportunity-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-opportunity/${opportunity._id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Opportunities;