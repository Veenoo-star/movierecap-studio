import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Play, Pause, FastForward, Rewind, Scissors, Layers, Languages, 
  Share2, ArrowRight, Download, Users, Send, AlertTriangle, CheckCircle, 
  FileText, Sliders, Music, Film, Trash2, Plus, Monitor, HelpCircle 
} from "lucide-react";
import { Scene, ScriptProject, Collaborator, LiveEditMessage, ChatComment } from "../types";

interface RecapStudioProps {
  user: any;
  onOpenAuth: () => void;
  isDarkMode?: boolean;
}

export default function RecapStudio({ user, onOpenAuth, isDarkMode = true }: RecapStudioProps) {
  // Preset Default Project
  const [project, setProject] = useState<ScriptProject>({
    id: "proj-default",
    title: "Interstellar - Stellar Recap",
    movieName: "Interstellar",
    summary: "Cooper and his team travel through a dangerous wormhole in search of a new home for humanity, facing temporal shifts and gravity anomalies.",
    aspectRatio: "16:9",
    transitionTemplate: "fade",
    createdAt: new Date().toISOString(),
    scenes: [
      {
        id: "scene-1",
        title: "The Dying Earth & Dust Storm",
        duration: 6,
        narration: "Our story begins on a dying Earth, where massive crop failures and dust storms are threatening the human race with immediate extinction.",
        burmeseSubtitles: "ကျွန်ုပ်တို့၏ဇာတ်လမ်းသည် သီးနှံပျက်စီးမှုနှင့် ဖုန်မှုန့်မုန်တိုင်းများကြောင့် လူသားမျိုးနွယ် မျိုးသုဉ်းပျောက်ကွယ်ရန် ခြိမ်းခြောက်နေသည့် ပျက်စီးလုနီးပါး ကမ္ဘာမြေမှ စတင်ခဲ့သည်။",
        sceneType: "Intro",
        mediaQuery: "retro futuristic farm dust storm orange sunset rustic house volumetric lighting"
      },
      {
        id: "scene-2",
        title: "Entering the Wormhole",
        duration: 8,
        narration: "Against all odds, Cooper plunges into the newly discovered wormhole near Saturn. The ship shakes violently, warping the fabric of space and time.",
        burmeseSubtitles: "အခက်အခဲများကြားမှ Cooper သည် စနေဂြိုဟ်အနီးရှိ အသစ်တွေ့ရှိထားသော တီကောင်တွင်း (wormhole) ထဲသို့ ခုန်ဆင်းသွားသည်။ အာကာသသင်္ဘောသည် ပြင်းထန်စွာ တုန်ခါသွားသည်။",
        sceneType: "Action",
        mediaQuery: "ship warping into swirling wormhole nebula cosmos black hole high-contrast"
      },
      {
        id: "scene-3",
        title: "Miller's Giant Tidal Waves",
        duration: 10,
        narration: "On the first water planet, every single hour equals seven years on Earth. Suddenly, mountains on the horizon reveal themselves as colossal tidal waves.",
        burmeseSubtitles: "ပထမဆုံး ရေကမ္ဘာပေါ်တွင် တစ်နာရီသည် ကမ္ဘာပေါ်ရှိ ခုနစ်နှစ်နှင့် ညီမျှသည်။ ရုတ်တရက် တောင်တန်းကြီးများအဖြစ် ထင်ယောင်ထင်မှားဖြစ်စေသော ဧရာမဒီရေလှိုင်းကြီးများ ပေါ်ပေါက်လာသည်။",
        sceneType: "Climax",
        mediaQuery: "astronaut on water planet giant mountain wave looming sci-fi cinematic"
      },
      {
        id: "scene-4",
        title: "The Tesseract of Time",
        duration: 6,
        narration: "Inside the black hole, Cooper triggers a multi-dimensional tesseract, communicating with his daughter across time to save the remnants of humanity.",
        burmeseSubtitles: "တွင်းနက်ကြီးအတွင်း Cooper သည် ဘက်ပေါင်းစုံပါဝင်သော tesseract ကို စတင်အသုံးပြုကာ လူသားမျိုးနွယ်ကို ကယ်တင်ရန် သမီးဖြစ်သူနှင့် အချိန်ကိုကျော်ဖြတ် ပြောဆိုခဲ့သည်။",
        sceneType: "Resolution",
        mediaQuery: "gargantua black hole gravity event horizon grid space dimension"
      }
    ]
  });

  // Editor form inputs
  const [movieInput, setMovieInput] = useState("");
  const [toneInput, setToneInput] = useState("dramatic and engaging");
  const [themeInput, setThemeInput] = useState("full movie summary with critical twists");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState("");

  // Timeline & Video Player state
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineSecs, setTimelineSecs] = useState(0);
  const [playerRatio, setPlayerRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [transitionTemplate, setTransitionTemplate] = useState<"none" | "fade" | "dissolve" | "slide" | "zoom" | "whip_pan">("fade");

  // Subtitle custom edit state
  const [editingSubText, setEditingSubText] = useState("");
  const [editingNarrationText, setEditingNarrationText] = useState("");

  // Active collaborators simulation
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: "col-1", name: "Aung Myo (Subtitles)", avatarColor: "bg-teal-500", activeSceneId: "scene-1", status: "typing" },
    { id: "col-2", name: "Devin (Video FX)", avatarColor: "bg-rose-500", activeSceneId: "scene-3", status: "choosing_transition" },
    { id: "col-3", name: "Chloe (Writer)", avatarColor: "bg-blue-500", activeSceneId: "scene-2", status: "idle" }
  ]);

  const [colCursorScene, setColCursorScene] = useState<number>(0);
  const [colCursorOffset, setColCursorOffset] = useState({ top: 38, left: 160 });

  const [colLogs, setColLogs] = useState<LiveEditMessage[]>([
    { collaboratorId: "col-1", collaboratorName: "Aung Myo", action: "translated Intro scene to Burmese subtitles successfully", timestamp: "5m ago" },
    { collaboratorId: "col-2", collaboratorName: "Devin", action: "adjusted Timeline Climax transition to 'Whip-Pan'", timestamp: "2m ago" }
  ]);

  // Collab Chat feedback stream
  const [chatComments, setChatComments] = useState<ChatComment[]>([
    { id: "c-1", username: "Chloe", avatarColor: "bg-blue-500", message: "Hey teams! Let's ensure the Burmese subtitles on the Miller Planet water scene match the exact translation of temporal dilation.", timestamp: "3m ago" },
    { id: "c-2", username: "Aung Myo", avatarColor: "bg-teal-500", message: "Sure, updated it to 'တစ်နာရီသည် ခုနစ်နှစ်နှင့် ညီမျှသည်။' - feels clean and high accuracy.", timestamp: "1m ago" }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSteps, setExportSteps] = useState<string[]>([]);
  const [activeExportStepIdx, setActiveExportStepIdx] = useState(0);
  const [exportResult, setExportResult] = useState<{ downloadUrl: string; steps: string[] } | null>(null);
  const [selectedSocialTag, setSelectedSocialTag] = useState<string | null>(null);
  const [exportUploadedMessage, setExportUploadedMessage] = useState("");

  // Timeline ticks and loops
  const playbackTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Synchronize initial input boxes to current loaded scene
    if (project.scenes[activeSceneIndex]) {
      setEditingSubText(project.scenes[activeSceneIndex].burmeseSubtitles);
      setEditingNarrationText(project.scenes[activeSceneIndex].narration);
    }
  }, [activeSceneIndex, project]);

  // Handle auto timeline ticks during Play/Pause
  useEffect(() => {
    if (isPlaying) {
      playbackTimer.current = setInterval(() => {
        setTimelineSecs((prev) => {
          const currentScene = project.scenes[activeSceneIndex];
          if (!currentScene) return 0;
          
          if (prev >= currentScene.duration) {
            // Move to next scene
            if (activeSceneIndex < project.scenes.length - 1) {
              setActiveSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              // Loop back or pause
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    }
    return () => {
      if (playbackTimer.current) clearInterval(playbackTimer.current);
    };
  }, [isPlaying, activeSceneIndex, project]);

  // Simulate active collaborator mouse movements & typing actions
  useEffect(() => {
    const colInterval = setInterval(() => {
      // Rotate active cursor positions
      setColCursorOffset({
        top: Math.floor(Math.random() * 80) + 10,
        left: Math.floor(Math.random() * 250) + 50
      });

      // Randomly change a collaborator status
      setCollaborators(prev => prev.map(c => {
        if (Math.random() > 0.7) {
          const statuses: ("idle" | "typing" | "choosing_transition" | "playing_timeline")[] = ["idle", "typing", "choosing_transition", "playing_timeline"];
          return {
            ...c,
            status: statuses[Math.floor(Math.random() * statuses.length)]
          };
        }
        return c;
      }));

      // Randomly add a log entry representing real-time synchronization
      if (Math.random() > 0.8) {
        const index = Math.floor(Math.random() * collaborators.length);
        const col = collaborators[index];
        const actions = [
          "re-ordered video track priority on scene layout",
          "synchronized audio volume for clear Burmese narration",
          "checked transition alignment with timeline timeline bounds",
          "opened the script editor panel",
          "requested a fresh AI model translation recap"
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        setColLogs(prev => [
          {
            collaboratorId: col.id,
            collaboratorName: col.name.split(" ")[0],
            action: randomAction,
            timestamp: "Just now"
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 4500);

    return () => clearInterval(colInterval);
  }, [collaborators]);

  // Script Generator service caller
  const handleGenerateScriptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieInput) return;

    setIsGenerating(true);
    setGeneratorError("");

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: movieInput,
          focusTheme: themeInput,
          customTone: toneInput
        })
      });

      if (!response.ok) {
        throw new Error("Unable to contacts script generator. Please check credentials.");
      }

      const generatedProject = await response.json();
      
      setProject({
        id: `proj-${Date.now()}`,
        title: generatedProject.title || `${movieInput} - Script Recap`,
        movieName: movieInput,
        summary: generatedProject.summary || `Cinematic script recap of ${movieInput}`,
        scenes: generatedProject.scenes,
        aspectRatio: playerRatio,
        transitionTemplate: transitionTemplate,
        createdAt: new Date().toISOString()
      });

      setActiveSceneIndex(0);
      setTimelineSecs(0);
      
      // Update logs
      setColLogs(prev => [
        {
          collaboratorId: "ai-engine",
          collaboratorName: "Gemini Subtitles AI",
          action: `Successfully generated fully customizable 4-scene script with automated Burmese subtitling parameters for ${movieInput}.`,
          timestamp: "Just now"
        },
        ...prev
      ]);

    } catch (err: any) {
      setGeneratorError("Failed to build script. Using secure fallback recap data is recommended.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Timeline updates
  const handleSaveSubtitlesChanges = () => {
    const updatedScenes = [...project.scenes];
    updatedScenes[activeSceneIndex] = {
      ...updatedScenes[activeSceneIndex],
      burmeseSubtitles: editingSubText,
      narration: editingNarrationText
    };
    setProject({ ...project, scenes: updatedScenes });

    // Collab notification log
    setColLogs(prev => [
      {
        collaboratorId: "user-active",
        collaboratorName: "You",
        action: `updated narrative and Burmese translation details for Scene ${activeSceneIndex + 1}`,
        timestamp: "Just now"
      },
      ...prev
    ]);
  };

  // Export video simulation
  const handleInitiateExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportSteps([]);
    setExportResult(null);
    setSelectedSocialTag(null);
    setExportUploadedMessage("");

    try {
      const response = await fetch("/api/export-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          aspectRatio: playerRatio,
          format: "mp4",
          hasSubtitles: true,
          transitionTemplate: transitionTemplate
        })
      });

      if (response.ok) {
        const exportData = await response.json();
        setExportSteps(exportData.steps);
        
        let currentStep = 0;
        const progressInterval = setInterval(() => {
          setExportProgress((p) => {
            if (p >= 100) {
              clearInterval(progressInterval);
              setExportResult({
                downloadUrl: exportData.downloadUrl,
                steps: exportData.steps
              });
              return 100;
            }
            // Transition through logs
            const stepIncrement = Math.ceil(100 / exportData.steps.length);
            if (p > (currentStep + 1) * stepIncrement && currentStep < exportData.steps.length - 1) {
              currentStep += 1;
              setActiveExportStepIdx(currentStep);
            }
            return p + 4;
          });
        }, 150);

      }
    } catch (error) {
      console.error("Export failure:", error);
      setIsExporting(false);
    }
  };

  // Direct Social Upload simulator
  const handleSocialUploadPublish = (platform: string) => {
    setSelectedSocialTag(platform);
    setExportUploadedMessage(`Authorizing secure API connection callback to ${platform}...`);
    
    setTimeout(() => {
      setExportUploadedMessage(`Uploading compiled mp4 bundle in ratio ${playerRatio} directly to your ${platform} channel...`);
      setTimeout(() => {
        setExportUploadedMessage(`Success! Published recap [${project.title}] directly to ${platform}. Subtitles parsed.`);
      }, 2000);
    }, 1500);
  };

  // Add real-time comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;

    const newComment: ChatComment = {
      id: `comm-${Date.now()}`,
      username: user ? user.email.split("@")[0] : "GuestCreator",
      avatarColor: "bg-violet-500",
      message: newCommentText,
      timestamp: "Just now"
    };

    setChatComments(prev => [...prev, newComment]);
    setNewCommentText("");

    // Update Live edit activity feed
    setColLogs(prev => [
      {
        collaboratorId: "user",
        collaboratorName: user ? user.email.split("@")[0] : "Guest",
        action: "posted a collaborative script comment",
        timestamp: "Just now"
      },
      ...prev
    ]);
  };

  const getMediaImgUrl = (query: string) => {
    // Generate a beautiful, themed visual representation of the scene using Unsplash Source with referer policies
    const cleanQuery = encodeURIComponent(query.toLowerCase());
    return `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80&sig=${cleanQuery}`;
  };

  const activeScene = project.scenes[activeSceneIndex];

  return (
    <div className="space-y-6">
      
      {/* Upper header statistics overview */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl shadow-md border transition-all ${
        isDarkMode 
          ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
          : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 playhead-glow"></span>
            <h2 className={`text-sm font-bold font-mono tracking-tight uppercase ${isDarkMode ? "text-white" : "text-slate-950"}`}>{project.title}</h2>
          </div>
          <p className={`text-xs font-sans max-w-xl truncate ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{project.summary}</p>
        </div>

        {/* Real-time sync collaborators list widget */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {collaborators.map((col) => (
              <div 
                key={col.id} 
                title={`${col.name} - ${col.status}`}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 shadow-lg ${col.avatarColor} ${
                  isDarkMode ? "border-[#0a0a0b]" : "border-white"
                }`}
              >
                {col.name.slice(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-indigo-400 font-mono">Live Sync Connected</p>
            <p className="text-[10px] text-slate-500">CineFlow collaborative engine active</p>
          </div>
        </div>
      </div>

      {/* Core Studio Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* PART 1: Left block: AI Core Script Engine */}
        <div className={`xl:col-span-3 p-5 rounded-2xl shadow-lg space-y-5 transition-all border ${
          isDarkMode 
            ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
            : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div>
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase border ${
              isDarkMode 
                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/20" 
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}>
              <Sparkles className={`w-3 h-3 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> AI Script Generator
            </div>
            <h3 className={`text-lg font-bold font-display mt-1.5 ${isDarkMode ? "text-white" : "text-slate-905"}`}>Intelligent Builder</h3>
            <p className={`text-xs leading-relaxed font-sans mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Enter any movie title. Gemini AI will construct a 4-scene narrative script with synchronized Burmese subtitling layers.
            </p>
          </div>

          <form onSubmit={handleGenerateScriptSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Movie / Film Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Inception, Joker, Avatar"
                value={movieInput}
                onChange={(e) => setMovieInput(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-xs focus:ring-1 focus:outline-none transition ${
                  isDarkMode 
                    ? "bg-black/20 border border-white/5 text-slate-100 placeholder-slate-600 focus:ring-indigo-500" 
                    : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-600"
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Theme Focus</label>
              <input
                type="text"
                placeholder="e.g. plot twists, physics, tragic climax"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-xs focus:ring-1 focus:outline-none transition ${
                  isDarkMode 
                    ? "bg-black/20 border border-white/5 text-slate-100 placeholder-slate-600 focus:ring-indigo-500" 
                    : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-600"
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Recap Narrative Tone</label>
              <select
                value={toneInput}
                onChange={(e) => setToneInput(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 transition ${
                  isDarkMode 
                    ? "bg-[#0b0b0d] border border-white/5 text-slate-100 focus:ring-indigo-500" 
                    : "bg-slate-50 border border-slate-200 text-slate-900 focus:ring-indigo-600"
                }`}
              >
                <option value="dramatic and captivating" className={isDarkMode ? "bg-[#121214]" : ""}>Dramatic & Suspenseful</option>
                <option value="energetically hyped" className={isDarkMode ? "bg-[#121214]" : ""}>Hyper & Energetic (Good for TikTok)</option>
                <option value="educational and calm" className={isDarkMode ? "bg-[#121214]" : ""}>Educational & Detailed</option>
                <option value="humorous and analytical" className={isDarkMode ? "bg-[#121214]" : ""}>Humorous & Witty</option>
              </select>
            </div>

            {generatorError && (
              <div className="p-2 bg-amber-950/20 text-amber-400 text-[10px] rounded border border-amber-900/30 flex items-start gap-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{generatorError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs font-display flex items-center justify-center gap-1 rounded-lg cursor-pointer transition shadow-md`}
            >
              {isGenerating ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Consulting Gemini API...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  Generate AI Media Script
                </>
              )}
            </button>
          </form>

          {/* Structured Scene Breakdown display list */}
          <div className={`pt-4 border-t space-y-3 ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
            <h4 className={`text-xs font-bold font-mono tracking-widest uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Scenes Playlist</h4>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {project.scenes.map((scene, idx) => {
                const isActive = activeSceneIndex === idx;
                return (
                  <div
                    key={scene.id}
                    onClick={() => {
                      setActiveSceneIndex(idx);
                      setTimelineSecs(0);
                    }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                      isActive 
                        ? isDarkMode 
                          ? "bg-[#0a0a0b] border-indigo-500/80" 
                          : "bg-indigo-50 border-indigo-500" 
                        : isDarkMode
                          ? "bg-black/10 border-white/5 hover:border-white/10"
                          : "bg-slate-50/50 border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`font-mono font-semibold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>0{idx + 1}. SCENE</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                        isDarkMode 
                          ? "bg-[#121214] text-slate-400 border-white/5" 
                          : "bg-white text-slate-600 border-slate-200"
                      }`}>
                        {scene.duration}s
                      </span>
                    </div>
                    <p className={`text-xs font-semibold truncate mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{scene.title}</p>
                    <p className={`text-[10px] mt-1 uppercase font-mono ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{scene.sceneType}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PART 2: Center Block: Real-time Player Canvas & Video Timeline */}
        <div className="xl:col-span-6 space-y-6">
          
          {/* Mock Player Screen with Overlays */}
          <div className={`relative overflow-hidden rounded-2xl border shadow-2xl flex flex-col justify-between transition-all ${
            isDarkMode 
              ? "border-white/5 bg-[#0a0a0b]" 
              : "border-slate-200 bg-white"
          }`}>
            
            {/* Top player controller bar - Aspect Ratio switch */}
            <div className={`p-3 backdrop-blur-md border-b flex justify-between items-center z-10 transition-all ${
              isDarkMode 
                ? "bg-[#121214]/60 border-white/5" 
                : "bg-slate-50 border-slate-200"
            }`}>
              <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase flex items-center gap-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                Live Canvas Viewport
              </span>
              <div className="flex gap-2">
                {(["16:9", "9:16", "1:1"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setPlayerRatio(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      playerRatio === r 
                        ? "bg-indigo-600 text-white" 
                        : isDarkMode
                          ? "bg-white/5 text-gray-400 hover:text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-250 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Video preview viewport area */}
            <div className="relative flex items-center justify-center bg-slate-950 transition-all duration-300 min-h-[300px] max-h-[420px] overflow-hidden">
              
              {/* Aspect Ratio simulator wrapper */}
              <div 
                className={`relative shadow-inner overflow-hidden border flex items-center justify-center transition-all duration-300 ${
                  playerRatio === "16:9" 
                    ? "w-full aspect-video" 
                    : playerRatio === "9:16" 
                      ? "h-[340px] aspect-[9/16]" 
                      : "w-[300px] h-[300px]"
                } ${isDarkMode ? "border-white/5" : "border-slate-200"}`}
              >
                {/* Simulated Scene background visual (e.g. Unsplash with query) */}
                <img
                  src={getMediaImgUrl(activeScene?.mediaQuery || "space infinity")}
                  alt="Movie Recap Clip Frame"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 transition-all duration-500"
                />

                {/* Simulated transition effect overlay on scene change */}
                {isPlaying && timelineSecs === 1 && transitionTemplate !== "none" && (
                  <div className={`absolute inset-0 z-10 bg-slate-950 pointer-events-none transition-all duration-500 ${
                    transitionTemplate === "zoom" ? "scale-105 opacity-0 animate-pulse" : "opacity-0"
                  }`} />
                )}

                {/* Subtitles Overlay Layer parsed securely */}
                <div className="absolute inset-x-0 bottom-6 px-4 text-center z-10 pointer-events-none space-y-1 bg-black/40 py-2">
                  <p className="text-white font-sans text-xs md:text-sm font-semibold tracking-wide drop-shadow-md">
                    {activeScene?.narration}
                  </p>
                  <p className="text-amber-400 font-sans text-xs md:text-sm font-bold tracking-wide drop-shadow-md">
                    {activeScene?.burmeseSubtitles}
                  </p>
                </div>

                {/* Play progress state badge */}
                <span className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded border font-mono z-10 ${
                  isDarkMode 
                    ? "bg-[#121214]/80 text-indigo-400 border-white/5" 
                    : "bg-white/90 text-indigo-650 border-slate-200"
                }`}>
                  {activeScene?.sceneType}
                </span>

                {/* Watermark preview simulated */}
                <span className="absolute top-3 right-3 text-[9px] pointer-events-none text-slate-500 uppercase font-mono tracking-widest bg-black/20 px-1 py-0.5">
                  CineFlow PREVIEW
                </span>
              </div>
            </div>

            {/* Bottom playback player timeline controls */}
            <div className={`p-4 border-t space-y-3 transition-all ${
              isDarkMode 
                ? "bg-[#121214] border-white/5" 
                : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-mono text-indigo-400 font-bold">
                  Scene {activeSceneIndex + 1} of {project.scenes.length}
                </span>
                <span className="font-mono">
                  {timelineSecs}s / {activeScene?.duration || 0}s
                </span>
              </div>

              {/* Real Progress Bar slider drag simulator */}
              <div className={`relative h-2 rounded cursor-pointer overflow-hidden group ${
                isDarkMode ? "bg-[#0a0a0b]" : "bg-slate-200"
              }`}>
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((timelineSecs) / (activeScene?.duration || 1)) * 100}%` }}
                />
              </div>

              {/* Multimedia controllers */}
              <div className="flex justify-between items-center pt-2">
                
                {/* Fast playback control group */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (activeSceneIndex > 0) {
                        setActiveSceneIndex(activeSceneIndex - 1);
                        setTimelineSecs(0);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Previous Scene"
                  >
                    <Rewind className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition flex items-center justify-center gap-1.5 font-semibold text-xs cursor-pointer shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlaying ? "Pause Scene" : "Preview Scene"}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (activeSceneIndex < project.scenes.length - 1) {
                        setActiveSceneIndex(activeSceneIndex + 1);
                        setTimelineSecs(0);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Next Scene"
                  >
                    <FastForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Right timeline quick tool badge and indicator */}
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded border ${
                    isDarkMode 
                      ? "bg-[#0a0a0b] text-slate-400 border-white/5" 
                      : "bg-white text-slate-600 border-slate-200"
                  }`}>
                    Auto-Burmese subtitles ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline transitions editor & customizable export templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box A: Customizable Transition Selection */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode 
                ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
                : "bg-white border-slate-200 text-slate-800"
            }`}>
              <h4 className="text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> Choose Transition Template
              </h4>
              <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>
                Pick a template to stitch scenes seamlessly. Real CSS shaders simulate visual previews.
              </p>
              
              <div className="space-y-2 mt-3">
                {[
                  { id: "fade", label: "Fade (Dissolve)", desc: "Gentle crossfade opacity shift" },
                  { id: "slide", label: "Slide & Push", desc: "Slams horizontally between frames" },
                  { id: "zoom", label: "Zoom Burst", desc: "Dynamic scale and cinematic lens" },
                  { id: "whip_pan", label: "Whip-Pan Motion", desc: "Extreme motion-blur swipe whip blur" }
                ].map((trans) => (
                  <button
                    key={trans.id}
                    onClick={() => setTransitionTemplate(trans.id as any)}
                    className={`w-full p-2 text-left rounded-lg border text-xs flex justify-between items-center transition cursor-pointer ${
                      transitionTemplate === trans.id 
                        ? isDarkMode 
                          ? "bg-[#0a0a0b] border-indigo-500/80 text-white" 
                          : "bg-indigo-50 border-indigo-500 text-indigo-900"
                        : isDarkMode
                          ? "bg-black/10 border-white/5 text-slate-400 hover:border-white/10"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className={`font-semibold block ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{trans.label}</span>
                      <span className="text-[10px] text-slate-500">{trans.desc}</span>
                    </div>
                    {transitionTemplate === trans.id && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Box B: Secure Payment-Protected Direct Social Media Exporters */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode 
                ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
                : "bg-white border-slate-200 text-slate-800"
            }`}>
              <h4 className="text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-indigo-400" /> Unified Exporter & Publisher
              </h4>
              <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>
                Compile video into standard social media ratios with hard burned Burmese subtitle layers.
              </p>

              {/* Initiate video render trigger */}
              <div className="mt-3">
                {!isExporting ? (
                  <button
                    onClick={handleInitiateExport}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow transition animate-shimmer"
                  >
                    <Share2 className="w-4 h-4" /> Assemble & Initiate Video Render
                  </button>
                ) : (
                  /* Dynamic rendering progress tracker */
                  <div className={`p-3 border rounded-lg space-y-3 ${isDarkMode ? "bg-[#0a0a0b] border-white/5" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-slate-400">RENDERING STATUS ({exportProgress}%)</span>
                      <span className="animate-pulse text-amber-500 font-mono">ENCODING ACTIVE</span>
                    </div>

                    {/* Rendering Progress track */}
                    <div className={`w-full h-1.5 rounded overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-slate-200"}`}>
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-200"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>

                    {/* Active Rendering step logs */}
                    <div className={`text-[10px] font-mono p-2.5 rounded max-h-[80px] overflow-y-auto leading-relaxed border ${
                      isDarkMode ? "bg-[#121214]/50 border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-650"
                    }`}>
                      <div className="text-emerald-550">&gt; {exportSteps[activeExportStepIdx] || "Preparing encoder..."}</div>
                    </div>

                    {/* Complete Export Result */}
                    {exportResult && (
                      <div className={`space-y-2 pt-2 border-t ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
                        <div className="p-2 bg-emerald-950/20 text-emerald-400 text-[11px] rounded border border-emerald-900/35 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
                          <span>Recap compiling completed successfully.</span>
                        </div>
                        
                        {/* Direct Social Publish triggers */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400">Direct Social Publish API:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {["TikTok", "YouTube Shorts", "Instagram Reels"].map((pf) => (
                              <button
                                key={pf}
                                onClick={() => handleSocialUploadPublish(pf)}
                                className={`text-[10px] py-1 px-1.5 rounded flex items-center justify-center gap-1 cursor-pointer border ${
                                  isDarkMode 
                                    ? "bg-[#121214] hover:bg-black/40 border-white/5 text-white" 
                                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              >
                                {pf}
                              </button>
                            ))}
                          </div>
                        </div>

                        {exportUploadedMessage && (
                          <p className={`text-[10px] p-2 rounded border font-mono leading-normal ${
                            isDarkMode ? "text-indigo-400 bg-[#121214] border-white/5" : "text-indigo-650 bg-white border-slate-200"
                          }`}>
                            {exportUploadedMessage}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <a
                            href={exportResult.downloadUrl}
                            download="movie_recap.mp4"
                            className="flex-1 py-1 px-2.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold text-center flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Local File
                          </a>
                          <button
                            onClick={() => setIsExporting(false)}
                            className={`px-2.5 py-1 rounded text-[10px] border ${
                              isDarkMode ? "bg-slate-900 border-white/5 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PART 3: Right Block: Burmese Subtitles Synchronization Editor & Real-time Collaboration activity */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Timeline script details & Burmese subtitles details */}
          <div className={`p-5 rounded-2xl shadow-lg space-y-4 border transition-all ${
            isDarkMode 
              ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
              : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div>
              <h3 className="text-sm font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-400" /> Subtitles Synchronizer
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>
                Tweak precise wording in English or automated Burmese for active Scene #{activeSceneIndex + 1}.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-[10px] font-bold font-mono uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Scene Narration (English)
                </label>
                <textarea
                  rows={2}
                  value={editingNarrationText}
                  onChange={(e) => setEditingNarrationText(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs focus:outline-none transition rounded resize-none font-sans ${
                    isDarkMode 
                      ? "bg-black/20 border border-white/5 focus:border-indigo-500 text-slate-100" 
                      : "bg-slate-50 border border-slate-200 focus:border-indigo-650 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold font-mono uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Burmese Translation Overlay
                </label>
                <textarea
                  rows={2}
                  value={editingSubText}
                  onChange={(e) => setEditingSubText(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs focus:outline-none transition rounded resize-none font-sans text-amber-500 font-bold ${
                    isDarkMode 
                      ? "bg-black/20 border border-white/5 focus:border-indigo-500" 
                      : "bg-slate-50 border border-slate-200 focus:border-indigo-650"
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveSubtitlesChanges}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  Save Sync State
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Project collaboration logs and cursor tracking */}
          <div className={`p-5 rounded-2xl shadow-lg space-y-4 border transition-all ${
            isDarkMode 
              ? "bg-[#121214] border-white/5 text-[#e0e0e0]" 
              : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div>
              <h3 className="text-sm font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" /> Collaboration Feed & Chat
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>
                Discuss and view live actions instantly synced on the same draft.
              </p>
            </div>

            {/* Simulated Live Synchronized Cursor edit highlights box */}
            <div className={`p-3 rounded-lg text-left relative overflow-hidden min-h-[110px] border ${
              isDarkMode ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"
            }`}>
              <span className="text-[9px] font-mono text-slate-500 absolute top-2 right-2">LIVE SCENE COLLAB</span>
              
              <div className="text-xs space-y-1.5 text-slate-300">
                <p className="text-[10px] font-semibold text-indigo-400 font-mono uppercase">ACTIVE CURSOR FEED:</p>
                <div className={`relative p-2 rounded border ${
                  isDarkMode ? "bg-[#121214]/60 border-white/5" : "bg-white border-slate-200"
                }`}>
                  <span className={`block text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Cooper enters gargantua blackhole...</span>
                  
                  {/* Floating simulated partner cursor */}
                  <div 
                    className="absolute z-10 select-none pointer-events-none transition-all duration-300 text-[9px] text-white bg-indigo-500 px-1 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap shadow-md opacity-90"
                    style={{ top: `${colCursorOffset.top}%`, left: `${colCursorOffset.left}px` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>Aung Myo editing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live edits scrollbox */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Sync Log</span>
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                {colLogs.map((log, idx) => (
                  <div key={idx} className={`text-[10px] p-1.5 rounded border ${
                    isDarkMode ? "bg-black/10 border-white/5 text-slate-300" : "bg-slate-50 border-slate-150 text-slate-750"
                  }`}>
                    <span className="font-semibold text-indigo-455 text-[11px]">@{log.collaboratorName}</span>
                    <span className="ml-1 leading-normal">{log.action}</span>
                    <span className="float-right text-slate-500 text-[8px] font-mono pt-0.5">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project comment thread */}
            <div className={`space-y-3 pt-2 border-t ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Comments Thread</span>
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 text-[10px]">
                {chatComments.map((comment) => (
                  <div key={comment.id} className={`p-2 rounded border space-y-0.5 ${
                    isDarkMode ? "bg-black/20 border-white/5 text-slate-300" : "bg-slate-50/70 border-slate-150 text-slate-700"
                  }`}>
                    <div className="flex justify-between items-center text-[9px]">
                      <span className={`font-bold uppercase font-mono ${isDarkMode ? "text-white" : "text-slate-800"}`}>{comment.username}</span>
                      <span className="text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="leading-snug text-[10px]">{comment.message}</p>
                  </div>
                ))}
              </div>

              {/* input form to add comments */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask team to double check..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className={`flex-1 px-2.5 py-1.5 text-[11px] rounded focus:outline-none transition ${
                    isDarkMode 
                      ? "bg-black/20 border border-white/5 focus:border-indigo-500 text-slate-100" 
                      : "bg-slate-50 border border-slate-200 focus:border-indigo-650 text-slate-900"
                  }`}
                />
                <button
                  type="submit"
                  className="p-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
