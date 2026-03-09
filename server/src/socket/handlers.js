import { runQuery, getOne, getAll } from '../db/index.js';

// Store connected users
const connectedUsers = new Map();

// Initialize socket handlers
export function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // User connects with their userId
    socket.on('connect_user', async ({ userId }) => {
      if (!userId) return;

      // Store user connection
      connectedUsers.set(userId, {
        socketId: socket.id,
        userId: userId,
        connectedAt: new Date()
      });

      // Join user's personal room
      socket.join(`user_${userId}`);

      // Update last active in database
      await runQuery('UPDATE users SET last_active = datetime("now") WHERE id = ?', [userId]);

      // Broadcast user online status
      io.emit('user_online', { userId });

      console.log(`User ${userId} connected`);
    });

    // Handle sending a message
    socket.on('send_message', async ({ fromUserId, toUserId, content }) => {
      try {
        if (!fromUserId || !toUserId || !content) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Save message to database
        const result = await runQuery(
          'INSERT INTO messages (from_user_id, to_user_id, content) VALUES (?, ?, ?)',
          [fromUserId, toUserId, content]
        );

        // Get the full message with timestamp
        const message = await getOne('SELECT * FROM messages WHERE id = ?', [result.lastID]);

        // Send to recipient
        io.to(`user_${toUserId}`).emit('new_message', message);

        // Send back to sender (for confirmation)
        socket.emit('message_sent', message);

        console.log(`Message from ${fromUserId} to ${toUserId}: ${content.substring(0, 30)}...`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ fromUserId, toUserId }) => {
      io.to(`user_${toUserId}`).emit('user_typing', { fromUserId });
    });

    // Handle stop typing
    socket.on('stop_typing', ({ fromUserId, toUserId }) => {
      io.to(`user_${toUserId}`).emit('user_stop_typing', { fromUserId });
    });

    // Handle adding a reaction
    socket.on('add_reaction', async ({ messageId, userId, emoji, toUserId }) => {
      try {
        // Validate required fields
        if (!messageId || !userId || !emoji) {
          socket.emit('error', { message: 'Missing required fields for reaction' });
          return;
        }

        // Validate messageId is a valid integer
        const parsedMessageId = parseInt(messageId);
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedMessageId) || isNaN(parsedUserId)) {
          socket.emit('error', { message: 'Invalid messageId or userId' });
          return;
        }

        // Validate emoji
        const VALID_REACTIONS = ['❤️', '😂', '😮', '😢', '👍'];
        if (!VALID_REACTIONS.includes(emoji)) {
          socket.emit('error', { message: 'Invalid reaction emoji' });
          return;
        }

        // Check if reaction already exists (toggle)
        const existingReaction = await getOne(
          'SELECT * FROM reactions WHERE message_id = ? AND user_id = ? AND emoji = ?',
          [parsedMessageId, parsedUserId, emoji]
        );

        let reactionData;

        if (existingReaction) {
          // Remove existing reaction
          await runQuery('DELETE FROM reactions WHERE id = ?', [existingReaction.id]);
          reactionData = { action: 'removed', messageId: parsedMessageId, userId: parsedUserId, emoji };
        } else {
          // Add new reaction
          const result = await runQuery(
            'INSERT INTO reactions (message_id, user_id, emoji) VALUES (?, ?, ?)',
            [parsedMessageId, parsedUserId, emoji]
          );
          const newReaction = await getOne('SELECT * FROM reactions WHERE id = ?', [result.lastID]);
          
          // Get user info
          const user = await getOne('SELECT name FROM users WHERE id = ?', [parsedUserId]);
          reactionData = { 
            action: 'added', 
            reaction: { ...newReaction, user_name: user?.name },
            messageId: parsedMessageId, 
            userId: parsedUserId, 
            emoji 
          };
        }

        // Broadcast to the chat participants
        if (toUserId) {
          io.to(`user_${toUserId}`).emit('reaction_update', reactionData);
        }
        
        // Also send back to sender
        socket.emit('reaction_update', reactionData);

        console.log(`Reaction ${reactionData.action}: ${emoji} on message ${messageId} by user ${userId}`);
      } catch (error) {
        console.error('Error handling reaction:', error);
        socket.emit('error', { message: 'Failed to handle reaction' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      // Find and remove user from connected users
      for (const [userId, data] of connectedUsers.entries()) {
        if (data.socketId === socket.id) {
          connectedUsers.delete(userId);
          
          // Broadcast user offline status
          io.emit('user_offline', { userId });
          
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

// Helper to get online users
export function getOnlineUsers() {
  return Array.from(connectedUsers.keys());
}

// Helper to check if user is online
export function isUserOnline(userId) {
  return connectedUsers.has(userId);
}
