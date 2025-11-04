// components/LandingHeader.tsx
import React from "react";
import {
  SparklesIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from "./icons";

export const LandingHeader: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-blue-400" aria-hidden="true" />
          <span className="text-xl font-bold text-white">DevilFintech AI</span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/vickyiitp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            title="GitHub"
            aria-label="View source on GitHub"
          >
            <GithubIcon className="w-6 h-6" />
          </a>
          <a
            href="https://twitter.com/vickyiitp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            title="Twitter"
            aria-label="Follow creator on Twitter"
          >
            <TwitterIcon className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/vickyiitp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            title="LinkedIn"
            aria-label="Connect with creator on LinkedIn"
          >
            <LinkedinIcon className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/vickyiitp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            title="Instagram"
            aria-label="Follow creator on Instagram"
          >
            <InstagramIcon className="w-6 h-6" />
          </a>
        </nav>
      </div>
    </header>
  );
};
