import React, { useState, useRef, useEffect } from "react";
import {
  SparklesIcon,
  PlusIcon,
  MoreVerticalIcon,
  FileTextIcon,
  FileJsonIcon,
} from "./icons";
import { UserProfile } from "../types";
import { UserAvatar } from "./avatars";

interface ChatHeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearch: (query: string) => void;
  onOpenProfile: () => void;
  onNewChat: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  searchQuery,
  onSearch,
  onOpenProfile,
  onNewChat,
  onExportMarkdown,
  onExportJson,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--main-bg)]/80 backdrop-blur-sm text-primary">
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-3"
          title="Back to Landing Page"
        >
          <SparklesIcon className="w-6 h-6 text-blue-400" aria-hidden="true" />
          <h1 className="text-xl font-semibold hidden sm:block">
            DevilFintech AI
          </h1>
        </button>
        <button
          onClick={onNewChat}
          title="Start a new chat"
          className="flex items-center gap-2 ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden md:inline">New Chat</span>
        </button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-28 sm:w-40 md:w-64 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full py-1.5 pl-4 pr-4 text-sm placeholder-gray-500 focus:outline-none header-search-input transition-all"
          aria-label="Search conversation history"
        />

        <div className="relative">
          <button
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen((p) => !p)}
            title="More options"
            aria-label="More chat options"
            className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-2 w-56 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg z-20 animate-fade-in-up text-sm overflow-hidden"
            >
              <button
                onClick={() => {
                  onExportMarkdown();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/10 transition-colors"
              >
                <FileTextIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />{" "}
                Export as Markdown
              </button>
              <button
                onClick={() => {
                  onExportJson();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/10 transition-colors"
              >
                <FileJsonIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />{" "}
                Export as JSON
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onOpenProfile}
          title="Profile & Settings"
          aria-label="Open profile and settings"
          className="flex items-center gap-2 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span className="text-sm text-gray-400 hidden lg:block pr-1">
            <span className="font-semibold text-white">{user.name}</span>
          </span>
          <UserAvatar avatarId={user.avatarId} className="w-8 h-8" />
        </button>
      </div>
    </header>
  );
};
