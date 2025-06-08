import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject, useUpdateProject, useProject } from "@/hooks/use-projects";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Eye, ExternalLink, Github } from "lucide-react";

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

export default function ProjectForm() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  
  const isEditing = !!id;
  const { data: project, isLoading: projectLoading } = useProject(id || "");
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
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
  const statusValue = watch("status", "draft");
  const isGroupValue = watch("isGroup", false);
  const coverImageUrl = watch("coverImageUrl");

  useEffect(() => {
    if (isEditing && project) {
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
    }
  }, [project, reset, isEditing]);

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
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} project`,
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

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending || projectLoading;

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
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
                  {isEditing ? "Edit Project" : "Create New Project"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? "Update your project details and links" : "Showcase your latest project with details and links"}
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
                className="gap-2 bg-green-500 hover:bg-green-600"
              >
                <Save size={16} />
                {isLoading ? "Saving..." : (isEditing ? "Update Project" : "Save Project")}
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
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter your project title..."
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="projectLink">Live Demo URL *</Label>
                  <div className="relative mt-2">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="projectLink"
                      {...register("projectLink")}
                      placeholder="https://myproject.com"
                      className={`pl-10 ${errors.projectLink ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.projectLink && (
                    <p className="text-destructive text-sm mt-1">{errors.projectLink.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="githubLink">GitHub Repository *</Label>
                  <div className="relative mt-2">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="githubLink"
                      {...register("githubLink")}
                      placeholder="https://github.com/username/repo"
                      className={`pl-10 ${errors.githubLink ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.githubLink && (
                    <p className="text-destructive text-sm mt-1">{errors.githubLink.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="documentationLink">Documentation URL</Label>
                  <Input
                    id="documentationLink"
                    {...register("documentationLink")}
                    placeholder="https://docs.myproject.com (optional)"
                    className={`mt-2 ${errors.documentationLink ? "border-destructive" : ""}`}
                  />
                  {errors.documentationLink && (
                    <p className="text-destructive text-sm mt-1">{errors.documentationLink.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="coverImageUrl">Cover Image URL *</Label>
                  <Input
                    id="coverImageUrl"
                    {...register("coverImageUrl")}
                    placeholder="https://example.com/image.jpg"
                    className={`mt-2 ${errors.coverImageUrl ? "border-destructive" : ""}`}
                  />
                  {errors.coverImageUrl && (
                    <p className="text-destructive text-sm mt-1">{errors.coverImageUrl.message}</p>
                  )}
                  {/* 👇 Cover Image Preview */}
                  {coverImageUrl && (
                    <div className="mt-2">
                      <img
                        src={coverImageUrl}
                        alt="Cover Preview"
                        className="rounded border w-full max-w-xs object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
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
                  This is a group/team project
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Description Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={contentValue}
                onChange={(value) => setValue("content", value)}
                placeholder="Describe your project, technologies used, challenges faced, and key features..."
                label="Description (Markdown)"
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
