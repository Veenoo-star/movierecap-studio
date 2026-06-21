import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Film, Layout, AlertCircle, HelpCircle, BookOpen } from "lucide-react";
import Navigation from "./components/Navigation";
import RecapStudio from "./components/RecapStudio";
import CommunityReviews from "./components/CommunityReviews";
import AuthCheckoutModal from "./components/AuthCheckoutModal";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>("Free Preview");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"workspace" | "reviews">("workspace");

  // Synchronize CSS class for Light / Dark Mode Toggle
  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.remove("light-theme");
      // Add custom dark classes
      body.style.backgroundColor = "#0a0a0b"; // Elegant Dark base background
      body.style.color = "#e0e0e0";
    } else {
      body.classList.add("light-theme");
      body.style.backgroundColor = "#f8fafc"; // Slate 50
      body.style.color = "#0f172a"; // Slate 900
    }
  }, [isDarkMode]);

  const handleLogin = (email: string, plan: string) => {
    setUser({ email });
    setUserPlan(plan === "pro" ? "Pro Creator" : "Studio Agency");
  };

  const handleUpgradePlan = (newPlan: string) => {
    setUserPlan(newPlan);
  };

  const handleLogout = () => {
    setUser(null);
    setUserPlan("Free Preview");
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-[#0a0a0b] text-[#e0e0e0]" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Top Navigation */}
      <Navigation
        user={user}
        userPlan={userPlan}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Studio Console Content area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* Upper promotional informational banner details */}
        <div className={`relative p-5 md:p-6 rounded-2xl border overflow-hidden ${
          isDarkMode 
            ? "bg-gradient-to-r from-indigo-600/10 via-indigo-650/5 to-transparent border-indigo-500/15" 
            : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
              isDarkMode 
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" 
                : "bg-slate-200/50 text-slate-700 border-slate-300"
            }`}>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Next-Gen Video Production
            </div>
            <h2 className={`text-xl md:text-2xl font-bold font-display tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              AI-Powered Movie Recap Workspace
            </h2>
            <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Deploy our automated script builder paired with direct social media transition templates and automated Burmese overlay translators. Perfect for creators publishing to YouTube Shorts, TikTok, and Instagram Reels.
            </p>
          </div>
        </div>

        {/* Tab Selection controller bar */}
        <div className={`flex border-b ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
          <button
            onClick={() => setActiveTab("workspace")}
            className={`px-5 py-3 text-xs font-semibold font-mono tracking-wider uppercase border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "workspace"
                ? isDarkMode ? "border-indigo-500 text-white" : "border-indigo-650 text-indigo-600"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-4 h-4" /> Studio Workstation
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-3 text-xs font-semibold font-mono tracking-wider uppercase border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "reviews"
                ? isDarkMode ? "border-indigo-500 text-white" : "border-indigo-650 text-indigo-600"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Community Reviews Feed
          </button>
        </div>

        {/* Tab Routing panels */}
        {activeTab === "workspace" ? (
          <RecapStudio user={user} onOpenAuth={() => setIsAuthModalOpen(true)} isDarkMode={isDarkMode} />
        ) : (
          <CommunityReviews isDarkMode={isDarkMode} />
        )}

      </main>

      {/* Footer System Credits */}
      <footer className={`py-6 border-t text-center text-[10px] space-y-1 ${
        isDarkMode 
          ? "border-white/5 bg-[#121214]/40 text-slate-500" 
          : "border-slate-200 bg-slate-100 text-slate-600"
      }`}>
        <p>© 2026 CineFlow AI Studio. Built with Google Gemini & Express.js Sandbox.</p>
        <p className="font-mono text-[9px] text-slate-500/80">Secure API and Firestore ABAC Security Rules deployed.</p>
      </footer>

      {/* Authentication and Checkout Payment modal drawer */}
      <AuthCheckoutModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onUpgradePlan={handleUpgradePlan}
      />

    </div>
  );
}
