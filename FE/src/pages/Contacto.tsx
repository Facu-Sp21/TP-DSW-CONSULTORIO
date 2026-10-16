import React, { useState } from 'react';
import { PublicLayout } from '../components/PublicLayout';

export const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: '',
    consentimiento: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
  };

  return (
    <PublicLayout activo="/contacto">
      {/* HEADER */}
      <section className="fondo-punteado py-5">
        <div className="container text-center mx-auto" style={{ maxWidth: '700px' }}>
          <span className="etiqueta-superior rounded-pill mb-4">Estamos para ayudarte</span>
          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}>
            Hablemos sobre tu <span className="texto-degradado">consulta o inquietud</span>
          </h1>
          <p className="text-muted fs-5">
            Ya sea para coordinar un turno, resolver una duda administrativa o dejarnos tu comentario,
            nuestro equipo te responde a la brevedad.
          </p>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="py-5 py-md-6">
        <div className="container">
          <div className="row g-5">

            {/* INFO DE CONTACTO */}
            <div className="col-lg-5">
              <h2 className="fw-bold h3 mb-3">Información de contacto</h2>
              <p className="text-muted mb-4">
                Elegí el medio que te resulte más cómodo. También podés acercarte a nuestra sede
                en el horario de atención al público.
              </p>

              <ul className="list-unstyled d-flex flex-column gap-4 mb-4">
                <li className="d-flex gap-3">
                  <span className="icono-contacto"><i className="bi bi-geo-alt-fill fs-5"></i></span>
                  <div>
                    <h6 className="fw-bold mb-1">Sede central</h6>
                    <p className="text-muted small mb-0">Av. Pellegrini 1234, Rosario, Santa Fe</p>
                  </div>
                </li>
                <li className="d-flex gap-3">
                  <span className="icono-contacto"><i className="bi bi-telephone-fill fs-5"></i></span>
                  <div>
                    <h6 className="fw-bold mb-1">Teléfono</h6>
                    <a href="tel:+543414567890" className="text-muted small">+54 341 456-7890</a>
                  </div>
                </li>
                <li className="d-flex gap-3">
                  <span className="icono-contacto"><i className="bi bi-envelope-fill fs-5"></i></span>
                  <div>
                    <h6 className="fw-bold mb-1">Correo electrónico</h6>
                    <a href="mailto:contacto@vitalis.com.ar" className="text-muted small">contacto@vitalis.com.ar</a>
                  </div>
                </li>
                <li className="d-flex gap-3">
                  <span className="icono-contacto"><i className="bi bi-clock-fill fs-5"></i></span>
                  <div>
                    <h6 className="fw-bold mb-1">Atención administrativa</h6>
                    <p className="text-muted small mb-0">Lunes a viernes de 08:00 a 20:00 hs · Sábados de 08:00 a 13:00 hs</p>
                  </div>
                </li>
              </ul>

              <div className="caja-emergencia d-flex align-items-center gap-3">
                <span className="punto-emergencia"></span>
                <div>
                  <strong className="d-block text-white small">¿Es una urgencia?</strong>
                  <span className="text-light small">Nuestra guardia médica está disponible las 24 horas, todos los días.</span>
                </div>
              </div>
            </div>

            {/* FORMULARIO */}
            <div className="col-lg-7">
              <div className="card border-0 bg-light-subtle p-4 p-md-5">
                <div className="card-body p-0">
                  <h2 className="fw-bold h4 mb-1">Envianos tu mensaje</h2>
                  <p className="text-muted mb-4">Completá el formulario y te contactaremos dentro de las próximas 24 hs hábiles.</p>

                  <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label fw-semibold">Nombre y apellido <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="nombre" placeholder="Ej: María Fernández" value={formData.nombre} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="dni" className="form-label fw-semibold">DNI</label>
                      <input type="text" className="form-control" id="dni" placeholder="Ej: 30123456" value={formData.dni} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-semibold">Correo electrónico <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" id="email" placeholder="tu@correo.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="telefono" className="form-label fw-semibold">Teléfono de contacto <span className="text-danger">*</span></label>
                      <input type="tel" className="form-control" id="telefono" placeholder="Ej: 341 555-1234" value={formData.telefono} onChange={handleChange} required />
                    </div>

                    <div className="col-12">
                      <label htmlFor="motivo" className="form-label fw-semibold">Motivo de la consulta <span className="text-danger">*</span></label>
                      <select id="motivo" className="form-select" value={formData.motivo} onChange={handleChange} required>
                        <option value="" disabled>Seleccioná una opción</option>
                        <option value="turno">Coordinar o modificar un turno</option>
                        <option value="administrativo">Consulta administrativa</option>
                        <option value="historial">Acceso al historial médico</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="mensaje" className="form-label fw-semibold">Mensaje <span className="text-danger">*</span></label>
                      <textarea id="mensaje" className="form-control" rows={4} placeholder="Contanos en detalle en qué podemos ayudarte..." value={formData.mensaje} onChange={handleChange} required></textarea>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="consentimiento" checked={formData.consentimiento} onChange={handleChange} required />
                        <label className="form-check-label small text-muted" htmlFor="consentimiento">
                          Acepto que mis datos sean utilizados para dar respuesta a esta consulta, de acuerdo a la Política de Privacidad.
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100 py-2">
                        <i className="bi bi-send-fill me-2"></i>Enviar mensaje
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
};