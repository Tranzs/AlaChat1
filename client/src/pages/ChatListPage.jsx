import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Avatar from '../components/Avatar/Avatar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messagesApi } from '../utils/api';
import './ChatListPage.css';

export default function ChatListPage() {
  const { user } = useAuth();
  const { isOnline } = useSocket();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      const data = await messagesApi.getChats(user.id);
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.partner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list-page">
      <Header title="AlaChat" user={user} />
      
      <div className="chat-list__search">
        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="chat-list__search-input"
        />
      </div>

      <div className="chat-list">
        {loading ? (
          <div className="chat-list__loading">
            <div className="skeleton-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton skeleton--avatar" />
                  <div className="skeleton-content">
                    <div className="skeleton skeleton--name" />
                    <div className="skeleton skeleton--message" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="chat-list__empty">
            <span className="chat-list__empty-icon">💬</span>
            <p>
              {searchQuery 
                ? 'Không tìm thấy cuộc trò chuyện' 
                : 'Chưa có cuộc trò chuyện nào'}
            </p>
            {!searchQuery && (
              <button 
                className="chat-list__start-btn"
                onClick={() => navigate('/users')}
              >
                Bắt đầu trò chuyện
              </button>
            )}
          </div>
        ) : (
          filteredChats.map(chat => (
            <Link 
              key={chat.partner_id} 
              to={`/chat/${chat.partner_id}`}
              className="chat-item"
            >
              <Avatar 
                name={chat.partner_name} 
                src={chat.partner_avatar}
                size="medium"
                showOnline
                isOnline={isOnline(chat.partner_id)}
              />
              <div className="chat-item__content">
                <div className="chat-item__header">
                  <span className="chat-item__name">{chat.partner_name}</span>
                  <span className="chat-item__time">
                    {formatTime(chat.last_message_time)}
                  </span>
                </div>
                <div className="chat-item__preview">
                  <span className="chat-item__message">
                    {chat.last_message || 'Chưa có tin nhắn'}
                  </span>
                  {chat.unread_count > 0 && (
                    <span className="chat-item__badge">{chat.unread_count}</span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <Link to="/users" className="chat-list__fab" aria-label="Tạo cuộc trò chuyện mới">
        +
      </Link>
    </div>
  );
}
