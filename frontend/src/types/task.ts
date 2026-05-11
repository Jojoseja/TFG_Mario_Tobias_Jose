export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type Status = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  archived: boolean;
  createdAt: string;
  completedAt?: string | null;
  archivedAt?: string | null;
  ownerId: string;
  parentTaskId?: string | null;
  status: Status;
  priority: Priority;
  projectId?: string | null;
}

export interface CreateTask {
  title: string;
  description: string;
  parentTaskId?: string | null;
  status: Status;
  priority: Priority;
  projectId?: string | null;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  projectId?: string | null;
  parentTaskId?: string | null;
  status?: Status;
  priority?: Priority;
  completedAt?: string | null;
  archived?: boolean;
  archivedAt?: string | null;
}