# API y Contratos de Aplicación

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Diseño técnico inicial  
**Estilo:** API interna HTTP + Server Actions  
**Formato principal:** JSON  
**Zona horaria de negocio:** `America/Tegucigalpa`  
**Persistencia temporal:** UTC

---

## 1. Propósito

Este documento define los contratos de comunicación de **Quiniela Nacional La Goleada – Kickoff**.

Incluye:

- Endpoints HTTP.
- Server Actions.
- Métodos.
- Autenticación.
- Autorización.
- Formatos de entrada.
- Formatos de respuesta.
- Errores.
- Paginación.
- Filtros.
- Idempotencia.
- Seguridad.
- Exportaciones.
- Herramientas administrativas.
- Diagnóstico.

La API será utilizada principalmente por la propia aplicación Next.js.

No se considera una API pública para terceros en la versión 1.0.

---

# 2. Principios de diseño

## 2.1 API interna

La API está diseñada para ser consumida por:

- Server Components.
- Client Components.
- Server Actions.
- Formularios internos.
- Herramientas administrativas.
- Pruebas automatizadas.

No deberá asumir que será consumida por aplicaciones externas.

---

## 2.2 Lógica centralizada

Los Route Handlers y Server Actions no deberán implementar directamente reglas complejas.

Flujo esperado:


Request
  → Validación
  → Autenticación
  → Autorización
  → Servicio de aplicación
  → Servicio de dominio
  → Repositorio
  → Base de datos

2.3 Servidor como autoridad

Toda operación sensible deberá validarse en el servidor.

Esto incluye:

Estado de sesión.
Rol.
Hora de cierre.
Propiedad del pronóstico.
Estado del partido.
Partido doble.
Procesamiento.
Visibilidad de pronósticos.
Acceso a auditoría.
Acceso a diagnóstico.
2.4 Contratos consistentes

Las respuestas deberán utilizar una estructura consistente.

Respuesta exitosa:

{
  "success": true,
  "data": {},
  "meta": {}
}

Respuesta de error:

{
  "success": false,
  "error": {
    "code": "PREDICTION_CLOSED",
    "message": "El periodo de pronóstico de este partido ya cerró.",
    "fieldErrors": {}
  },
  "requestId": "req_01HXYZ"
}
2.5 Identificadores opacos

Los identificadores se enviarán como UUID.

Ejemplo:

04cd0c77-b018-4e48-987d-f58458ab01e9

El cliente no deberá inferir información a partir del identificador.

3. Estrategia de implementación

La aplicación combinará:

Server Actions.
Route Handlers.
Servicios internos.
3.1 Server Actions

Se utilizarán preferentemente en:

Formularios autenticados.
Registro.
Login.
Creación o edición simple.
Guardado de pronósticos.
Aprobación de usuarios.
Acciones administrativas internas.
3.2 Route Handlers

Se utilizarán preferentemente en:

Listados dinámicos.
Contadores.
Paginación.
Exportaciones.
Descargas.
Health checks.
Diagnóstico.
Consola SQL.
Endpoints requeridos por Client Components.
Pruebas de integración HTTP.
3.3 Servicios internos

Los servicios deberán poder utilizarse desde Server Actions y Route Handlers sin duplicar lógica.

Ejemplo:

predictionService.savePrediction()

No deberán existir dos implementaciones distintas para guardar un pronóstico.

4. Convenciones HTTP
4.1 Métodos
Método  Uso
GET Consultar recursos
POST  Crear recursos o ejecutar acciones
PATCH Modificar parcialmente
PUT Sustituir cuando sea necesario
DELETE  Evitar en datos importantes
HEAD  Health checks opcionales

Las operaciones de desactivación, archivo o cancelación utilizarán normalmente POST o PATCH, no DELETE.

4.2 Content-Type

Las solicitudes JSON utilizarán:

Content-Type: application/json

Las cargas de archivos podrán utilizar:

Content-Type: multipart/form-data

Las exportaciones podrán devolver:

Content-Type: text/csv
Content-Type: application/json
Content-Type: application/zip
4.3 Versionado

La API interna podrá organizarse bajo:

/api/v1/

Ejemplo:

/api/v1/matches
/api/v1/predictions

Aunque sea una API interna, el prefijo ayuda a evitar cambios incompatibles futuros.

4.4 Fechas

Las fechas enviadas por la API utilizarán ISO 8601 en UTC.

Ejemplo:

{
  "scheduledAt": "2026-08-15T01:00:00.000Z"
}

Cuando sea útil, la respuesta podrá incluir información visible:

{
  "scheduledAt": "2026-08-15T01:00:00.000Z",
  "scheduledAtHonduras": "2026-08-14T19:00:00-06:00",
  "displayDate": "14 de agosto de 2026, 7:00 p. m."
}

Los valores derivados visibles no deberán sustituir la fecha canónica.

5. Autenticación

La autenticación utilizará una cookie de sesión.

Ejemplo conceptual:

Cookie: kickoff_session=<token-opaco>

La cookie deberá ser:

HttpOnly
Secure en producción
SameSite=Lax o más restrictivo
Path=/

No se utilizará el almacenamiento local para guardar tokens de sesión.

6. Protección CSRF

Las operaciones de escritura deberán estar protegidas mediante:

Política SameSite.
Validación de origen.
Token CSRF cuando sea necesario.
Server Actions con controles adecuados.
Rechazo de orígenes no autorizados.
7. Roles de acceso
Símbolo Significado
Público No requiere sesión
Usuario Requiere usuario aprobado
Admin Requiere ADMIN o SUPER_ADMIN
Superadmin  Requiere SUPER_ADMIN
8. Respuesta estándar
8.1 Éxito simple
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
8.2 Éxito paginado
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 140,
    "totalPages": 7,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
