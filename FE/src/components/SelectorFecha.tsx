import React from 'react';
import { hoyISO, sumarDias } from '../../services/fechas';

interface SelectorFechaProps {
  fecha: string;
  onCambiar: (nuevaFecha: string) => void;
}

export const SelectorFecha: React.FC<SelectorFechaProps> = ({ fecha, onCambiar }) => (
  <div className="d-flex flex-wrap align-items-center gap-2">
    <div className="btn-group">
      <button className="btn btn-outline-secondary" onClick={() => onCambiar(sumarDias(fecha, -1))} aria-label="Día anterior">
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="btn btn-outline-secondary" onClick={() => onCambiar(hoyISO())}>Hoy</button>
      <button className="btn btn-outline-secondary" onClick={() => onCambiar(sumarDias(fecha, 1))} aria-label="Día siguiente">
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
    <input
      type="date"
      className="form-control w-auto"
      value={fecha}
      onChange={(e) => e.target.value && onCambiar(e.target.value)}
      aria-label="Elegir fecha"
    />
  </div>
);