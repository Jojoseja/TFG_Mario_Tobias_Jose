import { ApiConstants } from "../constants/ApiConstants";
import type { SessionRequest, SessionResponse } from "../types/session";
import { getStoredUserId } from "./userStorageService";

export async function getSessionRequest(
  sessionId: string
): Promise<SessionResponse> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.SESSION_PATH}/${sessionId}`, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error cargando la sesión");
  }

  return await response.json();
}

export async function getSessionsRequest(): Promise<SessionResponse[]> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.SESSION_PATH, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error cargando las sesiones");
  }

  return await response.json();
}

export async function startSessionRequest(
  request: SessionRequest
): Promise<SessionResponse> {
  const userId = getStoredUserId();

  const response = await fetch(`${ApiConstants.SESSION_PATH}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error iniciando la sesión");
  }

  return await response.json();
}

export async function finishSessionRequest(
  sessionId: string,
  request: SessionRequest
): Promise<SessionResponse> {
  const userId = getStoredUserId();

  const response = await fetch(
    `${ApiConstants.SESSION_PATH}/${sessionId}/finish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [ApiConstants.USER_ID_HEADER]: userId,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error finalizando la sesión");
  }

  return await response.json();
}