8.3 Error de validación
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los datos enviados.",
    "fieldErrors": {
      "nickname": [
        "El nickname ya está en uso."
      ]
    }
  },
  "requestId": "req_123"
}
9. Códigos HTTP
Código  Uso
200 Consulta o acción exitosa
201 Recurso creado
204 Acción exitosa sin contenido
400 Solicitud inválida
401 No autenticado
403 No autorizado
404 Recurso no encontrado
409 Conflicto de estado o duplicado
410 Token expirado o recurso ya no disponible
422 Datos semánticamente inválidos
429 Demasiadas solicitudes
500 Error interno
503 Mantenimiento o servicio no disponible
10. Códigos de error funcionales
Autenticación
AUTH_INVALID_CREDENTIALS
AUTH_EMAIL_NOT_VERIFIED
AUTH_ACCOUNT_PENDING_APPROVAL
AUTH_ACCOUNT_REJECTED
AUTH_ACCOUNT_BLOCKED
AUTH_ACCOUNT_DISABLED
AUTH_SESSION_EXPIRED
AUTH_SESSION_REVOKED
AUTH_RATE_LIMITED
Usuarios
USER_NOT_FOUND
USER_EMAIL_ALREADY_EXISTS
USER_NICKNAME_ALREADY_EXISTS
USER_EMAIL_IMMUTABLE
USER_ALREADY_APPROVED
USER_INVALID_STATUS_TRANSITION
Partidos
MATCH_NOT_FOUND
MATCH_INVALID_TEAMS
MATCH_DUPLICATE_WARNING
MATCH_ALREADY_PROCESSED
MATCH_NOT_PROCESSABLE
MATCH_CANCELLED
MATCH_SUSPENDED
MATCH_PROCESSING_CONFLICT
MATCH_DOUBLE_CONFLICT
Pronósticos
PREDICTION_NOT_FOUND
PREDICTION_CLOSED
PREDICTION_INVALID_SCORE
PREDICTION_ALREADY_LOCKED
PREDICTION_NOT_VISIBLE
Temporadas
SEASON_NOT_FOUND
SEASON_ALREADY_ACTIVE
SEASON_NOT_ACTIVE
SEASON_CLOSE_BLOCKED
SEASON_RECALCULATION_IN_PROGRESS
Diagnóstico
DIAGNOSTICS_DISABLED
SQL_CONSOLE_DISABLED
SQL_QUERY_NOT_ALLOWED
SQL_QUERY_TIMEOUT
TEST_DATA_TOOLS_DISABLED
11. Paginación

Parámetros estándar:

page
pageSize
sortBy
sortDirection

Ejemplo:

GET /api/v1/admin/users?page=1&pageSize=20&sortBy=createdAt&sortDirection=desc

Valores sugeridos:

page mínimo: 1
pageSize predeterminado: 20
pageSize máximo: 100

La API no deberá permitir tamaños ilimitados.

12. Búsqueda y filtros

Parámetros comunes:

search
status
seasonId
roundId
teamId
from
to
role

Los filtros deberán validarse mediante listas permitidas.

No se deberán usar directamente como fragmentos SQL.

13. Idempotencia

Las operaciones críticas podrán aceptar:

Idempotency-Key: <uuid>

Aplicable especialmente a:

Procesamiento de resultados.
Corrección de resultados.
Recalculo.
Exportaciones.
Importaciones.
Generación de datos de prueba.

Una misma clave no deberá ejecutar dos veces la misma operación.

14. Endpoints públicos
14.1 Estado básico
GET /api/v1/health

Acceso:

Público

Respuesta:

{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-08-01T18:00:00.000Z"
  }
}

No debe mostrar:

URL de base de datos.
Credenciales.
Versiones sensibles.
Estado detallado de infraestructura.
14.2 Configuración pública
GET /api/v1/public/config

Acceso:

Público

Respuesta:

{
  "success": true,
  "data": {
    "applicationName": "Quiniela Nacional La Goleada",
    "logoPath": "/branding/logo.png",
    "registrationEnabled": true,
    "maintenanceMode": false,
    "timezone": "America/Tegucigalpa"
  }
}

Solo deberá devolver configuración no sensible.

14.3 Equipos públicos
GET /api/v1/public/teams

Acceso:

Público

Respuesta:

{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Olimpia",
      "shortName": "OLI",
      "slug": "olimpia",
      "logoPath": "/teams/olimpia.png"
    }
  ]
}

Solo se devolverán equipos activos para el registro.

14.4 Cómo funciona
GET /api/v1/public/how-it-works

Acceso:

Público

Devuelve:

Reglas visibles.
Puntuación.
Cierre.
Partido doble.
Desempates.
Aprobación.
14.5 Patrocinadores públicos
GET /api/v1/public/sponsors

Parámetros:

placement

Ejemplo:

GET /api/v1/public/sponsors?placement=HOME
15. Registro y autenticación
15.1 Registro
POST /api/v1/auth/register

Acceso:

Público

Body:

{
  "firstName": "Juan",
  "lastName": "Euceda",
  "nickname": "Juancho",
  "email": "juan@example.com",
  "password": "ContraseñaSegura",
  "passwordConfirmation": "ContraseñaSegura",
  "favoriteTeamId": "uuid",
  "acceptedRules": true
}

Respuesta:

