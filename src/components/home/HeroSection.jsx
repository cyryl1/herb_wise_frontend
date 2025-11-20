import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="@container">
      <div className="flex flex-col gap-10 px-4 py-16 @[864px]:flex-row @[864px]:items-center">
        <div className="flex flex-col gap-6 @[480px]:gap-8 @[864px]:w-1/2 @[864px]:justify-center">
          <div className="flex flex-col gap-4 text-left">
            <h1 className="text-landing-text-primary dark:text-landing-primary-light text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              Unlock the Secrets of Nigerian Herbs. Instantly.
            </h1>
            <p className="text-landing-text-body dark:text-gray-300 text-base font-normal leading-normal @[480px]:text-lg">
              Snap a photo of any plant and let our AI tell you its traditional
              name, uses, and benefits.
            </p>
          </div>

          <Link
            to="/identify"
            className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 @[480px]:h-14 @[480px]:px-6 bg-landing-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
          >
            <span className="truncate">Identify an Herb Now</span>
          </Link>
        </div>
        <div className="w-full @[864px]:w-1/2">
          <div
            className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
            data-alt="A high-quality, close-up image of a Nigerian Scent Leaf (Ocimum gratissimum) plant, with vibrant green leaves."
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLeSak0lbpwyRcihzFwbYkJV4P0xey3n0YK-JiKd25ngtPOen74azit9uAA3N_NWPbpC_X0CFWSGAKwEe5IMFRS8leSPGFaS6FcCcS6GPL4_3hS39Gv-eW9QeB9HcmS6EcC0N4z9-6tdJ4eFrWClWfiocRcbE8F5aJUSbmlShlKQJSGweVaECNvJ4AydCvkrztHxHY3KKslzicGyDxD9TJwSL-EoPM_jnQigWy9qnbYqbvWhVnC7dwrpCcXu6DGkTA8j3K7OdYfz9H")',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
