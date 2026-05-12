export type BackendSessionType = "WORK" | "SHORT_BREAK" | "LONG_BREAK";

export type PomodoroRequest = {
  id?: string;
  orderIndex: number;
  completed: boolean;
  sessionType: BackendSessionType;
  sessionId?: string;
};

export type PomodoroResponse = {
  id: string;
  orderIndex: number;
  completed: boolean;
  sessionType: BackendSessionType;
  sessionId: string;
};

export type SessionRequest = {
  sessionConfigurationId: string;
  startedAt?: string;
  endedAt?: string | null;
  workMinutesUsed?: number;
  shortBreakDurationUsed?: number;
  longBreakDurationUsed?: number;
  pomodoros?: PomodoroRequest[];
};

export type SessionResponse = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  workMinutesUsed: number;
  shortBreakDurationUsed: number;
  longBreakDurationUsed: number;
  taskIds: string[];
  pomodoros: PomodoroResponse[];
  sessionConfigurationId: string;
};