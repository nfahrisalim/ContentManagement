import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { useToast } from "@/hooks/use-toast";
import { useCreateBlog, useUpdateBlog } from "@/hooks/use-blogs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Blog } from "@shared/schema";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().optional().nullable(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: Blog | null;
}

export function BlogModal({ isOpen, onClose, blog }: BlogModalProps) {
  const { toast } = useToast();
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  
  const isEditing = !!blog;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
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

  useEffect(() => {
    if (isOpen && blog) {
      reset({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content,
        coverImageUrl: blog.coverImageUrl || "",
        status: blog.status as "draft" | "published",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
      });
    } else if (isOpen && !blog) {
      reset({
        title: "",
        excerpt: "",
        content: "",
        coverImageUrl: "",
        status: "draft",
      });
    }
  }, [isOpen, blog, reset]);

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
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} blog post`,
        variant: "destructive",
      });
    }
  };

  const isLoading = createBlogMutation.isPending || updateBlogMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={watch("status")} 
                onValueChange={(value) => setValue("status", value as "draft" | "published")}
              >
                <SelectTrigger>
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
            />
          </div>

          <div>
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              {...register("coverImageUrl")}
              placeholder="https://example.com/image.jpg"
              className={errors.coverImageUrl ? "border-red-500" : ""}
            />
            {errors.coverImageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.coverImageUrl.message}</p>
            )}
          </div>

          <MarkdownEditor
            value={contentValue}
            onChange={(value) => setValue("content", value)}
            placeholder="Write your blog content in markdown..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? "Saving..." : (isEditing ? "Update Blog Post" : "Save Blog Post")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
