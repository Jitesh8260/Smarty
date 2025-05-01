// src/app/page.tsx

import Link from 'next/link'
import HeroSection from './components/HeroSection'

export default function Home() {
  return (
    // <main className="p-8 text-center">
    //   <h1 className="text-3xl font-bold mb-4">Welcome to Smarty 🤖</h1>
    //   <p className="mb-6 text-gray-600">Your friendly chatbot powered by OpenRouter.</p>
    //   <Link
    //     href="/chat"
    //     className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
    //   >
    //     Go to Chat
    //   </Link>
    // </main>
    <main>
      <HeroSection />
    </main>
  )
}
