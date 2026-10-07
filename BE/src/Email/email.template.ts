
import { Turno } from '../Turno/turno.entity.js';

export const mailFormatTurno = (turno: Turno) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de turno</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
  font-family: Arial, Helvetica, sans-serif;
  color: #333333;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f4f6f8; padding: 30px 15px;"
  >
    <tr>
      <td align="center">

        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
          "
        >

          <!-- Encabezado -->
          <tr>
            <td
              align="center"
              style="
                background-color: #004e41;
                padding: 25px;
                color: #ffffff;
              "
            >
              <h1 style="
                margin: 0;
                font-size: 24px;
              ">
                Vitalis
              </h1>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 35px 30px;">

              <h2 style="
                margin: 0 0 20px 0;
                color: #004e41;
                font-size: 22px;
              ">
                Turno confirmado
              </h2>

              <p style="font-size: 16px; line-height: 1.5;">
                Estimado/a
                <strong>${turno.afiliado.nombreCompleto}</strong>:
              </p>

              <p style="
                font-size: 16px;
                line-height: 1.5;
              ">
                Le informamos que su turno ha sido confirmado
                correctamente.
              </p>

              <!-- Datos del turno -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin: 25px 0;
                  background-color: #f4f6f8;
                  border-radius: 8px;
                "
              >
                <tr>
                  <td style="padding: 20px;">

                    <p style="margin: 0 0 12px 0;">
                      <strong>Fecha:</strong>
                      ${turno.fecha}
                    </p>

                    <p style="margin: 0 0 12px 0;">
                      <strong>Hora:</strong>
                      ${turno.hora}
                    </p>

                    <p style="margin: 0;">
                      <strong>Especialista:</strong>
                      ${turno.especialista.nombre}
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Información importante -->
              <p style="
                margin: 25px 0 10px 0;
                font-size: 16px;
                color: #004e41;
              ">
                <strong>Importante</strong>
              </p>

              <p style="
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
              ">
                En caso de no poder asistir, le rogamos
                comunicarse con nosotros para cancelar o
                reprogramar su turno.
              </p>

              <p style="
                margin: 25px 0 0 0;
                font-size: 16px;
                line-height: 1.5;
              ">
                Gracias por elegirnos.
              </p>

            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td
              align="center"
              style="
                background-color: #f4f6f8;
                padding: 20px;
                color: #777777;
                font-size: 12px;
              "
            >
              <p style="margin: 0;">
                Vitalis turnos
              </p>

              <p style="margin: 5px 0 0 0;">
                Este correo fue enviado automáticamente.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
