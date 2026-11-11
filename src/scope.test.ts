import { describe, test, expect } from 'vitest';
import packageJsonRaw from '../package.json?raw';

const DATABASE_CLIENT_PATTERNS = [
  /supabase/i,
  /firebase/i,
  /^(pg|postgres|mysql2?|mongodb|mongoose|sqlite3|better-sqlite3|redis|ioredis|knex|typeorm|sequelize|prisma|@prisma\/client|drizzle-orm|dexie|@electric-sql\/pglite)$/i,
];

describe('project scope', () => {
  test('package.json lists no database client libraries', () => {
    const pkg = JSON.parse(packageJsonRaw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const names = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ];
    const offenders = names.filter((name) =>
      DATABASE_CLIENT_PATTERNS.some((pattern) => pattern.test(name)),
    );
    expect(offenders).toEqual([]);
  });
});
