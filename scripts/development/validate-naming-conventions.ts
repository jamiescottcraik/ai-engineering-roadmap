#!/usr/bin/env tsx
/**
 * Validates naming conventions across the entire brAInwav project
 * Run with: npm run validate:naming
 *
 * This TypeScript version provides more robust pattern matching and
 * better integration with the Node.js ecosystem.
 */

import { glob } from 'glob';
import path from 'path';

interface NamingRule {
  pattern: string;
  regex: RegExp;
  description: string;
}

const NAMING_RULES: NamingRule[] = [
  {
    pattern: '**/*.{ts,tsx,js,jsx}',
    regex: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(ts|tsx|js|jsx)$/,
    description: 'TypeScript/JavaScript files should use kebab-case',
  },
  {
    pattern: '**/*.py',
    regex: /^[a-z][a-z0-9]*(_[a-z0-9]+)*\.py$/,
    description: 'Python files should use snake_case',
  },
  {
    pattern: '**/*.{css,scss}',
    regex: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(css|scss)$/,
    description: 'CSS files should use kebab-case',
  },
  {
    pattern: '**/*.sh',
    regex: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.sh$/,
    description: 'Shell scripts should use kebab-case',
  },
  {
    pattern: '**/*.{json,yaml,yml}',
    regex: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(json|yaml|yml)$/,
    description: 'Config files should use kebab-case',
  },
  {
    pattern: '**/*.md',
    regex: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.md$/,
    description: 'Markdown files should use kebab-case',
  },
];

const EXCEPTIONS = [
  // Governance files (UPPERCASE exceptions)
  'README.md',
  'RULES_OF_AI.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'LICENSE',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'SUPPORT.md',

  // Next.js special files
  'layout.tsx',
  'page.tsx',
  'loading.tsx',
  'error.tsx',
  'not-found.tsx',
  'route.ts',
  'middleware.ts',
  'global.css',
  'globals.css',

  // Docker files
  'Dockerfile',
  'Dockerfile.dev',
  'Dockerfile.prod',
  'docker-compose.yml',
  'docker-compose.dev.yml',
  'docker-compose.prod.yml',

  // Package management
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'pyproject.toml',
  'requirements.txt',
  'uv.lock',

  // Configuration files with established conventions
  'tailwind.config.js',
  'tailwind.config.ts',
  'jest.config.js',
  'jest.setup.js',
  'next.config.js',
  'next-env.d.ts',
  'postcss.config.mjs',
  'eslint.config.js',
  'eslint.config.mjs',
  '.eslintrc.js',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'Makefile',
  'Vagrantfile',

  // Python special files
  '__init__.py',

  // Git and system files
  '.gitkeep',
  '.gitignore',
  '.gitattributes',
  '.DS_Store',
  '.editorconfig',
  '.prettierrc',
  '.prettierignore',
  '.env',
  '.env.example',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.1password',
  '.python-version',
  '.pre-commit-config.yaml',
];

const IGNORED_PATTERNS = [
  'node_modules/**',
  '.git/**',
  '.vscode/**',
  '.next/**',
  'dist/**',
  'build/**',
  '__pycache__/**',
  '.pytest_cache/**',
  '.ruff_cache/**',
  '.mypy_cache/**',
  '.migration/**',
];

interface ValidationResult {
  totalFiles: number;
  violations: Array<{
    file: string;
    expected: string;
    description: string;
  }>;
}

async function validateNaming(): Promise<ValidationResult> {
  const result: ValidationResult = {
    totalFiles: 0,
    violations: [],
  };

  for (const rule of NAMING_RULES) {
    const files = await glob(rule.pattern, {
      ignore: IGNORED_PATTERNS,
      absolute: false,
    });

    for (const file of files) {
      const filename = path.basename(file);
      result.totalFiles++;

      // Skip exempted files
      if (EXCEPTIONS.includes(filename)) {
        continue;
      }

      // Skip build files with hashes (e.g., index-Cj2EirFU.js)
      if (/^[a-z]+-[A-Za-z0-9]{8,}\.(js|css|js\.map|css\.map)$/.test(filename)) {
        continue;
      }

      if (!rule.regex.test(filename)) {
        result.violations.push({
          file,
          expected: rule.regex.toString(),
          description: rule.description,
        });
      }
    }
  }

  return result;
}

function convertToKebabCase(text: string): string {
  return text
    .replace(/[_\s]+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function convertToSnakeCase(text: string): string {
  return text
    .replace(/[-\s]+/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function getSuggestedName(filename: string): string {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  if (ext === '.py') {
    return convertToSnakeCase(name) + ext;
  } else {
    return convertToKebabCase(name) + ext;
  }
}

async function main(): Promise<void> {
  console.log('🔍 Validating naming conventions across brAInwav project...\n');

  try {
    const result = await validateNaming();

    if (result.violations.length === 0) {
      console.log('✅ All files follow naming conventions');
      console.log(`📊 Checked ${result.totalFiles} files`);
      process.exit(0);
    } else {
      console.log('❌ Naming convention violations found:\n');

      result.violations.forEach((violation) => {
        const suggested = getSuggestedName(path.basename(violation.file));
        console.log(`  • ${violation.file}`);
        console.log(`    Expected: ${suggested}`);
        console.log(`    Rule: ${violation.description}\n`);
      });

      console.log('💡 Naming Convention Standards:');
      console.log(
        '  • TypeScript/JavaScript: kebab-case (ai-learning-roadmap.tsx, use-focus-management.ts)',
      );
      console.log('  • Python: snake_case (ollama_manager.py, test_accessibility_compliance.py)');
      console.log('  • CSS: kebab-case (focus-scenes.css, learning-roadmap.module.css)');
      console.log('  • Shell scripts: kebab-case (setup-ollama.sh)');
      console.log('  • Governance files: UPPERCASE exceptions (RULES_OF_AI.md, AGENTS.md)');
      console.log('  • Next.js special files: Standard naming (layout.tsx, page.tsx)');
      console.log('\n📖 For more information:');
      console.log('  • docs/naming-conventions.md - Complete naming guide');
      console.log('  • ai/RULES_OF_AI.md - Project governance');

      console.log(
        `\n📊 Found ${result.violations.length} violation(s) in ${result.totalFiles} files`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error validating naming conventions:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { validateNaming, NAMING_RULES, EXCEPTIONS };
