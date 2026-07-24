# Plan de Implementación

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Tipo de documento:** Plan técnico de ejecución  
**Audiencia:** Codex, desarrolladores y revisores técnicos  
**Objetivo:** Convertir la documentación del proyecto en una secuencia ordenada de tareas pequeñas, verificables y seguras.

---

# 1. Propósito

Este documento define el orden recomendado para implementar **Quiniela Nacional La Goleada – Kickoff**.

No reemplaza:

- El PRD.
- Las reglas de negocio.
- La arquitectura.
- El modelo de datos.
- Las ADR.
- Las instrucciones para Codex.
- Las reglas de desarrollo.

Su función es transformar todos esos documentos en un plan de trabajo ejecutable.

Cada tarea deberá poder asignarse individualmente a Codex o a un desarrollador humano.

---

# 2. Principios de ejecución

## IMP-001 — Una tarea por vez

No solicitar a Codex:

```text
Construye toda la aplicación.
```
Solicitar:

Implementa únicamente la tarea TASK-012.
IMP-002 — Dependencias respetadas

No iniciar una tarea si sus dependencias no están terminadas.

IMP-003 — Entregables verificables

Cada tarea deberá producir:

Código.
Pruebas.
Validaciones.
Documentación cuando corresponda.
Resultado de lint.
Resultado de typecheck.
Resultado de build cuando aplique.
IMP-004 — Dominio antes de UI

Orden general:

Reglas
→ Servicios
→ Repositorios
→ API
→ UI
IMP-005 — Seguridad incluida

La seguridad no será una fase separada que se agregue al final.

Cada tarea deberá validar:

Entrada.
Sesión.
Rol.
Estado.
Exposición de datos.
Errores.
IMP-006 — No ampliar alcance

Cada tarea deberá limitarse al objetivo definido.

No agregar funciones futuras sin autorización.

3. Estados de tarea
BACKLOG
READY
IN_PROGRESS
IN_REVIEW
TESTING
DONE
BLOCKED
4. Prioridades
P0 — Bloqueante o crítico
P1 — Obligatorio para versión 1.0
P2 — Importante
P3 — Opcional o posterior
5. Definición de Done global

Una tarea se considera terminada cuando:

Cumple su objetivo.
Respeta las ADR.
Respeta las reglas de negocio.
Tiene pruebas adecuadas.
No introduce any injustificado.
No expone secretos.
No duplica lógica.
Pasa lint.
Pasa typecheck.
Pasa pruebas relacionadas.
Actualiza documentación cuando corresponde.
6. Fase 0 — Preparación del repositorio
TASK-001 — Crear repositorio y estructura inicial

Prioridad: P0
Dependencias: Ninguna

Objetivo

Crear la base del proyecto.

Entregables
Repositorio Git.
Rama principal.
.gitignore.
README.md.
Carpeta docs/.
Archivos de documentación existentes.
Criterios de aceptación
El repositorio abre correctamente.
No contiene secretos.
La documentación está versionada.
TASK-002 — Inicializar Next.js

Prioridad: P0
Dependencias: TASK-001

Objetivo

Crear aplicación con:

Next.js App Router.
React.
TypeScript.
Tailwind CSS.
ESLint.
Criterios de aceptación
npm run dev
npm run build
npm run lint

deben funcionar.

TASK-003 — Configurar TypeScript estricto

Prioridad: P0
Dependencias: TASK-002

Objetivo

Activar configuración estricta.

Entregables
strict: true.
Alias internos.
Sin errores TypeScript iniciales.
Criterios de aceptación
npm run typecheck

exitoso.

TASK-004 — Configurar formato y convenciones

Prioridad: P1
Dependencias: TASK-002

Objetivo

Configurar:

Prettier.
Orden de imports.
Scripts de formato.
Reglas ESLint adicionales.
Criterios de aceptación
npm run format:check
npm run lint

exitosos.

TASK-005 — Crear estructura modular

Prioridad: P0
Dependencias: TASK-003

Objetivo

Crear:

src/
├── app/
├── modules/
├── components/
├── lib/
├── services/
├── types/
├── utils/
└── styles/

y módulos iniciales:

auth
users
teams
seasons
rounds
matches
predictions
scoring
standings
audit
notifications
diagnostics
Criterios de aceptación
No existe lógica funcional todavía.
La estructura respeta ADR-016 y ADR-017.
7. Fase 1 — Configuración e infraestructura base
TASK-006 — Validación de variables de entorno

Prioridad: P0
Dependencias: TASK-003

Objetivo