{
  "success": true,
  "data": {
    "status": "PENDING_EMAIL_CONFIRMATION",
    "message": "Revisa tu correo para confirmar tu cuenta."
  }
}

Errores:

USER_EMAIL_ALREADY_EXISTS
USER_NICKNAME_ALREADY_EXISTS
VALIDATION_ERROR
AUTH_RATE_LIMITED
15.2 Confirmar correo
POST /api/v1/auth/verify-email

Body:

{
  "token": "token-recibido"
}

Respuesta:

{
  "success": true,
  "data": {
    "status": "PENDING_APPROVAL",
    "message": "Tu correo fue confirmado. La cuenta está pendiente de aprobación."
  }
}
15.3 Reenviar confirmación
POST /api/v1/auth/resend-verification

Body:

{
  "email": "juan@example.com"
}

La respuesta siempre deberá ser genérica.

{
  "success": true,
  "data": {
    "message": "Si la cuenta requiere confirmación, se enviará un nuevo correo."
  }
}
15.4 Login
POST /api/v1/auth/login

Body:

{
  "email": "juan@example.com",
  "password": "ContraseñaSegura",
  "rememberMe": false
}

Respuesta:

{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "nickname": "Juancho",
      "role": "USER",
      "status": "APPROVED"
    }
  }
}

El token de sesión no se devolverá en JSON.

Se establecerá mediante cookie segura.

15.5 Logout
POST /api/v1/auth/logout

Acceso:

Usuario

Respuesta:

204 No Content
15.6 Solicitar recuperación
POST /api/v1/auth/forgot-password

Body:

{
  "email": "juan@example.com"
}

Respuesta genérica:

{
  "success": true,
  "data": {
    "message": "Si existe una cuenta asociada, recibirás instrucciones."
  }
}
15.7 Restablecer contraseña
POST /api/v1/auth/reset-password

Body:

{
  "token": "token",
  "password": "NuevaContraseña",
  "passwordConfirmation": "NuevaContraseña"
}

Respuesta:

{
  "success": true,
  "data": {
    "message": "La contraseña fue actualizada."
  }
}
15.8 Sesión actual
GET /api/v1/auth/me

Acceso:

Usuario

Respuesta:

{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "Euceda",
    "nickname": "Juancho",
    "email": "juan@example.com",
    "role": "USER",
    "favoriteTeam": {
      "id": "uuid",
      "name": "Olimpia",
      "logoPath": "/teams/olimpia.png"
    }
  }
}
16. Inicialización del sistema
16.1 Consultar estado inicial
GET /api/v1/setup/status

Acceso:

Público, protegido mediante controles adicionales

Respuesta:

{
  "success": true,
  "data": {
    "setupRequired": true
  }
}

No deberá revelar datos adicionales.

16.2 Crear superadministrador inicial
POST /api/v1/setup/initialize

Headers:

X-Setup-Token: <INITIAL_SETUP_TOKEN>

Body:

{
  "firstName": "Juan",
  "lastName": "Euceda",
  "nickname": "Juan",
  "email": "admin@example.com",
  "password": "ContraseñaSegura",
  "passwordConfirmation": "ContraseñaSegura",
  "favoriteTeamId": "uuid"
}

Condiciones:

No debe existir superadministrador.
No debe haberse completado el setup.
El token de inicialización debe ser válido.
La operación debe ser transaccional.
17. Dashboard
17.1 Dashboard del usuario
GET /api/v1/dashboard

Acceso:

Usuario

Respuesta:

{
  "success": true,
  "data": {
    "user": {
      "nickname": "Juancho"
    },
    "standing": {
      "position": 3,
      "previousPosition": 4,
      "trend": "UP",
      "totalPoints": 47,
      "exactCount": 11,
      "partialCount": 14
    },
    "nextClosingMatch": {
      "id": "uuid",
      "roundName": "Jornada 8",
      "scheduledAt": "2026-08-15T01:00:00.000Z",
      "predictionClosesAt": "2026-08-15T00:55:00.000Z",
      "isDoublePoints": true,
      "homeTeam": {},
      "awayTeam": {},
      "hasPrediction": true
    },
    "pendingPredictions": 3,
    "topFive": [],
    "unreadNotifications": 2
  }
}
18. Perfil
18.1 Obtener perfil
GET /api/v1/profile

Acceso:

Usuario
18.2 Cambiar contraseña autenticado
POST /api/v1/profile/change-password

Body:

{
  "currentPassword": "ContraseñaActual",
  "newPassword": "NuevaContraseña",
  "newPasswordConfirmation": "NuevaContraseña"
}
18.3 Revocar otras sesiones
POST /api/v1/profile/revoke-other-sessions

Acceso:

Usuario
18.4 Correo no modificable

No existirá:

PATCH /api/v1/profile/email

Cualquier intento deberá responder:

USER_EMAIL_IMMUTABLE
19. Temporadas
19.1 Temporada activa
GET /api/v1/seasons/active

Acceso:

Usuario

Respuesta:

{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Apertura 2026",
    "status": "ACTIVE",
    "predictionCloseMinutes": 5,
    "exactPoints": 3,
    "partialPoints": 1,
    "doubleMultiplier": 2
  }
}
19.2 Historial de temporadas
GET /api/v1/seasons/history

Acceso:

Usuario
19.3 Tabla histórica
GET /api/v1/seasons/:seasonId/final-standings

Acceso:

Usuario
20. Jornadas
20.1 Listar jornadas
GET /api/v1/rounds

Parámetros:

seasonId
status
page
pageSize

