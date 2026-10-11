import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

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

    // Calculate the number of students in each department
const departmentStats = [
    ...students.reduce((counts, student) => {
        const department =
            (student.department || "").trim() || "Not specified";

        // Group department names without case sensitivity
        const key = department.toLowerCase();

        if (!counts.has(key)) {
            counts.set(key, {
                department,
                count: 0
            });
        }

        counts.get(key).count += 1;

        return counts;
    }, new Map()).values()
].sort((a, b) =>
    a.department.localeCompare(b.department)
);

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

const generateStudentReportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const navy = [4, 37, 88];
    const blue = [37, 99, 235];
    const gray = [90, 100, 115];

    let y = 43;

    // LinkVerse branding
    const addHeader = () => {
        doc.setFillColor(...navy);
        doc.rect(0, 0, pageWidth, 30, "F");

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, 7, 16, 16, 2, 2, "F");

        doc.setTextColor(...navy);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("L", 19.5, 18);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(19);
        doc.text("LinkVerse", 35, 18);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("STUDENT DIRECTORY REPORT", pageWidth - 14, 18, {
            align: "right"
        });
    };

    const addFooter = (pageNumber, totalPages) => {
        doc.setDrawColor(220, 225, 235);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

        doc.setTextColor(...gray);
        doc.setFontSize(9);
        doc.text("LinkVerse | Student Report", 14, pageHeight - 8);
        doc.text(
            `Page ${pageNumber} of ${totalPages}`,
            pageWidth - 14,
            pageHeight - 8,
            { align: "right" }
        );
    };

    addHeader();

    doc.setTextColor(...navy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Student Directory", 14, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text(
        `Total registered students: ${students.length}`,
        14,
        y
    );
    doc.text(
        `Generated: ${new Date().toLocaleDateString("en-IN")}`,
        pageWidth - 14,
        y,
        { align: "right" }
    );

    y += 13;

    if (students.length === 0) {
        doc.setTextColor(...gray);
        doc.text("No student records available.", 14, y);
    }

    students.forEach((student, index) => {
        if (y + 52 > pageHeight - 22) {
            doc.addPage();
            addHeader();
            y = 42;
        }

        // Student card
        doc.setFillColor(245, 248, 253);
        doc.roundedRect(
            14,
            y - 5,
            pageWidth - 28,
            47,
            3,
            3,
            "F"
        );

        doc.setFillColor(...blue);
        doc.roundedRect(18, y, 7, 7, 2, 2, "F");

        doc.setTextColor(...navy);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(
            `${index + 1}. ${student.name || "Not specified"}`,
            29,
            y + 6
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...gray);

        const details = [
            `Email: ${student.email || "Not specified"}`,
            `College: ${student.college || "Not specified"}`,
            `Department: ${student.department || "Not specified"}`,
            `Course: ${student.course || "Not specified"}`,
            `Year: ${student.year || "Not specified"}`,
            `Skills: ${
                Array.isArray(student.skills) && student.skills.length
                    ? student.skills.join(", ")
                    : "None"
            }`,
            `Interests: ${
                Array.isArray(student.interests) && student.interests.length
                    ? student.interests.join(", ")
                    : "None"
            }`
        ];

        let detailY = y + 14;

        details.forEach((detail) => {
            const lines = doc.splitTextToSize(detail, pageWidth - 48);

            doc.text(lines, 20, detailY);
            detailY += lines.length * 4.5;
        });

        y += 53;
    });

    const totalPages = doc.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);
        addFooter(page, totalPages);
    }

    doc.save("LinkVerse-Student-Report.pdf");
};