Crear un módulo central que valide variables con Zod.

Variables mínimas
DATABASE_URL
DIRECT_DATABASE_URL
APP_URL
APP_TIMEZONE
SESSION_SECRET
INITIAL_SETUP_TOKEN
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_APP_PASSWORD
Criterios de aceptación
La aplicación falla al iniciar si falta una variable crítica.
No imprime secretos.
Existen pruebas.
TASK-007 — Configurar Prisma

Prioridad: P0
Dependencias: TASK-006

Objetivo

Instalar y configurar Prisma.

Entregables
prisma/schema.prisma.
Cliente Prisma reutilizable.
Scripts de generate y migrate.
Criterios de aceptación
npx prisma generate

exitoso.

TASK-008 — Configurar PostgreSQL de desarrollo

Prioridad: P0
Dependencias: TASK-007

Objetivo

Conectar la aplicación a PostgreSQL.

Criterios de aceptación
Consulta básica exitosa.
Sin conexión a producción.
DATABASE_URL fuera del repositorio.
TASK-009 — Crear infraestructura de testing

Prioridad: P0
Dependencias: TASK-003

Objetivo

Configurar:

Vitest.
Playwright.
Setup de unit tests.
Setup de integration tests.
Base de datos de testing.
Reloj controlado.
Criterios de aceptación
npm test
npm run test:integration
npm run test:e2e

ejecutan al menos una prueba inicial.

TASK-010 — Crear manejo estándar de errores

Prioridad: P1
Dependencias: TASK-003

Objetivo

Crear:

Error funcional base.
Códigos de error.
Mapeo a respuestas.
Request ID.
Criterios de aceptación
No se exponen stack traces al cliente.
Existe prueba de serialización de error.
8. Fase 2 — Modelo de datos
TASK-011 — Implementar modelos de usuario y autenticación

Prioridad: P0
Dependencias: TASK-007

Entidades
User.
Session.
EmailVerificationToken.
PasswordResetToken.
RoleHistory.
Criterios de aceptación
Correo único normalizado.
Nickname único normalizado.
Rol enum.
Estado enum.
Tokens almacenables como hash.
TASK-012 — Implementar modelos deportivos

Prioridad: P0
Dependencias: TASK-011

Entidades
Team.
Season.
SeasonParticipant.
Round.
Match.
MatchScheduleHistory.
Criterios de aceptación
Relaciones correctas.
UUID.
Soft delete donde corresponda.
Estados explícitos.
TASK-013 — Implementar modelos de pronóstico y puntuación

Prioridad: P0
Dependencias: TASK-012

Entidades
Prediction.
MatchResult.
PredictionScore.
Standing.
StandingSnapshot.
Criterios de aceptación
Un pronóstico por usuario y partido.
Versionado de resultado.
Índices necesarios.
Restricciones únicas.
TASK-014 — Implementar modelos administrativos

Prioridad: P1
Dependencias: TASK-012

Entidades
AuditLog.
Notification.
Sponsor.
ApplicationSetting.
OperationalLock.
DiagnosticRun.
ExportRun.
TASK-015 — Crear migración inicial

Prioridad: P0
Dependencias: TASK-011, TASK-012, TASK-013, TASK-014

Objetivo

Crear la primera migración completa.

Criterios de aceptación
Aplica en base vacía.
Prisma Client se genera.
No contiene datos sensibles.
Revisión manual del SQL.
TASK-016 — Crear seed base

Prioridad: P1
Dependencias: TASK-015

Objetivo

Crear:

Doce equipos.
Configuración inicial.
Reglas por defecto.
Textos públicos mínimos.
Restricciones

No crear:

Usuarios por defecto.
Contraseñas conocidas.
Superadministrador automático.
9. Fase 3 — Dominio puro
TASK-017 — Implementar cálculo de desenlace

Prioridad: P0
Dependencias: TASK-009

Funciones
getMatchOutcome()
Casos
Victoria local.
Victoria visitante.
Empate.
Pruebas

Cobertura completa.

TASK-018 — Implementar cálculo de puntuación

Prioridad: P0
Dependencias: TASK-017

Función
calculatePredictionScore()
Casos
Exacto.
Parcial.
Incorrecto.
Sin pronóstico.
Partido doble.
0-0.
Criterios de aceptación
Sin dependencia de Prisma.
Sin dependencia de React.
Pruebas exhaustivas.
TASK-019 — Implementar clasificación

Prioridad: P0
Dependencias: TASK-018

