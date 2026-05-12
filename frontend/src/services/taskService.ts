import { ApiConstants } from "../constants/ApiConstants";
import type { CreateTask, Task, UpdateTask } from "../types/task";
import { getStoredUserId } from "./userStorageService";

export async function getTasksRequest(
  projectId?: string | null
): Promise<Task[]> {
  const userId = getStoredUserId();

  const params = new URLSearchParams();

  if (projectId) {
    params.append("projectId", projectId);
  }

  const url = params.toString()
    ? `${ApiConstants.TASK_PATH}?${params.toString()}`
    : ApiConstants.TASK_PATH;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error cargando tareas");
  }

  return await response.json();
}

export async function createTaskRequest(
  taskToCreate: CreateTask
): Promise<Task> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.TASK_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(taskToCreate),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error creando la tarea");
  }

  return await response.json();
}

export async function updateTaskRequest(
  taskId: string,
  taskToUpdate: UpdateTask
): Promise<Task> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.TASK_PATH}/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(taskToUpdate),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error actualizando la tarea");
  }

  return await response.json();
}

export async function deleteTaskRequest(taskId: string): Promise<void> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.TASK_PATH}/${taskId}`, {
    method: "DELETE",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error borrando la tarea");
  }
}