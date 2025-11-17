# Module 7: Project Configuration

## Overview

This module explains all configuration files in the project. Understanding configuration is essential for customizing and deploying the application.

## Configuration Files Overview

The project includes several configuration files:

1. **`package.json`** - Dependencies and scripts
2. **`tsconfig.json`** - TypeScript configuration
3. **`next.config.mjs`** - Next.js configuration
4. **`tailwind.config.ts`** - Tailwind CSS configuration
5. **`postcss.config.mjs`** - PostCSS configuration
6. **`.gitignore`** - Git ignore rules
7. **`env.example`** - Environment variables template

## package.json

**Purpose**: Defines project metadata, dependencies, and scripts.

### Structure

```json
{
  "name": "ai-mastery-academy-x-groq",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@ai-sdk/groq": "^1.2.9",
    "ai": "^4.0.0",
    "next": "^15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.0"
  }
}
```

### Key Sections

#### Scripts

- **`dev`**: Starts development server (hot reload)
- **`build`**: Creates production build
- **`start`**: Starts production server
- **`lint`**: Runs ESLint

#### Dependencies

**Production Dependencies:**

- **`next`**: Next.js framework
- **`react`** & **`react-dom`**: React library
- **`ai`**: Vercel AI SDK
- **`@ai-sdk/groq`**: Groq provider for AI SDK
- **`zod`**: Schema validation (used by AI SDK)

**Development Dependencies:**

- **TypeScript**: Type checking and compilation
- **Type Definitions**: TypeScript types for libraries
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS & Autoprefixer**: CSS processing

### Version Ranges

- **`^`**: Allows compatible version updates
  - `^4.0.0` allows `4.0.0` to `4.x.x` (not `5.0.0`)
- **`~`**: Allows patch updates only
  - `~4.0.0` allows `4.0.0` to `4.0.x` (not `4.1.0`)

## tsconfig.json

**Purpose**: Configures TypeScript compiler options.

### Key Settings

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Important Options

#### target: "ES2017"

- JavaScript version to compile to
- ES2017 provides async/await support
- Compatible with modern browsers

#### strict: true

- Enables all strict type checking
- Catches more errors at compile time
- Recommended for new projects

#### jsx: "preserve"

- Keeps JSX syntax (Next.js handles transformation)
- Don't transform JSX in TypeScript

#### paths: { "@/*": ["./*"] }

- Enables path aliases
- `@/lib/types` → `./lib/types`
- Cleaner imports

#### moduleResolution: "bundler"

- For modern bundlers (Next.js uses webpack/turbopack)
- Understands package.json exports
- Better tree-shaking

## next.config.mjs

**Purpose**: Configures Next.js behavior.

### Current Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

**Minimal configuration** - Next.js defaults work well for most cases.

### Common Additions

#### Environment Variables

```javascript
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

#### Image Domains

```javascript
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
};
```

#### Redirects

```javascript
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/old',
        destination: '/new',
        permanent: true,
      },
    ];
  },
};
```

## tailwind.config.ts

**Purpose**: Configures Tailwind CSS.

### Configuration

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

### Key Settings

#### content

- **Purpose**: Tells Tailwind which files to scan for classes
- **Why**: Tailwind removes unused CSS (tree-shaking)
- **Patterns**: File paths to scan

#### theme.extend

- **Purpose**: Extend default theme
- **Example**: Add custom colors, fonts, etc.

```typescript
theme: {
  extend: {
    colors: {
      brand: '#0070f3',
    },
  },
}
```

## postcss.config.mjs

**Purpose**: Configures PostCSS (CSS processing).

### Configuration

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

### Plugins

#### tailwindcss

- Processes Tailwind directives (`@tailwind`, etc.)
- Generates utility classes

#### autoprefixer

- Adds vendor prefixes automatically
- `transform` → `-webkit-transform`, `-moz-transform`, etc.
- Ensures cross-browser compatibility

## .gitignore

**Purpose**: Tells Git which files to ignore.

### Key Patterns

```
# Dependencies
/node_modules

# Build outputs
/.next
/out

# Environment variables
.env*.local
.env

# IDE
.vscode
.idea

# OS
.DS_Store
```

### Why Ignore These?

- **`node_modules`**: Can be regenerated with `npm install`
- **`.next`**: Build output, regenerated on build
- **`.env.local`**: Contains secrets, never commit
- **`.DS_Store`**: macOS system file

## env.example

**Purpose**: Template for environment variables.

### Content

```
GROQ_API_KEY=your_groq_key_here
```

### Usage

1. Copy to `.env.local`
2. Fill in actual values
3. Never commit `.env.local` (in .gitignore)

### Environment Files in Next.js

- **`.env.local`**: Local development (gitignored)
- **`.env.development`**: Development environment
- **`.env.production`**: Production environment
- **`.env`**: Default (all environments)

**Priority**: `.env.local` > `.env.development` > `.env`

## Environment Variables

### Accessing in Code

```typescript
// Server-side (API routes, Server Components)
const apiKey = process.env.GROQ_API_KEY;

// Client-side (must prefix with NEXT_PUBLIC_)
const publicVar = process.env.NEXT_PUBLIC_API_URL;
```

### Security

- **Server-only**: Variables without `NEXT_PUBLIC_` are server-only
- **Client-exposed**: `NEXT_PUBLIC_` variables are bundled into client
- **Never expose secrets**: Don't use `NEXT_PUBLIC_` for API keys

## Path Aliases

### Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Usage

```typescript
// Instead of
import { MODELS } from '../../../lib/groqModels';

// Use
import { MODELS } from '@/lib/groqModels';
```

**Benefits:**
- Cleaner imports
- Easier refactoring
- Less path confusion

## Build Configuration

### Development

```bash
npm run dev
```

- Fast refresh enabled
- Source maps included
- Detailed error messages
- No optimization

### Production

```bash
npm run build
npm run start
```

- Code minified
- Optimized bundles
- Tree-shaking
- Image optimization

## Customization Guide

### Adding a New Dependency

1. Install: `npm install package-name`
2. Use in code
3. TypeScript types (if needed): `npm install -D @types/package-name`

### Changing TypeScript Settings

1. Edit `tsconfig.json`
2. Restart TypeScript server in IDE
3. Check for errors

### Adding Tailwind Classes

1. Use classes in components
2. Tailwind scans and includes
3. No configuration needed for standard classes

### Adding Environment Variables

1. Add to `.env.local`
2. Use `process.env.VARIABLE_NAME`
3. Add to `env.example` for documentation

## Best Practices

1. **Version Pinning**: Consider exact versions for production
2. **Environment Variables**: Use `.env.example` for documentation
3. **Gitignore**: Keep sensitive files out of Git
4. **TypeScript Strict**: Keep strict mode enabled
5. **Path Aliases**: Use for cleaner imports
6. **Configuration as Code**: Keep configs in version control
7. **Documentation**: Document custom configurations

## Troubleshooting

### Issue: TypeScript Errors

**Solution:**
- Restart TypeScript server
- Check `tsconfig.json` settings
- Verify file extensions match

### Issue: Tailwind Classes Not Working

**Solution:**
- Check `tailwind.config.ts` content paths
- Restart dev server
- Verify PostCSS config

### Issue: Environment Variables Not Working

**Solution:**
- Restart dev server after adding variables
- Check variable name spelling
- Verify `.env.local` file location

## Next Steps

Now that you understand configuration, proceed to **08-deployment.md** to learn how to deploy the application to production.

