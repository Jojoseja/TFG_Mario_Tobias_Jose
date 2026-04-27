import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";


function TaskManager(){
  
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
  if (newTask.trim() === "") return;

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTask("");
  };
  const handleDeleteTask = (indexToDelete: number) => {
    setTasks((prevTasks) =>
      prevTasks.filter((_, index) => index !== indexToDelete)
    );
  };

  return(
      <div className="task-panel">
        <div className="task-panel-header">
          <h1>Lista de tareas</h1>
          <p>Apunta tus objetivos de la sesión.</p>
        </div>

        <div className="task-panel-list">
          <ul className="task-list">
            {tasks.map((task, index) => (
              <li key={index}>
                <input type="checkbox" id={`task-${index}`} />
                <label htmlFor={`task-${index}`}>{task}</label>
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
          <button className="primary-button" onClick={handleAddTask}>
            Agregar tarea
          </button>
        </div>
      </div>
  );
}

export default TaskManager;