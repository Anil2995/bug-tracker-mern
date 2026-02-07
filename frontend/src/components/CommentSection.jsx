import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getTicketComments,
    createComment,
    updateComment,
    deleteComment,
} from '../services/api';

const CommentSection = ({ ticketId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (ticketId) {
            fetchComments();
        }
    }, [ticketId]);

    const fetchComments = async () => {
        setLoading(true);
        const result = await getTicketComments(ticketId);
        if (result.success) {
            setComments(result.data);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const result = await createComment({
            ticket: ticketId,
            text: newComment.trim(),
        });

        if (result.success) {
            setComments([result.data, ...comments]);
            setNewComment('');
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
        setSubmitting(false);
    };

    const handleEdit = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.text);
    };

    const handleUpdate = async (commentId) => {
        if (!editText.trim()) return;

        const result = await updateComment(commentId, editText.trim());
        if (result.success) {
            setComments(
                comments.map((c) =>
                    c._id === commentId ? { ...c, text: editText.trim() } : c
                )
            );
            setEditingId(null);
            setEditText('');
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        const result = await deleteComment(commentId);
        if (result.success) {
            setComments(comments.filter((c) => c._id !== commentId));
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';

        return Math.floor(seconds) + ' seconds ago';
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    💬 Comments
                    <span className="text-sm font-normal text-gray-400">
                        ({comments.length})
                    </span>
                </h3>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                            rows="3"
                            maxLength="1000"
                            disabled={submitting}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                                {newComment.length}/1000
                            </span>
                            <button
                                type="submit"
                                disabled={!newComment.trim() || submitting}
                                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-2">Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-4xl mb-2">💭</p>
                        <p className="text-sm">No comments yet</p>
                        <p className="text-xs mt-1">Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="flex gap-3 p-4 bg-dark-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                        >
                            {/* User Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {comment.user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="font-semibold text-white">
                                            {comment.user?.name}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            {formatTimeAgo(comment.createdAt)}
                                        </span>
                                        {comment.createdAt !== comment.updatedAt && (
                                            <span className="text-xs text-gray-500 ml-1 italic">
                                                (edited)
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {comment.user?._id === user?._id && (
                                        <div className="flex gap-2">
                                            {editingId === comment._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdate(comment._id)}
                                                        className="text-xs text-green-400 hover:text-green-300 transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(comment)}
                                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(comment._id)}
                                                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Comment Text */}
                                {editingId === comment._id ? (
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none resize-none text-sm"
                                        rows="3"
                                        maxLength="1000"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                                        {comment.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