Funciones
Orden por puntos.
Desempate por exactos.
Posiciones compartidas.
Orden visual estable.
Casos obligatorios
1, 2, 2, 4
TASK-020 — Implementar tendencia

Prioridad: P1
Dependencias: TASK-019

Estados
UP
DOWN
SAME
NEW
TASK-021 — Implementar cálculo de cierre

Prioridad: P0
Dependencias: TASK-009

Funciones
Calcular predictionClosesAt.
Verificar si puede pronosticar.
Verificar si puede ver pronósticos ajenos.
Regla
now < predictionClosesAt
TASK-022 — Implementar máquina de estados de partido

Prioridad: P0
Dependencias: TASK-012

Estados
SCHEDULED
RESCHEDULED
CLOSED
SUSPENDED
RESUMED
FINISHED_PENDING
PROCESSED
CANCELLED
Criterios de aceptación
Transiciones válidas.
Transiciones inválidas rechazadas.
Pruebas unitarias.
TASK-023 — Implementar políticas de autorización

Prioridad: P0
Dependencias: TASK-011

Funciones
canApproveUser()
canManageMatch()
canProcessResult()
canPromoteAdmin()
canUseDiagnostics()
10. Fase 4 — Repositorios y servicios base
TASK-024 — Crear repositorio de usuarios

Prioridad: P0
Dependencias: TASK-011

Operaciones
Buscar por email.
Buscar por nickname.
Crear usuario.
Cambiar estado.
Cambiar rol.
Soft delete.
TASK-025 — Crear repositorios deportivos

Prioridad: P0
Dependencias: TASK-012

Repositorios
TeamRepository.
SeasonRepository.
RoundRepository.
MatchRepository.
TASK-026 — Crear repositorios de pronósticos y tabla

Prioridad: P0
Dependencias: TASK-013

Repositorios
PredictionRepository.
PredictionScoreRepository.
StandingRepository.
ResultRepository.
TASK-027 — Crear repositorio de auditoría

Prioridad: P0
Dependencias: TASK-014

Criterios
Solo inserción desde aplicación.
Sanitización.
Sin secretos.
TASK-028 — Crear contexto de solicitud

Prioridad: P1
Dependencias: TASK-010

Campos
requestId
userId
role
ipAddress
userAgent
11. Fase 5 — Autenticación
TASK-029 — Implementar hashing de contraseña

Prioridad: P0
Dependencias: TASK-024

Objetivo

Implementar servicio de password hashing.

Criterios
Argon2id preferido.
Sin logs de contraseña.
Pruebas.
TASK-030 — Implementar sesiones

Prioridad: P0
Dependencias: TASK-024, TASK-029

Funciones
Crear sesión.
Validar sesión.
Revocar sesión.
Revocar otras sesiones.
Expirar sesión.
Cookie
HttpOnly.
Secure en producción.
SameSite.
TASK-031 — Implementar registro

Prioridad: P0
Dependencias: TASK-024, TASK-029

Incluye
Schema Zod.
Normalización.
Validación de duplicados.
Hash de contraseña.
Estado pendiente de correo.
Token de confirmación.
Pruebas
Registro válido.
Correo duplicado.
Nickname duplicado.
Password inválida.
TASK-032 — Implementar confirmación de correo

Prioridad: P0
Dependencias: TASK-031

Incluye
Token seguro.
Token hash.
Expiración.
Un solo uso.
Cambio a pendiente de aprobación.
TASK-033 — Implementar reenvío de confirmación

Prioridad: P1
Dependencias: TASK-032

Incluye
Respuesta genérica.
Rate limiting.
Invalidación de token anterior.
TASK-034 — Implementar login

Prioridad: P0
Dependencias: TASK-030

Incluye
Comparación segura.
Estados especiales.
Sesión nueva.
Protección contra timing básico.
Rate limiting.
TASK-035 — Implementar logout

Prioridad: P0
Dependencias: TASK-030

TASK-036 — Implementar recuperación de contraseña

Prioridad: P1
Dependencias: TASK-029, TASK-030

Incluye
Solicitud genérica.
Token temporal.
Cambio de contraseña.
Revocación de sesiones.
Token de un uso.
TASK-037 — Implementar setup inicial

Prioridad: P0
Dependencias: TASK-031

Objetivo

Crear el primer superadministrador.

Restricciones
Token inicial.
Solo una vez.
Transaccional.
Protección contra concurrencia.
Cierre definitivo del setup.
12. Fase 6 — Email
TASK-038 — Crear interfaz de proveedor de correo

Prioridad: P1
Dependencias: TASK-006

