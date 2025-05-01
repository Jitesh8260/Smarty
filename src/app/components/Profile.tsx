import React, { useState } from 'react';
import {
  User,
  Settings,
  LogOut,
} from 'lucide-react'; // Lucide icons

interface ProfileProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'profile' | 'settings'>('main');
  const [name, setName] = useState('Jitesh Bhakat');
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState<'Light' | 'Dark'>('Light');

  if (!isOpen) return null;

  const handleLogout = () => {
    alert('Logged out!');
    setIsOpen(false);
  };

  const renderMainMenu = () => (
    <ul className="space-y-2">
      <li>
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <User className="w-4 h-4" />
          My Profile
        </button>
      </li>
      <li>
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </li>
    </ul>
  );

  const renderProfile = () => (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-100">
      <h3 className="text-base font-semibold">Edit Profile</h3>
      <div className="flex flex-col items-center gap-2">
        <img src="user.png" alt="Profile" className="w-20 h-20 rounded-full border dark:border-slate-600" />
        <input
          className="w-full bg-gray-100 dark:bg-slate-700 text-sm px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
      </div>
      <button
        onClick={() => setActiveTab('main')}
        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md"
      >
        Save
      </button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-100">
      <h3 className="text-base font-semibold">Settings</h3>
      <div>
        <label className="block mb-1 font-medium">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-md outline-none"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Odia</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'Light' | 'Dark')}
          className="w-full bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-md outline-none"
        >
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
      <button
        onClick={() => setActiveTab('main')}
        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md"
      >
        Save 
      </button>
    </div>
  );

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 z-50 border border-gray-200 dark:border-slate-700 space-y-4">
      {activeTab === 'main' && renderMainMenu()}
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default Profile;