Acceso:

Usuario
20.2 Detalle de jornada
GET /api/v1/rounds/:roundId

Devuelve:

Datos de jornada.
Partidos.
Partido doble.
Estado general.
Cantidad procesada.
Cantidad pendiente.
21. Partidos
21.1 Listar partidos
GET /api/v1/matches

Parámetros:

seasonId
roundId
status
from
to
teamId
includeProcessed
page
pageSize

Acceso:

Usuario

Reglas de respuesta:

Los usuarios no deberán recibir pronósticos ajenos antes del cierre.
Los campos administrativos deberán omitirse.
Los partidos deberán ordenarse por fecha real.
21.2 Detalle de partido
GET /api/v1/matches/:matchId

Acceso:

Usuario

Respuesta antes del cierre:

{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "SCHEDULED",
    "isPredictionOpen": true,
    "canViewAllPredictions": false,
    "myPrediction": {
      "homeGoals": 2,
      "awayGoals": 1
    }
  }
}

Respuesta después del cierre:

{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CLOSED",
    "isPredictionOpen": false,
    "canViewAllPredictions": true,
    "predictions": [
      {
        "nickname": "Juancho",
        "homeGoals": 2,
        "awayGoals": 1,
        "points": null
      }
    ]
  }
}
22. Pronósticos
22.1 Obtener pronóstico propio
GET /api/v1/matches/:matchId/prediction

Acceso:

Usuario
22.2 Crear o modificar pronóstico
PUT /api/v1/matches/:matchId/prediction

Acceso:

Usuario

Body:

{
  "homeGoals": 2,
  "awayGoals": 1
}

Respuesta:

{
  "success": true,
  "data": {
    "id": "uuid",
    "matchId": "uuid",
    "homeGoals": 2,
    "awayGoals": 1,
    "submittedAt": "2026-08-14T20:00:00.000Z",
    "updatedAt": "2026-08-14T20:05:00.000Z",
    "status": "SAVED"
  }
}

Validaciones:

Usuario participante.
Partido existente.
Partido no cancelado.
Partido no procesado.
Hora actual menor que predictionClosesAt.
Marcadores enteros y válidos.

Errores:

PREDICTION_CLOSED
PREDICTION_INVALID_SCORE
MATCH_CANCELLED
MATCH_NOT_FOUND
22.3 Pronósticos públicos del partido
GET /api/v1/matches/:matchId/predictions

Acceso:

Usuario

Antes del cierre:

403 Forbidden

Error:

PREDICTION_NOT_VISIBLE

Después del cierre y antes del procesamiento:

{
  "success": true,
  "data": [
    {
      "userId": "uuid",
      "nickname": "Juancho",
      "homeGoals": 2,
      "awayGoals": 1,
      "scoreType": null,
      "points": null
    },
    {
      "userId": "uuid",
      "nickname": "Carlos",
      "homeGoals": null,
      "awayGoals": null,
      "scoreType": null,
      "points": null,
      "hasPrediction": false
    }
  ]
}

Después del procesamiento:

{
  "success": true,
  "data": [
    {
      "nickname": "Juancho",
      "homeGoals": 2,
      "awayGoals": 1,
      "scoreType": "EXACT",
      "points": 3
    }
  ]
}
22.4 Pronósticos pendientes del usuario
GET /api/v1/predictions/pending

Acceso:

Usuario

Devuelve partidos abiertos sin pronóstico válido.

23. Clasificación
23.1 Tabla activa
GET /api/v1/standings

Parámetros:

seasonId

Acceso:

Usuario

Respuesta:

{
  "success": true,
  "data": [
    {
      "position": 1,
      "userId": "uuid",
      "nickname": "Carlos",
      "favoriteTeam": {
        "name": "Olimpia",
        "logoPath": "/teams/olimpia.png"
      },
      "partialCount": 14,
      "exactCount": 12,
      "totalPoints": 50,
      "trend": "UP"
    },
    {
      "position": 2,
      "nickname": "Ana",
      "partialCount": 16,
      "exactCount": 11,
      "totalPoints": 47,
      "trend": "SAME"
    },
    {
      "position": 2,
      "nickname": "Pedro",
      "partialCount": 16,
      "exactCount": 11,
      "totalPoints": 47,
      "trend": "UP"
    }
  ]
}

El backend deberá devolver las posiciones ya calculadas correctamente.

24. Resultados
24.1 Listar resultados
GET /api/v1/results

Parámetros:

seasonId
roundId
status
from
to
page
pageSize

Estados aceptados:

PENDING
PROCESSED
ALL
24.2 Resultado individual
GET /api/v1/results/:matchId

Devuelve:

Marcador oficial si existe.
Estado.
Pronósticos visibles.
Puntos si fueron procesados.
Partido doble.
Jornada.
Historial visible de reprogramación.
25. Notificaciones
25.1 Listar notificaciones
GET /api/v1/notifications

Parámetros:

read
page
pageSize
25.2 Marcar una como leída
POST /api/v1/notifications/:notificationId/read
25.3 Marcar todas como leídas
POST /api/v1/notifications/read-all
26. Administración de usuarios
26.1 Listar usuarios
GET /api/v1/admin/users

Acceso:

Admin

Filtros:

search
status
role
favoriteTeamId
page
pageSize
26.2 Obtener usuario
GET /api/v1/admin/users/:userId

No devolver:

Password hash.
Tokens.
Cookies.
Secretos.
26.3 Aprobar usuario
POST /api/v1/admin/users/:userId/approve

Acceso:

Admin

Body opcional:

