import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import type { Blog, InsertBlog } from "@shared/schema";

export const useBlogs = (status?: string) => {
  return useQuery({
    queryKey: ['/api/blogs', status],
    queryFn: () => blogApi.getAll(status),
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ['/api/blogs', id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (blog: InsertBlog) => blogApi.create(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, blog }: { id: string; blog: Partial<InsertBlog> }) => 
      blogApi.update(id, blog),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs', id] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
    },
  });
};
