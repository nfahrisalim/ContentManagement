import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GalleryImage, InsertGalleryImage } from "@shared/schema";

const BASE_URL = "https://bunbackendv2-production.up.railway.app";

export const galleryApi = {
  getAll: async (): Promise<GalleryImage[]> => {
    const res = await fetch(`${BASE_URL}/api/upload`); // ✅ ganti ke endpoint GCS
    if (!res.ok) {
      throw new Error("Failed to fetch gallery images");
    }
    const json = await res.json();
    return json.data; // ✅ harus berupa array of { filename, url }
  },

  create: async (file: File): Promise<GalleryImage> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to upload image: " + text);
  }

  const json = await res.json();
  return json.data;
},

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete gallery image");
    }
  },
};

// React Query hooks for gallery

export const useGallery = () => {
  return useQuery({
    queryKey: ['/api/upload'], // ✅ ganti key agar sesuai cache endpoint baru
    queryFn: () => galleryApi.getAll(),
  });
};

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: InsertGalleryImage) => galleryApi.create(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/upload'] }); // ✅ invalidate cache upload
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filename: string) => {
      const res = await fetch(`${BASE_URL}/api/upload/${filename}`, {
        method: 'DELETE',
      });

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('❌ Unexpected response (not JSON):', text);
        throw new Error('Server tidak merespons dengan JSON. Cek endpoint.');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus gambar');
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/upload'] });
    },

    onError: (error) => {
      console.error('Gagal menghapus gambar:', error);
    },
  });
};