Interfaz
EmailProvider
Métodos
Send verification.
Send password reset.
Send account approved.
Send test email.
TASK-039 — Implementar Gmail SMTP

Prioridad: P1
Dependencias: TASK-038

Criterios
Variables de entorno.
Sin credenciales en logs.
Errores sanitizados.
TASK-040 — Crear proveedor falso de correo

Prioridad: P0
Dependencias: TASK-038

Uso
Unit tests.
Integration tests.
E2E.
13. Fase 7 — UI de autenticación
TASK-041 — Crear layout público

Prioridad: P1
Dependencias: TASK-002

Incluye
Header.
Footer.
Navegación.
Branding.
Responsive.
TASK-042 — Crear pantalla de registro

Prioridad: P0
Dependencias: TASK-031, TASK-041

Incluye
Campos requeridos.
Errores.
Equipo favorito.
Confirmación visual.
TASK-043 — Crear pantalla de login

Prioridad: P0
Dependencias: TASK-034, TASK-041

TASK-044 — Crear pantallas de confirmación y aprobación pendiente

Prioridad: P1
Dependencias: TASK-032

TASK-045 — Crear recuperación de contraseña

Prioridad: P1
Dependencias: TASK-036

14. Fase 8 — Gestión de usuarios
TASK-046 — Implementar aprobación de usuarios

Prioridad: P0
Dependencias: TASK-024, TASK-027

Incluye
Admin.
Usuario confirmado.
Incorporación opcional a temporada.
Auditoría.
Transacción.
TASK-047 — Implementar rechazo, bloqueo y desactivación

Prioridad: P1
Dependencias: TASK-046

Acciones
Reject.
Block.
Unblock.
Disable.
Enable.
TASK-048 — Implementar promoción de administradores

Prioridad: P1
Dependencias: TASK-023, TASK-027

Restricción

Solo superadministrador.

TASK-049 — Crear UI administrativa de usuarios

Prioridad: P1
Dependencias: TASK-046, TASK-047, TASK-048

Incluye
Lista.
Filtros.
Búsqueda.
Detalle.
Confirmaciones.
15. Fase 9 — Equipos, temporadas y jornadas
TASK-050 — Crear módulo de equipos

Prioridad: P1
Dependencias: TASK-025, TASK-016

Incluye
Listado.
Activación.
Logo.
Uso en registro.
TASK-051 — Implementar creación de temporada

Prioridad: P0
Dependencias: TASK-025, TASK-027

Incluye
Estado borrador.
Reglas.
Auditoría.
Validación de una activa.
TASK-052 — Implementar activación de temporada

Prioridad: P0
Dependencias: TASK-051

Restricciones
Solo una activa.
Configuración válida.
Transacción.
TASK-053 — Implementar participantes de temporada

Prioridad: P0
Dependencias: TASK-052

Incluye
Agregar usuario.
Fecha de incorporación.
Cero puntos iniciales.
Sin retroactividad.
TASK-054 — Implementar jornadas

Prioridad: P0
Dependencias: TASK-051

Incluye
Crear.
Editar.
Publicar.
Archivar.
Nombre libre.
Secuencia no cronológica.
TASK-055 — Crear UI de temporadas y jornadas

Prioridad: P1
Dependencias: TASK-051, TASK-054

16. Fase 10 — Partidos
TASK-056 — Implementar creación de partido

Prioridad: P0
Dependencias: TASK-025, TASK-021, TASK-022

Incluye
Equipos.
Fecha.
Hora.
Cierre.
Jornada.
Doble.
Advertencia de duplicado.
TASK-057 — Implementar partido doble

Prioridad: P0
Dependencias: TASK-056

Restricciones
Uno por jornada publicada.
Conflicto si ya existe otro.
TASK-058 — Implementar reprogramación

Prioridad: P0
Dependencias: TASK-056

Incluye
Fecha anterior.
Fecha nueva.
Nuevo cierre.
Historial.
Reapertura opcional.
Pronósticos conservados.
Auditoría.
TASK-059 — Implementar suspensión y reanudación

Prioridad: P1
Dependencias: TASK-022, TASK-056

TASK-060 — Implementar cancelación

Prioridad: P1
Dependencias: TASK-022, TASK-056

Efecto
No puntúa.
Conserva historial.
Conserva pronósticos.
TASK-061 — Crear UI administrativa de partidos

Prioridad: P1
Dependencias: TASK-056, TASK-058, TASK-059, TASK-060

17. Fase 11 — Pronósticos
TASK-062 — Implementar servicio de guardado de pronóstico

