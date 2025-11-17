# Module 1: Application Architecture

## Overview

This module explains the overall architecture of the AI Mastery Academy x Groq application. Understanding the architecture is crucial for building scalable, maintainable applications.

## Next.js App Router Architecture

Next.js 15 uses the **App Router** pattern, which is based on React Server Components and provides a file-system-based routing system. This is different from the older Pages Router.

### Key Concepts

#### 1. File-Based Routing

In the App Router, the file structure determines the routes:

- `app/page.tsx` → `/` (home page)
- `app/chat/page.tsx` → `/chat` (chat page)
- `app/api/chat/route.ts` → `/api/chat` (API endpoint)

#### 2. Server and Client Components

- **Server Components** (default): Run on the server, can access databases and APIs directly
- **Client Components**: Run in the browser, marked with `'use client'` directive

#### 3. Layouts

- `app/layout.tsx`: Root layout that wraps all pages
- Provides shared UI elements and metadata

## Application Flow

### Request Flow

```
User Input (Frontend)
    ↓
Chat Interface (app/chat/page.tsx)
    ↓
useChat Hook (Vercel AI SDK)
    ↓
POST Request to /api/chat
    ↓
API Route Handler (app/api/chat/route.ts)
    ↓
Groq Provider (lib/groqModels.ts)
    ↓
Groq API (External)
    ↓
Streaming Response
    ↓
Frontend Updates in Real-Time
```

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── HomePage (app/page.tsx) - Landing page
└── ChatPage (app/chat/page.tsx) - Chat interface
    ├── Header (with model selector)
    ├── Messages Container
    │   ├── User Messages
    │   └── Assistant Messages
    └── Input Form
```

## Directory Structure Explained

### `/app` Directory

The `app` directory contains all routes and layouts:

- **`layout.tsx`**: Root layout component that wraps all pages
- **`page.tsx`**: Home page component
- **`globals.css`**: Global CSS styles (includes Tailwind directives)
- **`api/`**: API routes directory
  - **`chat/route.ts`**: Chat API endpoint handler
- **`chat/`**: Chat page route
  - **`page.tsx`**: Chat interface component

### `/lib` Directory

The `lib` directory contains shared utilities and configurations:

- **`groqModels.ts`**: Groq provider configuration and model mappings
- **`types.ts`**: TypeScript type definitions shared across the application

## Architecture Patterns Used

### 1. Separation of Concerns

- **Frontend**: UI components in `app/chat/page.tsx`
- **Backend**: API logic in `app/api/chat/route.ts`
- **Configuration**: Model configs in `lib/groqModels.ts`
- **Types**: Type definitions in `lib/types.ts`

### 2. Edge Runtime

The API route uses Edge Runtime (`export const runtime = 'edge'`), which:

- Runs on Vercel's Edge Network (closer to users)
- Has faster cold starts
- Limited Node.js APIs (no file system, etc.)
- Perfect for AI API calls

### 3. Streaming Pattern

The application uses streaming to:

- Provide real-time feedback to users
- Improve perceived performance
- Handle long responses efficiently
- Use Server-Sent Events (SSE) under the hood

### 4. Type Safety

TypeScript is used throughout:

- Shared types in `lib/types.ts`
- Type inference from model configurations
- Type-safe API requests/responses

## Data Flow

### 1. User Sends Message

```typescript
// User types in input field
input: "Hello, how are you?"

// useChat hook handles submission
handleSubmit() → POST /api/chat
```

### 2. API Processes Request

```typescript
// API route receives request
{
  messages: [{ role: 'user', content: 'Hello...' }],
  mode: 'default'
}

// Selects model from MODELS mapping
modelId = MODELS['default'] // 'llama-3.3-70b-versatile'

// Calls Groq API with streaming
streamText({ model: groqProvider(modelId), messages })
```

### 3. Response Streams Back

```typescript
// Response streams token by token
"Hello" → "Hello," → "Hello, how" → "Hello, how are" → ...

// Frontend receives each token
useChat hook updates messages state
UI re-renders with new content
```

## Key Design Decisions

### Why Edge Runtime?

- **Performance**: Edge functions start faster and run closer to users
- **Cost**: More cost-effective for high-traffic applications
- **Scalability**: Automatically scales with traffic

### Why Separate Model Configuration?

- **Maintainability**: Easy to update model IDs in one place
- **Type Safety**: TypeScript ensures only valid models are used
- **Flexibility**: Easy to add new models or change existing ones

### Why useChat Hook?

- **Abstraction**: Handles complex streaming logic automatically
- **State Management**: Manages messages, loading states, errors
- **Integration**: Works seamlessly with Vercel AI SDK

## Security Considerations

1. **API Key**: Stored in environment variables, never in code
2. **Input Validation**: API route validates request structure
3. **Error Handling**: Proper error responses without exposing internals
4. **CORS**: Next.js handles CORS automatically for same-origin requests

## Performance Optimizations

1. **Streaming**: Reduces Time to First Token (TTFT)
2. **Edge Runtime**: Lower latency for API calls
3. **Client-Side Rendering**: Chat interface renders on client for interactivity
4. **Code Splitting**: Next.js automatically splits code by route

## Next Steps

Now that you understand the architecture, proceed to **02-groq-models.md** to learn about configuring and using different Groq models.

