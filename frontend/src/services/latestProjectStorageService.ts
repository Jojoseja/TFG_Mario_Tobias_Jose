import type { Project } from "../types/project";

const LATEST_PROJECT_STORAGE_KEY = "latestProject";

export function getStoredLatestProject(): Project | null {
  const storedProject = localStorage.getItem(LATEST_PROJECT_STORAGE_KEY);

  if (!storedProject) {
    return null;
  }

  try {
    return JSON.parse(storedProject) as Project;
  } catch {
    localStorage.removeItem(LATEST_PROJECT_STORAGE_KEY);
    return null;
  }
}

export function saveStoredLatestProject(project: Project): void {
  localStorage.setItem(LATEST_PROJECT_STORAGE_KEY, JSON.stringify(project));
}

export function removeStoredLatestProject(): void {
  localStorage.removeItem(LATEST_PROJECT_STORAGE_KEY);
}