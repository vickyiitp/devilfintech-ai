// components/LandingPage.tsx
import React, { useEffect, useState, useRef, memo } from "react";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";
import {
  BotIcon,
  ShieldIcon,
  SparklesIcon,
  BrainCircuitIcon,
  WaveformIcon,
  AnalysisIcon,
  ActionIcon,
  QuoteIcon,
  QuestionIcon,
  DocumentScanIcon,
  BookOpenIcon,
  KeyboardIcon,
  ImagePlusIcon,
  TestTubeIcon,
} from "./icons";
import { CommunityHub } from "./CommunityHub";
import { analyticsService } from "../services/analyticsService";

interface LandingPageProps {
  onStartChat: () => void;
}

const FeatureCardComponent: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  animationDelay?: string;
}> = ({ icon, title, children, animationDelay = "0ms" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const baseClasses =
    "bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] transition-all duration-700 ease-out hover:border-blue-500 hover:shadow-[var(--hover-glow)] hover:-translate-y-1";
  const visibilityClasses = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <div
      ref={cardRef}
      className={`${baseClasses} ${visibilityClasses}`}
      style={{ transitionDelay: animationDelay }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-blue-400" aria-hidden="true">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-400">{children}</p>
    </div>
  );
};
const FeatureCard = memo(FeatureCardComponent);

const HeroAnimation = () => (
  <div className="hero-background" aria-hidden="true">
    <div className="grid-background"></div>
    <div className="hero-glow"></div>
  </div>
);

const DevilLabs: React.FC = memo(() => {
  const labs = [
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: "E-Book Creator",
      description: "Generate beautiful e-books from simple text with AI.",
      link: "#",
    },
    {
      icon: <KeyboardIcon className="w-8 h-8" />,
      title: "Typing Test",
      description: "Test your typing speed and accuracy with our sleek tool.",
      link: "#",
    },
    {
      icon: <ImagePlusIcon className="w-8 h-8" />,
      title: "AI Image Gen",
      description:
        "Create stunning visuals from text prompts with generative AI.",
      link: "#",
    },
    {
      icon: <TestTubeIcon className="w-8 h-8" />,
      title: "More Tools",
      description: "Explore our full suite of AI and utility applications.",
      link: "#",
    },
  ];

  return (
    <div
      id="labs"
      className="max-w-6xl 2xl:max-w-7xl mx-auto w-full mt-10 py-10"
    >
      <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
        From the Devil Labs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {labs.map((lab, index) => (
          <a
            href={lab.link}
            key={index}
            className="devil-lab-card"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="text-blue-400 mb-4">{lab.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {lab.title}
            </h3>
            <p className="text-gray-400 text-sm">{lab.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
});

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Get total users count
    const userCount = analyticsService.getTotalUsersCount();
    setTotalUsers(userCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const aurora = document.querySelector(
        ".aurora-background"
      ) as HTMLElement;
      if (aurora) {
        // Move the background up at half the speed of the scroll, creating a parallax effect
        aurora.style.transform = `translateY(${window.scrollY * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove the event listener and reset the transform when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
      const aurora = document.querySelector(
        ".aurora-background"
      ) as HTMLElement;
      if (aurora) {
        aurora.style.transform = "translateY(0px)";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans flex flex-col overflow-x-hidden">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center text-center p-6">
        <div
          className="w-full relative flex items-center justify-center"
          style={{ height: "calc(100vh - 120px)", minHeight: "600px" }}
        >
          <HeroAnimation />
          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Global Financial Strategy.
              <br />
              Powered by AI.
            </h1>
            <p
              className="text-lg sm:text-xl xl:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Your personal financial analyst is here. Get instant, data-driven
              insights on global markets, investment strategies, and competitive
              landscapes to make smarter business and financial decisions.
            </p>
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                onClick={onStartChat}
                className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-500 transition-all text-lg shadow-lg shadow-blue-600/30 transform hover:scale-105"
              >
                Create Your Profile & Start
              </button>
            </div>

            {/* User Analytics Display */}
            <div
              className="animate-fade-in-up mt-8"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live Platform</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <BotIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">
                    <span className="text-white font-semibold">
                      {totalUsers.toLocaleString()}
                    </span>{" "}
                    users joined
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="features"
          className="max-w-6xl 2xl:max-w-7xl mx-auto w-full mt-20 py-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            An Analyst, Not Just an Assistant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<SparklesIcon />}
              title="Personalized Strategy"
              animationDelay="0ms"
            >
              Receive guidance tailored to your financial profile. From
              tax-saving strategies under 80C to comparing mutual funds, get
              advice that fits you.
            </FeatureCard>
            <FeatureCard
              icon={<AnalysisIcon className="w-8 h-8" />}
              title="Instant Data Visualization"
              animationDelay="200ms"
            >
              Don't just read numbers. See them. Instantly generate charts to
              understand market trends, portfolio performance, or expense
              breakdowns.
            </FeatureCard>
            <FeatureCard
              icon={<DocumentScanIcon className="w-8 h-8" />}
              title="Analyze Financial Reports"
              animationDelay="400ms"
            >
              Upload an image of a report, a screenshot of a stock, or a bank
              statement, and get an instant AI-powered analysis and summary.
            </FeatureCard>
            <FeatureCard
              icon={<ShieldIcon className="w-8 h-8" />}
              title="Fraud & Scam Awareness"
              animationDelay="600ms"
            >
              Stay protected in the digital age. Learn to identify the latest
              UPI scams, phishing attempts, and fraudulent loan apps in India.
            </FeatureCard>
          </div>
        </div>

        <div
          id="how-it-works"
          className="max-w-6xl 2xl:max-w-7xl mx-auto w-full mt-10 py-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            Simple Steps to Financial Clarity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<QuestionIcon className="w-8 h-8" />}
              title="1. Ask Your Question"
              animationDelay="0ms"
            >
              Simply type, speak, or upload a query you have, from "How can I
              save tax?" to "Explain this report."
            </FeatureCard>
            <FeatureCard
              icon={<AnalysisIcon className="w-8 h-8" />}
              title="2. Get Instant Analysis"
              animationDelay="200ms"
            >
              Our AI processes your question in real-time and provides a clear,
              data-driven answer, often with helpful charts.
            </FeatureCard>
            <FeatureCard
              icon={<ActionIcon className="w-8 h-8" />}
              title="3. Take Informed Action"
              animationDelay="400ms"
            >
              Use the insights to make smarter financial decisions, backed by
              reliable information and analysis.
            </FeatureCard>
          </div>
        </div>

        <div
          id="tech"
          className="max-w-6xl 2xl:max-w-7xl mx-auto w-full mt-10 py-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            Built on a Foundation of Trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BrainCircuitIcon />}
              title="Advanced Reasoning Engine"
              animationDelay="0ms"
            >
              Powered by <code>gemini-2.5-flash</code> for fast, grounded
              responses, and <code>gemini-2.5-pro</code> for complex financial
              analysis and charts.
            </FeatureCard>
            <FeatureCard
              icon={<WaveformIcon />}
              title="Natural Voice Interaction"
              animationDelay="200ms"
            >
              Engage in conversation with crystal-clear voice synthesis from{" "}
              <code>gemini-2.5-flash-preview-tts</code> for hands-free insights.
            </FeatureCard>
            <FeatureCard
              icon={<BotIcon />}
              title="Robust & Secure"
              animationDelay="400ms"
            >
              Built on the official <code>@google/genai</code> SDK, ensuring a
              reliable and secure connection to Google's powerful AI models.
            </FeatureCard>
          </div>
        </div>

        <CommunityHub />

        <DevilLabs />

        <div id="testimonial" className="max-w-3xl mx-auto w-full mt-10 py-10">
          <div className="testimonial-card">
            <QuoteIcon className="testimonial-quote-icon" aria-hidden="true" />
            <p className="testimonial-text">
              "This tool is a game-changer. It simplified my tax planning and
              helped me understand where my money was going. The charts make
              everything so easy to grasp. Highly recommended!"
            </p>
            <p className="testimonial-author">- Priya S., Bengaluru</p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};
