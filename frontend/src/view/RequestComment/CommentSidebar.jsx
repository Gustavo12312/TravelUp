import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { getUserid } from "../Auth/auth.utils";
import "./CommentSidebar.css"; // for optional sidebar styling

const baseUrl = "http://localhost:3000";

const CommentSidebar = ({ requestId, show, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        try {
            const response = await axios.get(baseUrl + '/comment/get/' + requestId, {
                headers: authHeader(),
            });
            setComments(response.data.data);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            await axios.post( baseUrl + '/comment/create',
                {
                    requestId,
                    message: newComment,
                    commentBy: getUserid(),
                },
                {
                    headers: authHeader(),
                }
            );
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    useEffect(() => {
        if (show) {
            fetchComments();
        }
    }, [show]);

    return (
        <div className={`comment-sidebar ${show ? "open" : ""}`}>
            <div className="sidebar-header d-flex justify-content-between align-items-center">
                <h5>Comments</h5>
                <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="sidebar-body">
                {comments.length === 0 ? (
                    <p className="text-muted">No comments yet.</p>
                ) : (
                    <ul className="list-group">
                        {comments.map((c) => (
                            <li key={c.id} className="list-group-item">
                                <strong>{c.user?.name || "User"}:</strong> <br />
                                {c.message}
                                <div className="text-muted small">{new Date(c.commentOn).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="sidebar-footer mt-3">
                <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleSubmit}>
                    Add Comment
                </button>
            </div>
        </div>
    );
};

export default CommentSidebar;
