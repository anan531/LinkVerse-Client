import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from "react-router-dom";import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

const [activeSection, setActiveSection] = useState("dashboard");
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalPosts: 0,
        totalOpportunities: 0,
        totalCollaborations: 0,
        totalConnections: 0,
        collaborationParticipants: 0,
        opportunitiesByType: [],
        totalRegisteredUsers: 0,
        totalPendingConnections: 0
    });

    const [students, setStudents] = useState([]);
    const [posts, setPosts] = useState([]);
    const [opportunities, setOpportunities] = useState([]);

    const fetchDashboard = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setStats(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        }
    };

    const fetchStudents = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/students",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setStudents(data.students);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const fetchPosts = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPosts(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchOpportunities = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/opportunities",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setOpportunities(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        }
    };

    const deleteStudent = async (studentId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/students/${studentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                fetchStudents();
                fetchDashboard();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Unable to delete student");
        }
    };

    const deletePost = async (postId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/posts/${postId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                fetchPosts();
                fetchDashboard();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Unable to delete post");
        }
    };

    const deleteOpportunity = async (opportunityId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this opportunity?"
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/opportunities/${opportunityId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                fetchOpportunities();
                fetchDashboard();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            alert("Unable to delete opportunity");
        }
    };

    const editOpportunity = (opportunityId) => {
        navigate(`/edit-opportunity/${opportunityId}`);
    };

    const generateStudentReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("LinkVerse - Student Report", 20, 20);

        doc.setFontSize(11);
        doc.text(`Total Students: ${students.length}`, 20, 30);

        let y = 45;

        students.forEach((student, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(12);
            doc.text(
                `${index + 1}. ${student.name || "Not specified"}`,
                20,
                y
            );

            doc.setFontSize(10);

            doc.text(
                `Email: ${student.email || "Not specified"}`,
                25,
                y + 7
            );

            doc.text(
                `College: ${student.college || "Not specified"}`,
                25,
                y + 14
            );

            doc.text(
                `Department: ${student.department || "Not specified"}`,
                25,
                y + 21
            );

            doc.text(
                `Course: ${student.course || "Not specified"}`,
                25,
                y + 28
            );

            doc.text(
                `Year: ${student.year || "Not specified"}`,
                25,
                y + 35
            );

            doc.text(
                `Skills: ${
                    student.skills && student.skills.length > 0
                        ? student.skills.join(", ")
                        : "None"
                }`,
                25,
                y + 42
            );

            doc.text(
                `Interests: ${
                    student.interests && student.interests.length > 0
                        ? student.interests.join(", ")
                        : "None"
                }`,
                25,
                y + 49
            );

            y += 62;
        });

        doc.save("LinkVerse-Student-Report.pdf");
    };

    useEffect(() => {
        fetchDashboard();
        fetchStudents();
        fetchPosts();
        fetchOpportunities();
    }, []);

useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");

    if (
        section === "dashboard" ||
        section === "students" ||
        section === "posts" ||
        section === "opportunities"
    ) {
        setActiveSection(section);
    } else {
        setActiveSection("dashboard");
    }
}, [location.search]);

    const renderDashboard = () => {
        return (
            <>
                <div className="admin-page-heading">
                    <div>
                        <p className="admin-small-title">
                            ADMINISTRATION
                        </p>

                        <h1>Dashboard</h1>

                        <p>
                            Overview of the LinkVerse platform.
                        </p>
                    </div>

                    <div className="admin-profile">
                        <div className="admin-avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>
                            <span>Admin</span>
                        </div>
                    </div>
                </div>

                {/* WELCOME BANNER */}

                <section className="admin-welcome-card">

                    <div className="admin-welcome-icon">
                        LV
                    </div>

                    <div>
                        <p className="admin-section-label">
                            LINKVERSE ADMINISTRATION
                        </p>

                        <h2>
                            Welcome, Administrator
                        </h2>

                        <p>
                            Use the sidebar to manage students,
                            posts and opportunities.
                        </p>
                    </div>

                </section>

                {/* BASIC STATISTICS */}

                <section className="admin-stats">

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            ♙
                        </div>

                        <div>
                            <p>Total Students</p>
                            <h2>{stats.totalStudents}</h2>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            ◫
                        </div>

                        <div>
                            <p>Total Posts</p>
                            <h2>{stats.totalPosts}</h2>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            ◆
                        </div>

                        <div>
                            <p>Opportunities</p>
                            <h2>{stats.totalOpportunities}</h2>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            ◇
                        </div>

                        <div>
                            <p>Collaborations</p>
                            <h2>{stats.totalCollaborations}</h2>
                        </div>
                    </div>

                </section>

                {/* STUDENT ACTIVITY */}

                <section className="admin-analytics-section">

                    <div className="admin-analytics-heading">
                        <div>
                            <p className="admin-small-title">
                                STUDENT ACTIVITY
                            </p>

                            <h2>
                                Student Activity Statistics
                            </h2>
                        </div>
                    </div>

                    <div className="admin-analytics-grid">

                        <div className="admin-analytics-card">
                            <div className="admin-analytics-icon">
                                🔗
                            </div>

                            <div>
                                <p>Total Connections</p>
                                <h3>
                                    {stats.totalConnections}
                                </h3>
                            </div>
                        </div>

                        <div className="admin-analytics-card">
                            <div className="admin-analytics-icon">
                                📝
                            </div>

                            <div>
                                <p>Total Posts</p>
                                <h3>
                                    {stats.totalPosts}
                                </h3>
                            </div>
                        </div>

                        <div className="admin-analytics-card">
                            <div className="admin-analytics-icon">
                                👥
                            </div>

                            <div>
                                <p>Collaboration Participants</p>
                                <h3>
                                    {stats.collaborationParticipants}
                                </h3>
                            </div>
                        </div>

                    </div>

                </section>

                {/* OPPORTUNITY STATISTICS */}

                <section className="admin-analytics-section">

                    <div className="admin-analytics-heading">
                        <div>
                            <p className="admin-small-title">
                                OPPORTUNITIES
                            </p>

                            <h2>
                                Opportunity Statistics
                            </h2>
                        </div>

                        <div className="admin-analytics-total">
                            Total: {stats.totalOpportunities}
                        </div>
                    </div>

                    <div className="admin-opportunity-stats">

                        {stats.opportunitiesByType &&
                        stats.opportunitiesByType.length > 0 ? (

                            stats.opportunitiesByType.map(
                                (item) => (
                                    <div
                                        className="admin-opportunity-stat"
                                        key={item.type}
                                    >
                                        <span>
                                            {item.type}
                                        </span>

                                        <strong>
                                            {item.count}
                                        </strong>
                                    </div>
                                )
                            )

                        ) : (

                            <div className="admin-empty">
                                No opportunity data available.
                            </div>

                        )}

                    </div>

                </section>

                {/* ADMIN MONITORING */}

                <section className="admin-analytics-section">

                    <div className="admin-analytics-heading">
                        <div>
                            <p className="admin-small-title">
                                PLATFORM MONITORING
                            </p>

                            <h2>
                                Admin Monitoring
                            </h2>
                        </div>
                    </div>

                    <div className="admin-monitoring-grid">

                        <div className="admin-monitoring-card">
                            <span>
                                Registered Users
                            </span>

                            <strong>
                                {stats.totalRegisteredUsers}
                            </strong>
                        </div>

                        <div className="admin-monitoring-card">
                            <span>
                                Pending Connections
                            </span>

                            <strong>
                                {stats.totalPendingConnections}
                            </strong>
                        </div>

                        <div className="admin-monitoring-card">
                            <span>
                                Active Collaborations
                            </span>

                            <strong>
                                {stats.totalCollaborations}
                            </strong>
                        </div>

                        <div className="admin-monitoring-card">
                            <span>
                                Available Opportunities
                            </span>

                            <strong>
                                {stats.totalOpportunities}
                            </strong>
                        </div>

                    </div>

                </section>

            </>
        );
    };

    const renderStudents = () => {
        return (
            <section className="admin-management-page">

                <div className="admin-page-heading">

                    <div>
                        <p className="admin-small-title">
                            USER MANAGEMENT
                        </p>

                        <h1>Students</h1>

                        <p>
                            View and manage registered students.
                        </p>
                    </div>

                    <div className="admin-opportunity-heading-actions">

                        <span className="admin-count">
                            {students.length} students
                        </span>

                        <button
                            className="admin-edit-button"
                            onClick={generateStudentReport}
                        >
                            Generate Student Report PDF
                        </button>

                    </div>

                </div>

                {students.length === 0 ? (

                    <div className="admin-empty">
                        No students found.
                    </div>

                ) : (

                    <div className="admin-student-grid">

                        {students.map((student) => (

                            <div
                                className="admin-student-card"
                                key={student._id}
                            >

                                <div className="admin-card-top">

                                    <div className="admin-user-avatar">
                                        {student.name
                                            ? student.name
                                                .charAt(0)
                                                .toUpperCase()
                                            : "S"}
                                    </div>

                                    <div>
                                        <h3>
                                            {student.name}
                                        </h3>

                                        <p>
                                            {student.email}
                                        </p>
                                    </div>

                                </div>

                                <div className="admin-student-details">

                                    <span>
                                        <strong>
                                            College
                                        </strong>

                                        {student.college ||
                                            "Not specified"}
                                    </span>

                                    <span>
                                        <strong>
                                            Department
                                        </strong>

                                        {student.department ||
                                            "Not specified"}
                                    </span>

                                    <span>
                                        <strong>
                                            Course
                                        </strong>

                                        {student.course ||
                                            "Not specified"}
                                    </span>

                                    <span>
                                        <strong>
                                            Year
                                        </strong>

                                        {student.year ||
                                            "Not specified"}
                                    </span>

                                </div>

                                <button
                                    className="admin-delete-button"
                                    onClick={() =>
                                        deleteStudent(student._id)
                                    }
                                >
                                    Delete Student
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </section>
        );
    };

    const renderPosts = () => {
        return (
            <section className="admin-management-page">

                <div className="admin-page-heading">

                    <div>
                        <p className="admin-small-title">
                            CONTENT MANAGEMENT
                        </p>

                        <h1>Post Management</h1>

                        <p>
                            View and manage student feed posts.
                        </p>
                    </div>

                    <span className="admin-count">
                        {posts.length} posts
                    </span>

                </div>

                {posts.length === 0 ? (

                    <div className="admin-empty">
                        No posts found.
                    </div>

                ) : (

                    <div className="admin-content-list">

                        {posts.map((post) => (

                            <div
                                className="admin-content-card"
                                key={post._id}
                            >

                                <div className="admin-card-top">

                                    <div className="admin-user-avatar">
                                        {post.createdBy?.name
                                            ? post.createdBy.name
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}
                                    </div>

                                    <div>
                                        <h3>
                                            {post.createdBy?.name ||
                                                "Unknown User"}
                                        </h3>

                                        <p>
                                            {post.createdBy?.email ||
                                                "No email available"}
                                        </p>
                                    </div>

                                </div>

                                <p className="admin-post-content">
                                    {post.content}
                                </p>

                                <div className="admin-content-footer">

                                    <span>
                                        Likes:{" "}
                                        {post.likes
                                            ? post.likes.length
                                            : 0}
                                    </span>

                                    <button
                                        className="admin-delete-button"
                                        onClick={() =>
                                            deletePost(post._id)
                                        }
                                    >
                                        Delete Post
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>
        );
    };

    const renderOpportunities = () => {
        return (
            <section className="admin-management-page">

                <div className="admin-page-heading">

                    <div>
                        <p className="admin-small-title">
                            OPPORTUNITY MANAGEMENT
                        </p>

                        <h1>Opportunities</h1>

                        <p>
                            Create and manage opportunities for students.
                        </p>
                    </div>

                    <div className="admin-opportunity-heading-actions">

                        <span className="admin-count">
                            {opportunities.length} opportunities
                        </span>

                        <button
                            className="admin-create-opportunity-button"
                            onClick={() =>
                                navigate("/create-opportunity")
                            }
                        >
                            + Create Opportunity
                        </button>

                    </div>

                </div>

                {opportunities.length === 0 ? (

                    <div className="admin-empty">

                        <p>
                            No opportunities found.
                        </p>

                        <button
                            className="admin-empty-create-button"
                            onClick={() =>
                                navigate("/create-opportunity")
                            }
                        >
                            + Create Your First Opportunity
                        </button>

                    </div>

                ) : (

                    <div className="admin-content-list">

                        {opportunities.map((opportunity) => (

                            <div
                                className="admin-opportunity-card"
                                key={opportunity._id}
                            >

                                <div className="admin-opportunity-header">

                                    <div>

                                        <span className="admin-opportunity-type">
                                            {opportunity.type}
                                        </span>

                                        <h3>
                                            {opportunity.title}
                                        </h3>

                                        <p>
                                            {opportunity.organization}
                                        </p>

                                    </div>

                                </div>

                                <p className="admin-opportunity-description">
                                    {opportunity.description}
                                </p>

                                <div className="admin-opportunity-info">

                                    <span>
                                        <strong>
                                            Location
                                        </strong>

                                        {opportunity.location ||
                                            "Not specified"}
                                    </span>

                                    <span>
                                        <strong>
                                            Deadline
                                        </strong>

                                        {opportunity.deadline ||
                                            "Not specified"}
                                    </span>

                                </div>

                                {opportunity.link && (
                                    <a
                                        href={opportunity.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-opportunity-link"
                                    >
                                        View Opportunity →
                                    </a>
                                )}

                                <div className="admin-opportunity-actions">

                                    <button
                                        className="admin-edit-button"
                                        onClick={() =>
                                            editOpportunity(
                                                opportunity._id
                                            )
                                        }
                                    >
                                        Edit Opportunity
                                    </button>

                                    <button
                                        className="admin-delete-button"
                                        onClick={() =>
                                            deleteOpportunity(
                                                opportunity._id
                                            )
                                        }
                                    >
                                        Delete Opportunity
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>
        );
    };

    return (
        <div className="admin-dashboard">

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="admin-brand-mark">
                        L
                    </div>

                    <span>
                        LinkVerse
                    </span>

                </div>

                <div className="admin-sidebar-content">

                    <p className="admin-panel-label">
                        ADMIN PANEL
                    </p>

                    <button
                        className={`admin-sidebar-item ${
                            activeSection === "dashboard"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setActiveSection("dashboard");
                            navigate("/admin-dashboard?section=dashboard");
                        }}
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            activeSection === "students"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setActiveSection("students");
                            navigate("/admin-dashboard?section=students");
                        }}
                    >
                        <span>♙</span>
                        Students
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            activeSection === "posts"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setActiveSection("posts");
                            navigate("/admin-dashboard?section=posts");
                        }}
                    >
                        <span>◫</span>
                        Posts
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            activeSection === "opportunities"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setActiveSection("opportunities");
                            navigate("/admin-dashboard?section=opportunities");
                        }}
                    >
                        <span>◆</span>
                        Opportunities
                    </button>

                    <button
                        className="admin-sidebar-item"
                        onClick={() =>
                            navigate("/create-opportunity")
                        }
                    >
                        <span>＋</span>
                        Create Opportunity
                    </button>

                </div>

                <div className="admin-sidebar-footer">

                    <span>
                        Administrator
                    </span>

                    <button
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>

            <main className="admin-main">

                {activeSection === "dashboard" &&
                    renderDashboard()}

                {activeSection === "students" &&
                    renderStudents()}

                {activeSection === "posts" &&
                    renderPosts()}

                {activeSection === "opportunities" &&
                    renderOpportunities()}

            </main>

        </div>
    );
}

export default AdminDashboard;