import express from 'express';
import {
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
} from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User-specific routes
router.get('/my-tickets', getMyTickets);
router.get('/created-by-me', getCreatedByMe);

// Project-specific routes
router.get('/project/:projectId', getProjectTickets);
router.get('/project/:projectId/stats', getProjectStats);

// Ticket CRUD routes
router.post('/', createTicket);
router.get('/:id', getTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

// Attachment routes
router.post('/:id/upload', upload.single('file'), uploadAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

export default router;
