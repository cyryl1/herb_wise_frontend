import React from 'react';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-start-border-color/60 dark:border-gray-700 px-6 sm:px-10 py-4">
      <div className="flex items-center gap-4 text-start-text-main dark:text-gray-100">
        {/* <div className="text-start-primary size-7">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
              fill="currentColor"
            ></path>
          </svg>
        </div> */}
        <div className="flex items-center gap-4 text-landing-text-primary dark:text-landing-primary-light">
          <div className="size-6">
            <span className="material-symbols-outlined !text-3xl">spa</span>
          </div>
          <h2 className="text-landing-text-primary dark:text-landing-primary-light text-xl font-bold leading-tight tracking-[-0.015em]">
            HerbWise
          </h2>
        </div>
        {/* <h2 className="text-start-text-main dark:text-gray-100 text-xl font-bold leading-tight tracking-[-0.015em]">
          HerbWise
        </h2> */}
      </div>
      <nav className="flex flex-1 justify-end gap-8">
        <div className="hidden md:flex items-center gap-9">
          <Link
            className="text-start-text-main dark:text-gray-300 text-sm font-medium leading-normal hover:text-start-primary dark:hover:text-start-primary-light transition-colors"
            to="/"
          >
            Home
          </Link>
          <a
            className="text-start-text-main dark:text-gray-300 text-sm font-medium leading-normal hover:text-start-primary dark:hover:text-start-primary-light transition-colors"
            href="#"
          >
            Herb Library
          </a>
          <a
            className="text-start-text-main dark:text-gray-300 text-sm font-medium leading-normal hover:text-start-primary dark:hover:text-start-primary-light transition-colors"
            href="#"
          >
            About
          </a>
        </div>
      </nav>
    </header>
  );
};

export default AppNavbar;