Prioridad: P0
Dependencias: TASK-021, TASK-026, TASK-053

Validaciones
Usuario aprobado.
Participante activo.
Partido existente.
Partido abierto.
Marcador válido.
Hora del servidor.
Un pronóstico por partido.
TASK-063 — Implementar edición de pronóstico

Prioridad: P0
Dependencias: TASK-062

TASK-064 — Implementar política de visibilidad

Prioridad: P0
Dependencias: TASK-021, TASK-026

Regla

Antes del cierre:

Solo propio.

Después del cierre:

Todos.

Antes del procesamiento:

Sin puntos.
TASK-065 — Crear listado de pronósticos pendientes

Prioridad: P1
Dependencias: TASK-062

TASK-066 — Crear UI de pronósticos

Prioridad: P0
Dependencias: TASK-062, TASK-063, TASK-064

Incluye
Cards.
Inputs.
Guardado.
Estado.
Contador.
Doble.
Responsive.
TASK-067 — Implementar caché segura

Prioridad: P0
Dependencias: TASK-064

Restricciones
Pronósticos privados: no-store.
No compartir datos entre usuarios.
18. Fase 12 — Procesamiento y clasificación
TASK-068 — Implementar servicio de procesamiento

Prioridad: P0
Dependencias: TASK-018, TASK-019, TASK-026, TASK-027

Flujo
Validar
Bloquear
Guardar resultado
Evaluar pronósticos
Guardar puntuaciones
Actualizar standings
Crear snapshot
Auditar
Commit
TASK-069 — Implementar control de concurrencia

Prioridad: P0
Dependencias: TASK-068

Criterios
Dos admins no procesan el mismo partido.
Una ejecución exitosa.
Otra recibe conflicto.
TASK-070 — Implementar idempotencia

Prioridad: P0
Dependencias: TASK-068

TASK-071 — Crear UI de procesamiento

Prioridad: P0
Dependencias: TASK-068

Incluye
Marcador.
Confirmación.
Resumen.
Errores.
Request ID.
TASK-072 — Implementar clasificación pública

Prioridad: P0
Dependencias: TASK-019, TASK-068

Columnas
Posición.
Nickname.
Parciales.
Exactos.
Puntos.
Tendencia.
TASK-073 — Implementar resultados públicos

Prioridad: P1
Dependencias: TASK-068, TASK-064

19. Fase 13 — Corrección y recalculo
TASK-074 — Implementar corrección de resultado

Prioridad: P0
Dependencias: TASK-068, TASK-027

Restricciones
Superadmin.
Reautenticación.
Motivo.
Nueva versión.
Recalculo.
Auditoría.
TASK-075 — Implementar vista previa de recalculo

Prioridad: P1
Dependencias: TASK-018, TASK-019, TASK-026

Resultado
Antes.
Después.
Diferencias.
TASK-076 — Implementar recalculo completo

Prioridad: P0
Dependencias: TASK-075

Fuente de verdad
Participantes.
Pronósticos.
Resultados.
Reglas.
Multiplicador.
Criterios
Transaccional.
Reproducible.
Bloqueo concurrente.
TASK-077 — Crear UI de recalculo

Prioridad: P1
Dependencias: TASK-075, TASK-076

20. Fase 14 — Dashboard y notificaciones
TASK-078 — Crear dashboard del usuario

Prioridad: P1
Dependencias: TASK-065, TASK-072

Incluye
Posición.
Puntos.
Próximo cierre.
Pendientes.
Top.
Tendencia.
TASK-079 — Implementar notificaciones internas

Prioridad: P1
Dependencias: TASK-014

Eventos
Cuenta aprobada.
Reprogramación.
Suspensión.
Cancelación.
Resultado procesado.
TASK-080 — Crear centro de notificaciones

Prioridad: P2
Dependencias: TASK-079

21. Fase 15 — Patrocinadores y configuración
TASK-081 — Implementar patrocinadores

Prioridad: P2
Dependencias: TASK-014

Incluye
Crear.
Actualizar.
Desactivar.
Orden.
Enlace seguro.
Imagen.
TASK-082 — Implementar configuración pública

Prioridad: P1
Dependencias: TASK-014

Incluye
Nombre.
Logo.
Cómo funciona.
Redes.
Registro habilitado.
TASK-083 — Implementar modo mantenimiento

Prioridad: P1
Dependencias: TASK-082, TASK-023

22. Fase 16 — Auditoría
TASK-084 — Integrar auditoría en todas las acciones críticas

Prioridad: P0
Dependencias: TASK-027

