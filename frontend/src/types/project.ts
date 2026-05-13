export interface Project {
    id: string,
    name: string, 
    description: string, 
    createdAt: string, 
    updatedAt: string, 
    ownerId?: string;
}

export interface ProjectCreateRequest {
    name: string;
    description: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
}