import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Project } from "@shared/schema";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  projectLink: z.string().url("Must be a valid URL"),
  githubLink: z.string().url("Must be a valid URL"),
  documentationLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverImageUrl: z.string().url("Must be a valid URL"),
  isGroup: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { toast } = useToast();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      content: "",
      projectLink: "",
      githubLink: "",
      documentationLink: "",
      coverImageUrl: "",
      isGroup: false,
      status: "draft",
    },
  });

  const contentValue = watch("content", "");
  const isGroupValue = watch("isGroup", false);

  useEffect(() => {
    if (isOpen && project) {
      reset({
        title: project.title,
        content: project.content,
        projectLink: project.projectLink,
        githubLink: project.githubLink,
        documentationLink: project.documentationLink || "",
        coverImageUrl: project.coverImageUrl,
        isGroup: project.isGroup,
        status: project.status as "draft" | "published",
      });
    } else if (isOpen && !project) {
      reset({
        title: "",
        content: "",
        projectLink: "",
        githubLink: "",
        documentationLink: "",
        coverImageUrl: "",
        isGroup: false,
        status: "draft",
      });
    }
  }, [isOpen, project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        title: data.title,
        content: data.content,
        projectLink: data.projectLink,
        githubLink: data.githubLink,
        documentationLink: data.documentationLink || null,
        coverImageUrl: data.coverImageUrl,
        isGroup: data.isGroup,
        status: data.status,
        publishedAt: data.status === "published" ? new Date() : null,
      };

      if (isEditing && project) {
        await updateProjectMutation.mutateAsync({ id: project.id, project: projectData });
        toast({
          title: "Project updated",
          description: "Project updated successfully",
        });
      } else {
        await createProjectMutation.mutateAsync(projectData);
        toast({
          title: "Project created",
          description: "Project created successfully",
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} project`,
        variant: "destructive",
      });
    }
  };

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Add New Project"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectLink">Project Link *</Label>
              <Input
                id="projectLink"
                {...register("projectLink")}
                placeholder="https://myproject.com"
                className={errors.projectLink ? "border-red-500" : ""}
              />
              {errors.projectLink && (
                <p className="text-red-500 text-sm mt-1">{errors.projectLink.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="githubLink">GitHub Link *</Label>
              <Input
                id="githubLink"
                {...register("githubLink")}
                placeholder="https://github.com/username/repo"
                className={errors.githubLink ? "border-red-500" : ""}
              />
              {errors.githubLink && (
                <p className="text-red-500 text-sm mt-1">{errors.githubLink.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentationLink">Documentation Link</Label>
              <Input
                id="documentationLink"
                {...register("documentationLink")}
                placeholder="https://docs.myproject.com"
                className={errors.documentationLink ? "border-red-500" : ""}
              />
              {errors.documentationLink && (
                <p className="text-red-500 text-sm mt-1">{errors.documentationLink.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="coverImageUrl">Cover Image URL *</Label>
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isGroup"
              checked={isGroupValue}
              onCheckedChange={(checked) => setValue("isGroup", !!checked)}
            />
            <Label 
              htmlFor="isGroup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This is a group project
            </Label>
          </div>

          <MarkdownEditor
            value={contentValue}
            onChange={(value) => setValue("content", value)}
            placeholder="Describe your project in markdown..."
            label="Description (Markdown)"
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
              className="bg-green-500 hover:bg-green-600"
            >
              {isLoading ? "Saving..." : (isEditing ? "Update Project" : "Save Project")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
