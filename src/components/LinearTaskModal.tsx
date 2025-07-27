import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface LinearTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: {
    title: string;
    description: string;
    status: string;
    priority: 'none' | 'low' | 'medium' | 'high';
  }) => void;
}

export const LinearTaskModal: React.FC<LinearTaskModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [isVisible, setIsVisible] = useState(false);
  const [isPriorityChanging, setIsPriorityChanging] = useState(false);
  const [displayedPriority, setDisplayedPriority] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('none');
      setDisplayedPriority('none');
      setIsPriorityChanging(false);
      setIsTextTransitioning(false);

      // Trigger opening animation
      setIsVisible(true);

      // Focus title field after animation starts
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 150);

      // Add global keyboard listener for modal shortcuts
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          if (title.trim()) {
            handleCreateTask();
          }
        }
      };

      document.addEventListener('keydown', handleGlobalKeyDown);

      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
      };
    } else {
      // Trigger closing animation
      setIsVisible(false);
    }
  }, [isOpen]);

  // Sync displayedPriority with priority on initial load
  useEffect(() => {
    if (!isTextTransitioning) {
      setDisplayedPriority(priority);
    }
  }, [priority, isTextTransitioning]);

  const handleCreateTask = useCallback(() => {
    if (title.trim()) {
      onCreateTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  }, [title, description, status, priority, onCreateTask, onClose]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (title.trim()) {
        handleCreateTask();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-24 transition-all duration-300 ease-out ${isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
        }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`bg-white text-gray-900 rounded-sm shadow-2xl w-full max-w-md mx-4 flex flex-col border border-gray-100 transition-all duration-300 ease-out transform ${isVisible
          ? 'scale-100 opacity-100 translate-y-0'
          : 'scale-95 opacity-0 translate-y-4'
          }`}
      >
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <h2 className="text-base font-medium text-gray-800">New Task</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 h-7 w-7 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Minimal Content */}
        <div className="p-4 space-y-4">
          {/* Title Field */}
          <div className="relative">
            <input
              ref={titleRef as any}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full text-base font-medium text-gray-900 bg-transparent border-none outline-none min-h-[24px] leading-snug placeholder-gray-400"
              style={{ caretColor: '#374151' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  descriptionRef.current?.focus();
                }
                handleKeyDown(e);
              }}
            />
          </div>

          {/* Description Field */}
          <div className="relative">
            <textarea
              ref={descriptionRef as any}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description…"
              className="w-full text-sm text-gray-600 bg-transparent border-none outline-none min-h-[60px] leading-relaxed resize-none placeholder-gray-400"
              style={{ caretColor: '#374151' }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Minimal Toolbar */}
          <div className="flex items-center space-x-2 pt-2">
            {/* Priority Button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 h-auto rounded-sm transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => {
                setIsPriorityChanging(true);
                setIsTextTransitioning(true);

                const priorities: Array<'none' | 'low' | 'medium' | 'high'> = ['none', 'low', 'medium', 'high'];
                const currentIndex = priorities.indexOf(priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                const nextPriority = priorities[nextIndex];

                // Smooth text transition with blur effect
                setTimeout(() => {
                  // First: blur out current text
                  setIsTextTransitioning(true);
                }, 50);

                setTimeout(() => {
                  // Then: change the text while blurred
                  setPriority(nextPriority);
                  setDisplayedPriority(nextPriority);
                }, 100);

                setTimeout(() => {
                  // Finally: blur back in with new text
                  setIsTextTransitioning(false);
                  setIsPriorityChanging(false);
                }, 200);
              }}
            >
              <div className={`flex space-x-0.5 transition-transform duration-100 ${isPriorityChanging ? 'scale-95' : 'scale-100'
                }`}>
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${priority === 'none'
                  ? 'bg-gray-300 scale-110'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${['low', 'medium', 'high'].includes(priority)
                  ? 'bg-yellow-400 scale-110 shadow-sm'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${['medium', 'high'].includes(priority)
                  ? 'bg-orange-400 scale-110 shadow-sm'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${priority === 'high'
                  ? 'bg-red-400 scale-110 shadow-sm'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-xs transition-all duration-200 ease-out transform ${displayedPriority !== 'none' ? 'font-medium text-gray-700' : 'font-normal text-gray-500'
                } ${isTextTransitioning
                  ? 'blur-sm scale-95 opacity-70'
                  : 'blur-0 scale-100 opacity-100'
                }`}>
                {displayedPriority === 'none' ? 'Priority' : displayedPriority.charAt(0).toUpperCase() + displayedPriority.slice(1)}
              </span>
            </Button>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-25 border-t border-gray-50 rounded-b-sm">
          <div className="text-xs text-gray-400">
            esc to close
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 h-auto text-xs rounded-sm transition-colors"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateTask}
              disabled={!title.trim()}
              className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 h-auto text-xs disabled:bg-gray-200 disabled:text-gray-400 shadow-sm rounded-sm transition-all flex items-center gap-2"
            >
              Create
              <span className="text-xs opacity-70 font-normal">
                {/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) ? '⌘↵' : 'Ctrl+↵'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 