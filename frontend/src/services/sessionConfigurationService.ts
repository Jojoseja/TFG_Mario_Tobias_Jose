import { ApiConstants } from "../constants/ApiConstants";
import type {
  SessionConfiguration,
  SessionConfigurationRequest,
} from "../types/sessionConfiguration";
import { getStoredUserId } from "./userStorageService";

export async function getSessionConfigurationRequest(): Promise<SessionConfiguration> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.SESSION_CONFIGURATION_PATH, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error cargando la configuración de sesión");
  }

  return await response.json();
}

export async function putSessionConfigurationRequest(
  request: SessionConfigurationRequest
): Promise<SessionConfiguration> {
  const userId = getStoredUserId();

  const response = await fetch(ApiConstants.SESSION_CONFIGURATION_PATH, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error guardando la configuración de sesión");
  }

  return await response.json();
}