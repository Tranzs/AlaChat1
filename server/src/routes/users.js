import express from 'express';
import { runQuery, getOne, getAll } from '../db/index.js';

const router = express.Router();

// POST /api/users/register - Register new user with username/password
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, avatar } = req.body;
    
    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'MISSING_FIELDS', message: 'Username, password, and name are required' }
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_USERNAME', message: 'Username must be at least 3 characters' }
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 4 characters' }
      });
    }

    // Check if username already exists
    const existing = await getOne('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        error: { code: 'USERNAME_EXISTS', message: 'Username already exists' }
      });
    }

    // Simple password hashing (for internal use)
    const hashedPassword = btoa(password);

    const result = await runQuery(
      'INSERT INTO users (username, password, name, avatar, last_active) VALUES (?, ?, ?, ?, datetime("now"))',
      [username.trim(), hashedPassword, name.trim(), avatar || null]
    );

    const user = await getOne('SELECT * FROM users WHERE id = ?', [result.lastID]);

    // Don't return password
    delete user.password;

    res.status(201).json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to register user' }
    });
  }
});

// POST /api/users/login - Login with username/password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'MISSING_FIELDS', message: 'Username and password are required' }
      });
    }

    // Simple password hashing (for internal use)
    const hashedPassword = btoa(password);

    const user = await getOne('SELECT * FROM users WHERE username = ? AND password = ?', 
      [username.trim(), hashedPassword]);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' }
      });
    }

    // Update last active
    await runQuery('UPDATE users SET last_active = datetime("now") WHERE id = ?', [user.id]);

    // Don't return password
    delete user.password;

    res.json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to login' }
    });
  }
});

// POST /api/users - Create new user (legacy - for backward compatibility)
router.post('/', async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_NAME', message: 'Name is required' }
      });
    }

    const result = await runQuery(
      'INSERT INTO users (name, avatar, last_active) VALUES (?, ?, datetime("now"))',
      [name.trim(), avatar || null]
    );

    const user = await getOne('SELECT * FROM users WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to create user' }
    });
  }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAll('SELECT * FROM users ORDER BY name');
    
    res.json({
      success: true,
      data: users,
      error: null
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch users' }
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getOne('SELECT * FROM users WHERE id = ?', [id]);

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch user' }
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;

    const existingUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name.trim());
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      params.push(avatar);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'NO_UPDATES', message: 'No fields to update' }
      });
    }

    params.push(id);
    await runQuery(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const updatedUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      data: updatedUser,
      error: null
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to update user' }
    });
  }
});

// PATCH /api/users/:id/online - Update user's last active
router.patch('/:id/online', async (req, res) => {
  try {
    const { id } = req.params;
    
    await runQuery('UPDATE users SET last_active = datetime("now") WHERE id = ?', [id]);

    res.json({
      success: true,
      data: { id, last_active: new Date().toISOString() },
      error: null
    });
  } catch (error) {
    console.error('Error updating last active:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to update last active' }
    });
  }
});

// POST /api/users/:id/avatar - Upload avatar image
router.post('/:id/avatar', async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    const existingUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    // Validate avatar data
    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_AVATAR', message: 'Avatar data is required' }
      });
    }

    // Check if it's a valid base64 image
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif);base64,/;
    if (!base64Pattern.test(avatar)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_FORMAT', message: 'Only JPG, PNG, GIF images are allowed' }
      });
    }

    // Check file size (max 2MB = 2 * 1024 * 1024 bytes = 2097152)
    const base64Data = avatar.replace(base64Pattern, '');
    const fileSize = (base64Data.length * 3) / 4;
    if (fileSize > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'FILE_TOO_LARGE', message: 'Image must be less than 2MB' }
      });
    }

    await runQuery('UPDATE users SET avatar = ? WHERE id = ?', [avatar, id]);

    const updatedUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      data: updatedUser,
      error: null
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to upload avatar' }
    });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.query;

    // Check if admin
    if (!isAdmin || isAdmin !== 'true') {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin permission required' }
      });
    }

    const existingUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    // Delete user's messages first
    await runQuery('DELETE FROM messages WHERE from_user_id = ? OR to_user_id = ?', [id, id]);
    // Delete user's reactions
    await runQuery('DELETE FROM reactions WHERE user_id = ?', [id]);
    // Delete user
    await runQuery('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      data: { id, message: 'User deleted successfully' },
      error: null
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete user' }
    });
  }
});

// PATCH /api/users/:id/role - Update user role (admin only)
router.patch('/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isAdmin } = req.body;

    // Check if admin
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin permission required' }
      });
    }

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_ROLE', message: 'Role must be user or admin' }
      });
    }

    const existingUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    await runQuery('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    const updatedUser = await getOne('SELECT * FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      data: updatedUser,
      error: null
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to update user role' }
    });
  }
});

// POST /api/users/verify-password - Verify current password
router.post('/verify-password', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'MISSING_FIELDS', message: 'User ID and password are required' }
      });
    }

    const hashedPassword = btoa(password);
    const user = await getOne('SELECT * FROM users WHERE id = ? AND password = ?', 
      [userId, hashedPassword]);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'INVALID_PASSWORD', message: 'Invalid password' }
      });
    }

    res.json({
      success: true,
      data: { valid: true },
      error: null
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to verify password' }
    });
  }
});

// PATCH /api/users/:id/password - Change password
router.patch('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 4 characters' }
      });
    }

    const hashedPassword = btoa(password);
    await runQuery('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({
      success: true,
      data: { message: 'Password updated successfully' },
      error: null
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to change password' }
    });
  }
});

export default router;
