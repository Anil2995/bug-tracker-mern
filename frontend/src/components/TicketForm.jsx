import { useState, useEffect } from 'react';

const TicketForm = ({ mode = 'create', ticket = null, projectId, teamMembers = [], onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'to-do',
        assignedTo: '',
        dueDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && ticket) {
            setFormData({
                title: ticket.title || '',
                description: ticket.description || '',
                priority: ticket.priority || 'medium',
                status: ticket.status || 'to-do',
                assignedTo: ticket.assignedTo?._id || '',
                dueDate: ticket.dueDate ? new Date(ticket.dueDate).toISOString().split('T')[0] : '',
            });
        }
    }, [mode, ticket]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (formData.title.length > 150) newErrors.title = 'Title cannot exceed 150 characters';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length > 2000) newErrors.description = 'Description cannot exceed 2000 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const submitData = {
            ...formData,
            project: projectId,
            assignedTo: formData.assignedTo || null,
            dueDate: formData.dueDate || null,
        };

        await onSubmit(submitData);
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="sticky top-0 bg-dark-900/80 backdrop-blur-sm p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        {mode === 'create' ? '🎫 Create New Ticket' : '✏️ Edit Ticket'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {mode === 'create' ? 'Create a new bug or task ticket' : 'Update ticket details'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-dark-800 border ${errors.title ? 'border-red-500' : 'border-white/10'
                                } rounded-lg focus:border-primary-500 focus:outline-none transition-colors`}
                            placeholder="Enter ticket title..."
                            maxLength={150}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.title && <span className="text-red-400 text-sm">{errors.title}</span>}
                            <span className="text-gray-500 text-xs ml-auto">
                                {formData.title.length}/150
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-4 py-3 bg-dark-800 border ${errors.description ? 'border-red-500' : 'border-white/10'
                                } rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none`}
                            placeholder="Describe the ticket in detail..."
                            maxLength={2000}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.description && <span className="text-red-400 text-sm">{errors.description}</span>}
                            <span className="text-gray-500 text-xs ml-auto">
                                {formData.description.length}/2000
                            </span>
                        </div>
                    </div>

                    {/* Row: Priority and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium mb-2">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>

                        {/* Type */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium mb-2">
                                Issue Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type || 'task'}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                            >
                                <option value="task">📝 Task</option>
                                <option value="bug">🐛 Bug</option>
                                <option value="feature">✨ Feature</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                            >
                                <option value="to-do">📋 To Do</option>
                                <option value="in-progress">🔄 In Progress</option>
                                <option value="done">✅ Done</option>
                            </select>
                        </div>
                    </div>

                    {/* Row: Assignee and Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Assign To */}
                        <div>
                            <label htmlFor="assignedTo" className="block text-sm font-medium mb-2">
                                Assign To
                            </label>
                            <select
                                id="assignedTo"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                            >
                                <option value="">Unassigned</option>
                                {teamMembers.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'create' ? '✨ Create Ticket' : '💾 Save Changes'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default TicketForm;
