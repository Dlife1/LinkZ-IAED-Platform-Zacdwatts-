
export interface Contributor {
  name: string;
  role: string;
  share: number;
}

export interface Metadata {
  title: string;
  artist: string;
  genre: string;
  isrc: string;
  upc: string;
  contributors: Contributor[];
  aiAssisted: boolean;
  spatialAudio: boolean;
  bpm?: number;
  mood?: string;
}

export type ViewState = 'landing' | 'onboarding' | 'dashboard' | 'generative-engine';

export interface DeploymentEvent {
  id: string;
  timestamp: string;
  service: string;
  status: 'success' | 'pending' | 'failed';
  url?: string;
}