const generateStudentReportPPT = async () => {
    const pptx = new PptxGenJS();

    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "LinkVerse Administration";
    pptx.subject = "Student Directory Report";
    pptx.title = "LinkVerse Student Report";
    pptx.company = "LinkVerse";

    pptx.theme = {
        headFontFace: "Aptos Display",
        bodyFontFace: "Aptos",
        lang: "en-US"
    };

    const navy = "042558";
    const blue = "2563EB";
    const light = "F3F6FC";
    const gray = "5A6473";

    // Add consistent branding to slides
    const addSlideBranding = (slide, slideNumber) => {
        slide.background = { color: "FFFFFF" };

        slide.addShape(pptx.ShapeType.rect, {
            x: 0,
            y: 0,
            w: 13.333,
            h: 0.75,
            line: { color: navy },
            fill: { color: navy }
        });

        slide.addShape(pptx.ShapeType.roundRect, {
            x: 0.45,
            y: 0.13,
            w: 0.48,
            h: 0.48,
            rectRadius: 0.05,
            line: { color: "FFFFFF" },
            fill: { color: "FFFFFF" }
        });

        slide.addText("L", {
            x: 0.45,
            y: 0.16,
            w: 0.48,
            h: 0.4,
            fontFace: "Aptos Display",
            fontSize: 22,
            bold: true,
            color: navy,
            align: "center",
            margin: 0
        });

        slide.addText("LinkVerse", {
            x: 1.08,
            y: 0.18,
            w: 3,
            h: 0.35,
            fontSize: 22,
            bold: true,
            color: "FFFFFF",
            margin: 0
        });

        slide.addText("STUDENT REPORT", {
            x: 9.5,
            y: 0.25,
            w: 3.3,
            h: 0.25,
            fontSize: 10,
            color: "FFFFFF",
            align: "right",
            charSpacing: 1,
            margin: 0
        });

        slide.addShape(pptx.ShapeType.line, {
            x: 0.45,
            y: 7.12,
            w: 12.4,
            h: 0,
            line: { color: "DCE3EF", width: 1 }
        });

        slide.addText(`LinkVerse | ${slideNumber}`, {
            x: 9.5,
            y: 7.18,
            w: 3.3,
            h: 0.2,
            fontSize: 9,
            color: gray,
            align: "right",
            margin: 0
        });
    };

    // Cover slide
    const cover = pptx.addSlide();
    cover.background = { color: navy };

    cover.addShape(pptx.ShapeType.roundRect, {
        x: 0.9,
        y: 1.0,
        w: 0.9,
        h: 0.9,
        line: { color: "FFFFFF" },
        fill: { color: "FFFFFF" }
    });

    cover.addText("L", {
        x: 0.9,
        y: 1.12,
        w: 0.9,
        h: 0.6,
        fontSize: 42,
        bold: true,
        color: navy,
        align: "center",
        margin: 0
    });

    cover.addText("LinkVerse", {
        x: 0.9,
        y: 2.25,
        w: 10.5,
        h: 0.8,
        fontSize: 38,
        bold: true,
        color: "FFFFFF",
        margin: 0
    });

    cover.addText("Student Directory Report", {
        x: 0.9,
        y: 3.2,
        w: 10.5,
        h: 0.6,
        fontSize: 26,
        color: "DCE8FF",
        margin: 0
    });

    cover.addText(
        `Total registered students: ${students.length}\nGenerated: ${new Date().toLocaleDateString("en-IN")}`,
        {
            x: 0.95,
            y: 4.25,
            w: 8,
            h: 0.8,
            fontSize: 17,
            color: "FFFFFF",
            breakLine: false,
            lineSpacingMultiple: 1.2,
            margin: 0
        }
    );

    cover.addText("ADMINISTRATION", {
        x: 0.95,
        y: 6.55,
        w: 5,
        h: 0.3,
        fontSize: 12,
        bold: true,
        charSpacing: 2,
        color: "AFC8FF",
        margin: 0
    });

    // Overview slide
    const overview = pptx.addSlide();
    addSlideBranding(overview, 2);

    overview.addText("Student Overview", {
        x: 0.6,
        y: 1.1,
        w: 8,
        h: 0.55,
        fontSize: 28,
        bold: true,
        color: navy,
        margin: 0
    });

    overview.addShape(pptx.ShapeType.roundRect, {
        x: 0.6,
        y: 2.0,
        w: 5.0,
        h: 1.65,
        rectRadius: 0.08,
        line: { color: light },
        fill: { color: light }
    });

    overview.addText("TOTAL STUDENTS", {
        x: 0.95,
        y: 2.35,
        w: 4.3,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: gray,
        margin: 0
    });

    overview.addText(String(students.length), {
        x: 0.95,
        y: 2.75,
        w: 4.3,
        h: 0.65,
        fontSize: 36,
        bold: true,
        color: blue,
        margin: 0
    });

    const departmentCounts = departmentStats
        .map((item) => `${item.department}: ${item.count}`)
        .join("\n");

    overview.addText("Students by Department", {
        x: 0.6,
        y: 4.15,
        w: 7,
        h: 0.4,
        fontSize: 20,
        bold: true,
        color: navy,
        margin: 0
    });

    overview.addText(
        departmentCounts || "No student data available.",
        {
            x: 0.7,
            y: 4.75,
            w: 7.5,
            h: 1.7,
            fontSize: 15,
            color: gray,
            breakLine: false,
            margin: 0.05,
            valign: "top",
            fit: "shrink"
        }
    );

    // Individual student slides
    students.forEach((student, index) => {
        const slide = pptx.addSlide();
        addSlideBranding(slide, index + 3);

        slide.addText("Student Profile", {
            x: 0.6,
            y: 1.05,
            w: 8,
            h: 0.5,
            fontSize: 27,
            bold: true,
            color: navy,
            margin: 0
        });

        slide.addText(student.name || "Not specified", {
            x: 0.65,
            y: 1.8,
            w: 11.8,
            h: 0.55,
            fontSize: 23,
            bold: true,
            color: blue,
            margin: 0
        });

        const details = [
            ["Email", student.email],
            ["College", student.college],
            ["Department", student.department],
            ["Course", student.course],
            ["Year", student.year],
            [
                "Skills",
                Array.isArray(student.skills)
                    ? student.skills.join(", ")
                    : student.skills
            ],
            [
                "Interests",
                Array.isArray(student.interests)
                    ? student.interests.join(", ")
                    : student.interests
            ]
        ];

        let y = 2.65;

        details.forEach(([label, value]) => {
            slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.65,
                y,
                w: 12,
                h: 0.48,
                rectRadius: 0.04,
                line: { color: light },
                fill: { color: light }
            });

            slide.addText(label, {
                x: 0.9,
                y: y + 0.1,
                w: 1.65,
                h: 0.25,
                fontSize: 12,
                bold: true,
                color: navy,
                margin: 0
            });

            slide.addText(String(value || "Not specified"), {
                x: 2.6,
                y: y + 0.08,
                w: 9.7,
                h: 0.3,
                fontSize: 12,
                color: gray,
                margin: 0,
                breakLine: false,
                fit: "shrink"
            });

            y += 0.58;
        });
    });

    await pptx.writeFile({
        fileName: "LinkVerse-Student-Report.pptx"
    });
};
const generateStudentReportCSV = () => {
    const headers = [
        "Name",
        "Email",
        "College",
        "Department",
        "Course",
        "Year",
        "Skills",
        "Interests"
    ];

    const escapeCSV = (value) => {
        const text = Array.isArray(value)
            ? value.join(", ")
            : String(value ?? "");

        return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = students.map((student) => [
        student.name,
        student.email,
        student.college,
        student.department,
        student.course,
        student.year,
        student.skills,
        student.interests
    ]);

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(","))
    ].join("\r\n");

    // BOM helps Excel display text correctly
    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "LinkVerse-Student-Report.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
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

                
{/* STUDENTS BY DEPARTMENT */}
<section className="admin-analytics-section">
    <div className="admin-analytics-heading">
        <div>
            <p className="admin-small-title">
                STUDENT DISTRIBUTION
            </p>

            <h2>Students by Department</h2>
        </div>
    </div>

    <div className="admin-opportunity-stats">
        {departmentStats.length > 0 ? (
            departmentStats.map((item) => (
                <div
                    className="admin-opportunity-stat"
                    key={item.department.toLowerCase()}
                >
                    <span>{item.department}</span>
                    <strong>{item.count}</strong>
                </div>
            ))
        ) : (
            <div className="admin-empty">
                No student data available.
            </div>
        )}
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

    <div className="student-export-actions">
        <button
            className="student-export-button"
            onClick={generateStudentReportPDF}
        >
            Export PDF
        </button>

        <button
            className="student-export-button"
            onClick={generateStudentReportPPT}
        >
            Export PPT
        </button>

        <button
            className="student-export-button"
            onClick={generateStudentReportCSV}
        >
            Export CSV
        </button>
    </div>

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