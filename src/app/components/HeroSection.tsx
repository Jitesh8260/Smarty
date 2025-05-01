'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import the context

const HeroSection: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Use the context

  useEffect(() => {
    // On page load, ensure the theme is applied
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]); // Reapply theme whenever it changes

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-200 dark:from-gray-900 dark:to-black flex items-center justify-center transition-colors duration-500">
      
      {/* Floating background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-indigo-300/50 dark:bg-white/10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Toggle Dark Mode */}
      <button
        onClick={toggleTheme} // Use the toggle function from the context
        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-4">
        
        {/* Chat bubble */}
        <div className="relative backdrop-blur-md bg-white/80 dark:bg-white/5 p-4 rounded-xl mb-4 shadow-xl max-w-xs border border-white dark:border-gray-700/30">
          <p className="text-gray-800 dark:text-gray-100 font-medium">Hello 👋, I'm Smarty!</p>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/80 dark:bg-white/5 rotate-45"></div>
        </div>

        {/* Avatar */}
        <div className="relative w-24 h-24 mb-8 animate-bounce">
          <div className="absolute inset-0 rounded-full bg-indigo-300/40 dark:bg-indigo-600/20 blur-xl"></div>
          <div className="relative bg-white dark:bg-gray-800 h-full w-full rounded-full flex items-center justify-center shadow-2xl border-2 border-white/60 dark:border-gray-700/30">
            <span className="text-4xl" role="img" aria-label="Robot">🤖</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
          Talk Smart. Chat Smarter.
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-400 mt-2 max-w-lg">
          Your intelligent assistant for every conversation.
        </p>

        {/* Get Started Button */}
        <Link
          href="/chat"
          className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 mt-8 rounded-full hover:scale-105 hover:bg-indigo-100 transition-transform duration-300 shadow-lg hover:shadow-indigo-500/30"
        >
          Get Started
        </Link>
      </div>

      {/* Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
