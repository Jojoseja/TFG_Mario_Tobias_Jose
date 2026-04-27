export interface Task{
    id: number,
    title: string,
    completed: boolean,
    projectId: number,
    parentTask?: Task
}