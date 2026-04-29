export interface Task{
    id: number,
    title: string,
    createdAt: Date,
    completedAt?: Date,
    completed: boolean,
    projectId: number,
    parentTask?: Task
}