// components/MessageBubble.tsx
import React, { useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import { Message, AudioPlaybackState, Feedback } from "../types";
import {
  UserIcon,
  BotIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  LoadingIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CopyIcon,
  GlobeIcon,
  ChevronDownIcon,
  AlertTriangleIcon,
  DownloadIcon,
} from "./icons";

interface MessageBubbleProps {
  message: Message;
  onToggleAudio: (messageId: string, text: string) => void;
  audioPlaybackState: AudioPlaybackState;
  searchQuery: string;
  onFeedback: (messageId: string, feedback: Feedback) => void;
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3">
    <div
      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
      style={{ animationDelay: "-0.3s" }}
    ></div>
    <div
      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
      style={{ animationDelay: "-0.15s" }}
    ></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
  </div>
);

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight,
}) => {
  if (!highlight.trim() || !text) {
    return <>{text}</>;
  }
  const regex = new RegExp(
    `(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        // Matched parts are at odd indices
        i % 2 === 1 ? (
          <mark key={i} className="bg-blue-300 text-black rounded px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const CodeBlock: React.FC<any> = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return !inline ? (
    <div className="code-block-container">
      <button
        className="copy-code-btn"
        onClick={handleCopy}
        data-copied={isCopied}
        aria-label={isCopied ? "Copied!" : "Copy code"}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
      <pre {...props}>
        <code>{children}</code>
      </pre>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const MessageBubbleComponent: React.FC<MessageBubbleProps> = ({
  message,
  onToggleAudio,
  audioPlaybackState,
  searchQuery,
  onFeedback,
}) => {
  const {
    id,
    sender,
    text,
    timestamp,
    imageUrl,
    isThinking,
    isError,
    feedback,
    sources,
  } = message;
  const isBot = sender === "bot";
  const [isCopied, setIsCopied] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  const handleSaveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    const filename = `finguru-chart-${Date.now()}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isThinking) {
    return (
      <div
        role="status"
        aria-label="Bot is typing"
        className={`flex items-start gap-4 justify-start animate-bubble-in`}
      >
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mt-2 shadow-lg"
        >
          <BotIcon />
        </div>
        <div className="rounded-xl transition-all duration-200 ease-out shadow-md bg-[var(--card-bg)] border border-[var(--border-color)] mt-2">
          <TypingIndicator />
        </div>
      </div>
    );
  }

  const botBubbleClasses = `bg-[var(--card-bg)] border ${isError ? "border-red-500/50" : "border-[var(--border-color)]"}`;
  const userBubbleClasses = "user-bubble-gradient border-blue-500/60";

  return (
    <div
      className={`flex items-start gap-4 ${isBot ? "justify-start" : "justify-end"} animate-bubble-in`}
    >
      {isBot && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mt-2 shadow-lg"
        >
          <BotIcon />
        </div>
      )}
      <div
        className={`rounded-xl w-full max-w-full md:max-w-3xl lg:max-w-4xl transition-all duration-200 ease-out shadow-md ${isBot ? botBubbleClasses : userBubbleClasses}`}
      >
        <div className="p-4 sm:p-5">
          {isError && (
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">Error</span>
            </div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Chart or image attachment"
              className={`rounded-lg mb-3 ${isBot ? "max-w-full" : "max-w-xs"}`}
            />
          )}
          <div className="gemini-prose max-w-none">
            {searchQuery ? (
              <HighlightedText text={text} highlight={searchQuery} />
            ) : (
              <ReactMarkdown components={{ pre: CodeBlock }}>
                {text}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {isBot && sources && sources.length > 0 && (
          <div className="message-sources">
            <div className="sources-header">
              <div className="sources-label">
                <GlobeIcon className="w-4 h-4" aria-hidden="true" />
                <span>Grounded in Google Search</span>
              </div>
              <button
                onClick={() => setSourcesExpanded(!sourcesExpanded)}
                className="sources-toggle-button"
                aria-expanded={sourcesExpanded}
                aria-controls={`sources-list-${id}`}
              >
                <span>
                  {sourcesExpanded ? "Hide" : "Show"} Sources (
                  {sources.filter((s) => s.uri).length})
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${sourcesExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </div>
            {sourcesExpanded && (
              <div id={`sources-list-${id}`} className="sources-list-container">
                {sources
                  .filter((s) => s.uri)
                  .map((source, index) => (
                    <a
                      key={index}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      <span className="source-index">{index + 1}</span>
                      <span
                        className="source-title"
                        title={source.title || source.uri}
                      >
                        {source.title || source.uri}
                      </span>
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="px-4 pb-2 flex items-center justify-between">
          <time className="text-xs text-gray-500">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          {isBot && !isError && (text || imageUrl) && (
            <div className="flex items-center gap-2">
              {imageUrl && (
                <button
                  onClick={handleSaveImage}
                  title="Save chart"
                  aria-label="Save chart image"
                  className="p-1.5 rounded-full text-gray-400 hover:bg-blue-500/20 hover:text-white transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
              )}
              {text && (
                <button
                  onClick={handleCopy}
                  title={isCopied ? "Copied!" : "Copy text"}
                  aria-label={
                    isCopied
                      ? "Copied message to clipboard"
                      : "Copy message text"
                  }
                  className="p-1.5 rounded-full text-gray-400 hover:bg-blue-500/20 hover:text-white transition-colors"
                >
                  {isCopied ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(id, "thumbs_up");
                }}
                title="Good response"
                aria-label="Mark response as good"
                className={`p-1.5 rounded-full hover:bg-blue-500/20 transition-colors ${feedback === "thumbs_up" ? "text-blue-500" : "text-gray-400 hover:text-white"}`}
              >
                <ThumbsUpIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(id, "thumbs_down");
                }}
                title="Bad response"
                aria-label="Mark response as bad"
                className={`p-1.5 rounded-full hover:bg-blue-500/20 transition-colors ${feedback === "thumbs_down" ? "text-red-500" : "text-gray-400 hover:text-white"}`}
              >
                <ThumbsDownIcon className="w-4 h-4" />
              </button>

              {text &&
                (() => {
                  const { activeMessageId, status } = audioPlaybackState;
                  const isActive = activeMessageId === id;
                  const audioButtonTitle =
                    isActive && status === "playing"
                      ? "Pause audio"
                      : "Play audio";

                  return (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAudio(id, text);
                      }}
                      className="p-1.5 rounded-full text-gray-400 hover:bg-blue-500/20 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title={audioButtonTitle}
                      aria-label={audioButtonTitle}
                      disabled={status === "loading" && !isActive}
                    >
                      {isActive && status === "loading" ? (
                        <LoadingIcon className="w-4 h-4 text-blue-400" />
                      ) : isActive && status === "playing" ? (
                        <PauseIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </button>
                  );
                })()}
            </div>
          )}
        </div>
      </div>
      {!isBot && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mt-2 shadow-lg"
        >
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export const MessageBubble = memo(MessageBubbleComponent);