{
  "addToActiveSeason": true
}

Condiciones:

Correo confirmado.
Estado pendiente.
Cuenta no bloqueada.
26.4 Rechazar usuario
POST /api/v1/admin/users/:userId/reject

Body:

{
  "reason": "No pertenece a la comunidad."
}
26.5 Bloquear usuario
POST /api/v1/admin/users/:userId/block

Body:

{
  "reason": "Incumplimiento de reglas."
}
26.6 Desbloquear usuario
POST /api/v1/admin/users/:userId/unblock
26.7 Desactivar usuario
POST /api/v1/admin/users/:userId/disable
26.8 Reactivar usuario
POST /api/v1/admin/users/:userId/enable
26.9 Promover a administrador
POST /api/v1/super-admin/users/:userId/promote-admin

Acceso:

Superadmin

Body:

{
  "reason": "Será responsable de procesar jornadas."
}
26.10 Retirar administrador
POST /api/v1/super-admin/users/:userId/remove-admin

Acceso:

Superadmin
27. Administración de temporadas
27.1 Crear temporada
POST /api/v1/admin/seasons

Body:

{
  "name": "Apertura 2026",
  "startsAt": "2026-07-20T06:00:00.000Z",
  "exactPoints": 3,
  "partialPoints": 1,
  "wrongPoints": 0,
  "doubleMultiplier": 2,
  "predictionCloseMinutes": 5,
  "maxPredictionGoals": 20
}
27.2 Actualizar temporada
PATCH /api/v1/admin/seasons/:seasonId

Una temporada activa tendrá restricciones adicionales.

27.3 Activar temporada
POST /api/v1/admin/seasons/:seasonId/activate

Condiciones:

No existe otra activa.
Configuración válida.
Equipos disponibles.
27.4 Cerrar temporada
POST /api/v1/super-admin/seasons/:seasonId/close

Body:

{
  "confirm": true,
  "allowPendingMatches": false
}

Respuesta de advertencia posible:

{
  "success": false,
  "error": {
    "code": "SEASON_CLOSE_BLOCKED",
    "message": "La temporada tiene partidos pendientes.",
    "details": {
      "pendingMatches": 2,
      "suspendedMatches": 1
    }
  }
}
28. Administración de jornadas
28.1 Crear jornada
POST /api/v1/admin/rounds

Body:

{
  "seasonId": "uuid",
  "name": "Jornada 5",
  "sequence": 5,
  "description": null
}
28.2 Actualizar jornada
PATCH /api/v1/admin/rounds/:roundId
28.3 Publicar jornada
POST /api/v1/admin/rounds/:roundId/publish

Validaciones:

Al menos un partido.
Exactamente un partido doble.
Partidos válidos.
28.4 Archivar jornada
POST /api/v1/admin/rounds/:roundId/archive

No elimina partidos ni pronósticos.

29. Administración de partidos
29.1 Crear partido
POST /api/v1/admin/matches

Body:

{
  "seasonId": "uuid",
  "roundId": "uuid",
  "homeTeamId": "uuid",
  "awayTeamId": "uuid",
  "scheduledAt": "2026-08-15T01:00:00.000Z",
  "venue": "Estadio Nacional",
  "isDoublePoints": false,
  "notes": null
}

Respuesta con advertencia posible:

{
  "success": true,
  "data": {
    "match": {},
    "warnings": [
      {
        "code": "MATCH_DUPLICATE_WARNING",
        "message": "Existe un partido similar en esta jornada."
      }
    ]
  }
}
29.2 Actualizar partido
PATCH /api/v1/admin/matches/:matchId

No deberá utilizarse para reprogramación cuando se requiera historial.

29.3 Reprogramar partido
POST /api/v1/admin/matches/:matchId/reschedule

Body:

{
  "newScheduledAt": "2026-10-16T02:00:00.000Z",
  "reason": "Reprogramación oficial de la liga",
  "reopenPredictions": true
}

Respuesta:

{
  "success": true,
  "data": {
    "previousScheduledAt": "2026-08-15T01:00:00.000Z",
    "newScheduledAt": "2026-10-16T02:00:00.000Z",
    "newPredictionClosesAt": "2026-10-16T01:55:00.000Z",
    "predictionsReopened": true,
    "predictionsPreserved": 42
  }
}
29.4 Suspender partido
POST /api/v1/admin/matches/:matchId/suspend

Body:

{
  "reason": "Partido suspendido por condiciones climáticas."
}
29.5 Reanudar partido
POST /api/v1/admin/matches/:matchId/resume

Body:

{
  "scheduledAt": "2026-08-16T20:00:00.000Z",
  "reason": "Reanudación confirmada."
}
29.6 Cancelar partido
POST /api/v1/admin/matches/:matchId/cancel

Body:

{
  "reason": "Cancelación oficial."
}
29.7 Cambiar partido doble
POST /api/v1/admin/rounds/:roundId/double-match

Body:

{
  "matchId": "uuid"
}

Si existe impacto histórico:

409 MATCH_DOUBLE_CONFLICT

La operación especial de corrección será reservada al superadministrador.

30. Procesamiento de resultados
30.1 Procesar resultado
POST /api/v1/admin/matches/:matchId/process-result

Headers recomendados:

Idempotency-Key: <uuid>

Body:

{
  "officialHomeGoals": 2,
  "officialAwayGoals": 1,
  "confirmation": true
}

Respuesta:

