import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ admin: req.user._id }, { teamMembers: req.user._id }],
        })
            .populate('admin', 'name email role')
            .populate('teamMembers', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
        });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('admin', 'name email role')
            .populate('teamMembers', 'name email role');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if user is admin or team member
        const isAdmin = project.admin._id.toString() === req.user._id.toString();
        const isTeamMember = project.teamMembers.some(
            (member) => member._id.toString() === req.user._id.toString()
        );

        if (!isAdmin && !isTeamMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this project',
            });
        }

        res.status(200).json({
            success: true,
            data: project,
            isAdmin,
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
        });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and description',
            });
        }

        // Create project with logged-in user as admin
        const project = await Project.create({
            title,
            description,
            status: status || 'active',
            admin: req.user._id,
            teamMembers: [req.user._id],
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project,
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create project',
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if user is admin
        if (project.admin._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only project admin can update project',
            });
        }

        const { title, description, status } = req.body;

        // Update fields
        if (title) project.title = title;
        if (description) project.description = description;
        if (status) project.status = status;

        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project,
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update project',
        });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if user is admin
        if (project.admin._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only project admin can delete project',
            });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete project',
        });
    }
};

// @desc    Add team member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
export const addTeamMember = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide user email',
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if user is admin
        if (project.admin._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only project admin can add team members',
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email',
            });
        }

        // Check if already a team member
        if (project.teamMembers.some((member) => member._id.toString() === user._id.toString())) {
            return res.status(400).json({
                success: false,
                message: 'User is already a team member',
            });
        }

        // Add to team members
        project.teamMembers.push(user._id);
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Team member added successfully',
            data: project,
        });
    } catch (error) {
        console.error('Add team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add team member',
        });
    }
};

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin only)
export const removeTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Check if user is admin
        if (project.admin._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only project admin can remove team members',
            });
        }

        // Cannot remove admin
        if (req.params.userId === project.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove project admin from team',
            });
        }

        // Remove from team members
        project.teamMembers = project.teamMembers.filter(
            (member) => member._id.toString() !== req.params.userId
        );

        await project.save();

        res.status(200).json({
            success: true,
            message: 'Team member removed successfully',
            data: project,
        });
    } catch (error) {
        console.error('Remove team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove team member',
        });
    }
};
