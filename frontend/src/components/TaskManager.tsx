import { useState, useEffect, useRef } from "react";
import { MdArchive, MdDelete, MdEdit } from "react-icons/md";
import "../styles/TaskManager.css";
import type { CreateTask, Task, UpdateTask } from "../types/task";
import TaskModal from "./TaskModal";
import { createTaskRequest, deleteTaskRequest, getTasksRequest, updateTaskRequest } from "../services/taskService";
type TaskManagerProps = {
  variant?: "home" | "project";
  projectId?: string | null;
};

function TaskManager({ variant = "home", projectId = null }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [finishingTaskIds, setFinishingTaskIds] = useState<Set<string>>(
    new Set()
  );

  const archiveTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const currentProjectId = projectId ?? null;
  const needsProject = variant === "project" || variant === "home";

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (needsProject && !currentProjectId) {
          setTasks([]);
          return;
        }

        const tasksFromDb = await getTasksRequest(currentProjectId);
        setTasks(tasksFromDb);
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };

    void loadTasks();
  }, [needsProject, currentProjectId]);

  useEffect(() => {
    return () => {
      Object.values(archiveTimeoutsRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const scheduleTaskArchive = (taskId: string) => {
    if (archiveTimeoutsRef.current[taskId]) {
      clearTimeout(archiveTimeoutsRef.current[taskId]);
    }

    setFinishingTaskIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.add(taskId);
      return nextIds;
    });

    archiveTimeoutsRef.current[taskId] = setTimeout(async () => {
      const archiveTaskRequest: UpdateTask = {
        archived: true,
        archivedAt: new Date().toISOString(),
      };

      try {
        const archivedTask = await updateTaskRequest(taskId, archiveTaskRequest);

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? archivedTask : task))
        );
      } catch (error) {
        console.error("Error archivando tarea completada:", error);
      } finally {
        setFinishingTaskIds((prevIds) => {
          const nextIds = new Set(prevIds);
          nextIds.delete(taskId);
          return nextIds;
        });

        delete archiveTimeoutsRef.current[taskId];
      }
    }, 1000);
  };

  const cancelScheduledArchive = (taskId: string) => {
    if (archiveTimeoutsRef.current[taskId]) {
      clearTimeout(archiveTimeoutsRef.current[taskId]);
      delete archiveTimeoutsRef.current[taskId];
    }

    setFinishingTaskIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.delete(taskId);
      return nextIds;
    });
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    if (needsProject && !currentProjectId) {
      console.error("No se puede crear una tarea sin proyecto asociado");
      return;
    }

    const taskToAdd: CreateTask = {
      title: newTask.trim(),
      description: "",
      projectId: currentProjectId,
      parentTaskId: null,
      status: "TODO",
      priority: "MEDIUM",
    };

    try {
      const createdTask = await createTaskRequest(taskToAdd);

      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTask("");
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  const handleDeleteTask = async (taskToDelete: Task) => {
    try {
      cancelScheduledArchive(taskToDelete.id);

      await deleteTaskRequest(taskToDelete.id);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
    } catch (error) {
      console.error("Error borrando tarea:", error);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    taskToUpdate: UpdateTask
  ): Promise<void> => {
    try {
      const previousTask = tasks.find((task) => task.id === taskId);

      const taskToUpdateWithCompletedAt: UpdateTask = {
        ...taskToUpdate,
      };

      if (taskToUpdate.status === "DONE") {
        taskToUpdateWithCompletedAt.completedAt =
          taskToUpdate.completedAt ?? new Date().toISOString();
      }

      if (taskToUpdate.status && taskToUpdate.status !== "DONE") {
        taskToUpdateWithCompletedAt.completedAt = null;
      }

      const updatedTask = await updateTaskRequest(
        taskId,
        taskToUpdateWithCompletedAt
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );

      const wasNotDone = previousTask?.status !== "DONE";
      const isNowDone = updatedTask.status === "DONE";

      if (wasNotDone && isNowDone) {
        scheduleTaskArchive(taskId);
      }

      if (updatedTask.status !== "DONE") {
        cancelScheduledArchive(taskId);
      }
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const handleArchiveTask = async (taskToArchive: Task) => {
    const taskToUpdate: UpdateTask = {
      archived: true,
      archivedAt: new Date().toISOString(),
    };

    try {
      cancelScheduledArchive(taskToArchive.id);

      const updatedTask = await updateTaskRequest(
        taskToArchive.id,
        taskToUpdate
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskToArchive.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error archivando tarea:", error);
    }
  };

  const handleCompleteTask = async (taskToComplete: Task) => {
    const isAlreadyDone = taskToComplete.status === "DONE";

    if (isAlreadyDone) {
      cancelScheduledArchive(taskToComplete.id);

      const taskToUpdate: UpdateTask = {
        status: "TODO",
        completedAt: null,
      };

      try {
        const updatedTask = await updateTaskRequest(
          taskToComplete.id,
          taskToUpdate
        );

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskToComplete.id ? updatedTask : task
          )
        );
      } catch (error) {
        console.error("Error desmarcando tarea:", error);
      }

      return;
    }

    const taskToUpdate: UpdateTask = {
      status: "DONE",
      completedAt: new Date().toISOString(),
    };

    try {
      const updatedTask = await updateTaskRequest(
        taskToComplete.id,
        taskToUpdate
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskToComplete.id ? updatedTask : task
        )
      );

      scheduleTaskArchive(taskToComplete.id);
    } catch (error) {
      console.error("Error completando tarea:", error);
    }
  };

  const priorityOrder: Record<Task["priority"], number> = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  const statusLabel: Record<Task["status"], string> = {
    TODO: "Pendiente",
    IN_PROGRESS: "En progreso",
    BLOCKED: "Bloqueada",
    DONE: "Completada",
  };

  const priorityLabel: Record<Task["priority"], string> = {
    HIGH: "Alta",
    MEDIUM: "Media",
    LOW: "Baja",
  };

  const isTaskCreationDisabled = needsProject && !currentProjectId;

  return (
    <div className={`task-panel task-panel--${variant}`}>
      <div className="task-panel-header">
        <h1>Lista de tareas</h1>
        <p>Apunta tus objetivos de la sesión.</p>
      </div>

      <div className="task-panel-list">
        <ul className="task-list">
          {tasks
            .filter((task) => !task.archived)
            .sort((a, b) => {
              if (a.status === "DONE" && b.status !== "DONE") return 1;
              if (a.status !== "DONE" && b.status === "DONE") return -1;

              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((task) => (
              <li
                key={task.id}
                className={`task-item 
                  task-item--priority-${task.priority.toLowerCase()}
                  task-item--status-${task.status.toLowerCase()}
                  ${finishingTaskIds.has(task.id) ? "task-item--finishing" : ""}
                `}
              >
                <div className="task-main-content">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.status === "DONE"}
                    disabled={
                      finishingTaskIds.has(task.id) || task.status === "BLOCKED"
                    }
                    onChange={() => void handleCompleteTask(task)}
                  />

                  <div className="task-text-content">
                    <label htmlFor={`task-${task.id}`}>{task.title}</label>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-meta">
                      <span
                        className={`task-status task-status--${task.status.toLowerCase()}`}
                      >
                        {statusLabel[task.status]}
                      </span>

                      <span
                        className={`task-priority task-priority--${task.priority.toLowerCase()}`}
                      >
                        Prioridad {priorityLabel[task.priority]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="task-action-button task-edit-button"
                    title="Editar tarea"
                    disabled={finishingTaskIds.has(task.id)}
                    onClick={() => setTaskToEdit(task)}
                  >
                    <MdEdit />
                  </button>

                  <button
                    type="button"
                    className="task-action-button task-archive-button"
                    title="Archivar tarea"
                    disabled={finishingTaskIds.has(task.id)}
                    onClick={() => void handleArchiveTask(task)}
                  >
                    <MdArchive />
                  </button>

                  <button
                    type="button"
                    className="task-action-button task-delete-button"
                    title="Eliminar tarea"
                    disabled={finishingTaskIds.has(task.id)}
                    onClick={() => void handleDeleteTask(task)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div className="task-panel-footer">
        <input
          type="text"
          placeholder={
            isTaskCreationDisabled
              ? "No hay proyecto disponible"
              : "Insertar nueva tarea..."
          }
          value={newTask}
          disabled={isTaskCreationDisabled}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleAddTask();
            }
          }}
        />

        <button
          className="primary-button-task"
          type="button"
          disabled={isTaskCreationDisabled}
          onClick={() => void handleAddTask()}
        >
          Agregar tarea
        </button>
      </div>

      <TaskModal
        open={taskToEdit !== null}
        taskToEdit={taskToEdit}
        onClose={() => setTaskToEdit(null)}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}

export default TaskManager;