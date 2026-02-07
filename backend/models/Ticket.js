import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Ticket title is required'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters'],
        },
        description: {
            type: String,
            required: [true, 'Ticket description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
            required: true,
        },
        status: {
            type: String,
            enum: ['to-do', 'in-progress', 'done'],
            default: 'to-do',
            required: true,
        },
        type: {
            type: String,
            enum: ['bug', 'feature', 'task'],
            default: 'task',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Ticket must belong to a project'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Ticket must have a creator'],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        attachments: [
            {
                filename: {
                    type: String,
                    required: true,
                },
                originalName: {
                    type: String,
                    required: true,
                },
                mimetype: {
                    type: String,
                    required: true,
                },
                size: {
                    type: Number,
                    required: true,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
                uploadedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdBy: 1 });

// Populate creator, assignedTo, and project on find queries
ticketSchema.pre(/^find/, function () {
    this.populate({
        path: 'createdBy',
        select: 'name email',
    })
        .populate({
            path: 'assignedTo',
            select: 'name email',
        })
        .populate({
            path: 'project',
            select: 'title status admin teamMembers',
        });
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
