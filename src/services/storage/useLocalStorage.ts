import { useState, useCallback } from 'react';
import type { z } from 'zod';
import { logStorageError } from './storageErrorHandler';

/**
 * localStorage の読み書きを管理するカスタムフック
 *
 * @param key - ストレージキー
 * @param initialValue - 初期値
 * @param schema - Zod バリデーションスキーマ（省略可）
 * @param migrate - マイグレーション関数（省略可）
 * @returns [value, setValue, clearValue]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>,
  migrate?: (data: unknown) => T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // 初期化関数で、マウント時に一度だけ localStorage から読み込み
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        return initialValue;
      }

      const parsed: unknown = JSON.parse(stored);

      // マイグレーション実行
      let migrated: unknown = parsed;
      if (migrate) {
        migrated = migrate(parsed);
      }

      // スキーマバリデーション
      if (schema) {
        const validated = schema.parse(migrated);
        return validated;
      }

      return migrated as T;
    } catch (error) {
      logStorageError(key, error);
      return initialValue;
    }
  });

  // 値の更新関数
  const handleSetValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const actualNewValue =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prev)
            : newValue;

        try {
          localStorage.setItem(key, JSON.stringify(actualNewValue));
        } catch (error) {
          logStorageError(key, error);
        }

        return actualNewValue;
      });
    },
    [key],
  );

  // 値のクリア関数
  const clearValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      logStorageError(key, error);
    }
  }, [key, initialValue]);

  return [value, handleSetValue, clearValue];
};
