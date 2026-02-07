import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getProject,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    getProjectTickets,
    createTicket,
    updateTicket,
    deleteTicket,
} from '../services/api';
import ProjectForm from '../components/ProjectForm';
import TicketForm from '../components/TicketForm';
import TicketCard from '../components/TicketCard';
import TicketDetailModal from '../components/TicketDetailModal';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Ticket states
    const [tickets, setTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'newest' });

    useEffect(() => {
        fetchProject();
    }, [id]);

    useEffect(() => {
        if (project) {
            fetchTickets();
        }
    }, [project, filters]);

    const fetchProject = async () => {
        setLoading(true);
        const result = await getProject(id);
        if (result.success) {
            setProject(result.data);
            setIsAdmin(result.isAdmin);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const fetchTickets = async () => {
        setTicketsLoading(true);
        const result = await getProjectTickets(id, filters);
        if (result.success) {
            setTickets(result.data);
        }
        setTicketsLoading(false);
    };

    const handleUpdateProject = async (formData) => {
        const result = await updateProject(id, formData);
        if (result.success) {
            setSuccessMessage('Project updated successfully! 🎉');
            setShowEditForm(false);
            fetchProject();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.'))
            return;

        const result = await deleteProject(id);
        if (result.success) {
            navigate('/projects');
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!memberEmail.trim()) return;

        const result = await addTeamMember(id, memberEmail);
        if (result.success) {
            setSuccessMessage('Team member added successfully!');
            setMemberEmail('');
            setShowAddMember(false);
            fetchProject();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Remove this member from the project?')) return;

        const result = await removeTeamMember(id, userId);
        if (result.success) {
            setSuccessMessage('Team member removed successfully!');
            fetchProject();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    // Ticket handlers
    const handleCreateTicket = async (ticketData) => {
        const result = await createTicket(ticketData);
        if (result.success) {
            setSuccessMessage('Ticket created successfully! 🎉');
            setShowTicketForm(false);
            fetchTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleUpdateTicket = async (ticketData) => {
        const result = await updateTicket(editingTicket._id, ticketData);
        if (result.success) {
            setSuccessMessage('Ticket updated successfully! ✅');
            setEditingTicket(null);
            fetchTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        const result = await deleteTicket(ticketId);
        if (result.success) {
            setSuccessMessage('Ticket deleted successfully!');
            fetchTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        const result = await updateTicket(ticketId, { status: newStatus });
        if (result.success) {
            setSuccessMessage('Status updated! ✅');
            fetchTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'archived':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="glass-card text-center p-8">
                    <p className="text-red-400 text-xl mb-4">❌ Project not found</p>
                    <p className="text-gray-400 mb-4">{error || 'The project may have been deleted or you don\'t have access.'}</p>
                    <button onClick={() => navigate('/projects')} className="btn-primary">
                        ← Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/projects')}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
            >
                ← Back to Projects
            </button>

            {/* Messages */}
            {successMessage && (
                <div className="glass-card bg-green-500/10 border-green-500/20 mb-6 p-4 animate-slide-down">
                    <p className="text-green-400">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="glass-card bg-red-500/10 border-red-500/20 mb-6 p-4 animate-slide-down">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Header Section */}
            <div className="glass-card mb-6 p-6 animate-slide-down">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    project.status
                                )}`}
                            >
                                {project.status.toUpperCase()}
                            </span>
                            {isAdmin && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                    👑 Admin
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400">{project.description}</p>
                    </div>

                    {isAdmin && (
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => setShowEditForm(true)} className="btn-primary">
                                ✏️ Edit
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-6 text-sm text-gray-400 pt-4 border-t border-white/10">
                    <div>
                        <span className="font-medium">Created by:</span> {project.admin.name}
                    </div>
                    <div>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                        <span className="font-medium">Updated:</span>{' '}
                        {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team Members Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">👥 Team Members</h2>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowAddMember(!showAddMember)}
                                    className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        {/* Add Member Form */}
                        {showAddMember && isAdmin && (
                            <form onSubmit={handleAddMember} className="mb-4 p-3 bg-dark-800 rounded-lg">
                                <input
                                    type="email"
                                    value={memberEmail}
                                    onChange={(e) => setMemberEmail(e.target.value)}
                                    placeholder="Enter user email"
                                    className="mb-2 text-sm w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                                    required
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-primary text-sm flex-1">
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddMember(false);
                                            setMemberEmail('');
                                        }}
                                        className="btn-secondary text-sm flex-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Members List */}
                        {/* Members List */}
                        <div className="space-y-3">
                            {project.teamMembers.map((member) => {
                                // Calculate member stats
                                const memberTickets = tickets.filter(t => t.assignedTo && t.assignedTo._id === member._id);
                                const activeTickets = memberTickets.filter(t => t.status !== 'done').length;
                                const workStatus = activeTickets > 2 ? 'Busy' : activeTickets > 0 ? 'Active' : 'Available';
                                const statusColor = activeTickets > 2 ? 'text-red-400 bg-red-500/10' : activeTickets > 0 ? 'text-green-400 bg-green-500/10' : 'text-blue-400 bg-blue-500/10';

                                return (
                                    <div
                                        key={member._id}
                                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-violet-500/30 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold flex items-center gap-2">
                                                        {member.name}
                                                        {member._id === project.admin._id && (
                                                            <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                                                                👑 Admin
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${member.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                                                member.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                                                                    'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                            }`}>
                                                            {member.role || 'Member'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isAdmin && member._id !== project.admin._id && (
                                                <button
                                                    onClick={() => handleRemoveMember(member._id)}
                                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                                    title="Remove Member"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs mb-3 p-2 bg-black/20 rounded-lg">
                                            <div>
                                                <p className="text-gray-500 mb-0.5">ID</p>
                                                <p className="text-gray-300 font-mono truncate" title={member._id}>...{member._id.slice(-6)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-0.5">Email</p>
                                                <p className="text-gray-300 truncate" title={member.email}>{member.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">Status:</span>
                                                <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${statusColor}`}>
                                                    {workStatus}
                                                </span>
                                            </div>
                                            <div className="text-gray-400">
                                                <span className="text-white font-bold">{activeTickets}</span> Active Tasks
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tickets Section */}
                <div className="lg:col-span-2">
                    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {/* Tickets Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">🎫 Tickets ({tickets.length})</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/projects/${id}/board`)}
                                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all"
                                >
                                    🎨 Kanban Board
                                </button>
                                <button
                                    onClick={() => setShowTicketForm(true)}
                                    className="btn-primary"
                                >
                                    + Create Ticket
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="px-3 py-2 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="to-do">📋 To Do</option>
                                <option value="in-progress">🔄 In Progress</option>
                                <option value="done">✅ Done</option>
                            </select>

                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="px-3 py-2 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                            >
                                <option value="">All Priority</option>
                                <option value="high">🔴 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>

                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="px-3 py-2 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="priority-high">High Priority First</option>
                                <option value="priority-low">Low Priority First</option>
                            </select>
                        </div>

                        {/* Tickets Grid */}
                        {ticketsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                                <p className="text-gray-400 mt-4">Loading tickets...</p>
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tickets.map((ticket) => (
                                    <TicketCard
                                        key={ticket._id}
                                        ticket={ticket}
                                        onClick={setSelectedTicket}
                                        onStatusChange={handleStatusChange}
                                        onEdit={setEditingTicket}
                                        onDelete={handleDeleteTicket}
                                        canEdit={true}
                                        canDelete={
                                            ticket.createdBy._id === user._id || isAdmin
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎫</div>
                                <h3 className="text-xl font-bold text-gray-300 mb-2">No Tickets Yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Create your first ticket to start tracking bugs and tasks!
                                </p>
                                <button
                                    onClick={() => setShowTicketForm(true)}
                                    className="btn-primary"
                                >
                                    + Create First Ticket
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Project Form Modal */}
            {showEditForm && (
                <ProjectForm
                    mode="edit"
                    project={project}
                    onSubmit={handleUpdateProject}
                    onCancel={() => setShowEditForm(false)}
                />
            )}

            {/* Create Ticket Form Modal */}
            {showTicketForm && (
                <TicketForm
                    mode="create"
                    projectId={id}
                    teamMembers={project.teamMembers}
                    onSubmit={handleCreateTicket}
                    onCancel={() => setShowTicketForm(false)}
                />
            )}

            {/* Edit Ticket Form Modal */}
            {editingTicket && (
                <TicketForm
                    mode="edit"
                    ticket={editingTicket}
                    projectId={id}
                    teamMembers={project.teamMembers}
                    onSubmit={handleUpdateTicket}
                    onCancel={() => setEditingTicket(null)}
                />
            )}

            {/* Ticket Detail Modal with Comments */}
            {selectedTicket && (
                <TicketDetailModal
                    ticket={selectedTicket}
                    project={project}
                    onClose={() => setSelectedTicket(null)}
                    onUpdate={(updatedTicket) => {
                        setTickets(tickets.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)));
                        setSelectedTicket(updatedTicket);
                    }}
                    onDelete={handleDeleteTicket}
                />
            )}
        </div>
    );
};

export default ProjectDetail;

