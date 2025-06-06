import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api";
import type { GalleryImage, InsertGalleryImage } from "@shared/schema";

export const useGallery = () => {
  return useQuery({
    queryKey: ['/api/gallery'],
    queryFn: () => galleryApi.getAll(),
  });
};

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (image: InsertGalleryImage) => galleryApi.create(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
    },
  });
};
