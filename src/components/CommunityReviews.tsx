import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, Plus, Film, User, MessageSquare, AlertCircle } from "lucide-react";
import { CommunityReview } from "../types";

interface CommunityReviewsProps {
  isDarkMode?: boolean;
}

export default function CommunityReviews({ isDarkMode = true }: CommunityReviewsProps) {
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [movieName, setMovieName] = useState("");
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  
  const [isLikingId, setIsLikingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reviews initially
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieName || !username || !content) {
      setStatusMessage("Please fill in all details before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieName, username, rating, content })
      });

      if (response.ok) {
        const newRev = await response.json();
        setReviews(prev => [newRev, ...prev]);
        setMovieName("");
        setUsername("");
        setContent("");
        setRating(5);
        setStatusMessage("Review posted successfully to the community timeline!");
        setTimeout(() => setStatusMessage(""), 4000);
      } else {
        setStatusMessage("Error submitting review. Check backend response.");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Connection failed. Try again.");
    }
  };

  const handleLikeReview = async (id: string) => {
    setIsLikingId(id);
    try {
      const response = await fetch(`/api/reviews/${id}/like`, { method: "POST" });
      if (response.ok) {
        const updated = await response.json();
        setReviews(prev => prev.map(r => r.id === id ? updated : r));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLikingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left side: Add New Review Form */}
      <div className={`p-6 rounded-2xl shadow-lg space-y-4 border transition-all ${
        isDarkMode 
          ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
          : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div>
          <h3 className={`text-lg font-bold font-display flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            <Plus className="w-5 h-5 text-indigo-400" /> Write Community Review
          </h3>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Share how you compiled and subtitled your movie script with our tools.
          </p>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Movie Title</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Inception, Joker"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs focus:outline-none transition rounded-lg font-sans border ${
                  isDarkMode 
                    ? "bg-black/20 border-white/5 text-slate-100 placeholder-slate-600 focus:border-indigo-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600"
                }`}
              />
              <Film className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Your Name / Creator Handle</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. CinemaGuru"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs focus:outline-none transition rounded-lg font-sans border ${
                  isDarkMode 
                    ? "bg-black/20 border-white/5 text-slate-100 placeholder-slate-600 focus:border-indigo-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600"
                }`}
              />
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Star Rating</label>
            <div className={`flex gap-1.5 items-center p-2 rounded-lg border transition ${
              isDarkMode ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"
            }`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                >
                  <Star className={`w-5 h-5 ${rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                </button>
              ))}
              <span className={`text-xs ml-auto font-mono ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>{rating} / 5</span>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Review Description & Tips</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your script choices, automated Burmese translations accuracy, or timeline transition flow..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-3 py-2 text-xs focus:outline-none transition rounded-lg resize-none font-sans border ${
                isDarkMode 
                  ? "bg-black/20 border-white/5 text-slate-100 focus:border-indigo-500" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-650"
              }`}
            />
          </div>

          {statusMessage && (
            <div className={`flex gap-2 p-2.5 rounded text-xs border ${
              isDarkMode 
                ? "bg-indigo-950/20 text-indigo-400 border-indigo-900/40" 
                : "bg-indigo-50 text-indigo-800 border-indigo-200"
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs font-display rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md"
          >
            <MessageSquare className="w-4 h-4" /> Share with Creators
          </button>
        </form>
      </div>

      {/* Right side: Reviews Timeline */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`text-lg font-bold font-display ${isDarkMode ? "text-white" : "text-slate-900"}`}>Live Community Feed</h3>
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
            isDarkMode ? "text-slate-400 bg-white/5 border-white/5" : "text-slate-600 bg-slate-100 border-slate-200"
          }`}>
            {reviews.length} total reviews
          </span>
        </div>

        {isLoading ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl space-y-3 border ${
            isDarkMode ? "bg-[#121214] border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-600"
          }`}>
            <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
              isDarkMode ? "border-indigo-500/20 border-t-indigo-500" : "border-indigo-250 border-t-indigo-600"
            }`}></div>
            <p className="text-xs font-mono">Synchronizing timelines...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${
            isDarkMode ? "bg-[#121214] border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-600"
          }`}>
            No active reviews. Be the first to share your script recap!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border transition-all shadow-md space-y-3 hover:translate-y-[-1px] duration-200 ${
                  isDarkMode 
                    ? "bg-[#121214] border-white/5 text-[#e0e0e0] hover:border-indigo-500/20" 
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-350"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{rev.movieName}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDarkMode ? "text-slate-400 bg-black/20 border-white/5" : "text-slate-600 bg-slate-50 border-slate-200"
                      }`}>
                        RECAP REVIEW
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>@{rev.username}</span>
                      <span>•</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{rev.content}</p>

                <div className={`flex justify-between items-center pt-2 border-t ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      isDarkMode ? "text-[#10b981] bg-emerald-950/20 border-emerald-900/30" : "text-emerald-700 bg-emerald-50 border-emerald-200"
                    }`}>
                      Secured API
                    </span>
                  </div>

                  <button
                    onClick={() => handleLikeReview(rev.id)}
                    disabled={isLikingId === rev.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-xs cursor-pointer ${
                      isDarkMode 
                        ? "bg-black/20 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/80" 
                        : "bg-slate-50 border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLikingId === rev.id ? "animate-bounce" : ""}`} />
                    <span className="font-mono">{rev.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
