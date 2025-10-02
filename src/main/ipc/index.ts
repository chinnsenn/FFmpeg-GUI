import { registerSystemHandlers } from './systemHandlers';
import { registerFileHandlers } from './fileHandlers';
import { registerConfigHandlers } from './configHandlers';
import { registerFFmpegHandlers } from './ffmpegHandlers';
import { registerTaskHandlers } from './taskHandlers';
import { registerLogHandlers } from './logHandlers';

/**
 * 注册所有 IPC 处理器
 */
export function registerAllIpcHandlers() {
  registerSystemHandlers();
  registerFileHandlers();
  registerConfigHandlers();
  registerFFmpegHandlers();
  registerTaskHandlers();
  registerLogHandlers();
}
