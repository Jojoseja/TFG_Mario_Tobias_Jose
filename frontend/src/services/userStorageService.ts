import type { User } from "../types/user";

const USER_STORAGE_KEY = "user";

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser);
}

export function saveStoredUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getStoredUserId(): string {
  const user = getStoredUser();

  if (!user?.id) {
    throw new Error("No hay usuario guardado o el usuario no tiene id");
  }

  return user.id;
}