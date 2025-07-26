import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  PanelLeftIcon,
  X,
  Settings,
  Building2,
  Edit,
  Copy,
  Trash2,
  LifeBuoy,
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
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

import { LinearTaskModal } from "../../components/LinearTaskModal";
import { PricingModal } from "../../components/PricingModal";
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  

  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-600 border-red-100";
      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  // Sidebar filter state
  const [activeFilter, setActiveFilter] = useState("1");
  const [showAccountUI, setShowAccountUI] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

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

  const editTask = (taskId: string, newName: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, name: newName } : task
    ));
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

  // Keyboard shortcut for opening new task modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    <div className="bg-gray-50/30 flex w-full min-h-screen">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
        flex flex-col min-h-screen bg-white border-r border-gray-200/60
        transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72
        shadow-sm lg:shadow-none
        ${mobileMenuOpen ? 'lg:w-72' : 'lg:w-0 lg:overflow-hidden'}
      `}>
        <div className="flex flex-col min-h-screen p-4 w-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-between w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent group">
                    <div className="flex items-center gap-3">
                      <img src="/Slane.png" alt="Slane" className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-normal text-sm text-gray-900">Slane</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 shadow-sm border-gray-200/60 rounded-sm">
                  <DropdownMenuItem className="text-sm flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Switch workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm flex items-center gap-3">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 hover:bg-gray-100/60 rounded-sm transition-colors lg:hidden"
              >
                <PanelLeftIcon className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 border-gray-200/60 bg-gray-50/50 focus:border-gray-300 focus:ring-1 focus:ring-gray-300/50 text-sm h-9 rounded-sm transition-all"
            />
          </div>

          {/* Main Content Area - Flex 1 to push user profile to bottom */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <div className="space-y-3 mb-6">
                {/* Tasks Header */}
                <div className="flex items-center justify-between">
                  <span className="font-normal text-sm text-gray-900">Filters</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>

                {/* Task List */}
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveFilter(item.id)}
                      className={`flex items-center justify-between p-2.5 rounded-sm text-sm transition-all hover:bg-gray-100/40 cursor-pointer ${
                        item.selected ? "bg-gray-100/80" : ""
                      }`}
                    >
                      <span className="text-gray-700 truncate text-sm font-normal">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile - Positioned at bottom */}
            <div className="border-t border-gray-200/60 pt-4 mt-auto pb-4">
              <div className="overflow-hidden">
                {!showAccountUI ? (
                  <div 
                    className="flex items-center gap-3 p-2.5 rounded-sm hover:bg-gray-100/40 cursor-pointer transition-all duration-500 ease-out"
                    onClick={() => setShowAccountUI(true)}
                  >
                    <Avatar className="w-8 h-8 shadow-sm">
                      <AvatarImage src="/inbox-2.png" alt="User avatar" />
                      <AvatarFallback className="text-xs bg-gray-100 text-gray-600 font-normal">BC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal truncate text-gray-900">
                        bittucreators@gmail.com
                      </p>
                      <p className="text-xs text-gray-500">
                        Free Plan
                      </p>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-500 ease-out ${showAccountUI ? 'rotate-180' : ''}`} />
                  </div>
                ) : (
                  <div 
                    className="space-y-4 transition-all duration-700 ease-out"
                    style={{
                      animation: showAccountUI ? 'slideInUp 0.6s ease-out forwards' : 'slideOutDown 0.4s ease-in forwards'
                    }}
                  >
                    {/* Account Header */}
                    <div 
                      className="flex items-center justify-between opacity-0"
                      style={{
                        animation: showAccountUI ? 'fadeInSlide 0.5s ease-out 0.1s forwards' : 'none'
                      }}
                    >
                      <span className="text-sm font-medium text-gray-900">Account</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAccountUI(false)}
                        className="w-6 h-6 hover:bg-gray-100/60 rounded-sm transition-all duration-300 ease-out"
                      >
                        <X className="w-3 h-3 text-gray-400 transition-all duration-300 ease-out" />
                      </Button>
                    </div>

                    {/* Profile Section */}
                    <div 
                      className="space-y-3 opacity-0"
                      style={{
                        animation: showAccountUI ? 'fadeInSlide 0.5s ease-out 0.2s forwards' : 'none'
                      }}
                    >
                      <div className="flex items-center gap-3 p-2.5 bg-gray-50/50 rounded-sm transition-all duration-400 ease-out hover:bg-gray-50/80">
                        <Avatar className="w-10 h-10 shadow-sm transition-all duration-400 ease-out">
                          <AvatarImage src="/inbox-2.png" alt="User avatar" />
                          <AvatarFallback className="text-sm bg-gray-100 text-gray-600 font-normal">BC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Bittu Creators
                          </p>
                          <p className="text-xs text-gray-500">
                            bittucreators@gmail.com
                          </p>
                        </div>
                      </div>

                      {/* Plan Info */}
                      <div className="p-2.5 bg-blue-50/50 rounded-sm border border-blue-100/50 transition-all duration-400 ease-out hover:bg-blue-50/70">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-blue-900">Free Plan</p>
                            <p className="text-xs text-blue-600">Basic features</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7 px-3 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-300 ease-out"
                            onClick={() => setShowPricingModal(true)}
                          >
                            Upgrade
                          </Button>
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div 
                        className="space-y-1 opacity-0"
                        style={{
                          animation: showAccountUI ? 'fadeInSlide 0.5s ease-out 0.3s forwards' : 'none'
                        }}
                      >
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9 px-2.5 hover:bg-gray-100/60 rounded-sm flex items-center gap-3 transition-all duration-300 ease-out">
                          <Settings className="w-4 h-4 text-gray-500 transition-all duration-300 ease-out" />
                          Settings
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9 px-2.5 hover:bg-gray-100/60 rounded-sm flex items-center gap-3 transition-all duration-300 ease-out">
                          <LifeBuoy className="w-4 h-4 text-gray-500 transition-all duration-300 ease-out" />
                          Help & Support
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-9 px-2.5 hover:bg-gray-100/60 rounded-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 flex items-center gap-3 transition-all duration-300 ease-out">
                          <LogOut className="w-4 h-4 text-red-500 transition-all duration-300 ease-out" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white min-w-0 lg:ml-0 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 hover:bg-gray-100/60 rounded-sm transition-colors"
            >
              <PanelLeftIcon className="w-4 h-4 text-gray-600" />
            </Button>
            <h1 className="text-xl font-normal text-gray-900">Tasks</h1>
            <span className="text-xs text-gray-400 ml-2">Press T to create task</span>
          </div>

          <div className="flex items-center gap-3">
            {/* New Task Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setNewTaskModalOpen(true)}
              className="gap-2 border-gray-200/60 hover:bg-gray-50/60 text-sm font-normal rounded-sm h-9 px-4 shadow-none hover:shadow-none transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New task</span>
              <span className="hidden lg:inline text-xs text-gray-400 ml-1">(T)</span>
            </Button>
          </div>
        </header>

        {/* Task Content */}
        <div className="flex-1 p-6 bg-gray-50/30">
          <div className="border border-gray-200/60 rounded-sm overflow-hidden bg-white shadow-sm hover:shadow-sm transition-shadow">
            {/* Desktop Table Header */}
            <div className="hidden md:flex items-center gap-4 p-4 border-b border-gray-200/60 bg-gray-50/20">
              <Checkbox className="border-gray-300/80 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900" />
              <div className="flex-1">
                <span className="font-normal text-sm text-gray-600">Name</span>
              </div>
              <div className="w-24">
                <span className="font-normal text-sm text-gray-600">Priority</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Task Rows */}
            <div className="divide-y divide-gray-200/40">
              {filteredTasks.map((task) => (
                <div key={task.id} className="group hover:bg-gray-50/30 transition-colors">
                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-4 p-4">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-gray-300/80 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm leading-6 cursor-pointer ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
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
                        <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                          {task.description}
                        </div>
                      )}
                    </div>
                    <div className="w-24">
                      <Badge
                        variant="outline"
                        className={`text-xs font-normal px-2 py-0.5 rounded-sm border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="w-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 hover:bg-gray-100/60 opacity-0 group-hover:opacity-100 transition-all rounded-sm"
                          >
                            <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="shadow-sm border-gray-200/60 rounded-sm">
                          <DropdownMenuItem 
                            className="text-sm flex items-center gap-3"
                            onClick={() => {
                              const newName = prompt("Edit task name:", task.name);
                              if (newName && newName.trim()) {
                                editTask(task.id, newName.trim());
                              }
                            }}
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
                        className="border-gray-300/80 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm leading-6 cursor-pointer ${
                          task.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
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
                          <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                            {task.description}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 hover:bg-gray-100/60 -mr-2 rounded-sm"
                          >
                            <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="shadow-sm border-gray-200/60 rounded-sm">
                          <DropdownMenuItem 
                            className="text-sm flex items-center gap-3"
                            onClick={() => {
                              const newName = prompt("Edit task name:", task.name);
                              if (newName && newName.trim()) {
                                editTask(task.id, newName.trim());
                              }
                            }}
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
                      <Badge
                        variant="outline"
                        className={`text-xs font-normal px-2 py-0.5 rounded-sm border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
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
    </div>
  );
};