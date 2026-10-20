import React, { useEffect } from 'react';

interface ConfirmarModalProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export const ConfirmarModal: React.FC<ConfirmarModalProps> = ({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  onConfirmar,
  onCancelar,
}) => {
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && onCancelar();
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmar-titulo"
      onClick={onCancelar}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h2 className="modal-title h5 fw-bold" id="confirmar-titulo">{titulo}</h2>
          </div>
          <div className="modal-body text-muted">{mensaje}</div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
            <button type="button" className="btn btn-warning" onClick={onConfirmar} autoFocus>{textoConfirmar}</button>
          </div>
        </div>
      </div>
    </div>
  );
};