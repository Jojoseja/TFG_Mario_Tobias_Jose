import { useEffect, useState } from "react";
import "../styles/ProyectModal.css";
import type { Project } from "../types/project";
import { ApiConstants } from "../constants/ApiConstants";
import type { User } from "../types/user";
import type { ProjectCreateRequest } from "../types/project";
import type { ProjectUpdateRequest } from "../types/project";

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

        const updatedProject = await editarProyecto(
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

      const createdProject = await crearProyecto(createRequest);

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

async function crearProyecto(
  proyecto: ProjectCreateRequest
): Promise<Project | null> {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.id) {
    console.error("No se ha encontrado ningún id guardado");
    return null;
  }

  try {
    const response = await fetch(ApiConstants.PROJECT_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [ApiConstants.USER_ID_HEADER]: user.id,
      },
      body: JSON.stringify(proyecto),
    });

    if (!response.ok) {
      throw new Error(`Error creando el proyecto: ${response.status}`);
    }

    const createdProject: Project = await response.json();
    return createdProject;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function editarProyecto(
  projectId: string,
  proyecto: ProjectUpdateRequest
): Promise<Project | null> {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.id) {
    console.error("No se ha encontrado ningún id guardado");
    return null;
  }

  try {
    const response = await fetch(`${ApiConstants.PROJECT_PATH}/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        [ApiConstants.USER_ID_HEADER]: user.id,
      },
      body: JSON.stringify(proyecto),
    });

    if (!response.ok) {
      throw new Error(`Error editando el proyecto: ${response.status}`);
    }

    const updatedProject: Project = await response.json();
    return updatedProject;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default ProjectModal;