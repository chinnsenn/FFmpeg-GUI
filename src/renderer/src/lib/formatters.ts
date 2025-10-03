/**
 * 格式化工具函数库
 * 统一的数据格式化函数，用于各个组件
 */

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化比特率
 * @param bps 比特率（bps）或字符串
 * @returns 格式化后的比特率字符串
 */
export function formatBitrate(bps: number | string): string {
  // 如果是字符串，进行简单转换
  if (typeof bps === 'string') {
    return bps.replace('bits/s', 'bps').replace('kbits/s', 'kbps');
  }

  // 如果是数字，进行计算
  if (bps === 0) return '0 bps';
  const k = 1000;
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps'];
  const i = Math.floor(Math.log(bps) / Math.log(k));
  return Math.round((bps / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化时长（秒转为 HH:MM:SS 格式）
 * @param seconds 秒数
 * @returns 格式化后的时长字符串
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
}

/**
 * 格式化时间（Date 对象转为本地时间字符串）
 * @param date 日期对象
 * @returns 格式化后的时间字符串
 */
export function formatTime(date?: Date): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 计算两个时间之间的时长差
 * @param startDate 开始时间
 * @param endDate 结束时间（可选，默认为当前时间）
 * @returns 格式化后的时长字符串
 */
export function calculateDuration(startDate?: Date, endDate?: Date): string {
  if (!startDate) return '-';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const duration = Math.floor((end.getTime() - start.getTime()) / 1000);

  if (duration < 60) return `${duration}秒`;
  if (duration < 3600) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}分${seconds}秒`;
  }
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}小时${minutes}分`;
}

/**
 * 格式化速度
 * @param speed 速度倍数
 * @returns 格式化后的速度字符串
 */
export function formatSpeed(speed: number): string {
  return `${speed.toFixed(2)}x`;
}

/**
 * 格式化百分比
 * @param value 0-100 之间的数值
 * @param decimals 小数位数，默认为 0
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}
