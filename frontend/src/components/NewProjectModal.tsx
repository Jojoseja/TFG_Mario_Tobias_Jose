import "../styles/NewProyectModal.css";

type NewProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo proyecto</h2>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className="modal-form">
          <div className="modal-field">
            <label htmlFor="project-name">Nombre del proyecto</label>
            <input
              id="project-name"
              type="text"
              placeholder="Escribe el nombre del proyecto"
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