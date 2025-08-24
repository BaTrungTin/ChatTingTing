// Utility functions for emoji handling

export const isEmoji = (str) => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
};

export const getEmojiCategory = (emoji) => {
  const categories = {
    '😊': 'smileys',
    '😂': 'smileys',
    '❤️': 'hearts',
    '👍': 'gestures',
    '👎': 'gestures',
    '🎉': 'celebration',
    '🔥': 'objects',
    '😍': 'smileys',
    '😭': 'smileys',
    '🤔': 'smileys',
    '👏': 'gestures',
    '🙏': 'gestures',
    '😎': 'smileys',
    '🥰': 'smileys',
    '😘': 'smileys',
    '🤗': 'smileys'
  };
  
  return categories[emoji] || 'other';
};

export const formatMessageWithEmojis = (text) => {
  // Add spacing around emojis for better readability
  return text.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, ' $1 ');
};

export const getPopularEmojis = () => {
  return [
    "😊", "😂", "❤️", "👍", "👎", "🎉", "🔥", "😍", 
    "😭", "🤔", "👏", "🙏", "😎", "🥰", "😘", "🤗",
    "😅", "🤣", "😆", "😉", "😋", "😛", "😜", "🤪",
    "😝", "🤑", "🤠", "🤡", "🤥", "🤫", "🤭", "🤤"
  ];
};

