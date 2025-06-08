import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useCreateBlog, useUpdateBlog, useBlog } from "@/hooks/use-blogs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Eye } from "lucide-react";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogForm() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  
  const isEditing = !!id;
  const { data: blog, isLoading: blogLoading } = useBlog(id || "");
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      status: "draft",
    },
  });

  const contentValue = watch("content", "");
  const statusValue = watch("status", "draft");
  const coverImageUrlValue = watch("coverImageUrl");

  const isValidImageUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return /\.(jpeg|jpg|gif|png|webp|svg)$/.test(parsedUrl.pathname);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (isEditing && blog) {
      reset({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content,
        coverImageUrl: blog.coverImageUrl || "",
        status: blog.status as "draft" | "published",
      });
    }
  }, [blog, reset, isEditing]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const blogData = {
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImageUrl: data.coverImageUrl || null,
        status: data.status,
        publishedAt: data.status === "published" ? new Date() : null,
      };

      if (isEditing && blog) {
        await updateBlogMutation.mutateAsync({ id: blog.id, blog: blogData });
        toast({
          title: "Blog updated",
          description: "Blog post updated successfully",
        });
      } else {
        await createBlogMutation.mutateAsync(blogData);
        toast({
          title: "Blog created",
          description: "Blog post created successfully",
        });
      }

      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} blog post`,
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  };

  const isLoading = createBlogMutation.isPending || updateBlogMutation.isPending || blogLoading;

  if (blogLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? "Update your blog post content and settings" : "Write and publish a new blog post"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => toast({ title: "Preview", description: "Preview functionality coming soon" })}
                className="gap-2"
              >
                <Eye size={16} />
                Preview
              </Button>
              <Button 
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="gap-2"
              >
                <Save size={16} />
                {isLoading ? "Saving..." : (isEditing ? "Update Post" : "Save Post")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter your blog post title..."
                    className={`mt-2 ${errors.title ? "border-destructive" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={statusValue} 
                    onValueChange={(value) => setValue("status", value as "draft" | "published")}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register("excerpt")}
                  rows={3}
                  placeholder="Brief description of your blog post..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                <Input
                  id="coverImageUrl"
                  {...register("coverImageUrl")}
                  placeholder="https://example.com/image.jpg"
                  className={`mt-2 ${errors.coverImageUrl ? "border-destructive" : ""}`}
                />
                {errors.coverImageUrl && (
                  <p className="text-destructive text-sm mt-1">{errors.coverImageUrl.message}</p>
                )}

                {/* Image Preview */}
                {coverImageUrlValue && isValidImageUrl(coverImageUrlValue) && (
                  <img
                    src={coverImageUrlValue}
                    alt="Cover Preview"
                    className="mt-4 max-h-64 rounded-md border shadow"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={contentValue}
                onChange={(value) => setValue("content", value)}
                placeholder="Write your blog content in markdown..."
              />
              {errors.content && (
                <p className="text-destructive text-sm mt-2">{errors.content.message}</p>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
