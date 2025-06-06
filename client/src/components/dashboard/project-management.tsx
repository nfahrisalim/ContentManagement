import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search, Edit, Eye, Trash2, ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared/schema";

export function ProjectManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const { data: projects, isLoading } = useProjects();
  const deleteProjectMutation = useDeleteProject();

  const filteredAndSortedProjects = useMemo(() => {
    if (!projects) return [];

    let filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [projects, searchTerm, sortBy]);

  const handleEdit = (project: Project) => {
    setLocation(`/project/edit/${project.id}`);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await deleteProjectMutation.mutateAsync(project.id);
        toast({
          title: "Project deleted",
          description: "Project deleted successfully",
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Project Management</h2>
          <p className="text-slate-600 mt-1">Showcase your projects and work</p>
        </div>
        <Button 
          onClick={() => setLocation("/project/new")}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="mr-2" size={16} />
          Add Project
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card className="mb-6 shadow-sm border border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Search & Filter</h3>
            <div className="text-sm text-slate-500">
              {filteredAndSortedProjects.length} {filteredAndSortedProjects.length === 1 ? 'project' : 'projects'} found
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Search Projects
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-green-500 focus:ring-green-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Sort Projects
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-slate-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">📅 Newest First</SelectItem>
                  <SelectItem value="date-asc">📅 Oldest First</SelectItem>
                  <SelectItem value="title-asc">🔤 Title A → Z</SelectItem>
                  <SelectItem value="title-desc">🔤 Title Z → A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Grid */}
      {filteredAndSortedProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500 mb-4">No projects found</p>
            <Button onClick={() => setLocation("/project/new")}>
              <Plus className="mr-2" size={16} />
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {project.coverImageUrl && (
                <img 
                  src={project.coverImageUrl} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                    {project.title}
                  </h3>
                  <Badge 
                    variant={project.status === "published" ? "default" : "secondary"}
                    className={project.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {project.content.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a 
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                    >
                      <ExternalLink className="mr-1" size={12} />
                      Live Demo
                    </a>
                    <a 
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-600 text-sm flex items-center"
                    >
                      <Github className="mr-1" size={12} />
                      Code
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                    >
                      <Edit size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Preview", description: "Preview functionality coming soon" })}
                      className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50"
                    >
                      <Eye size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      disabled={deleteProjectMutation.isPending}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
