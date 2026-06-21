import React from "react";
import { Film, LogOut, Sun, Moon, Zap } from "lucide-react";

interface NavigationProps {
  user: any;
  userPlan: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navigation({
  user,
  userPlan,
  isDarkMode,
  onToggleTheme,
  onOpenAuth,
  onLogout,
}: NavigationProps) {
  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-all border-b ${
      isDarkMode 
        ? "bg-[#121214]/90 border-white/5 text-[#e0e0e0]" 
        : "bg-white/90 border-slate-200 text-slate-800"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold font-display text-white tracking-tight leading-none bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              CineFlow AI
            </h1>
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-semibold uppercase">
              AI scripts & subtitling suite
            </span>
          </div>
        </div>

        {/* Right Side: Interactive Workspace Indicators */}
        <div className="flex items-center gap-4">
          
          {/* Active plan badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600/10 text-indigo-400 border border-indigo-500/25">
              <Zap className="w-3.5 h-3.5" />
              <span>Workspace: {userPlan}</span>
            </div>
          )}

          {/* Theme custom toggler */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isDarkMode 
                ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950"
            }`}
            title="Toggle Light / Dark theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Authorization status control */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className={`text-xs font-semibold leading-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {user.email.split("@")[0]}
                </p>
                <p className="text-[9px] font-mono text-slate-500">Collaborator Account</p>
              </div>
              <button
                onClick={onLogout}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition text-xs font-medium cursor-pointer ${
                  isDarkMode 
                    ? "border-white/5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white" 
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 font-medium text-xs font-display rounded-lg cursor-pointer transition shadow-sm"
            >
              Sign In / Upgrade Plan
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
