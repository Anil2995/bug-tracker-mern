import { useState } from 'react';

const TicketCard = ({ ticket, onStatusChange, onEdit, onDelete, onClick, canEdit, canDelete }) => {
    const [showActions, setShowActions] = useState(false);

    // Priority badge styles
    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Status badge styles
    const getStatusStyles = (status) => {
        switch (status) {
            case 'done':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'in-progress':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'to-do':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Type badge styles
    const getTypeStyles = (type) => {
        switch (type) {
            case 'bug': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'feature': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'task': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Priority icon
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

    // Status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'done':
                return '✅';
            case 'in-progress':
                return '🔄';
            case 'to-do':
                return '📋';
            default:
                return '📋';
        }
    };

    // Type icon
    const getTypeIcon = (type) => {
        switch (type) {
            case 'bug': return '🐛';
            case 'feature': return '✨';
            case 'task': return '📝';
            default: return '📝';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const isOverdue = date < now;
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return { formatted, isOverdue };
    };

    const dueDate = formatDate(ticket.dueDate);

    const handleCardClick = (e) => {
        // Don't trigger if clicking on buttons or interactive elements
        if (e.target.closest('button')) return;
        if (onClick) onClick(ticket);
    };

    return (
        <div
            className={`glass-card p-4 hover:border-primary-500/30 transition-all group relative ${onClick ? 'cursor-pointer' : ''
                }`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            onClick={handleCardClick}
        >
            {/* Action Menu */}
            {showActions && (canEdit || canDelete) && (
                <div className="absolute top-3 right-3 flex gap-2 animate-fade-in z-10">
                    {canEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(ticket);
                            }}
                            className="p-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg transition-colors"
                            title="Edit ticket"
                        >
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this ticket?')) {
                                    onDelete(ticket._id);
                                }
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                            title="Delete ticket"
                        >
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded border ${getTypeStyles(ticket.type || 'task')}`}>
                    {getTypeIcon(ticket.type || 'task')} {(ticket.type || 'task').toUpperCase()}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${getPriorityStyles(ticket.priority)}`}>
                    {getPriorityIcon(ticket.priority)} {ticket.priority}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${getStatusStyles(ticket.status)}`}>
                    {getStatusIcon(ticket.status)} {ticket.status.replace('-', ' ')}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                {ticket.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{ticket.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/10">
                {/* Assignee */}
                <div className="flex items-center gap-2">
                    {ticket.assignedTo ? (
                        <>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                                {ticket.assignedTo.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-400" title={ticket.assignedTo.email}>
                                {ticket.assignedTo.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-500 italic">Unassigned</span>
                    )}
                </div>

                {/* Due Date */}
                {dueDate && (
                    <span className={`flex items-center gap-1 ${dueDate.isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dueDate.formatted}
                    </span>
                )}
            </div>

            {/* Quick Status Change */}
            {canEdit && ticket.status !== 'done' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const nextStatus = ticket.status === 'to-do' ? 'in-progress' : 'done';
                        onStatusChange(ticket._id, nextStatus);
                    }}
                    className="w-full mt-3 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg transition-colors text-sm font-medium"
                >
                    {ticket.status === 'to-do' ? '▶️ Start Working' : '✅ Mark as Done'}
                </button>
            )}
        </div>
    );
};

export default TicketCard;
