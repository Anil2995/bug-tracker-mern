import express from 'express';
import {
    getTicketComments,
    createComment,
    updateComment,
    deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Comment routes
router.get('/ticket/:ticketId', getTicketComments);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
