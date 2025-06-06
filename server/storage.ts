import { users, blogs, projects, gallery, type User, type InsertUser, type Blog, type InsertBlog, type Project, type InsertProject, type GalleryImage, type InsertGalleryImage } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog methods
  getBlogs(status?: string): Promise<Blog[]>;
  getBlog(id: string): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: string): Promise<boolean>;
  
  // Project methods
  getProjects(status?: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Gallery methods
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogs: Map<string, Blog>;
  private projects: Map<string, Project>;
  private galleryImages: Map<string, GalleryImage>;
  currentUserId: number;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.blogs = new Map();
    this.projects = new Map();
    this.galleryImages = new Map();
    this.currentUserId = 1;
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog methods
  async getBlogs(status?: string): Promise<Blog[]> {
    const allBlogs = Array.from(this.blogs.values());
    if (status) {
      return allBlogs.filter(blog => blog.status === status);
    }
    return allBlogs;
  }

  async getBlog(id: string): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const id = (this.currentId++).toString();
    const now = new Date();
    const newBlog: Blog = {
      ...blog,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.blogs.set(id, newBlog);
    return newBlog;
  }

  async updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog | undefined> {
    const existingBlog = this.blogs.get(id);
    if (!existingBlog) return undefined;
    
    const updatedBlog: Blog = {
      ...existingBlog,
      ...blog,
      updatedAt: new Date(),
    };
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogs.delete(id);
  }

  // Project methods
  async getProjects(status?: string): Promise<Project[]> {
    const allProjects = Array.from(this.projects.values());
    if (status) {
      return allProjects.filter(project => project.status === status);
    }
    return allProjects;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = (this.currentId++).toString();
    const now = new Date();
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;
    
    const updatedProject: Project = {
      ...existingProject,
      ...project,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Gallery methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = (this.currentId++).toString();
    const newImage: GalleryImage = {
      ...image,
      id,
      uploadDate: new Date(),
    };
    this.galleryImages.set(id, newImage);
    return newImage;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImages.delete(id);
  }
}

export const storage = new MemStorage();