{
  "success": true,
  "data": {
    "matchId": "uuid",
    "resultVersion": 1,
    "officialHomeGoals": 2,
    "officialAwayGoals": 1,
    "usersEvaluated": 48,
    "exactCount": 8,
    "partialCount": 21,
    "wrongCount": 15,
    "noPredictionCount": 4,
    "processedAt": "2026-08-15T03:15:00.000Z"
  }
}
30.2 Corregir resultado
POST /api/v1/super-admin/matches/:matchId/correct-result

Acceso:

Superadmin

Body:

{
  "officialHomeGoals": 1,
  "officialAwayGoals": 1,
  "reason": "Corrección del acta oficial.",
  "confirmationText": "CORREGIR"
}

La operación deberá:

Incrementar versión.
Recalcular puntuaciones.
Recalcular clasificación.
Registrar antes y después.
Ser transaccional.
31. Auditoría
31.1 Listar auditoría
GET /api/v1/admin/audit

Acceso:

Admin

Filtros:

actorUserId
action
entityType
entityId
from
to
page
pageSize
31.2 Detalle de auditoría
GET /api/v1/admin/audit/:auditId

La respuesta deberá excluir valores sensibles.

No existirán endpoints de actualización o eliminación.

32. Patrocinadores
32.1 Listar patrocinadores administrativos
GET /api/v1/admin/sponsors
32.2 Crear patrocinador
POST /api/v1/admin/sponsors

Body JSON:

{
  "name": "Patrocinador",
  "targetUrl": "https://example.com",
  "displayOrder": 1,
  "isActive": true
}

La imagen podrá cargarse mediante endpoint separado.

32.3 Cargar imagen
POST /api/v1/admin/sponsors/:sponsorId/image

Tipo:

multipart/form-data
32.4 Actualizar patrocinador
PATCH /api/v1/admin/sponsors/:sponsorId
32.5 Desactivar patrocinador
POST /api/v1/admin/sponsors/:sponsorId/disable
33. Configuración
33.1 Configuración administrativa
GET /api/v1/super-admin/settings

Acceso:

Superadmin

No devolverá secretos.

33.2 Actualizar configuración
PATCH /api/v1/super-admin/settings

Body:

{
  "applicationName": "Quiniela Nacional La Goleada",
  "maintenanceMode": false,
  "howItWorks": "...",
  "socialLinks": {}
}

No se permitirá actualizar desde aquí:

SMTP password.
Session secret.
Database URL.
Setup token.
33.3 Activar mantenimiento
POST /api/v1/super-admin/maintenance/enable

Body:

{
  "reason": "Actualización programada."
}
33.4 Desactivar mantenimiento
POST /api/v1/super-admin/maintenance/disable
34. Diagnóstico

Todos los endpoints de esta sección requieren:

Rol SUPER_ADMIN.
Bandera de entorno habilitada cuando corresponda.
Auditoría.
34.1 Estado de diagnóstico
GET /api/v1/super-admin/diagnostics/status

Respuesta:

{
  "success": true,
  "data": {
    "database": {
      "status": "OK",
      "latencyMs": 18
    },
    "smtp": {
      "status": "OK"
    },
    "counts": {
      "users": 48,
      "matches": 90,
      "predictions": 3200,
      "auditLogs": 540
    }
  }
}

No mostrar credenciales ni hosts sensibles cuando no sea necesario.

34.2 Verificar SMTP
POST /api/v1/super-admin/diagnostics/test-smtp

Body:

{
  "recipient": "admin@example.com"
}
34.3 Verificar integridad
POST /api/v1/super-admin/diagnostics/integrity-check

Respuesta:

{
  "success": true,
  "data": {
    "status": "WARNING",
    "checks": [
      {
        "code": "ROUND_WITHOUT_DOUBLE_MATCH",
        "severity": "WARNING",
        "count": 1
      },
      {
        "code": "STANDING_POINTS_MISMATCH",
        "severity": "ERROR",
        "count": 0
      }
    ]
  }
}
35. Recalculo de temporada
35.1 Iniciar recalculo
POST /api/v1/super-admin/seasons/:seasonId/recalculate

Headers:

Idempotency-Key: <uuid>

Body:

{
  "reason": "Verificación general de clasificación.",
  "confirmationText": "RECALCULAR"
}

Respuesta:

{
  "success": true,
  "data": {
    "runId": "uuid",
    "status": "COMPLETED",
    "usersProcessed": 48,
    "matchesProcessed": 90,
    "differencesFound": 0
  }
}
35.2 Consultar ejecución
GET /api/v1/super-admin/recalculations/:runId
36. Exportaciones
36.1 Solicitar exportación
POST /api/v1/super-admin/exports

Body:

{
  "type": "FULL_BACKUP",
  "format": "JSON",
  "seasonId": "uuid"
}

Tipos posibles:

USERS
TEAMS
SEASONS
ROUNDS
MATCHES
PREDICTIONS
STANDINGS
AUDIT
FULL_BACKUP
36.2 Consultar exportación
GET /api/v1/super-admin/exports/:exportId
36.3 Descargar exportación
GET /api/v1/super-admin/exports/:exportId/download

El enlace debe:

Expirar.
Requerir sesión.
Validar propiedad o permiso.
Registrar descarga.
37. Datos de prueba
37.1 Generar datos
POST /api/v1/super-admin/test-data/generate

Body:

{
  "users": 50,
  "rounds": 10,
  "matchesPerRound": 5,
  "generatePredictions": true,
  "generateResults": false,
  "confirmationText": "GENERAR"
}

Debe estar deshabilitado por defecto en producción.

37.2 Limpiar lote de prueba
POST /api/v1/super-admin/test-data/:batchId/cleanup

