import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAttachment, deleteAttachment } from '../services/api';
import CommentSection from './CommentSection';
import TicketForm from './TicketForm';

const TicketDetailModal = ({ ticket, onClose, onUpdate, onDelete, project }) => {
    const { user } = useAuth();
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    const isAdmin = project?.admin?._id === user?._id;
    const isCreator = ticket?.createdBy?._id === user?._id;
    const canEdit = isAdmin || isCreator;
    const canDelete = isAdmin || isCreator;

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleEditClick = () => {
        setShowEditForm(true);
    };

    const handleEditClose = () => {
        setShowEditForm(false);
    };

    const handleEditSuccess = (updatedTicket) => {
        onUpdate(updatedTicket);
        setShowEditForm(false);
    };

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            onDelete(ticket._id);
            onClose();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);
            setUploadError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        const result = await uploadAttachment(ticket._id, selectedFile, (progress) => {
            setUploadProgress(progress);
        });

        if (result.success) {
            setUploadSuccess('File uploaded successfully!');
            onUpdate(result.data);
            setSelectedFile(null);
            setUploadProgress(0);
            setTimeout(() => setUploadSuccess(''), 3000);
        } else {
            setUploadError(result.message);
        }

        setUploading(false);
    };

    const handleDeleteAttachment = async (attachmentId) => {
        if (!window.confirm('Are you sure you want to delete this attachment?')) {
            return;
        }

        const result = await deleteAttachment(ticket._id, attachmentId);

        if (result.success) {
            setUploadSuccess('Attachment deleted successfully!');
            onUpdate(result.data);
            setTimeout(() => setUploadSuccess(''), 3000);
        } else {
            setUploadError(result.message);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'to-do':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'in-progress':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'done':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟡';
            case 'low':
                return '🟢';
            default:
                return '⚪';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'to-do':
                return '📋';
            case 'in-progress':
                return '🔄';
            case 'done':
                return '✅';
            default:
                return '📌';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'bug': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'feature': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'task': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'bug': return '🐛';
            case 'feature': return '✨';
            case 'task': return '📝';
            default: return '📝';
        }
    };

    if (!ticket) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="glass-card w-full max-w-4xl animate-scale-in">
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-white/10">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {ticket.title}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-md text-xs font-medium border ${getTypeColor(
                                            ticket.type || 'task'
                                        )}`}
                                    >
                                        {getTypeIcon(ticket.type || 'task')} {(ticket.type || 'task').toUpperCase()}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-md text-xs font-medium border ${getPriorityColor(
                                            ticket.priority
                                        )}`}
                                    >
                                        {getPriorityIcon(ticket.priority)} {ticket.priority.toUpperCase()}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                                            ticket.status
                                        )}`}
                                    >
                                        {getStatusIcon(ticket.status)}{' '}
                                        {ticket.status.replace('-', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors ml-4"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Ticket Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Description */}
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Description
                                    </h3>
                                    <p className="text-gray-300 whitespace-pre-wrap">
                                        {ticket.description}
                                    </p>
                                </div>

                                {/* Assigned To */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Assigned To
                                    </h3>
                                    {ticket.assignedTo ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                {ticket.assignedTo.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">
                                                    {ticket.assignedTo.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {ticket.assignedTo.email}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Unassigned</p>
                                    )}
                                </div>

                                {/* Created By */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Created By
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                                            {ticket.createdBy.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {ticket.createdBy.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Due Date */}
                                {ticket.dueDate && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                            Due Date
                                        </h3>
                                        <p
                                            className={`font-medium ${new Date(ticket.dueDate) < new Date()
                                                ? 'text-red-400'
                                                : 'text-white'
                                                }`}
                                        >
                                            {new Date(ticket.dueDate).toLocaleDateString()}
                                            {new Date(ticket.dueDate) < new Date() && (
                                                <span className="ml-2 text-xs">(Overdue)</span>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Last Updated */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Last Updated
                                    </h3>
                                    <p className="text-white">
                                        {new Date(ticket.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/10"></div>

                            {/* Attachments Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    📎 Attachments
                                    {ticket.attachments?.length > 0 && (
                                        <span className="text-sm text-gray-400">
                                            ({ticket.attachments.length})
                                        </span>
                                    )}
                                </h3>

                                {/* Upload Messages */}
                                {uploadSuccess && (
                                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                                        ✅ {uploadSuccess}
                                    </div>
                                )}

                                {uploadError && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                        ❌ {uploadError}
                                    </div>
                                )}

                                {/* Existing Attachments */}
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                        {ticket.attachments.map((attachment) => (
                                            <div
                                                key={attachment._id}
                                                className="relative group glass-card p-2 hover:border-primary-500/30 transition-all"
                                            >
                                                <a
                                                    href={`http://localhost:5000/uploads/${attachment.filename}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <img
                                                        src={`http://localhost:5000/uploads/${attachment.filename}`}
                                                        alt={attachment.originalName}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                </a>
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {attachment.originalName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(attachment.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteAttachment(attachment._id)}
                                                    className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                    title="Delete attachment"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No Attachments Message */}
                                {(!ticket.attachments || ticket.attachments.length === 0) && (
                                    <p className="text-gray-500 text-sm italic mb-6">
                                        No attachments yet. Upload a screenshot below.
                                    </p>
                                )}

                                {/* Upload New File */}
                                <div className="glass-card p-4">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3">
                                        📤 Upload Screenshot
                                    </h4>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                disabled={uploading}
                                                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-primary-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-500/20 file:text-primary-400 hover:file:bg-primary-500/30 disabled:opacity-50"
                                            />
                                            {selectedFile && (
                                                <p className="mt-2 text-xs text-gray-400">
                                                    Selected: {selectedFile.name} (
                                                    {(selectedFile.size / 1024).toFixed(1)} KB)
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleUpload}
                                            disabled={!selectedFile || uploading}
                                            className="px-6 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 rounded-lg text-primary-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading
                                                ? `Uploading ${uploadProgress}%`
                                                : '⬆️ Upload'}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
                                    </p>

                                    {/* Upload Progress Bar */}
                                    {uploading && uploadProgress > 0 && (
                                        <div className="mt-3">
                                            <div className="w-full bg-dark-800 rounded-full h-2">
                                                <div
                                                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/10"></div>

                            {/* Comments Section */}
                            <CommentSection ticketId={ticket._id} />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-white/10">
                            <div className="flex gap-3">
                                {canEdit && (
                                    <button onClick={handleEditClick} className="btn-secondary">
                                        ✏️ Edit Ticket
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        onClick={handleDeleteClick}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all"
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>
                            <button onClick={onClose} className="btn-primary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Form Modal */}
            {showEditForm && (
                <TicketForm
                    projectId={project._id}
                    teamMembers={project.teamMembers}
                    onClose={handleEditClose}
                    onSuccess={handleEditSuccess}
                    editTicket={ticket}
                />
            )}
        </>
    );
};

export default TicketDetailModal;
