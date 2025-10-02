// Shared types between main and renderer processes

export interface ElectronAPI {
  platform: string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
