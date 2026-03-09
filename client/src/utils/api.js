// Dynamic API URL - works for both localhost, LAN, and production
// Uses relative paths which work with both dev server and production build

// Get API base URL based on current environment
export const getApiBaseUrl = () => {
  // In production (served from same server), use relative path
  // In development with Vite, use proxy
  return '';  // Relative path works for both
};

// Get server URL for socket.io
export const getServerUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isLocalHost) {
    return 'http://localhost:3001';
  }
  
  // For LAN/production: use current host
  return `http://${hostname}:3001`;
};

// Helper function for API calls
async function fetchApi(endpoint, options = {}) {
  const API_URL = getApiBaseUrl();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error?.message || 'API Error');
  }
  
  return result.data;
}

// Users API
export const usersApi = {
  getAll: () => fetchApi('/api/users'),
  
  getById: (id) => fetchApi(`/api/users/${id}`),
  
  create: (name, avatar) => 
    fetchApi('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, avatar })
    }),
  
  // Login with username/password
  login: (username, password) =>
    fetchApi('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  
  // Register new user
  register: (username, password, name, avatar) =>
    fetchApi('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, name, avatar })
    }),
  
  update: (id, data) => 
    fetchApi(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  updateOnline: (id) => 
    fetchApi(`/api/users/${id}/online`, { method: 'PATCH' }),
  
  // Admin endpoints
  deleteUser: (id, isAdmin) => 
    fetchApi(`/api/users/${id}?isAdmin=${isAdmin}`, {
      method: 'DELETE'
    }),
    
  updateRole: (id, role, isAdmin) => 
    fetchApi(`/api/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role, isAdmin })
    })
};

// Messages API
export const messagesApi = {
  getConversation: (userId, currentUserId) => 
    fetchApi(`/api/messages/${userId}?currentUserId=${currentUserId}`),
  
  getChats: (userId) => 
    fetchApi(`/api/messages?userId=${userId}`),
  
  deleteMessage: (id, userId, isAdmin) => 
    fetchApi(`/api/messages/${id}?userId=${userId}&isAdmin=${isAdmin}`, {
      method: 'DELETE'
    })
};

// Online status API
export const onlineApi = {
  getOnlineUsers: () => fetchApi('/api/online'),
  
  isUserOnline: (userId) => fetchApi(`/api/online/${userId}`)
};

// Reactions API
export const reactionsApi = {
  getByMessageId: (messageId) => fetchApi(`/api/reactions/${messageId}`),
  
  addReaction: (messageId, userId, emoji) => 
    fetchApi('/api/reactions', {
      method: 'POST',
      body: JSON.stringify({ messageId, userId, emoji })
    }),
  
  removeReaction: (id, userId) => 
    fetchApi(`/api/reactions/${id}?userId=${userId}`, {
      method: 'DELETE'
    }),
    
  getValidReactions: () => fetchApi('/api/reactions/valid/list')
};

export default { usersApi, messagesApi, onlineApi, reactionsApi };
