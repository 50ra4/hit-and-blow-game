/**
 * LocalStorage エラーログ出力関数
 * エラーを console.error でログ出力するだけのシンプル関数。
 * UIへの通知は行わない。
 */
export const logStorageError = (key: string, error: unknown): void => {
  console.error(`[Storage] Error for key "${key}":`, error);
};
