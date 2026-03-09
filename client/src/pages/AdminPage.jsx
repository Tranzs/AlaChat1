import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Avatar from '../components/Avatar/Avatar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { usersApi, messagesApi } from '../utils/api';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();
  const { isOnline } = useSocket();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'messages'
  
  // New user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/chats');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    try {
      const usersData = await usersApi.getAll();
      setUsers(usersData);
      
      // Load all recent messages for admin to manage
      const allMessages = [];
      for (const u of usersData) {
        if (u.id !== user.id) {
          try {
            const msgs = await messagesApi.getConversation(u.id, user.id);
            allMessages.push(...msgs.map(m => ({ ...m, partnerName: u.name })));
          } catch {}
        }
      }
      // Sort by timestamp descending
      allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMessages(allMessages.slice(0, 50)); // Show latest 50
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newUserName.trim() || !newUserUsername.trim() || !newUserPassword.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newUserUsername.trim().length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    if (newUserPassword.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự');
      return;
    }

    try {
      // Use register API
      const { usersApi } = await import('../utils/api');
      await usersApi.register(newUserUsername.trim(), newUserPassword, newUserName.trim());
      setNewUserName('');
      setNewUserUsername('');
      setNewUserPassword('');
      setSuccess('Thêm user thành công!');
      loadData();
    } catch (err) {
      setError(err.message || 'Lỗi thêm user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa user này? Tin nhắn của user cũng sẽ bị xóa.')) return;
    
    try {
      await usersApi.deleteUser(userId, true);
      setSuccess('Xóa user thành công!');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await usersApi.updateRole(userId, newRole, true);
      setSuccess(`Đổi role thành ${newRole === 'admin' ? 'Quản lý' : 'Người dùng'} thành công!`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;
    
    try {
      await messagesApi.deleteMessage(messageId, user.id, true);
      setSuccess('Xóa tin nhắn thành công!');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <Header 
        title="Quản lý" 
        user={user}
        showBack 
      />
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Tin nhắn ({messages.length})
        </button>
      </div>

      <div className="admin-content">
        {error && <p className="admin-message admin-message--error">{error}</p>}
        {success && <p className="admin-message admin-message--success">{success}</p>}

        {activeTab === 'users' && (
          <>
            {/* Add User Section */}
            <section className="admin-section">
              <h2 className="admin-section__title">➕ Thêm User Mới</h2>
              <form className="admin-form admin-form--add" onSubmit={handleAddUser}>
                <input
                  type="text"
                  className="admin-form__input"
                  placeholder="Tên đăng nhập..."
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  maxLength={30}
                />
                <input
                  type="text"
                  className="admin-form__input"
                  placeholder="Tên hiển thị..."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  maxLength={30}
                />
                <input
                  type="password"
                  className="admin-form__input"
                  placeholder="Mật khẩu..."
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  maxLength={50}
                />
                <button type="submit" className="admin-form__btn admin-form__btn--primary">
                  Thêm
                </button>
              </form>
            </section>

            {/* Users List */}
            <section className="admin-section">
              <h2 className="admin-section__title">📋 Danh sách User</h2>
              
              {loading ? (
                <div className="admin-loading">Đang tải...</div>
              ) : (
                <div className="admin-users">
                  {users.map(u => (
                    <div key={u.id} className="admin-user">
                      <Avatar 
                        name={u.name} 
                        src={u.avatar}
                        size="medium"
                        showOnline
                        isOnline={isOnline(u.id)}
                      />
                      <div className="admin-user__info">
                        <span className="admin-user__name">
                          {u.name}
                          {u.role === 'admin' && (
                            <span className="admin-badge">👑 Admin</span>
                          )}
                        </span>
                        <span className="admin-user__status">
                          {u.username && <small>@{u.username}</small>}
                          {' • '}
                          {isOnline(u.id) ? '🟢 Online' : '⚪ Offline'}
                        </span>
                      </div>
                      <div className="admin-user__actions">
                        {u.id !== user.id && (
                          <>
                            <select 
                              className="admin-user__role-select"
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button 
                              className="admin-user__btn admin-user__btn--delete"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'messages' && (
          <section className="admin-section">
            <h2 className="admin-section__title">💬 Tin nhắn gần đây</h2>
            
            {loading ? (
              <div className="admin-loading">Đang tải...</div>
            ) : messages.length === 0 ? (
              <div className="admin-empty">Chưa có tin nhắn nào</div>
            ) : (
              <div className="admin-messages">
                {messages.map(m => (
                  <div key={m.id} className="admin-message-item">
                    <div className="admin-message-item__header">
                      <span className="admin-message-item__from">
                        {m.from_user_id === user.id ? 'Bạn' : m.partnerName}
                      </span>
                      <span className="admin-message-item__arrow">→</span>
                      <span className="admin-message-item__to">
                        {m.to_user_id === user.id ? 'Bạn' : m.partnerName}
                      </span>
                      <span className="admin-message-item__time">
                        {formatTime(m.timestamp)}
                      </span>
                    </div>
                    <div className="admin-message-item__content">
                      {m.content}
                    </div>
                    <button 
                      className="admin-message-item__delete"
                      onClick={() => handleDeleteMessage(m.id)}
                      title="Xóa tin nhắn"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
