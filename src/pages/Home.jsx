import React from 'react';
import LandingNavbar from '../components/layout/LandingNavbar';
import HeroSection from '../components/home/HeroSection';
import FeatureSection from '../components/home/FeatureSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="bg-landing-background-light dark:bg-landing-background-dark font-display text-landing-text-body dark:text-gray-300 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
              <LandingNavbar />
              <main className="flex-grow">
                <HeroSection />
                <FeatureSection />
                <HowItWorksSection />
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
