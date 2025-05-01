import React from 'react';
import { Bell, MessageCircle, UserCheck, AlertTriangle } from 'lucide-react'; // Optional: install lucide-react for icons

interface NotificationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Notification: React.FC<NotificationProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
      title: 'New Message',
      description: 'You have received a new message.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-green-500" />,
      title: 'Profile Updated',
      description: 'Your profile information was updated.',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      title: 'System Alert',
      description: 'Your session will expire in 5 minutes.',
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 shadow-lg rounded-xl z-50 border border-gray-200 dark:border-slate-700">
      <ul className="divide-y divide-gray-100 dark:divide-slate-700">
        {notifications.map((n, index) => (
          <li key={index} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex gap-3 items-start">
            <div>{n.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{n.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">{n.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-3 text-center border-t border-gray-200 dark:border-slate-700">
        <button className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">View All</button>
      </div>
    </div>
  );
};

export default Notification;
