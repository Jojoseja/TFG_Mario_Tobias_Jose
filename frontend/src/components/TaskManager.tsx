import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import "../styles/TaskManager.css";
import type { Task } from "../types/Task";

type TaskManagerProps = {
  variant?: "home" | "project";
};

function TaskManager({variant = "home"}: TaskManagerProps) {
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
  if (newTask.trim() === "") return;

    const taskToAdd: Task = {
      id: Date.now(),
      title: newTask.trim(),
      createdAt: new Date(),
      completed: false,
      projectId: 1,
    };

    setTasks((prevTasks) => [...prevTasks, taskToAdd]);
    setNewTask("");
  };
  const handleDeleteTask = (indexToDelete: number) => {
    setTasks((prevTasks) =>
      prevTasks.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleCompleteTask = (indexToComplete: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === indexToComplete
          ? { ...task, completed: !task.completed, completedAt: task.completed ? undefined : new Date() }
          : task
      )
    );
  };

  return(
      <div className={`task-panel task-panel--${variant}`}>
        <div className="task-panel-header">
          <h1>Lista de tareas</h1>
          <p>Apunta tus objetivos de la sesión.</p>
        </div>

        <div className="task-panel-list">
          <ul className="task-list">
            {tasks.map((task, index) => (
              <li key={index}>
                <input type="checkbox" id={`task-${index}`} onClick={() => handleCompleteTask(index)}/>
                <label htmlFor={`task-${index}`}>{task.title}</label>
                {task.createdAt && <span className="task-created-at">Creada el {(task.createdAt).toLocaleDateString()} a las {(task.createdAt).toLocaleTimeString()}</span>}
                {task.completedAt && <span className="task-completed-at">Completada el {(task.completedAt).toLocaleDateString()} a las {(task.completedAt).toLocaleTimeString()}</span>}
                <button onClick={() => handleDeleteTask(index)}>
                  <MdDelete/>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="task-panel-footer">
          <input 
            type="text" 
            placeholder="Insertar nueva tarea..." 
            value= {newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <button className="primary-button-task" onClick={handleAddTask}>
            Agregar tarea
          </button>
        </div>
      </div>
  );
}

export default TaskManager;