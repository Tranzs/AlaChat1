import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Avatar from '../components/Avatar/Avatar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { usersApi } from '../utils/api';
import './UsersPage.css';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { isOnline } = useSocket();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      // Filter out current user
      setUsers(data.filter(u => u.id !== currentUser?.id));
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineUsers = filteredUsers.filter(u => isOnline(u.id));
  const offlineUsers = filteredUsers.filter(u => !isOnline(u.id));

  return (
    <div className="users-page">
      <Header title="Tìm người dùng" showBack user={currentUser} />
      
      <div className="users-search">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="users-search__input"
          autoFocus
        />
      </div>

      <div className="users-list">
        {loading ? (
          <div className="users-loading">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-user">
                <div className="skeleton skeleton--avatar" />
                <div className="skeleton skeleton--name" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-empty">
            <span>🔍</span>
            <p>{searchQuery ? 'Không tìm thấy người dùng' : 'Không có người dùng nào'}</p>
          </div>
        ) : (
          <>
            {onlineUsers.length > 0 && (
              <div className="users-section">
                <div className="users-section__title">
                  <span className="users-section__dot" /> 
                  Đang online ({onlineUsers.length})
                </div>
                {onlineUsers.map(user => (
                  <button
                    key={user.id}
                    className="user-item"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <Avatar 
                      name={user.name} 
                      src={user.avatar}
                      size="medium"
                      showOnline
                      isOnline={true}
                    />
                    <span className="user-item__name">
                      {user.name}
                      {user.role === 'admin' && <span className="user-badge">Admin</span>}
                    </span>
                    <span className="user-item__arrow">➤</span>
                  </button>
                ))}
              </div>
            )}

            {offlineUsers.length > 0 && (
              <div className="users-section">
                <div className="users-section__title">
                  <span className="users-section__dot offline" /> 
                  Offline ({offlineUsers.length})
                </div>
                {offlineUsers.map(user => (
                  <button
                    key={user.id}
                    className="user-item"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <Avatar 
                      name={user.name} 
                      src={user.avatar}
                      size="medium"
                      showOnline
                      isOnline={false}
                    />
                    <span className="user-item__name">
                      {user.name}
                      {user.role === 'admin' && <span className="user-badge">Admin</span>}
                    </span>
                    <span className="user-item__arrow">➤</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
