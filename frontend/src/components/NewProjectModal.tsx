import { useState } from "react";
import "../styles/NewProyectModal.css";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { MdDelete } from "react-icons/md";


type NewProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
};

//TODO: Agregar una opción de personalizado y que habra unas entradas de texto que se asignarán a unas variables
const pomodoroOptions = [
  {
    value: "15-3",
    label: "Corto: 15 min trabajo / 3 min descanso",
    workMinutes: 15,
    breakMinutes: 3,
  },
  {
    value: "25-5",
    label: "Clásico: 25 min trabajo / 5 min descanso",
    workMinutes: 25,
    breakMinutes: 5,
  },
  {
    value: "50-10",
    label: "Largo: 50 min trabajo / 10 min descanso",
    workMinutes: 50,
    breakMinutes: 10,
  }
];

function NewProjectModal({open, onClose, onCreateProject}: NewProjectModalProps) {

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [pomoConfig, setPomoConfig] = useState("25-5");

  type InitialTask = Omit<Task, "projectId">;
  const [taskTitle, setTaskTitle] = useState("");
  const [initialTasks, setInitialTasks] = useState<InitialTask[]>([]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (projectName.trim() === "") return;

    const projectId = Date.now();
    const now = new Date().toISOString();

    const tasksWithProjectId: Task[] = initialTasks.map((task) => ({
      ...task,
      projectId,
    }));

    const selectedPomodoroConfig = pomodoroOptions.find(
      (option) => option.value === pomoConfig
    );

    const newProject: Project = {
      id: projectId,
      name: projectName.trim(),
      description: projectDescription.trim(),
      createdAt: now,
      updatedAt: now,
      tasks: tasksWithProjectId,
      pomodoroConfig: {
        workMinutes: selectedPomodoroConfig?.workMinutes ?? 25,
        breakMinutes: selectedPomodoroConfig?.breakMinutes ?? 5
      }
    };

    onCreateProject(newProject);

    setProjectName("");
    setProjectDescription("");
    setTaskTitle("");
    setInitialTasks([]);

    onClose();
  };

  const handleAddTask = () => {
    if (taskTitle.trim() === "") return;

    const now = new Date();

    const newTask: InitialTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      completed: false,
      createdAt: now
    };

    setInitialTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskTitle("");
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo proyecto</h2>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="project-name">Nombre del proyecto</label>
            <input
              id="project-name"
              type="text"
              placeholder="Escribe el nombre del proyecto"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label htmlFor="project-description">
              Descripción del proyecto
            </label>
            <input
              id="project-description"
              type="text"
              placeholder="Escribe una descripción para el proyecto"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />

            <label htmlFor="pomodoro-config">
              Configuración del pomodoro
            </label>
            <select
              id="pomodoro-config"
              value={pomoConfig}
              onChange={(e) => setPomoConfig(e.target.value)}
            >
              {pomodoroOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="task-title">Tareas iniciales</label>

            <div className="task-input-row">
              <input
                id="task-title"
                type="text"
                placeholder="Escribe una tarea inicial"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <button type="button" onClick={handleAddTask}>Añadir</button>
            </div>

            <ul className="initial-task-list">
              {initialTasks.map((task) => (
                <li key={task.id}>
                  <span>{task.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setInitialTasks((prevTasks) =>
                        prevTasks.filter((item) => item.id !== task.id)
                      )
                    }
                  >
                    <MdDelete/>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="primary-button">
              Crear proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProjectModal;