import { useEffect, useState } from "react";

function CollaborationHub() {
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

                <br />
                <br />

                <textarea
                    name="description"
                    placeholder="Describe your project or collaboration"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    name="requiredSkills"
                    placeholder="Required skills (e.g. Python, React, MongoDB)"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Create Collaboration
                </button>
            </form>

            <hr />

            <h2>Available Collaborations</h2>

            {collaborations.length === 0 ? (
                <p>No collaborations available.</p>
            ) : (
                collaborations.map((collaboration) => {
                    const isCreator =
                        collaboration.createdBy._id === currentUserId;

                    const hasRequested =
                        requestedCollaborations.includes(
                            collaboration._id
                        );

                    return (
                        <div key={collaboration._id}>
                            <h3>{collaboration.title}</h3>

                            <p>{collaboration.description}</p>

                            <p>
                                <strong>Required Skills:</strong>{" "}
                                {collaboration.requiredSkills.join(
                                    ", "
                                )}
                            </p>

                            <p>
                                <strong>Posted by:</strong>{" "}
                                {collaboration.createdBy.name}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {collaboration.status}
                            </p>

                            <p>
                                <strong>Team Members:</strong>{" "}
                                {collaboration.members.length === 0
                                    ? "No members yet"
                                    : collaboration.members
                                          .map(
                                              (member) =>
                                                  member.name
                                          )
                                          .join(", ")}
                            </p>

                            {!isCreator &&
                                !hasRequested &&
                                collaboration.status === "open" && (
                                    <button
                                        onClick={() =>
                                            handleJoinRequest(
                                                collaboration._id
                                            )
                                        }
                                    >
                                        Request to Join
                                    </button>
                                )}

                            {!isCreator && hasRequested && (
                                <p>
                                    <strong>
                                        Join request sent
                                    </strong>
                                </p>
                            )}

                            <hr />
                        </div>
                    );
                })
            )}

            <h2>Pending Join Requests</h2>

            {joinRequests.length === 0 ? (
                <p>No pending join requests.</p>
            ) : (
                joinRequests.map((request) => (
                    <div key={request._id}>
                        <p>
                            <strong>
                                {request.sender.name}
                            </strong>{" "}
                            requested to join{" "}
                            <strong>
                                {request.collaboration.title}
                            </strong>
                        </p>

                        <p>
                            Email: {request.sender.email}
                        </p>

                        <button
                            onClick={() =>
                                handleAccept(request._id)
                            }
                        >
                            Accept
                        </button>

                        <button
                            onClick={() =>
                                handleReject(request._id)
                            }
                        >
                            Reject
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default CollaborationHub;