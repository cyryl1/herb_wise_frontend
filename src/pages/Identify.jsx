import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import ImageUploader from '../components/identify/ImageUploader';
import ChatInterface from '../components/identify/ChatInterface';

const Identify = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message && !selectedImage) return;
    
    navigate('/dashboard', { 
      state: { 
        initialMessage: message,
        initialImage: selectedImage,
        sessionId: Date.now()
      } 
    });
  };

  return (
    <div className="bg-start-background-light dark:bg-start-background-dark font-display text-start-text-main dark:text-gray-200 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[1280px] flex-1">
              <AppNavbar />
              <main className="mt-8 flex flex-1 flex-col lg:flex-row gap-8 px-4 sm:px-6">
                <ImageUploader 
                  selectedImage={selectedImage} 
                  onImageSelect={setSelectedImage} 
                />
                <ChatInterface 
                  message={message} 
                  onMessageChange={setMessage} 
                  onSend={handleSend}
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
