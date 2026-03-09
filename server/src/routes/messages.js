import express from 'express';
import { runQuery, getOne, getAll } from '../db/index.js';

const router = express.Router();

// GET /api/messages/:userId - Get messages with a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.query.currentUserId;

    if (!currentUserId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'MISSING_PARAM', message: 'currentUserId is required' }
      });
    }

    const messages = await getAll(`
      SELECT * FROM messages 
      WHERE (from_user_id = ? AND to_user_id = ?) 
         OR (from_user_id = ? AND to_user_id = ?)
      ORDER BY timestamp ASC
    `, [currentUserId, userId, userId, currentUserId]);

    // Mark messages as read
    await runQuery(`
      UPDATE messages 
      SET is_read = 1 
      WHERE from_user_id = ? AND to_user_id = ? AND is_read = 0
    `, [userId, currentUserId]);

    res.json({
      success: true,
      data: messages,
      error: null
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch messages' }
    });
  }
});

// GET /api/chats - Get chat list (conversations)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'MISSING_PARAM', message: 'userId is required' }
      });
    }

    // Get all users the current user has chatted with, along with the latest message
    const chats = await getAll(`
      SELECT 
        CASE 
          WHEN from_user_id = ? THEN to_user_id 
          ELSE from_user_id 
        END as partner_id,
        (SELECT name FROM users WHERE id = partner_id) as partner_name,
        (SELECT avatar FROM users WHERE id = partner_id) as partner_avatar,
        (SELECT last_active FROM users WHERE id = partner_id) as partner_last_active,
        (SELECT content FROM messages WHERE 
          (from_user_id = ? AND to_user_id = partner_id) OR 
          (from_user_id = partner_id AND to_user_id = ?)
          ORDER BY timestamp DESC LIMIT 1) as last_message,
        (SELECT timestamp FROM messages WHERE 
          (from_user_id = ? AND to_user_id = partner_id) OR 
          (from_user_id = partner_id AND to_user_id = ?)
          ORDER BY timestamp DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages WHERE 
          from_user_id = partner_id AND to_user_id = ? AND is_read = 0) as unread_count
      FROM messages
      WHERE from_user_id = ? OR to_user_id = ?
      GROUP BY partner_id
      ORDER BY last_message_time DESC
    `, [userId, userId, userId, userId, userId, userId, userId, userId]);

    res.json({
      success: true,
      data: chats,
      error: null
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch chats' }
    });
  }
});

// DELETE /api/messages/:id - Delete a message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, isAdmin } = req.query;

    const message = await getOne('SELECT * FROM messages WHERE id = ?', [id]);

    if (!message) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Message not found' }
      });
    }

    // Check if user is admin (isAdmin can be "true" string or boolean)
    const isAdminBool = isAdmin === 'true' || isAdmin === true;
    
    // Only allow sender or admin to delete
    if (message.from_user_id !== parseInt(userId) && !isAdminBool) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Not authorized to delete this message' }
      });
    }

    // Delete reactions on this message first
    await runQuery('DELETE FROM reactions WHERE message_id = ?', [id]);
    await runQuery('DELETE FROM messages WHERE id = ?', [id]);

    res.json({
      success: true,
      data: { id },
      error: null
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete message' }
    });
  }
});

export default router;
