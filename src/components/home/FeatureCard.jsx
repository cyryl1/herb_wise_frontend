import React from 'react';
import PropTypes from 'prop-types';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-1 gap-4 rounded-lg border border-landing-border-color dark:border-gray-700 bg-landing-background-light/50 dark:bg-landing-background-dark/50 p-6 flex-col">
      <div className="text-landing-primary dark:text-landing-primary-light">
        <span className="material-symbols-outlined !text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-landing-text-primary dark:text-white text-lg font-bold leading-tight">
          {title}
        </h3>
        <p className="text-landing-text-secondary dark:text-gray-400 text-sm font-normal leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureCard;