Solo elimina datos identificados dentro del lote.

37.3 Simular jornada
POST /api/v1/super-admin/simulations/round/:roundId

Body:

{
  "generateMissingPredictions": true,
  "generateResults": true,
  "processResults": true
}
38. Consola SQL
38.1 Ejecutar consulta de lectura
POST /api/v1/super-admin/sql/read

Body:

{
  "query": "SELECT id, nickname FROM \"User\" ORDER BY nickname LIMIT 50"
}

Restricciones:

Solo una instrucción.
Solo SELECT.
Sin comentarios peligrosos.
Tiempo máximo.
Límite de filas.
Transacción de solo lectura cuando sea posible.

Respuesta:

{
  "success": true,
  "data": {
    "columns": [
      "id",
      "nickname"
    ],
    "rows": [],
    "rowCount": 48,
    "durationMs": 12,
    "truncated": false
  }
}
38.2 Ejecutar consulta de escritura
POST /api/v1/super-admin/sql/write

Requisitos:

Variable de entorno activa.
Superadministrador.
Reautenticación reciente.
Confirmación reforzada.
Auditoría.
Lista de instrucciones permitidas.
Bloqueo de comandos destructivos.

Body:

{
  "query": "UPDATE ...",
  "reason": "Corrección técnica autorizada.",
  "confirmationText": "EJECUTAR"
}
39. Métricas y errores técnicos
39.1 Errores recientes
GET /api/v1/super-admin/diagnostics/errors

Filtros:

from
to
errorCode
route
page
pageSize

Las respuestas deberán ocultar:

Variables de entorno.
Passwords.
Tokens.
Queries con secretos.
Stack traces completos cuando no sean necesarios.
40. Importaciones

Las importaciones podrán implementarse después del flujo principal.

40.1 Previsualizar CSV
POST /api/v1/super-admin/imports/matches/preview

Tipo:

multipart/form-data

Respuesta:

{
  "success": true,
  "data": {
    "validRows": 20,
    "invalidRows": 2,
    "errors": [
      {
        "row": 4,
        "field": "homeTeam",
        "message": "Equipo no encontrado."
      }
    ]
  }
}
40.2 Confirmar importación
POST /api/v1/super-admin/imports/matches/confirm

Debe utilizar un identificador generado durante la previsualización.

41. Server Actions sugeridas

Aunque existan endpoints equivalentes, los formularios internos podrán utilizar Server Actions.

registerUserAction()
loginAction()
logoutAction()
requestPasswordResetAction()
resetPasswordAction()

savePredictionAction()

approveUserAction()
rejectUserAction()
blockUserAction()

createSeasonAction()
activateSeasonAction()
closeSeasonAction()

createRoundAction()
publishRoundAction()

createMatchAction()
updateMatchAction()
rescheduleMatchAction()
suspendMatchAction()
cancelMatchAction()

processMatchResultAction()
correctMatchResultAction()

updateSettingsAction()
enableMaintenanceAction()
disableMaintenanceAction()

Cada acción deberá:

Validar entrada.
Validar sesión.
Validar permiso.
Invocar servicio.
Revalidar caché.
Devolver una respuesta tipada.
42. Formato de resultado de Server Action

Ejemplo:

type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };

No deberán lanzarse errores sin controlar directamente hacia el cliente.

43. Revalidación de datos

Después de operaciones exitosas se deberán revalidar las rutas o tags relacionadas.

Ejemplos:

Guardar pronóstico:

dashboard
predictions
match:{matchId}

Procesar resultado:

dashboard
standings
results
match:{matchId}
round:{roundId}

Aprobar usuario:

admin-users
admin-dashboard
44. Rate limiting

Aplicar límites especialmente a:

Login.
Registro.
Reenvío de verificación.
Recuperación de contraseña.
SQL.
Exportaciones.
Diagnóstico.
Guardado repetitivo de pronósticos.

El guardado automático deberá usar debounce para evitar solicitudes excesivas.

45. Seguridad de respuestas

La API nunca devolverá:

passwordHash.
Token de sesión almacenado.
Hash de token.
Contraseña SMTP.
SESSION_SECRET.
DATABASE_URL.
Cookies.
Datos internos innecesarios.
Stack trace en producción.
46. Auditoría desde API

Toda operación administrativa deberá pasar metadatos de contexto:

type RequestContext = {
  requestId: string;
  userId?: string;
  role?: UserRole;
  ipAddress?: string;
  userAgent?: string;
};

El servicio deberá usar este contexto para crear auditorías.

47. Operaciones transaccionales

Deberán ser transaccionales:

Aprobar usuario e incorporarlo a temporada.
Promover administrador.
Procesar resultado.
Corregir resultado.
Cambiar partido doble con impacto.
Cerrar temporada.
Recalcular.
Restaurar.
Importar.
Limpiar datos de prueba.
48. Control de concurrencia
Procesamiento

Si dos administradores intentan procesar el mismo partido:

Una solicitud tendrá éxito.
La otra recibirá:
409 Conflict
{
  "success": false,
  "error": {
    "code": "MATCH_PROCESSING_CONFLICT",
    "message": "El partido está siendo procesado por otro administrador."
  }
}
Pronóstico

Si una solicitud llega después del cierre:

409 Conflict

o:

422 Unprocessable Entity

Se recomienda 409 por conflicto con el estado temporal.

49. Visibilidad de pronósticos

El repositorio o servicio no deberá devolver pronósticos ajenos antes del cierre.

No es suficiente ocultarlos en la UI.

