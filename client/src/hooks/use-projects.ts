import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project, InsertProject } from "@shared/schema";

const BASE_URL = "https://bunbackendv2-production.up.railway.app";

export const projectApi = {
  getAll: async (status?: string): Promise<Project[]> => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const url = `${BASE_URL}/api/projects${query}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }
    const json = await res.json();
    return json.data;  // Ambil data array project
  },

  getById: async (id: string): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/api/projects/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch project by id");
    }
    const json = await res.json();
    return json.data;  // Ambil data project tunggal
  },

  create: async (project: InsertProject): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error("Failed to create project");
    }
    const json = await res.json();
    return json.data;
  },

  update: async (id: string, project: Partial<InsertProject>): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error("Failed to update project");
    }
    const json = await res.json();
    return json.data;
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete project");
    }
  },
};

// React Query hooks

export const useProjects = (status?: string) => {
  return useQuery({
    queryKey: ['/api/projects', status],
    queryFn: () => projectApi.getAll(status),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['/api/projects', id],
    queryFn: () => projectApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: InsertProject) => projectApi.create(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<InsertProject> }) =>
      projectApi.update(id, project),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
};
