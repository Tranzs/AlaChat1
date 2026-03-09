import { useState, useRef, useEffect } from 'react';
import { emojiCategories, getAllEmojis } from '../../utils/emojiMap';
import './EmojiPicker.css';

const MAX_RECENT_EMOJIS = 20;
const STORAGE_KEY = 'alachat_recent_emojis';

const categoryIcons = {
  recent: '🕐',
  faces: '😀',
  hearts: '❤️',
  gestures: '👍',
  objects: '📱',
  symbols: '✅'
};

// Get recent emojis from localStorage
const getRecentEmojis = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save emoji to recent list
const saveRecentEmoji = (emoji) => {
  try {
    let recent = getRecentEmojis();
    // Remove if already exists
    recent = recent.filter(e => e !== emoji);
    // Add to front
    recent.unshift(emoji);
    // Keep only max items
    recent = recent.slice(0, MAX_RECENT_EMOJIS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    // Ignore storage errors
  }
};

export default function EmojiPicker({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [recentEmojis, setRecentEmojis] = useState(getRecentEmojis);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleEmojiSelect = (emoji) => {
    // Save to recent
    saveRecentEmoji(emoji);
    setRecentEmojis(getRecentEmojis());
    // Callback
    onSelect(emoji);
  };

  const getEmojisForCategory = (category) => {
    if (category === 'recent') {
      return recentEmojis;
    }
    return emojiCategories[category] || [];
  };

  const emojis = getEmojisForCategory(activeCategory);
  const categories = ['recent', ...Object.keys(emojiCategories)];

  return (
    <div className="emoji-picker" ref={pickerRef}>
      <div className="emoji-picker__categories">
        {categories.map(category => (
          <button
            key={category}
            className={`emoji-picker__category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
            aria-label={category}
            title={category === 'recent' ? 'Gần đây' : category}
          >
            {categoryIcons[category]}
          </button>
        ))}
      </div>
      
      <div className="emoji-picker__header">
        {activeCategory === 'recent' ? 'Gần đây' : 
         activeCategory === 'faces' ? 'Mặt cười' :
         activeCategory === 'hearts' ? 'Trái tim' :
         activeCategory === 'gestures' ? 'Cử chỉ' :
         activeCategory === 'objects' ? 'Vật dụng' : 'Biểu tượng'}
      </div>
      
      <div className="emoji-picker__grid">
        {emojis.length === 0 && activeCategory === 'recent' ? (
          <div className="emoji-picker__empty">
            Chưa có emoji nào được sử dụng gần đây
          </div>
        ) : (
          emojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              className="emoji-picker__emoji"
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
