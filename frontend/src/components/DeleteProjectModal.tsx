import { useState } from "react";
import { MdDelete } from "react-icons/md";
import "../styles/ProyectModal.css";
import type { Project } from "../types/project";
import type { User } from "../types/user";
import { ApiConstants } from "../constants/ApiConstants";

type DeleteProjectModalProps = {
  open: boolean;
  projectToDelete: Project | null;
  onClose: () => void;
  onDeleteProject: (projectId: string) => void;
};

function DeleteProjectModal({
  open,
  projectToDelete,
  onClose,
  onDeleteProject,
}: DeleteProjectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!open || !projectToDelete) return null;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteProjectEndpoint(projectToDelete.id);
      onDeleteProject(projectToDelete.id);
      onClose();
    } catch (error) {
      console.error("Error eliminando proyecto", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Eliminar proyecto</h2>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
            disabled={isDeleting}
          >
            ×
          </button>
        </div>

        <div className="delete-modal-content">
          <div className="delete-modal-icon">
            <MdDelete />
          </div>

          <p>
            ¿Seguro que quieres eliminar{" "}
            <strong>{projectToDelete.name}</strong>?
          </p>

          <span>Esta acción no se puede deshacer.</span>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

async function deleteProjectEndpoint(projectId: string): Promise<void> {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.id) {
    throw new Error("No se ha encontrado ningún id de usuario guardado");
  }

  const response = await fetch(`${ApiConstants.PROJECT_PATH}/${projectId}`, {
    method: "DELETE",
    headers: {
      [ApiConstants.USER_ID_HEADER]: user.id,
    },
  });

  if (!response.ok) {
    throw new Error(`Error eliminando proyecto: ${response.status}`);
  }
}

export default DeleteProjectModal;