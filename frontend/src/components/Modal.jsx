function Modal({
    title,
    children,
    onClose,
    onSubmit,
    submitText = "Save",
    loading = false,
  }) {
    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget && !loading) {
        onClose();
      }
    };
  
    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-box" role="dialog" aria-modal="true">
          <div className="modal-header">
            <h2>{title}</h2>
  
            <button
              type="button"
              className="modal-close-button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            >
              ×
            </button>
          </div>
  
          <form onSubmit={onSubmit}>
            <div className="modal-content">{children}</div>
  
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
  
              <button
                type="submit"
                className="modal-submit-button"
                disabled={loading}
              >
                {loading ? "Saving..." : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default Modal;