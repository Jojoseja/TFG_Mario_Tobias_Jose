import { useState } from "react";
import "../styles/NewProyectModal.css";
import type { Project } from "../types/project";

type NewProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
};

function NewProjectModal({ open, onClose, onCreateProject }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (projectName.trim() === "") return;

    const now = new Date().toISOString();

    const newProject: Project = {
      id: Date.now(), // Temporal en frontend. Luego este ID vendrá de la BBDD.
      name: projectName.trim(),
      description: projectDescription.trim(),
      createdAt: now,
      updatedAt: now,
      tasks: [],
    };

    onCreateProject(newProject);

    setProjectName("");
    setProjectDescription("");

    onClose();
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

            <label htmlFor="project-description">Descripción del proyecto</label>
            <input
              id="project-description"
              type="text"
              placeholder="Escribe una descripción para el proyecto"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
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