Ejemplo de política:

if (!match.canViewAllPredictions) {
  return onlyCurrentUserPrediction();
}
50. Orden de partidos

La API deberá ordenar por:

predictionClosesAt ASC
scheduledAt ASC

para partidos abiertos.

Los partidos procesados podrán ordenarse por:

processedAt DESC

Nunca se usará Round.sequence como criterio cronológico principal.

51. Campos derivados recomendados

Las respuestas podrán incluir:

isPredictionOpen
canEditPrediction
canViewAllPredictions
canProcessResult
hasPrediction
isClosingSoon
displayStatus
trend

Estos campos deben calcularse en servidor para mantener consistencia.

52. Ejemplo completo de partido abierto
{
  "success": true,
  "data": {
    "id": "29d7a413-d795-4d9a-a108-f4e4a70b9c12",
    "season": {
      "id": "uuid",
      "name": "Apertura 2026"
    },
    "round": {
      "id": "uuid",
      "name": "Jornada 8",
      "sequence": 8
    },
    "homeTeam": {
      "id": "uuid",
      "name": "Olimpia",
      "shortName": "OLI",
      "logoPath": "/teams/olimpia.png"
    },
    "awayTeam": {
      "id": "uuid",
      "name": "Motagua",
      "shortName": "MOT",
      "logoPath": "/teams/motagua.png"
    },
    "scheduledAt": "2026-08-15T01:00:00.000Z",
    "predictionClosesAt": "2026-08-15T00:55:00.000Z",
    "status": "SCHEDULED",
    "displayStatus": "OPEN",
    "isDoublePoints": true,
    "isPredictionOpen": true,
    "isClosingSoon": false,
    "canViewAllPredictions": false,
    "myPrediction": {
      "homeGoals": 2,
      "awayGoals": 1,
      "updatedAt": "2026-08-14T19:10:00.000Z"
    }
  }
}
53. Ejemplo completo de partido procesado
{
  "success": true,
  "data": {
    "id": "uuid",
    "roundName": "Jornada 8",
    "status": "PROCESSED",
    "isDoublePoints": true,
    "officialResult": {
      "homeGoals": 2,
      "awayGoals": 1
    },
    "processedAt": "2026-08-15T03:15:00.000Z",
    "predictions": [
      {
        "userId": "uuid",
        "nickname": "Juancho",
        "homeGoals": 2,
        "awayGoals": 1,
        "scoreType": "EXACT",
        "basePoints": 3,
        "multiplier": 2,
        "awardedPoints": 6
      },
      {
        "userId": "uuid",
        "nickname": "Carlos",
        "homeGoals": 1,
        "awayGoals": 0,
        "scoreType": "PARTIAL",
        "basePoints": 1,
        "multiplier": 2,
        "awardedPoints": 2
      }
    ]
  }
}
54. Validación de esquemas

Se recomienda definir esquemas compartidos.

Ejemplo conceptual:

const predictionSchema = z.object({
  homeGoals: z.number().int().min(0).max(20),
  awayGoals: z.number().int().min(0).max(20),
});

Otros esquemas:

registerSchema
loginSchema
resetPasswordSchema
seasonSchema
roundSchema
matchSchema
rescheduleMatchSchema
processResultSchema
correctResultSchema
sponsorSchema
sqlQuerySchema

La librería exacta se definirá en las decisiones arquitectónicas.

55. Documentación automática

Podrá generarse una especificación OpenAPI para Route Handlers.

No es obligatoria para el primer sprint, pero se recomienda mantener:

docs/openapi.yaml

La documentación deberá reflejar los endpoints reales.

No se debe mantener una especificación automática si queda desactualizada.

56. Pruebas de API obligatorias

Como mínimo:

Registro válido.
Correo duplicado.
Nickname duplicado.
Confirmación válida.
Token expirado.
Login correcto.
Login de cuenta pendiente.
Recuperación genérica.
Guardar pronóstico abierto.
Rechazar pronóstico cerrado.
Ocultar pronósticos antes del cierre.
Mostrar pronósticos después del cierre.
Procesar resultado como administrador.
Rechazar procesamiento como usuario.
Procesamiento concurrente.
Partido doble.
Reprogramación.
Jornada 5 después de Jornada 10.
Corrección de resultado.
Clasificación compartida.
Auditoría.
Recalculo.
Exportación sin secretos.
SQL bloqueado.
Mantenimiento.
57. Criterios de aceptación de la API

La API será aceptada cuando:

Use respuestas consistentes.
Valide todas las entradas.
Valide sesión y rol en servidor.
No revele secretos.
Bloquee pronósticos tardíos.
Oculte pronósticos abiertos.
Permita reprogramaciones.
Procese resultados transaccionalmente.
Evite procesamiento duplicado.
Calcule posiciones compartidas.
Genere auditoría.
Proteja diagnóstico.
Permita recalculo reproducible.
Use paginación.
Aplique rate limiting.
Mantenga la operación gratuita.
58. Documentos relacionados

Consultar:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/12-CentroDiagnostico.md
docs/17-CODEX_INSTRUCTIONS.md
59. Conclusión

La API de Kickoff deberá ser pequeña, coherente y segura.

Su prioridad será proteger:

La privacidad temporal de los pronósticos.
El cierre correcto de cada partido.
La integridad del procesamiento.
La autorización por roles.
La auditoría.
La reproducibilidad de la clasificación.

La aplicación no deberá depender de que el frontend se comporte correctamente. Toda regla crítica se aplicará nuevamente en el servidor.
  