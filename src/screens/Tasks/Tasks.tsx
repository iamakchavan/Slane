import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  PanelLeftIcon,
  X,
  Settings,
  Edit,
  Copy,
  Trash2,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";

import { LinearTaskModal } from "../../components/LinearTaskModal";
import { PricingModal } from "../../components/PricingModal";
import { SettingsModal } from "../../components/SettingsModal";
import { CommandPalette } from "../../components/CommandPalette";
import { EditTaskModal } from "../../components/EditTaskModal";
import { useTheme } from "../../contexts/ThemeContext";
import { getPriorityColors } from "../../lib/theme-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export const Tasks = (): JSX.Element => {
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Priority animation states
  const [changingPriorities, setChangingPriorities] = useState<Set<string>>(new Set());
  const [transitioningPriorities, setTransitioningPriorities] = useState<Set<string>>(new Set());

  // Task data for the main content with proper state management
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Review project proposal for the new marketing campaign.",
      description: "Go through the complete marketing proposal and provide detailed feedback on strategy, budget allocation, and timeline.",
      completed: false,
      priority: "high",
    },
    {
      id: "2",
      name: "Schedule a meeting with the design team for feedback.",
      description: "Set up a meeting to discuss the latest design iterations and gather feedback from the team.",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      name: "Have to create wireframes for the mobile app",
      description: "Design low-fidelity wireframes for the main user flows in the mobile application.",
      completed: false,
      priority: "low",
    },
    {
      id: "4",
      name: "Compile user feedback from the latest product release.",
      description: "Gather and organize all user feedback received since the last release to identify key improvement areas.",
      completed: true,
      priority: "medium",
    },
  ]);

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    return getPriorityColors(priority, theme);
  };

  // Sidebar filter state
  const [activeFilter, setActiveFilter] = useState("1");
  const [showAccountUI, setShowAccountUI] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // For smooth account panel close animation
  const [isAccountPanelVisible, setIsAccountPanelVisible] = useState(false);
  const [isAccountPanelClosing, setIsAccountPanelClosing] = useState(false);

  // Handle mounting/unmounting for animation
  useEffect(() => {
    if (showAccountUI) {
      setIsAccountPanelVisible(true);
      setIsAccountPanelClosing(false);
    } else if (isAccountPanelVisible) {
      setIsAccountPanelClosing(true);
      const timeout = setTimeout(() => {
        setIsAccountPanelVisible(false);
        setIsAccountPanelClosing(false);
      }, 300); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [showAccountUI]);

  // Computed sidebar data based on current tasks
  const sidebarItems = [
    { id: "1", name: "All Tasks", selected: activeFilter === "1", count: tasks.length },
    { id: "2", name: "Active", selected: activeFilter === "2", count: tasks.filter(t => !t.completed).length },
    { id: "3", name: "Completed", selected: activeFilter === "3", count: tasks.filter(t => t.completed).length },
    { id: "4", name: "High Priority", selected: activeFilter === "4", count: tasks.filter(t => t.priority === "high").length },
  ];

  // Filter tasks based on active filter
  const filteredTasks = (() => {
    switch (activeFilter) {
      case "2": return tasks.filter(t => !t.completed);
      case "3": return tasks.filter(t => t.completed);
      case "4": return tasks.filter(t => t.priority === "high");
      default: return tasks;
    }
  })();



  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const createNewTask = (taskData: {
    title: string;
    description: string;
    status: string;
    priority: 'none' | 'low' | 'medium' | 'high';
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskData.title,
      description: taskData.description || undefined,
      completed: false,
      priority: taskData.priority === 'none' ? 'low' : taskData.priority,
    };
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const duplicateTask = (taskId: string) => {
    const taskToDuplicate = tasks.find(task => task.id === taskId);
    if (taskToDuplicate) {
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        name: `${taskToDuplicate.name} (Copy)`,
        completed: false,
      };
      setTasks([duplicatedTask, ...tasks]);
    }
  };

  const editTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTaskModalOpen(true);
  };

  const closeEditModal = () => {
    setEditTaskModalOpen(false);
    setEditingTask(null);
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const cyclePriority = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Add to changing priorities set
    setChangingPriorities(prev => new Set(prev).add(taskId));
    setTransitioningPriorities(prev => new Set(prev).add(taskId));

    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(task.priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    const nextPriority = priorities[nextIndex];

    // Smooth transition with blur effect (same timing as modal)
    setTimeout(() => {
      // Update the task priority
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, priority: nextPriority } : t
      ));
    }, 100);

    setTimeout(() => {
      // Remove from transitioning set
      setTransitioningPriorities(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      setChangingPriorities(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }, 200);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Command Palette shortcut (Ctrl+K or Cmd+K)
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        setCommandPaletteOpen(true);
        return;
      }

      // Check if T key is pressed (case insensitive)
      if (event.key.toLowerCase() === 't') {
        // Check if any modifier keys are pressed
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
          return;
        }

        // Check if user is typing in an input field
        const activeElement = document.activeElement;
        if (activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).contentEditable === 'true'
        )) {
          return;
        }

        // All checks passed - open modal
        event.preventDefault();
        event.stopPropagation();
        setNewTaskModalOpen(true);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div className="bg-gray-50/30 dark:bg-[#161618] flex w-full min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        flex flex-col min-h-screen bg-white dark:bg-[#1c1c1e] border-r border-gray-200/60 dark:border-[#3a3a3c]
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-72
        shadow-sm lg:shadow-none
      `}>
        <div className="flex flex-col h-full px-4 py-4 w-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-between w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent group">
                    <div className="flex items-center gap-3">
                      <img src="/Slane.png" alt="Slane" className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-normal text-sm text-gray-900 dark:text-white">Slane</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6] group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 shadow-sm border-gray-200/60 dark:border-[#3a3a3c] rounded-sm bg-white dark:bg-[#2c2c2e]">

                  <DropdownMenuItem
                    className="text-sm flex items-center gap-3"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 hover:bg-gray-100/60 rounded-sm transition-colors lg:hidden"
              >
                <PanelLeftIcon className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center px-3 py-2 border border-gray-200/60 dark:border-[#3a3a3c] bg-gray-50/50 dark:bg-[#2c2c2e] hover:bg-gray-100/50 dark:hover:bg-[#3a3a3c] focus:border-gray-300 dark:focus:border-[#48484a] focus:ring-1 focus:ring-gray-300/50 dark:focus:ring-[#48484a]/50 text-sm h-9 rounded-sm transition-all text-left"
            >
              <SearchIcon className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6] mr-3" />
              <span className="text-gray-400 dark:text-[#a1a1a6]">Search</span>
              <div className="ml-auto">
                <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-[#1c1c1e] text-gray-500 dark:text-[#a1a1a6] border border-gray-200 dark:border-[#3a3a3c] rounded">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Main Content Area - Flex 1 to push user profile to bottom */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <div className="space-y-3 mb-6">
                {/* Tasks Header */}
                <div className="flex items-center justify-between">
                  <span className="font-normal text-sm text-gray-900 dark:text-white">Filters</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6]" />
                </div>

                {/* Task List */}
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveFilter(item.id)}
                      className={`flex items-center justify-between p-2.5 rounded-sm text-sm transition-all hover:bg-gray-100/40 dark:hover:bg-[#2c2c2e] cursor-pointer ${item.selected ? "bg-gray-100/80 dark:bg-[#2c2c2e]" : ""
                        }`}
                    >
                      <span className="text-gray-700 dark:text-[#a1a1a6] truncate text-sm font-normal">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-[#6d6d70] bg-gray-100 dark:bg-[#2c2c2e] px-2 py-0.5 rounded-sm">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile - Positioned at bottom */}
            <div className="border-t border-gray-200/60 dark:border-[#3a3a3c] pt-4 mt-auto pb-1">
              {!showAccountUI ? (
                <div
                  className="flex items-center gap-3 p-2.5 rounded-sm hover:bg-gray-100/40 dark:hover:bg-[#2c2c2e] cursor-pointer transition-colors"
                  onClick={() => setShowAccountUI(true)}
                >
                  <Avatar className="w-8 h-8 shadow-sm">
                    <AvatarImage src="/inbox-2.png" alt="User avatar" />
                    <AvatarFallback className="text-xs bg-gray-100 dark:bg-[#3a3a3c] text-gray-600 dark:text-[#a1a1a6] font-normal">BC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-normal truncate text-gray-900 dark:text-white">
                      Bittu Creators
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">
                      Free Plan
                    </p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6]" />
                </div>
              ) : (
                isAccountPanelVisible && (
                  <div
                    className={`transition-all duration-300 ease-out transform ${isAccountPanelClosing
                      ? 'opacity-0 translate-y-6 pointer-events-none'
                      : 'opacity-100 translate-y-0'
                      }`}
                    style={{
                      animation: !isAccountPanelClosing ? 'fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1)' : undefined
                    }}
                  >
                    <style>{`
                      @keyframes fadeInUp {
                        0% { opacity: 0; transform: translateY(24px); }
                        100% { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>
                    <div className="space-y-4">
                      {/* Account Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Account</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowAccountUI(false)}
                          className="w-6 h-6 hover:bg-gray-100/60 dark:hover:bg-[#3a3a3c] rounded-sm"
                        >
                          <X className="w-3 h-3 text-gray-400 dark:text-[#a1a1a6]" />
                        </Button>
                      </div>

                      {/* Profile Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2.5 bg-gray-50/50 dark:bg-[#2c2c2e] rounded-sm">
                          <Avatar className="w-10 h-10 shadow-sm">
                            <AvatarImage src="/inbox-2.png" alt="User avatar" />
                            <AvatarFallback className="text-sm bg-gray-100 dark:bg-[#3a3a3c] text-gray-600 dark:text-[#a1a1a6] font-normal">BC</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Bittu Creators
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">
                              bittucreators@gmail.com
                            </p>
                          </div>
                        </div>

                        {/* Plan Info */}
                        <div className="p-2.5 bg-blue-50/50 dark:bg-blue-900/20 rounded-sm border border-blue-100/50 dark:border-blue-800/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-blue-900 dark:text-blue-400">Free Plan</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">Basic features</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-3 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                              onClick={() => setShowPricingModal(true)}
                            >
                              Upgrade
                            </Button>
                          </div>
                        </div>

                        {/* Account Actions */}
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSettingsModal(true)}
                            className="w-full justify-start text-sm h-9 px-2.5 hover:bg-gray-100/60 dark:hover:bg-[#3a3a3c] rounded-sm flex items-center gap-3 text-gray-700 dark:text-[#a1a1a6]"
                          >
                            <Settings className="w-4 h-4 text-gray-500 dark:text-[#a1a1a6]" />
                            Settings
                          </Button>

                          <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9 px-2.5 hover:bg-gray-100/60 dark:hover:bg-red-900/20 rounded-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/30 flex items-center gap-3">
                            <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-[#161618] min-w-0 transition-all duration-300 ease-in-out h-screen ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200/60 dark:border-[#3a3a3c] bg-white dark:bg-[#1c1c1e]">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 hover:bg-gray-100/60 dark:hover:bg-[#2c2c2e] rounded-sm transition-colors"
            >
              <PanelLeftIcon className="w-4 h-4 text-gray-600 dark:text-[#a1a1a6]" />
            </Button>
            <h1 className="text-xl font-normal text-gray-900 dark:text-white">Tasks</h1>
            <span className="text-xs text-gray-400 dark:text-[#6d6d70] ml-2">Press T to create task</span>
          </div>

          <div className="flex items-center gap-3">
            {/* New Task Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewTaskModalOpen(true)}
              className="gap-2 border-gray-200/60 dark:border-[#3a3a3c] hover:bg-gray-50/60 dark:hover:bg-[#2c2c2e] text-sm font-normal rounded-sm h-9 px-4 shadow-none hover:shadow-none transition-all text-gray-900 dark:text-white"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New task</span>
              <span className="hidden lg:inline text-xs text-gray-400 dark:text-[#6d6d70] ml-1">(T)</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Task Content */}
        <div className="flex-1 overflow-y-auto scrollbar-minimal p-6 bg-gray-50/30 dark:bg-[#161618]">
          <div className="border border-gray-200/60 dark:border-[#3a3a3c] rounded-sm bg-white dark:bg-[#1c1c1e] shadow-sm hover:shadow-sm transition-shadow">
            {/* Sticky Desktop Table Header */}
            <div className="hidden md:flex items-center gap-4 p-4 border-b border-gray-200/60 dark:border-[#3a3a3c] bg-gray-50/20 dark:bg-[#2c2c2e]/20 sticky top-0 z-10">
              <Checkbox className="border-gray-300/80 dark:border-[#6d6d70] data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-white" />
              <div className="flex-1">
                <span className="font-normal text-sm text-gray-600 dark:text-[#a1a1a6]">Name</span>
              </div>
              <div className="w-24">
                <span className="font-normal text-sm text-gray-600 dark:text-[#a1a1a6]">Priority</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Scrollable Task Rows */}
            <div className="divide-y divide-gray-200/40 dark:divide-[#3a3a3c]/40 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-minimal">
              {filteredTasks.map((task) => (
                <div key={task.id} className="group hover:bg-gray-50/30 dark:hover:bg-[#2c2c2e]/30 transition-colors">
                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-4 p-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-gray-300/80 dark:border-[#6d6d70] data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm leading-6 cursor-pointer ${task.completed
                          ? "text-gray-500 dark:text-[#6d6d70] line-through"
                          : "text-gray-900 dark:text-white"
                          }`}
                        onClick={() => task.description && toggleTaskExpansion(task.id)}
                      >
                        {task.name}
                        {task.description && (
                          <span className="ml-2 text-xs text-gray-400 dark:text-[#6d6d70]">
                            {expandedTasks.has(task.id) ? '▼' : '▶'}
                          </span>
                        )}
                      </div>
                      {task.description && expandedTasks.has(task.id) && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-[#a1a1a6] leading-relaxed">
                          {task.description}
                        </div>
                      )}
                    </div>
                    <div className="w-24">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cyclePriority(task.id);
                        }}
                        className={`text-xs font-normal px-2 py-0.5 rounded-sm border transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${getPriorityColor(task.priority)} ${changingPriorities.has(task.id) ? 'animate-pulse' : ''
                          }`}
                      >
                        <span className={`transition-all duration-200 ease-out transform ${transitioningPriorities.has(task.id)
                          ? 'blur-sm scale-95 opacity-70'
                          : 'blur-0 scale-100 opacity-100'
                          }`}>
                          {task.priority}
                        </span>
                      </button>
                    </div>
                    <div className="w-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 hover:bg-gray-100/60 dark:hover:bg-[#2c2c2e] opacity-0 group-hover:opacity-100 transition-all rounded-sm"
                          >
                            <MoreHorizontalIcon className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="shadow-sm border-gray-200/60 rounded-sm">
                          <DropdownMenuItem
                            className="text-sm flex items-center gap-3"
                            onClick={() => openEditModal(task)}
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-sm flex items-center gap-3"
                            onClick={() => duplicateTask(task.id)}
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 text-sm flex items-center gap-3"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="border-gray-300/80 dark:border-[#6d6d70] data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-white mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm leading-6 cursor-pointer ${task.completed
                            ? "text-gray-500 dark:text-[#6d6d70] line-through"
                            : "text-gray-900 dark:text-white"
                            }`}
                          onClick={() => task.description && toggleTaskExpansion(task.id)}
                        >
                          {task.name}
                          {task.description && (
                            <span className="ml-2 text-xs text-gray-400">
                              {expandedTasks.has(task.id) ? '▼' : '▶'}
                            </span>
                          )}
                        </div>
                        {task.description && expandedTasks.has(task.id) && (
                          <div className="mt-2 text-xs text-gray-600 dark:text-[#a1a1a6] leading-relaxed">
                            {task.description}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 hover:bg-gray-100/60 dark:hover:bg-[#2c2c2e] -mr-2 rounded-sm"
                          >
                            <MoreHorizontalIcon className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="shadow-sm border-gray-200/60 rounded-sm">
                          <DropdownMenuItem
                            className="text-sm flex items-center gap-3"
                            onClick={() => openEditModal(task)}
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-sm flex items-center gap-3"
                            onClick={() => duplicateTask(task.id)}
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 text-sm flex items-center gap-3"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between pl-7">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cyclePriority(task.id);
                        }}
                        className={`text-xs font-normal px-2 py-0.5 rounded-sm border transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${getPriorityColor(task.priority)} ${changingPriorities.has(task.id) ? 'animate-pulse' : ''
                          }`}
                      >
                        <span className={`transition-all duration-200 ease-out transform ${transitioningPriorities.has(task.id)
                          ? 'blur-sm scale-95 opacity-70'
                          : 'blur-0 scale-100 opacity-100'
                          }`}>
                          {task.priority}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Linear Task Modal */}
      <LinearTaskModal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onCreateTask={createNewTask}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onOpenPricing={() => setShowPricingModal(true)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenSettings={() => {
          setCommandPaletteOpen(false);
          setShowSettingsModal(true);
        }}
        onCreateTask={() => {
          setCommandPaletteOpen(false);
          setNewTaskModalOpen(true);
        }}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={editTaskModalOpen}
        onClose={closeEditModal}
        task={editingTask}
        onSave={editTask}
      />
    </div>
  );
};