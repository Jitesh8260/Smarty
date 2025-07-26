import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Use toggleTheme from context
import Sidebar from "./Sidebar";
import { LayoutGrid, Bell, UserCircle, Moon, Sun, Trash2 } from "lucide-react";
import Link from "next/link";
import Notification from "./Notification";
import Profile from "./Profile";

interface Message {
  role: string;
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

interface NavbarProps {
  onClearChat: () => void;
  onNewChat: () => void;
  chatHistory: Message[];
  allSessions: ChatSession[]; // ✅ FIXED
  onChatClick: (session: ChatSession) => void; // ✅ FIXED
}
// interface NavbarProps {
//   onClearChat: () => void;
//   onNewChat: () => void;
//   chatHistory: { role: string; content: string }[];
//   allSessions: { id: string; messages: { role: string; content: string }[] }[];
//   onChatClick: (session: { id: string; messages: { role: string; content: string }[] }) => void;
// }

export default function Navbar({
  onClearChat,
  onNewChat,
  // chatHistory,
  allSessions,
  onChatClick,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use toggleTheme here
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    // { name: 'Login', path: '/login' },
    // { name: 'Signup', path: '/signup' },
  ];

  const isActive = (path: string) => pathname === path;
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme && storedTheme !== theme) {
      toggleTheme(); // ✅ Only toggles if needed
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [theme, toggleTheme]); // ✅ Safe and clean

  useEffect(() => {
    // Save the theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <header
        className={`p-3 fixed top-0 left-0 w-full z-50 ${
          theme === "dark" ? "bg-slate-900" : "bg-white shadow-md"
        } transition-colors duration-300`}
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Sidebar + Brand */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-800 dark:text-white"
              title="Open Sidebar"
            >
              <LayoutGrid className="h-7 w-7" />
            </button>

            <Link
              href="/"
              className={`text-2xl font-bold tracking-tight ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Smarty
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`transition-all duration-200 px-2
                    ${
                      isActive(link.path)
                        ? "font-semibold text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }
                    hover:text-blue-600 hover:scale-[1.05]`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </li>

            <li>
              <button
                onClick={onClearChat}
                title="Clear Chat"
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition"
              >
                <Trash2 className="w-6 h-6 text-red-500" />
              </button>
            </li>
            {/* Notifications */}
            <li className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all relative"
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 z-50" ref={notifRef}>
                  <Notification
                    isOpen={isNotifOpen}
                    setIsOpen={setIsNotifOpen}
                  />
                </div>
              )}
            </li>

            {/* Profile Dropdown */}
            <li className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all"
                title="Profile"
              >
                <UserCircle className="w-7 h-7" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <ul ref={profileRef}>
                    <Profile
                      isOpen={isProfileOpen}
                      setIsOpen={setIsProfileOpen}
                    />
                  </ul>
                </div>
              )}
            </li>
          </ul>

          {/* Mobile: Hamburger + Theme */}
          {/* Mobile: Hamburger + Theme + Notif + Profile */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {/* Notifications - Mobile */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all relative"
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 z-50" ref={notifRef}>
                  <Notification
                    isOpen={isNotifOpen}
                    setIsOpen={setIsNotifOpen}
                  />
                </div>
              )}
            </div>

            {/* Profile - Mobile */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all"
                title="Profile"
              >
                <UserCircle className="w-7 h-7" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <ul ref={profileRef}>
                    <Profile
                      isOpen={isProfileOpen}
                      setIsOpen={setIsProfileOpen}
                    />
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
              title="Menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-3xl" />
              ) : (
                <FaBars className="text-3xl" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`absolute top-20 right-4 w-48 p-6 rounded-xl shadow-xl ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            } transition-all duration-300`}
          >
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`block text-base transition-all duration-200
                      ${
                        isActive(link.path)
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }
                      hover:text-blue-600 hover:scale-[1.05]`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <li className="flex gap-4 items-center">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-600" />
                  )}
                </button>
                <button
                  onClick={onClearChat}
                  className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={onNewChat}
        // chatHistory={chatHistory}
        allSessions={allSessions}
        onChatClick={(session) =>
          onChatClick({
            ...session,
            title: "Untitled Chat", // ✅ Fallback title added
          })
        }
      />
    </>
  );
}
