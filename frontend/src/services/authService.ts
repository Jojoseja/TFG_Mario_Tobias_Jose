import { ApiConstants } from "../constants/ApiConstants";
import type { User } from "../types/user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export async function loginRequest(request: LoginRequest): Promise<User> {
  const response = await fetch(ApiConstants.AUTH_PATH + ApiConstants.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Credenciales incorrectas");
  }

  return await response.json();
}

export async function registerRequest(request: RegisterRequest): Promise<User> {
  const response = await fetch(ApiConstants.USER_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al registrar el usuario");
  }

  return await response.json();
}