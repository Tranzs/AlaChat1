// Emoji mapping dictionary
export const emojiMap = {
  // Faces
  ':)': '😊',
  ':(': '☹️',
  ':D': '😄',
  ':P': '😛',
  ':p': '😛',
  '>.<': '😝',
  '>(': '😠',
  '>:(': '😠',
  'o.O': '😮',
  'O.o': '😮',
  '-_-': '😑',
  '^_^': '😊',
  '^.<': '😊',
  
  // Crying
  'T.T': '😭',
  'T_T': '😭',
  ":'(": '😢',
  ':,(': '😢',
  
  // Hearts
  '<3': '❤️',
  ':*': '😘',
  'x3': '😻',
  'X3': '😻',
  '❤': '❤️',
  
  // Wink
  ';)': '😉',
  ';P': '😜',
  ';p': '😜',
  ':,D': '😆',
  
  // Misc
  'xD': '😆',
  'XD': '😆',
  ':O': '😮',
  ':o': '😮',
  ':0': '😮'
};

// Auto-convert text to emoji
export function convertToEmoji(text) {
  if (!text) return '';
  
  let result = text;
  
  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(emojiMap).sort((a, b) => b.length - a.length);
  
  for (const pattern of sortedKeys) {
    // Escape special regex characters
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedPattern, 'g');
    result = result.replace(regex, emojiMap[pattern]);
  }
  
  return result;
}

// Get emoji list by category
export const emojiCategories = {
  faces: ['😊', '☹️', '😄', '😛', '😝', '😠', '😮', '😑', '😢', '😂', '😮', '😬', '😓', '😔'],
  hearts: ['❤️', '💔', '😘', '😍', '😻', '💕', '💖', '💗', '❤️‍🔥', '🤍', '🖤', '💜', '💙', '💚', '💛'],
  gestures: ['👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '💪', '🤝', '🙏', '✋', '👋', '🖐️', '✍️'],
  objects: ['📱', '💻', '🖱️', '⌨️', '📷', '🎥', '📺', '🔔', '⏰', '💡', '🔋', '📧', '💬', '🗨️'],
  symbols: ['✅', '❌', '⭐', '💯', '🔥', '✨', '💫', '🎉', '🎊', '🏆', '🎯', '💡', '❓', '❗']
};

export function getAllEmojis() {
  return Object.values(emojiCategories).flat();
}
