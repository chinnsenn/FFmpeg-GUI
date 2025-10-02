/**
 * Custom hook for using Electron API
 */
export function useElectronAPI() {
  if (!window.electronAPI) {
    throw new Error('Electron API not available. Make sure preload script is loaded.');
  }

  return window.electronAPI;
}
