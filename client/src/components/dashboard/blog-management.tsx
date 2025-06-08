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

  const handleEdit = (blog: Blog) => setLocation(`/blog/edit/${blog.id}`);
  const handleDelete = async (blog: Blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await deleteBlogMutation.mutateAsync(blog.id);
        toast({
          title: "Blog deleted",
          description: "Blog post deleted successfully",
          variant: "destructive",
        });
      } catch {
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
        <Card className="p-6">
          <Skeleton className="h-10 mb-4 w-full" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Blogs</h2>
          <p className="text-slate-500 dark:text-slate-400">Create, update, or delete blog posts</p>
        </div>
        <Button
          onClick={() => setLocation("/blog/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2" size={16} />
          Add Blog Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search blog title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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

            <div className="w-full md:w-56">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">📅 Newest First</SelectItem>
                  <SelectItem value="date-asc">📅 Oldest First</SelectItem>
                  <SelectItem value="title-asc">🔤 Title A-Z</SelectItem>
                  <SelectItem value="title-desc">🔤 Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground pt-2">
          {filteredAndSortedBlogs.length} {filteredAndSortedBlogs.length === 1 ? "post" : "posts"} found
        </CardContent>
      </Card>

      {/* Blog List */}
      <Card className="divide-y divide-slate-200 dark:divide-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Blog Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No blog posts found</p>
              <Button onClick={() => setLocation("/blog/new")}>
                <Plus className="mr-2" size={16} />
                Create your first blog post
              </Button>
            </div>
          ) : (
            filteredAndSortedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex justify-between items-start"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-medium mb-1 text-slate-800 dark:text-slate-100">
                    {blog.title}
                  </h4>
                  {blog.excerpt && (
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                    <Badge
                      className={blog.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}
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
                    className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast({ title: "Preview", description: "Coming soon" })}
                    className="text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(blog)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={deleteBlogMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
