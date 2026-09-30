import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CollaborationHub.css";

function CollaborationHub() {
    const navigate = useNavigate();

    const [collaborations, setCollaborations] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [requestedCollaborations, setRequestedCollaborations] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: "",
    });

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const currentUserId = storedUser?._id || storedUser?.id;

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
                console.error(
                    "Error fetching collaborations:",
                    error
                );
            });
    };

    const fetchJoinRequests = () => {
        const token = localStorage.getItem("token");

        fetch(
            "http://localhost:5000/api/collaboration-requests/my-requests",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setJoinRequests(data);
                } else {
                    setJoinRequests([]);
                }
            })
            .catch((error) => {
                console.error(
                    "Error fetching join requests:",
                    error
                );
            });
    };

    useEffect(() => {
        fetchCollaborations();
        fetchJoinRequests();
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
                fetchJoinRequests();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(
                "Error creating collaboration:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    const handleJoinRequest = async (collaborationId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/collaboration-requests/${collaborationId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                setRequestedCollaborations([
                    ...requestedCollaborations,
                    collaborationId,
                ]);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(
                "Error sending join request:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    const handleAccept = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/collaboration-requests/${requestId}/accept`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                fetchJoinRequests();
                fetchCollaborations();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(
                "Error accepting join request:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    const handleReject = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/collaboration-requests/${requestId}/reject`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                fetchJoinRequests();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(
                "Error rejecting join request:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    return (
        <div className="collab-page">

            {/* TOP BAR */}

            <header className="collab-topbar">

                <div className="collab-logo">
                    <div className="collab-logo-box">
                        L
                    </div>

                    <span>LinkVerse</span>
                </div>

                <div className="collab-topbar-text">
                    Collaboration Hub
                </div>

            </header>


            {/* HERO */}

            <section className="collab-hero">

                <div className="collab-hero-content">

                    <p className="collab-eyebrow">
                        LINKVERSE COLLABORATION
                    </p>

                    <h1>
                        Build Something Together
                    </h1>

                    <p className="collab-description">
                        Create projects, find students with the
                        right skills, and build collaborative teams.
                    </p>

                </div>

            </section>


            {/* MAIN */}

            <main className="collab-main">


                {/* CREATE COLLABORATION */}

                <section className="collab-create-card">

                    <div className="collab-section-heading">

                        <div>
                            <span>
                                START A PROJECT
                            </span>

                            <h2>
                                Create Collaboration
                            </h2>

                            <p>
                                Share your idea and find students
                                who can help bring it to life.
                            </p>
                        </div>

                        <div className="collab-create-icon">
                            +
                        </div>

                    </div>


                    <form
                        className="collab-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="collab-form-group">

                            <label>
                                Collaboration Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. AI Student Project"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="collab-form-group">

                            <label>
                                Project Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Describe your project or collaboration..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="collab-form-group">

                            <label>
                                Required Skills
                            </label>

                            <input
                                type="text"
                                name="requiredSkills"
                                placeholder="e.g. Python, React, MongoDB"
                                value={formData.requiredSkills}
                                onChange={handleChange}
                            />

                            <small>
                                Separate multiple skills with commas.
                            </small>

                        </div>


                        <button
                            type="submit"
                            className="collab-create-button"
                        >
                            Create Collaboration
                        </button>

                    </form>

                </section>


                {/* AVAILABLE COLLABORATIONS */}

                <section className="collab-section">

                    <div className="collab-section-title">

                        <div>
                            <span>
                                EXPLORE PROJECTS
                            </span>

                            <h2>
                                Available Collaborations
                            </h2>

                            <p>
                                Find projects that match your skills
                                and interests.
                            </p>
                        </div>

                        <div className="collab-count">
                            {collaborations.length}
                        </div>

                    </div>


                    {collaborations.length === 0 ? (

                        <div className="collab-empty">

                            <div className="collab-empty-icon">
                                +
                            </div>

                            <h3>
                                No collaborations available
                            </h3>

                            <p>
                                Create the first collaboration
                                and start building your team.
                            </p>

                        </div>

                    ) : (

                        <div className="collab-grid">

                            {collaborations.map(
                                (collaboration) => {

                                    const isCreator =
                                        collaboration.createdBy._id ===
                                        currentUserId;

                                    const hasRequested =
                                        requestedCollaborations.includes(
                                            collaboration._id
                                        );

                                    return (

                                        <div
                                            className="collab-card"
                                            key={collaboration._id}
                                        >

                                            <div className="collab-card-top">

                                                <div className="collab-project-icon">
                                                    {collaboration.title
                                                        ? collaboration.title
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : "P"}
                                                </div>

                                                <div className="collab-status">
                                                    {collaboration.status}
                                                </div>

                                            </div>


                                            <h3 className="collab-card-title">
                                                {collaboration.title}
                                            </h3>


                                            <p className="collab-card-description">
                                                {collaboration.description}
                                            </p>


                                            <div className="collab-card-detail">

                                                <span>
                                                    POSTED BY
                                                </span>

                                                <p>
                                                    {collaboration.createdBy.name}
                                                </p>

                                            </div>


                                            <div className="collab-card-detail">

                                                <span>
                                                    REQUIRED SKILLS
                                                </span>

                                                <div className="collab-tags">

                                                    {collaboration.requiredSkills
                                                        .length === 0 ? (

                                                        <span className="collab-no-data">
                                                            No skills specified
                                                        </span>

                                                    ) : (

                                                        collaboration.requiredSkills.map(
                                                            (skill, index) => (

                                                                <span
                                                                    className="collab-tag"
                                                                    key={index}
                                                                >
                                                                    {skill}
                                                                </span>

                                                            )
                                                        )

                                                    )}

                                                </div>

                                            </div>


                                            <div className="collab-team">

                                                <span>
                                                    TEAM MEMBERS
                                                </span>

                                                <p>

                                                    {collaboration.members.length === 0
                                                        ? "No members yet"
                                                        : collaboration.members
                                                            .map(
                                                                (member) =>
                                                                    member.name
                                                            )
                                                            .join(", ")}

                                                </p>

                                            </div>


                                            {!isCreator &&
                                                !hasRequested &&
                                                collaboration.status ===
                                                "open" && (

                                                    <button
                                                        className="collab-join-button"
                                                        onClick={() =>
                                                            handleJoinRequest(
                                                                collaboration._id
                                                            )
                                                        }
                                                    >
                                                        Request to Join
                                                    </button>

                                                )}


                                            {!isCreator &&
                                                hasRequested && (

                                                    <div className="collab-requested">
                                                        ✓ Join request sent
                                                    </div>

                                                )}


                                       {isCreator && (

    <div className="collab-owner-area">

        <div className="collab-owner">
            Your Collaboration
        </div>

        <button
            className="collab-edit-button"
            onClick={() =>
                navigate(
                    `/edit-collaboration/${collaboration._id}`
                )
            }
        >
            Edit Collaboration
        </button>

    </div>

)}

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    )}

                </section>


                {/* PENDING REQUESTS */}

                <section className="collab-section">

                    <div className="collab-section-title">

                        <div>
                            <span>
                                TEAM MANAGEMENT
                            </span>

                            <h2>
                                Pending Join Requests
                            </h2>

                            <p>
                                Review students who want to join
                                your collaborations.
                            </p>
                        </div>

                        <div className="collab-count">
                            {joinRequests.length}
                        </div>

                    </div>


                    {joinRequests.length === 0 ? (

                        <div className="collab-empty small">

                            <h3>
                                No pending join requests
                            </h3>

                            <p>
                                New requests will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="collab-request-list">

                            {joinRequests.map(
                                (request) => (

                                    <div
                                        className="collab-request-card"
                                        key={request._id}
                                    >

                                        <div className="collab-request-avatar">
                                            {request.sender.name
                                                ? request.sender.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "U"}
                                        </div>


                                        <div className="collab-request-info">

                                            <h3>
                                                {request.sender.name}
                                            </h3>

                                            <p>
                                                {request.sender.email}
                                            </p>

                                            <span>
                                                Requested to join{" "}
                                                <strong>
                                                    {request.collaboration.title}
                                                </strong>
                                            </span>

                                        </div>


                                        <div className="collab-request-actions">

                                            <button
                                                className="collab-accept"
                                                onClick={() =>
                                                    handleAccept(
                                                        request._id
                                                    )
                                                }
                                            >
                                                Accept
                                            </button>

                                            <button
                                                className="collab-reject"
                                                onClick={() =>
                                                    handleReject(
                                                        request._id
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default CollaborationHub;