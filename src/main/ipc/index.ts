import { registerSystemHandlers } from './systemHandlers';
import { registerFileHandlers } from './fileHandlers';
import { registerConfigHandlers } from './configHandlers';

/**
 * �@	 IPC h
 */
export function registerAllIpcHandlers() {
  registerSystemHandlers();
  registerFileHandlers();
  registerConfigHandlers();
}
