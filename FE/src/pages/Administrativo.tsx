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
  // PESTAÑA ACTIVA
  const [tabActiva, setTabActiva] = useState<
    'especialidades' | 'especialistas' | 'afiliados' | 'turnos'
  >('especialidades');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ESTADOS DE ESPECIALIDADES
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');
  const [editEspecialidadId, setEditEspecialidadId] = useState<number | null>(null);
  const [editNombreEspecialidad, setEditNombreEspecialidad] = useState('');

  // ESTADOS DE ESPECIALISTAS
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [nombreEspecialista, setNombreEspecialista] = useState('');
  const [matriculaEspecialista, setMatriculaEspecialista] = useState('');
  const [telefonoEspecialista, setTelefonoEspecialista] = useState('');
  const [emailEspecialista, setEmailEspecialista] = useState('');
  const [contrasenaEspecialista, setContrasenaEspecialista] = useState('');
  const [codEspecialidadSel, setCodEspecialidadSel] = useState<number | ''>('');
  
  const [editEspecialistaId, setEditEspecialistaId] = useState<number | null>(null);
  const [editNombreEspecialista, setEditNombreEspecialista] = useState('');
  const [editMatriculaEspecialista, setEditMatriculaEspecialista] = useState('');
  const [editTelefonoEspecialista, setEditTelefonoEspecialista] = useState('');
  const [editEmailEspecialista, setEditEmailEspecialista] = useState('');
  const [editContrasenaEspecialista, setEditContrasenaEspecialista] = useState('');
  const [editCodEspecialidadSel, setEditCodEspecialidadSel] = useState<number | ''>('');

  // ESTADOS DE AFILIADOS / PACIENTES
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [nombreAfiliado, setNombreAfiliado] = useState('');
  const [dniAfiliado, setDniAfiliado] = useState('');
  const [emailAfiliado, setEmailAfiliado] = useState('');
  const [telefonoAfiliado, setTelefonoAfiliado] = useState('');
  const [direccionAfiliado, setDireccionAfiliado] = useState('');
  const [contrasenaAfiliado, setContrasenaAfiliado] = useState('');

  const [editAfiliadoId, setEditAfiliadoId] = useState<number | null>(null);
  const [editNombreAfiliado, setEditNombreAfiliado] = useState('');
  const [editDniAfiliado, setEditDniAfiliado] = useState('');
  const [editEmailAfiliado, setEditEmailAfiliado] = useState('');
  const [editTelefonoAfiliado, setEditTelefonoAfiliado] = useState('');
  const [editDireccionAfiliado, setEditDireccionAfiliado] = useState('');
  const [editContrasenaAfiliado, setEditContrasenaAfiliado] = useState('');

  // ESTADOS DE TURNOS
  const [turnos, setTurnos] = useState<TurnoAdmin[]>([]);
  const [espEspecialidadSel, setEspEspecialidadSel] = useState<number | ''>(''); // 1. Especialidad
  const [espTurnoSel, setEspTurnoSel] = useState<number | ''>('');                 // 2. Médico
  const [afilTurnoSel, setAfilTurnoSel] = useState<number | ''>('');             // 3. Paciente
  const [fechaTurno, setFechaTurno] = useState('');                               // 4. Fecha
  const [horaTurno, setHoraTurno] = useState('');                                 // 5. Hora seleccionada

  // Franjas horarias base
  const horariosBase = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Filtrar médicos según la especialidad elegida
  const especialistasFiltrados = especialistas.filter((esp: any) => {
    if (!espEspecialidadSel) return true;
    const codEsp = esp.cod_especialidad || esp.codEspecialidad || esp.especialidad?.cod_especialidad;
    return Number(codEsp) === Number(espEspecialidadSel);
  });

  // FILTRAR HORARIOS: Oculta por completo los que ya están ocupados
  const horariosDisponibles = horariosBase.filter((hora) => {
    if (!espTurnoSel || !fechaTurno) return true;
    const yaOcupado = turnos.some((t: any) => {
      const medCod = Number(t.cod_especialista || t.especialista?.cod_especialista);
      const tFecha = t.fecha;
      const tHora = (t.hora_inicio || t.horaInicio || '').substring(0, 5);
      return medCod === Number(espTurnoSel) && tFecha === fechaTurno && tHora === hora;
    });
    return !yaOcupado;
  });

  // CARGA INICIAL DE DATOS DESDE LA API
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

  // HANDLERS DE ESPECIALIDADES
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

  // HANDLERS DE ESPECIALISTAS
  const handleCrearEspecialista = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (
      !nombreEspecialista.trim() ||
      !matriculaEspecialista.trim() ||
      !contrasenaEspecialista.trim()
    ) {
      alert('Nombre, matrícula y contraseña son requeridos.');
      return;
    }
    try {
      setIsSubmitting(true);
      await createEspecialista({
        nombre: nombreEspecialista.trim(),
        matricula: matriculaEspecialista.trim(),
        telefono: telefonoEspecialista.trim(),
        email: emailEspecialista.trim() || undefined,
        contrasena: contrasenaEspecialista.trim(),
        cod_especialidad: codEspecialidadSel === '' ? undefined : Number(codEspecialidadSel),
      } as any);
      setNombreEspecialista('');
      setMatriculaEspecialista('');
      setTelefonoEspecialista('');
      setEmailEspecialista('');
      setContrasenaEspecialista('');
      setCodEspecialidadSel('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al crear especialista');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditarEspecialista = (esp: Especialista) => {
    setEditEspecialistaId(esp.cod_especialista!);
    setEditNombreEspecialista(esp.nombre);
    setEditMatriculaEspecialista(esp.matricula);
    setEditTelefonoEspecialista(esp.telefono || '');
    setEditEmailEspecialista(esp.email || '');
    setEditContrasenaEspecialista('');
    setEditCodEspecialidadSel(esp.cod_especialidad || '');
  };

  const handleGuardarEditarEspecialista = async (cod: number) => {
    if (!editNombreEspecialista.trim() || !editMatriculaEspecialista.trim()) return;
    try {
      const dataUpdate: any = {
        nombre: editNombreEspecialista.trim(),
        matricula: editMatriculaEspecialista.trim(),
        telefono: editTelefonoEspecialista.trim(),
        email: editEmailEspecialista.trim() || undefined,
        cod_especialidad: editCodEspecialidadSel === '' ? undefined : Number(editCodEspecialidadSel),
      };
      if (editContrasenaEspecialista.trim()) {
        dataUpdate.contrasena = editContrasenaEspecialista.trim();
      }
      await updateEspecialista(cod, dataUpdate);
      setEditEspecialistaId(null);
      setEditContrasenaEspecialista('');
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

  // HANDLERS DE AFILIADOS / PACIENTES
  const handleCrearAfiliado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !nombreAfiliado.trim() ||
      !dniAfiliado.trim() ||
      !emailAfiliado.trim() ||
      !telefonoAfiliado.trim() ||
      !direccionAfiliado.trim() ||
      !contrasenaAfiliado.trim()
    ) {
      alert('Por favor complete todos los campos requeridos para el paciente.');
      return;
    }
    try {
      await createAfiliado({
        nombre: nombreAfiliado.trim(),
        dni: dniAfiliado.trim(),
        email: emailAfiliado.trim(),
        telefono: telefonoAfiliado.trim(),
        direccion: direccionAfiliado.trim(),
        contrasena: contrasenaAfiliado.trim(),
      });
      setNombreAfiliado('');
      setDniAfiliado('');
      setEmailAfiliado('');
      setTelefonoAfiliado('');
      setDireccionAfiliado('');
      setContrasenaAfiliado('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al registrar paciente');
    }
  };

  const handleStartEditarAfiliado = (a: any) => {
    const id = a.nro_afiliado || a.id;
    setEditAfiliadoId(id);
    setEditNombreAfiliado(a.nombre || a.nombreCompleto || '');
    setEditDniAfiliado(a.dni || '');
    setEditEmailAfiliado(a.email || '');
    setEditTelefonoAfiliado(a.telefono || '');
    setEditDireccionAfiliado(a.direccion || '');
    setEditContrasenaAfiliado('');
  };

  const handleGuardarEditarAfiliado = async (id: number) => {
    try {
      const dataUpdate: any = {
        nombre: editNombreAfiliado.trim(),
        dni: editDniAfiliado.trim(),
        email: editEmailAfiliado.trim(),
        telefono: editTelefonoAfiliado.trim(),
        direccion: editDireccionAfiliado.trim(),
      };
      if (editContrasenaAfiliado.trim()) {
        dataUpdate.contrasena = editContrasenaAfiliado.trim();
      }
      await updateAfiliado(id, dataUpdate);
      setEditAfiliadoId(null);
      setEditContrasenaAfiliado('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar paciente');
    }
  };

  const handleEliminarAfiliado = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar a este paciente?')) return;
    try {
      await deleteAfiliado(id);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar paciente');
    }
  };

  // HANDLERS DE TURNOS
  const handleAsignarTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaTurno || !horaTurno || !espTurnoSel || !afilTurnoSel) {
      alert('Por favor complete todos los campos (Especialidad, Médico, Paciente, Fecha y Hora).');
      return;
    }
    try {
      await createTurno({
        fecha: fechaTurno,
        hora_inicio: horaTurno,
        cod_especialista: Number(espTurnoSel),
        nro_afiliado: Number(afilTurnoSel),
      });
      setFechaTurno('');
      setHoraTurno('');
      setEspEspecialidadSel('');
      setEspTurnoSel('');
      setAfilTurnoSel('');
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al asignar el turno');
    }
  };

  const handleCancelarTurno = async (cod_turno: number) => {
    if (!confirm('¿Estás seguro de cancelar este turno? El horario quedará libre nuevamente.')) return;
    try {
      await cancelarTurno(cod_turno);
      cargarDatos();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar el turno');
    }
  };

  return (
    <PublicLayout activo="/administrativo">
      {/* HEADER */}
      <section className="fondo-punteado py-5">
        <div className="container text-center mx-auto" style={{ maxWidth: 700 }}>
          <span className="etiqueta-superior rounded-pill mb-3">
            Administración del Sistema
          </span>
          <h1
            className="fw-bold mb-3"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}
          >
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
              {error}. Por favor verifica que el backend esté corriendo.
            </div>
          )}

          {/* PESTAÑAS DE NAVEGACIÓN */}
          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group p-1 bg-light rounded-pill border shadow-sm flex-wrap justify-content-center">
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${
                  tabActiva === 'especialidades' ? 'btn-primary' : 'btn-light text-muted'
                }`}
                onClick={() => setTabActiva('especialidades')}
              >
                <i className="bi bi-clipboard2-pulse me-1"></i>Especialidades
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${
                  tabActiva === 'especialistas' ? 'btn-primary' : 'btn-light text-muted'
                }`}
                onClick={() => setTabActiva('especialistas')}
              >
                <i className="bi bi-person-badge me-1"></i>Especialistas
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${
                  tabActiva === 'afiliados' ? 'btn-primary' : 'btn-light text-muted'
                }`}
                onClick={() => setTabActiva('afiliados')}
              >
                <i className="bi bi-people me-1"></i>Pacientes / Afiliados
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${
                  tabActiva === 'turnos' ? 'btn-primary' : 'btn-light text-muted'
                }`}
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
                          <label className="form-label small fw-bold text-muted">
                            Nombre de la Especialidad
                          </label>
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
                          <i className="bi bi-check-lg me-1"></i>Guardar Especialidad
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
                              <th style={{ width: 100 }}>Código</th>
                              <th>Nombre</th>
                              <th className="text-end" style={{ width: 180 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {especialidades.map((esp) => (
                              <tr key={esp.cod_especialidad}>
                                <td>
                                  <span className="badge bg-light text-dark border">
                                    {esp.cod_especialidad}
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
                        <div className="mb-2">
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
                        <div className="mb-2">
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
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Teléfono</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 341-555-0101"
                            value={telefonoEspecialista}
                            onChange={(e) => setTelefonoEspecialista(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Email (Opcional)</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Ej: medico@consultorio.com"
                            value={emailEspecialista}
                            onChange={(e) => setEmailEspecialista(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Contraseña</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="******"
                            value={contrasenaEspecialista}
                            onChange={(e) => setContrasenaEspecialista(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Especialidad</label>
                          <select
                            className="form-select"
                            value={codEspecialidadSel}
                            onChange={(e) =>
                              setCodEspecialidadSel(
                                e.target.value ? Number(e.target.value) : ''
                              )
                            }
                          >
                            <option value="">Seleccione una especialidad</option>
                            {especialidades.map((esp) => (
                              <option key={esp.cod_especialidad} value={esp.cod_especialidad}>
                                {esp.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={isSubmitting}
                        >
                          <i className="bi bi-check-lg me-1"></i>
                          {isSubmitting ? 'Guardando...' : 'Guardar Especialista'}
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
                              <th>Matrícula / Tel. / Email</th>
                              <th>Especialidad</th>
                              <th className="text-end" style={{ width: 120 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {especialistas.map((esp: any) => {
                              const encontrada = especialidades.find(
                                (e) =>
                                  Number(e.cod_especialidad) === Number(esp.cod_especialidad || esp.codEspecialidad)
                              );
                              const espNombre = encontrada?.nombre || esp.especialidad?.nombre || 'Sin asignar';

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
                                          value={editMatriculaEspecialista}
                                          placeholder="Matrícula"
                                          onChange={(e) => setEditMatriculaEspecialista(e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Teléfono"
                                          value={editTelefonoEspecialista}
                                          onChange={(e) => setEditTelefonoEspecialista(e.target.value)}
                                        />
                                        <input
                                          type="email"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Email"
                                          value={editEmailEspecialista}
                                          onChange={(e) => setEditEmailEspecialista(e.target.value)}
                                        />
                                        <input
                                          type="password"
                                          className="form-control form-control-sm"
                                          placeholder="Nueva contraseña (opcional)"
                                          value={editContrasenaEspecialista}
                                          onChange={(e) => setEditContrasenaEspecialista(e.target.value)}
                                        />
                                      </>
                                    ) : (
                                      <div>
                                        <span className="badge bg-light text-dark border">
                                          {esp.matricula}
                                        </span>
                                        <small className="text-muted d-block mt-1">
                                          <i className="bi bi-telephone me-1"></i>
                                          {esp.telefono || 'Sin tel.'}
                                        </small>
                                        {esp.email && (
                                          <small className="text-muted d-block">
                                            <i className="bi bi-envelope me-1"></i>
                                            {esp.email}
                                          </small>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    {editEspecialistaId === esp.cod_especialista ? (
                                      <select
                                        className="form-select form-select-sm"
                                        value={editCodEspecialidadSel}
                                        onChange={(e) =>
                                          setEditCodEspecialidadSel(
                                            e.target.value ? Number(e.target.value) : ''
                                          )
                                        }
                                      >
                                        <option value="">Sin asignar</option>
                                        {especialidades.map((e) => (
                                          <option key={e.cod_especialidad} value={e.cod_especialidad}>
                                            {e.nombre}
                                          </option>
                                        ))}
                                      </select>
                                    ) : espNombre !== 'Sin asignar' ? (
                                      <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
                                        {espNombre}
                                      </span>
                                    ) : (
                                      <span className="badge rounded-pill bg-light text-muted border">
                                        Sin asignar
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
                        <i className="bi bi-person-plus-fill text-primary me-2"></i>Registrar Paciente
                      </h2>
                      <form onSubmit={handleCrearAfiliado}>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Juan Pérez"
                            value={nombreAfiliado}
                            onChange={(e) => setNombreAfiliado(e.target.value)}
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
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Teléfono</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 341-456789"
                            value={telefonoAfiliado}
                            onChange={(e) => setTelefonoAfiliado(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Dirección</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Calle 123"
                            value={direccionAfiliado}
                            onChange={(e) => setDireccionAfiliado(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-2">
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
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Contraseña</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="******"
                            value={contrasenaAfiliado}
                            onChange={(e) => setContrasenaAfiliado(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-lg me-1"></i>Guardar Paciente
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <h2 className="h5 fw-bold mb-3">Pacientes Registrados</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre Completo</th>
                              <th>DNI</th>
                              <th>Contacto / Dirección</th>
                              <th className="text-end" style={{ width: 120 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {afiliados.map((a: any) => {
                              const id = a.nro_afiliado || a.id;
                              return (
                                <tr key={id}>
                                  <td>
                                    {editAfiliadoId === id ? (
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editNombreAfiliado}
                                        onChange={(e) => setEditNombreAfiliado(e.target.value)}
                                      />
                                    ) : (
                                      <span className="fw-semibold">
                                        {a.nombre || a.nombreCompleto}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    {editAfiliadoId === id ? (
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editDniAfiliado}
                                        onChange={(e) => setEditDniAfiliado(e.target.value)}
                                      />
                                    ) : (
                                      <span className="badge bg-light text-dark border">
                                        {a.dni}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    {editAfiliadoId === id ? (
                                      <>
                                        <input
                                          type="email"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Email"
                                          value={editEmailAfiliado}
                                          onChange={(e) => setEditEmailAfiliado(e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Teléfono"
                                          value={editTelefonoAfiliado}
                                          onChange={(e) => setEditTelefonoAfiliado(e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Dirección"
                                          value={editDireccionAfiliado}
                                          onChange={(e) => setEditDireccionAfiliado(e.target.value)}
                                        />
                                        <input
                                          type="password"
                                          className="form-control form-control-sm"
                                          placeholder="Nueva clave (opcional)"
                                          value={editContrasenaAfiliado}
                                          onChange={(e) => setEditContrasenaAfiliado(e.target.value)}
                                        />
                                      </>
                                    ) : (
                                      <div>
                                        <small className="text-muted d-block">
                                          {a.email}
                                        </small>
                                        {a.telefono && (
                                          <small className="text-muted d-block">
                                            <i className="bi bi-telephone me-1"></i>{a.telefono}
                                          </small>
                                        )}
                                        {a.direccion && (
                                          <small className="text-muted d-block">
                                            <i className="bi bi-geo-alt me-1"></i>{a.direccion}
                                          </small>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    {editAfiliadoId === id ? (
                                      <div className="btn-group btn-group-sm">
                                        <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={() => handleGuardarEditarAfiliado(id)}
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
                                          onClick={() => handleEliminarAfiliado(id)}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {afiliados.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                  No hay pacientes registrados.
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

              {/* TAB 4: TURNOS CON FLUJO EN CASCADA Y VALIDACIONES DE CALENDARIO */}
              {tabActiva === 'turnos' && (
                <div className="row g-4">
                  <div className="col-lg-5">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-calendar-plus text-primary me-2"></i>Otorgar Turno Manual
                      </h2>
                      <form onSubmit={handleAsignarTurno}>
                        {/* 1. Especialidad */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">1. Especialidad</label>
                          <select
                            className="form-select"
                            value={espEspecialidadSel}
                            onChange={(e) => {
                              setEspEspecialidadSel(e.target.value ? Number(e.target.value) : '');
                              setEspTurnoSel('');
                              setFechaTurno('');
                              setHoraTurno('');
                            }}
                            required
                          >
                            <option value="">Seleccione una especialidad</option>
                            {especialidades.map((esp) => (
                              <option key={esp.cod_especialidad} value={esp.cod_especialidad}>
                                {esp.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 2. Médico Especialista */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">2. Médico Especialista</label>
                          <select
                            className="form-select"
                            value={espTurnoSel}
                            onChange={(e) => {
                              setEspTurnoSel(e.target.value ? Number(e.target.value) : '');
                              setFechaTurno('');
                              setHoraTurno('');
                            }}
                            disabled={!espEspecialidadSel}
                            required
                          >
                            <option value="">Seleccione un profesional</option>
                            {especialistasFiltrados.map((esp: any) => (
                              <option key={esp.cod_especialista} value={esp.cod_especialista}>
                                {esp.nombre} {esp.matricula ? `(Mat: ${esp.matricula})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 3. Paciente */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">3. Paciente / Afiliado</label>
                          <select
                            className="form-select"
                            value={afilTurnoSel}
                            onChange={(e) => setAfilTurnoSel(e.target.value ? Number(e.target.value) : '')}
                            required
                          >
                            <option value="">Seleccione un paciente</option>
                            {afiliados.map((a: any) => {
                              const afilId = a.nro_afiliado || a.id;
                              return (
                                <option key={afilId} value={afilId}>
                                  {a.nombre || a.nombreCompleto} (DNI: {a.dni})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* 4. Fecha del Turno (Validación de Fin de Semana, Feriados y Agenda Llena) */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">4. Fecha del Turno (Lun a Vie)</label>
                          <input
                            type="date"
                            className="form-control"
                            value={fechaTurno}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              const fechaVal = e.target.value;
                              if (fechaVal) {
                                // 1. Validar Fin de Semana (0 = Domingo, 6 = Sábado)
                                const diaSemana = new Date(fechaVal + 'T00:00:00').getDay();
                                if (diaSemana === 0 || diaSemana === 6) {
                                  alert('Los fines de semana no se atienden turnos. Por favor seleccione un día hábil (Lunes a Viernes).');
                                  setFechaTurno('');
                                  setHoraTurno('');
                                  return;
                                }

                                // 2. Validar Feriados
                                const feriadosAnio = [
                                  '2026-05-25',
                                  '2026-07-09',
                                  '2026-12-25',
                                ];
                                if (feriadosAnio.includes(fechaVal)) {
                                  alert('La fecha seleccionada es un día feriado. No hay atención disponible.');
                                  setFechaTurno('');
                                  setHoraTurno('');
                                  return;
                                }

                                // 3. Validar si el médico ya tiene todos los horarios ocupados en esa fecha
                                const ocupadosEnFecha = horariosBase.filter((h) => {
                                  return turnos.some((t: any) => {
                                    const medCod = Number(t.cod_especialista || t.especialista?.cod_especialista);
                                    const tFecha = t.fecha;
                                    const tHora = (t.hora_inicio || t.horaInicio || '').substring(0, 5);
                                    return medCod === Number(espTurnoSel) && tFecha === fechaVal && tHora === h;
                                  });
                                });

                                if (ocupadosEnFecha.length === horariosBase.length) {
                                  alert('El médico seleccionado ya tiene todos los horarios ocupados para esta fecha. Por favor elija otro día.');
                                  setFechaTurno('');
                                  setHoraTurno('');
                                  return;
                                }
                              }

                              setFechaTurno(fechaVal);
                              setHoraTurno('');
                            }}
                            disabled={!espTurnoSel}
                            required
                          />
                        </div>

                        {/* 5. Grilla Horaria (Oculta los turnos ya ocupados) */}
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">5. Horarios Disponibles</label>
                          {!espTurnoSel || !fechaTurno ? (
                            <div className="text-muted small fst-italic p-2 bg-light rounded border">
                              Seleccione especialista y fecha hábil para ver los horarios.
                            </div>
                          ) : horariosDisponibles.length === 0 ? (
                            <div className="text-danger small fst-italic p-2 bg-light rounded border">
                              No hay horarios disponibles para esta fecha.
                            </div>
                          ) : (
                            <div className="d-flex flex-wrap gap-1 p-2 bg-light rounded border" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                              {horariosDisponibles.map((hora) => (
                                <button
                                  key={hora}
                                  type="button"
                                  className={`btn btn-sm ${
                                    horaTurno === hora ? 'btn-primary shadow-sm' : 'btn-outline-primary'
                                  }`}
                                  onClick={() => setHoraTurno(hora)}
                                  style={{ minWidth: '65px' }}
                                >
                                  {hora}
                                </button>
                              ))}
                            </div>
                          )}
                          {horaTurno && (
                            <div className="text-success small fw-semibold mt-1">
                              <i className="bi bi-check-circle-fill me-1"></i> Horario seleccionado: {horaTurno}
                            </div>
                          )}
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={!horaTurno}>
                          <i className="bi bi-check-circle me-1"></i>Confirmar Turno
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-7">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">Turnos Asignados</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Fecha y Hora</th>
                              <th>Especialista</th>
                              <th>Paciente</th>
                              <th>Estado</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {turnos.map((t: any) => {
                              const espObj = especialistas.find(
                                (e) => Number(e.cod_especialista) === Number(t.cod_especialista || t.especialista?.cod_especialista)
                              );
                              const nroAfilBuscado = t.nro_afiliado || t.paciente?.nro_afiliado || t.paciente?.id;
                              const afilObj = afiliados.find((a: any) => Number(nroAfilBuscado) === Number(a.nro_afiliado || a.id));

                              const nombreEspecialista = espObj?.nombre || t.especialista?.nombre || 'Profesional';
                              const nombrePaciente = afilObj?.nombre || afilObj?.nombreCompleto || t.paciente?.nombre || t.paciente?.nombreCompleto || 'Paciente';
                              const dniPaciente = afilObj?.dni || t.paciente?.dni;
                              const turnoId = t.cod_turno || t.id;

                              return (
                                <tr key={turnoId}>
                                  <td>
                                    <div className="fw-semibold">{t.fecha}</div>
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>{t.hora_inicio || t.horaInicio}
                                    </small>
                                  </td>
                                  <td>
                                    <span className="fw-semibold">{nombreEspecialista}</span>
                                  </td>
                                  <td>
                                    <div>
                                      <span className="fw-semibold">{nombrePaciente}</span>
                                      {dniPaciente && (
                                        <small className="text-muted d-block">DNI: {dniPaciente}</small>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle">
                                      {t.estado || 'Confirmado'}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    {turnoId && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleCancelarTurno(turnoId)}
                                        title="Cancelar turno y liberar horario"
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
                                <td colSpan={5} className="text-center text-muted py-4">
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