import { useEffect, useState } from "react";
import "./Chat.css";

function Chat() {
    const [students, setStudents] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [receiverName, setReceiverName] = useState("");

    // Fetch students
    const fetchStudents = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/students",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setStudents(data.students);

                // Select first student automatically
                if (data.students.length > 0) {
                    setReceiverId(data.students[0]._id);
                    setReceiverName(data.students[0].name);
                }
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    // Fetch chat messages
    const fetchMessages = async () => {
        if (!receiverId) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/chat/${receiverId}`,
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
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [receiverId]);

    // Change selected student
    const handleStudentChange = (e) => {
        const selectedId = e.target.value;

        setReceiverId(selectedId);

        const selectedStudent = students.find(
            (student) => student._id === selectedId
        );

        if (selectedStudent) {
            setReceiverName(selectedStudent.name);
        }
    };

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() === "" || !receiverId) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        receiver: receiverId,
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
            console.error("Error sending message:", error);
            alert("Unable to send message");
        }
    };

    return (
        <div className="chat-page">

            {/* Top Bar */}
            <header className="chat-topbar">
                <div className="chat-brand">
                    <div className="chat-logo-box">L</div>

                    <div>
                        <h2>LinkVerse</h2>
                        <span>Student Networking Platform</span>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="chat-hero">
                <div>
                    <p className="chat-eyebrow">MESSAGES</p>

                    <h1>Stay Connected</h1>

                    <p>
                        Communicate with fellow students and build meaningful
                        academic connections.
                    </p>
                </div>
            </section>

            {/* Main Chat */}
            <main className="chat-main">

                <div className="chat-container">

                    {/* Sidebar */}
                    <aside className="chat-sidebar">

                        <div className="chat-sidebar-header">
                            <div>
                                <h3>Students</h3>
                                <p>Select someone to chat with</p>
                            </div>

                            <span className="chat-student-count">
                                {students.length}
                            </span>
                        </div>

                        <div className="chat-student-list">

                            {students.length === 0 ? (
                                <div className="chat-empty-students">
                                    <div className="chat-empty-icon">
                                        👥
                                    </div>

                                    <p>No students available.</p>
                                </div>
                            ) : (
                                students.map((student) => (
                                    <button
                                        key={student._id}
                                        className={`chat-student ${
                                            receiverId === student._id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setReceiverId(student._id);
                                            setReceiverName(student.name);
                                        }}
                                    >
                                        <div className="chat-avatar">
                                            {student.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="chat-student-info">
                                            <strong>
                                                {student.name}
                                            </strong>

                                            <span>
                                                {student.email}
                                            </span>
                                        </div>

                                        {receiverId === student._id && (
                                            <span className="chat-active-dot">
                                                ●
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}

                        </div>

                    </aside>

                    {/* Chat Area */}
                    <section className="chat-window">

                        <div className="chat-window-header">

                            <div className="chat-current-user">

                                <div className="chat-large-avatar">
                                    {receiverName
                                        ? receiverName
                                              .charAt(0)
                                              .toUpperCase()
                                        : "?"}
                                </div>

                                <div>
                                    <h2>
                                        {receiverName || "Select a student"}
                                    </h2>

                                    <span>
                                        {receiverName
                                            ? "Student connection"
                                            : "Choose someone from the list"}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Messages */}
                        <div className="chat-messages">

                            {!receiverId ? (
                                <div className="chat-welcome">
                                    <div className="chat-welcome-icon">
                                        💬
                                    </div>

                                    <h3>Select a student</h3>

                                    <p>
                                        Choose a student from the left to
                                        start chatting.
                                    </p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="chat-welcome">
                                    <div className="chat-welcome-icon">
                                        ✉
                                    </div>

                                    <h3>No messages yet</h3>

                                    <p>
                                        Start the conversation with{" "}
                                        <strong>{receiverName}</strong>.
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`chat-message ${
                                            msg.sender._id === receiverId
                                                ? "received"
                                                : "sent"
                                        }`}
                                    >
                                        <div className="chat-message-bubble">
                                            <span className="chat-message-sender">
                                                {msg.sender.name}
                                            </span>

                                            <p>{msg.message}</p>

                                            <small>
                                                {new Date(
                                                    msg.createdAt
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </small>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>

                        {/* Message Form */}
                        <form
                            className="chat-input-area"
                            onSubmit={sendMessage}
                        >
                            <input
                                type="text"
                                placeholder={
                                    receiverName
                                        ? `Message ${receiverName}...`
                                        : "Select a student first..."
                                }
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                disabled={!receiverId}
                            />

                            <button
                                type="submit"
                                disabled={
                                    !receiverId || message.trim() === ""
                                }
                            >
                                <span>Send</span>
                                <span className="chat-send-icon">➤</span>
                            </button>
                        </form>

                    </section>

                </div>

            </main>
        </div>
    );
}

export default Chat;