import { useEffect, useState } from "react";
import "../styles/TaskModal.css";
import type { Priority, Status, Task, UpdateTask } from "../types/task";

type TaskModalProps = {
  open: boolean;
  taskToEdit: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, taskToUpdate: UpdateTask) => Promise<void>;
};

function TaskModal({
  open,
  taskToEdit,
  onClose,
  onUpdateTask,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [status, setStatus] = useState<Status>("TODO");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !taskToEdit) return;

    setTitle(taskToEdit.title);
    setDescription(taskToEdit.description ?? "");
    setPriority(taskToEdit.priority);
    setStatus(taskToEdit.status);
  }, [open, taskToEdit]);

  if (!open || !taskToEdit) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === "") return;

    const taskToUpdate: UpdateTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    };

    setIsSubmitting(true);

    try {
      await onUpdateTask(taskToEdit.id, taskToUpdate);
      onClose();
    } catch (error) {
      console.error("Error actualizando tarea", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityLabel = (priorityValue: Priority) => {
    if (priorityValue === "LOW") return "Baja";
    if (priorityValue === "MEDIUM") return "Media";
    return "Alta";
  };

  const getStatusLabel = (statusValue: Status) => {
    if (statusValue === "TODO") return "Pendiente";
    if (statusValue === "IN_PROGRESS") return "En progreso";
    if (statusValue === "BLOCKED") return "Bloqueada";
    return "Completada";
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dropdown = e.currentTarget.nextElementSibling;
    dropdown?.classList.toggle("open");
  };

  const closeDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.parentElement?.classList.remove("open");
  };

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h2>Editar tarea</h2>

          <button
            className="task-modal-close"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form className="task-modal-form" onSubmit={handleSubmit}>
          <div className="task-modal-field">
            <label htmlFor="task-title">Título</label>
            <input
              id="task-title"
              type="text"
              placeholder="Título de la tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="task-modal-field">
            <label htmlFor="task-description">Descripción</label>
            <textarea
              id="task-description"
              placeholder="Añade una descripción para la tarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="task-modal-two-columns">
            <div className="task-modal-field">
              <label>Prioridad</label>

              <div className="custom-select">
                <button
                  type="button"
                  className="custom-select-trigger"
                  onClick={toggleDropdown}
                  disabled={isSubmitting}
                >
                  <span>{getPriorityLabel(priority)}</span>
                  <span className="custom-select-arrow">⌄</span>
                </button>

                <div className="custom-select-menu">
                  <button
                    type="button"
                    className={`custom-select-option ${
                      priority === "LOW" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setPriority("LOW");
                      closeDropdown(e);
                    }}
                  >
                    Baja
                  </button>

                  <button
                    type="button"
                    className={`custom-select-option ${
                      priority === "MEDIUM" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setPriority("MEDIUM");
                      closeDropdown(e);
                    }}
                  >
                    Media
                  </button>

                  <button
                    type="button"
                    className={`custom-select-option ${
                      priority === "HIGH" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setPriority("HIGH");
                      closeDropdown(e);
                    }}
                  >
                    Alta
                  </button>
                </div>
              </div>
            </div>

            <div className="task-modal-field">
              <label>Estado</label>

              <div className="custom-select">
                <button
                  type="button"
                  className="custom-select-trigger"
                  onClick={toggleDropdown}
                  disabled={isSubmitting}
                >
                  <span>{getStatusLabel(status)}</span>
                  <span className="custom-select-arrow">⌄</span>
                </button>

                <div className="custom-select-menu">
                  <button
                    type="button"
                    className={`custom-select-option ${
                      status === "TODO" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setStatus("TODO");
                      closeDropdown(e);
                    }}
                  >
                    Pendiente
                  </button>

                  <button
                    type="button"
                    className={`custom-select-option ${
                      status === "IN_PROGRESS" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setStatus("IN_PROGRESS");
                      closeDropdown(e);
                    }}
                  >
                    En progreso
                  </button>

                  <button
                    type="button"
                    className={`custom-select-option ${
                      status === "BLOCKED" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setStatus("BLOCKED");
                      closeDropdown(e);
                    }}
                  >
                    Bloqueada
                  </button>

                  <button
                    type="button"
                    className={`custom-select-option ${
                      status === "DONE" ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      setStatus("DONE");
                      closeDropdown(e);
                    }}
                  >
                    Completada
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="task-modal-actions">
            <button
              type="button"
              className="task-secondary-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="task-primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;