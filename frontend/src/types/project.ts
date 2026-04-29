import type { Task } from "./task";

export interface Project {
    id: number,
    name: string, 
    description: string, 
    createdAt: string, 
    updatedAt: string, 
    tasks: Task[]
}