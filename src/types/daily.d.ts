/**
 * Daily.co TypeScript definitions
 */

declare global {
  interface Window {
    DailyIframe: any;
  }
}

export interface DailyParticipant {
  session_id: string;
  user_id: string;
  user_name: string;
  local: boolean;
  audio: boolean;
  video: boolean;
  screen: boolean;
}

export interface DailyEvent {
  action: string;
  participant?: DailyParticipant;
  participants?: { [key: string]: DailyParticipant };
  track?: MediaStreamTrack;
  errorMsg?: string;
}

export interface DailyCallOptions {
  url: string;
  token?: string;
  userName?: string;
  userData?: any;
}

export interface DailyFrameOptions {
  iframeStyle?: {
    position?: string;
    top?: string;
    left?: string;
    width?: string;
    height?: string;
    zIndex?: string;
  };
  showLeaveButton?: boolean;
  showFullscreenButton?: boolean;
  showLocalVideo?: boolean;
  showParticipantsBar?: boolean;
  theme?: {
    colors?: {
      accent?: string;
      accentText?: string;
      background?: string;
      backgroundAccent?: string;
      baseText?: string;
      border?: string;
      mainAreaBg?: string;
      mainAreaBgAccent?: string;
      mainAreaText?: string;
      supportiveText?: string;
    };
  };
}

export {};