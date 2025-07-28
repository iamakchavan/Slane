import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Settings, Trash2, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onCreateTask: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onCreateTask,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'new-task',
      label: 'Create New Task',
      icon: Plus,
      action: () => {
        onCreateTask();
        handleClose();
      },
      shortcut: 'T'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => {
        onOpenSettings();
        handleClose();
      }
    },
    {
      id: 'filter-all',
      label: 'Show All Tasks',
      icon: Filter,
      action: () => {
        // Add filter logic here
        handleClose();
      }
    },
    {
      id: 'clear-completed',
      label: 'Clear Completed',
      icon: Trash2,
      action: () => {
        // Add clear completed logic here
        handleClose();
      }
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-start justify-center pt-24 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className={`bg-white dark:bg-[#2c2c2e] w-full max-w-xl mx-4 flex flex-col border border-gray-200/60 dark:border-[#3a3a3c] shadow-2xl rounded-sm transition-all duration-300 ease-out transform ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Search Input */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200/60 dark:border-[#3a3a3c]">
          <Search className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6] mr-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 dark:placeholder-[#6d6d70] text-gray-900 dark:text-white"
            style={{ caretColor: theme === 'dark' ? '#ffffff' : '#374151' }}
          />
          <div className="flex items-center gap-1 ml-4">
            <kbd className="px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-[#1c1c1e] text-gray-600 dark:text-[#a1a1a6] border border-gray-200 dark:border-[#3a3a3c] rounded-sm font-medium">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="overflow-y-auto scrollbar-minimal">
          {filteredCommands.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-[#6d6d70]">
              <Search className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-[#6d6d70]" />
              <p className="text-sm">No commands found</p>
            </div>
          ) : (
            <div className="py-3">
              {filteredCommands.map((command, index) => {
                const IconComponent = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className={`w-full flex items-center px-6 py-3 text-left transition-all duration-150 ${
                      index === selectedIndex
                        ? 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-[#3a3a3c]/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-5 h-5 mr-4">
                      <IconComponent className={`w-4 h-4 ${
                        index === selectedIndex ? 'text-gray-600 dark:text-white' : 'text-gray-400 dark:text-[#a1a1a6]'
                      }`} />
                    </div>
                    <span className="flex-1 text-sm font-normal leading-relaxed">
                      {command.label}
                    </span>
                    {command.shortcut && (
                      <kbd className="px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-[#1c1c1e] text-gray-600 dark:text-[#a1a1a6] border border-gray-200 dark:border-[#3a3a3c] rounded-sm font-medium ml-4">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200/60 dark:border-[#3a3a3c] bg-gray-50/50 dark:bg-[#1c1c1e]/50">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-[#6d6d70]">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] rounded-sm font-medium text-gray-600 dark:text-[#a1a1a6]">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] rounded-sm font-medium text-gray-600 dark:text-[#a1a1a6]">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] rounded-sm font-medium text-gray-600 dark:text-[#a1a1a6]">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};