import { ApiConstants } from "../constants/ApiConstants";
import type {
  CreatePomodoroRequest,
  PomodoroResponse,
  UpdatePomodoroRequest,
} from "../types/pomodoro";
import { getStoredUserId } from "./userStorageService";

export async function createPomodoroRequest(
  request: CreatePomodoroRequest
): Promise<PomodoroResponse> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.POMODORO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error creando el pomodoro");
  }

  return await response.json();
}

export async function updatePomodoroRequest(
  pomodoroId: string,
  request: UpdatePomodoroRequest
): Promise<PomodoroResponse> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.POMODORO}/${pomodoroId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error actualizando el pomodoro");
  }

  return await response.json();
}