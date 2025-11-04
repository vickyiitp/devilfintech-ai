// components/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { SparklesIcon, UserIcon } from './icons';
import { avatars, UserAvatar } from './avatars';

interface LoginPageProps {
  onLogin: (username: string, avatarId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() && selectedAvatar) {
        onLogin(username, selectedAvatar);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 animate-fade-in">
        <div className="relative z-10 w-full max-w-lg">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center gap-3 mb-4">
                    <SparklesIcon className="w-8 h-8 text-blue-400" />
                    <h1 className="text-2xl font-bold text-white">Create Your Profile</h1>
                </div>
                <p className="text-gray-400 mb-8">Choose a name and an avatar to join the community.</p>
                <form onSubmit={handleSubmit}>
                    <div className="relative mb-6">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all chat-input-glow"
                            required
                            aria-label="Username"
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-3">Select your avatar</p>
                        <div className="grid grid-cols-5 gap-3">
                            {Object.keys(avatars).map(avatarId => (
                                <button
                                    type="button"
                                    key={avatarId}
                                    onClick={() => setSelectedAvatar(avatarId)}
                                    className={`p-1 rounded-full transition-all duration-200 ${selectedAvatar === avatarId ? 'ring-2 ring-blue-500 scale-110' : 'ring-2 ring-transparent hover:ring-blue-500/50'}`}
                                    aria-label={`Select avatar ${avatarId}`}
                                >
                                    <UserAvatar avatarId={avatarId} className="w-full h-auto" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-500 transition-all text-lg shadow-lg shadow-blue-600/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!username.trim() || !selectedAvatar}
                    >
                        Join & Start Chatting
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};
