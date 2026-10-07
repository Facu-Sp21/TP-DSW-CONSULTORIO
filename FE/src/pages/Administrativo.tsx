import React, { useEffect, useState } from 'react';
import { PublicLayout } from '../components/PublicLayout';

// Servicios de Backend
import {
  type Especialidad,
  getEspecialidades,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from '../../services/especialidadService';

import {
  type Especialista,
  getEspecialistas,
  createEspecialista,
  updateEspecialista,
  deleteEspecialista,
} from '../../services/especialistaService';

import {
  type Afiliado,
  getAfiliados,
  createAfiliado,
  updateAfiliado,
  deleteAfiliado,
} from '../../services/afiliadoService';

import {
  type TurnoAdmin,
  getTurnos,
  createTurno,
  cancelarTurno,
} from '../../services/turnoService';

export const Administrativo: React.FC = () => {
  // --- PESTAÑA ACTIVA ---
  const [tabActiva, setTabActiva] = useState<'especialidades' | 'especialistas' | 'afiliados' | 'turnos'>('especialidades');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // --- ESTADOS DE ESPECIALIDADES ---
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');
  const [editEspecialidadId, setEditEspecialidadId] = useState<number | null>(null);
  const [editNombreEspecialidad, setEditNombreEspecialidad] = useState('');

  // --- ESTADOS DE ESPECIALISTAS ---
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [nombreEspecialista, setNombreEspecialista] = useState('');
  const [matriculaEspecialista, setMatriculaEspecialista] = useState('');
  const [telefonoEspecialista, setTelefonoEspecialista] = useState('');
  const [codEspecialidadSel, setCodEspecialidadSel] = useState<number | ''>('');

  const [editEspecialistaId, setEditEspecialistaId] = useState<number | null>(null);
  const [editNombreEspecialista, setEditNombreEspecialista] = useState('');
  const [editMatriculaEspecialista, setEditMatriculaEspecialista] = useState('');
  const [editTelefonoEspecialista, setEditTelefonoEspecialista] = useState('');
  const [editCodEspecialidadSel, setEditCodEspecialidadSel] = useState<number | ''>('');

  // --- ESTADOS DE AFILIADOS / PACIENTES ---
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [nomCompletoAfiliado, setNomCompletoAfiliado] = useState('');
  const [dniAfiliado, setDniAfiliado] = useState('');
  const [emailAfiliado, setEmailAfiliado] = useState('');

  const [editAfiliadoId, setEditAfiliadoId] = useState<number | null>(null);
  const [editNomCompletoAfiliado, setEditNomCompletoAfiliado] = useState('');
  const [editDniAfiliado, setEditDniAfiliado] = useState('');
  const [editEmailAfiliado, setEditEmailAfiliado] = useState('');

  // --- ESTADOS DE TURNOS ---
  const [turnos, setTurnos] = useState<TurnoAdmin[]>([]);
  const [fechaTurno, setFechaTurno] = useState('');
  const [horaTurno, setHoraTurno] = useState('');
  const [espTurnoSel, setEspTurnoSel] = useState<number | ''>('');
  const [afilTurnoSel, setAfilTurnoSel] = useState<number | ''>('');

  // --- CARGA INICIAL DE DATOS DESDE LA API ---
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [espData, espListData, afilData, turnosData] = await Promise.all([
        getEspecialidades().catch(() => []),
        getEspecialistas().catch(() => []),
        getAfiliados().catch(() => []),
        getTurnos().catch(() => []),
      ]);
      setEspecialidades(espData);
      setEspecialistas(espListData);
      setAfiliados(afilData);
      setTurnos(turnosData);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- HANDLERS DE ESPECIALIDADES ---
  const handleCrearEspecialidad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreEspecialidad.trim()) return;
    try {
      await createEspecialidad({ nombre: nombreEspecialidad.trim() });
      setNombreEspecialidad('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al crear especialidad');
    }
  };

  const handleStartEditarEspecialidad = (esp: Especialidad) => {
    setEditEspecialidadId(esp.cod_especialidad!);
    setEditNombreEspecialidad(esp.nombre);
  };

  const handleGuardarEditarEspecialidad = async (cod: number) => {
    if (!editNombreEspecialidad.trim()) return;
    try {
      await updateEspecialidad(cod, { nombre: editNombreEspecialidad.trim() });
      setEditEspecialidadId(null);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar especialidad');
    }
  };

  const handleEliminarEspecialidad = async (cod: number) => {
    if (!confirm('¿Estás seguro de eliminar esta especialidad?')) return;
    try {
      await deleteEspecialidad(cod);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar especialidad');
    }
  };

  // --- HANDLERS DE ESPECIALISTAS ---
  const handleCrearEspecialista = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreEspecialista.trim() || !matriculaEspecialista.trim()) return;
    try {
      await createEspecialista({
        nombre: nombreEspecialista.trim(),
        matricula: matriculaEspecialista.trim(),
        telefono: telefonoEspecialista.trim(),
        cod_especialidad: codEspecialidadSel === '' ? undefined : Number(codEspecialidadSel),
      });
      setNombreEspecialista('');
      setMatriculaEspecialista('');
      setTelefonoEspecialista('');
      setCodEspecialidadSel('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al crear especialista');
    }
  };

  const handleStartEditarEspecialista = (esp: Especialista) => {
    setEditEspecialistaId(esp.cod_especialista!);
    setEditNombreEspecialista(esp.nombre);
    setEditMatriculaEspecialista(esp.matricula);
    setEditTelefonoEspecialista(esp.telefono);
    setEditCodEspecialidadSel(esp.cod_especialidad || '');
  };

  const handleGuardarEditarEspecialista = async (cod: number) => {
    if (!editNombreEspecialista.trim() || !editMatriculaEspecialista.trim()) return;
    try {
      await updateEspecialista(cod, {
        nombre: editNombreEspecialista.trim(),
        matricula: editMatriculaEspecialista.trim(),
        telefono: editTelefonoEspecialista.trim(),
        cod_especialidad: editCodEspecialidadSel === '' ? undefined : Number(editCodEspecialidadSel),
      });
      setEditEspecialistaId(null);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar especialista');
    }
  };

  const handleEliminarEspecialista = async (cod: number) => {
    if (!confirm('¿Estás seguro de eliminar este especialista?')) return;
    try {
      await deleteEspecialista(cod);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar especialista');
    }
  };

  // --- HANDLERS DE AFILIADOS / PACIENTES ---
  const handleCrearAfiliado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomCompletoAfiliado.trim() || !dniAfiliado.trim() || !emailAfiliado.trim()) return;
    try {
      await createAfiliado({
        nombreCompleto: nomCompletoAfiliado.trim(),
        dni: dniAfiliado.trim(),
        email: emailAfiliado.trim(),
      });
      setNomCompletoAfiliado('');
      setDniAfiliado('');
      setEmailAfiliado('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al registrar afiliado');
    }
  };

  const handleStartEditarAfiliado = (a: Afiliado) => {
    setEditAfiliadoId(a.id);
    setEditNomCompletoAfiliado(a.nombreCompleto);
    setEditDniAfiliado(a.dni);
    setEditEmailAfiliado(a.email);
  };

  const handleGuardarEditarAfiliado = async (id: number) => {
    try {
      await updateAfiliado(id, {
        nombreCompleto: editNomCompletoAfiliado.trim(),
        dni: editDniAfiliado.trim(),
        email: editEmailAfiliado.trim(),
      });
      setEditAfiliadoId(null);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar afiliado');
    }
  };

  const handleEliminarAfiliado = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar a este afiliado?')) return;
    try {
      await deleteAfiliado(id);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar afiliado');
    }
  };

  // --- HANDLERS DE TURNOS ---
  const handleAsignarTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaTurno || !horaTurno || !espTurnoSel) return;
    try {
      await createTurno({
        fecha: fechaTurno,
        hora: horaTurno,
        especialistaId: Number(espTurnoSel),
        afiliadoId: afilTurnoSel === '' ? undefined : Number(afilTurnoSel),
        estado: 'Confirmado',
      });
      setFechaTurno('');
      setHoraTurno('');
      setEspTurnoSel('');
      setAfilTurnoSel('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al asignar el turno');
    }
  };

  const handleCancelarTurno = async (id: number) => {
    if (!confirm('¿Estás seguro de cancelar este turno?')) return;
    try {
      await cancelarTurno(id);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar el turno');
    }
  };

  return (
    <PublicLayout activo="/administrativo">
      {/* HEADER */}
      <section className="fondo-punteado py-5">
        <div className="container text-center mx-auto" style={{ maxWidth: '700px' }}>
          <span className="etiqueta-superior rounded-pill mb-3">Administración del Sistema</span>
          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}>
            Panel <span className="texto-degradado">Administrativo</span>
          </h1>
          <p className="text-muted fs-5">
            Gestión global de especialidades, profesionales, pacientes y asignación de turnos.
          </p>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="py-5">
        <div className="container">
          {error && (
            <div className="alert alert-danger text-center mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}. Por favor verificá que el backend esté corriendo.
            </div>
          )}

          {/* PESTAÑAS DE NAVEGACIÓN */}
          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group p-1 bg-light rounded-pill border shadow-sm flex-wrap justify-content-center">
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${tabActiva === 'especialidades' ? 'btn-primary' : 'btn-light text-muted'}`}
                onClick={() => setTabActiva('especialidades')}
              >
                <i className="bi bi-clipboard2-pulse me-1"></i>Especialidades
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${tabActiva === 'especialistas' ? 'btn-primary' : 'btn-light text-muted'}`}
                onClick={() => setTabActiva('especialistas')}
              >
                <i className="bi bi-person-badge me-1"></i>Especialistas
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${tabActiva === 'afiliados' ? 'btn-primary' : 'btn-light text-muted'}`}
                onClick={() => setTabActiva('afiliados')}
              >
                <i className="bi bi-people me-1"></i>Pacientes / Afiliados
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${tabActiva === 'turnos' ? 'btn-primary' : 'btn-light text-muted'}`}
                onClick={() => setTabActiva('turnos')}
              >
                <i className="bi bi-calendar-event me-1"></i>Turnos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2">Cargando datos administrativos...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: ESPECIALIDADES */}
              {tabActiva === 'especialidades' && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-plus-circle text-primary me-2"></i>Nueva Especialidad
                      </h2>
                      <form onSubmit={handleCrearEspecialidad}>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Nombre de la Especialidad</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Pediatría, Cardiología..."
                            value={nombreEspecialidad}
                            onChange={(e) => setNombreEspecialidad(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-lg me-1"></i> Guardar Especialidad
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <h2 className="h5 fw-bold mb-3">Especialidades Registradas</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: '100px' }}>Código</th>
                              <th>Nombre</th>
                              <th className="text-end" style={{ width: '180px' }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {especialidades.map((esp) => (
                              <tr key={esp.cod_especialidad}>
                                <td>
                                  <span className="badge rounded-pill bg-light text-dark border">
                                    #{esp.cod_especialidad}
                                  </span>
                                </td>
                                <td>
                                  {editEspecialidadId === esp.cod_especialidad ? (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editNombreEspecialidad}
                                      onChange={(e) => setEditNombreEspecialidad(e.target.value)}
                                    />
                                  ) : (
                                    <span className="fw-semibold">{esp.nombre}</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  {editEspecialidadId === esp.cod_especialidad ? (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => handleGuardarEditarEspecialidad(esp.cod_especialidad!)}
                                      >
                                        <i className="bi bi-check-lg"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setEditEspecialidadId(null)}
                                      >
                                        <i className="bi bi-x-lg"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => handleStartEditarEspecialidad(esp)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleEliminarEspecialidad(esp.cod_especialidad!)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {especialidades.length === 0 && (
                              <tr>
                                <td colSpan={3} className="text-center text-muted py-4">
                                  No hay especialidades registradas.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ESPECIALISTAS */}
              {tabActiva === 'especialistas' && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-person-plus text-primary me-2"></i>Nuevo Especialista
                      </h2>
                      <form onSubmit={handleCrearEspecialista}>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Dr. Esteban Quito"
                            value={nombreEspecialista}
                            onChange={(e) => setNombreEspecialista(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Matrícula</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: MP-30192"
                            value={matriculaEspecialista}
                            onChange={(e) => setMatriculaEspecialista(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Teléfono</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 341-555-0101"
                            value={telefonoEspecialista}
                            onChange={(e) => setTelefonoEspecialista(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Especialidad</label>
                          <select
                            className="form-select"
                            value={codEspecialidadSel}
                            onChange={(e) => setCodEspecialidadSel(e.target.value ? Number(e.target.value) : '')}
                          >
                            <option value="">Seleccione una especialidad</option>
                            {especialidades.map((esp) => (
                              <option key={esp.cod_especialidad} value={esp.cod_especialidad}>
                                {esp.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-lg me-1"></i> Guardar Especialista
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <h2 className="h5 fw-bold mb-3">Especialistas Registrados</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre</th>
                              <th>Matrícula / Tel.</th>
                              <th>Especialidad</th>
                              <th className="text-end" style={{ width: '120px' }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {especialistas.map((esp) => {
                              const espNombre = especialidades.find(
                                (e) => e.cod_especialidad === esp.cod_especialidad
                              )?.nombre || 'Sin asignar';

                              return (
                                <tr key={esp.cod_especialista}>
                                  <td>
                                    {editEspecialistaId === esp.cod_especialista ? (
                                      <input
                                        type="text"
                                        className="form-control form-control-sm mb-1"
                                        value={editNombreEspecialista}
                                        onChange={(e) => setEditNombreEspecialista(e.target.value)}
                                      />
                                    ) : (
                                      <div className="fw-semibold">{esp.nombre}</div>
                                    )}
                                  </td>
                                  <td>
                                    {editEspecialistaId === esp.cod_especialista ? (
                                      <>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Matrícula"
                                          value={editMatriculaEspecialista}
                                          onChange={(e) => setEditMatriculaEspecialista(e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          placeholder="Teléfono"
                                          value={editTelefonoEspecialista}
                                          onChange={(e) => setEditTelefonoEspecialista(e.target.value)}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <div><span className="badge bg-light text-dark border">{esp.matricula}</span></div>
                                        <small className="text-muted"><i className="bi bi-telephone me-1"></i>{esp.telefono || 'Sin tel.'}</small>
                                      </>
                                    )}
                                  </td>
                                  <td>
                                    {editEspecialistaId === esp.cod_especialista ? (
                                      <select
                                        className="form-select form-select-sm"
                                        value={editCodEspecialidadSel}
                                        onChange={(e) => setEditCodEspecialidadSel(e.target.value ? Number(e.target.value) : '')}
                                      >
                                        <option value="">Sin asignar</option>
                                        {especialidades.map((e) => (
                                          <option key={e.cod_especialidad} value={e.cod_especialidad}>
                                            {e.nombre}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
                                        {espNombre}
                                      </span>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    {editEspecialistaId === esp.cod_especialista ? (
                                      <div className="btn-group btn-group-sm">
                                        <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={() => handleGuardarEditarEspecialista(esp.cod_especialista!)}
                                        >
                                          <i className="bi bi-check-lg"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-secondary"
                                          onClick={() => setEditEspecialistaId(null)}
                                        >
                                          <i className="bi bi-x-lg"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="btn-group btn-group-sm">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary"
                                          onClick={() => handleStartEditarEspecialista(esp)}
                                        >
                                          <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-danger"
                                          onClick={() => handleEliminarEspecialista(esp.cod_especialista!)}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {especialistas.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                  No hay especialistas registrados.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AFILIADOS / PACIENTES */}
              {tabActiva === 'afiliados' && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-person-plus-fill text-primary me-2"></i>Registrar Afiliado
                      </h2>
                      <form onSubmit={handleCrearAfiliado}>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Juan Pérez"
                            value={nomCompletoAfiliado}
                            onChange={(e) => setNomCompletoAfiliado(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">DNI</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 38123456"
                            value={dniAfiliado}
                            onChange={(e) => setDniAfiliado(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="juan@ejemplo.com"
                            value={emailAfiliado}
                            onChange={(e) => setEmailAfiliado(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-lg me-1"></i> Guardar Afiliado
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <h2 className="h5 fw-bold mb-3">Afiliados Registrados</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre Completo</th>
                              <th>DNI</th>
                              <th>Email</th>
                              <th className="text-end" style={{ width: '120px' }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {afiliados.map((a) => (
                              <tr key={a.id}>
                                <td>
                                  {editAfiliadoId === a.id ? (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editNomCompletoAfiliado}
                                      onChange={(e) => setEditNomCompletoAfiliado(e.target.value)}
                                    />
                                  ) : (
                                    <span className="fw-semibold">{a.nombreCompleto}</span>
                                  )}
                                </td>
                                <td>
                                  {editAfiliadoId === a.id ? (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editDniAfiliado}
                                      onChange={(e) => setEditDniAfiliado(e.target.value)}
                                    />
                                  ) : (
                                    <span className="badge bg-light text-dark border">{a.dni}</span>
                                  )}
                                </td>
                                <td>
                                  {editAfiliadoId === a.id ? (
                                    <input
                                      type="email"
                                      className="form-control form-control-sm"
                                      value={editEmailAfiliado}
                                      onChange={(e) => setEditEmailAfiliado(e.target.value)}
                                    />
                                  ) : (
                                    <small className="text-muted">{a.email}</small>
                                  )}
                                </td>
                                <td className="text-end">
                                  {editAfiliadoId === a.id ? (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => handleGuardarEditarAfiliado(a.id)}
                                      >
                                        <i className="bi bi-check-lg"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setEditAfiliadoId(null)}
                                      >
                                        <i className="bi bi-x-lg"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => handleStartEditarAfiliado(a)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleEliminarAfiliado(a.id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {afiliados.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                  No hay afiliados registrados.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TURNOS */}
              {tabActiva === 'turnos' && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-calendar-plus text-primary me-2"></i>Otorgar Turno Manual
                      </h2>
                      <form onSubmit={handleAsignarTurno}>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Especialista</label>
                          <select
                            className="form-select"
                            value={espTurnoSel}
                            onChange={(e) => setEspTurnoSel(e.target.value ? Number(e.target.value) : '')}
                            required
                          >
                            <option value="">Seleccione profesional</option>
                            {especialistas.map((esp) => (
                              <option key={esp.cod_especialista} value={esp.cod_especialista}>
                                {esp.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Afiliado (Opcional)</label>
                          <select
                            className="form-select"
                            value={afilTurnoSel}
                            onChange={(e) => setAfilTurnoSel(e.target.value ? Number(e.target.value) : '')}
                          >
                            <option value="">Paciente presencial / telefónico</option>
                            {afiliados.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.nombreCompleto} (DNI: {a.dni})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Fecha</label>
                          <input
                            type="date"
                            className="form-control"
                            value={fechaTurno}
                            onChange={(e) => setFechaTurno(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Hora</label>
                          <input
                            type="time"
                            className="form-control"
                            value={horaTurno}
                            onChange={(e) => setHoraTurno(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-circle me-1"></i> Confirmar Turno
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <h2 className="h5 fw-bold mb-3">Turnos Asignados</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Fecha y Hora</th>
                              <th>Especialista</th>
                              <th>Estado</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {turnos.map((t) => {
                              const espObj = especialistas.find((e) => e.cod_especialista === t.especialistaId);
                              return (
                                <tr key={t.id || Math.random()}>
                                  <td>
                                    <div className="fw-semibold">{t.fecha}</div>
                                    <small className="text-muted"><i className="bi bi-clock me-1"></i>{t.hora}</small>
                                  </td>
                                  <td>{espObj ? espObj.nombre : 'Profesional'}</td>
                                  <td>
                                    <span
                                      className={`badge rounded-pill ${
                                        t.estado === 'Confirmado' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'
                                      }`}
                                    >
                                      {t.estado}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    {t.estado === 'Confirmado' && t.id && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleCancelarTurno(t.id!)}
                                      >
                                        <i className="bi bi-x-circle me-1"></i>Cancelar
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {turnos.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                  No hay turnos registrados en el sistema.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};