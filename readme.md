# Propuesta TP DSW

## Grupo
### Integrantes
* 48711 - Speranza, Facundo
* 50491 - Sampaulesi, Mateo
* 55366 - Cuadradas, Lucas
* 54826 - Cavestri, Elian


### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción

*Es un sistema de una clinica que tiene diversos especialistas de diferentes especialidades en el cual el paciente pueda gestionar su propio turno acorde a la agenda del especialista deseado, los especialistas trabajan cada uno con distintas obra sociales*

### Modelo
![imagen del modelo](der-consutorio.drawio.png)

## Alcance Funcional 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Afiliado<br>2. CRUD Obra_Social<br>3. CRUD Especialidad<br>4. CRUD Administrativo|
|CRUD dependiente|1. CRUD Turno {depende de} paciente y de especialista <br>2. CRUD historia_clinica {depende de} CRUD paciente|
|Listado<br>+<br>detalle| 1. Listado de especialistas filtrado por especialidad, muestra especialistas que tengan una determinada especialidad<br> 2. Listado de turnos posibles filtrado por especialista, muestra horarios posibles para atenderse con un determinado especialista|
|CUU/Epic|1. Reservar un turno con un especialista<br>2. El especialista realiza la consulta y genera un informe|

Adicionales para Aprobación

Req	Detalle
CRUD	1. CRUD Tipo Habitacion
2. CRUD Servicio
3. CRUD Localidad
4. CRUD Provincia
5. CRUD Habitación
6. CRUD Empleado
7. CRUD Cliente
CUU/Epic	1. Reservar una habitación para la estadía
2. Realizar el check-in de una reserva
3. Realizar el check-out y facturación de estadía y servicios
Alcance Adicional Voluntario
Nota: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

Req	Detalle
Listados	1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado
2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes
CUU/Epic	1. Consumir servicios
2. Cancelación de reserva
Otros	1. Envío de recordatorio de reserva por email
