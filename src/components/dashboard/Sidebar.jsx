import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllSessions, groupSessionsByDate, deleteSession } from '../../utils/storage';

const Sidebar = ({ currentConversationId, onNewChat, onSelectSession, onDeleteSession }) => {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState([]);

  // Load sessions from localStorage
  useEffect(() => {
    const loadSessions = () => {
      const allSessions = getAllSessions();
      setSessions(allSessions);
      setFilteredSessions(allSessions);
    };
    
    loadSessions();
    
    // Refresh sessions when storage changes
    const handleStorageChange = () => {
      loadSessions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('sessionsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionsUpdated', handleStorageChange);
    };
  }, []);

  // Filter sessions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSessions(sessions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sessions.filter(session =>
        session.title.toLowerCase().includes(query)
      );
      setFilteredSessions(filtered);
    }
  }, [searchQuery, sessions]);

  const groupedSessions = groupSessionsByDate(filteredSessions);

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation(); // Prevent triggering session selection
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId);
      
      // Refresh sessions list
      const allSessions = getAllSessions();
      setSessions(allSessions);
      setFilteredSessions(allSessions);
      
      // Notify parent if deleting current session
      if (sessionId === currentConversationId && onDeleteSession) {
        onDeleteSession(sessionId);
      }
      
      // Trigger update event
      window.dispatchEvent(new Event('sessionsUpdated'));
    }
  };

  const renderSessionGroup = (title, sessionsList) => {
    if (sessionsList.length === 0) return null;
    
    return (
      <div key={title}>
        <p className="text-xs font-semibold uppercase text-dash-text-light-secondary dark:text-dash-text-dark-secondary px-4 pt-4 pb-2">
          {title}
        </p>
        {sessionsList.map(session => (
          <div
            key={session.sessionId}
            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-full ${
              session.sessionId === currentConversationId
                ? 'bg-dash-primary/10 dark:bg-dash-primary/20'
                : 'hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <button
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
              onClick={() => onSelectSession(session.sessionId)}
            >
              <span className={`material-symbols-outlined shrink-0 ${
                session.sessionId === currentConversationId ? 'text-dash-primary' : ''
              }`}>
                chat_bubble
              </span>
              <p className={`text-sm font-medium leading-normal truncate ${
                session.sessionId === currentConversationId ? 'text-dash-primary' : ''
              }`}>
                {session.title}
              </p>
            </button>
            
            {/* Delete button - shows on hover */}
            <button
              onClick={(e) => handleDeleteSession(session.sessionId, e)}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
              title="Delete chat"
            >
              <span className="material-symbols-outlined text-sm text-red-600 dark:text-red-400">
                delete
              </span>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <aside className="flex h-full w-full max-w-[320px] shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/50 bg-dash-surface-light dark:bg-dash-surface-dark p-4">
      <div className="flex items-center gap-3 p-2 mb-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="HerbWise logo, an abstract green leaf"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSvbzB5YYNH9FI8cyJZAsBGfZ_l6gJXOI2-sDakKF7wlwwkFhQNcwnQLOIvYyO5EY_K4ZKt5aKksx9gWSBol4MyqCBLIgS9_ZKHPulnDlTmCs1VeNa76PukrT7xE-776-mVGU_quDPRSoXV8QEdDEz9TuMqkYBD5La1uncRnYWmIp9WM_LpO0jKdvQvYdZXvlUpA0iAr0xtpKdITkJIM1Wlz8Ue9m3OpQMuAdtL04trhOF4Dh3uJ7ltS9BWdLwohlutgE1a_cITQ_r")',
          }}
        ></div>
        <h1 className="text-xl font-bold">HerbWise</h1>
      </div>
      <button 
        className="flex min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-4 bg-dash-primary text-white text-base font-bold leading-normal tracking-[0.015em] mb-4"
        onClick={onNewChat}
      >
        <span className="material-symbols-outlined">add</span>
        <span className="truncate">New Chat</span>
      </button>
      <div className="px-2 py-1 mb-2">
        <label className="flex flex-col min-w-40 h-11 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full">
            <div className="text-dash-text-light-secondary dark:text-dash-text-dark-secondary flex border-none bg-dash-background-light dark:bg-dash-background-dark items-center justify-center pl-4 rounded-l-full border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-dash-text-light-primary dark:text-dash-text-dark-primary focus:outline-0 focus:ring-0 border-none bg-dash-background-light dark:bg-dash-background-dark focus:border-none h-full placeholder:text-dash-text-light-secondary dark:placeholder:text-dash-text-dark-secondary px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>
      <nav className="grow overflow-y-auto pr-2">
        <div className="flex flex-col gap-1">
          {filteredSessions.length === 0 ? (
            <p className="text-sm text-center text-dash-text-light-secondary dark:text-dash-text-dark-secondary py-8">
              {searchQuery ? 'No chats found' : 'No chat history yet'}
            </p>
          ) : (
            <>
              {renderSessionGroup('Today', groupedSessions.today)}
              {renderSessionGroup('Yesterday', groupedSessions.yesterday)}
              {renderSessionGroup('Last 7 Days', groupedSessions.lastWeek)}
              {renderSessionGroup('Older', groupedSessions.older)}
            </>
          )}
        </div>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
        <a
          className="flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
          href="#"
        >
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
            data-alt="User profile picture"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQ73C__KkwME6Pr8Jw0qjDDiBrfWO3o--SIuhdu90orOQrk2p51xoN9BQs5b4CaVO8r1ds5VUzhRpe0NlWztbRyAMouH_0bu8ENAjcZtmydFmxEkNNRUGRl31Ji6XIZbM-Py2uLL6idAQle9pnCTjx4Kz5KDWT5dzn0Y0NlHbcneqTKhweNUSGaEMAO_AeLgtgEWIPBKFgIycp7phIHgK7tAekIYKTif5kNDXaVzEvKW8Sjm7mpEFFfte-nGSvOVp3DU27sZBFKXCJ")',
            }}
          ></div>
          <p className="text-sm font-medium leading-normal">User Profile</p>
          <span className="material-symbols-outlined ml-auto text-dash-text-light-secondary dark:text-dash-text-dark-secondary">
            settings
          </span>
        </a>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  currentConversationId: PropTypes.string,
  onNewChat: PropTypes.func.isRequired,
  onSelectSession: PropTypes.func.isRequired,
  onDeleteSession: PropTypes.func,
};

export default Sidebar;

