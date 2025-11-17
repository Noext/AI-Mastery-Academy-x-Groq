import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold mb-4">AI Mastery Academy</h1>
        <p className="text-xl text-gray-400 mb-8">
          Template pédagogique Next.js + Vercel AI SDK + Groq
        </p>
        <Link
          href="/chat"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
        >
          Go to Chat
        </Link>
        <div className="mt-12 text-sm text-gray-500">
          <p>Powered by Groq AI</p>
        </div>
      </div>
    </div>
  );
}

