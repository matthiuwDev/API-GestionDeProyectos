# API de Gestión de Proyectos 🚀

¡Bienvenido al repositorio de la **API de Gestión de Proyectos**! Este backend proporciona toda la funcionalidad necesaria para gestionar proyectos, sprints, tareas, historias de usuario y miembros de equipo, bajo una arquitectura robusta y escalable.

> ⚠️ **Nota Importante:** Este proyecto se encuentra en desarrollo activo y su estructura, arquitectura o funcionalidades están sujetas a modificaciones sin previo aviso.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/)
- **Framework Web:** [Express.js](https://expressjs.com/) (v4)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Autenticación:** JSON Web Tokens (JWT) & bcryptjs
- **Seguridad:** Helmet, CORS, HPP

---

## 🏗️ Arquitectura del Sistema

Actualmente, el proyecto está estructurado como un **Monolito Modular** siguiendo el patrón de **Screaming Architecture**. En lugar de organizar el código por capas técnicas genéricas (controladores, servicios), el código está agrupado por **Dominios de Negocio**:

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

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL corriendo localmente o en un contenedor Docker.

### Pasos

1. **Clonar el repositorio y acceder a la carpeta:**
   ```bash
   git clone <url-del-repositorio>
   cd API-GestionDeProyectos
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Copia el archivo de ejemplo y configura tus credenciales locales:
   ```bash
   cp .env.example .env
   ```
   *Asegúrate de llenar los datos de conexión a la base de datos PostgreSQL (`PGUSER`, `PGPASSWORD`, `PGDATABASE`, etc.) y tu `SECRET_JWT_KEY`.*

4. **Ejecutar el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor arrancará (por defecto en el puerto 3000) usando `nodemon` y sincronizará los modelos de Sequelize con la base de datos automáticamente (verificar `src/database/database.js`).

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
