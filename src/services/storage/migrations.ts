import type { Stats } from '@/features/stats/stats.schema';

type MigrationFunction = (oldData: unknown) => Stats;

const migrations: Record<string, MigrationFunction> = {
  '1.0': (data) => data as Stats,
};

/**
 * Stats データをバージョンに応じてマイグレーション
 * 現在はv1.0のみなので、そのまま返却する
 */
export const migrateStats = (data: unknown): Stats => {
  const versionInfo = data as { version?: string } | null;
  const currentVersion = versionInfo?.version ?? '1.0';

  const migration = migrations[currentVersion];
  if (!migration) {
    // バージョンが見つからない場合は v1.0 として処理
    return migrations['1.0'](data);
  }

  return migration(data);
};
