import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-solid border-landing-border-color dark:border-gray-700 mt-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8">
        <p className="text-sm text-landing-text-secondary dark:text-gray-400">
          © 2024 HerbWise. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-landing-text-body dark:text-gray-300">
          <a
            className="hover:text-landing-primary dark:hover:text-landing-primary-light"
            href="#"
          >
            Contact
          </a>
          <a
            className="hover:text-landing-primary dark:hover:text-landing-primary-light"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="hover:text-landing-primary dark:hover:text-landing-primary-light"
            href="#"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
