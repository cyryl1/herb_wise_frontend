import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const ImageUploader = ({ selectedImage, onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col p-4">
          <div 
            className="group relative flex flex-col items-center gap-6 rounded-start-lg border-2 border-dashed border-start-border-color dark:border-gray-600 hover:border-start-primary dark:hover:border-start-primary-light transition-colors px-6 py-14 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/jpeg, image/png, image/webp"
            />
            
            {selectedImage ? (
              <div className="flex flex-col items-center gap-4">
                <img 
                  src={selectedImage} 
                  alt="Selected herb" 
                  className="max-h-64 rounded-lg object-contain shadow-md"
                />
                <p className="text-start-text-main dark:text-gray-100 font-medium">
                  Image selected! Click &quot;Send&quot; to identify.
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageSelect(null);
                  }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <>
                <div className="absolute -top-3 -right-3 hidden group-hover:block bg-start-background-light dark:bg-gray-800 px-3 py-1.5 rounded-full border border-start-border-color dark:border-gray-600 shadow-sm text-xs text-start-text-subtle dark:text-gray-400">
                  Tip: For best results, use a clear, well-lit photo of the herb&apos;s
                  leaves.
                </div>
                <div className="text-start-primary size-16">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '64px' }}
                  >
                    image_search
                  </span>
                </div>
                <div className="flex max-w-[480px] flex-col items-center gap-2">
                  <p className="text-start-text-main dark:text-gray-100 text-xl font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                    Identify Your Herb
                  </p>
                  <p className="text-start-text-subtle dark:text-gray-400 text-sm font-normal leading-normal max-w-[480px] text-center">
                    Drag &amp; drop an image here, or click to browse files.
                  </p>
                  <p className="text-start-text-subtle/70 dark:text-gray-500 text-xs font-normal leading-normal mt-1">
                    Supported formats: JPG, PNG, WEBP. Max size: 10MB.
                  </p>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-start-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-start-primary/90 transition-colors">
                  <span className="truncate">Upload Image</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  selectedImage: PropTypes.string,
  onImageSelect: PropTypes.func.isRequired,
};

export default ImageUploader;
