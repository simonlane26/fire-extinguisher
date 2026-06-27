// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import requireTenantScope from './eslint-rules/require-tenant-scope.mjs';

const localPlugin = {
  rules: {
    'require-tenant-scope': requireTenantScope,
  },
};

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
  // Enforce tenantId scoping on all Prisma queries in the backend
  {
    files: ['src/**/*.ts'],
    plugins: { local: localPlugin },
    rules: {
      'local/require-tenant-scope': 'error',
    },
  },
  // Platform admin is allowed to query across all tenants by design
  {
    files: ['src/platform-admin/**/*.ts'],
    rules: {
      'local/require-tenant-scope': 'off',
    },
  },
  // Scheduler runs system-wide jobs (reminder emails) that intentionally span all tenants
  {
    files: ['src/scheduler/**/*.ts'],
    rules: {
      'local/require-tenant-scope': 'off',
    },
  },
);