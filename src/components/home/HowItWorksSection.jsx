import React from 'react';

const HowItWorksSection = () => {
  return (
    <div className="px-4 py-16">
      <h2 className="text-landing-text-primary dark:text-landing-primary-light text-3xl font-bold leading-tight tracking-[-0.015em] pb-8 text-center">
        How It Works
      </h2>
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 pt-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-landing-primary/20 text-landing-primary dark:bg-landing-primary-light/20 dark:text-landing-primary-light">
              <span className="material-symbols-outlined">upload_file</span>
            </div>
            <div className="w-px bg-landing-border-color dark:bg-gray-700 grow"></div>
          </div>
          <div className="flex flex-1 flex-col pb-10 pt-3">
            <p className="text-landing-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">
              Step 1
            </p>
            <p className="text-landing-text-primary dark:text-white text-lg font-medium leading-normal">
              Upload Your Photo
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-px bg-landing-border-color dark:bg-gray-700 h-2"></div>
            <div className="flex items-center justify-center size-10 rounded-full bg-landing-primary/20 text-landing-primary dark:bg-landing-primary-light/20 dark:text-landing-primary-light">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <div className="w-px bg-landing-border-color dark:bg-gray-700 grow"></div>
          </div>
          <div className="flex flex-1 flex-col pb-10 pt-3">
            <p className="text-landing-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">
              Step 2
            </p>
            <p className="text-landing-text-primary dark:text-white text-lg font-medium leading-normal">
              Chat with Our AI
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-px bg-landing-border-color dark:bg-gray-700 h-2"></div>
            <div className="flex items-center justify-center size-10 rounded-full bg-landing-primary/20 text-landing-primary dark:bg-landing-primary-light/20 dark:text-landing-primary-light">
              <span className="material-symbols-outlined">psychology</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col pb-10 pt-3">
            <p className="text-landing-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">
              Step 3
            </p>
            <p className="text-landing-text-primary dark:text-white text-lg font-medium leading-normal">
              Learn &amp; Discover
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
