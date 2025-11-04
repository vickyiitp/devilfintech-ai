// components/ChatWindow.tsx
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Message, AudioPlaybackState, Feedback } from '../types';
import { MessageBubble } from './MessageBubble';
import { SendIcon, LoadingIcon, SparklesIcon, ChevronDownIcon, PaperclipIcon, MicrophoneIcon, XIcon, ImageIcon, FileTextIcon, AlertTriangleIcon } from './icons';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string, imageUrl?: string) => void;
  isLoading: boolean;
  onToggleAudio: (messageId: string, text: string) => void;
  audioPlaybackState: AudioPlaybackState;
  searchQuery: string;
  onFollowUpClick: (suggestion: string) => void;
  onFeedback: (messageId: string, feedback: Feedback) => void;
  isLocked: boolean;
  lockdownTimeLeft: number;
  onUnlock: (password: string) => void;
}

const ConversationStarters = ({ onSelect }: { onSelect: (query: string) => void }) => {
    const starters = [
        "How do I create a financial model for a Series A round?",
        "Explain different startup valuation methods.",
        "What are the key metrics to track for a SaaS business?",
        "Compare the startup ecosystems in Silicon Valley vs. London."
    ];

    return (
        <div className="px-4 pb-4 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">Conversation Starters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {starters.map((starter, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(starter)}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg text-left text-sm text-gray-300 hover:bg-white/10 transition-colors transform hover:-translate-y-0.5"
                    >
                        {starter}
                    </button>
                ))}
            </div>
        </div>
    )
};

