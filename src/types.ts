export interface Scene {
  id: string;
  title: string;
  duration: number; // in seconds
  narration: string;
  burmeseSubtitles: string;
  sceneType: string;
  mediaQuery: string;
}

export interface ScriptProject {
  id: string;
  title: string;
  movieName: string;
  summary: string;
  scenes: Scene[];
  aspectRatio: "16:9" | "9:16" | "1:1";
  transitionTemplate: "none" | "fade" | "dissolve" | "slide" | "zoom" | "whip_pan";
  createdAt: string;
}

export interface CommunityReview {
  id: string;
  movieName: string;
  username: string;
  rating: number; // 1-5 stars
  content: string;
  likes: number;
  createdAt: string;
}

export interface Collaborator {
  id: string;
  name: string;
  avatarColor: string;
  activeSceneId: string;
  status: "idle" | "typing" | "choosing_transition" | "playing_timeline";
}

export interface LiveEditMessage {
  collaboratorId: string;
  collaboratorName: string;
  action: string;
  timestamp: string;
}

export interface ChatComment {
  id: string;
  username: string;
  avatarColor: string;
  message: string;
  timestamp: string;
}
