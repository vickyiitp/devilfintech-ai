// components/ChatFooter.tsx
import React from 'react';

export const ChatFooter: React.FC = () => {
  return (
    <footer className="flex-shrink-0 p-2 text-center text-xs text-gray-500 border-t border-[var(--border-color)] bg-[var(--main-bg)]/80 backdrop-blur-sm">
      <p>&copy; {new Date().getFullYear()} DevilFintech AI. All rights reserved. | Not real financial advice.</p>
      <p>Your conversations are stored locally on your device and are not shared.</p>
    </footer>
  );
};