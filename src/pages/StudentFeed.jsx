import { useEffect, useState } from "react";

function StudentFeed() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");

    const [comments, setComments] = useState({});
    const [commentText, setCommentText] = useState({});

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
            setCurrentUserId(user._id);
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
        <div>
            <h1>Student Feed</h1>

            <h2>Create a Post</h2>

            <form onSubmit={createPost}>
                <textarea
                    placeholder="Write something..."
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                />

                <br />

                <button type="submit">
                    Post
                </button>
            </form>

            <hr />

            <h2>Posts</h2>

            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id}>
                        <h3>{post.createdBy.name}</h3>

                        <p>{post.content}</p>

                        <small>
                            {new Date(
                                post.createdAt
                            ).toLocaleString()}
                        </small>

                        <br />
                        <br />

                        <button
                            onClick={() =>
                                likePost(post._id)
                            }
                        >
                            {post.likes &&
                            post.likes.includes(currentUserId)
                                ? "Unlike"
                                : "Like"}
                        </button>

                        <span>
                            {" "}
                            {post.likes
                                ? post.likes.length
                                : 0}{" "}
                            likes
                        </span>

                        <br />
                        <br />

                        <button
                            onClick={() =>
                                fetchComments(post._id)
                            }
                        >
                            Show Comments
                        </button>

                        {comments[post._id] && (
                            <div>
                                <h4>Comments</h4>

                                {comments[post._id].length ===
                                0 ? (
                                    <p>
                                        No comments yet.
                                    </p>
                                ) : (
                                    comments[post._id].map(
                                        (comment) => (
                                            <p
                                                key={
                                                    comment._id
                                                }
                                            >
                                                <strong>
                                                    {
                                                        comment
                                                            .createdBy
                                                            .name
                                                    }
                                                    :
                                                </strong>{" "}
                                                {
                                                    comment.content
                                                }
                                            </p>
                                        )
                                    )
                                )}

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
                                                    e.target.value,
                                            })
                                        )
                                    }
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
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default StudentFeed;