const LockdownOverlay: React.FC<{ timeLeft: number; onUnlock: (password: string) => void }> = ({ timeLeft, onUnlock }) => {
    const [password, setPassword] = useState('');
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const handleUnlockSubmit = (e: FormEvent) => {
        e.preventDefault();
        onUnlock(password);
        setPassword('');
    };

    return (
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6 bg-gradient-to-t from-[var(--main-bg)] via-[var(--main-bg)]/95 to-transparent backdrop-blur-lg border-t-2 border-red-500/50 animate-fade-in-up">
            <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 text-red-400 mb-3">
                    <div className="relative">
                        <AlertTriangleIcon className="w-7 h-7" aria-hidden="true" />
                        <div className="absolute inset-0 bg-red-500/50 rounded-full animate-ping -z-10"></div>
                    </div>
                    <h3 className="text-xl font-bold">Security Protocol Activated</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    The chat is temporarily locked. Please wait for the timer to complete, or enter the password to unlock immediately.
                </p>
                <div className="text-2xl font-mono tracking-widest text-white mb-4">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <form onSubmit={handleUnlockSubmit} className="flex justify-center gap-2">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to unlock..."
                        className="w-full max-w-xs bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        aria-label="Password to unlock chat"
                    />
                    <button type="submit" className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors">
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
};


export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onToggleAudio,
  audioPlaybackState,
  searchQuery,
  onFollowUpClick,
  onFeedback,
  isLocked,
  lockdownTimeLeft,
  onUnlock
}) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<{ type: 'image'; url: string; file: File } | { type: 'document'; file: File } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null); // Using `any` for SpeechRecognition
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const paperclipButtonRef = useRef<HTMLButtonElement>(null);


  // Close attachment menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (showAttachmentMenu &&
            attachmentMenuRef.current &&
            !attachmentMenuRef.current.contains(event.target as Node) &&
            paperclipButtonRef.current &&
            !paperclipButtonRef.current.contains(event.target as Node)
        ) {
            setShowAttachmentMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachmentMenu]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      };
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollHeight, scrollTop, clientHeight } = container;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 200;
      if (isScrolledToBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);
  
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };
  
  const handleAttachmentTypeSelect = (type: 'image' | 'document') => {
      if (fileInputRef.current) {
          fileInputRef.current.accept = type === 'image' ? 'image/*' : '.txt,.csv,.md';
          fileInputRef.current.click();
      }
      setShowAttachmentMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({ type: 'image', url: reader.result as string, file });
            };
            reader.readAsDataURL(file);
        } else {
            setAttachment({ type: 'document', file });
        }
    }
    if (e.target) e.target.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachment) && !isLoading) {
        let messageToSend = input.trim();
        let imageUrlToSend: string | undefined = undefined;

        if (attachment) {
            if (attachment.type === 'image') {
                imageUrlToSend = attachment.url;
            } else { // Document
                try {
                    const fileContent = await attachment.file.text();
                    const userQuery = messageToSend || `Summarize and provide key insights from the attached document.`;
                    messageToSend = `${userQuery}\n\n--- START OF ATTACHED FILE: ${attachment.file.name} ---\n\n${fileContent}\n\n--- END OF ATTACHED FILE ---`;
                } catch (error) {
                    console.error('Error reading file:', error);
                    // TODO: Show an error to the user
                    return;
                }
            }
        }
        onSendMessage(messageToSend, imageUrlToSend);
        setInput('');
        setAttachment(null);
    }
  };
  
  const lastMessage = messages[messages.length - 1];
  const isInputDisabled = isLoading || isLocked;

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto w-full space-y-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onToggleAudio={onToggleAudio}
                audioPlaybackState={audioPlaybackState}
                searchQuery={searchQuery}
                onFeedback={onFeedback}
              />
            ))}
            {isLoading && messages[messages.length-1]?.sender === 'user' && (
               <MessageBubble message={{ id: 'thinking', sender: 'bot', text: '', timestamp: new Date(), isThinking: true }} onToggleAudio={()=>{}} audioPlaybackState={audioPlaybackState} searchQuery='' onFeedback={() => {}} />
            )}
             {messages.length === 1 && (
                <ConversationStarters onSelect={(q) => onSendMessage(q)} />
            )}
            <div ref={messagesEndRef} />
          </div>
      </div>

       {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-32 right-6 z-10 p-2 bg-blue-600/60 backdrop-blur-sm rounded-full text-white hover:bg-blue-500/80 transition-all animate-fade-in-up shadow-lg"
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ChevronDownIcon className="w-6 h-6" aria-hidden="true" />
        </button>
      )}
       <div className="p-4 md:p-6 border-t border-[var(--border-color)] bg-[var(--main-bg)]">
         <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            {lastMessage?.sender === 'bot' && lastMessage.followUpSuggestions && lastMessage.followUpSuggestions.length > 0 && (
              <div className="pb-4 flex flex-wrap gap-2 animate-fade-in-up">
                {lastMessage.followUpSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onFollowUpClick(suggestion)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm rounded-full hover:bg-blue-500/20 transition-all transform hover:scale-105"
                  >
                    <SparklesIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {attachment && (
                <div className="relative inline-block mb-2 animate-fade-in-up">
                    {attachment.type === 'image' ? (
                      <img src={attachment.url} alt="upload preview" className="h-20 w-20 object-cover rounded-md border border-[var(--border-color)]" />
                    ) : (
                      <div className="h-20 w-auto max-w-xs p-2 flex flex-col items-center justify-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-center">
                          <FileTextIcon className="w-8 h-8 text-gray-400" aria-hidden="true" />
                          <span className="text-xs text-gray-400 mt-1 w-28 truncate" title={attachment.file.name}>{attachment.file.name}</span>
                      </div>
                    )}
                    <button onClick={() => setAttachment(null)} title="Remove attachment" aria-label="Remove attachment" className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-0.5 border-2 border-[var(--main-bg)]">
                        <XIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
              <div className="relative">
                <button
                    ref={paperclipButtonRef}
                    type="button"
                    onClick={() => setShowAttachmentMenu(p => !p)}
                    title="Attach file"
                    aria-label="Attach a file"
                    className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    disabled={isInputDisabled}
                  >
                    <PaperclipIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                {showAttachmentMenu && (
                    <div ref={attachmentMenuRef} className="absolute bottom-full mb-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg z-20 animate-fade-in-up text-sm overflow-hidden w-40">
                        <button onClick={() => handleAttachmentTypeSelect('image')} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors">
                            <ImageIcon className="w-5 h-5 text-blue-400" aria-hidden="true" /> Image
                        </button>
                        <button onClick={() => handleAttachmentTypeSelect('document')} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors">
                            <FileTextIcon className="w-5 h-5 text-green-400" aria-hidden="true" /> Document
                        </button>
                    </div>
                )}
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLocked ? "Chat is locked..." : "Ask a question, or attach a file..."}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full py-3 pl-5 pr-24 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all chat-input-glow disabled:opacity-50"
                disabled={isInputDisabled}
                aria-label="Chat input"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                 <button
                    type="button"
                    onClick={handleMicClick}
                    disabled={!recognitionRef.current || isInputDisabled}
                    title="Speak your query"
                    aria-label="Speak your query"
                    className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                  >
                    <MicrophoneIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="submit"
                    disabled={isInputDisabled || (!input.trim() && !attachment)}
                    className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors ml-1"
                    title={isLoading ? "Sending..." : "Send message"}
                    aria-label={isLoading ? "Sending..." : "Send message"}
                  >
                    {isLoading ? <LoadingIcon className="w-5 h-5" aria-hidden="true" /> : <SendIcon className="w-5 h-5" aria-hidden="true" />}
                  </button>
              </div>
            </form>
          </div>
       </div>
       {isLocked && <LockdownOverlay timeLeft={lockdownTimeLeft} onUnlock={onUnlock} />}
    </div>
  );
};