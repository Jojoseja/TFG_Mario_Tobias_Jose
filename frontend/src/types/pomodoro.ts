export type BackendSessionType = "WORK" | "SHORT_BREAK" | "LONG_BREAK";

export type PomodoroRequest = {
  id?: string;
  orderIndex: number;
  completed: boolean;
  sessionType: BackendSessionType;
  sessionId?: string;
};

export type CreatePomodoroRequest = {
  orderIndex: number;
  completed: boolean;
  sessionType: BackendSessionType;
  sessionId: string;
};

export type UpdatePomodoroRequest = {
  orderIndex: number;
  completed: boolean;
  sessionType: BackendSessionType;
  sessionId: string;
};

export type PomodoroResponse = {
  id: string;
  orderIndex: number;
  completed: boolean;
  sessionType: BackendSessionType;
  sessionId: string;
};