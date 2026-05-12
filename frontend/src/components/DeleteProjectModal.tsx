import { useState } from "react";
import { MdDelete } from "react-icons/md";
import "../styles/ProyectModal.css";
import type { Project } from "../types/project";
import { deleteProjectRequest } from "../services/projectService";

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
      await deleteProjectRequest(projectToDelete.id);
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

export default DeleteProjectModal;