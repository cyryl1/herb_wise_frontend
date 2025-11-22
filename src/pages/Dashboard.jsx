import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import ChatArea from '../components/dashboard/ChatArea';
import InfoPanel from '../components/dashboard/InfoPanel';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId, initialMessages, herbInfo: initialHerbInfo } = location.state || {};
  
  const [currentConversationId, setCurrentConversationId] = useState(conversationId || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [herbInfo, setHerbInfo] = useState(initialHerbInfo || null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(!!initialHerbInfo);

  useEffect(() => {
    // If we have conversation ID from Identify page, set it as current
    if (conversationId) {
      setCurrentConversationId(conversationId);
    }
  }, [conversationId]);

  const handleNewChat = () => {
    // Navigate to identify page to start a new chat
    setIsSidebarOpen(false);
    navigate('/identify');
  };

  const handleSelectSession = (conversationId) => {
    setCurrentConversationId(conversationId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    // Clear the location state when switching sessions
    navigate('/dashboard', { replace: true, state: { conversationId } });
  };

  const handleDeleteSession = (conversationId) => {
    // If deleting current session, redirect to identify page
    if (conversationId === currentConversationId) {
      navigate('/identify');
    }
  };

  const handleHerbIdentified = (info) => {
    setHerbInfo(info);
    setIsInfoPanelOpen(true);
  };

  return (
    <div className="font-display bg-dash-background-light dark:bg-dash-background-dark text-dash-text-light-primary dark:text-dash-text-dark-primary h-screen w-full overflow-hidden page-transition">
      <div className="flex h-full w-full relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center size-10 rounded-full bg-dash-primary text-white shadow-lg"
        >
          <span className="material-symbols-outlined">
            {isSidebarOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Sidebar Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            currentConversationId={currentConversationId}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {/* Chat Area */}
        <ChatArea 
          conversationId={currentConversationId}
          initialMessages={initialMessages}
          onHerbIdentified={handleHerbIdentified}
          onOpenInfoPanel={() => setIsInfoPanelOpen(true)}
          key={currentConversationId}
        />

        {/* Info Panel - Only show when herbInfo exists */}
        {herbInfo && isInfoPanelOpen && (
          <>
            {/* Mobile: Bottom sheet that overlays chat */}
            <div className="lg:hidden fixed inset-0 z-40">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/50 transition-opacity duration-300"
                onClick={() => setIsInfoPanelOpen(false)}
              />
              
              {/* Panel */}
              <div className="absolute inset-x-0 bottom-0">
                <div className="relative bg-dash-surface-light dark:bg-dash-surface-dark rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setIsInfoPanelOpen(false)}
                    className="absolute top-4 right-4 z-10 flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  <InfoPanel herbInfo={herbInfo} />
                </div>
              </div>
            </div>

            {/* Desktop: Side panel */}
            <div className="hidden lg:block">
              <InfoPanel herbInfo={herbInfo} onClose={() => setIsInfoPanelOpen(false)} />
            </div>
          </>
        )}

        {/* Remove the floating button - using header button instead */}
      </div>
    </div>
  );
};

export default Dashboard;

