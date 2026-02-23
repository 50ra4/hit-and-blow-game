import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logStorageError } from './storageErrorHandler';

describe('logStorageError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('console.error を1回呼び出す', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logStorageError('test-key', new Error('test error'));

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('キー名とエラーメッセージを含める', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Storage failed');

    logStorageError('tile-hab-stats', error);

    expect(spy).toHaveBeenCalledWith(
      '[Storage] Error for key "tile-hab-stats":',
      error,
    );
    spy.mockRestore();
  });

  it('unknownなエラーオブジェクトでも動作する', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logStorageError('key', 'string error');

    expect(spy).toHaveBeenCalledWith(
      '[Storage] Error for key "key":',
      'string error',
    );
    spy.mockRestore();
  });
});
