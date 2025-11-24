import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-landing-border-color dark:border-gray-700 px-6 sm:px-10 py-3">
      <div className="flex items-center gap-4 text-landing-text-primary dark:text-landing-primary-light">
        <div className="size-6">
          <span className="material-symbols-outlined !text-3xl">spa</span>
        </div>
        <h2 className="text-landing-text-primary dark:text-landing-primary-light text-xl font-bold leading-tight tracking-[-0.015em]">
          HerbWise
        </h2>
      </div>
      <div className="hidden md:flex flex-1 justify-end items-center gap-8">
        {/* <div className="flex items-center gap-9">
          <a
            className="text-landing-text-body dark:text-gray-300 text-sm font-medium leading-normal"
            href="#"
          >
            Features
          </a>
          <a
            className="text-landing-text-body dark:text-gray-300 text-sm font-medium leading-normal"
            href="#"
          >
            About
          </a>
        </div> */}
        <Link
          to="/identify"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-landing-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
        >
          <span className="truncate">Launch App</span>
        </Link>
      </div>
      <button className="md:hidden flex items-center justify-center text-landing-text-primary dark:text-landing-primary-light">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};

export default LandingNavbar;
