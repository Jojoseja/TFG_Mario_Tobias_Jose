import { ApiConstants } from "../constants/ApiConstants";
import type { Project } from "../types/project";

export async function getLatestProject(userId: string): Promise<Project> {
  const response = await fetch(ApiConstants.PROJECT_PATH + '/latest', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el último proyecto trabajado");
  }

  return response.json();
}