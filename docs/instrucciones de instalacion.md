# Instalación y ejecución local — Consultorio Vitalis

## 1. Requisitos previos

Instalar:

- Git.
- Node.js 24.
- pnpm 10.6.5.
- Docker Desktop, con soporte para Docker Compose.

Mantener Docker Desktop abierto durante la ejecución de la base de datos.

## 2. Descargar el proyecto

```bash
git clone https://github.com/Facu-Sp21/TP-DSW-CONSULTORIO.git
cd TP-DSW-CONSULTORIO
```

Los siguientes pasos parten de esta carpeta.

## 3. Iniciar la base de datos

Ejecutar desde la raíz del repositorio:

```bash
docker compose up -d
```

Este comando descarga la imagen de MySQL 8.0 y crea una base de datos con la configuración local definida en `docker-compose.yml`:

| Configuración | Valor             |
| ------------- | ----------------- |
| Host          | localhost         |
| Puerto        | 3307              |
| Base de datos | tp-consultorio-db |
| Usuario       | dsw               |
| Contraseña    | dsw               |

Estas credenciales son exclusivamente para desarrollo local.

Comprobar el estado:

```bash
docker compose ps
```

La primera inicialización puede tardar. Para comprobar cuándo MySQL está disponible:

```bash
docker compose logs -f dsw-consultorio-db
```

Esperar el mensaje `ready for connections`. Presionar `Ctrl + C` para salir de los logs; la base seguirá funcionando.

Los datos se conservan en un volumen de Docker.

## 4. Configurar el backend

Crear un archivo llamado `.env.desarrollo` dentro de `BE`:

```env
DATABASE_URL=mysql://dsw:dsw@localhost:3307/tp-consultorio-db
PORT=3000
FRONTEND_URL=http://localhost:5173

JWT_SECRET=reemplazar-por-una-clave-local-larga-y-aleatoria
JWT_EXPIRES_IN=2h

EMAIL_HOST=completar-host-smtp
EMAIL_PORT=587
EMAIL_USER=completar-usuario-smtp
EMAIL_PASSWORD=completar-clave-smtp
```

Las variables `EMAIL_*` deben corresponder a un servicio SMTP.
La configuración actual utiliza `secure: false`; usar un servicio
y puerto compatibles con esa configuración, habitualmente 587 con STARTTLS.

El envío de correos forma parte de la creación de turnos y de los recordatorios:
para probar esos flujos completos es necesario configurar el correo.

## 5. Instalar e iniciar el backend

En una terminal:

```bash
cd BE
pnpm install
pnpm start:dev
```

Mantener la terminal abierta.

El backend se ejecuta en:

http://localhost:3000

Al iniciar, la aplicación sincroniza las tablas con las entidades mediante
MikroORM. No es necesario crearlas manualmente.

Esta sincronización corresponde al procedimiento local actual.
Utilizar una base destinada al proyecto, sin datos de producción.

Documentación de la API:

http://localhost:3000/docs

Especificación OpenAPI:

http://localhost:3000/openapi.json

## 6. Instalar e iniciar el frontend

Abrir otra terminal desde la raíz del repositorio:

```bash
cd FE
pnpm install
pnpm dev
```

Mantener la terminal abierta y entrar a:

http://localhost:5173

El frontend está configurado para consultar el backend en
`http://localhost:3000`, mediante `FE/services/api.ts`.

Mantener esos puertos para la instalación local. Si el frontend se inicia
en otro puerto, actualizar también `FRONTEND_URL` para que los enlaces
de correo apunten a la dirección correcta.

## 7. Preparar los datos iniciales

Una base nueva no contiene pacientes, profesionales ni especialidades.

Los pacientes pueden registrarse desde la aplicación. Para gestionar
los datos iniciales es necesario crear primero un administrativo.

### Crear el primer administrativo

Con el backend compilado por `pnpm start:dev`, abrir otra terminal dentro
de `BE` y ejecutar:

```bash
pnpm exec node
```

Introducir las siguientes instrucciones en la consola de Node:

```js
await import('./dist/src/shared/env.js');
const { orm } = await import('./dist/src/shared/db/orm.js');
const { Administrativo } =
  await import('./dist/src/Administrativo/administrativo.entity.js');
const { hashPassword } = await import('./dist/src/shared/auth/password.js');

const em = orm.em.fork();

const administrativo = em.create(Administrativo, {
  nombreCompleto: 'Administrativo de prueba',
  legajo: 'ADM001',
  email: 'admin@ejemplo.com',
  password: await hashPassword('ClaveDemo123!'),
});

await em.persistAndFlush(administrativo);
await orm.close();
```

Salir de la consola:

```text
.exit
```

Este paso se realiza una sola vez en una base nueva. El correo y el legajo
no deben estar registrados previamente.

Iniciar sesión con:

- Correo: `admin@ejemplo.com`
- Contraseña: `ClaveDemo123!`

Esta cuenta es únicamente para pruebas locales.

Desde el panel administrativo:

1. Crear las obras sociales.
2. Crear las especialidades.
3. Crear los especialistas y configurar sus datos de atención.
4. Registrar pacientes desde la página de registro o el panel administrativo.
5. Solicitar turnos con horarios disponibles.

## 8. Ejecutar los tests

### Backend

Desde `BE`:

```bash
pnpm test
```

### Frontend

Desde `FE`:

```bash
pnpm test
```

### Pruebas de extremo a extremo

Desde `FE`, instalar el navegador requerido la primera vez:

```bash
pnpm exec playwright install chromium
```

Luego ejecutar:

```bash
pnpm test:e2e
```

La configuración de Playwright inicia el frontend automáticamente.

## 9. Detener el proyecto

En las terminales del frontend y del backend, presionar `Ctrl + C`.

Para detener la base, desde la raíz:

```bash
docker compose stop
```

Para volver a iniciarla:

```bash
docker compose up -d
```

No ejecutar `docker compose down -v` si se quieren conservar los datos:
esa opción elimina el volumen de la base de datos.
