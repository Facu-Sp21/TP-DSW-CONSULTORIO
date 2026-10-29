import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';
import { getUsuarioActual, isAuthenticated } from '../../services/authService';

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
  type Paciente,
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from '../../services/pacienteService';
import {
  type TurnoAdmin,
  getTurnos,
  createTurno,
  cancelarTurno,
} from '../../services/turnoService';
import {
  type ObraSocial,
  getObrasSociales,
  createObraSocial,
  updateObraSocial,
  deleteObraSocial,
} from '../../services/obraSocialService';
import { esHorarioPasado } from '../utils/turno';

export const Administrativo: React.FC = () => {
  const usuario = getUsuarioActual();

  // PESTAÑA ACTIVA
  const [tabActiva, setTabActiva] = useState<
    'especialidades' | 'especialistas' | 'pacientes' | 'turnos' | 'obras-sociales'
  >('especialidades');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ESTADO PARA MODAL / CARTEL INTEGRADO
  const [modalAlerta, setModalAlerta] = useState<{
    show: boolean;
    titulo: string;
    mensaje: string;
    tipo: 'error' | 'success' | 'confirm';
    onConfirm?: () => void;
  }>({ show: false, titulo: '', mensaje: '', tipo: 'error' });

  // ESTADOS DE OBRAS SOCIALES
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [nombreObraSocial, setNombreObraSocial] = useState('');
  const [editObraSocialId, setEditObraSocialId] = useState<number | null>(null);
  const [editNombreObraSocial, setEditNombreObraSocial] = useState('');

  const [obrasSocialesSel, setObrasSocialesSel] = useState<number[]>([]);
  const [editObrasSocialesSel, setEditObrasSocialesSel] = useState<number[]>([]);

  // ESTADOS DE ESPECIALIDADES
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');
  const [duracionEspecialidad, setDuracionEspecialidad] = useState('30');
  const [estadoEspecialidad, setEstadoEspecialidad] = useState(true);
  const [editEspecialidadId, setEditEspecialidadId] = useState<number | null>(null);
  const [editNombreEspecialidad, setEditNombreEspecialidad] = useState('');
  const [editDuracionEspecialidad, setEditDuracionEspecialidad] = useState('');
  const [editEstadoEspecialidad, setEditEstadoEspecialidad] = useState(true);

  // ESTADOS DE ESPECIALISTAS
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [dniEspecialista, setDniEspecialista] = useState('');
  const [nombreEspecialista, setNombreEspecialista] = useState('');
  const [matriculaEspecialista, setMatriculaEspecialista] = useState('');
  const [telefonoEspecialista, setTelefonoEspecialista] = useState('');
  const [emailEspecialista, setEmailEspecialista] = useState('');
  const [contrasenaEspecialista, setContrasenaEspecialista] = useState('');
  const [estadoEspecialista, setEstadoEspecialista] = useState(true);
  const [consultaParticularEspecialista, setConsultaParticularEspecialista] = useState<number | ''>(0);
  const [codEspecialidadSel, setCodEspecialidadSel] = useState<number | ''>('');

  const [editEspecialistaId, setEditEspecialistaId] = useState<number | null>(null);
  const [editDniEspecialista, setEditDniEspecialista] = useState('');
  const [editNombreEspecialista, setEditNombreEspecialista] = useState('');
  const [editMatriculaEspecialista, setEditMatriculaEspecialista] = useState('');
  const [editTelefonoEspecialista, setEditTelefonoEspecialista] = useState('');
  const [editEmailEspecialista, setEditEmailEspecialista] = useState('');
  const [editContrasenaEspecialista, setEditContrasenaEspecialista] = useState('');
  const [editEstadoEspecialista, setEditEstadoEspecialista] = useState(true);
  const [editConsultaParticularEspecialista, setEditConsultaParticularEspecialista] = useState<number | ''>(0);
  const [editCodEspecialidadSel, setEditCodEspecialidadSel] = useState<number | ''>('');
  const [mostrarBusquedaEspecialista, setMostrarBusquedaEspecialista] = useState(false);
  const [busquedaDniEspecialista, setBusquedaDniEspecialista] = useState('');

  // ESTADOS DE PACIENTES
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [dniPaciente, setDniPaciente] = useState('');
  const [emailPaciente, setEmailPaciente] = useState('');
  const [telefonoPaciente, setTelefonoPaciente] = useState('');
  const [direccionPaciente, setDireccionPaciente] = useState('');
  const [contrasenaPaciente, setContrasenaPaciente] = useState('');
  const [osPacienteSel, setOsPacienteSel] = useState<number | ''>('');

  const [editPacienteId, setEditPacienteId] = useState<number | null>(null);
  const [editNombrePaciente, setEditNombrePaciente] = useState('');
  const [editDniPaciente, setEditDniPaciente] = useState('');
  const [editEmailPaciente, setEditEmailPaciente] = useState('');
  const [editTelefonoPaciente, setEditTelefonoPaciente] = useState('');
  const [editDireccionPaciente, setEditDireccionPaciente] = useState('');
  const [editContrasenaPaciente, setEditContrasenaPaciente] = useState('');
  const [editOsPacienteSel, setEditOsPacienteSel] = useState<number | ''>('');
  const [mostrarBusquedaPaciente, setMostrarBusquedaPaciente] = useState(false);
  const [busquedaDniPaciente, setBusquedaDniPaciente] = useState('');

  // ESTADOS DE TURNOS
  const [turnos, setTurnos] = useState<TurnoAdmin[]>([]);
  const [espEspecialidadSel, setEspEspecialidadSel] = useState<number | ''>('');
  const [espTurnoSel, setEspTurnoSel] = useState<number | ''>('');
  const [pacTurnoSel, setPacTurnoSel] = useState<number | ''>('');
  const [fechaTurno, setFechaTurno] = useState('');
  const [horaTurno, setHoraTurno] = useState('');

  // Duración en minutos de la especialidad seleccionada para turnos
  const especialidadTurnoObj = especialidades.find(
    (esp) => Number(esp.cod_especialidad) === Number(espEspecialidadSel)
  );
  const duracionMinutosTurno = especialidadTurnoObj?.duracion_minutos || 30;

  // Generación dinámica de franjas horarias
  const obtenerHorariosDinamicos = (duracion: number) => {
    const horarios = [];
    let minActual = 8 * 60; // 08:00 hrs
    const minFin = 17 * 60; // 17:00 hrs
    while (minActual < minFin) {
      const h = Math.floor(minActual / 60);
      const m = minActual % 60;
      horarios.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      minActual += duracion;
    }
    return horarios;
  };

  const horariosDinamicos = obtenerHorariosDinamicos(duracionMinutosTurno);

  // Filtrar médicos según la especialidad elegida
  const especialistasFiltrados = especialistas.filter((esp: any) => {
    if (!espEspecialidadSel || esp.estado === false) return false;
    const codEsp =
      esp.cod_especialidad ||
      esp.codEspecialidad ||
      esp.especialidad?.cod_especialidad;
    return Number(codEsp) === Number(espEspecialidadSel);
  });

  const normalizarDni = (dni: unknown) => String(dni ?? '').replace(/\D/g, '');

  const especialistasFiltradosPorDni = especialistas.filter((esp) =>
    normalizarDni(esp.dni).includes(normalizarDni(busquedaDniEspecialista))
  );

  const pacientesFiltradosPorDni = pacientes.filter((paciente) =>
    normalizarDni(paciente.dni).includes(normalizarDni(busquedaDniPaciente))
  );

  // FILTRAR HORARIOS: Oculta por completo los que ya están ocupados por turnos activos
  const horariosDisponibles = horariosDinamicos.filter((hora) => {
    if (!espTurnoSel || !fechaTurno) return true;
    if (esHorarioPasado(fechaTurno, hora)) return false;

    const yaOcupado = turnos.some((t: any) => {
      const medCod = Number(t.cod_especialista || t.especialista?.cod_especialista);
      const tFecha = t.fecha;
      const tHora = (t.hora_inicio || t.horaInicio || '').substring(0, 5);
      const estadoTurno = (t.estado || '').toUpperCase();
      if (estadoTurno === 'CANCELADO') return false;
      return medCod === Number(espTurnoSel) && tFecha === fechaTurno && tHora === hora;
    });
    return !yaOcupado;
  });

  // Filtrar turnos activos para la tabla
  const turnosActivos = turnos.filter((t: any) => {
    const estado = (t.estado || '').toUpperCase();
    return estado !== 'CANCELADO';
  });

  // CARGA INICIAL DE DATOS DESDE LA API
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [espData, espListData, pacData, turnosData, osData] = await Promise.all([
        getEspecialidades().catch(() => []),
        getEspecialistas().catch(() => []),
        getPacientes().catch(() => []),
        getTurnos().catch(() => []),
        getObrasSociales().catch(() => []),
      ]);
      setEspecialidades(espData);
      setEspecialistas(espListData);
      setPacientes(pacData);
      setTurnos(turnosData);
      setObrasSociales(osData);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (!isAuthenticated() || usuario?.rol !== 'administrativo') {
    return <Navigate to="/login" replace />;
  }

  // HANDLERS DE OBRAS SOCIALES
  const handleCrearObraSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreObraSocial.trim()) {
      setModalAlerta({
        show: true,
        titulo: 'Campo incompleto',
        mensaje: 'El campo "Nombre de la Obra Social" es obligatorio.',
        tipo: 'error',
      });
      return;
    }

    try {
      await createObraSocial({ nombre: nombreObraSocial.trim() });
      setNombreObraSocial('');
      setModalAlerta({
        show: true,
        titulo: '¡Éxito!',
        mensaje: 'Obra social registrada correctamente.',
        tipo: 'success',
      });
      cargarDatos();
    } catch (err: any) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: err.message || 'Error al crear la obra social',
        tipo: 'error',
      });
    }
  };

  const handleGuardarEditarObraSocial = async (cod: number) => {
    if (!editNombreObraSocial.trim()) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: 'El nombre no puede estar vacío.',
        tipo: 'error',
      });
      return;
    }

    try {
      await updateObraSocial(cod, { nombre: editNombreObraSocial.trim() });
      setEditObraSocialId(null);
      setModalAlerta({
        show: true,
        titulo: '¡Actualizado!',
        mensaje: 'Obra social actualizada correctamente.',
        tipo: 'success',
      });
      cargarDatos();
    } catch (err: any) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: err.message || 'Error al actualizar la obra social',
        tipo: 'error',
      });
    }
  };

  const handleEliminarObraSocial = async (cod: number) => {
    setModalAlerta({
      show: true,
      titulo: 'Confirmar eliminación',
      mensaje: '¿Estás seguro de eliminar esta obra social?',
      tipo: 'confirm',
      onConfirm: async () => {
        try {
          await deleteObraSocial(cod);
          cargarDatos();
        } catch (err: any) {
          setModalAlerta({
            show: true,
            titulo: 'Error',
            mensaje: err.message || 'Error al eliminar la obra social',
            tipo: 'error',
          });
        }
      },
    });
  };

  // HANDLERS DE ESPECIALIDADES
  const handleEliminarEspecialidad = async (cod: number) => {
    setModalAlerta({
      show: true,
      titulo: 'Confirmar eliminación',
      mensaje:
        '¿Estás seguro de eliminar esta especialidad? Los especialistas asociados pasarán a "no asignado".',
      tipo: 'confirm',
      onConfirm: async () => {
        try {
          await deleteEspecialidad(cod);
          cargarDatos();
        } catch (err: any) {
          setModalAlerta({
            show: true,
            titulo: 'Error',
            mensaje: err.message || 'Error al eliminar la especialidad',
            tipo: 'error',
          });
        }
      },
    });
  };

  // VALIDACIÓN DETALLADA DE CAMPOS DE ESPECIALISTA
  const validarCamposEspecialista = (data: {
    dni: string;
    nombre: string;
    matricula: string;
    email: string;
    telefono: string;
    contrasena?: string;
    consulta_particular: number | '';
    cod_especialidad: number | '';
    esEdicion?: boolean;
  }) => {
    if (!data.dni.trim()) return 'El campo DNI es obligatorio.';
    if (!/^\d+$/.test(data.dni.trim())) return 'El DNI debe contener únicamente números.';
    if (data.dni.trim().length > 8) return 'El DNI no puede tener más de 8 dígitos.';
    if (!data.nombre.trim()) return 'El campo Nombre Completo es obligatorio.';
    if (!data.matricula.trim()) return 'El campo Matrícula es obligatorio.';
    if (!data.telefono.trim()) return 'El campo Teléfono es obligatorio.';
    if (!/^\d+$/.test(data.telefono.trim())) return 'El teléfono debe contener únicamente números.';
    if (data.telefono.trim().length < 8 || data.telefono.trim().length > 15) {
      return 'El teléfono debe tener entre 8 y 15 dígitos.';
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return 'El campo Email no tiene un formato válido (ej: medico@consultorio.com).';
    }
    if (!data.esEdicion && (!data.contrasena || data.contrasena.trim().length < 4)) {
      return 'El campo Contraseña es obligatorio y debe tener al menos 4 caracteres.';
    }
    if (data.contrasena && data.contrasena.trim() && data.contrasena.trim().length < 4) {
      return 'La nueva contraseña debe tener al menos 4 caracteres.';
    }
    if (
      data.consulta_particular === '' ||
      isNaN(Number(data.consulta_particular)) ||
      Number(data.consulta_particular) < 0
    ) {
      return 'El Precio de consulta particular ingresado no es válido.';
    }
    return null;
  };

  // HANDLERS DE ESPECIALISTAS
  const handleCrearEspecialista = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errorValidacion = validarCamposEspecialista({
      dni: dniEspecialista,
      nombre: nombreEspecialista,
      matricula: matriculaEspecialista,
      email: emailEspecialista,
      telefono: telefonoEspecialista,
      contrasena: contrasenaEspecialista,
      consulta_particular: consultaParticularEspecialista,
      cod_especialidad: codEspecialidadSel,
    });

    if (errorValidacion) {
      setModalAlerta({
        show: true,
        titulo: 'Dato incorrecto o faltante',
        mensaje: errorValidacion,
        tipo: 'error',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createEspecialista({
        dni: dniEspecialista.trim(),
        nombre: nombreEspecialista.trim(),
        matricula: matriculaEspecialista.trim(),
        telefono: telefonoEspecialista.trim(),
        email: emailEspecialista.trim() || undefined,
        contrasena: contrasenaEspecialista.trim(),
        cod_especialidad: codEspecialidadSel !== '' ? Number(codEspecialidadSel) : undefined,
        estado: estadoEspecialista,
        consulta_particular: Number(consultaParticularEspecialista),
        obras_sociales: obrasSocialesSel,
      });

      setDniEspecialista('');
      setNombreEspecialista('');
      setMatriculaEspecialista('');
      setTelefonoEspecialista('');
      setEmailEspecialista('');
      setContrasenaEspecialista('');
      setEstadoEspecialista(true);
      setConsultaParticularEspecialista(0);
      setCodEspecialidadSel('');
      setObrasSocialesSel([]);

      setModalAlerta({
        show: true,
        titulo: '¡Éxito!',
        mensaje: 'Especialista registrado correctamente.',
        tipo: 'success',
      });
      cargarDatos();
    } catch (err: any) {
      setModalAlerta({
        show: true,
        titulo: 'Error al crear',
        mensaje: err.message || 'Error al crear especialista',
        tipo: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditarEspecialista = (esp: any) => {
    setEditEspecialistaId(esp.cod_especialista!);
    setEditDniEspecialista(esp.dni || '');
    setEditNombreEspecialista(esp.nombre);
    setEditMatriculaEspecialista(esp.matricula);
    setEditTelefonoEspecialista(esp.telefono || '');
    setEditEmailEspecialista(esp.email || '');
    setEditContrasenaEspecialista('');
    setEditEstadoEspecialista(esp.estado ?? true);
    setEditConsultaParticularEspecialista(esp.consulta_particular ?? 0);

    const codEsp =
      esp.cod_especialidad ||
      esp.codEspecialidad ||
      esp.especialidad?.cod_especialidad ||
      '';
    setEditCodEspecialidadSel(codEsp);

    const idsOS = esp.obrasSociales ? esp.obrasSociales.map((os: any) => os.cod_os) : [];
    setEditObrasSocialesSel(idsOS);
  };

  const handleGuardarEditarEspecialista = async (cod: number) => {
    const errorValidacion = validarCamposEspecialista({
      dni: editDniEspecialista,
      nombre: editNombreEspecialista,
      matricula: editMatriculaEspecialista,
      email: editEmailEspecialista,
      telefono: editTelefonoEspecialista,
      contrasena: editContrasenaEspecialista,
      consulta_particular: editConsultaParticularEspecialista,
      cod_especialidad: editCodEspecialidadSel,
      esEdicion: true,
    });

    if (errorValidacion) {
      setModalAlerta({
        show: true,
        titulo: 'Dato incorrecto o faltante',
        mensaje: errorValidacion,
        tipo: 'error',
      });
      return;
    }

    try {
      const dataUpdate: any = {
        dni: editDniEspecialista.trim(),
        nombre: editNombreEspecialista.trim(),
        matricula: editMatriculaEspecialista.trim(),
        telefono: editTelefonoEspecialista.trim(),
        email: editEmailEspecialista.trim() || undefined,
        cod_especialidad: editCodEspecialidadSel !== '' ? Number(editCodEspecialidadSel) : null,
        estado: editEstadoEspecialista,
        consulta_particular: Number(editConsultaParticularEspecialista),
        obras_sociales: editObrasSocialesSel,
      };

      if (editContrasenaEspecialista.trim()) {
        dataUpdate.contrasena = editContrasenaEspecialista.trim();
      }

      await updateEspecialista(cod, dataUpdate);
      setEditEspecialistaId(null);
      setEditContrasenaEspecialista('');
      setModalAlerta({
        show: true,
        titulo: '¡Actualizado!',
        mensaje: 'Especialista actualizado correctamente.',
        tipo: 'success',
      });
      cargarDatos();
    } catch (err: any) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: err.message || 'Error al actualizar especialista',
        tipo: 'error',
      });
    }
  };

  const handleEliminarEspecialista = async (cod: number) => {
    setModalAlerta({
      show: true,
      titulo: 'Confirmar eliminación',
      mensaje: '¿Estás seguro de eliminar este especialista?',
      tipo: 'confirm',
      onConfirm: async () => {
        try {
          await deleteEspecialista(cod);
          cargarDatos();
        } catch (err: any) {
          setModalAlerta({
            show: true,
            titulo: 'Error',
            mensaje: err.message || 'Error al eliminar especialista',
            tipo: 'error',
          });
        }
      },
    });
  };

  // HANDLERS DE PACIENTES
  const handleCrearPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombrePaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo Nombre Completo es obligatorio.', tipo: 'error' });
      return;
    }
    if (!dniPaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo DNI es obligatorio.', tipo: 'error' });
      return;
    }
    if (!/^\d+$/.test(dniPaciente.trim())) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El DNI debe contener únicamente números.', tipo: 'error' });
      return;
    }
    if (dniPaciente.trim().length > 8) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El DNI no puede tener más de 8 dígitos.', tipo: 'error' });
      return;
    }
    if (!telefonoPaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo Teléfono es obligatorio.', tipo: 'error' });
      return;
    }
    if (!/^\d+$/.test(telefonoPaciente.trim())) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El teléfono debe contener únicamente números.', tipo: 'error' });
      return;
    }
    if (telefonoPaciente.trim().length < 8 || telefonoPaciente.trim().length > 15) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El teléfono debe tener entre 8 y 15 dígitos.', tipo: 'error' });
      return;
    }
    if (!direccionPaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo Dirección es obligatorio.', tipo: 'error' });
      return;
    }
    if (!emailPaciente.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPaciente.trim())) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El campo Email no es válido.', tipo: 'error' });
      return;
    }
    if (contrasenaPaciente.trim() && contrasenaPaciente.trim().length < 4) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'La contraseña debe tener al menos 4 caracteres.', tipo: 'error' });
      return;
    }

    try {
      await createPaciente({
        nombre: nombrePaciente.trim(),
        dni: dniPaciente.trim(),
        email: emailPaciente.trim(),
        telefono: telefonoPaciente.trim(),
        direccion: direccionPaciente.trim(),
        contrasena: contrasenaPaciente.trim() || undefined,
        cod_os: osPacienteSel ? Number(osPacienteSel) : null,
      });

      setNombrePaciente('');
      setDniPaciente('');
      setEmailPaciente('');
      setTelefonoPaciente('');
      setDireccionPaciente('');
      setContrasenaPaciente('');
      setOsPacienteSel('');
      cargarDatos();
    } catch (err: any) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: err.message || 'Error al registrar paciente',
        tipo: 'error',
      });
    }
  };

  const handleStartEditarPaciente = (p: any) => {
    const id = p.nro_afiliado || p.id;
    setEditPacienteId(id);
    setEditNombrePaciente(p.nombre || p.nombreCompleto || '');
    setEditDniPaciente(p.dni || '');
    setEditEmailPaciente(p.email || '');
    setEditTelefonoPaciente(p.telefono || '');
    setEditDireccionPaciente(p.direccion || '');
    setEditContrasenaPaciente('');
    setEditOsPacienteSel(p.obraSocial?.cod_os || p.cod_os || '');
  };

  const handleGuardarEditarPaciente = async (id: number) => {
    if (!editNombrePaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo Nombre Completo es obligatorio.', tipo: 'error' });
      return;
    }
    if (!editDniPaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo DNI es obligatorio.', tipo: 'error' });
      return;
    }
    if (!/^\d+$/.test(editDniPaciente.trim())) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El DNI debe contener únicamente números.', tipo: 'error' });
      return;
    }
    if (editDniPaciente.trim().length > 8) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El DNI no puede tener más de 8 dígitos.', tipo: 'error' });
      return;
    }
    if (!editTelefonoPaciente.trim()) {
      setModalAlerta({ show: true, titulo: 'Dato faltante', mensaje: 'El campo Teléfono es obligatorio.', tipo: 'error' });
      return;
    }
    if (!/^\d+$/.test(editTelefonoPaciente.trim())) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El teléfono debe contener únicamente números.', tipo: 'error' });
      return;
    }
    if (editTelefonoPaciente.trim().length < 8 || editTelefonoPaciente.trim().length > 15) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El teléfono debe tener entre 8 y 15 dígitos.', tipo: 'error' });
      return;
    }
    if (!editEmailPaciente.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmailPaciente.trim())) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'El campo Email no es válido.', tipo: 'error' });
      return;
    }
    if (editContrasenaPaciente.trim() && editContrasenaPaciente.trim().length < 4) {
      setModalAlerta({ show: true, titulo: 'Dato inválido', mensaje: 'La contraseña debe tener al menos 4 caracteres.', tipo: 'error' });
      return;
    }

    try {
      const dataUpdate: any = {
        nombre: editNombrePaciente.trim(),
        dni: editDniPaciente.trim(),
        email: editEmailPaciente.trim(),
        telefono: editTelefonoPaciente.trim(),
        direccion: editDireccionPaciente.trim(),
        cod_os: editOsPacienteSel ? Number(editOsPacienteSel) : null,
      };

      if (editContrasenaPaciente.trim()) {
        dataUpdate.contrasena = editContrasenaPaciente.trim();
      }

      await updatePaciente(id, dataUpdate);
      setEditPacienteId(null);
      setEditContrasenaPaciente('');
      setEditOsPacienteSel('');
      cargarDatos();
    } catch (err: any) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: err.message || 'Error al actualizar paciente',
        tipo: 'error',
      });
    }
  };

  const handleEliminarPaciente = async (id: number) => {
    setModalAlerta({
      show: true,
      titulo: 'Confirmar eliminación',
      mensaje: '¿Estás seguro de eliminar a este paciente?',
      tipo: 'confirm',
      onConfirm: async () => {
        try {
          await deletePaciente(id);
          cargarDatos();
        } catch (err: any) {
          setModalAlerta({
            show: true,
            titulo: 'Error',
            mensaje: err.message || 'Error al eliminar paciente',
            tipo: 'error',
          });
        }
      },
    });
  };

  // HANDLERS DE TURNOS
  const handleAsignarTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!espEspecialidadSel) {
      setModalAlerta({ show: true, titulo: 'Campo incompleto', mensaje: 'Debe seleccionar el campo Especialidad.', tipo: 'error' });
      return;
    }
    if (!espTurnoSel) {
      setModalAlerta({ show: true, titulo: 'Campo incompleto', mensaje: 'Debe seleccionar el campo Médico Especialista.', tipo: 'error' });
      return;
    }
    if (!pacTurnoSel) {
      setModalAlerta({ show: true, titulo: 'Campo incompleto', mensaje: 'Debe seleccionar el campo Paciente.', tipo: 'error' });
      return;
    }
    if (!fechaTurno) {
      setModalAlerta({ show: true, titulo: 'Campo incompleto', mensaje: 'Debe seleccionar el campo Fecha del Turno.', tipo: 'error' });
      return;
    }
    if (!horaTurno) {
      setModalAlerta({ show: true, titulo: 'Campo incompleto', mensaje: 'Debe seleccionar el campo Horario Disponible.', tipo: 'error' });
      return;
    }
    if (esHorarioPasado(fechaTurno, horaTurno)) {
      setHoraTurno('');
      setModalAlerta({
        show: true,
        titulo: 'Horario no disponible',
        mensaje: 'El horario seleccionado ya pasó. Por favor, seleccione otro horario.',
        tipo: 'error',
      });
      return;
    }

    const especialistaSeleccionado = especialistas.find(
      (especialista) => especialista.cod_especialista === Number(espTurnoSel)
    );
    const especialidadSeleccionada = especialidades.find(
      (especialidad) => Number(especialidad.cod_especialidad) === Number(espEspecialidadSel)
    );
    const pacienteSeleccionado = pacientes.find(
      (paciente) => Number(paciente.nro_afiliado ?? paciente.id) === Number(pacTurnoSel)
    );

    if (especialidadSeleccionada?.estado === false || especialistaSeleccionado?.estado === false) {
      setHoraTurno('');
      setModalAlerta({
        show: true,
        titulo: 'Turno no disponible',
        mensaje: 'No se pueden asignar turnos con especialistas o especialidades inactivas.',
        tipo: 'error',
      });
      return;
    }

    if (!especialistaSeleccionado || !pacienteSeleccionado) {
      setModalAlerta({
        show: true,
        titulo: 'Error',
        mensaje: 'No se pudieron verificar los datos del especialista y del paciente.',
        tipo: 'error',
      });
      return;
    }

    const codOsPaciente = pacienteSeleccionado.obraSocial?.cod_os ?? pacienteSeleccionado.cod_os ?? null;
    const aceptaObraSocial = Boolean(
      codOsPaciente &&
      especialistaSeleccionado.obrasSociales?.some((obraSocial) => obraSocial.cod_os === codOsPaciente)
    );

    const crearTurnoReq = async (aceptaParticular = false) => {
      try {
        await createTurno({
          fecha: fechaTurno,
          hora_inicio: horaTurno,
          cod_especialista: Number(espTurnoSel),
          nro_afiliado: Number(pacTurnoSel),
          ...(aceptaParticular ? { acepta_particular: true } : {}),
        });

        setFechaTurno('');
        setHoraTurno('');
        setEspEspecialidadSel('');
        setEspTurnoSel('');
        setPacTurnoSel('');

        setModalAlerta({ show: true, titulo: '¡Éxito!', mensaje: 'Turno asignado correctamente.', tipo: 'success' });
        cargarDatos();
      } catch (err: any) {
        setModalAlerta({
          show: true,
          titulo: 'Error',
          mensaje: err.message || 'Error al asignar el turno',
          tipo: 'error',
        });
      }
    };

    if (!aceptaObraSocial) {
      setModalAlerta({
        show: true,
        titulo: 'Consulta particular',
        mensaje: `La obra social del paciente no es aceptada por el especialista. La consulta deberá abonarse de forma particular por $${Number(especialistaSeleccionado.consulta_particular ?? 0).toFixed(2)}. ¿Desea continuar?`,
        tipo: 'confirm',
        onConfirm: () => {
          void crearTurnoReq(true);
        },
      });
      return;
    }

    await crearTurnoReq();
  };

  const handleCancelarTurno = async (cod_turno: number) => {
    setModalAlerta({
      show: true,
      titulo: 'Confirmar cancelación',
      mensaje: '¿Estás seguro de cancelar este turno? El horario quedará libre nuevamente.',
      tipo: 'confirm',
      onConfirm: async () => {
        try {
          await cancelarTurno(cod_turno);
          cargarDatos();
        } catch (err: any) {
          setModalAlerta({
            show: true,
            titulo: 'Error',
            mensaje: err.message || 'Error al cancelar el turno',
            tipo: 'error',
          });
        }
      },
    });
  };

  return (
    <PublicLayout activo="/administrativo" administrativo>
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
                  tabActiva === 'pacientes' ? 'btn-primary' : 'btn-light text-muted'
                }`}
                onClick={() => setTabActiva('pacientes')}
              >
                <i className="bi bi-people me-1"></i>Pacientes
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
              <button
                type="button"
                className={`btn rounded-pill px-3 m-1 ${
                  tabActiva === 'obras-sociales' ? 'btn-primary' : 'btn-light text-muted'
                }`}
                onClick={() => setTabActiva('obras-sociales')}
              >
                <i className="bi bi-shield-check me-1"></i>Obras Sociales
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
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const duracionMinutos = Number(duracionEspecialidad);

                          if (!nombreEspecialidad.trim()) {
                            setModalAlerta({
                              show: true,
                              titulo: 'Campo incompleto',
                              mensaje: 'El campo "Nombre de la Especialidad" es obligatorio.',
                              tipo: 'error',
                            });
                            return;
                          }
                          if (isNaN(duracionMinutos) || duracionMinutos <= 0) {
                            setModalAlerta({
                              show: true,
                              titulo: 'Duración inválida',
                              mensaje: 'Ingresá una duración válida en minutos.',
                              tipo: 'error',
                            });
                            return;
                          }
                          if (duracionMinutos % 5 !== 0) {
                            setModalAlerta({
                              show: true,
                              titulo: 'Duración no permitida',
                              mensaje: 'La duración en minutos debe ser un múltiplo de 5 (ej: 15, 30, 45).',
                              tipo: 'error',
                            });
                            return;
                          }

                          try {
                            await createEspecialidad({
                              nombre: nombreEspecialidad.trim(),
                              duracion_minutos: duracionMinutos,
                              estado: estadoEspecialidad,
                            });
                            setNombreEspecialidad('');
                            setDuracionEspecialidad('30');
                            setEstadoEspecialidad(true);
                            cargarDatos();
                          } catch (err: any) {
                            setModalAlerta({
                              show: true,
                              titulo: 'Error',
                              mensaje: err.message || 'Error al crear especialidad',
                              tipo: 'error',
                            });
                          }
                        }}
                      >
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
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="duracionEspecialidad" className="form-label small fw-bold text-muted">
                            Minutos por turno
                          </label>
                          <input
                            type="number"
                            id="duracionEspecialidad"
                            className="form-control"
                            step="5"
                            min="5"
                            placeholder="Ej: 30"
                            value={duracionEspecialidad}
                            onChange={(e) => setDuracionEspecialidad(e.target.value)}
                          />
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="estadoEspecialidad"
                            checked={estadoEspecialidad}
                            onChange={(e) => setEstadoEspecialidad(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="estadoEspecialidad">
                            Especialidad activa
                          </label>
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
                              <th>Especialidad</th>
                              <th style={{ width: 160 }}>Minutos por turno</th>
                              <th className="text-end" style={{ width: 180 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {especialidades.map((esp) => (
                              <tr key={esp.cod_especialidad}>
                                <td>
                                  {editEspecialidadId === esp.cod_especialidad ? (
                                    <>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm mb-1"
                                        value={editNombreEspecialidad}
                                        onChange={(e) => setEditNombreEspecialidad(e.target.value)}
                                      />
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`estado-especialidad-${esp.cod_especialidad}`}
                                          checked={editEstadoEspecialidad}
                                          onChange={(e) => setEditEstadoEspecialidad(e.target.checked)}
                                        />
                                        <label
                                          className="form-check-label small"
                                          htmlFor={`estado-especialidad-${esp.cod_especialidad}`}
                                        >
                                          Activa
                                        </label>
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      <span className="fw-semibold">{esp.nombre}</span>
                                      <span
                                        className={`badge ms-2 ${
                                          esp.estado === false ? 'text-bg-secondary' : 'text-bg-success'
                                        }`}
                                      >
                                        {esp.estado === false ? 'Inactiva' : 'Activa'}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td style={editEspecialidadId === esp.cod_especialidad ? { verticalAlign: 'top' } : undefined}>
                                  {editEspecialidadId === esp.cod_especialidad ? (
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      min="5"
                                      step="5"
                                      aria-label={`Minutos por turno para ${editNombreEspecialidad}`}
                                      value={editDuracionEspecialidad}
                                      onChange={(e) => setEditDuracionEspecialidad(e.target.value)}
                                      required
                                    />
                                  ) : (
                                    <span>{esp.duracion_minutos ?? '-'} min</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  {editEspecialidadId === esp.cod_especialidad ? (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={async () => {
                                          if (!editNombreEspecialidad.trim()) {
                                            setModalAlerta({
                                              show: true,
                                              titulo: 'Error',
                                              mensaje: 'El nombre no puede estar vacío.',
                                              tipo: 'error',
                                            });
                                            return;
                                          }
                                          const duracionMinutos = Number(editDuracionEspecialidad);
                                          if (!Number.isFinite(duracionMinutos) || duracionMinutos <= 0) {
                                            setModalAlerta({
                                              show: true,
                                              titulo: 'Duración inválida',
                                              mensaje: 'Ingresá una duración válida en minutos.',
                                              tipo: 'error',
                                            });
                                            return;
                                          }
                                          if (duracionMinutos % 5 !== 0) {
                                            setModalAlerta({
                                              show: true,
                                              titulo: 'Duración no permitida',
                                              mensaje: 'La duración en minutos debe ser un múltiplo de 5 (ej: 15, 30, 45).',
                                              tipo: 'error',
                                            });
                                            return;
                                          }

                                          try {
                                            await updateEspecialidad(esp.cod_especialidad!, {
                                              nombre: editNombreEspecialidad.trim(),
                                              duracion_minutos: duracionMinutos,
                                              estado: editEstadoEspecialidad,
                                            });
                                            setEditEspecialidadId(null);
                                            cargarDatos();
                                          } catch (err: any) {
                                            setModalAlerta({
                                              show: true,
                                              titulo: 'Error',
                                              mensaje: err.message || 'Error al actualizar especialidad',
                                              tipo: 'error',
                                            });
                                          }
                                        }}
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
                                        onClick={() => {
                                          setEditEspecialidadId(esp.cod_especialidad!);
                                          setEditNombreEspecialidad(esp.nombre);
                                          setEditDuracionEspecialidad(String(esp.duracion_minutos ?? ''));
                                          setEditEstadoEspecialidad(esp.estado ?? true);
                                        }}
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
                          <label className="form-label small fw-bold text-muted">DNI</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 30123456"
                            value={dniEspecialista}
                            onChange={(e) => setDniEspecialista(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Dr. Esteban Quito"
                            value={nombreEspecialista}
                            onChange={(e) => setNombreEspecialista(e.target.value)}
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
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Teléfono</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 3415550101"
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
                            placeholder="************"
                            value={contrasenaEspecialista}
                            onChange={(e) => setContrasenaEspecialista(e.target.value)}
                          />
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="estadoEspecialista"
                            checked={estadoEspecialista}
                            onChange={(e) => setEstadoEspecialista(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="estadoEspecialista">
                            Especialista activo
                          </label>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label small fw-bold text-muted"
                            htmlFor="consultaParticularEspecialista"
                          >
                            Precio de consulta particular
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            id="consultaParticularEspecialista"
                            min="0"
                            step="0.01"
                            placeholder="Ej: 15000.00"
                            value={consultaParticularEspecialista}
                            onChange={(e) =>
                              setConsultaParticularEspecialista(
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
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
                            <option value="">Sin asignar / No asignado</option>
                            {especialidades.map((esp) => (
                              <option key={esp.cod_especialidad} value={esp.cod_especialidad}>
                                {esp.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* OBRAS SOCIALES AL CREAR */}
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted d-block">
                            Obras Sociales Aceptadas (Opcional)
                          </label>
                          <div
                            className="border rounded p-2 bg-light"
                            style={{ maxHeight: '130px', overflowY: 'auto' }}
                          >
                            {obrasSociales.length === 0 ? (
                              <span className="text-muted small">No hay obras sociales disponibles.</span>
                            ) : (
                              obrasSociales.map((os) => (
                                <div key={os.cod_os} className="form-check form-check-inline me-3 mb-1">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`os-crear-${os.cod_os}`}
                                    checked={obrasSocialesSel.includes(os.cod_os)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setObrasSocialesSel([...obrasSocialesSel, os.cod_os]);
                                      } else {
                                        setObrasSocialesSel(
                                          obrasSocialesSel.filter((id) => id !== os.cod_os)
                                        );
                                      }
                                    }}
                                  />
                                  <label className="form-check-label small" htmlFor={`os-crear-${os.cod_os}`}>
                                    {os.nombre}
                                  </label>
                                </div>
                              ))
                            )}
                          </div>
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
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h5 fw-bold mb-0">Especialistas Registrados</h2>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          aria-label="Buscar especialista por DNI"
                          title="Buscar por DNI"
                          onClick={() => {
                            setMostrarBusquedaEspecialista((visible) => !visible);
                            if (mostrarBusquedaEspecialista) setBusquedaDniEspecialista('');
                          }}
                        >
                          <i className="bi bi-search" />
                        </button>
                      </div>

                      {mostrarBusquedaEspecialista && (
                        <div className="input-group input-group-sm mb-3">
                          <span className="input-group-text">
                            <i className="bi bi-person-vcard" />
                          </span>
                          <input
                            type="search"
                            className="form-control"
                            placeholder="Buscar especialista por DNI"
                            value={busquedaDniEspecialista}
                            onChange={(e) => setBusquedaDniEspecialista(e.target.value)}
                            autoFocus
                          />
                        </div>
                      )}

                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre</th>
                              <th>DNI/Matrícula / Tel. / Email</th>
                              <th>Especialidad</th>
                              <th className="text-end" style={{ width: 120 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {especialistasFiltradosPorDni.map((esp: any) => {
                              const encontrada = especialidades.find(
                                (e) =>
                                  Number(e.cod_especialidad) ===
                                  Number(
                                    esp.cod_especialidad ||
                                      esp.codEspecialidad ||
                                      esp.especialidad?.cod_especialidad
                                  )
                              );
                              const espNombre = encontrada?.nombre || esp.especialidad?.nombre || 'No asignado';

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
                                          value={editDniEspecialista}
                                          placeholder="DNI"
                                          onChange={(e) => setEditDniEspecialista(e.target.value)}
                                        />
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
                                        <div className="form-check mt-2">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`estado-especialista-${esp.cod_especialista}`}
                                            checked={editEstadoEspecialista}
                                            onChange={(e) => setEditEstadoEspecialista(e.target.checked)}
                                          />
                                          <label
                                            className="form-check-label small"
                                            htmlFor={`estado-especialista-${esp.cod_especialista}`}
                                          >
                                            Activo
                                          </label>
                                        </div>
                                        <div className="mt-2">
                                          <input
                                            className="form-control form-control-sm"
                                            type="number"
                                            id={`particular-especialista-${esp.cod_especialista}`}
                                            min="0"
                                            step="0.01"
                                            value={editConsultaParticularEspecialista}
                                            onChange={(e) =>
                                              setEditConsultaParticularEspecialista(
                                                e.target.value === '' ? '' : Number(e.target.value)
                                              )
                                            }
                                          />
                                          <label
                                            className="form-label small text-muted"
                                            htmlFor={`particular-especialista-${esp.cod_especialista}`}
                                          >
                                            Precio consulta particular
                                          </label>
                                        </div>
                                        {/* OBRAS SOCIALES AL EDITAR */}
                                        <div className="mt-2">
                                          <label className="form-label small fw-bold text-muted d-block">
                                            Obras Sociales
                                          </label>
                                          <div
                                            className="border rounded p-1 bg-white"
                                            style={{ maxHeight: '100px', overflowY: 'auto' }}
                                          >
                                            {obrasSociales.map((os) => (
                                              <div key={os.cod_os} className="form-check form-check-inline me-2 mb-1">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  id={`os-edit-${esp.cod_especialista}-${os.cod_os}`}
                                                  checked={editObrasSocialesSel.includes(os.cod_os)}
                                                  onChange={(e) => {
                                                    if (e.target.checked) {
                                                      setEditObrasSocialesSel([...editObrasSocialesSel, os.cod_os]);
                                                    } else {
                                                      setEditObrasSocialesSel(
                                                        editObrasSocialesSel.filter((id) => id !== os.cod_os)
                                                      );
                                                    }
                                                  }}
                                                />
                                                <label
                                                  className="form-check-label small"
                                                  htmlFor={`os-edit-${esp.cod_especialista}-${os.cod_os}`}
                                                >
                                                  {os.nombre}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div>
                                        <span className="badge bg-light text-dark border me-1">
                                          DNI: {esp.dni}
                                        </span>
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
                                        <small className="text-muted d-block">
                                          {esp.estado === false ? 'Inactivo' : 'Activo'}.{' '}
                                          {Number(esp.consulta_particular ?? 0) > 0
                                            ? `Particular: $${Number(esp.consulta_particular).toFixed(2)}`
                                            : 'Sin consulta particular'}
                                        </small>
                                        <small className="text-muted d-block mt-1">
                                          <i className="bi bi-card-heading me-1"></i>
                                          {esp.obrasSociales && esp.obrasSociales.length > 0 ? (
                                            esp.obrasSociales.map((os: any) => (
                                              <span
                                                key={os.cod_os}
                                                className="badge bg-secondary-subtle text-secondary border me-1 mb-1"
                                              >
                                                {os.nombre}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="fst-italic">Sin OS adheridas</span>
                                          )}
                                        </small>
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
                                        <option value="">No asignado</option>
                                        {especialidades.map((e) => (
                                          <option key={e.cod_especialidad} value={e.cod_especialidad}>
                                            {e.nombre}
                                          </option>
                                        ))}
                                      </select>
                                    ) : espNombre !== 'No asignado' ? (
                                      <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
                                        {espNombre}
                                      </span>
                                    ) : (
                                      <span className="badge rounded-pill bg-light text-muted border">
                                        No asignado
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
                            {especialistasFiltradosPorDni.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                  {especialistas.length === 0
                                    ? 'No hay especialistas registrados.'
                                    : 'No se encontraron especialistas con ese DNI.'}
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

              {/* TAB 3: PACIENTES */}
              {tabActiva === 'pacientes' && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-person-plus-fill text-primary me-2"></i>Registrar Paciente
                      </h2>
                      <form onSubmit={handleCrearPaciente}>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Juan Pérez"
                            value={nombrePaciente}
                            onChange={(e) => setNombrePaciente(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">DNI</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 38123456"
                            value={dniPaciente}
                            onChange={(e) => setDniPaciente(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Teléfono</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 341456789"
                            value={telefonoPaciente}
                            onChange={(e) => setTelefonoPaciente(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Dirección</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Calle 123"
                            value={direccionPaciente}
                            onChange={(e) => setDireccionPaciente(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="juan@ejemplo.com"
                            value={emailPaciente}
                            onChange={(e) => setEmailPaciente(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">Contraseña (Opcional)</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={contrasenaPaciente}
                            onChange={(e) => setContrasenaPaciente(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">Obra Social</label>
                          <select
                            className="form-select"
                            value={osPacienteSel}
                            onChange={(e) =>
                              setOsPacienteSel(e.target.value ? Number(e.target.value) : '')
                            }
                          >
                            <option value="">Sin Obra Social (Particular)</option>
                            {obrasSociales.map((os) => (
                              <option key={os.cod_os} value={os.cod_os}>
                                {os.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-lg me-1"></i>Guardar Paciente
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h5 fw-bold mb-0">Pacientes Registrados</h2>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          aria-label="Buscar paciente por DNI"
                          title="Buscar por DNI"
                          onClick={() => {
                            setMostrarBusquedaPaciente((visible) => !visible);
                            if (mostrarBusquedaPaciente) setBusquedaDniPaciente('');
                          }}
                        >
                          <i className="bi bi-search" />
                        </button>
                      </div>

                      {mostrarBusquedaPaciente && (
                        <div className="input-group input-group-sm mb-3">
                          <span className="input-group-text">
                            <i className="bi bi-person-vcard" />
                          </span>
                          <input
                            type="search"
                            className="form-control"
                            placeholder="Buscar paciente por DNI"
                            value={busquedaDniPaciente}
                            onChange={(e) => setBusquedaDniPaciente(e.target.value)}
                            autoFocus
                          />
                        </div>
                      )}

                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre Completo</th>
                              <th>DNI/Obra Social</th>
                              <th>Contacto / Dirección</th>
                              <th className="text-end" style={{ width: 120 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pacientesFiltradosPorDni.map((p: any) => {
                              const id = p.nro_afiliado || p.id;
                              const osNombre =
                                p.obraSocial?.nombre ||
                                obrasSociales.find((os) => os.cod_os === p.cod_os)?.nombre;

                              return (
                                <tr key={id}>
                                  <td>
                                    {editPacienteId === id ? (
                                      <input
                                        type="text"
                                        className="form-control form-control-sm mb-1"
                                        value={editNombrePaciente}
                                        onChange={(e) => setEditNombrePaciente(e.target.value)}
                                        placeholder="Nombre"
                                      />
                                    ) : (
                                      <span className="fw-semibold">{p.nombre || p.nombreCompleto}</span>
                                    )}
                                  </td>
                                  <td>
                                    {editPacienteId === id ? (
                                      <>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          value={editDniPaciente}
                                          onChange={(e) => setEditDniPaciente(e.target.value)}
                                          placeholder="DNI"
                                        />
                                        <select
                                          className="form-select form-select-sm mt-1"
                                          value={editOsPacienteSel}
                                          onChange={(e) =>
                                            setEditOsPacienteSel(e.target.value ? Number(e.target.value) : '')
                                          }
                                        >
                                          <option value="">Sin Obra Social</option>
                                          {obrasSociales.map((os) => (
                                            <option key={os.cod_os} value={os.cod_os}>
                                              {os.nombre}
                                            </option>
                                          ))}
                                        </select>
                                      </>
                                    ) : (
                                      <div>
                                        <span className="badge bg-light text-dark border">
                                          DNI: {p.dni}
                                        </span>
                                        <small className="text-muted d-block mt-1">
                                          {osNombre ? `OS: ${osNombre}` : 'Particular / Sin OS'}
                                        </small>
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    {editPacienteId === id ? (
                                      <>
                                        <input
                                          type="email"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Email"
                                          value={editEmailPaciente}
                                          onChange={(e) => setEditEmailPaciente(e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Teléfono"
                                          value={editTelefonoPaciente}
                                          onChange={(e) => setEditTelefonoPaciente(e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mb-1"
                                          placeholder="Dirección"
                                          value={editDireccionPaciente}
                                          onChange={(e) => setEditDireccionPaciente(e.target.value)}
                                        />
                                        <input
                                          type="password"
                                          className="form-control form-control-sm"
                                          placeholder="Nueva clave (opcional)"
                                          value={editContrasenaPaciente}
                                          onChange={(e) => setEditContrasenaPaciente(e.target.value)}
                                        />
                                      </>
                                    ) : (
                                      <div>
                                        <small className="text-muted d-block">{p.email}</small>
                                        {p.telefono && (
                                          <small className="text-muted d-block">
                                            <i className="bi bi-telephone me-1"></i>
                                            {p.telefono}
                                          </small>
                                        )}
                                        {p.direccion && (
                                          <small className="text-muted d-block">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {p.direccion}
                                          </small>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    {editPacienteId === id ? (
                                      <div className="btn-group btn-group-sm">
                                        <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={() => handleGuardarEditarPaciente(id)}
                                        >
                                          <i className="bi bi-check-lg"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-secondary"
                                          onClick={() => setEditPacienteId(null)}
                                        >
                                          <i className="bi bi-x-lg"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="btn-group btn-group-sm">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary"
                                          onClick={() => handleStartEditarPaciente(p)}
                                        >
                                          <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-danger"
                                          onClick={() => handleEliminarPaciente(id)}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {pacientesFiltradosPorDni.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                  {pacientes.length === 0
                                    ? 'No hay pacientes registrados.'
                                    : 'No se encontraron pacientes con ese DNI.'}
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
                  <div className="col-lg-5">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-calendar-plus text-primary me-2"></i>Otorgar Turno
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
                          >
                            <option value="">Seleccione una especialidad</option>
                            {especialidades.filter((esp) => esp.estado !== false).map((esp) => (
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
                          <label className="form-label small fw-bold text-muted">3. Paciente</label>
                          <select
                            className="form-select"
                            value={pacTurnoSel}
                            onChange={(e) =>
                              setPacTurnoSel(e.target.value ? Number(e.target.value) : '')
                            }
                          >
                            <option value="">Seleccione un paciente</option>
                            {pacientes.map((p: any) => {
                              const pacienteId = p.nro_afiliado || p.id;
                              return (
                                <option key={pacienteId} value={pacienteId}>
                                  {p.nombre || p.nombreCompleto} (DNI: {p.dni})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* 4. Fecha del Turno */}
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted">4. Fecha del Turno</label>
                          <input
                            type="date"
                            className="form-control"
                            value={fechaTurno}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              const fechaVal = e.target.value;
                              if (fechaVal) {
                                const [yyyy, mm, dd] = fechaVal.split('-').map(Number);
                                const diaSemana = new Date(yyyy, mm - 1, dd).getDay();
                                if (diaSemana === 0 || diaSemana === 6) {
                                  setModalAlerta({
                                    show: true,
                                    titulo: 'Día no hábil',
                                    mensaje:
                                      'Los fines de semana (sábados y domingos) no se atienden turnos. Por favor seleccione un día hábil.',
                                    tipo: 'error',
                                  });
                                  setFechaTurno('');
                                  setHoraTurno('');
                                  return;
                                }
                                setFechaTurno(fechaVal);
                                setHoraTurno('');
                              }
                            }}
                            disabled={!espTurnoSel}
                          />
                        </div>

                        {/* 5. Grilla Horaria */}
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
                            <div
                              className="d-flex flex-wrap gap-1 p-2 bg-light rounded border"
                              style={{ maxHeight: '160px', overflowY: 'auto' }}
                            >
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
                            {turnosActivos.map((t: any) => {
                              const espObj = especialistas.find(
                                (e) =>
                                  Number(e.cod_especialista) ===
                                  Number(t.cod_especialista || t.especialista?.cod_especialista)
                              );
                              const nroPacBuscado =
                                t.nro_afiliado || t.paciente?.nro_afiliado || t.paciente?.id;
                              const pacObj = pacientes.find(
                                (p: any) => Number(nroPacBuscado) === Number(p.nro_afiliado || p.id)
                              );
                              const nombreEspecialista =
                                espObj?.nombre || t.especialista?.nombre || 'Profesional';
                              const nombrePaciente =
                                pacObj?.nombre ||
                                pacObj?.nombreCompleto ||
                                t.paciente?.nombre ||
                                t.paciente?.nombreCompleto ||
                                'Paciente';
                              const dniPaciente = pacObj?.dni || t.paciente?.dni;
                              const turnoId = t.cod_turno || t.id;

                              return (
                                <tr key={turnoId}>
                                  <td>
                                    <div className="fw-semibold">{t.fecha}</div>
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      {t.hora_inicio || t.horaInicio}
                                    </small>
                                  </td>
                                  <td>
                                    <span className="fw-semibold">{nombreEspecialista}</span>
                                  </td>
                                  <td>
                                    <div>
                                      <span className="fw-semibold">{nombrePaciente}</span>
                                      {dniPaciente && (
                                        <small className="text-muted d-block">
                                          DNI: {dniPaciente}
                                        </small>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle">
                                      {t.estado || 'Confirmado'}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    {turnoId && t.estado !== 'CANCELADO' && (
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
                            {turnosActivos.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center text-muted py-4">
                                  No hay turnos activos registrados en el sistema.
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

              {/* TAB 5: OBRAS SOCIALES */}
              {tabActiva === 'obras-sociales' && (
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border p-4 shadow-sm h-100">
                      <h2 className="h5 fw-bold mb-3">
                        <i className="bi bi-plus-circle text-primary me-2"></i>Nueva Obra Social
                      </h2>
                      <form onSubmit={handleCrearObraSocial}>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted">
                            Nombre de la Obra Social
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: OSDE, Swiss Medical..."
                            value={nombreObraSocial}
                            onChange={(e) => setNombreObraSocial(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-check-lg me-1"></i>Guardar Obra Social
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border p-4 shadow-sm">
                      <h2 className="h5 fw-bold mb-3">Obras Sociales Registradas</h2>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre</th>
                              <th className="text-end" style={{ width: 140 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {obrasSociales.map((os) => (
                              <tr key={os.cod_os}>
                                <td>
                                  {editObraSocialId === os.cod_os ? (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editNombreObraSocial}
                                      onChange={(e) => setEditNombreObraSocial(e.target.value)}
                                    />
                                  ) : (
                                    <span className="fw-semibold">{os.nombre}</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  {editObraSocialId === os.cod_os ? (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => handleGuardarEditarObraSocial(os.cod_os)}
                                      >
                                        <i className="bi bi-check-lg"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setEditObraSocialId(null)}
                                      >
                                        <i className="bi bi-x-lg"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                          setEditObraSocialId(os.cod_os);
                                          setEditNombreObraSocial(os.nombre);
                                        }}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleEliminarObraSocial(os.cod_os)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {obrasSociales.length === 0 && (
                              <tr>
                                <td colSpan={2} className="text-center text-muted py-4">
                                  No hay obras sociales registradas.
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

      {/* MODAL / CARTEL INTEGRADO DE ALERTAS Y CONFIRMACIONES */}
      {modalAlerta.show && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div
                className={`modal-header border-0 pb-0 ${
                  modalAlerta.tipo === 'error'
                    ? 'text-danger'
                    : modalAlerta.tipo === 'success'
                    ? 'text-success'
                    : 'text-primary'
                }`}
              >
                <h5 className="modal-title fw-bold">
                  <i
                    className={`bi ${
                      modalAlerta.tipo === 'error'
                        ? 'bi-exclamation-triangle-fill'
                        : modalAlerta.tipo === 'success'
                        ? 'bi-check-circle-fill'
                        : 'bi-question-circle-fill'
                    } me-2`}
                  ></i>
                  {modalAlerta.titulo}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalAlerta({ ...modalAlerta, show: false })}
                ></button>
              </div>
              <div className="modal-body py-4 text-center">
                <p className="mb-0 text-secondary fs-6">{modalAlerta.mensaje}</p>
              </div>
              <div className="modal-footer border-0 pt-0 justify-content-center pb-4">
                {modalAlerta.tipo === 'confirm' ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setModalAlerta({ ...modalAlerta, show: false })}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger rounded-pill px-4"
                      onClick={() => {
                        if (modalAlerta.onConfirm) modalAlerta.onConfirm();
                        setModalAlerta({ ...modalAlerta, show: false });
                      }}
                    >
                      Aceptar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-5"
                    onClick={() => setModalAlerta({ ...modalAlerta, show: false })}
                  >
                    Entendido
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};