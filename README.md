# AI Mastery Academy x Groq

Educational template for Next.js 15 with Vercel AI SDK and Groq as the sole LLM provider.

## 🎯 Objective

This repository demonstrates the complete integration of Groq in a modern Next.js application with:
- Real-time chat streaming
- Groq model selection
- Clean and educational architecture

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Copy the `env.example` file to `.env.local`:
```bash
cp env.example .env.local
```

2. Add your Groq API key in `.env.local`:
```
GROQ_API_KEY=your_groq_key_here
```

You can get an API key at [console.groq.com](https://console.groq.com)

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Supported Groq Models

| Mode | Groq Model |
|------|------------|
| `fast` | llama-3.1-8b-instant |
| `default` | llama-3.3-70b-versatile |
| `reasoning` | openai/gpt-oss-120b |
| `browserLite` | openai/gpt-oss-20b |
| `safety` | meta-llama/llama-guard-4-12b |
| `compound` | groq/compound |

## 🏗️ Project Structure

```
AI-Mastery-Academy-x-Groq/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Edge API route with streaming
│   ├── chat/
│   │   └── page.tsx              # Chat interface
│   ├── layout.tsx                # Main layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/
│   ├── groqModels.ts             # Groq models configuration
│   └── types.ts                  # TypeScript types
├── env.example                   # Environment variables template
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Documentation
```

## 🛠️ Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Static typing
- **Vercel AI SDK** - SDK for LLM integration
- **@ai-sdk/groq** - Groq provider for AI SDK
- **Tailwind CSS** - Utility-first CSS framework

## 📝 Available Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Check code with ESLint

## 🚢 Deployment on Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `GROQ_API_KEY` environment variable in the project settings
4. Deploy!

Deployment is automatic on every push to the main branch.

## 📚 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

This project is an educational template for AI Mastery Academy.
