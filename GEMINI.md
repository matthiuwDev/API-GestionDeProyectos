# GEMINI.md

## Contexto General

Este proyecto es una plataforma de gestión de proyectos desarrollada con arquitectura cliente-servidor.

Stack principal:

Backend:

* Node.js
* Express
* PostgreSQL
* Sequelize ORM
* JWT Authentication

Frontend:

* Angular 20
* Standalone Components
* Signals
* RxJS

---

## Principios Arquitectónicos

### Backend

La organización debe seguir Screaming Architecture.

La estructura debe reflejar dominios de negocio antes que responsabilidades técnicas.

Correcto:

auth/
project/
task/
user/
user-story/

Evitar estructuras globales como:

controllers/
services/
routes/

a nivel raíz.

Cada dominio debe encapsular:

* rutas
* controladores
* servicios
* validaciones
* lógica de negocio

Los modelos Sequelize se mantienen centralizados en src/models.

Esta decisión es intencional y busca:

- facilitar asociaciones entre entidades
- simplificar el bootstrap de Sequelize
- mantener visibilidad global del modelo de datos

No mover modelos a carpetas de dominio salvo que exista una necesidad clara.

---

### Frontend

Seguir estrictamente:

Core/
Shared/
Features/

Core:

* Servicios singleton
* Interceptores
* Guards
* Configuración global

Shared:

* Componentes reutilizables
* Directivas
* Pipes
* Utilidades

Features:

* Funcionalidad de negocio

---

## Reglas de Angular

* Utilizar exclusivamente Standalone Components.
* No crear NgModules.
* Favorecer Signals cuando sea apropiado.
* Evitar lógica de negocio dentro de componentes.
* Mantener componentes enfocados en presentación.
* Utilizar tipado estricto.

---

## Reglas Backend

* Mantener controladores delgados.
* La lógica de negocio pertenece a servicios o casos de uso.
* No acceder directamente a modelos desde rutas.
* Validar entradas antes de llegar a la lógica de negocio.
* Mantener separación entre transporte HTTP y dominio.

---

## Estilo de Código

* Código limpio y legible.
* Nombres descriptivos.
* Evitar duplicación.
* Favorecer composición sobre herencia.
* Aplicar principios SOLID cuando agreguen valor real.

---

## Al Generar Código

Antes de crear nuevos archivos:

1. Analizar patrones existentes.
2. Mantener consistencia con el dominio.
3. Reutilizar servicios existentes cuando sea posible.
4. No introducir nuevas dependencias sin justificación.
5. Explicar brevemente cualquier decisión arquitectónica relevante.

---

## Al Refactorizar

* No cambiar comportamiento funcional.
* Priorizar mantenibilidad.
* Reducir complejidad ciclomática.
* Mantener compatibilidad con el resto del proyecto.
