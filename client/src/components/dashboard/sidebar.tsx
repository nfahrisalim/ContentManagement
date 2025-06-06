import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  FolderOpen, 
  Images, 
  Server,
  Gauge
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
    color: "text-blue-500"
  },
  {
    id: "project", 
    label: "Project Management",
    icon: FolderOpen,
    color: "text-green-500"
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: Images,
    color: "text-purple-500"
  },
  {
    id: "api-status",
    label: "API Status",
    icon: Server,
    color: "text-orange-500"
  }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center">
          <Gauge className="text-blue-500 mr-2" size={24} />
          CMS Dashboard
        </h1>
      </div>
      
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
                    "w-full justify-start text-left h-auto py-3 px-3",
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950" 
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
      
      {/* Theme Toggle at Bottom */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
