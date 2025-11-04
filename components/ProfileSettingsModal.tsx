// components/ProfileSettingsModal.tsx
import React, { useState, useEffect } from "react";
import {
  UserSettings,
  PrebuiltVoice,
  Theme,
  AgeGroup,
  RiskTolerance,
  FinancialGoal,
  FinancialProfile,
  UserProfile,
} from "../types";
import {
  XIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  SparklesIcon,
  QuestionIcon,
  InfoIcon,
  LogOutIcon,
} from "./icons";
import { UserAvatar } from "./avatars";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSettings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onConfirmClear: () => void;
  user: UserProfile;
  onLogout: () => void;
}

const voices: PrebuiltVoice[] = ["Kore", "Puck", "Zephyr", "Fenrir", "Charon"];
const speeds = [0.75, 1, 1.25, 1.5];
const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: "under_30", label: "< 30" },
  { value: "30_45", label: "30 - 45" },
  { value: "46_60", label: "46 - 60" },
  { value: "over_60", label: "> 60" },
];
const riskTolerances: { value: RiskTolerance; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
const financialGoals: { value: FinancialGoal; label: string }[] = [
  { value: "retirement", label: "Retirement" },
  { value: "wealth_creation", label: "Wealth Creation" },
  { value: "tax_saving", label: "Tax Saving" },
  { value: "major_purchase", label: "Major Purchase" },
];

// Local component for semantic grouping of settings
const SettingSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <fieldset className={`border-none p-0 m-0 ${className}`}>
    <legend className="text-sm font-semibold text-gray-400 mb-3 px-1 w-full">
      {title}
    </legend>
    {children}
  </fieldset>
);

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  userSettings,
  onSettingsChange,
  onConfirmClear,
  user,
  onLogout,
}) => {
  const [currentSettings, setCurrentSettings] =
    useState<UserSettings>(userSettings);

  useEffect(() => {
    setCurrentSettings(userSettings);
  }, [isOpen, userSettings]);

  const handleSave = () => {
    onSettingsChange(currentSettings);
    onClose();
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentSettings((prev) => ({ ...prev, theme }));
  };

  const handleAudioChange = (change: Partial<UserSettings["audio"]>) => {
    setCurrentSettings((prev) => ({
      ...prev,
      audio: { ...prev.audio, ...change },
    }));
  };

  const handleFinancialProfileChange = (change: Partial<FinancialProfile>) => {
    setCurrentSettings((prev) => ({
      ...prev,
      financialProfile: { ...prev.financialProfile, ...change },
    }));
  };

  const handleGoalChange = (goal: FinancialGoal) => {
    const currentGoals = currentSettings.financialProfile.financialGoals || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];
    handleFinancialProfileChange({ financialGoals: newGoals });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full sm:max-w-lg m-2 sm:m-4 text-primary animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold">Profile & Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10"
            title="Close"
            aria-label="Close settings"
          >
            <XIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <InfoIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <h3 className="text-md font-semibold text-blue-300">
                Get Tailored Financial Advice
              </h3>
            </div>
            <p className="text-sm text-blue-200/80">
              Setting your financial profile helps FinGuru provide advice that's
              right for you. Your answers directly influence the AI's
              recommendations.
            </p>
            <ul className="text-xs text-blue-200/70 mt-3 list-disc list-inside space-y-1">
              <li>
                <b>Age:</b> A user <b>&lt; 30</b> might get suggestions for
                long-term growth stocks, while someone <b>&gt; 60</b> will
                receive advice on capital preservation.
              </li>
              <li>
                <b>Risk Tolerance:</b> A <b>high-risk</b> profile unlocks
                suggestions for equities, while a <b>low-risk</b> profile
                focuses on safer bets like government bonds.
              </li>
              <li>
                <b>Goals:</b> Selecting <b>Tax Saving</b> will prioritize advice
                on 80C instruments, while <b>Wealth Creation</b> will focus on
                compounding.
              </li>
            </ul>
          </div>

          <SettingSection title="PROFILE">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <UserAvatar avatarId={user.avatarId} className="w-16 h-16" />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400">
                    Score: {user.score.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </SettingSection>

          <SettingSection title="FINANCIAL PROFILE">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Age Group</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ageGroups.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        handleFinancialProfileChange({ ageGroup: value })
                      }
                      className={`px-2 py-1.5 rounded-md transition-colors text-sm ${currentSettings.financialProfile.ageGroup === value ? "bg-blue-600 text-white" : "bg-[var(--input-bg)] hover:bg-slate-700"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">
                  Risk Tolerance
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {riskTolerances.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        handleFinancialProfileChange({ riskTolerance: value })
                      }
                      className={`px-2 py-1.5 rounded-md transition-colors text-sm ${currentSettings.financialProfile.riskTolerance === value ? "bg-blue-600 text-white" : "bg-[var(--input-bg)] hover:bg-slate-700"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">
                  Primary Goals
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {financialGoals.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleGoalChange(value)}
                      className={`px-3 py-1.5 rounded-md text-left transition-colors flex items-center gap-2 text-sm ${currentSettings.financialProfile.financialGoals.includes(value) ? "bg-blue-600 text-white" : "bg-[var(--input-bg)] hover:bg-slate-700"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 ${currentSettings.financialProfile.financialGoals.includes(value) ? "bg-blue-600 border-blue-400" : "border-gray-500"}`}
                      >
                        {currentSettings.financialProfile.financialGoals.includes(
                          value
                        ) && (
                          <CheckIcon
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection title="APPEARANCE">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${currentSettings.theme === "light" ? "border-blue-500 bg-blue-500/10" : "border-transparent bg-[var(--input-bg)] hover:border-gray-600"}`}
              >
                <div className="flex items-center gap-3">
                  <SunIcon className="w-5 h-5" aria-hidden="true" />
                  <span>Light Mode</span>
                </div>
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${currentSettings.theme === "dark" ? "border-blue-500 bg-blue-500/10" : "border-transparent bg-[var(--input-bg)] hover:border-gray-600"}`}
              >
                <div className="flex items-center gap-3">
                  <MoonIcon className="w-5 h-5" aria-hidden="true" />
                  <span>Dark Mode</span>
                </div>
              </button>
            </div>
          </SettingSection>

          <SettingSection title="AI SETTINGS">
            <button
              onClick={() =>
                setCurrentSettings((prev) => ({
                  ...prev,
                  proMode: !prev.proMode,
                }))
              }
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--input-bg)] border-2 border-transparent hover:border-gray-600 transition-colors"
              role="switch"
              aria-checked={currentSettings.proMode}
            >
              <div className="flex items-center gap-3">
                <SparklesIcon
                  className="w-5 h-5 text-purple-400"
                  aria-hidden="true"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">Pro Mode</span>
                    <div className="tooltip-container">
                      <QuestionIcon className="w-4 h-4 text-gray-500" />
                      <span className="tooltip-text">
                        <b>Pro Mode</b> uses the advanced{" "}
                        <b>gemini-2.0-flash-thinking-exp</b> model with enhanced
                        reasoning capabilities for complex financial analysis.
                        This provides deeper insights but may result in slower
                        response times.
                        <br />
                        <br />
                        <b>Default Mode</b> uses the fast{" "}
                        <b>gemini-2.0-flash-exp</b> model for quick, concise
                        answers and faster responses.
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Use a more powerful model for complex analysis.
                  </p>
                </div>
              </div>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${currentSettings.proMode ? "bg-blue-600" : "bg-gray-600"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${currentSettings.proMode ? "translate-x-5" : "translate-x-0"}`}
                ></span>
              </div>
            </button>
          </SettingSection>

          <SettingSection title="AUDIO SETTINGS">
            <div className="mb-4">
              <h4 className="font-medium text-gray-300 mb-2">Voice</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {voices.map((voice) => (
                  <button
                    key={voice}
                    onClick={() => handleAudioChange({ voice })}
                    className={`px-3 py-1.5 rounded-md text-left transition-colors flex items-center justify-between text-sm ${currentSettings.audio.voice === voice ? "bg-blue-600 text-white" : "bg-[var(--input-bg)] hover:bg-slate-700"}`}
                  >
                    {voice}
                    {currentSettings.audio.voice === voice && (
                      <CheckIcon className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Playback Speed</h4>
              <div className="grid grid-cols-4 gap-2">
                {speeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleAudioChange({ speed })}
                    className={`px-2 py-1.5 rounded-md transition-colors text-sm ${currentSettings.audio.speed === speed ? "bg-blue-600 text-white" : "bg-[var(--input-bg)] hover:bg-slate-700"}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </SettingSection>

          <fieldset className="border-t-2 border-red-500/20 pt-4 mt-6">
            <legend className="text-sm font-semibold text-red-500/80 -translate-y-6 bg-[var(--card-bg)] px-2">
              DANGER ZONE
            </legend>
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-400">
                  Clear Chat History
                </h4>
                <p className="text-sm text-red-400/80">
                  This will permanently delete all messages.
                </p>
              </div>
              <button
                onClick={onConfirmClear}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                Clear History
              </button>
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-black/20 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-500/20 text-white hover:bg-gray-500/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
