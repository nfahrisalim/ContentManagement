import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useGallery, useCreateGalleryImage, useDeleteGalleryImage } from "@/hooks/use-gallery";
import { formatDistanceToNow } from "date-fns";
import { Plus, Link2, Trash2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { GalleryImage } from "@shared/schema";

const uploadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export function GalleryManagement() {
  const [sortBy, setSortBy] = useState("date-desc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const { toast } = useToast();
  const { data: images, isLoading } = useGallery();
  const createImageMutation = useCreateGalleryImage();
  const deleteImageMutation = useDeleteGalleryImage();

  const sortedImages = useMemo(() => {
    if (!images) return [];

    return [...images].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case "date-asc":
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        default:
          return 0;
      }
    });
  }, [images, sortBy]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data: UploadFormData) => {
    try {
      await createImageMutation.mutateAsync(data);
      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully",
      });
      reset();
      setIsUploadOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Image link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (window.confirm(`Are you sure you want to delete "${image.name}"?`)) {
      try {
        await deleteImageMutation.mutateAsync(image.id);
        toast({
          title: "Image deleted",
          description: "Image deleted successfully",
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image",
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
            <Skeleton className="h-10 w-48" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}>
              <Skeleton className="h-32 w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-1/2" />
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
          <h2 className="text-3xl font-bold text-slate-800">Gallery Management</h2>
          <p className="text-slate-600 mt-1">Upload and manage your images</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Upload className="mr-2" size={16} />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Image Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter image name..."
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  {...register("url")}
                  placeholder="https://example.com/image.jpg"
                  className={errors.url ? "border-red-500" : ""}
                />
                {errors.url && (
                  <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsUploadOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createImageMutation.isPending}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {createImageMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Gallery Filters */}
      <Card className="mb-6 shadow-sm border border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Image Gallery</h3>
            <div className="text-sm text-slate-500">
              {sortedImages.length} {sortedImages.length === 1 ? 'image' : 'images'} uploaded
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Sort Images
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-slate-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">📅 Newest First</SelectItem>
                  <SelectItem value="date-asc">📅 Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-slate-500 pb-2">
              Hover over images to access actions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {sortedImages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500 mb-4">No images uploaded yet</p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="mr-2" size={16} />
              Upload your first image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedImages.map((image) => (
            <Card key={image.id} className="group relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/200x128?text=Image+Not+Found";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopyLink(image.url)}
                      className="p-2"
                    >
                      <Link2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image)}
                      className="p-2"
                      disabled={deleteImageMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-slate-500 truncate font-medium">
                  {image.name}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(image.uploadDate), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
