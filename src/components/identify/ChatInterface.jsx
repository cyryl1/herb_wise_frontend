import React from 'react';
import PropTypes from 'prop-types';

const ChatInterface = ({ message, onMessageChange, onSend }) => {
  const sampleQuestions = [
    "What are the benefits of this herb?",
    "Is this safe to consume?",
    "What is the Yoruba name for this plant?"
  ];

  return (
    <aside className="w-full lg:w-[450px] lg:min-w-[450px] bg-white dark:bg-gray-900/50 rounded-start-lg border border-start-border-color/60 dark:border-gray-700/80 shadow-sm flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col items-center text-center pt-10">
          <div className="text-start-primary size-10 mb-4">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px' }}
            >
              spa
            </span>
          </div>
          <p className="text-start-text-main dark:text-gray-300 text-base font-normal leading-normal">
            Upload a photo of an herb to get started.
          </p>
        </div>
        <div className="pt-4">
          <p className="text-start-text-subtle dark:text-gray-400 text-sm font-normal leading-normal px-4 mb-3">
            Sample questions:
          </p>
          <ul className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <li 
                key={index}
                onClick={() => onMessageChange(question)}
                className="bg-start-primary-light/50 dark:bg-gray-800/60 text-start-text-subtle dark:text-gray-400 text-sm p-3 rounded-start-lg text-center cursor-pointer hover:bg-start-primary-light dark:hover:bg-gray-800 transition-colors"
              >
                {question}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-start-border-color/60 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
            data-alt="User avatar icon"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfWKtnslx4H_G7Gqnf9XR7HGEAQf-3EfzHPVtJS2k-E4Mu2A6sYNGR98gDCRMbdLfqtGzwvjwumf7CQtZbmzMnfct48AVvNxfG76uhTnJns-gHqXHwh6Rv5QbTjWQ5FhHS8ZSYVbkm0RgCTL5BBvHjrzEvnIXe6eCEqjP4PLNSu3-sQVPszfS6igyh8dYavOUTQH5AjWLmfmPNT0JbCWmYTXMgjAs8w8PTgfMCFwPsEAAUgSyJQIJz3I2c0ZWF6pNuxle0r_PZL1CS")',
            }}
          ></div>
          <label className="flex flex-col min-w-40 h-12 flex-1">
            <div className="flex w-full flex-1 items-stretch rounded-start-xl h-full">
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-start-xl text-start-text-main dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-start-primary/50 border-none bg-start-primary-light dark:bg-gray-800 focus:border-none h-full placeholder:text-start-text-subtle/80 dark:placeholder:text-gray-500 px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                placeholder="Ask a question..."
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSend();
                  }
                }}
              />
              <div className="flex border-none bg-start-primary-light dark:bg-gray-800 items-center justify-center pr-2 rounded-r-start-xl border-l-0">
                <button
                  onClick={onSend}
                  className="flex items-center justify-center p-1.5 text-start-text-subtle/80 dark:text-gray-500 hover:text-start-primary dark:hover:text-start-primary-light"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </label>
        </div>
      </div>
    </aside>
  );
};

ChatInterface.propTypes = {
  message: PropTypes.string.isRequired,
  onMessageChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default ChatInterface;
