import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/lib/api";
import { 
  RefreshCw, 
  Play, 
  ExternalLink, 
  Heart,
  BookOpen,
  FolderOpen,
  CheckCircle,
  XCircle
} from "lucide-react";

const endpoints = [
    {
    category: "Blog Endpoints (DONT USE)",
    color: "text-blue-500",
    icon: BookOpen,
    deprecated: true,  // <-- ini penanda deprecated
    note: "Sebaiknya jangan dipakai, endpoint ini akan segera diganti",
    items: [
      { 
        method: "GET", 
        path: "/api/blogs?status=published|draft", 
        description: "Get all blog posts filtered by status (published or draft)", 
        color: "bg-green-100 text-green-800" 
      },
      { 
        method: "POST", 
        path: "/api/blogs", 
        description: "Create new blog post", 
        color: "bg-blue-100 text-blue-800" 
      },
      { 
        method: "PUT", 
        path: "/api/blogs/{id}", 
        description: "Update blog post by ID", 
        color: "bg-yellow-100 text-yellow-800" 
      },
      { 
        method: "DELETE", 
        path: "/api/blogs/{id}", 
        description: "Delete blog post by ID", 
        color: "bg-red-100 text-red-800" 
      },
    ]
  },
  {
    category: "Project Endpoints (DONT USE)",
    color: "text-green-500",
    icon: FolderOpen,
    items: [
      { method: "GET", path: "/api/projects", description: "Get all projects", color: "bg-green-100 text-green-800" },
      { method: "POST", path: "/api/projects", description: "Create new project", color: "bg-blue-100 text-blue-800" },
      { method: "PUT", path: "/api/projects/{id}", description: "Update project", color: "bg-yellow-100 text-yellow-800" },
      { method: "DELETE", path: "/api/projects/{id}", description: "Delete project", color: "bg-red-100 text-red-800" },
    ]
  }
];

export function ApiStatus() {
  const [lastChecked, setLastChecked] = useState(new Date());
  const { toast } = useToast();

  const { data: healthStatus, isLoading, refetch } = useQuery({
    queryKey: ['/api/health'],
    queryFn: () => healthApi.check(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      setLastChecked(new Date());
      toast({
        title: "Status refreshed",
        description: "API status has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh API status",
        variant: "destructive",
      });
    }
  };

  const handleTestEndpoint = (endpoint: string) => {
    toast({
      title: "Testing endpoint",
      description: `Testing ${endpoint}...`,
    });
  };

  const isOnline = !isLoading && healthStatus;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">API Status & Endpoints</h2>
        <p className="text-slate-600 mt-1">Please refer to documentation rather than endpoint here (Link is below at quick links)</p>
      </div>

      {/* API Health Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">API Health Status</h3>
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600"
            >
              <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-green-700 font-medium">API is Online</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <XCircle className="text-red-500" size={16} />
                  <span className="text-red-700 font-medium">API is Offline</span>
                </>
              )}
            </div>
            <div className="text-slate-500 text-sm">
              Last checked: {lastChecked.toLocaleString()}
            </div>
          </div>
          {healthStatus && (
            <div className="mt-3 text-sm text-slate-600">
              {healthStatus?.status && healthStatus?.message && (
                <div className="mt-3 text-sm text-slate-600">
                  Status: {healthStatus.status} | Message: {healthStatus.message}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {endpoints.map((category) => {
          const CategoryIcon = category.icon;
          
          return (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CategoryIcon className={`mr-2 ${category.color}`} size={20} />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs font-medium ${endpoint.color}`}
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm text-slate-700">{endpoint.path}</code>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{endpoint.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTestEndpoint(endpoint.path)}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                      title="Test Endpoint"
                    >
                      <Play size={14} />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <a 
              href="https://bunbackendv2-production.up.railway.app/doc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              <BookOpen className="mr-2" size={16} />
              API Documentation
              <ExternalLink className="ml-2" size={14} />
            </a>
            <a 
              href="https://bunbackendv2-production.up.railway.app/api/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
            >
              <Heart className="mr-2" size={16} />
              Health Check
              <ExternalLink className="ml-2" size={14} />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
