// components/LandingFooter.tsx
import React from "react";
import {
  SparklesIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from "./icons";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--sidebar-bg)] border-t border-[var(--border-color)] text-gray-400 py-12 px-6">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon
              className="w-6 h-6 text-blue-400"
              aria-hidden="true"
            />
            <span className="text-xl font-bold text-white">
              DevilFintech AI
            </span>
          </div>
          <p className="text-sm pr-4">
            An AI-powered financial analyst designed to demystify complex
            financial topics, analyze data, and provide strategic insights for
            everyone from startup founders to individual investors.
          </p>
        </div>

        {/* Projects Section */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">
            Devil Labs Projects
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                E-Book Creator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Typing Test
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                AI Image Gen
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                More Tools
              </a>
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div>
          <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">
            Connect
          </h3>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/vickyiitp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="GitHub"
              aria-label="View source on GitHub"
            >
              <GithubIcon className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/vickyiitp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="Twitter"
              aria-label="Follow creator on Twitter"
            >
              <TwitterIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/vickyiitp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="LinkedIn"
              aria-label="Connect with creator on LinkedIn"
            >
              <LinkedinIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/vickyiitp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="Instagram"
              aria-label="Follow creator on Instagram"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-[var(--border-color)] text-center text-xs">
        &copy; {new Date().getFullYear()} DevilFintech AI. All rights reserved.
        | Not real financial advice.
      </div>
    </footer>
  );
};
