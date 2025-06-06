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
import { useBlogs, useDeleteBlog } from "@/hooks/use-blogs";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search, Edit, Eye, Trash2 } from "lucide-react";
import type { Blog } from "@shared/schema";

export function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const { data: blogs, isLoading } = useBlogs();
  const deleteBlogMutation = useDeleteBlog();

  const filteredAndSortedBlogs = useMemo(() => {
    if (!blogs) return [];

    let filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [blogs, searchTerm, sortBy]);

  const handleEdit = (blog: Blog) => {
    setLocation(`/blog/edit/${blog.id}`);
  };

  const handleDelete = async (blog: Blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await deleteBlogMutation.mutateAsync(blog.id);
        toast({
          title: "Blog deleted",
          description: "Blog post deleted successfully",
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog post",
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
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-b border-slate-200 pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Blog Management</h2>
          <p className="text-slate-600 mt-1">Create and manage your blog posts</p>
        </div>
        <Button 
          onClick={() => setLocation("/blog/new")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="mr-2" size={16} />
          Add Blog Post
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card className="mb-6 shadow-sm border border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Search & Filter</h3>
            <div className="text-sm text-slate-500">
              {filteredAndSortedBlogs.length} {filteredAndSortedBlogs.length === 1 ? 'post' : 'posts'} found
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Search Posts
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
                Sort Posts
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
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

      {/* Blog List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredAndSortedBlogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No blog posts found</p>
              <Button onClick={() => setLocation("/blog/new")}>
                <Plus className="mr-2" size={16} />
                Create your first blog post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedBlogs.map((blog) => (
                <div key={blog.id} className="p-6 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        {blog.title}
                      </h4>
                      {blog.excerpt && (
                        <p className="text-slate-600 mb-3 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>
                          {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                        </span>
                        <Badge 
                          variant={blog.status === "published" ? "default" : "secondary"}
                          className={blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {blog.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({ title: "Preview", description: "Preview functionality coming soon" })}
                        className="text-slate-400 hover:text-green-500 hover:bg-green-50"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(blog)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                        disabled={deleteBlogMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
