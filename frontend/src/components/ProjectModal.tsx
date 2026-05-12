import { useEffect, useState } from "react";
import "../styles/ProyectModal.css";
import type { Project } from "../types/project";
import type { ProjectCreateRequest } from "../types/project";
import type { ProjectUpdateRequest } from "../types/project";
import {
  createProjectRequest,
  updateProjectRequest,
} from "../services/projectService";

type ProjectModalProps = {
  open: boolean;
  mode: "create" | "edit";
  projectToEdit?: Project | null;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
};

function ProjectModal({
  open,
  mode,
  projectToEdit,
  onClose,
  onCreateProject,
  onUpdateProject,
}: ProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!open) return;

    if (isEditMode && projectToEdit) {
      setProjectName(projectToEdit.name);
      setProjectDescription(projectToEdit.description ?? "");
    } else {
      setProjectName("");
      setProjectDescription("");
    }
  }, [open, isEditMode, projectToEdit]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (projectName.trim() === "") return;

    setIsSubmitting(true);

    try {
      if (isEditMode && projectToEdit) {
        const updateRequest: ProjectUpdateRequest = {
          name: projectName.trim(),
          description: projectDescription.trim(),
        };

        const updatedProject = await updateProjectRequest(
          projectToEdit.id,
          updateRequest
        );

        if (updatedProject) {
          onUpdateProject(updatedProject);
          onClose();
        }

        return;
      }

      const createRequest: ProjectCreateRequest = {
        name: projectName.trim(),
        description: projectDescription.trim(),
      };

      const createdProject = await createProjectRequest(createRequest);

      if (createdProject) {
        onCreateProject(createdProject);
        onClose();
      }
    } catch (error) {
      console.error("Error guardando proyecto", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? "Editar proyecto" : "Nuevo proyecto"}</h2>

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
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : isEditMode
                  ? "Guardar cambios"
                  : "Crear proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;