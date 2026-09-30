import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CollaborationChat.css";

function CollaborationChat() {
    const { collaborationId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const currentUserId =
        storedUser?._id || storedUser?.id;

    const fetchMessages = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/collaboration-chat/${collaborationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(
                "Error fetching group messages:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [collaborationId]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() === "") {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/collaboration-chat/${collaborationId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        message: message,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("");
                fetchMessages();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(
                "Error sending group message:",
                error
            );

            alert("Unable to send message");
        }
    };

    return (
        <div className="group-chat-page">

            <header className="group-chat-topbar">

                <div className="group-chat-brand">

                    <div className="group-chat-logo">
                        L
                    </div>

                    <div>
                        <h2>LinkVerse</h2>
                        <span>
                            Collaboration Group Chat
                        </span>
                    </div>

                </div>

                <button
                    className="group-chat-back"
                    onClick={() => navigate("/collaborations")}
                >
                    ← Back to Collaborations
                </button>

            </header>


            <main className="group-chat-main">

                <div className="group-chat-container">

                    <div className="group-chat-header">

                        <div className="group-chat-icon">
                            👥
                        </div>

                        <div>
                            <p className="group-chat-eyebrow">
                                COLLABORATION CHAT
                            </p>

                            <h1>
                                Project Group
                            </h1>

                            <span>
                                Members can communicate here
                            </span>
                        </div>

                    </div>


                    <div className="group-chat-messages">

                        {loading ? (

                            <div className="group-chat-empty">
                                <h3>
                                    Loading messages...
                                </h3>
                            </div>

                        ) : messages.length === 0 ? (

                            <div className="group-chat-empty">

                                <div className="group-chat-empty-icon">
                                    💬
                                </div>

                                <h3>
                                    No messages yet
                                </h3>

                                <p>
                                    Start the conversation with
                                    your collaboration team.
                                </p>

                            </div>

                        ) : (

                            messages.map((msg) => {

                                const isOwnMessage =
                                    msg.sender._id ===
                                    currentUserId;

                                return (

                                    <div
                                        key={msg._id}
                                        className={`group-message ${
                                            isOwnMessage
                                                ? "group-message-own"
                                                : "group-message-other"
                                        }`}
                                    >

                                        <div className="group-message-avatar">
                                            {msg.sender.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="group-message-content">

                                            <span className="group-message-sender">
                                                {msg.sender.name}
                                            </span>

                                            <div className="group-message-bubble">
                                                {msg.message}
                                            </div>

                                            <small>
                                                {new Date(
                                                    msg.createdAt
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </small>

                                        </div>

                                    </div>

                                );
                            })

                        )}

                    </div>


                    <form
                        className="group-chat-input"
                        onSubmit={sendMessage}
                    >

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={
                                message.trim() === ""
                            }
                        >
                            Send
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CollaborationChat;