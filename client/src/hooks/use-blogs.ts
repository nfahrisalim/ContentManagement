import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Blog, InsertBlog } from "@shared/schema";

const BASE_URL = "https://bunbackendv2-production.up.railway.app";

export const blogApi = {
  getAll: async (status?: string): Promise<Blog[]> => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const url = `${BASE_URL}/api/blogs${query}`;
    console.log("Fetching blogs from:", url); // optional debug log
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const json = await res.json();
    return json.data;  // <-- ambil properti data
  },

  getById: async (id: string): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/api/blogs/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch blog by id");
    }
    const json = await res.json();
    return json.data;  // <-- ambil properti data
  },

  create: async (blog: InsertBlog): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    });
    if (!res.ok) {
      throw new Error("Failed to create blog");
    }
    const json = await res.json();
    return json.data;  // <-- ambil properti data
  },

  update: async (id: string, blog: Partial<InsertBlog>): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    });
    if (!res.ok) {
      throw new Error("Failed to update blog");
    }
    const json = await res.json();
    return json.data;  // <-- ambil properti data
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete blog");
    }
  },
};

// React Query hooks

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
