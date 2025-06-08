"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FolderOpen,
  Images,
  Server,
  Gauge,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  {
    id: "blog",
    label: "Blog Management",
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    id: "project",
    label: "Project Management",
    icon: FolderOpen,
    color: "text-green-500",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: Images,
    color: "text-purple-500",
  },
  {
    id: "api-status",
    label: "API Status",
    icon: Server,
    color: "text-orange-500",
  },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative flex h-full">
      {/* Toggle Button for Mobile */}
      <div className="absolute top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <img
              src="https://storage.googleapis.com/janda/image-1749379105934-860499258.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold text-slate-800 dark:text-white">
              Dissent Dashboard
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            v1.0.0
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full justify-start text-left h-auto py-3 px-3 rounded-md transition-colors duration-200",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className={cn("mr-3", item.color)} size={20} />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
