import { useState, useEffect, useRef } from "react";
import { MdArchive, MdDelete, MdEdit } from "react-icons/md";
import "../styles/TaskManager.css";
import type { CreateTask, Task, UpdateTask } from "../types/task";
import { ApiConstants } from "../constants/ApiConstants";
import TaskModal from "./TaskModal";

type TaskManagerProps = {
  variant?: "home" | "project";
};

function TaskManager({ variant = "home" }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([
    /*
    {
      id: "22222222-2222-2222-2222-222222222222",
      title: "Tarea de prueba",
      description: "Esta tarea solo existe en modo desarrollo",
      archived: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      archivedAt: null,
      ownerId: "46d5b12e-7d10-457f-9baf-e4bb7f3c7d6e",
      parentTaskId: null,
      status: "TODO",
      priority: "MEDIUM",
      projectId: null,
    },
    */
  ]);

  const [newTask, setNewTask] = useState("");
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [finishingTaskIds, setFinishingTaskIds] = useState<Set<string>>(
    new Set()
  );

  const archiveTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  // TODO: Descomentar esto para cargar las tareas de la bbdd
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const projectId = getProjectId(variant);
        const tasksFromDb = await getTasksRequest(projectId);

        setTasks(tasksFromDb);
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };

    void loadTasks();
  }, [variant]);

  useEffect(() => {
    return () => {
      Object.values(archiveTimeoutsRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    const projectId = getProjectId(variant);

    const taskToAdd: CreateTask = {
      title: newTask.trim(),
      description: "",
      projectId,
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
      const updatedTask = await updateTaskRequest(taskId, taskToUpdate);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
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
      if (archiveTimeoutsRef.current[taskToComplete.id]) {
        clearTimeout(archiveTimeoutsRef.current[taskToComplete.id]);
        delete archiveTimeoutsRef.current[taskToComplete.id];
      }

      setFinishingTaskIds((prevIds) => {
        const nextIds = new Set(prevIds);
        nextIds.delete(taskToComplete.id);
        return nextIds;
      });

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

      setFinishingTaskIds((prevIds) => {
        const nextIds = new Set(prevIds);
        nextIds.add(taskToComplete.id);
        return nextIds;
      });

      archiveTimeoutsRef.current[taskToComplete.id] = setTimeout(async () => {
        const archiveTaskRequest: UpdateTask = {
          archived: true,
          archivedAt: new Date().toISOString(),
        };

        try {
          const archivedTask = await updateTaskRequest(
            taskToComplete.id,
            archiveTaskRequest
          );

          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskToComplete.id ? archivedTask : task
            )
          );

          setFinishingTaskIds((prevIds) => {
            const nextIds = new Set(prevIds);
            nextIds.delete(taskToComplete.id);
            return nextIds;
          });
        } catch (error) {
          console.error("Error archivando tarea completada:", error);

          setFinishingTaskIds((prevIds) => {
            const nextIds = new Set(prevIds);
            nextIds.delete(taskToComplete.id);
            return nextIds;
          });
        } finally {
          delete archiveTimeoutsRef.current[taskToComplete.id];
        }
      }, 1000);
    } catch (error) {
      console.error("Error completando tarea:", error);
    }
  };

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
            .map((task) => (
              <li
                key={task.id}
                className={`task-item ${
                  finishingTaskIds.has(task.id) ? "task-item--finishing" : ""
                }`}
              >
                <div className="task-main-content">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.status === "DONE"}
                    disabled={finishingTaskIds.has(task.id)}
                    onChange={() => void handleCompleteTask(task)}
                  />

                  <div className="task-text-content">
                    <label htmlFor={`task-${task.id}`}>{task.title}</label>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
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
          placeholder="Insertar nueva tarea..."
          value={newTask}
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

// Metodo auxiliar para obtener el projectId
function getProjectId(variant: "home" | "project"): string | null {
  if (variant !== "project") return null;

  const projectStorage = localStorage.getItem("project");

  if (!projectStorage) return null;

  try {
    const project = JSON.parse(projectStorage);
    return project.id ?? null;
  } catch {
    return projectStorage;
  }
}

// Metodo auxiliar para sacar el userId del localStorage
function getUserIdFromLocalStorage(): string {
  const userStorage = localStorage.getItem("user");

  if (!userStorage) {
    throw new Error("No hay User en localStorage");
  }

  const user = JSON.parse(userStorage);
  const userId = user.id;

  if (!userId) {
    throw new Error("El User de localStorage no tiene id");
  }

  return userId;
}

// Metodo para crear una tarea
async function createTaskRequest(taskToCreate: CreateTask): Promise<Task> {
  const userId = getUserIdFromLocalStorage();

  const response = await fetch(ApiConstants.TASK_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(taskToCreate),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error creando la tarea");
  }

  return await response.json();
}

// Metodo para eliminar una tarea
async function deleteTaskRequest(taskId: string): Promise<void> {
  const userId = getUserIdFromLocalStorage();

  const response = await fetch(`${ApiConstants.TASK_PATH}/${taskId}`, {
    method: "DELETE",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error borrando la tarea");
  }
}

// Metodo para actualizar una tarea
async function updateTaskRequest(
  taskId: string,
  taskToUpdate: UpdateTask
): Promise<Task> {
  const userId = getUserIdFromLocalStorage();

  const response = await fetch(`${ApiConstants.TASK_PATH}/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      [ApiConstants.USER_ID_HEADER]: userId,
    },
    body: JSON.stringify(taskToUpdate),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error actualizando la tarea");
  }

  return await response.json();
}

// Metodo para recoger todas las tareas de un usuario de la base de datos
async function getTasksRequest(projectId?: string | null): Promise<Task[]> {
  const userId = getUserIdFromLocalStorage();

  const params = new URLSearchParams();

  if (projectId) {
    params.append("projectId", projectId);
  }

  const url = params.toString()
    ? `${ApiConstants.TASK_PATH}?${params.toString()}`
    : ApiConstants.TASK_PATH;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: userId,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error cargando tareas");
  }

  return await response.json();
}

export default TaskManager;