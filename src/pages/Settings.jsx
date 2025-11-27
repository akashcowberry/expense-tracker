import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Bell, 
  Shield, 
  User, 
  Lock, 
  Palette, 
  Globe, 
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RotateCcw
} from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    transactionAlerts: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    twoFactorAuth: false
  });
  const [language, setLanguage] = useState('en');
  const [exportData, setExportData] = useState({
    format: 'json',
    includeAttachments: false
  });
  const [security, setSecurity] = useState({
    autoLogout: true,
    sessionTimeout: 30,
    showSensitiveData: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotifications(settings.notifications || notifications);
      setPrivacy(settings.privacy || privacy);
      setLanguage(settings.language || language);
      setSecurity(settings.security || security);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    showSaveStatus('Theme updated!');
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const showSaveStatus = (message) => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const saveAllSettings = () => {
    setIsLoading(true);
    
    const allSettings = {
      theme,
      notifications,
      privacy,
      language,
      security,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('appSettings', JSON.stringify(allSettings));
    
    setTimeout(() => {
      setIsLoading(false);
      showSaveStatus('All settings saved successfully!');
    }, 1000);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setTheme('light');
      setNotifications({
        email: true,
        push: true,
        sms: false,
        transactionAlerts: true
      });
      setPrivacy({
        profileVisibility: 'public',
        dataSharing: false,
        twoFactorAuth: false
      });
      setLanguage('en');
      setSecurity({
        autoLogout: true,
        sessionTimeout: 30,
        showSensitiveData: false
      });
      showSaveStatus('Settings reset to defaults!');
    }
  };

  const exportUserData = () => {
    const userData = {
      settings: {
        theme,
        notifications,
        privacy,
        language,
        security
      },
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `app-settings-backup-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSaveStatus('Settings exported successfully!');
  };

  const cardStyle = "p-6 shadow-xl rounded-xl backdrop-blur-xl bg-white/80 border border-white/40 text-gray-900";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your application preferences and security settings
              </p>
            </div>
            
            {/* Save Status */}
            {saveStatus && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
                {saveStatus}
              </div>
            )}
          </div>
        </div>

        {/* Theme Settings */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Theme & Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                  theme === 'light' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </button>
              
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                  theme === 'dark' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose how the app looks. Dark mode is easier on the eyes in low light.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {key === 'transactionAlerts' 
                      ? 'Get notified for new transactions' 
                      : `Receive ${key} notifications`}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Privacy & Security</h2>
          </div>
          
          <div className="space-y-6">
            {/* Profile Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="contacts">Contacts Only</option>
              </select>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handlePrivacyChange('twoFactorAuth', !privacy.twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Sensitive Data */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Show Sensitive Data</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {security.showSensitiveData ? 'Amounts are visible' : 'Amounts are hidden'}
                </p>
              </div>
              <button
                onClick={() => handleSecurityChange('showSensitiveData', !security.showSensitiveData)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                {security.showSensitiveData ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Auto Logout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto Logout After {security.sessionTimeout} minutes
              </label>
              <input
                type="range"
                min="5"
                max="120"
                value={security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Language & Region</h2>
          </div>
          
          <div className="space-y-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी</option>
            </select>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred language for the application interface.
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={exportUserData}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Settings Data
            </button>
            
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Upload className="w-5 h-5" />
                Import Settings
              </button>
              
              <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-5 h-5" />
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={saveAllSettings}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isLoading ? 'Saving...' : 'Save All Changes'}
          </button>
          
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Defaults
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          <p>App Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}