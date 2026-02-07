import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTickets, updateTicket, deleteTicket } from '../services/api';

const MyTickets = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'newest' });
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        setLoading(true);
        const result = await getMyTickets();
        if (result.success) {
            setTickets(result.data || []);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        const result = await updateTicket(ticketId, { status: newStatus });
        if (result.success) {
            setSuccessMessage('Status updated! ✅');
            fetchMyTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;

        const result = await deleteTicket(ticketId);
        if (result.success) {
            setSuccessMessage('Ticket deleted successfully!');
            fetchMyTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    // Filter and sort tickets
    const filteredTickets = tickets.filter(ticket => {
        if (filters.status && ticket.status !== filters.status) return false;
        if (filters.priority && ticket.priority !== filters.priority) return false;
        return true;
    }).sort((a, b) => {
        switch (filters.sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'priority-high':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'priority-low':
                const priorityOrderLow = { high: 3, medium: 2, low: 1 };
                return priorityOrderLow[a.priority] - priorityOrderLow[b.priority];
            default:
                return 0;
        }
    });

    const stats = {
        total: tickets.length,
        toDo: tickets.filter(t => t.status === 'to-do').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        done: tickets.filter(t => t.status === 'done').length,
        high: tickets.filter(t => t.priority === 'high').length,
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high': return 'badge-priority-high';
            case 'medium': return 'badge-priority-medium';
            case 'low': return 'badge-priority-low';
            default: return 'badge-status-todo';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'to-do': return 'badge-status-todo';
            case 'in-progress': return 'badge-status-progress';
            case 'done': return 'badge-status-done';
            default: return 'badge-status-todo';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'to-do': return '📋';
            case 'in-progress': return '🔄';
            case 'done': return '✅';
            default: return '⚪';
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text">🎫 My Tickets</h1>
                    <p className="text-gray-400 mt-2">All tickets assigned to you across projects</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                    >
                        ⊞ Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                    >
                        ☰ List
                    </button>
                </div>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="glass-card bg-emerald-500/10 border-emerald-500/20 p-4 mb-6 animate-slide-down">
                    <p className="text-emerald-400">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="glass-card bg-red-500/10 border-red-500/20 p-4 mb-6 animate-slide-down">
                    <p className="text-red-400">⚠️ {error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="stat-card">
                    <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="stat-card" onClick={() => setFilters({ ...filters, status: 'to-do' })}>
                    <p className="text-gray-400 text-sm mb-1">📋 To Do</p>
                    <p className="text-3xl font-bold text-gray-300">{stats.toDo}</p>
                </div>
                <div className="stat-card" onClick={() => setFilters({ ...filters, status: 'in-progress' })}>
                    <p className="text-gray-400 text-sm mb-1">🔄 In Progress</p>
                    <p className="text-3xl font-bold text-violet-400">{stats.inProgress}</p>
                </div>
                <div className="stat-card" onClick={() => setFilters({ ...filters, status: 'done' })}>
                    <p className="text-gray-400 text-sm mb-1">✅ Done</p>
                    <p className="text-3xl font-bold text-emerald-400">{stats.done}</p>
                </div>
                <div className="stat-card" onClick={() => setFilters({ ...filters, priority: 'high' })}>
                    <p className="text-gray-400 text-sm mb-1">🔴 High Priority</p>
                    <p className="text-3xl font-bold text-red-400">{stats.high}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Status</option>
                            <option value="to-do">📋 To Do</option>
                            <option value="in-progress">🔄 In Progress</option>
                            <option value="done">✅ Done</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Priority</option>
                            <option value="high">🔴 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="input-field"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priority-high">High Priority First</option>
                            <option value="priority-low">Low Priority First</option>
                        </select>
                    </div>
                    {(filters.status || filters.priority) && (
                        <button
                            onClick={() => setFilters({ status: '', priority: '', sortBy: 'newest' })}
                            className="btn-ghost text-sm"
                        >
                            Clear Filters ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="spinner mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading tickets...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredTickets.length === 0 && (
                <div className="glass-card text-center py-16 animate-scale-in">
                    <div className="text-6xl mb-4">🎫</div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">
                        {filters.status || filters.priority ? 'No Matching Tickets' : 'No Tickets Assigned'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {filters.status || filters.priority
                            ? 'Try adjusting your filters'
                            : "You don't have any tickets assigned yet. Browse projects to get started!"}
                    </p>
                    <button onClick={() => navigate('/projects')} className="btn-primary">
                        📁 Browse Projects
                    </button>
                </div>
            )}

            {/* Tickets Grid View */}
            {!loading && filteredTickets.length > 0 && viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTickets.map((ticket, index) => (
                        <div
                            key={ticket._id}
                            className="ticket-card animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                                    {getPriorityIcon(ticket.priority)} {ticket.priority}
                                </span>
                                <span className={`badge ${getStatusBadge(ticket.status)}`}>
                                    {getStatusIcon(ticket.status)} {ticket.status}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-white mb-2 line-clamp-2">{ticket.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{ticket.description}</p>

                            {/* Project */}
                            <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                <span>📁</span>
                                <span className="truncate">{ticket.project?.title || 'Unknown Project'}</span>
                            </div>

                            {/* Status Dropdown */}
                            <div className="mb-3">
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="to-do">📋 To Do</option>
                                    <option value="in-progress">🔄 In Progress</option>
                                    <option value="done">✅ Done</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/project/${ticket.project?._id || ticket.project}`)}
                                    className="flex-1 px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg text-violet-400 text-xs font-medium transition-all"
                                >
                                    View Project →
                                </button>
                            </div>

                            {/* Date */}
                            <p className="text-xs text-gray-500 mt-3">
                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Tickets List View */}
            {!loading && filteredTickets.length > 0 && viewMode === 'list' && (
                <div className="glass-card overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Project</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Priority</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Created</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-white truncate max-w-[200px]">{ticket.title}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-400 truncate">{ticket.project?.title || 'Unknown'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                                            {getPriorityIcon(ticket.priority)} {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm focus:outline-none"
                                        >
                                            <option value="to-do">📋 To Do</option>
                                            <option value="in-progress">🔄 In Progress</option>
                                            <option value="done">✅ Done</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => navigate(`/project/${ticket.project?._id || ticket.project}`)}
                                            className="text-violet-400 hover:text-violet-300 text-sm font-medium"
                                        >
                                            View →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyTickets;
