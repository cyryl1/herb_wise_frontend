import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InfoPanel = ({ herbInfo, onClose }) => {
  const [activeTab, setActiveTab] = useState('uses');
  
  if (!herbInfo) return null;

  const tabs = [
    { id: 'uses', label: 'Uses', content: herbInfo.uses },
    { id: 'benefits', label: 'Benefits', content: herbInfo.benefits },
    { id: 'preparation', label: 'Preparation', content: herbInfo.preparation },
    { id: 'safety', label: 'Safety', content: herbInfo.safety }
  ];

  return (
    <aside className="shrink-0 h-full w-full max-w-[380px] border-l border-gray-200 dark:border-gray-700/50 bg-dash-surface-light dark:bg-dash-surface-dark overflow-y-auto relative">
      {/* Close button for desktop */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
      
      <div className="p-6">
        <div
          className="relative w-full h-56 rounded-lg bg-cover bg-center mb-6"
          data-alt={`A photograph of ${herbInfo.name}`}
          style={{
            backgroundImage: `url('${herbInfo.image}')`,
          }}
        ></div>
        
        <div className="mb-6 p-4 rounded-lg bg-dash-background-light dark:bg-dash-background-dark">
          <h2 className="text-2xl font-bold">{herbInfo.name}</h2>
          <p className="text-base text-dash-text-light-secondary dark:text-dash-text-dark-secondary italic mb-2">
            {herbInfo.scientificName}
          </p>
          <div className="flex flex-wrap gap-2">
            {herbInfo.localNames.map((name, index) => (
              <span 
                key={index}
                className="text-xs font-medium bg-dash-primary/20 text-dash-primary rounded-full px-3 py-1"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav aria-label="Tabs" className="-mb-px flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-dash-primary text-dash-primary font-bold'
                      : 'border-transparent text-dash-text-light-secondary dark:text-dash-text-dark-secondary hover:border-gray-300 dark:hover:border-gray-600 hover:text-dash-text-light-primary dark:hover:text-dash-text-dark-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="py-6 text-base leading-relaxed text-dash-text-light-secondary dark:text-dash-text-dark-secondary">
            <ul className="space-y-3 list-disc pl-5">
              {tabs.find(tab => tab.id === activeTab)?.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 mt-4 rounded-lg bg-dash-accent/20 border border-dash-accent/40">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-dash-accent mt-1">
              warning
            </span>
            <div>
              <h4 className="font-bold text-amber-900 dark:text-dash-accent">
                Important Warning
              </h4>
              <p className="text-sm text-amber-800 dark:text-dash-accent/90">
                Always consult with a qualified healthcare provider before using
                any herbal remedies, especially if you are pregnant, nursing, or
                have a pre-existing medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

InfoPanel.propTypes = {
  herbInfo: PropTypes.object,
  onClose: PropTypes.func,
};

export default InfoPanel;
