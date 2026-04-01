export interface LyricState {
  currentLyric: string;
  repeatCount: number;
  isLearning: boolean;
}

export interface Settings {
  repeatTimes: number;
}

export type MessageType =
  | { type: 'GET_STATE' }
  | { type: 'STATE_RESPONSE'; state: LyricState }
  | { type: 'GET_SETTINGS' }
  | { type: 'SETTINGS_RESPONSE'; settings: Settings }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'UPDATE_STATE'; state: Partial<LyricState> };
