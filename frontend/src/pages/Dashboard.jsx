import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjects, getMyTickets } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        totalMembers: 0,
        totalTickets: 0,
        myTickets: 0,
        ticketsToDo: 0,
        ticketsInProgress: 0,
        ticketsDone: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);

        // Fetch projects
        const projectsResult = await getProjects();

        // Fetch my tickets
        const ticketsResult = await getMyTickets();

        if (projectsResult.success) {
            const projectsData = projectsResult.data;
            setProjects(projectsData);

            // Calculate project stats
            const activeCount = projectsData.filter((p) => p.status === 'active').length;
            const uniqueMembers = new Set();
            projectsData.forEach((p) => {
                p.teamMembers?.forEach((m) => uniqueMembers.add(m._id));
            });

            let ticketStats = {
                totalProjects: projectsData.length,
                activeProjects: activeCount,
                totalMembers: uniqueMembers.size,
                totalTickets: 0,
                myTickets: 0,
                ticketsToDo: 0,
                ticketsInProgress: 0,
                ticketsDone: 0,
                highPriority: 0,
                mediumPriority: 0,
                lowPriority: 0,
            };

            // Calculate ticket stats
            if (ticketsResult.success && ticketsResult.data) {
                const tickets = ticketsResult.data;
                setMyTickets(tickets);

                ticketStats.myTickets = tickets.length;
                ticketStats.totalTickets = tickets.length;
                ticketStats.ticketsToDo = tickets.filter(t => t.status === 'to-do').length;
                ticketStats.ticketsInProgress = tickets.filter(t => t.status === 'in-progress').length;
                ticketStats.ticketsDone = tickets.filter(t => t.status === 'done').length;
                ticketStats.highPriority = tickets.filter(t => t.priority === 'high').length;
                ticketStats.mediumPriority = tickets.filter(t => t.priority === 'medium').length;
                ticketStats.lowPriority = tickets.filter(t => t.priority === 'low').length;
            }

            setStats(ticketStats);
        }
        setLoading(false);
    };

    const recentProjects = projects.slice(0, 4);
    const recentTickets = myTickets.slice(0, 5);
    const completionRate = stats.myTickets > 0 ? Math.round((stats.ticketsDone / stats.myTickets) * 100) : 0;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-bold">
                    <span className="gradient-text">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</span> 👋
                </h1>
                <p className="text-gray-400 mt-2">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 dashboard-stats">
                <div className="stat-card animate-slide-up">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-violet-600/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📁</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Projects</p>
                            <p className="text-3xl font-bold text-white">
                                {loading ? <span className="animate-pulse">--</span> : stats.totalProjects}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="stat-card animate-slide-up delay-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Active</p>
                            <p className="text-3xl font-bold text-emerald-400">
                                {loading ? <span className="animate-pulse">--</span> : stats.activeProjects}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="stat-card animate-slide-up delay-200">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500/20 to-pink-600/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎫</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">My Tickets</p>
                            <p className="text-3xl font-bold text-fuchsia-400">
                                {loading ? <span className="animate-pulse">--</span> : stats.myTickets}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="stat-card animate-slide-up delay-300">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Team Members</p>
                            <p className="text-3xl font-bold text-cyan-400">
                                {loading ? <span className="animate-pulse">--</span> : stats.totalMembers}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            {stats.myTickets > 0 && (
                <div className="glass-card p-6 mb-8 animate-slide-up delay-400">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        {/* Completion Rate */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                🎯 Overall Progress
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold gradient-text">{completionRate}%</span>
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-xl">📋</span>
                                </div>
                                <p className="text-2xl font-bold">{stats.ticketsToDo}</p>
                                <p className="text-xs text-gray-400">To Do</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-xl">🔄</span>
                                </div>
                                <p className="text-2xl font-bold text-violet-400">{stats.ticketsInProgress}</p>
                                <p className="text-xs text-gray-400">In Progress</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-xl">✅</span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-400">{stats.ticketsDone}</p>
                                <p className="text-xs text-gray-400">Done</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="glass-card p-6 animate-slide-up delay-400">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span>📁</span> Recent Projects
                        </h2>
                        <button
                            onClick={() => navigate('/projects')}
                            className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                        >
                            View All →
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-xl animate-pulse">
                                    <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
                                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : recentProjects.length > 0 ? (
                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <div
                                    key={project._id}
                                    onClick={() => navigate(`/project/${project._id}`)}
                                    className="glass-card-hover p-4 cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold group-hover:text-violet-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <span className={`badge ${project.status === 'active'
                                            ? 'badge-status-progress'
                                            : project.status === 'completed'
                                                ? 'badge-status-done'
                                                : 'badge-status-todo'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                        <span>👥 {project.teamMembers?.length || 0} members</span>
                                        <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📁</span>
                            </div>
                            <p className="text-gray-400 mb-4">No projects yet</p>
                            <button onClick={() => navigate('/projects')} className="btn-primary">
                                Create Your First Project
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Tickets / Quick Actions */}
                <div className="glass-card p-6 animate-slide-up delay-500 quick-actions">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <span>🎫</span> {myTickets.length > 0 ? 'Recent Tickets' : 'Quick Actions'}
                    </h2>

                    {myTickets.length > 0 ? (
                        <div className="space-y-3">
                            {recentTickets.map((ticket) => (
                                <div
                                    key={ticket._id}
                                    className="glass-card-hover p-4 cursor-pointer"
                                    onClick={() => navigate(`/project/${ticket.project?._id || ticket.project}`)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-sm">{ticket.title}</h3>
                                        <span className={`badge text-xs ${ticket.priority === 'high'
                                            ? 'badge-priority-high'
                                            : ticket.priority === 'medium'
                                                ? 'badge-priority-medium'
                                                : 'badge-priority-low'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`badge text-xs ${ticket.status === 'done'
                                            ? 'badge-status-done'
                                            : ticket.status === 'in-progress'
                                                ? 'badge-status-progress'
                                                : 'badge-status-todo'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {ticket.project?.title || 'Project'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate('/my-tickets')}
                                className="btn-secondary w-full mt-4"
                            >
                                View All Tickets →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/projects')}
                                className="w-full p-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 border border-violet-500/20 rounded-xl text-left transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📁</span>
                                    <span className="font-medium text-violet-400">Browse Projects</span>
                                </div>
                                <span className="text-violet-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button
                                onClick={() => navigate('/projects')}
                                className="w-full p-4 bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 hover:from-fuchsia-500/20 hover:to-pink-500/20 border border-fuchsia-500/20 rounded-xl text-left transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">➕</span>
                                    <span className="font-medium text-fuchsia-400">Create New Project</span>
                                </div>
                                <span className="text-fuchsia-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button
                                onClick={() => navigate('/my-tickets')}
                                className="w-full p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 rounded-xl text-left transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🎫</span>
                                    <span className="font-medium text-cyan-400">View My Tickets</span>
                                </div>
                                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Priority Overview */}
            {stats.myTickets > 0 && (
                <div className="glass-card p-6 mt-6 animate-slide-up delay-600">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        🎯 Tickets by Priority
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                            <div className="flex items-center justify-between">
                                <span className="text-red-400 font-medium">🔴 High</span>
                                <span className="text-2xl font-bold text-red-400">{stats.highPriority}</span>
                            </div>
                            <div className="progress-bar mt-2">
                                <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${stats.myTickets > 0 ? (stats.highPriority / stats.myTickets) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <span className="text-amber-400 font-medium">🟡 Medium</span>
                                <span className="text-2xl font-bold text-amber-400">{stats.mediumPriority}</span>
                            </div>
                            <div className="progress-bar mt-2">
                                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${stats.myTickets > 0 ? (stats.mediumPriority / stats.myTickets) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <div className="flex items-center justify-between">
                                <span className="text-emerald-400 font-medium">🟢 Low</span>
                                <span className="text-2xl font-bold text-emerald-400">{stats.lowPriority}</span>
                            </div>
                            <div className="progress-bar mt-2">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${stats.myTickets > 0 ? (stats.lowPriority / stats.myTickets) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
