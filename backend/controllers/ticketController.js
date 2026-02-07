import Ticket from '../models/Ticket.js';
import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all tickets for a project
// @route   GET /api/tickets/project/:projectId
// @access  Private (Team members only)
export const getProjectTickets = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, priority, assignedTo, sortBy } = req.query;

        // Check if project exists and user has access
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if user is team member or admin (teamMembers contains ObjectIds directly)
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );
        if (!isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this project\'s tickets',
            });
        }

        // Build query
        const query = { project: projectId };
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        // Build sort
        let sort = {};
        switch (sortBy) {
            case 'priority-high':
                sort = { priority: -1, createdAt: -1 };
                break;
            case 'priority-low':
                sort = { priority: 1, createdAt: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'dueDate':
                sort = { dueDate: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const tickets = await Ticket.find(query)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort(sort);

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        console.error('Get project tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tickets',
        });
    }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private (Team members only)
export const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Check if user is team member (need to populate project first)
        const project = await Project.findById(ticket.project);
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this ticket',
            });
        }

        res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket',
        });
    }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Team members only)
export const createTicket = async (req, res) => {
    try {
        const { title, description, priority, status, project, assignedTo, dueDate } = req.body;

        // Validation
        if (!title || !description || !project) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, and project',
            });
        }

        // Check if project exists and user is team member
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const isTeamMember = projectDoc.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create tickets in this project',
            });
        }

        // If assignedTo is provided, verify they're a team member
        if (assignedTo) {
            const isAssigneeTeamMember = projectDoc.teamMembers.some(
                (member) => member.toString() === assignedTo
            );

            if (!isAssigneeTeamMember) {
                return res.status(400).json({
                    success: false,
                    message: 'Assigned user must be a team member of the project',
                });
            }
        }

        // Create ticket
        const ticket = await Ticket.create({
            title,
            description,
            priority: priority || 'medium',
            status: status || 'to-do',
            project,
            createdBy: req.user._id,
            assignedTo: assignedTo || null,
            dueDate: dueDate || null,
        });

        res.status(201).json({
            success: true,
            message: 'Ticket created successfully',
            data: ticket,
        });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create ticket',
        });
    }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private (Team members only)
export const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Check if user is team member (need to get project for teamMembers)
        const project = await Project.findById(ticket.project);
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this ticket',
            });
        }

        const { title, description, priority, status, assignedTo, dueDate } = req.body;

        // If assignedTo is being changed, verify they're a team member
        if (assignedTo && assignedTo !== ticket.assignedTo?.toString()) {
            const isAssigneeTeamMember = project.teamMembers.some(
                (member) => member.toString() === assignedTo
            );

            if (!isAssigneeTeamMember) {
                return res.status(400).json({
                    success: false,
                    message: 'Assigned user must be a team member of the project',
                });
            }
        }

        // Update fields
        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (priority) ticket.priority = priority;
        if (status) ticket.status = status;
        if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;
        if (dueDate !== undefined) ticket.dueDate = dueDate || null;

        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Ticket updated successfully',
            data: ticket,
        });
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update ticket',
        });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Creator or Project Admin only)
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Check if user is ticket creator or project admin
        const project = await Project.findById(ticket.project);
        const isCreator = ticket.createdBy.toString() === req.user._id.toString();
        const isProjectAdmin = project.admin.toString() === req.user._id.toString();

        if (!isCreator && !isProjectAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only ticket creator or project admin can delete tickets',
            });
        }

        await ticket.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully',
        });
    } catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete ticket',
        });
    }
};

// @desc    Get tickets assigned to current user
// @route   GET /api/tickets/my-tickets
// @access  Private
export const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            assignedTo: req.user._id,
        })
            .populate('project', 'title status')
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        console.error('Get my tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your tickets',
        });
    }
};

// @desc    Get tickets created by current user
// @route   GET /api/tickets/created-by-me
// @access  Private
export const getCreatedByMe = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            createdBy: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        console.error('Get created tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your created tickets',
        });
    }
};

// @desc    Get ticket statistics for a project
// @route   GET /api/tickets/project/:projectId/stats
// @access  Private (Team members only)
export const getProjectStats = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Check if project exists and user has access
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this project\'s statistics',
            });
        }

        // Get all tickets for the project
        const tickets = await Ticket.find({ project: projectId });

        // Calculate stats
        const stats = {
            total: tickets.length,
            byStatus: {
                'to-do': tickets.filter((t) => t.status === 'to-do').length,
                'in-progress': tickets.filter((t) => t.status === 'in-progress').length,
                done: tickets.filter((t) => t.status === 'done').length,
            },
            byPriority: {
                low: tickets.filter((t) => t.priority === 'low').length,
                medium: tickets.filter((t) => t.priority === 'medium').length,
                high: tickets.filter((t) => t.priority === 'high').length,
            },
            assigned: tickets.filter((t) => t.assignedTo).length,
            unassigned: tickets.filter((t) => !t.assignedTo).length,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error('Get project stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project statistics',
        });
    }
};

// @desc    Upload attachment to ticket
// @route   POST /api/tickets/:id/upload
// @access  Private (Team members only)
export const uploadAttachment = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            // Delete uploaded file if ticket not found
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Check if user is team member (need to get project for teamMembers)
        const project = await Project.findById(ticket.project);
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            // Delete uploaded file if not authorized
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload attachments to this ticket',
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // Add attachment to ticket
        const attachment = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user._id,
            uploadedAt: new Date(),
        };

        ticket.attachments.push(attachment);
        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: ticket,
        });
    } catch (error) {
        console.error('Upload attachment error:', error);
        // Delete uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Failed to upload attachment',
        });
    }
};

// @desc    Delete attachment from ticket
// @route   DELETE /api/tickets/:id/attachments/:attachmentId
// @access  Private (Team members only)
export const deleteAttachment = async (req, res) => {
    try {
        const { id, attachmentId } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Check if user is team member (need to get project for teamMembers)
        const project = await Project.findById(ticket.project);
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete attachments from this ticket',
            });
        }

        // Find attachment
        const attachment = ticket.attachments.id(attachmentId);

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found',
            });
        }

        // Delete file from filesystem
        const filePath = path.join(__dirname, '../uploads', attachment.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove attachment from ticket
        ticket.attachments.pull(attachmentId);
        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Attachment deleted successfully',
            data: ticket,
        });
    } catch (error) {
        console.error('Delete attachment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete attachment',
        });
    }
};
