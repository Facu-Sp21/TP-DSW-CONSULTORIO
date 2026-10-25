import React from 'react';

interface CampoFormularioProps {
  id: string;
  etiqueta: string;
  value: string;
  error?: string;
  marcarInvalido?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  max?: string;
  claseContenedor?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const CampoFormulario: React.FC<CampoFormularioProps> = ({
  id,
  etiqueta,
  value,
  error,
  marcarInvalido = false,
  type = 'text',
  placeholder,
  autoComplete,
  maxLength,
  max,
  claseContenedor = 'mb-3',
  onChange,
  onBlur,
}) => {
  const invalido = Boolean(error) || marcarInvalido;

  return (
    <div className={claseContenedor}>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      <input
        type={type}
        className={`form-control${invalido ? ' is-invalid' : ''}`}
        id={id}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        max={max}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalido}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <div className="invalid-feedback" id={`${id}-error`}>{error}</div>}
    </div>
  );
};