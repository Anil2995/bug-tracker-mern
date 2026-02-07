import Comment from '../models/Comment.js';
import Ticket from '../models/Ticket.js';
import Project from '../models/Project.js';

// @desc    Get all comments for a ticket
// @route   GET /api/comments/ticket/:ticketId
// @access  Private (team members only)
export const getTicketComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Check if ticket exists
        const ticket = await Ticket.findById(ticketId).populate('project');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user is a team member
        const project = await Project.findById(ticket.project._id);
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({ message: 'Not authorized to view comments' });
        }

        // Get comments
        const comments = await Comment.find({ ticket: ticketId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private (team members only)
export const createComment = async (req, res) => {
    try {
        const { ticket: ticketId, text } = req.body;

        // Validate input
        if (!ticketId || !text) {
            return res.status(400).json({ message: 'Ticket ID and text are required' });
        }

        // Check if ticket exists
        const ticket = await Ticket.findById(ticketId).populate('project');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user is a team member
        const project = await Project.findById(ticket.project._id);
        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({ message: 'Not authorized to comment on this ticket' });
        }

        // Create comment
        const comment = await Comment.create({
            ticket: ticketId,
            user: req.user._id,
            text,
        });

        // Populate user details
        await comment.populate('user', 'name email');

        res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (comment owner only)
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        // Find comment
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user owns the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        // Update comment
        comment.text = text || comment.text;
        await comment.save();

        // Populate user details
        await comment.populate('user', 'name email');

        res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (comment owner only)
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find comment
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user owns the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Delete comment
        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
