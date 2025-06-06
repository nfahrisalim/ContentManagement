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
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
