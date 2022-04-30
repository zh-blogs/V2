/**
 * 判断是否为服务端环境
 * @returns 是否为服务端
 */
export function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * 判断是否为开发环境
 * @returns 是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
