// components/HomePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";
import { ChatHeader } from "./ChatHeader";
import { ChatWindow } from "./ChatWindow";
import {
  Message,
  AudioPlaybackState,
  Feedback,
  UserSettings,
  UserProfile,
} from "../types";
import { geminiService } from "../services/geminiService";
import { ChatFooter } from "./ChatFooter";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { ProfileSettingsModal } from "./ProfileSettingsModal";
import { analyticsService } from "../services/analyticsService";

interface HomePageProps {
  user: UserProfile;
  onLogout: () => void;
}

const initialMessage: Message = {
  id: "initial",
  sender: "bot",
  text: "Hello! I'm FinGuru, your personal AI financial specialist. Think of me as your guide to navigating the global financial and business landscape. Whether you're a startup founder creating a strategy, an investor analyzing markets, or just want to build a solid budget, I'm here to provide clear, data-driven insights. What's on your mind today?",
  timestamp: new Date(),
};

export const HomePage: React.FC<HomePageProps> = ({ user, onLogout }) => {
  const CHAT_HISTORY_KEY = `devilfintech-chat-history-${user.id}`;
  const USER_SETTINGS_KEY = `devilfintech-user-settings-${user.id}`;
  const LOCKDOWN_END_TIME_KEY = `devilfintech-lockdown-end-time-${user.id}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage", error);
    }
    return [initialMessage];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockdownTimeLeft, setLockdownTimeLeft] = useState(0);

  const [audioPlaybackState, setAudioPlaybackState] =
    useState<AudioPlaybackState>({
      activeMessageId: null,
      status: "idle",
      progress: 0,
      duration: 0,
    });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const defaultSettings: UserSettings = {
      theme: "dark",
      audio: { voice: "Kore", speed: 1 },
      financialProfile: {
        ageGroup: "30_45",
        riskTolerance: "medium",
        financialGoals: ["retirement", "wealth_creation"],
      },
      proMode: false,
    };
    try {
      const savedSettings = localStorage.getItem(USER_SETTINGS_KEY);
      if (savedSettings) {
        const loaded = JSON.parse(savedSettings);
        // Deep merge to ensure new settings properties are not lost
        return {
          ...defaultSettings,
          ...loaded,
          audio: { ...defaultSettings.audio, ...loaded.audio },
          financialProfile: {
            ...defaultSettings.financialProfile,
            ...loaded.financialProfile,
          },
        };
      }
      return defaultSettings;
    } catch (error) {
      console.error("Failed to load user settings from localStorage", error);
      return defaultSettings;
    }
  });

  // Check lockdown status on initial component mount
  useEffect(() => {
    const checkLockdownStatus = () => {
      try {
        const lockdownEndTimeStr = localStorage.getItem(LOCKDOWN_END_TIME_KEY);
        if (lockdownEndTimeStr) {
          const lockdownEndTime = parseInt(lockdownEndTimeStr, 10);
          const now = Date.now();
          if (now < lockdownEndTime) {
            const timeLeft = Math.round((lockdownEndTime - now) / 1000);
            setIsLocked(true);
            setLockdownTimeLeft(timeLeft);
          } else {
            localStorage.removeItem(LOCKDOWN_END_TIME_KEY);
          }
        }
      } catch (error) {
        console.error(
          "Failed to check lockdown status from localStorage",
          error
        );
      }
    };
    checkLockdownStatus();
  }, [LOCKDOWN_END_TIME_KEY]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages, CHAT_HISTORY_KEY]);

  // Save user settings and apply theme
  useEffect(() => {
    try {
      localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(userSettings));
      document.documentElement.setAttribute("data-theme", userSettings.theme);
    } catch (error) {
      console.error("Failed to save user settings to localStorage", error);
    }
  }, [userSettings, USER_SETTINGS_KEY]);

  // Lockdown Timer Effect
  useEffect(() => {
    if (isLocked && lockdownTimeLeft > 0) {
      const timer = setInterval(() => {
        setLockdownTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isLocked && lockdownTimeLeft <= 0) {
      setIsLocked(false);
      localStorage.removeItem(LOCKDOWN_END_TIME_KEY);
    }
  }, [isLocked, lockdownTimeLeft, LOCKDOWN_END_TIME_KEY]);

  const handleSendMessage = useCallback(
    async (text: string, imageUrl?: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        text,
        timestamp: new Date(),
        imageUrl,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // --- Gamification: Award points ---
      analyticsService.updateUserScore(user.id, 10); // +10 points per message
      if (imageUrl) {
        analyticsService.updateUserScore(user.id, 50); // +50 points for an attachment
      }

      const botMessageId = (Date.now() + 1).toString();

      try {
        const stream = geminiService.sendMessage(
          text,
          messages,
          userSettings,
          imageUrl
        );
        let accumulatedText = "";
        let botMessageExists = false;

        for await (const chunk of stream) {
          if ("lockdown" in chunk && chunk.lockdown) {
            const lockdownDurationMs = 300 * 1000; // 5 minutes
            const endTime = Date.now() + lockdownDurationMs;
            localStorage.setItem(LOCKDOWN_END_TIME_KEY, endTime.toString());

            setIsLocked(true);
            setLockdownTimeLeft(300);
            setIsLoading(false);
            return; // Exit early
          }

          if (!botMessageExists) {
            const placeholderBotMessage: Message = {
              id: botMessageId,
              sender: "bot",
              text: "",
              timestamp: new Date(),
              isThinking: true,
            };
            setMessages((prev) => [...prev, placeholderBotMessage]);
            botMessageExists = true;
          }

          accumulatedText += (chunk as Partial<Message>).text || "";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    ...(chunk as Partial<Message>),
                    text: accumulatedText,
                    isThinking: false,
                  }
                : msg
            )
          );
        }
      } catch (error) {
        console.error("Error handling send message stream:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: "Sorry, an error occurred.",
                  isError: true,
                  isThinking: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== botMessageId || !msg.isThinking)
        );
      }
    },
    [messages, userSettings, LOCKDOWN_END_TIME_KEY, user.id]
  );

  const handleFollowUpClick = (suggestion: string) => {
    analyticsService.updateUserScore(user.id, 5); // +5 for using a suggestion
    handleSendMessage(suggestion);
  };

  const handleUnlock = (password: string) => {
    if (password === "Rasha") {
      setIsLocked(false);
      // DO NOT remove lockdown from localStorage - timer should continue running
      // DO NOT reset lockdownTimeLeft - it should keep counting down
    }
  };

  const handleToggleAudio = async (messageId: string, text: string) => {
    // Use Web Speech API for text-to-speech
    const synth = window.speechSynthesis;
    const { activeMessageId, status } = audioPlaybackState;

    // If already speaking this message
    if (activeMessageId === messageId) {
      if (status === "playing") {
        synth.pause();
        setAudioPlaybackState((prev) => ({ ...prev, status: "paused" }));
      } else if (status === "paused") {
        synth.resume();
        setAudioPlaybackState((prev) => ({ ...prev, status: "playing" }));
      }
      return;
    }

    // Stop any ongoing speech
    synth.cancel();

    setAudioPlaybackState({
      activeMessageId: messageId,
      status: "loading",
      progress: 0,
      duration: 0,
    });

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = userSettings.audio.speed;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get available voices - wait for voices to load if needed
    let voices = synth.getVoices();
    if (voices.length === 0) {
      // Wait for voices to load
      await new Promise((resolve) => {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
          resolve(null);
        };
      });
    }

    // Try to find a good English voice, prefer female voices for "Kore"
    if (voices.length > 0) {
      const preferredVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.includes("Female") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Victoria"))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      } else {
        // Fallback to any English voice
        const englishVoice = voices.find((voice) =>
          voice.lang.startsWith("en")
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
    }

    utterance.onstart = () => {
      setAudioPlaybackState({
        activeMessageId: messageId,
        status: "playing",
        progress: 0,
        duration: text.length / 10, // Rough estimate
      });
    };

    utterance.onend = () => {
      setAudioPlaybackState({
        activeMessageId: null,
        status: "idle",
        progress: 0,
        duration: 0,
      });
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setAudioPlaybackState({
        activeMessageId: null,
        status: "idle",
        progress: 0,
        duration: 0,
      });
    };

    // Start speaking
    synth.speak(utterance);
  };

  const handleFeedback = (messageId: string, feedback: Feedback) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
          : msg
      )
    );
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
    setIsClearConfirmOpen(false);
    setIsProfileModalOpen(false); // Close settings modal after clearing
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const handleExport = (format: "md" | "json") => {
    const getMarkdownContent = () => {
      const header = `# FinGuru Chat Export\n\n**Exported on:** ${new Date().toLocaleString()}\n**Conversation with:** ${user.name}\n\n---\n\n`;
      const chatContent = messages
        .map((msg) => {
          const timestamp = msg.timestamp.toLocaleString();
          const sender = msg.sender === "bot" ? "FinGuru" : user.name;
          let text = msg.text;
          if (msg.sender === "bot") {
            text = "> " + text.replace(/\n/g, "\n> ");
          }
          return `**${sender}** (_${timestamp}_):\n\n${text}`;
        })
        .join("\n\n---\n\n");
      return header + chatContent;
    };

    const getJsonContent = () => {
      return JSON.stringify(messages, null, 2);
    };

    const content = format === "md" ? getMarkdownContent() : getJsonContent();
    const mimeType =
      format === "md"
        ? "text/markdown;charset=utf-8"
        : "application/json;charset=utf-8";
    const filename = `finguru-chat-${new Date().toISOString()}.${format}`;

    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, filename);
  };

  return (
    <div className="flex h-screen bg-transparent text-white">
      <main className="flex-1 flex flex-col transition-all duration-300">
        <ChatHeader
          user={user}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onNewChat={() => setIsClearConfirmOpen(true)}
          onExportMarkdown={() => handleExport("md")}
          onExportJson={() => handleExport("json")}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onToggleAudio={handleToggleAudio}
            audioPlaybackState={audioPlaybackState}
            searchQuery={searchQuery}
            onFollowUpClick={handleFollowUpClick}
            onFeedback={handleFeedback}
            isLocked={isLocked}
            lockdownTimeLeft={lockdownTimeLeft}
            onUnlock={handleUnlock}
          />
        </div>
        <ChatFooter />
      </main>
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userSettings={userSettings}
        onSettingsChange={setUserSettings}
        onConfirmClear={() => {
          setIsProfileModalOpen(false);
          setIsClearConfirmOpen(true);
        }}
        user={user}
        onLogout={onLogout}
      />
      <ConfirmationDialog
        isOpen={isClearConfirmOpen}
        onConfirm={handleClearChat}
        onCancel={() => setIsClearConfirmOpen(false)}
        title="Start New Chat"
      >
        <p className="text-gray-400">
          Are you sure you want to clear this conversation and start a new one?
          This action cannot be undone.
        </p>
      </ConfirmationDialog>
    </div>
  );
};
