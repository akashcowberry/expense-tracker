import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Monitor, Save, User, Bell, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { isDark, toggleTheme, setTheme, theme } = useTheme();

  const themeOptions = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Light theme' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme' },
    { id: 'system', name: 'System', icon: Monitor, description: 'Use system preference' }
  ];

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Sun,
      items: [
        {
          name: 'Theme',
          description: 'Customize how the app looks',
          component: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (option.id === 'system') {
                      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      setTheme(systemIsDark ? 'dark' : 'light');
                    } else {
                      setTheme(option.id);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    (option.id === 'system' ? theme === (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme === option.id)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <option.icon 
                    className={`w-6 h-6 mb-2 ${
                      (option.id === 'system' ? theme === (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme === option.id)
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} 
                  />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        }
      ]
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          name: 'Profile Information',
          description: 'Update your personal information',
          action: () => console.log('Edit profile')
        },
        {
          name: 'Change Password',
          description: 'Update your password',
          action: () => console.log('Change password')
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          name: 'Email Notifications',
          description: 'Manage email alerts',
          action: () => console.log('Email settings')
        },
        {
          name: 'Push Notifications',
          description: 'Control push notifications',
          action: () => console.log('Push settings')
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        {
          name: 'Two-Factor Authentication',
          description: 'Add extra security to your account',
          action: () => console.log('2FA settings')
        },
        {
          name: 'Login History',
          description: 'View your recent login activity',
          action: () => console.log('Login history')
        }
      ]
    },
    {
      title: 'Billing',
      icon: CreditCard,
      items: [
        {
          name: 'Payment Methods',
          description: 'Manage your payment options',
          action: () => console.log('Payment methods')
        },
        {
          name: 'Billing History',
          description: 'View your payment history',
          action: () => console.log('Billing history')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your account settings and preferences
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Quick Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Theme Switch
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Toggle between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span
                className={`${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
              <Sun
                size={14}
                className={`absolute left-1 top-1 text-gray-500 transition-opacity ${
                  isDark ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <Moon
                size={14}
                className={`absolute right-1 top-1 text-gray-500 transition-opacity ${
                  isDark ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Section Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* Section Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                      
                      {item.component ? (
                        item.component
                      ) : (
                        <button
                          onClick={item.action}
                          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          Manage
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current Theme Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-yellow-400' : 'bg-blue-500'
            }`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current theme: <strong className="text-gray-900 dark:text-white">{theme}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}