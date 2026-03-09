import { useState, useEffect, useRef } from 'react';
import './ReactionPicker.css';

const REACTIONS = ['❤️', '😂', '😮', '😢', '👍'];

export default function ReactionPicker({ messageId, onSelect, onClose, currentReactions = [] }) {
  const pickerRef = useRef(null);
  const [selectedReaction, setSelectedReaction] = useState(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Handle reaction selection
  const handleReactionClick = (emoji) => {
    setSelectedReaction(emoji);
    onSelect(messageId, emoji);
    onClose();
  };

  // Check if user already reacted with this emoji
  const hasReaction = (emoji) => {
    return currentReactions.some(r => r.emoji === emoji);
  };

  return (
    <div className="reaction-picker" ref={pickerRef}>
      <div className="reaction-picker__list">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            className={`reaction-picker__btn ${hasReaction(emoji) ? 'reaction-picker__btn--active' : ''}`}
            onClick={() => handleReactionClick(emoji)}
            title={hasReaction(emoji) ? 'Bỏ reaction' : `Thả ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
