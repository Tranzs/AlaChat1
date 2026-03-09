import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Avatar from '../components/Avatar/Avatar';
import EmojiPicker from '../components/EmojiPicker/EmojiPicker';
import ReactionPicker from '../components/ReactionPicker/ReactionPicker';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messagesApi, usersApi, reactionsApi } from '../utils/api';
import { convertToEmoji } from '../utils/emojiMap';
import './ChatPage.css';

export default function ChatPage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { connected, sendMessage, sendTyping, stopTyping, sendReaction, on, off, isOnline } = useSocket();
  const navigate = useNavigate();
  
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [activeReactionPicker, setActiveReactionPicker] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load partner info
  useEffect(() => {
    const loadPartner = async () => {
      try {
        const data = await usersApi.getById(userId);
        setPartner(data);
      } catch (error) {
        console.error('Error loading partner:', error);
        navigate('/chats');
      }
    };
    loadPartner();
  }, [userId, navigate]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUser) return;
      
      try {
        const data = await messagesApi.getConversation(userId, currentUser.id);
        setMessages(data);
        
        // Load reactions for all messages
        const reactionsMap = {};
        await Promise.all(
          data.map(async (message) => {
            if (message.id) {
              try {
                const reactions = await reactionsApi.getByMessageId(message.id);
                reactionsMap[message.id] = reactions;
              } catch (e) {
                reactionsMap[message.id] = [];
              }
            }
          })
        );
        setMessageReactions(reactionsMap);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [userId, currentUser]);

  // Socket event listeners
  useEffect(() => {
    if (!connected) return;

    // Only handle NEW messages from OTHER users (not from self)
    const handleNewMessage = (message) => {
      const partnerId = parseInt(userId);
      // Only add if it's from the partner (not from self)
      if (message.from_user_id === partnerId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    // Handle when YOUR message is confirmed by server (replaces temp message)
    const handleMessageSent = (message) => {
      setMessages(prev => {
        // First, remove any temp message (by checking content and timestamp proximity)
        const cleaned = prev.filter(m => {
          // Keep if it has a real ID or is not the message we just sent
          if (m.id === message.id) return false; // Already has real ID
          if (typeof m.id === 'number' && m.id > Date.now() - 5000) {
            // This is a temp message, check if content matches
            return m.content !== message.content;
          }
          return true;
        });
        
        // Then add the real message if not already there
        if (cleaned.some(m => m.id === message.id)) return cleaned;
        return [...cleaned, message];
      });
      setSending(false);
    };

    const handleTyping = ({ fromUserId }) => {
      if (parseInt(fromUserId) === parseInt(userId)) {
        setTypingUser(partner?.name);
        // Auto-clear typing after 3 seconds
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
      }
    };

    const handleStopTyping = ({ fromUserId }) => {
      if (parseInt(fromUserId) === parseInt(userId)) {
        setTypingUser(null);
      }
    };

    // Handle reaction updates - update locally without API call
    const handleReactionUpdate = ({ messageId, action, emoji, userId: reactionUserId }) => {
      // Update local state based on action
      setMessageReactions(prev => {
        const currentReactions = prev[messageId] || [];
        
        if (action === 'removed') {
          // Remove the reaction from the list
          const filtered = currentReactions.map(group => {
            if (group.emoji === emoji) {
              const users = group.users.filter(u => u.id !== reactionUserId);
              if (users.length === 0) return null;
              return { ...group, users, count: users.length };
            }
            return group;
          }).filter(Boolean);
          return { ...prev, [messageId]: filtered };
        } else if (action === 'added') {
          // Add the new reaction
          const existingGroup = currentReactions.find(g => g.emoji === emoji);
          if (existingGroup) {
            // Update existing group
            return {
              ...prev,
              [messageId]: currentReactions.map(g => 
                g.emoji === emoji 
                  ? { ...g, count: g.count + 1, users: [...g.users, { id: reactionUserId, name: 'User' }] }
                  : g
              )
            };
          } else {
            // Add new group
            return {
              ...prev,
              [messageId]: [...currentReactions, { emoji, count: 1, users: [{ id: reactionUserId, name: 'User' }] }]
            };
          }
        }
        
        return prev;
      });
    };

    on('new_message', handleNewMessage);
    on('message_sent', handleMessageSent);
    on('user_typing', handleTyping);
    on('user_stop_typing', handleStopTyping);
    on('reaction_update', handleReactionUpdate);

    return () => {
      off('new_message', handleNewMessage);
      off('message_sent', handleMessageSent);
      off('user_typing', handleTyping);
      off('user_stop_typing', handleStopTyping);
      off('reaction_update', handleReactionUpdate);
    };
  }, [connected, userId, currentUser, partner, on, off]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    // Send typing indicator
    sendTyping(parseInt(userId));
    
    // Clear typing after 1 second of no input
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(parseInt(userId));
    }, 1000);
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || sending) return;

    // Auto-convert emoji before sending
    const convertedContent = convertToEmoji(content);
    
    setSending(true);
    setInputValue('');
    stopTyping(parseInt(userId));
    
    // Optimistic UI - add message locally with a marker to identify it
    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      id: tempId,
      from_user_id: currentUser.id,
      to_user_id: parseInt(userId),
      content: convertedContent,
      timestamp: new Date().toISOString(),
      isTemp: true  // Mark as temp message
    };
    setMessages(prev => [...prev, tempMessage]);
    
    // Send via socket
    sendMessage(parseInt(userId), convertedContent);
    
    // Note: message_sent will replace temp message with real one
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleReactionSelect = async (messageId, emoji) => {
    // Send reaction via socket for real-time update (server handles persistence)
    sendReaction(messageId, emoji, parseInt(userId));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (!partner) {
    return (
      <div className="chat-page">
        <Header title="Đang tải..." showBack />
      </div>
    );
  }

  return (
    <div className="chat-page">
      <Header 
        title={partner.name} 
        showBack 
        user={currentUser}
        rightComponent={
          <Avatar 
            name={partner.name} 
            src={partner.avatar}
            size="small"
            showOnline
            isOnline={isOnline(partner.id)}
          />
        }
      />
      
      <div className="chat-messages">
        {loading ? (
          <div className="chat-messages__loading">
            <div className="skeleton-messages">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`skeleton-message ${i % 2 === 0 ? 'sent' : 'received'}`}>
                  <div className="skeleton skeleton--message-bubble" />
                </div>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-messages__empty">
            <span>👋</span>
            <p>Hãy gửi tin nhắn đầu tiên cho {partner.name}</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isSent = message.from_user_id === currentUser?.id;
            const showTime = index === 0 || 
              new Date(message.timestamp) - new Date(messages[index - 1].timestamp) > 60000;
            const messageReactionsList = messageReactions[message.id] || [];
            
            return (
              <div 
                key={message.id || index} 
                className="message-wrapper"
              >
                {showTime && (
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                )}
                <div className={`message message--${isSent ? 'sent' : 'received'}`}>
                  <span className="message__content">{message.content}</span>
                  
                  {/* Reactions display */}
                  {messageReactionsList.length > 0 && (
                    <div className="message__reactions">
                      {messageReactionsList.map((reaction) => (
                        <span 
                          key={reaction.emoji} 
                          className="message__reaction"
                          title={reaction.users.map(u => u.name).join(', ')}
                          onClick={() => handleReactionSelect(message.id, reaction.emoji)}
                        >
                          {reaction.emoji}
                          {reaction.count > 1 && <span className="reaction-count">{reaction.count}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Reaction button */}
                <button 
                  className="message__reaction-btn"
                  onClick={() => setActiveReactionPicker(
                    activeReactionPicker === message.id ? null : message.id
                  )}
                  aria-label="Thả reaction"
                >
                  😊
                </button>
                
                {/* Reaction picker for this message */}
                {activeReactionPicker === message.id && (
                  <ReactionPicker
                    messageId={message.id}
                    onSelect={handleReactionSelect}
                    onClose={() => setActiveReactionPicker(null)}
                    currentReactions={messageReactionsList}
                  />
                )}
              </div>
            );
          })
        )}
        
        {typingUser && (
          <div className="typing-indicator">
            <span>{typingUser} đang soạn tin nhắn...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <button 
          className="chat-input__emoji-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Chọn emoji"
        >
          😊
        </button>
        
        {showEmojiPicker && (
          <EmojiPicker 
            onSelect={handleEmojiSelect} 
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
        
        <input
          ref={inputRef}
          type="text"
          className="chat-input__field"
          placeholder="Nhập tin nhắn..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={sending}
        />
        
        <button 
          className="chat-input__send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || sending}
          aria-label="Gửi tin nhắn"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
