import { useState, useEffect } from 'react';

const ProjectForm = ({ mode = 'create', project = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'active',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (mode === 'edit' && project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                status: project.status || 'active',
            });
        }
    }, [mode, project]);

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > 500) {
            newErrors.description = 'Description must be 500 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* Header */}
                <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        {mode === 'create' ? '✨ Create New Project' : '✏️ Edit Project'}
                    </h2>
                    <p className="text-gray-400 mt-1">
                        {mode === 'create'
                            ? 'Start a new project to organize your bugs and tasks'
                            : 'Update project information'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="e.g., E-commerce Website Redesign"
                            maxLength={100}
                        />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        <p className="text-gray-500 text-xs mt-1">{formData.title.length}/100 characters</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Describe your project goals, features, and objectives..."
                            maxLength={500}
                        />
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="active">🟢 Active</option>
                            <option value="archived">📦 Archived</option>
                            <option value="completed">✅ Completed</option>
                        </select>
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
                        <button type="submit" className="btn-primary flex-1" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                </span>
                            ) : (
                                <span>{mode === 'create' ? '🚀 Create Project' : '💾 Save Changes'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
