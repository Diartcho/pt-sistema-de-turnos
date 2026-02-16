Sistema de Turnos – Prueba Técnica SuperGiros

Este proyecto corresponde a una prueba técnica desarrollada en Angular para la gestión de empleados y la asignación de turnos. La aplicación permite visualizar empleados obtenidos desde una API pública, asignarles turnos con validaciones específicas, administrar su estado (activo/inactivo) y llevar un control de los turnos asignados.

La solución fue construida utilizando Angular con componentes standalone, Angular Material para la interfaz gráfica y LocalStorage para la persistencia de datos de sesión y turnos.

Tecnologías utilizadas

Angular (Angular CLI v21.1.4)

TypeScript

Angular Material

Standalone Components

LocalStorage (persistencia)

API pública JSONPlaceholder (usuarios como empleados)

Instalación y ejecución

- Clonar el repositorio:

git clone https://github.com/Diartcho/pt-sistema-de-turnos.git


Entrar a la carpeta del proyecto:

cd pt-sistema-de-turnos


- Instalar dependencias:

npm install


- Ejecutar el servidor de desarrollo:

ng serve


Una vez iniciado, abrir el navegador en:

http://localhost:4200/

La aplicación se recarga automáticamente cuando se realizan cambios en el código.

Credenciales de acceso

Correo: admin@test.com

Contraseña: 123456

La autenticación es de demostración. El estado de sesión se guarda en LocalStorage.

Funcionalidades implementadas
Autenticación

Inicio de sesión con validación básica.

Protección de rutas mediante Auth Guard.

Persistencia de sesión en LocalStorage.

Gestión de empleados

Consumo de empleados desde API pública.

Visualización en tarjetas modernas.

Foto de perfil centrada y circular.

Indicador visual de estado:

Círculo verde → Activo

Círculo rojo → Inactivo

El administrador puede cambiar el estado usando un Slide Toggle.

Si el empleado está inactivo, el botón “Asignar turno” queda bloqueado.

Barra de búsqueda mejorada y filtros por ciudad y estado.

Ordenamiento A-Z.

Paginación con Angular Material.

Asignación de turnos

Vista independiente en una card centrada y acorde al diseño general.

Selección de fecha mediante Datepicker (calendario desplegable).

Hora de inicio y fin en una sola casilla cada una.

- Validaciones:

Todos los campos son obligatorios.

Minutos en intervalos de 15.

Selección de AM/PM.

La hora de fin debe ser mayor que la hora de inicio.

Campo adicional “Cargo” obligatorio.

Persistencia de turnos en LocalStorage.

Tabla en el dashboard mostrando los últimos turnos asignados.

Eliminación de turnos solicitando motivo obligatorio.

El motivo de eliminación se refleja en la tabla.

Persistencia de datos

Se almacenan en LocalStorage:

auth → estado de sesión

turns → lista de turnos asignados

Motivos de eliminación cuando aplica

Esto permite mantener los datos incluso al recargar la página.

- Estructura principal del proyecto

src/app/pages/login → Inicio de sesión
src/app/pages/dashboard → Gestión de empleados y tabla de turnos
src/app/pages/asignar-turno → Asignación de turnos
src/app/services → Servicios (auth, employees, turns)
src/app/guards → Protección de rutas
src/app/pipes → Pipe personalizado para formateo de teléfono

Comandos útiles

Servidor de desarrollo:

ng serve


Generar componente:

ng generate component nombre-componente


Build de producción:

ng build


Ejecutar pruebas unitarias:

ng test


Pruebas end-to-end:

ng e2e

- Notas finales

Los empleados provienen de una API pública, por lo que algunos datos son simulados a nivel de interfaz (por ejemplo, el estado activo/inactivo). La aplicación cumple con los requisitos solicitados, incluyendo manejo de errores básico, uso de guards, servicios reutilizables, pipe personalizado, diseño responsivo y almacenamiento local.

El objetivo fue desarrollar una solución funcional, clara y estructurada, priorizando buenas prácticas y una experiencia de usuario coherente.

Autor: Diartcho
Repositorio: https://github.com/Diartcho/pt-sistema-de-turnos