Acciones mínimas
Aprobar.
Rechazar.
Bloquear.
Promover.
Crear temporada.
Crear jornada.
Crear partido.
Reprogramar.
Procesar.
Corregir.
Recalcular.
Mantenimiento.
TASK-085 — Crear visor de auditoría

Prioridad: P1
Dependencias: TASK-084

Incluye
Filtros.
Detalle.
Antes y después.
Request ID.
Sin secretos.
23. Fase 17 — Centro de diagnóstico
TASK-086 — Implementar estado general

Prioridad: P1
Dependencias: TASK-006, TASK-023

Incluye
Aplicación.
DB.
SMTP.
Versión.
Flags.
Sin secretos.
TASK-087 — Implementar verificador de integridad

Prioridad: P0
Dependencias: TASK-076

Verificaciones mínimas
Temporadas activas.
Superadmins.
Doble.
Pronósticos duplicados.
Puntos.
Standing.
Resultados.
Cancelados.
TASK-088 — Implementar historial de ejecuciones

Prioridad: P1
Dependencias: TASK-014

TASK-089 — Implementar visor de errores

Prioridad: P2
Dependencias: TASK-010

TASK-090 — Crear UI del centro de diagnóstico

Prioridad: P1
Dependencias: TASK-086, TASK-087, TASK-088

24. Fase 18 — Exportaciones y respaldo
TASK-091 — Implementar exportación JSON

Prioridad: P1
Dependencias: TASK-014

Criterios
Sin secretos.
Checksum.
Formato versionado.
Auditado.
TASK-092 — Implementar exportación CSV

Prioridad: P2
Dependencias: TASK-091

Seguridad
Protección contra CSV injection.
TASK-093 — Implementar descarga segura

Prioridad: P1
Dependencias: TASK-091

Criterios
Expiración.
Autorización.
Registro de descarga.
TASK-094 — Probar restauración funcional

Prioridad: P0
Dependencias: TASK-091

Criterios
Restaurar en entorno de testing.
Verificar conteos.
Ejecutar integridad.
Comparar standings.
25. Fase 19 — Herramientas avanzadas opcionales
TASK-095 — Implementar importación con preview

Prioridad: P3
Dependencias: TASK-091

TASK-096 — Implementar datos de prueba por batch

Prioridad: P2
Dependencias: TASK-009

TASK-097 — Implementar simulador

Prioridad: P3
Dependencias: TASK-096

TASK-098 — Implementar SQL Console de lectura

Prioridad: P3
Dependencias: TASK-023, TASK-084

Restricciones
Solo SELECT.
Timeout.
Límite de filas.
Superadmin.
Flag de entorno.
Auditoría.
TASK-099 — Evaluar SQL de escritura

Prioridad: P3
Dependencias: TASK-098

Estado esperado para 1.0
No implementado o deshabilitado.
26. Fase 20 — Seguridad y endurecimiento
TASK-100 — Configurar cabeceras de seguridad

Prioridad: P0
Dependencias: TASK-002

Incluye
CSP.
Nosniff.
Referrer Policy.
Frame Ancestors.
Permissions Policy.
HSTS en producción.
TASK-101 — Implementar protección CSRF y origen

Prioridad: P0
Dependencias: TASK-030

TASK-102 — Implementar rate limiting

Prioridad: P0
Dependencias: TASK-034

Aplicar a
Login.
Registro.
Confirmación.
Recuperación.
SMTP.
SQL.
Exportación.
TASK-103 — Revisar IDOR

Prioridad: P0
Dependencias: Módulos principales terminados

Verificar
Pronósticos.
Notificaciones.
Perfil.
Exportaciones.
Sesiones.
TASK-104 — Revisar XSS e inputs

Prioridad: P0
Dependencias: UI principal terminada

TASK-105 — Revisar logs y redacción

Prioridad: P0
Dependencias: TASK-010

TASK-106 — Auditoría de dependencias

Prioridad: P1
Dependencias: Aplicación estable

27. Fase 21 — Testing completo
TASK-107 — Completar pruebas unitarias

Prioridad: P0
Dependencias: Dominio completo

Objetivo

Cobertura alta de:

Puntuación.
Cierre.
Clasificación.
Tendencia.
Estados.
Permisos.
TASK-108 — Completar pruebas de integración

Prioridad: P0
Dependencias: Servicios completos

Objetivo

Cubrir:

Registro.
Aprobación.
Pronóstico.
Procesamiento.
Reprogramación.
Recalculo.
Auditoría.
TASK-109 — Completar pruebas API

