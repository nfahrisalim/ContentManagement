import { apiRequest } from "./queryClient";
import type { Blog, InsertBlog, Project, InsertProject, GalleryImage, InsertGalleryImage } from "@shared/schema";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

// Blog API functions
export const blogApi = {
  getAll: async (status?: string): Promise<Blog[]> => {
    const url = status ? `/api/blogs?status=${status}` : '/api/blogs';
    const response = await fetch(url);
    const result: ApiResponse<Blog[]> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch blogs');
    return result.data || [];
  },

  getById: async (id: string): Promise<Blog> => {
    const response = await fetch(`/api/blogs/${id}`);
    const result: ApiResponse<Blog> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch blog');
    if (!result.data) throw new Error('Blog not found');
    return result.data;
  },

  create: async (blog: InsertBlog): Promise<Blog> => {
    const response = await apiRequest('POST', '/api/blogs', blog);
    const result: ApiResponse<Blog> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to create blog');
    if (!result.data) throw new Error('No data returned');
    return result.data;
  },

  update: async (id: string, blog: Partial<InsertBlog>): Promise<Blog> => {
    const response = await apiRequest('PUT', `/api/blogs/${id}`, blog);
    const result: ApiResponse<Blog> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to update blog');
    if (!result.data) throw new Error('No data returned');
    return result.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiRequest('DELETE', `/api/blogs/${id}`);
    const result: ApiResponse<void> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to delete blog');
  },
};

// Project API functions
export const projectApi = {
  getAll: async (status?: string): Promise<Project[]> => {
    const url = status ? `/api/projects?status=${status}` : '/api/projects';
    const response = await fetch(url);
    const result: ApiResponse<Project[]> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch projects');
    return result.data || [];
  },

  getById: async (id: string): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`);
    const result: ApiResponse<Project> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch project');
    if (!result.data) throw new Error('Project not found');
    return result.data;
  },

  create: async (project: InsertProject): Promise<Project> => {
    const response = await apiRequest('POST', '/api/projects', project);
    const result: ApiResponse<Project> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to create project');
    if (!result.data) throw new Error('No data returned');
    return result.data;
  },

  update: async (id: string, project: Partial<InsertProject>): Promise<Project> => {
    const response = await apiRequest('PUT', `/api/projects/${id}`, project);
    const result: ApiResponse<Project> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to update project');
    if (!result.data) throw new Error('No data returned');
    return result.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiRequest('DELETE', `/api/projects/${id}`);
    const result: ApiResponse<void> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to delete project');
  },
};

// Gallery API functions
export const galleryApi = {
  getAll: async (): Promise<GalleryImage[]> => {
    const response = await fetch('/api/gallery');
    const result: ApiResponse<GalleryImage[]> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch gallery images');
    return result.data || [];
  },

  create: async (image: InsertGalleryImage): Promise<GalleryImage> => {
    const response = await apiRequest('POST', '/api/gallery', image);
    const result: ApiResponse<GalleryImage> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to upload image');
    if (!result.data) throw new Error('No data returned');
    return result.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiRequest('DELETE', `/api/gallery/${id}`);
    const result: ApiResponse<void> = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to delete image');
  },
};

// Health API function
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; message: string }> => {
    const response = await fetch('/api/health');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'API is not healthy');
    return {
      status: result.status || 'unknown',
      timestamp: result.timestamp || new Date().toISOString(),
      message: result.message || 'No status message'
    };
  },
};
