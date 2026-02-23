// Type definitions for PiUI

export type ElementType = 'text' | 'rectangle' | 'circle' | 'image';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  // Shape specific
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Image specific
  src?: string;
  // Shadow
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  // Layer control
  visible?: boolean;
  locked?: boolean;
}

export interface CanvasSize {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: string;
}

export const CANVAS_PRESETS: CanvasSize[] = [
  { id: 'youtube', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: 'play' },
  { id: 'instagram', name: 'Instagram Post', width: 1080, height: 1080, icon: 'instagram' },
  { id: 'tiktok', name: 'TikTok Cover', width: 1080, height: 1920, icon: 'video' },
  { id: 'story', name: 'Story', width: 1080, height: 1920, icon: 'smartphone' },
  { id: 'facebook', name: 'Facebook Cover', width: 820, height: 312, icon: 'facebook' },
  { id: 'twitter', name: 'Twitter Header', width: 1500, height: 500, icon: 'twitter' },
];

export interface ProjectState {
  canvasWidth: number;
  canvasHeight: number;
  elements: CanvasElement[];
  selectedIds: string[];
  zoom: number;
  history: CanvasElement[][];
  historyIndex: number;
}
