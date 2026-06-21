import React, { useState } from "react";
import { X, CreditCard, Sparkles, Check, Flame, Award, ShieldCheck, Mail, Github, Chrome } from "lucide-react";

interface AuthCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: (email: string, plan: string) => void;
  onUpgradePlan: (newPlan: string) => void;
}

export default function AuthCheckoutModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onUpgradePlan,
}: AuthCheckoutModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("pro");

  // Credit Card mock inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: "free",
      name: "Free Preview",
      price: "$0",
      description: "Basic features for movie recap hobbyists.",
      features: [
        "Interactive Video Timeline Editor",
        "Generate 1 AI Script / day",
        "Standard Transition Templates",
        "Landscape 16:9 Aspect Ratio Only"
      ],
      badge: "Hobbyist"
    },
    {
      id: "pro",
      name: "Pro Creator",
      price: "$19/mo",
      description: "Advanced AI-driven scripts and automated translations.",
      features: [
        "Unlimited Auto-Subtitles in Burmese",
        "Custom Transition Templates (Whip-pan, zoom, etc.)",
        "Direct export aspect ratios (9:16, 1:1, 16:9)",
        "Priority Gemini-3.5 Script Generator"
      ],
      badge: "Popular",
      popular: true
    },
    {
      id: "studio",
      name: "Studio Agency",
      price: "$49/mo",
      description: "For agencies and multi-user video creation studios.",
      features: [
        "Real-time Multilateral Collaboration",
        "Instant Direct Export to social channels",
        "Custom branding watermark removals",
        "Dedicated cloud storage for drafts & comments"
      ],
      badge: "Team Choice"
    }
  ];

  const handleSocialMockLogin = (provider: string) => {
    let mockEmail = "";
    if (provider === "Google") mockEmail = "jhfh4735@gmail.com";
    else if (provider === "GitHub") mockEmail = "creator-git@recapeer.org";
    else mockEmail = "film-innovator@movieai.com";

    onLogin(mockEmail, "pro");
    onClose();
  };

  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    onLogin(emailInput, "pro");
    onClose();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) {
      setPaymentError("Please fill in all security credential inputs.");
      return;
    }
    setPaymentError("");
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        const targetPlan = plans.find(p => p.id === selectedPlanId);
        onUpgradePlan(targetPlan?.name || "Pro Creator");
        setPaymentSuccess(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div id="auth-modal-card" className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 md:p-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Not Logged In View - Sign in / Register */}
        {!user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side: Premium Perks Intro */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Movie Recap Studio Auth
              </div>
              
              <h2 className="text-3xl font-bold font-display tracking-tight text-white leading-tight">
                Unlock Cinematic Recap Tools
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                Join our premium community to generate stunning movie scripts instantly via Gemini AI, auto-sync Burmese subtitles, and customize beautiful transitions.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Automated Burmese subtitles syncing context-by-context</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Sophisticated timeline with high-fidelity transitions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Real-time collab, chat threads and social exporting</span>
                </div>
              </div>
            </div>

            {/* Right side: Social & Email Authorization Panel */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">
                  {isRegistering ? "Create your Account" : "Welcome Back"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access your synchronized recap projects in seconds.
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialMockLogin("Google")}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white text-xs font-medium cursor-pointer transition"
                >
                  <Chrome className="w-4 h-4 text-red-400" /> Google Login
                </button>
                <button
                  onClick={() => handleSocialMockLogin("GitHub")}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white text-xs font-medium cursor-pointer transition"
                >
                  <Github className="w-4 h-4 text-slate-200" /> GitHub Auth
                </button>
              </div>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <span className="relative px-3 bg-slate-950 text-slate-500 text-[10px] uppercase font-mono tracking-widest">
                  Or use standard email
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aung Myo"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-violet-500 font-sans text-xs"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-violet-500 font-sans text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs font-display flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Mail className="w-4 h-4" />
                  {isRegistering ? "Sign Up with Email" : "Continue to Editor"}
                </button>
              </form>

              {/* Toggle Footer */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-violet-400 hover:underline hover:text-violet-300"
                >
                  {isRegistering ? "Already have an account? Sign In" : "Need a professional creator account? Sign Up"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Premium Plans & Checkout Form */
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-3.5 h-3.5" /> Upgrade Your Workspace Tier
              </div>
              <h2 className="text-3xl font-bold font-display text-white">Choose Your Subscription Model</h2>
              <p className="text-sm text-slate-400">
                Scale your production from simple scripts to full collaborative, direct-social video creations.
              </p>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-900 border-violet-500 ring-2 ring-violet-500/30"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-600 text-white tracking-wider">
                        Popular Choice
                      </span>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-white">{plan.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-850 px-2 py-0.5 rounded">
                          {plan.badge}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">{plan.price}</span>
                        <span className="text-[10px] text-slate-500">/ lifetime sync</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">{plan.description}</p>
                      
                      <div className="pt-3 border-t border-slate-800 space-y-2.5">
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment form segment */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 max-w-lg mx-auto">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-violet-400" />
                Secure Payment Authorization Gate
              </h3>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Credit Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-violet-500 font-mono text-xs text-white"
                    />
                    <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Expiration</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-violet-500 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">CVV / CVN</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-violet-500 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {paymentError && (
                  <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
                    {paymentError}
                  </p>
                )}

                {paymentSuccess ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs">
                    <ShieldCheck className="w-5 h-5 animate-bounce" />
                    <span>Authorization Secured! Elevating subscriber status...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-2.5 rounded-lg bg-violet-650 hover:bg-violet-600 text-white font-medium text-xs font-display flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-55"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Contacting Stripe network...
                      </>
                    ) : (
                      <>
                        Upgrade Workspace Active Tier
                      </>
                    )}
                  </button>
                )}

                <p className="text-[10px] text-center text-slate-500">
                  By clicking, your mock billing address is authenticated. Standard sandbox rules apply.
                </p>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