Prioridad: P0
Dependencias: Route Handlers terminados

TASK-110 — Completar E2E

Prioridad: P0
Dependencias: UI funcional

Flujos
Registro.
Login.
Pronóstico.
Cierre.
Privacidad.
Procesamiento.
Tabla.
Reprogramación.
Corrección.
TASK-111 — Accesibilidad

Prioridad: P1
Dependencias: UI funcional

Verificar
Teclado.
Foco.
Labels.
Contraste.
Modales.
Lectores de pantalla.
TASK-112 — Responsive

Prioridad: P0
Dependencias: UI funcional

Resoluciones
320
375
390
768
1366
1920
28. Fase 22 — Rendimiento
TASK-113 — Revisar consultas N+1

Prioridad: P1
Dependencias: Servicios completos

TASK-114 — Probar procesamiento masivo

Prioridad: P1
Dependencias: TASK-068

Volúmenes
50 usuarios.
100 usuarios.
500 usuarios.
TASK-115 — Probar recalculo masivo

Prioridad: P1
Dependencias: TASK-076

TASK-116 — Probar límites de plan gratuito

Prioridad: P1
Dependencias: Infraestructura seleccionada

29. Fase 23 — CI/CD y deployment
TASK-117 — Crear pipeline CI

Prioridad: P0
Dependencias: TASK-009

Pasos
install
lint
typecheck
unit
integration
build
e2e-smoke
TASK-118 — Configurar entorno de preview

Prioridad: P2
Dependencias: TASK-117

Restricciones
Sin DB de producción.
Sin SMTP real.
Sin secretos de producción.
TASK-119 — Crear base de producción

Prioridad: P0
Dependencias: Aplicación estable

TASK-120 — Configurar hosting

Prioridad: P0
Dependencias: TASK-119

TASK-121 — Configurar Gmail SMTP de producción

Prioridad: P1
Dependencias: TASK-039

TASK-122 — Aplicar migraciones de producción

Prioridad: P0
Dependencias: TASK-119

TASK-123 — Ejecutar seed base

Prioridad: P0
Dependencias: TASK-122

TASK-124 — Crear superadministrador inicial

Prioridad: P0
Dependencias: TASK-037, TASK-123

TASK-125 — Cerrar setup

Prioridad: P0
Dependencias: TASK-124

TASK-126 — Ejecutar smoke tests

Prioridad: P0
Dependencias: TASK-120

30. Fase 24 — Piloto
TASK-127 — Crear temporada ficticia completa

Prioridad: P0
Dependencias: Aplicación desplegada en staging

Datos
50 usuarios.
10 jornadas.
5 partidos por jornada.
Un doble por jornada.
TASK-128 — Simular temporada completa

Prioridad: P0
Dependencias: TASK-127

Incluir
Reprogramación.
Suspensión.
Cancelación.
Corrección.
Usuario tardío.
Empates.
TASK-129 — Comparar recalculo

Prioridad: P0
Dependencias: TASK-128

Criterio
Diferencias = 0
TASK-130 — Probar backup y restore

Prioridad: P0
Dependencias: TASK-128

TASK-131 — Ejecutar piloto con usuarios reales

Prioridad: P0
Dependencias: TASK-129, TASK-130

TASK-132 — Corregir hallazgos del piloto

Prioridad: P0
Dependencias: TASK-131

31. Fase 25 — Producción
TASK-133 — Revisión final de seguridad

Prioridad: P0
Dependencias: TASK-132

TASK-134 — Revisión final de documentación

Prioridad: P1
Dependencias: TASK-132

TASK-135 — Crear backup inicial de producción

Prioridad: P0
Dependencias: TASK-124

TASK-136 — Crear temporada oficial

Prioridad: P0
Dependencias: TASK-133, TASK-135

TASK-137 — Publicar primera jornada

Prioridad: P0
Dependencias: TASK-136

TASK-138 — Monitorear primera jornada

Prioridad: P0
Dependencias: TASK-137

Verificar
Registro.
Login.
Guardado.
Cierre.
Privacidad.
Procesamiento.
Clasificación.
Logs.
SMTP.
32. Orden recomendado de ejecución
TASK-001 a TASK-016
↓
TASK-017 a TASK-023
↓
TASK-024 a TASK-040
↓
TASK-041 a TASK-049
↓
TASK-050 a TASK-061
↓
TASK-062 a TASK-077
↓
TASK-078 a TASK-094
↓
TASK-100 a TASK-116
↓
TASK-117 a TASK-126
↓
TASK-127 a TASK-138

