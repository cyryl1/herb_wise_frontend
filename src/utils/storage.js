const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'herb_wise_secret_key';
export const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'herb_wise_chat_session';
export const SESSIONS_STORAGE_KEY = import.meta.env.VITE_SESSIONS_STORAGE_KEY || 'herb_wise_chat_sessions';

export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const xorString = jsonString.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join('');
    return btoa(xorString);
  } catch {
    return null;
  }
};

export const decryptData = (encryptedData) => {
  try {
    const xorString = atob(encryptedData);
    const jsonString = xorString.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join('');
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

export const saveConversation = (messagesToSave, currentSessionId) => {
  const savedSession = localStorage.getItem(STORAGE_KEY);
  let timestamp = Date.now();
  let sessionIdToUse = currentSessionId;
  
  // Preserve original timestamp and sessionId if they exist
  if (savedSession) {
    const parsed = decryptData(savedSession);
    if (parsed) {
      timestamp = parsed.timestamp || timestamp;
      sessionIdToUse = parsed.sessionId || sessionIdToUse;
    }
  }

  // If sessionId is still undefined, generate a new one
  if (!sessionIdToUse) {
    sessionIdToUse = Date.now();
  }

  const conversationData = {
    timestamp,
    sessionId: sessionIdToUse,
    messages: messagesToSave,
    lastUpdated: Date.now()
  };

  const encrypted = encryptData(conversationData);
  
  if (encrypted) {
    localStorage.setItem(STORAGE_KEY, encrypted);
    console.log('💾 Conversation saved:', {
      messageCount: messagesToSave.length,
      sessionId: sessionIdToUse,
      lastUpdated: conversationData.lastUpdated
    });
  }
};

// Generate chat title from first user message
export const generateChatTitle = (messages) => {
  const firstUserMessage = messages.find(msg => msg.sender === 'user' && msg.text);
  if (firstUserMessage && firstUserMessage.text) {
    // Take first 30 characters and add ellipsis if needed
    const title = firstUserMessage.text.substring(0, 30);
    return title.length < firstUserMessage.text.length ? `${title}...` : title;
  }
  return 'New Chat';
};

// Get all chat sessions
export const getAllSessions = () => {
  try {
    const sessionsData = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsData) return [];
    const decrypted = decryptData(sessionsData);
    return decrypted || [];
  } catch {
    return [];
  }
};

// Save a session to the sessions list
export const saveSessionToList = (sessionId, messages, timestamp) => {
  const sessions = getAllSessions();
  const title = generateChatTitle(messages);
  
  const existingIndex = sessions.findIndex(s => s.sessionId === sessionId);
  const sessionData = {
    sessionId,
    title,
    timestamp,
    lastUpdated: Date.now(),
    messageCount: messages.length
  };
  
  if (existingIndex !== -1) {
    // Update existing session
    sessions[existingIndex] = sessionData;
  } else {
    // Add new session
    sessions.unshift(sessionData);
  }
  
  // Sort by lastUpdated (most recent first)
  sessions.sort((a, b) => b.lastUpdated - a.lastUpdated);
  
  const encrypted = encryptData(sessions);
  if (encrypted) {
    localStorage.setItem(SESSIONS_STORAGE_KEY, encrypted);
  }
};

// Get a specific session's data
export const getSessionData = (sessionId) => {
  const key = `${STORAGE_KEY}_${sessionId}`;
  const sessionData = localStorage.getItem(key);
  if (!sessionData) return null;
  return decryptData(sessionData);
};

// Save session data with individual session key
export const saveSessionData = (sessionId, messages, timestamp) => {
  const key = `${STORAGE_KEY}_${sessionId}`;
  const conversationData = {
    timestamp,
    sessionId,
    messages,
    lastUpdated: Date.now()
  };
  
  const encrypted = encryptData(conversationData);
  if (encrypted) {
    localStorage.setItem(key, encrypted);
    // Also update the sessions list
    saveSessionToList(sessionId, messages, timestamp);
    console.log('💾 Session saved:', {
      sessionId,
      messageCount: messages.length,
      lastUpdated: conversationData.lastUpdated
    });
  }
};

// Delete a session
export const deleteSession = (sessionId) => {
  const key = `${STORAGE_KEY}_${sessionId}`;
  localStorage.removeItem(key);
  
  // Remove from sessions list
  const sessions = getAllSessions();
  const filtered = sessions.filter(s => s.sessionId !== sessionId);
  const encrypted = encryptData(filtered);
  if (encrypted) {
    localStorage.setItem(SESSIONS_STORAGE_KEY, encrypted);
  }
};

// Group sessions by date
export const groupSessionsByDate = (sessions) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const groups = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: []
  };
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.lastUpdated);
    
    if (sessionDate >= today) {
      groups.today.push(session);
    } else if (sessionDate >= yesterday) {
      groups.yesterday.push(session);
    } else if (sessionDate >= lastWeek) {
      groups.lastWeek.push(session);
    } else {
      groups.older.push(session);
    }
  });
  
  return groups;
};
