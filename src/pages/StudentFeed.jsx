import { useEffect, useState } from "react";
import "./StudentFeed.css";

function StudentFeed() {
    const [posts, setPosts] = useState([]);
const [content, setContent] = useState("");
const [currentUserId, setCurrentUserId] = useState("");

const [editingPostId, setEditingPostId] = useState(null);
const [editContent, setEditContent] = useState("");

    const [comments, setComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [showComments, setShowComments] = useState(null);

    // Fetch posts
    const fetchPosts = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPosts(data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Get current user and fetch posts
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setCurrentUserId(user._id || user.id);
        }

        fetchPosts();
    }, []);

    // Create a post
    const createPost = async (e) => {
        e.preventDefault();

        if (content.trim() === "") {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: content,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setContent("");
                fetchPosts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Unable to create post");
        }
    };

    // Edit a post
const editPost = async (postId) => {
    if (editContent.trim() === "") {
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `http://localhost:5000/api/posts/${postId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: editContent,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            setEditingPostId(null);
            setEditContent("");
            fetchPosts();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error editing post:", error);
        alert("Unable to edit post");
    }
};

    // Like or unlike a post
    const likePost = async (postId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/posts/${postId}/like`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                fetchPosts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    // Fetch comments for a post
    const fetchComments = async (postId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/comments/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setComments((prev) => ({
                    ...prev,
                    [postId]: data,
                }));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Add a comment
    const addComment = async (postId) => {
        const text = commentText[postId] || "";

        if (text.trim() === "") {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/comments/${postId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: text,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setCommentText((prev) => ({
                    ...prev,
                    [postId]: "",
                }));

                fetchComments(postId);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="feed-page">

            {/* Top Bar */}
            <header className="feed-topbar">
                <div className="feed-brand">
                    <div className="feed-logo-box">
                        L
                    </div>

                    <div>
                        <h2>LinkVerse</h2>
                        <span>Student Networking Platform</span>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="feed-hero">
                <div className="feed-hero-content">
                    <p className="feed-eyebrow">
                        STUDENT COMMUNITY
                    </p>

                    <h1>Student Feed</h1>

                    <p>
                        Share ideas, updates and experiences with
                        your fellow students.
                    </p>
                </div>
            </section>

            {/* Main */}
            <main className="feed-main">

                {/* Create Post */}
                <section className="create-post-card">

                    <div className="feed-section-heading">
                        <div className="feed-heading-icon">
                            ✎
                        </div>

                        <div>
                            <h2>Create a Post</h2>
                            <p>
                                Share something with the LinkVerse community.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={createPost}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                        />

                        <div className="create-post-footer">
                            <span>
                                {content.length} characters
                            </span>

                            <button type="submit">
                                Post
                                <span>→</span>
                            </button>
                        </div>
                    </form>

                </section>

                {/* Feed Heading */}
                <div className="feed-title-row">
                    <div>
                        <h2>Community Posts</h2>
                        <p>
                            See what students are sharing.
                        </p>
                    </div>

                    <span className="post-count">
                        {posts.length}{" "}
                        {posts.length === 1
                            ? "post"
                            : "posts"}
                    </span>
                </div>

                {/* Posts */}
                {posts.length === 0 ? (
                    <div className="feed-empty">

                        <div className="feed-empty-icon">
                            ✦
                        </div>

                        <h3>No posts yet</h3>

                        <p>
                            Be the first student to share something
                            with the community.
                        </p>

                    </div>
                ) : (
                    <div className="posts-list">

                        {posts.map((post) => {

                            const isLiked =
                                post.likes &&
                                post.likes.some(
                                    (like) =>
                                        like === currentUserId ||
                                        like?._id === currentUserId
                                );

                            return (
                                <article
                                    className="post-card"
                                    key={post._id}
                                >

                                    {/* Post Header */}
                                    <div className="post-header">

                                        <div className="post-user-avatar">
                                            {post.createdBy.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="post-user-info">
                                            <h3>
                                                {post.createdBy.name}
                                            </h3>

                                            <span>
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleString()}
                                            </span>
                                        </div>

                                    </div>

{/* Post Content */}
<div className="post-content">

    {editingPostId === post._id ? (
        <div className="edit-post-area">

            <textarea
                value={editContent}
                onChange={(e) =>
                    setEditContent(e.target.value)
                }
            />

            <div className="edit-post-buttons">

                <button
                    className="save-edit-button"
                    onClick={() =>
                        editPost(post._id)
                    }
                >
                    Save
                </button>

                <button
                    className="cancel-edit-button"
                    onClick={() => {
                        setEditingPostId(null);
                        setEditContent("");
                    }}
                >
                    Cancel
                </button>

            </div>

        </div>
    ) : (
        post.content
    )}

</div>

                                  {/* Post Actions */}
<div className="post-actions">

    {post.createdBy._id === currentUserId && (
        <button
            className="edit-post-button"
            onClick={() => {
                setEditingPostId(post._id);
                setEditContent(post.content);
            }}
        >
            ✎ Edit
        </button>
    )}

    <button
        className={
            isLiked
                ? "liked"
                : ""
        }
        onClick={() =>
            likePost(post._id)
        }
    >
        <span>
            {isLiked
                ? "♥"
                : "♡"}
        </span>

        {isLiked
            ? "Unlike"
            : "Like"}
    </button>
                                        <span className="like-count">
                                            {post.likes
                                                ? post.likes.length
                                                : 0}{" "}
                                            {post.likes &&
                                            post.likes.length === 1
                                                ? "like"
                                                : "likes"}
                                        </span>

<button
    className="comment-toggle"
    onClick={() => {
        if (showComments === post._id) {
            setShowComments(null);
        } else {
            setShowComments(post._id);
            fetchComments(post._id);
        }
    }}
>
    💬 {showComments === post._id
        ? "Hide Comments"
        : "Comments"}
</button>

                                    </div>

                                    {/* Comments */}
{showComments === post._id && comments[post._id] && (                                        <div className="comments-section">

                                            <div className="comments-heading">
                                                Comments
                                            </div>

                                            {comments[post._id].length ===
                                            0 ? (
                                                <p className="no-comments">
                                                    No comments yet.
                                                </p>
                                            ) : (
                                                <div className="comments-list">

                                                    {comments[
                                                        post._id
                                                    ].map(
                                                        (comment) => (
                                                            <div
                                                                className="comment"
                                                                key={
                                                                    comment._id
                                                                }
                                                            >

                                                                <div className="comment-avatar">
                                                                    {comment
                                                                        .createdBy
                                                                        .name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div className="comment-body">
                                                                    <strong>
                                                                        {
                                                                            comment
                                                                                .createdBy
                                                                                .name
                                                                        }
                                                                    </strong>

                                                                    <p>
                                                                        {
                                                                            comment.content
                                                                        }
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                            {/* Add Comment */}
                                            <div className="comment-input-area">

                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={
                                                        commentText[
                                                            post._id
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setCommentText(
                                                            (prev) => ({
                                                                ...prev,
                                                                [post._id]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key ===
                                                            "Enter"
                                                        ) {
                                                            e.preventDefault();
                                                            addComment(
                                                                post._id
                                                            );
                                                        }
                                                    }}
                                                />

                                                <button
                                                    onClick={() =>
                                                        addComment(
                                                            post._id
                                                        )
                                                    }
                                                >
                                                    Comment
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                </article>
                            );
                        })}

                    </div>
                )}

            </main>
        </div>
    );
}

export default StudentFeed;