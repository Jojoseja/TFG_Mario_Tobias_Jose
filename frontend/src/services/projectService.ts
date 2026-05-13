import { ApiConstants } from "../constants/ApiConstants";
import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
} from "../types/project";
import { getStoredUserId } from "./userStorageService";

export async function getProjectsRequest(): Promise<Project[]> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.PROJECT_PATH, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error cargando proyectos");
  }

  return await response.json();
}

export async function createProjectRequest(
  request: ProjectCreateRequest
): Promise<Project> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.PROJECT_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error creando el proyecto");
  }

  return await response.json();
}

export async function updateProjectRequest(
  projectId: string,
  request: ProjectUpdateRequest
): Promise<Project> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.PROJECT_PATH}/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error editando el proyecto");
  }

  return await response.json();
}

export async function deleteProjectRequest(projectId: string): Promise<void> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.PROJECT_PATH}/${projectId}`, {
    method: "DELETE",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error eliminando el proyecto");
  }
}