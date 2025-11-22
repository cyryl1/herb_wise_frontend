import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import ImageUploader from '../components/identify/ImageUploader';
import ChatInterface from '../components/identify/ChatInterface';
import { sendChatMessage, transformBackendResponse } from '../services/api';

const Identify = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!message && !selectedImage) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('📨 Sending message from Identify page...');
      
      // Send first message to backend (no conversation_id)
      const response = await sendChatMessage({
        textInput: message || undefined,
        imageBase64: selectedImage || undefined,
      });

      console.log('✅ Received response:', response);

      // Transform backend response to frontend format
      const aiMessage = transformBackendResponse(response);
      
      // Create user message
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        image: selectedImage,
        timestamp: new Date().toISOString(),
      };

      // Navigate to dashboard with initial data
      navigate('/dashboard', { 
        state: { 
          conversationId: response.conversation_id,
          initialMessages: [userMessage, aiMessage],
          herbInfo: aiMessage.herbInfo || null,
        },
        replace: true
      });
    } catch (error) {
      console.error('❌ Error in handleSend:', error);
      setError(error.message || 'Failed to send message. Please check if the backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-start-background-light dark:bg-start-background-dark font-display text-start-text-main dark:text-gray-200 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[1280px] flex-1">
              <AppNavbar />
              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    <span className="font-bold">Error:</span> {error}
                  </p>
                  <p className="text-red-600 dark:text-red-300 text-xs mt-1">
                    Make sure the backend is running at http://127.0.0.1:8000
                  </p>
                </div>
              )}
              <main className="mt-8 flex flex-1 flex-col lg:flex-row gap-8 px-4 sm:px-6">
                <ImageUploader 
                  selectedImage={selectedImage} 
                  onImageSelect={setSelectedImage} 
                />
                <ChatInterface 
                  message={message} 
                  onMessageChange={setMessage} 
                  onSend={handleSend}
                  isLoading={isLoading}
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identify;
