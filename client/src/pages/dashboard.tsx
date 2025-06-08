"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { BlogManagement } from "@/components/dashboard/blog-management";
import { ProjectManagement } from "@/components/dashboard/project-management";
import { GalleryManagement } from "@/components/dashboard/gallery-management";
import { ApiStatus } from "@/components/dashboard/api-status";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("blog");

  const renderContent = () => {
    switch (activeTab) {
      case "blog":
        return <BlogManagement />;
      case "project":
        return <ProjectManagement />;
      case "gallery":
        return <GalleryManagement />;
      case "api-status":
        return <ApiStatus />;
      default:
        return <BlogManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header / Top Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-white dark:bg-slate-950 shadow-sm z-10">
          <h2 className="text-lg font-semibold tracking-tight">
            {activeTab
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h2>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-100 dark:bg-slate-900 transition-all duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 transition-colors duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
