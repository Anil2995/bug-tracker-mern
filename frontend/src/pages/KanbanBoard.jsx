import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getProject, getProjectTickets, updateTicket, deleteTicket } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketDetailModal from '../components/TicketDetailModal';

const KanbanBoard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState({
        'to-do': { title: 'To Do', items: [] },
        'in-progress': { title: 'In Progress', items: [] },
        'done': { title: 'Done', items: [] },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const [projectRes, ticketsRes] = await Promise.all([
                getProject(projectId),
                getProjectTickets(projectId),
            ]);

            if (projectRes.success) {
                setProject(projectRes.data);
            } else {
                setError(projectRes.message);
            }

            if (ticketsRes.success) {
                const tickets = ticketsRes.data;
                setColumns({
                    'to-do': {
                        title: 'To Do',
                        items: tickets.filter((t) => t.status === 'to-do'),
                    },
                    'in-progress': {
                        title: 'In Progress',
                        items: tickets.filter((t) => t.status === 'in-progress'),
                    },
                    'done': {
                        title: 'Done',
                        items: tickets.filter((t) => t.status === 'done'),
                    },
                });
            } else {
                setError(ticketsRes.message);
            }
        } catch (err) {
            setError('Failed to load board data');
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems =
            source.droppableId === destination.droppableId
                ? sourceItems
                : [...destColumn.items];

        const [removed] = sourceItems.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
            });
        } else {
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });

            // Update ticket status
            const result = await updateTicket(removed._id, {
                status: destination.droppableId,
            });

            if (result.success) {
                setSuccessMessage(`Ticket moved to ${destColumn.title}!`);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                // Revert on error - simplified for now
                setError(result.message);
                setTimeout(() => setError(''), 3000);
                fetchData(); // Reload to revert
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'low':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
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

    const getTypeIcon = (type) => {
        switch (type) {
            case 'bug': return '🐛';
            case 'feature': return '✨';
            case 'task': return '📝';
            default: return '📝';
        }
    };

    const handleTicketDelete = async (ticketId) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            const result = await deleteTicket(ticketId);
            if (result.success) {
                setSuccessMessage('Ticket deleted successfully');
                fetchData();
                setSelectedTicket(null);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(result.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Kanban board...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="glass-card p-6 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                🎨 Kanban Board
                            </h1>
                            <p className="text-gray-400 mt-1">
                                {project?.title || 'Loading...'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/project/${projectId}`)}
                                className="btn-secondary"
                            >
                                ← Back to Project
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="btn-primary">
                                🏠 Dashboard
                            </button>
                        </div>
                    </div>
                </div>

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

                {/* Kanban Columns */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <div key={columnId} className="flex flex-col">
                                {/* Column Header */}
                                <div className="glass-card p-4 mb-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold">{column.title}</h2>
                                        <span className="px-3 py-1 bg-dark-800 rounded-full text-sm font-medium">
                                            {column.items.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Droppable Column */}
                                <Droppable droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 p-4 rounded-lg transition-colors min-h-[500px] ${snapshot.isDraggingOver
                                                ? 'bg-primary-500/10 border-2 border-primary-500/30'
                                                : 'bg-dark-800/30 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="space-y-3">
                                                {column.items.map((ticket, index) => (
                                                    <Draggable
                                                        key={ticket._id}
                                                        draggableId={ticket._id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`glass-card p-4 cursor-move transition-all hover:scale-102 ${snapshot.isDragging
                                                                    ? 'rotate-2 scale-105 shadow-2xl'
                                                                    : ''
                                                                    }`}
                                                                onClick={() => setSelectedTicket(ticket)}
                                                            >
                                                                {/* Badges */}
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-gray-300 border border-white/10">
                                                                        {getTypeIcon(ticket.type)} {ticket.type ? ticket.type.toUpperCase() : 'TASK'}
                                                                    </span>
                                                                    <span
                                                                        className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(
                                                                            ticket.priority
                                                                        )}`}
                                                                    >
                                                                        {getPriorityIcon(ticket.priority)}{' '}
                                                                        {ticket.priority.toUpperCase()}
                                                                    </span>
                                                                </div>

                                                                {/* Title */}
                                                                <h3 className="font-semibold mb-2 text-white line-clamp-2">
                                                                    {ticket.title}
                                                                </h3>

                                                                {/* Description */}
                                                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                                                    {ticket.description}
                                                                </p>

                                                                {/* Footer */}
                                                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {ticket.assignedTo ? (
                                                                            <>
                                                                                <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-[10px]">
                                                                                    {ticket.assignedTo.name.charAt(0).toUpperCase()}
                                                                                </div>
                                                                                <span>{ticket.assignedTo.name}</span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="italic">Unassigned</span>
                                                                        )}
                                                                    </div>
                                                                    {ticket.dueDate && (
                                                                        <span className={new Date(ticket.dueDate) < new Date() ? 'text-red-400' : ''}>
                                                                            {new Date(ticket.dueDate).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>

                                            {/* Empty State */}
                                            {column.items.length === 0 && (
                                                <div className="text-center py-12 text-gray-500">
                                                    <p className="text-4xl mb-2">📭</p>
                                                    <p className="text-sm">No tickets here</p>
                                                    <p className="text-xs mt-1">Drag tickets here</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>

                {/* Instructions */}
                <div className="glass-card p-6 mt-8 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-3">💡 How to Use</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li>• <strong>Drag</strong> tickets between columns to update their status</li>
                        <li>• <strong>Click</strong> on a ticket to view full details</li>
                        <li>• Changes are saved automatically</li>
                        <li>• Color-coded by priority: 🔴 High, 🟡 Medium, 🟢 Low</li>
                    </ul>
                </div>

                {/* Ticket Detail Modal */}
                {selectedTicket && (
                    <TicketDetailModal
                        ticket={selectedTicket}
                        project={project}
                        onClose={() => setSelectedTicket(null)}
                        onUpdate={() => { fetchData(); setSelectedTicket(null); }}
                        onDelete={handleTicketDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default KanbanBoard;
