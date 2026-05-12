import { useState, useEffect, useRef } from "react";
import { MdArchive, MdDelete, MdEdit } from "react-icons/md";
import "../styles/TaskManager.css";
import type { CreateTask, Task, UpdateTask } from "../types/task";
import TaskModal from "./TaskModal";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  updateTaskRequest,
} from "../services/taskService";

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

  const currentProjectId = variant === "project" ? projectId : null;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (variant === "project" && !projectId) {
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
  }, [variant, projectId, currentProjectId]);

  useEffect(() => {
    return () => {
      Object.values(archiveTimeoutsRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    if (variant === "project" && !projectId) {
      console.error("No se puede crear una tarea de proyecto sin projectId");
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

export default TaskManager;