# API de Gestión de Proyectos 🚀

¡Bienvenido al repositorio de la **API de Gestión de Proyectos**! Este backend proporciona toda la funcionalidad necesaria para gestionar proyectos, sprints, tareas, historias de usuario y miembros de equipo, bajo una arquitectura robusta y escalable.

> ⚠️ **Nota Importante:** Este proyecto se encuentra en desarrollo activo y su estructura, arquitectura o funcionalidades están sujetas a modificaciones sin previo aviso.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/)
- **Framework Web:** [Express.js](https://expressjs.com/) (v4)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Contenedores:** Docker & Docker Compose
- **Autenticación:** JSON Web Tokens (JWT) & bcryptjs
- **Seguridad:** Helmet, CORS, HPP

---

## 🏗️ Arquitectura del Sistema

Actualmente, el proyecto está estructurado como un **Monolito Modular** siguiendo el patrón de **Screaming Architecture**. El código está agrupado por **Dominios de Negocio**:

- 🔐 `auth/` - Autenticación y registro de usuarios.
- 📁 `project/` - Gestión de proyectos e invitaciones.
- 🏃 `sprint/` - Manejo de ciclos de trabajo (Sprints).
- 📋 `task/` - Gestión de tareas.
- 👤 `user/` - Administración de usuarios.
- 📖 `userStory/` - Historias de usuario para metodologías ágiles.

Esta organización facilita encontrar la lógica de negocio y prepara el terreno si en el futuro se decide migrar a una arquitectura de Microservicios.

### Características Destacadas
- **Manejo de Errores Global:** Sistema centralizado mediante clases tipificadas (`NotFoundError`, `BadRequestError`, etc.) que captura excepciones de la lógica de negocio y traduce automáticamente errores de Sequelize, asegurando respuestas JSON estandarizadas.
- **Middlewares de Seguridad:** Validación de tokens, protección de cabeceras HTTP y sanitización básica.
- **Transacciones de Base de Datos:** Operaciones complejas (como la creación de un proyecto y la asignación del rol de propietario) se ejecutan bajo transacciones ACID para evitar inconsistencias.

---

## 🚀 Instalación y Ejecución Local

Para garantizar que tu entorno de desarrollo funcione sin fricciones de configuración, la API ya está **completamente configurada con Docker**. 

### Prerrequisitos
- [Docker](https://www.docker.com/) y **Docker Compose** instalados en tu máquina.

### Configuración de Variables de Entorno
Antes de levantar los contenedores, debes configurar tus variables de entorno, incluyendo las credenciales iniciales de administrador:

```bash
cp .env.example .env
```

Asegúrate de llenar en tu `.env` las siguientes variables clave (necesarias para la base de datos y la sincronización inicial):
```env
PGHOST=db           # Nombre del servicio en docker-compose
PGUSER=postgres
PGPASSWORD=tu_password
PGDATABASE=gestion_proyectos

# Usuarios Administradores Iniciales
ADMIN_EMAILS=admin1@test.com,admin2@test.com
ADMIN_PASSWORD=PasswordSeguro123!
```

### Ejecución con Docker

Levanta la base de datos de PostgreSQL y la API en un solo paso ejecutando:

```bash
docker-compose up -d --build
```
*Tu servidor Express quedará escuchando automáticamente en el puerto mapeado en el `docker-compose.yml` (por defecto `3000`).*

---

## 🗄️ Sincronización de Datos y Carga Inicial

En este proyecto, no necesitas ejecutar complejas migraciones manuales en el entorno de desarrollo. 

### 1. Sincronización Dinámica (`database.js`)
El archivo principal de configuración del ORM, [`src/database/database.js`](file:///c:/Proyectos/MATEO/API-GestionDeProyectos/src/database/database.js), está diseñado para leer dinámicamente tu carpeta de modelos e importarlos, generando y relacionando todas las tablas en tiempo de ejecución. 

### 2. Endpoint de Sincronización y "Semillas" (`db.js`)
Para facilitar la inyección de los datos iniciales, el helper [`src/helpers/db.js`](file:///c:/Proyectos/MATEO/API-GestionDeProyectos/src/helpers/db.js) expone un endpoint útil.

Puedes ejecutar la sincronización forzada e inyectar a los **administradores iniciales** definidos en tu archivo `.env` enviando una petición POST al endpoint con la bandera `CREATE_ADMINS`:

**Endpoint:**
```http
POST http://localhost:3000/db/sync?flag=CREATE_ADMINS
```

**Comportamiento:**
1. Sequelize sincronizará todas las tablas (`alter: true`).
2. El script leerá las variables `ADMIN_EMAILS` y `ADMIN_PASSWORD`.
3. Creará los perfiles con el rol `ADMIN` en la base de datos, ignorando automáticamente aquellos que ya existan.

---

## 📂 Estructura Principal del Código

```text
src/
 ├── auth/                  # Lógica de autenticación
 ├── config/                # Configuraciones globales
 ├── database/              # Conexión a PostgreSQL e inicialización de Sequelize
 ├── helpers/               # Utilidades, envío de emails y Clases de Error Global
 ├── middlewares/           # Manejador de errores global, validación de JWT, etc.
 ├── models/                # Modelos centralizados de Sequelize y asociaciones
 ├── project/               # Dominio de Proyectos
 ├── sprint/                # Dominio de Sprints
 ├── task/                  # Dominio de Tareas
 ├── templates/             # Plantillas para correos (EJS)
 ├── user/                  # Dominio de Usuarios
 ├── userStory/             # Dominio de Historias de Usuario
 ├── app.js                 # Configuración principal de Express
 └── index.js               # Punto de entrada de la aplicación
```
