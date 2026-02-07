import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios to include token in all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============= PROJECT API CALLS =============

// Get all projects
export const getProjects = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects`);
        return {
            success: true,
            data: response.data.data,
            count: response.data.count,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch projects',
        };
    }
};

// Get single project by ID
export const getProject = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/projects/${id}`);
        return {
            success: true,
            data: response.data.data,
            isAdmin: response.data.isAdmin,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch project',
        };
    }
};

// Create new project
export const createProject = async (projectData) => {
    try {
        const response = await axios.post(`${API_URL}/projects`, projectData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create project',
        };
    }
};

// Update project
export const updateProject = async (id, projectData) => {
    try {
        const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update project',
        };
    }
};

// Delete project
export const deleteProject = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/projects/${id}`);
        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete project',
        };
    }
};

// Add team member to project
export const addTeamMember = async (projectId, email) => {
    try {
        const response = await axios.post(`${API_URL}/projects/${projectId}/members`, { email });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add team member',
        };
    }
};

// Remove team member from project
export const removeTeamMember = async (projectId, userId) => {
    try {
        const response = await axios.delete(`${API_URL}/projects/${projectId}/members/${userId}`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove team member',
        };
    }
};

// ============= TICKET API CALLS =============

// Get all tickets for a project
export const getProjectTickets = async (projectId, filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.priority) queryParams.append('priority', filters.priority);
        if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

        const queryString = queryParams.toString();
        const url = `${API_URL}/tickets/project/${projectId}${queryString ? `?${queryString}` : ''}`;

        const response = await axios.get(url);
        return {
            success: true,
            data: response.data.data,
            count: response.data.count,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch tickets',
        };
    }
};

// Get single ticket by ID
export const getTicket = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/tickets/${id}`);
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch ticket',
        };
    }
};

// Create new ticket
export const createTicket = async (ticketData) => {
    try {
        const response = await axios.post(`${API_URL}/tickets`, ticketData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create ticket',
        };
    }
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
    try {
        const response = await axios.put(`${API_URL}/tickets/${id}`, ticketData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update ticket',
        };
    }
};

// Delete ticket
export const deleteTicket = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/tickets/${id}`);
        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete ticket',
        };
    }
};

// Upload attachment to ticket
export const uploadAttachment = async (ticketId, file, onProgress) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/tickets/${ticketId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to upload attachment',
        };
    }
};

// Delete attachment from ticket
export const deleteAttachment = async (ticketId, attachmentId) => {
    try {
        const response = await axios.delete(`${API_URL}/tickets/${ticketId}/attachments/${attachmentId}`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete attachment',
        };
    }
};

// Get tickets assigned to me
export const getMyTickets = async () => {
    try {
        const response = await axios.get(`${API_URL}/tickets/my-tickets`);
        return {
            success: true,
            data: response.data.data,
            count: response.data.count,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch your tickets',
        };
    }
};

// Get tickets created by me
export const getCreatedByMe = async () => {
    try {
        const response = await axios.get(`${API_URL}/tickets/created-by-me`);
        return {
            success: true,
            data: response.data.data,
            count: response.data.count,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch your created tickets',
        };
    }
};

// Get project statistics
export const getProjectStats = async (projectId) => {
    try {
        const response = await axios.get(`${API_URL}/tickets/project/${projectId}/stats`);
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch project statistics',
        };
    }
};

// ============= COMMENT API CALLS =============

// Get comments for a ticket
export const getTicketComments = async (ticketId) => {
    try {
        const response = await axios.get(`${API_URL}/comments/ticket/${ticketId}`);
        return {
            success: true,
            data: response.data.data,
            count: response.data.count,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch comments',
        };
    }
};

// Create a new comment
export const createComment = async (commentData) => {
    try {
        const response = await axios.post(`${API_URL}/comments`, commentData);
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create comment',
        };
    }
};

// Update a comment
export const updateComment = async (id, text) => {
    try {
        const response = await axios.put(`${API_URL}/comments/${id}`, { text });
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update comment',
        };
    }
};

// Delete a comment
export const deleteComment = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/comments/${id}`);
        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete comment',
        };
    }
};

export default {
    // Projects
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    // Tickets
    getProjectTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getMyTickets,
    getCreatedByMe,
    getProjectStats,
    uploadAttachment,
    deleteAttachment,
    // Comments
    getTicketComments,
    createComment,
    updateComment,
    deleteComment,
};
