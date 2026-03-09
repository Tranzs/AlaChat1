import express from 'express';
import { runQuery, getOne, getAll } from '../db/index.js';

const router = express.Router();

// Available reactions
const VALID_REACTIONS = ['❤️', '😂', '😮', '😢', '👍'];

// GET /api/reactions/:messageId - Get all reactions for a message
router.get('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    const reactions = await getAll(`
      SELECT r.*, u.name as user_name
      FROM reactions r
      JOIN users u ON r.user_id = u.id
      WHERE r.message_id = ?
      ORDER BY r.created_at DESC
    `, [messageId]);

    // Group reactions by emoji with user info
    const groupedReactions = {};
    reactions.forEach(reaction => {
      if (!groupedReactions[reaction.emoji]) {
        groupedReactions[reaction.emoji] = {
          emoji: reaction.emoji,
          users: [],
          count: 0
        };
      }
      groupedReactions[reaction.emoji].users.push({
        id: reaction.user_id,
        name: reaction.user_name
      });
      groupedReactions[reaction.emoji].count++;
    });

    res.json({
      success: true,
      data: Object.values(groupedReactions),
      error: null
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch reactions' }
    });
  }
});

// POST /api/reactions - Add or update reaction
router.post('/', async (req, res) => {
  try {
    const { messageId, userId, emoji } = req.body;

    // Validate required fields
    if (!messageId || !userId || !emoji) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_REQUEST', message: 'messageId, userId, and emoji are required' }
      });
    }

    // Validate emoji
    if (!VALID_REACTIONS.includes(emoji)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_REACTION', message: 'Invalid reaction emoji' }
      });
    }

    // Check if message exists
    const message = await getOne('SELECT * FROM messages WHERE id = ?', [messageId]);
    if (!message) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Message not found' }
      });
    }

    // Check if user exists
    const user = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    // Check if reaction already exists (toggle - remove if exists)
    const existingReaction = await getOne(
      'SELECT * FROM reactions WHERE message_id = ? AND user_id = ? AND emoji = ?',
      [messageId, userId, emoji]
    );

    if (existingReaction) {
      // Remove existing reaction
      await runQuery('DELETE FROM reactions WHERE id = ?', [existingReaction.id]);
      
      res.json({
        success: true,
        data: { action: 'removed', emoji, messageId, userId },
        error: null
      });
    } else {
      // Add new reaction
      const result = await runQuery(
        'INSERT INTO reactions (message_id, user_id, emoji) VALUES (?, ?, ?)',
        [messageId, userId, emoji]
      );

      const newReaction = await getOne('SELECT * FROM reactions WHERE id = ?', [result.lastID]);

      res.status(201).json({
        success: true,
        data: { action: 'added', reaction: newReaction },
        error: null
      });
    }
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to add reaction' }
    });
  }
});

// DELETE /api/reactions/:id - Remove a specific reaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Optional: verify ownership

    const existingReaction = await getOne('SELECT * FROM reactions WHERE id = ?', [id]);
    if (!existingReaction) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'REACTION_NOT_FOUND', message: 'Reaction not found' }
      });
    }

    // If userId provided, verify ownership
    if (userId && existingReaction.user_id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Cannot delete other user\'s reaction' }
      });
    }

    await runQuery('DELETE FROM reactions WHERE id = ?', [id]);

    res.json({
      success: true,
      data: { action: 'deleted', id },
      error: null
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to remove reaction' }
    });
  }
});

// Export valid reactions for frontend
router.get('/valid/list', (req, res) => {
  res.json({
    success: true,
    data: VALID_REACTIONS,
    error: null
  });
});

export default router;
