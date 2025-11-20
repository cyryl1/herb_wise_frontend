import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: 'auto_awesome',
    title: 'AI-Powered Identification',
    description:
      'Upload a photo and our smart AI will identify the herb in seconds.',
  },
  {
    icon: 'menu_book',
    title: 'Rich Herbal Database',
    description:
      'Access a rich database of Nigerian herbs, their local names, and uses.',
  },
  {
    icon: 'health_and_safety',
    title: 'Safe Usage Guidance',
    description:
      'Learn about proper preparation and safe usage guidelines for each herb.',
  },
];

const FeatureSection = () => {
  return (
    <div className="flex flex-col gap-10 px-4 py-16 @container">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-landing-text-primary dark:text-landing-primary-light tracking-light text-3xl font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-3xl mx-auto">
          Discover the Power of Traditional Wisdom
        </h2>
        <p className="text-landing-text-body dark:text-gray-300 text-base font-normal leading-normal max-w-3xl mx-auto">
          HerbWise combines modern AI with a deep respect for traditional
          Nigerian herbal knowledge, providing you with a powerful tool for
          discovery.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
