import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../services/api';
import ProjectForm from '../components/ProjectForm';

const Projects = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const result = await getProjects();
        if (result.success) {
            setProjects(result.data);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleCreateProject = async (formData) => {
        const result = await createProject(formData);
        if (result.success) {
            setSuccessMessage('Project created successfully! 🎉');
            setShowForm(false);
            fetchProjects();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        const result = await deleteProject(projectId);
        if (result.success) {
            setSuccessMessage('Project deleted successfully!');
            fetchProjects();
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'badge-status-progress';
            case 'completed':
                return 'badge-status-done';
            case 'archived':
                return 'badge-status-todo';
            default:
                return 'badge-status-todo';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return '🟢';
            case 'completed': return '✅';
            case 'archived': return '📦';
            default: return '⚪';
        }
    };

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesFilter = filter === 'all' || project.status === filter;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Stats
    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        archived: projects.filter(p => p.status === 'archived').length,
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text">📁 All Projects</h1>
                    <p className="text-gray-400 mt-2">Manage your projects and track bugs efficiently</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <span className="text-xl mr-2">+</span>
                    Create Project
                </button>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="glass-card bg-emerald-500/10 border-emerald-500/20 p-4 mb-6 animate-slide-down">
                    <p className="text-emerald-400 flex items-center gap-2">✅ {successMessage}</p>
                </div>
            )}

            {error && (
                <div className="glass-card bg-red-500/10 border-red-500/20 p-4 mb-6 animate-slide-down">
                    <p className="text-red-400 flex items-center gap-2">⚠️ {error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div
                    className={`stat-card cursor-pointer ${filter === 'all' ? 'border-violet-500/50' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    <p className="text-gray-400 text-sm mb-1">All Projects</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div
                    className={`stat-card cursor-pointer ${filter === 'active' ? 'border-emerald-500/50' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    <p className="text-gray-400 text-sm mb-1">🟢 Active</p>
                    <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
                </div>
                <div
                    className={`stat-card cursor-pointer ${filter === 'completed' ? 'border-blue-500/50' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    <p className="text-gray-400 text-sm mb-1">✅ Completed</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
                </div>
                <div
                    className={`stat-card cursor-pointer ${filter === 'archived' ? 'border-gray-500/50' : ''}`}
                    onClick={() => setFilter('archived')}
                >
                    <p className="text-gray-400 text-sm mb-1">📦 Archived</p>
                    <p className="text-2xl font-bold text-gray-400">{stats.archived}</p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input-field md:w-48"
                    >
                        <option value="all">All Status</option>
                        <option value="active">🟢 Active</option>
                        <option value="completed">✅ Completed</option>
                        <option value="archived">📦 Archived</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="glass-card p-6 animate-pulse">
                            <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
                            <div className="h-16 bg-white/10 rounded mb-4"></div>
                            <div className="h-4 bg-white/10 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
                <div className="glass-card text-center py-16 animate-scale-in">
                    <div className="text-6xl mb-4">📂</div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">
                        {searchQuery || filter !== 'all' ? 'No Projects Found' : 'No Projects Yet'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {searchQuery || filter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first project to start tracking bugs and tasks'}
                    </p>
                    {!searchQuery && filter === 'all' && (
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            <span className="text-xl mr-2">+</span>
                            Create Your First Project
                        </button>
                    )}
                </div>
            )}

            {/* Projects Grid */}
            {!loading && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => {
                        const isAdmin = project.admin?._id === user?._id;
                        return (
                            <div
                                key={project._id}
                                className="glass-card-hover p-6 cursor-pointer group animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => navigate(`/project/${project._id}`)}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`badge ${getStatusColor(project.status)}`}>
                                        {getStatusIcon(project.status)} {project.status}
                                    </span>
                                    {isAdmin && (
                                        <span className="badge bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                            👑 Admin
                                        </span>
                                    )}
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        👥 {project.teamMembers?.length || 0} members
                                    </span>
                                    <span className="flex items-center gap-1">
                                        📅 {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="avatar">
                                            {project.admin?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Created by</p>
                                            <p className="text-sm text-gray-300">{project.admin?.name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-ghost text-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/project/${project._id}`);
                                        }}
                                    >
                                        View →
                                    </button>
                                </div>

                                {/* Admin Actions */}
                                {isAdmin && (
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/project/${project._id}`);
                                            }}
                                            className="flex-1 px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg text-violet-400 text-sm font-medium transition-all"
                                        >
                                            ✏️ Manage
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(project._id);
                                            }}
                                            className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Project Form Modal */}
            {showForm && (
                <ProjectForm
                    mode="create"
                    onSubmit={handleCreateProject}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default Projects;
