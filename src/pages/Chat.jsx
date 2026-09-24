import { useEffect, useState } from "react";

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

    // Select the first student automatically
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
        <div>
            <h1>Chat</h1>

            <label>
                Chat with:{" "}
            </label>

            <select
                value={receiverId}
                onChange={handleStudentChange}
            >
                {students.map((student) => (
                    <option
                        key={student._id}
                        value={student._id}
                    >
                        {student.name}
                    </option>
                ))}
            </select>

            <h2>Chat with {receiverName}</h2>

            <div>
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id}>
                            <strong>{msg.sender.name}:</strong>{" "}
                            {msg.message}
                        </div>
                    ))
                )}
            </div>

            <br />

            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                />

                <button type="submit">
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;