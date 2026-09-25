import { useEffect, useState } from "react";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalPosts: 0,
        totalOpportunities: 0,
        totalCollaborations: 0
    });

    const [students, setStudents] = useState([]);
    const [posts, setPosts] = useState([]);

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

    const deleteStudent = async (studentId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

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

        if (!confirmDelete) {
            return;
        }

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

    useEffect(() => {
        fetchDashboard();
        fetchStudents();
        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <h2>Statistics</h2>

            <p>Total Students: {stats.totalStudents}</p>

            <p>Total Posts: {stats.totalPosts}</p>

            <p>
                Total Opportunities:{" "}
                {stats.totalOpportunities}
            </p>

            <p>
                Total Collaborations:{" "}
                {stats.totalCollaborations}
            </p>

            <hr />

            <h2>Students</h2>

            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                students.map((student) => (
                    <div key={student._id}>
                        <h3>{student.name}</h3>

                        <p>Email: {student.email}</p>
                        <p>College: {student.college}</p>
                        <p>Course: {student.course}</p>
                        <p>Year: {student.year}</p>

                        <button
                            onClick={() =>
                                deleteStudent(student._id)
                            }
                        >
                            Delete Student
                        </button>

                        <hr />
                    </div>
                ))
            )}

            <h2>Post Management</h2>

            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id}>
                        <h3>{post.createdBy.name}</h3>

                        <p>{post.content}</p>

                        <p>
                            Likes:{" "}
                            {post.likes
                                ? post.likes.length
                                : 0}
                        </p>

                        <button
                            onClick={() =>
                                deletePost(post._id)
                            }
                        >
                            Delete Post
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminDashboard;