import React, { useState, Suspense, lazy } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoadingIcon } from "./components/icons";
import { analyticsService } from "./services/analyticsService";
import { UserProfile } from "./types";

const LoginPage = lazy(() =>
  import("./components/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);
const HomePage = lazy(() =>
  import("./components/HomePage").then((module) => ({
    default: module.HomePage,
  }))
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-[var(--main-bg)]">
    <LoadingIcon className="w-10 h-10 text-blue-500" />
  </div>
);

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Restore user session from localStorage on app start
    try {
      const savedUser = localStorage.getItem("devilfintech-current-user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setShowLanding(false); // If user exists, skip landing page
        return user;
      }
    } catch (error) {
      console.error("Failed to restore user session:", error);
    }
    return null;
  });

  // Save current user to localStorage whenever it changes
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "devilfintech-current-user",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("devilfintech-current-user");
    }
  }, [currentUser]);

  const handleLogin = (username: string, avatarId: string) => {
    const trimmedUsername = username.trim();
    if (trimmedUsername && avatarId) {
      // --- Analytics Tracking & Profile Creation ---
      const userProfile = analyticsService.loginUser(trimmedUsername, avatarId);
      setCurrentUser(userProfile);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLanding(true); // Return to landing page after logout
  };

  const renderContent = () => {
    if (showLanding) {
      return <LandingPage onStartChat={() => setShowLanding(false)} />;
    }
    if (!currentUser) {
      return <LoginPage onLogin={handleLogin} />;
    }
    return <HomePage user={currentUser} onLogout={handleLogout} />;
  };

  return (
    <main
      className="h-screen w-screen font-sans"
      style={{ isolation: "isolate" }}
    >
      <div className="main-container">
        <Suspense fallback={<LoadingFallback />}>{renderContent()}</Suspense>
      </div>
    </main>
  );
}

export default App;