Las tareas opcionales:

TASK-095 a TASK-099

no deberán bloquear la versión 1.0.

33. Prompts recomendados para Codex

Cada tarea deberá enviarse con un formato como:

Implementa TASK-018 del archivo docs/19-IMPLEMENTATION_PLAN.md.

Antes de modificar código, revisa:

- docs/04-ReglasNegocio.md
- docs/08-Testing.md
- docs/14-DecisionesArquitectonicas.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md

Objetivo:
Implementar calculatePredictionScore().

Restricciones:
- No usar Prisma.
- No usar React.
- Función pura.
- No duplicar reglas.
- Exacto = 3.
- Parcial = 1.
- Doble = x2.

Entregables:
- Código.
- Pruebas unitarias.
- Resumen de archivos modificados.

No implementes tareas adicionales.
34. Plantilla de tarea para Codex
TAREA:
[ID y nombre]

DOCUMENTOS OBLIGATORIOS:
[Listado]

OBJETIVO:
[Resultado esperado]

ALCANCE:
[Archivos o módulos]

FUERA DE ALCANCE:
[Qué no debe hacer]

CRITERIOS DE ACEPTACIÓN:
[Lista verificable]

PRUEBAS:
[Pruebas requeridas]

RESTRICCIONES:
[Arquitectura, seguridad, dominio]

COMANDOS FINALES:
npm run lint
npm run typecheck
npm test
npm run build
35. Reglas de ejecución para Codex

Codex deberá:

Leer la tarea completa.
Leer los documentos relacionados.
Inspeccionar el código existente.
Proponer un plan breve.
Modificar únicamente lo necesario.
Agregar pruebas.
Ejecutar validaciones.
Informar archivos modificados.
Informar comandos ejecutados.
Informar limitaciones o bloqueos.
36. Qué no debe hacer Codex

No debe:

Implementar varias fases a la vez.
Cambiar arquitectura.
Cambiar dependencias sin autorización.
Reescribir módulos no relacionados.
Eliminar pruebas.
Modificar reglas.
Crear código especulativo.
Ignorar errores de TypeScript.
Dejar funciones incompletas.
Exponer secretos.
Usar datos de producción.
37. Tareas bloqueantes para producción

Las siguientes tareas deben estar completadas:

TASK-006
TASK-015
TASK-018
TASK-019
TASK-021
TASK-023
TASK-029
TASK-030
TASK-031
TASK-032
TASK-034
TASK-037
TASK-046
TASK-051
TASK-052
TASK-054
TASK-056
TASK-057
TASK-058
TASK-062
TASK-064
TASK-068
TASK-069
TASK-070
TASK-072
TASK-074
TASK-076
TASK-084
TASK-087
TASK-094
TASK-100
TASK-101
TASK-102
TASK-103
TASK-105
TASK-107
TASK-108
TASK-110
TASK-112
TASK-117
TASK-122
TASK-124
TASK-125
TASK-126
TASK-129
TASK-130
TASK-133
TASK-135
38. Tareas que pueden esperar
Importación avanzada
Simulador avanzado
SQL Console
SQL Write
PWA
Modo oscuro
Notificaciones push
Estadísticas avanzadas
39. Criterios de aceptación del plan

Este plan será aceptado cuando:

Las tareas sean pequeñas.
Las dependencias estén claras.
El dominio se implemente antes que la UI.
La seguridad esté integrada.
Las pruebas formen parte de cada fase.
El recalculo se implemente antes de producción.
El piloto sea obligatorio.
El backup y restore sean probados.
Codex pueda ejecutar una tarea sin ambigüedad.
Las tareas opcionales no bloqueen versión 1.0.
40. Documentos relacionados

Consultar siempre:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/09-Deployment.md
docs/10-ManualAdministrador.md
docs/11-ManualUsuario.md
docs/12-CentroDiagnostico.md
docs/13-Roadmap.md
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/16-Glosario.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
41. Conclusión

Kickoff no deberá implementarse como una única tarea grande.

Deberá construirse como una secuencia controlada de entregables pequeños:

Base
→ Dominio
→ Datos
→ Autenticación
→ Gestión deportiva
→ Pronósticos
→ Procesamiento
→ Clasificación
→ Auditoría
→ Diagnóstico
→ Seguridad
→ Testing
→ Piloto
→ Producción

La calidad final dependerá menos de la cantidad de código generado y más de la disciplina con la que se ejecute cada tarea.

Codex deberá trabajar como miembro de un equipo de ingeniería, no como un generador de código aislado.

