import { Router } from 'express';
import {
  sendMessage,
  getInbox,
  getSentMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Message Routes
 * 
 * POST   /api/messages          - Send a message
 * GET    /api/messages/inbox    - Get inbox messages
 * GET    /api/messages/sent     - Get sent messages
 * GET    /api/messages/unread   - Get unread count
 * PATCH  /api/messages/:id/read - Mark message as read
 * DELETE /api/messages/:id      - Delete message
 */

// All routes require authentication
router.use(protect);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/sent', getSentMessages);
router.get('/unread', getUnreadCount);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;
