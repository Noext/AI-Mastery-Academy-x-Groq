# Course Overview: Building a Next.js Chat Application with Groq

## Introduction

This course teaches you how to build a complete, production-ready chat application using Next.js 15, TypeScript, Vercel AI SDK, and Groq as the LLM provider. By the end of this course, you'll understand:

- How to integrate Groq AI models into a Next.js application
- How to implement real-time streaming chat functionality
- How to structure a modern React/Next.js application
- How to use TypeScript for type safety
- How to deploy AI applications to production

## Project Overview

The **AI Mastery Academy x Groq** project is a complete chat application that demonstrates:

1. **Real-time Streaming**: Messages stream from the AI model as they're generated, providing a smooth user experience
2. **Multiple Model Support**: Users can switch between 6 different Groq models, each optimized for different use cases
3. **Modern Architecture**: Uses Next.js 15 App Router, TypeScript, and best practices
4. **Production Ready**: Includes error handling, loading states, and proper API structure

## Technology Stack

### Core Technologies

- **Next.js 15**: React framework with App Router for server-side rendering and API routes
- **TypeScript**: Type-safe JavaScript for better developer experience and fewer bugs
- **React 18**: Modern React with hooks and concurrent features
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

### AI Technologies

- **Vercel AI SDK**: Unified SDK for working with multiple LLM providers
- **@ai-sdk/groq**: Groq provider for the Vercel AI SDK
- **Groq API**: High-performance inference API for running LLMs

## Project Structure

```
AI-Mastery-Academy-x-Groq/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes (backend)
│   │   └── chat/
│   │       └── route.ts   # Chat API endpoint
│   ├── chat/              # Chat page route
│   │   └── page.tsx       # Chat interface component
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page component
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities and configurations
│   ├── groqModels.ts      # Groq model configurations
│   └── types.ts           # TypeScript type definitions
├── docs/                  # This documentation
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.mjs        # Next.js configuration
```

## Learning Objectives

By completing this course, you will:

1. **Understand Next.js App Router**: Learn how to structure applications using the new App Router pattern
2. **Master API Routes**: Create serverless API endpoints using Next.js Edge Runtime
3. **Implement Streaming**: Understand how to stream AI responses in real-time
4. **Work with TypeScript**: Use TypeScript effectively for type safety and better code quality
5. **Integrate AI SDKs**: Use the Vercel AI SDK to interact with LLM providers
6. **Build Modern UIs**: Create responsive, accessible user interfaces with Tailwind CSS
7. **Deploy Applications**: Deploy your application to Vercel with proper environment configuration

## Prerequisites

Before starting this course, you should have:

- Basic knowledge of JavaScript and React
- Understanding of async/await and Promises
- Familiarity with REST APIs
- Basic command line knowledge
- A code editor (VS Code recommended)

## Course Structure

This course is divided into the following modules:

1. **Architecture Overview** - Understanding the application structure
2. **Groq Models Configuration** - Setting up and understanding different AI models
3. **API Route Implementation** - Building the backend chat endpoint
4. **Chat Interface** - Creating the frontend chat UI
5. **TypeScript Types** - Understanding type safety
6. **Streaming Implementation** - How real-time streaming works
7. **Configuration & Setup** - Project configuration files
8. **Deployment** - Deploying to production

Each module includes:
- Detailed code explanations
- Key concepts and patterns
- Best practices
- Common pitfalls and solutions

## Getting Started

To follow along with this course:

1. Clone or download the repository
2. Install dependencies: `npm install`
3. Set up your `.env.local` file with your Groq API key
4. Run the development server: `npm run dev`
5. Open `http://localhost:3000` in your browser

## Next Steps

Proceed to the next module: **01-architecture.md** to understand the overall architecture of the application.

