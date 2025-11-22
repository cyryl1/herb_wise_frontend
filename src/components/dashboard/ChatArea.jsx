import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  getSessionData,
  saveSessionData
} from '../../utils/storage';
import { sendChatMessage, transformBackendResponse } from '../../services/api';

const ChatArea = ({ conversationId, initialMessages, onHerbIdentified, onOpenInfoPanel }) => {
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState(initialMessages || [
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I can help you identify medicinal herbs. How can I assist you today? You can upload an image or ask me a question.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId || null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load conversation data when conversationId changes
  useEffect(() => {
    if (!currentConversationId) return;

    const sessionData = getSessionData(currentConversationId);
    if (sessionData && sessionData.messages) {
      console.log('📂 Loading conversation:', currentConversationId, 'with', sessionData.messages.length, 'messages');
      setMessages(sessionData.messages);
    }
  }, [currentConversationId]);

  // Save initial messages if provided from Identify page
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0 && conversationId) {
      setCurrentConversationId(conversationId);
      setMessages(initialMessages);
      saveSessionData(conversationId, initialMessages, Date.now());
      window.dispatchEvent(new Event('sessionsUpdated'));
    }
  }, [initialMessages, conversationId]);

  // Session validation for direct dashboard access
  useEffect(() => {
    // Skip validation if we have initial messages (new session from Identify)
    if (initialMessages) {
      return;
    }

    // If no conversationId provided, redirect to identify
    if (!conversationId) {
      console.log('No conversation ID - redirecting to identify');
      navigate('/identify');
      return;
    }

    // Check if conversation exists
    const sessionData = getSessionData(conversationId);
    
    if (!sessionData) {
      console.log('Conversation not found - redirecting to identify');
      navigate('/identify');
    } else {
      setCurrentConversationId(conversationId);
    }
  }, [initialMessages, conversationId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;
    if (isAIResponding) return; // Prevent sending while AI is responding

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      image: selectedFile, // base64 string
      timestamp: new Date().toISOString(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    
    const textToSend = inputValue;
    const imageToSend = selectedFile;
    setInputValue('');
    setSelectedFile(null);
    setIsAIResponding(true);

    try {
      // Send message to backend
      const response = await sendChatMessage({
        textInput: textToSend || undefined,
        conversationId: currentConversationId || undefined,
        imageBase64: imageToSend || undefined,
      });

      // Update conversation ID if this was the first message
      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id);
      }

      // Transform and add AI response
      const aiMessage = transformBackendResponse(response);
      
      setMessages(prev => {
        const updatedMessages = [...prev, aiMessage];
        // Save to localStorage
        const convId = response.conversation_id || currentConversationId;
        saveSessionData(convId, updatedMessages, Date.now());
        window.dispatchEvent(new Event('sessionsUpdated'));
        return updatedMessages;
      });

      // Check if response contains herbInfo and notify parent to open InfoPanel
      if (aiMessage.herbInfo && onHerbIdentified) {
        onHerbIdentified(aiMessage.herbInfo);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Show error message to user
      // Remove user message or add error indicator
    } finally {
      setIsAIResponding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isAIResponding) {
      handleSendMessage();
    }
  };

  return (
    <main className="flex flex-1 flex-col h-full bg-dash-background-light dark:bg-dash-background-dark">
      <header className="shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50 bg-dash-surface-light dark:bg-dash-surface-dark h-[81px]">
        <div className="flex min-w-72 flex-col">
          <p className="tracking-light text-xl font-bold leading-tight">
            Herb Identification
          </p>
          <p className="text-dash-primary text-sm font-normal leading-normal">
            Active now
          </p>
        </div>
      </header>
      <div className="grow overflow-y-auto p-6 space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                data-alt="HerbWise AI avatar"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnWaqKnfuwXfQdxBYi8km4NBAuEKtCat10ABOgySVySLxggZgHEvEzk-8aplkKkH-AWtBaGyP_v-j-7O7hXs1pYmsG3l3LxaJAFvpZtqx-rlHsxDwgOXJpeBfC340AAqMHr7NCZ0w8ZrbGWRnPyJvWYJz70VIpefCjyfRbzHpy82hyQxxIkoEX3YRYdnLhdkolc162dfJmilftfqvjfDO2PpFI1GfYWu02M-M768Jthdzq5ctklDSN2q7JD3WWX6Shc8LW8j3CyHZv")',
                }}
              ></div>
            )}
            
            <div className={`flex flex-1 flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.sender === 'ai' && (
                <p className="text-dash-text-light-secondary dark:text-dash-text-dark-secondary text-sm font-normal leading-normal max-w-[480px]">
                  HerbWise AI
                </p>
              )}
              
              {msg.image && (
                <div
                  className="w-48 h-48 rounded-lg bg-cover bg-center border border-gray-200 dark:border-gray-700"
                  style={{ backgroundImage: `url('${msg.image}')` }}
                ></div>
              )}
              
              {msg.text && (
                <p className={`text-base font-normal leading-normal flex max-w-xl rounded-lg px-4 py-3 ${
                  msg.sender === 'user' 
                    ? 'rounded-br-none bg-dash-primary/20 dark:bg-dash-primary/30' 
                    : 'rounded-bl-none bg-dash-surface-light dark:bg-dash-surface-dark'
                }`}>
                  {msg.text}
                </p>
              )}
              
              {/* Herb Info Card - Inline in chat */}
              {msg.herbInfo && (
                <div 
                  onClick={() => onOpenInfoPanel && onOpenInfoPanel()}
                  className="max-w-xl cursor-pointer group"
                >
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-dash-surface-light dark:bg-dash-surface-dark hover:border-dash-primary transition-colors">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url('${msg.herbInfo.image}')` }}
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{msg.herbInfo.name}</h3>
                          <p className="text-sm text-dash-text-light-secondary dark:text-dash-text-dark-secondary italic">
                            {msg.herbInfo.scientificName}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-dash-primary group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {msg.herbInfo.localNames.slice(0, 2).map((name, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-dash-primary/10 text-dash-primary rounded-full px-2 py-1"
                          >
                            {name.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-dash-text-light-secondary dark:text-dash-text-dark-secondary">
                        Click to view full details about uses, benefits, and preparation
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="shrink-0 p-4 pt-2">
        {selectedFile && (
          <div className="mb-2 p-2 bg-dash-surface-light dark:bg-dash-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 inline-flex items-center gap-2 relative">
            <img src={selectedFile} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
            <button 
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}
        <div className="flex w-full items-center p-2 rounded-lg bg-dash-surface-light dark:bg-dash-surface-dark border border-gray-200 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-dash-primary">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*"
          />
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-dash-text-light-primary dark:text-dash-text-dark-primary focus:outline-0 focus:ring-0 border-none placeholder:text-dash-text-light-secondary dark:placeholder:text-dash-text-dark-secondary text-base"
            placeholder="Ask about an herb or upload an image..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAIResponding}
          />
          <button 
            onClick={triggerFileInput}
            className="flex shrink-0 items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAIResponding}
          >
            <span className="material-symbols-outlined text-dash-text-light-secondary dark:text-dash-text-dark-secondary">
              attach_file
            </span>
          </button>
          <button 
            onClick={handleSendMessage}
            className="flex shrink-0 items-center justify-center size-10 rounded-full bg-dash-primary text-white ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAIResponding}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </main>
  );
};

ChatArea.propTypes = {
  conversationId: PropTypes.string,
  initialMessages: PropTypes.array,
  onHerbIdentified: PropTypes.func,
  onOpenInfoPanel: PropTypes.func,
};

export default ChatArea;
