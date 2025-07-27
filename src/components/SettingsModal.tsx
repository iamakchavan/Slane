import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [accentColor, setAccentColor] = useState('blue');
  const [transparentSidebar, setTransparentSidebar] = useState(false);
  
  // Profile settings
  const [displayName, setDisplayName] = useState('Bittu Creators');
  const [email, setEmail] = useState('bittucreators@gmail.com');
  const [timezone, setTimezone] = useState('utc');
  
  // Account settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [taskReminders, setTaskReminders] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleResetDefaults = () => {
    setTheme('system');
    setLanguage('english');
    setAccentColor('blue');
    setTransparentSidebar(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'account', label: 'Account' },
  ];

  const themes = [
    { id: 'system', label: 'System', preview: 'bg-gradient-to-br from-gray-100 to-gray-200' },
    { id: 'light', label: 'Light', preview: 'bg-white border border-gray-200' },
    { id: 'dark', label: 'Dark', preview: 'bg-gray-900 border border-gray-700' },
  ];

  const accentColors = [
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'orange', color: 'bg-orange-500' },
    { id: 'pink', color: 'bg-pink-500' },
    { id: 'green', color: 'bg-green-500' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className={`bg-white text-gray-900 rounded-sm shadow-2xl w-full max-w-2xl mx-2 sm:mx-4 flex flex-col border border-gray-100 transition-all duration-300 ease-out transform max-h-[90vh] ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 h-8 w-8 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 max-h-96 overflow-y-auto scrollbar-minimal">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Language
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select the language of the platform
                </p>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interface Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Interface theme
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Customize your application theme
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className={`relative p-3 rounded-sm border-2 transition-all ${
                        theme === themeOption.id
                          ? 'border-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-sm mb-2 ${themeOption.preview}`}>
                        <div className="p-2 space-y-1">
                          <div className="w-8 h-1 bg-gray-400 rounded"></div>
                          <div className="w-12 h-1 bg-gray-300 rounded"></div>
                          <div className="w-6 h-1 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {themeOption.label}
                      </span>
                      {theme === themeOption.id && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Accent color
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select your application accent color
                </p>
                <div className="flex space-x-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccentColor(color.id)}
                      className={`w-8 h-8 rounded-full ${color.color} transition-all ${
                        accentColor === color.id
                          ? 'ring-2 ring-offset-2 ring-gray-400'
                          : 'hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Transparent Sidebar */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Transparent sidebar
                  </label>
                  <p className="text-xs text-gray-500">
                    Add a transparency layer to your sidebar
                  </p>
                </div>
                <button
                  onClick={() => setTransparentSidebar(!transparentSidebar)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    transparentSidebar ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      transparentSidebar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Profile Picture
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload a profile picture to personalize your account
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/inbox-2.png" alt="Profile" />
                    <AvatarFallback className="text-lg bg-gray-100 text-gray-600">BC</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload new
                  </Button>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Display Name
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  This is how your name will appear in the application
                </p>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Your email address for account notifications
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                />
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Timezone
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select your timezone for accurate task scheduling
                </p>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-full border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                    <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Account Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Current Plan
                </label>
                <div className="p-4 bg-blue-50/50 rounded-sm border border-blue-100/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Free Plan</p>
                      <p className="text-xs text-blue-600">Basic features with limited storage</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8 px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive email updates about your tasks and account
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Auto Save
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically save your work as you type
                  </p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSave ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Task Reminders */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Task Reminders
                  </label>
                  <p className="text-xs text-gray-500">
                    Get reminded about upcoming task deadlines
                  </p>
                </div>
                <button
                  onClick={() => setTaskReminders(!taskReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    taskReminders ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      taskReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Danger Zone
                </label>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    Export All Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 h-auto text-xs sm:text-sm rounded-sm transition-colors flex items-center gap-2 justify-center sm:justify-start"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset to defaults</span>
            <span className="sm:hidden">Reset</span>
          </Button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 sm:px-4 py-2 h-auto text-xs sm:text-sm rounded-sm transition-colors flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleClose}
              className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 h-auto text-xs sm:text-sm shadow-sm rounded-sm transition-all flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">Save preferences</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};