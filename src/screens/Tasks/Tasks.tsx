import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  PanelLeftIcon
} from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export const Tasks = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Task data for the sidebar
  const sidebarTasks = [
    { name: "Review project proposal", selected: false },
    { name: "Schedule a meeting", selected: true, hasNotification: true },
  ];

  // Task data for the main content
  const mainTasks = [
    {
      name: "Review project proposal for the new marketing campaign.",
      completed: false,
      priority: "high",
    },
    {
      name: "Schedule a meeting with the design team for feedback.",
      completed: false,
      priority: "medium",
    },
    {
      name: "Have to create wireframes for the mobile app",
      completed: false,
      priority: "low",
    },
    {
      name: "Compile user feedback from the latest product release.",
      completed: true,
      priority: "medium",
    },
  ];

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

  const toggleSidebar = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
        fixed inset-y-0 left-0 z-50
        flex flex-col min-h-screen bg-white border-r border-gray-200/60
        transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        w-72
        shadow-sm lg:shadow-none
      `}>
        <div className="flex flex-col min-h-screen p-4 w-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-between w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent group">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-black rounded-sm shadow-sm" />
                      <span className="font-normal text-sm text-gray-900">Slane</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 shadow-sm border-gray-200/60 rounded-sm">
                  <DropdownMenuItem className="text-sm">Switch workspace</DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 hover:bg-gray-100/60 rounded-sm transition-colors"
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
                  <span className="font-normal text-sm text-gray-900">Tasks</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>

                {/* Task List */}
                <div className="space-y-1">
                  {sidebarTasks.map((task, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2.5 rounded-sm text-sm transition-all hover:bg-gray-100/40 cursor-pointer ${
                        task.selected ? "bg-gray-100/80" : ""
                      }`}
                    >
                      <span className="text-gray-700 truncate text-sm font-normal">
                        {task.name}
                      </span>
                      {task.hasNotification && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile - Positioned at bottom */}
            <div className="border-t border-gray-200/60 pt-4 mt-auto pb-4">
              <div className="flex items-center gap-3 p-2.5 rounded-sm hover:bg-gray-100/40 cursor-pointer transition-colors">
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
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white min-w-0 lg:ml-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="w-8 h-8 hover:bg-gray-100/60 rounded-sm transition-colors"
            >
              <PanelLeftIcon className="w-4 h-4 text-gray-600" />
            </Button>
            <h1 className="text-xl font-normal text-gray-900">Tasks</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* New Task Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-gray-200/60 hover:bg-gray-50/60 text-sm font-normal rounded-sm h-9 px-4 shadow-none hover:shadow-none transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New task</span>
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
              {mainTasks.map((task, index) => (
                <div key={index} className="group hover:bg-gray-50/30 transition-colors">
                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-4 p-4">
                    <Checkbox 
                      checked={task.completed} 
                      className="border-gray-300/80 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm leading-6 ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}>
                        {task.name}
                      </span>
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
                          <DropdownMenuItem className="text-sm">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-sm">Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 text-sm">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={task.completed} 
                        className="border-gray-300/80 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-6 ${
                          task.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}>
                          {task.name}
                        </p>
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
                          <DropdownMenuItem className="text-sm">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-sm">Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 text-sm">Delete</DropdownMenuItem>
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
    </div>
  );
};