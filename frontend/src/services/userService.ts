import { ApiConstants } from "../constants/ApiConstants";
import type { User } from "../types/user";
import { getStoredUser } from "./userStorageService";

interface UpdateUserMeRequest {
  username?: string;
  email?: string;
}

export const patchUserMeRequest = async (
  request: UpdateUserMeRequest
): Promise<User> => {
  const user = getStoredUser();

  if (!user?.id) {
    throw new Error("No hay usuario guardado");
  }

  const response = await fetch(ApiConstants.USER_PATH, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: user.id,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error actualizando el usuario:", errorBody);
    throw new Error("Error actualizando el usuario");
  }

  return response.json();
};