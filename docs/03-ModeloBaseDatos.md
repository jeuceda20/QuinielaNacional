# Modelo de Base de Datos

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Motor objetivo:** PostgreSQL  
**ORM objetivo:** Prisma  
**Zona horaria de presentación:** `America/Tegucigalpa`  
**Persistencia temporal:** UTC  
**Estado:** Diseño lógico inicial

---

## 1. Propósito

Este documento define el modelo lógico de datos para **Quiniela Nacional La Goleada – Kickoff**.

El modelo debe soportar:

- Usuarios y roles.
- Confirmación de correo.
- Recuperación de contraseña.
- Sesiones.
- Temporadas.
- Jornadas.
- Equipos.
- Partidos.
- Reprogramaciones.
- Pronósticos.
- Resultados.
- Puntuación.
- Clasificación.
- Historial de posiciones.
- Notificaciones.
- Patrocinadores.
- Configuración.
- Auditoría.
- Diagnóstico.
- Datos de prueba.

El modelo deberá priorizar:

- Integridad.
- Trazabilidad.
- Recalculo reproducible.
- Evitar duplicados.
- Evitar borrados destructivos.
- Compatibilidad con transacciones.
- Consultas eficientes.

---

## 2. Principios de diseño

### 2.1 PostgreSQL como fuente de verdad

La base de datos almacenará todos los datos esenciales del sistema.

No se utilizarán:

- Archivos JSON como fuente primaria.
- Estado persistente en el navegador.
- Datos críticos únicamente en caché.
- Hojas de cálculo como repositorio operativo.

### 2.2 Fechas en UTC

Todas las fechas y horas se almacenarán en UTC.

La aplicación convertirá los valores a:


America/Tegucigalpa
para presentación y cálculos visibles.

2.3 Identificadores

Se recomienda utilizar UUID para entidades principales.

Ejemplo:

UUID v4

Ventajas:

Evita identificadores predecibles.
Facilita exportaciones e importaciones.
Reduce conflictos.
Permite generación distribuida.

Los identificadores internos no deberán exponerse innecesariamente.

2.4 Soft delete

Las entidades importantes no se eliminarán físicamente durante operaciones normales.

Se utilizarán campos como:

isActive
deletedAt
archivedAt

La elección dependerá del significado funcional.

2.5 Auditoría append-only

Los registros de auditoría serán de solo inserción desde la aplicación.

No existirán operaciones normales de actualización o eliminación.

2.6 Datos derivados

Los puntos y la clasificación pueden almacenarse para rendimiento, pero deberán poder reconstruirse.

La fuente de verdad estará formada por:

Pronósticos.
Resultado oficial.
Multiplicador.
Reglas aplicadas.
3. Diagrama entidad-relación
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ EMAIL_VERIFICATION_TOKEN : receives
    USER ||--o{ PASSWORD_RESET_TOKEN : receives
    USER ||--o{ PREDICTION : creates
    USER ||--o{ USER_MATCH_SCORE : earns
    USER ||--o{ STANDING : has
    USER ||--o{ STANDING_SNAPSHOT : appears
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ AUDIT_LOG : performs
    USER }o--|| TEAM : supports

    SEASON ||--o{ ROUND : contains
    SEASON ||--o{ MATCH : contains
    SEASON ||--o{ STANDING : contains
    SEASON ||--o{ STANDING_SNAPSHOT : contains
    SEASON ||--o{ SEASON_ARCHIVE : produces

    ROUND ||--o{ MATCH : contains

    TEAM ||--o{ MATCH : homeTeam
    TEAM ||--o{ MATCH : awayTeam

    MATCH ||--o{ PREDICTION : receives
    MATCH ||--o{ USER_MATCH_SCORE : produces
    MATCH ||--o{ MATCH_SCHEDULE_HISTORY : has
    MATCH ||--o{ MATCH_STATUS_HISTORY : has

    PREDICTION ||--o| USER_MATCH_SCORE : scores

    SPONSOR ||--o{ SPONSOR_PLACEMENT : placed

    USER ||--o{ USER_ROLE_HISTORY : changes
4. Enumeraciones
4.1 UserRole
USER
ADMIN
SUPER_ADMIN
4.2 UserStatus
PENDING_EMAIL_CONFIRMATION
PENDING_APPROVAL
APPROVED
REJECTED
BLOCKED
DISABLED
4.3 SeasonStatus
DRAFT
ACTIVE
CLOSED
ARCHIVED
4.4 RoundStatus
DRAFT
PUBLISHED
IN_PROGRESS
COMPLETED
ARCHIVED
4.5 MatchStatus
SCHEDULED
RESCHEDULED
CLOSED
SUSPENDED
RESUMED
FINISHED_PENDING
PROCESSED
CANCELLED
4.6 PredictionScoreType
EXACT
PARTIAL
WRONG
NO_PREDICTION
4.7 NotificationType
ACCOUNT_APPROVED
ACCOUNT_REJECTED
MATCH_CLOSING_SOON
PREDICTIONS_PENDING
MATCH_RESCHEDULED
MATCH_PROCESSED
SEASON_STARTED
SYSTEM
4.8 AuditAction

Los valores podrán ampliarse, pero inicialmente incluirán:

LOGIN
LOGOUT
USER_REGISTERED
USER_APPROVED
USER_REJECTED
USER_BLOCKED
USER_UNBLOCKED
USER_DISABLED
USER_ROLE_CHANGED
SEASON_CREATED
SEASON_UPDATED
SEASON_ACTIVATED
SEASON_CLOSED
ROUND_CREATED
ROUND_UPDATED
ROUND_ARCHIVED
MATCH_CREATED
MATCH_UPDATED
MATCH_RESCHEDULED
MATCH_SUSPENDED
MATCH_RESUMED
MATCH_CANCELLED
MATCH_DOUBLE_CHANGED
MATCH_PROCESSED
MATCH_RESULT_CORRECTED
PREDICTION_CREATED
PREDICTION_UPDATED
SEASON_RECALCULATED
SETTINGS_UPDATED
MAINTENANCE_ENABLED
MAINTENANCE_DISABLED
DATA_EXPORTED
TEST_DATA_GENERATED
SQL_QUERY_EXECUTED
INTEGRITY_CHECK_EXECUTED
4.9 AuditEntityType
USER
TEAM
SEASON
ROUND
MATCH
PREDICTION
STANDING
SPONSOR
SETTING
SYSTEM
4.10 SponsorPlacementType
HOME
DASHBOARD
SIDEBAR
FOOTER
RESULTS
STANDINGS
5. Tabla User

Representa las cuentas de participantes y administradores.

Campos
Campo	Tipo	Requerido	Descripción
id	UUID	Sí	Identificador único
firstName	VARCHAR(100)	Sí	Nombre
lastName	VARCHAR(100)	Sí	Apellido
nickname	VARCHAR(50)	Sí	Nombre público único
email	VARCHAR(254)	Sí	Correo único e inmutable
passwordHash	TEXT	Sí	Hash de contraseña
role	UserRole	Sí	Rol actual
status	UserStatus	Sí	Estado funcional
emailVerifiedAt	TIMESTAMPTZ	No	Fecha de confirmación
approvedAt	TIMESTAMPTZ	No	Fecha de aprobación
approvedById	UUID	No	Administrador que aprobó
rejectedAt	TIMESTAMPTZ	No	Fecha de rechazo
rejectedById	UUID	No	Administrador que rechazó
rejectionReason	VARCHAR(500)	No	Motivo opcional
blockedAt	TIMESTAMPTZ	No	Fecha de bloqueo
blockedById	UUID	No	Administrador que bloqueó
blockReason	VARCHAR(500)	No	Motivo
favoriteTeamId	UUID	No	Equipo favorito
isTestUser	BOOLEAN	Sí	Identifica datos ficticios
createdAt	TIMESTAMPTZ	Sí	Fecha de creación
updatedAt	TIMESTAMPTZ	Sí	Última actualización
deletedAt	TIMESTAMPTZ	No	Soft delete
Restricciones
email único, normalizado en minúsculas.
nickname único sin considerar mayúsculas.
passwordHash nunca puede ser vacío.
SUPER_ADMIN debe estar controlado por lógica y restricciones adicionales.
El correo no debe modificarse después de la creación.
favoriteTeamId puede ser nulo si el equipo fue retirado o durante migraciones.
Índices
UNIQUE lower(email)
UNIQUE lower(nickname)
INDEX status
INDEX role
INDEX favoriteTeamId
INDEX createdAt
Consideración de superadministrador

Se recomienda permitir un único superadministrador activo.

Puede implementarse mediante:

Índice único parcial.
Validación transaccional.
Tabla separada de propiedad del sistema.

Ejemplo conceptual PostgreSQL:

CREATE UNIQUE INDEX one_active_super_admin
ON "User" ((role))
WHERE role = 'SUPER_ADMIN'
AND "deletedAt" IS NULL;

La compatibilidad con Prisma deberá validarse.

6. Tabla UserRoleHistory

Registra cambios de rol.

Campo	Tipo	Requerido
id	UUID	Sí
userId	UUID	Sí
previousRole	UserRole	Sí
newRole	UserRole	Sí
changedById	UUID	Sí
reason	VARCHAR(500)	No
createdAt	TIMESTAMPTZ	Sí
Reglas
Solo inserción.
Todo cambio de rol debe crear un registro.
No guardar cambios redundantes.
No permitir que un administrador común promueva usuarios.
7. Tabla Session

Representa sesiones activas.

Campo	Tipo	Requerido
id	UUID	Sí
userId	UUID	Sí
tokenHash	VARCHAR(255)	Sí
createdAt	TIMESTAMPTZ	Sí
expiresAt	TIMESTAMPTZ	Sí
lastUsedAt	TIMESTAMPTZ	Sí
revokedAt	TIMESTAMPTZ	No
ipAddress	VARCHAR(64)	No
userAgent	VARCHAR(500)	No
Reglas
El token real nunca se almacena.
tokenHash debe ser único.
Sesiones expiradas o revocadas no son válidas.
Al cambiar contraseña podrán revocarse todas las sesiones.
Índices
UNIQUE tokenHash
INDEX userId
INDEX expiresAt
INDEX revokedAt
8. Tabla EmailVerificationToken
Campo	Tipo	Requerido
id	UUID	Sí
userId	UUID	Sí
tokenHash	VARCHAR(255)	Sí
expiresAt	TIMESTAMPTZ	Sí
usedAt	TIMESTAMPTZ	No
createdAt	TIMESTAMPTZ	Sí
Reglas
Token de un solo uso.
Token almacenado como hash.
No válido si está expirado.
No válido si usedAt tiene valor.
Al emitir uno nuevo podrán invalidarse los anteriores.
9. Tabla PasswordResetToken
Campo	Tipo	Requerido
id	UUID	Sí
userId	UUID	Sí
tokenHash	VARCHAR(255)	Sí
expiresAt	TIMESTAMPTZ	Sí
usedAt	TIMESTAMPTZ	No
requestedIp	VARCHAR(64)	No
createdAt	TIMESTAMPTZ	Sí
Reglas
Un solo uso.
Expiración corta.
Al usarlo, revocar sesiones existentes.
No almacenar el token en texto plano.
10. Tabla Team

Representa los equipos de la liga.

Campo	Tipo	Requerido
id	UUID	Sí
name	VARCHAR(120)	Sí
shortName	VARCHAR(30)	Sí
slug	VARCHAR(120)	Sí
logoPath	VARCHAR(500)	No
displayOrder	INTEGER	Sí
isActive	BOOLEAN	Sí
createdAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
deletedAt	TIMESTAMPTZ	No
Restricciones
name único.
slug único.
displayOrder >= 0.
Equipos inactivos siguen visibles en históricos.
Índices
UNIQUE name
UNIQUE slug
INDEX isActive
INDEX displayOrder
11. Tabla Season
Campo	Tipo	Requerido
id	UUID	Sí
name	VARCHAR(100)	Sí
slug	VARCHAR(120)	Sí
status	SeasonStatus	Sí
startsAt	TIMESTAMPTZ	No
endsAt	TIMESTAMPTZ	No
closedAt	TIMESTAMPTZ	No
closedById	UUID	No
exactPoints	INTEGER	Sí
partialPoints	INTEGER	Sí
wrongPoints	INTEGER	Sí
doubleMultiplier	INTEGER	Sí
predictionCloseMinutes	INTEGER	Sí
maxPredictionGoals	INTEGER	Sí
createdAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
archivedAt	TIMESTAMPTZ	No
Reglas iniciales
exactPoints = 3
partialPoints = 1
wrongPoints = 0
doubleMultiplier = 2
predictionCloseMinutes = 5
maxPredictionGoals = valor configurable
Restricciones
Solo una temporada activa.
Puntos no negativos.
Multiplicador mínimo 1.
Minutos de cierre no negativos.
Nombre y slug únicos.
Índice único parcial sugerido
CREATE UNIQUE INDEX one_active_season
ON "Season" ((status))
WHERE status = 'ACTIVE';
12. Tabla Round

Representa jornadas o fases.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
name	VARCHAR(120)	Sí
slug	VARCHAR(150)	Sí
sequence	INTEGER	No
status	RoundStatus	Sí
description	VARCHAR(500)	No
publishedAt	TIMESTAMPTZ	No
createdAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
archivedAt	TIMESTAMPTZ	No
Reglas
sequence sirve para presentación, no para cronología.
El orden temporal de partidos depende de scheduledAt.
El nombre puede ser Jornada 5, Semifinal Ida, etc.
Una jornada puede existir sin todos sus partidos.
Restricciones
UNIQUE seasonId + slug
INDEX seasonId
INDEX status
INDEX sequence
13. Tabla Match

Representa un partido.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
roundId	UUID	Sí
homeTeamId	UUID	Sí
awayTeamId	UUID	Sí
scheduledAt	TIMESTAMPTZ	Sí
originalScheduledAt	TIMESTAMPTZ	No
predictionClosesAt	TIMESTAMPTZ	Sí
status	MatchStatus	Sí
isDoublePoints	BOOLEAN	Sí
venue	VARCHAR(200)	No
notes	TEXT	No
officialHomeGoals	INTEGER	No
officialAwayGoals	INTEGER	No
processedAt	TIMESTAMPTZ	No
processedById	UUID	No
resultVersion	INTEGER	Sí
processingStartedAt	TIMESTAMPTZ	No
processingStartedById	UUID	No
createdAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
archivedAt	TIMESTAMPTZ	No
Reglas
Local y visitante deben ser diferentes.
predictionClosesAt se calcula al crear o reprogramar.
El cierre no debe calcularse en cada consulta si puede persistirse de manera confiable.
Los goles oficiales solo existen cuando el partido está procesado o finalizado pendiente.
resultVersion aumenta cuando se corrige un resultado.
isDoublePoints debe ser único por jornada.
Restricciones
CHECK homeTeamId <> awayTeamId
CHECK officialHomeGoals >= 0
CHECK officialAwayGoals >= 0
CHECK resultVersion >= 1
Partido doble único por jornada

Índice único parcial sugerido:

CREATE UNIQUE INDEX one_double_match_per_round
ON "Match" ("roundId")
WHERE "isDoublePoints" = true
AND "archivedAt" IS NULL
AND status <> 'CANCELLED';
Índices
INDEX seasonId
INDEX roundId
INDEX scheduledAt
INDEX predictionClosesAt
INDEX status
INDEX homeTeamId
INDEX awayTeamId
INDEX processedAt
Nota crítica

No debe existir ninguna restricción que obligue a que:

Round.sequence

coincida con el orden de:

Match.scheduledAt
14. Tabla MatchScheduleHistory

Registra reprogramaciones.

Campo	Tipo	Requerido
id	UUID	Sí
matchId	UUID	Sí
previousScheduledAt	TIMESTAMPTZ	Sí
newScheduledAt	TIMESTAMPTZ	Sí
previousClosesAt	TIMESTAMPTZ	Sí
newClosesAt	TIMESTAMPTZ	Sí
reason	VARCHAR(500)	No
changedById	UUID	Sí
createdAt	TIMESTAMPTZ	Sí
Reglas
Solo inserción.
Cada reprogramación genera un registro.
No modificar históricos.
Debe conservarse aunque el partido sea cancelado.
15. Tabla MatchStatusHistory

Registra transiciones de estado.

Campo	Tipo	Requerido
id	UUID	Sí
matchId	UUID	Sí
previousStatus	MatchStatus	No
newStatus	MatchStatus	Sí
reason	VARCHAR(500)	No
changedById	UUID	No
createdAt	TIMESTAMPTZ	Sí
Uso

Permitirá conocer:

Cuándo fue suspendido.
Cuándo fue reanudado.
Quién lo canceló.
Cuándo fue procesado.
Qué estado tenía antes.
16. Tabla Prediction

Representa el pronóstico de un usuario.

Campo	Tipo	Requerido
id	UUID	Sí
userId	UUID	Sí
matchId	UUID	Sí
homeGoals	INTEGER	Sí
awayGoals	INTEGER	Sí
submittedAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
lockedAt	TIMESTAMPTZ	No
source	VARCHAR(30)	No
isTestData	BOOLEAN	Sí
deletedAt	TIMESTAMPTZ	No
Restricciones
Un pronóstico por usuario y partido.
Goles no negativos.
Respetar máximo de goles en servicio.
No actualizar después del cierre.
deletedAt solo para procesos excepcionales.
Índices
UNIQUE userId + matchId
INDEX matchId
INDEX userId
INDEX submittedAt
Importante

La restricción de tiempo no puede implementarse únicamente en base de datos con un CHECK, porque depende de la hora actual.

Debe validarse en servicio dentro de una operación segura.

17. Tabla UserMatchScore

Almacena el resultado calculado de un pronóstico.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
userId	UUID	Sí
matchId	UUID	Sí
predictionId	UUID	No
scoreType	PredictionScoreType	Sí
basePoints	INTEGER	Sí
multiplier	INTEGER	Sí
awardedPoints	INTEGER	Sí
resultVersion	INTEGER	Sí
calculatedAt	TIMESTAMPTZ	Sí
calculatedById	UUID	No
Reglas
Existe incluso para usuarios sin pronóstico si se decide materializar NO_PREDICTION.
Alternativamente, NO_PREDICTION puede derivarse.
Se recomienda materializarlo para auditoría y recalculo verificable.
Debe ser único por usuario, partido y versión de resultado.
Restricciones
CHECK basePoints >= 0
CHECK multiplier >= 1
CHECK awardedPoints = basePoints * multiplier
UNIQUE userId + matchId + resultVersion
Índices
INDEX seasonId
INDEX matchId
INDEX userId
INDEX scoreType
18. Tabla Standing

Resumen actual de clasificación.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
userId	UUID	Sí
position	INTEGER	Sí
previousPosition	INTEGER	No
totalPoints	INTEGER	Sí
exactCount	INTEGER	Sí
partialCount	INTEGER	Sí
wrongCount	INTEGER	Sí
noPredictionCount	INTEGER	Sí
matchesScored	INTEGER	Sí
recalculatedAt	TIMESTAMPTZ	Sí
version	INTEGER	Sí
Restricciones
UNIQUE seasonId + userId
CHECK position > 0
CHECK totalPoints >= 0
CHECK exactCount >= 0
CHECK partialCount >= 0
Nota

Esta tabla es un resumen.

No es la única fuente de verdad.

Debe poder reconstruirse desde UserMatchScore.

19. Tabla StandingSnapshot

Conserva movimientos de clasificación.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
userId	UUID	Sí
triggerMatchId	UUID	No
position	INTEGER	Sí
totalPoints	INTEGER	Sí
exactCount	INTEGER	Sí
partialCount	INTEGER	Sí
snapshotVersion	INTEGER	Sí
createdAt	TIMESTAMPTZ	Sí
Uso

Permite:

Mostrar subida o bajada.
Comparar antes y después de un procesamiento.
Mantener trazabilidad de la clasificación.
Índices
INDEX seasonId + createdAt
INDEX userId + createdAt
INDEX triggerMatchId
20. Tabla SeasonArchive

Conserva el cierre final de temporada.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
seasonName	VARCHAR(100)	Sí
closedAt	TIMESTAMPTZ	Sí
closedById	UUID	Sí
finalTableJson	JSONB	Sí
championsJson	JSONB	Sí
participantCount	INTEGER	Sí
createdAt	TIMESTAMPTZ	Sí
Reglas
Una temporada cerrada debe tener un archivo final.
finalTableJson es una instantánea histórica.
No sustituye a los datos normalizados.
No debe modificarse después de crearse.
21. Tabla Notification
Campo	Tipo	Requerido
id	UUID	Sí
userId	UUID	Sí
type	NotificationType	Sí
title	VARCHAR(150)	Sí
message	VARCHAR(1000)	Sí
link	VARCHAR(500)	No
readAt	TIMESTAMPTZ	No
expiresAt	TIMESTAMPTZ	No
createdAt	TIMESTAMPTZ	Sí
Índices
INDEX userId + readAt
INDEX userId + createdAt
INDEX expiresAt
22. Tabla Sponsor
Campo	Tipo	Requerido
id	UUID	Sí
name	VARCHAR(150)	Sí
imagePath	VARCHAR(500)	No
targetUrl	VARCHAR(500)	No
isActive	BOOLEAN	Sí
displayOrder	INTEGER	Sí
startsAt	TIMESTAMPTZ	No
endsAt	TIMESTAMPTZ	No
createdAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
deletedAt	TIMESTAMPTZ	No
Reglas
El enlace debe validarse.
La ausencia de imagen no debe romper la aplicación.
Los patrocinadores inactivos no se muestran.
23. Tabla SponsorPlacement

Permite ubicar patrocinadores en diferentes áreas.

Campo	Tipo	Requerido
id	UUID	Sí
sponsorId	UUID	Sí
placement	SponsorPlacementType	Sí
displayOrder	INTEGER	Sí
isActive	BOOLEAN	Sí
createdAt	TIMESTAMPTZ	Sí
Restricción
UNIQUE sponsorId + placement
24. Tabla SystemSetting

Configuración editable no sensible.

Campo	Tipo	Requerido
id	UUID	Sí
key	VARCHAR(150)	Sí
valueJson	JSONB	Sí
description	VARCHAR(500)	No
isPublic	BOOLEAN	Sí
updatedById	UUID	No
createdAt	TIMESTAMPTZ	Sí
updatedAt	TIMESTAMPTZ	Sí
Ejemplos de claves
application.name
application.logoPath
application.maintenanceMode
application.howItWorks
application.socialLinks
diagnostics.enabled
No almacenar
Contraseñas SMTP.
Secretos de sesión.
Tokens.
Credenciales de base de datos.
25. Tabla AuditLog

Representa la auditoría funcional.

Campo	Tipo	Requerido
id	UUID	Sí
actorUserId	UUID	No
actorRole	UserRole	No
action	AuditAction	Sí
entityType	AuditEntityType	Sí
entityId	UUID	No
beforeJson	JSONB	No
afterJson	JSONB	No
metadataJson	JSONB	No
ipAddress	VARCHAR(64)	No
userAgent	VARCHAR(500)	No
requestId	VARCHAR(100)	No
createdAt	TIMESTAMPTZ	Sí
Reglas
Solo inserción.
No guardar contraseñas.
No guardar tokens.
No guardar secretos.
Enmascarar valores sensibles.
Debe registrar acciones automáticas con actor nulo o sistema.
Índices
INDEX actorUserId
INDEX action
INDEX entityType + entityId
INDEX createdAt
INDEX requestId
Protección

La cuenta de aplicación no debería tener permisos para:

UPDATE AuditLog
DELETE AuditLog

si la estrategia de despliegue permite separar permisos.

26. Tabla ApplicationErrorLog

Registro técnico opcional en base de datos.

Campo	Tipo	Requerido
id	UUID	Sí
errorCode	VARCHAR(100)	Sí
message	VARCHAR(1000)	Sí
stackTrace	TEXT	No
requestId	VARCHAR(100)	No
userId	UUID	No
route	VARCHAR(500)	No
metadataJson	JSONB	No
createdAt	TIMESTAMPTZ	Sí
Consideraciones
No guardar secretos.
No mostrar esta información a usuarios normales.
Aplicar política de retención.
Puede omitirse si el hosting ofrece logs suficientes.
27. Tabla DataExport

Registra exportaciones.

Campo	Tipo	Requerido
id	UUID	Sí
requestedById	UUID	Sí
exportType	VARCHAR(100)	Sí
format	VARCHAR(20)	Sí
status	VARCHAR(30)	Sí
rowCount	INTEGER	No
filePath	VARCHAR(500)	No
expiresAt	TIMESTAMPTZ	No
createdAt	TIMESTAMPTZ	Sí
completedAt	TIMESTAMPTZ	No
Reglas
No contener credenciales.
Los archivos temporales deben expirar.
Registrar exportación en auditoría.
28. Tabla IntegrityCheckRun

Registra verificaciones de integridad.

Campo	Tipo	Requerido
id	UUID	Sí
executedById	UUID	Sí
status	VARCHAR(30)	Sí
summaryJson	JSONB	Sí
startedAt	TIMESTAMPTZ	Sí
completedAt	TIMESTAMPTZ	No
Ejemplos de verificaciones
Pronósticos duplicados.
Partidos sin jornada.
Equipos iguales en un partido.
Jornadas sin partido doble.
Más de un partido doble.
Puntuaciones inconsistentes.
Clasificación inconsistente.
Usuarios sin estado válido.
Temporadas activas duplicadas.
29. Tabla RecalculationRun

Registra recalculos.

Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
executedById	UUID	Sí
status	VARCHAR(30)	Sí
startedAt	TIMESTAMPTZ	Sí
completedAt	TIMESTAMPTZ	No
matchesProcessed	INTEGER	Sí
usersProcessed	INTEGER	Sí
summaryJson	JSONB	No
errorMessage	VARCHAR(1000)	No
Reglas
Solo una ejecución activa por temporada.
Registrar éxito o fallo.
No modificar ejecuciones pasadas.
30. Tabla TestDataBatch

Identifica lotes de datos ficticios.

Campo	Tipo	Requerido
id	UUID	Sí
createdById	UUID	Sí
label	VARCHAR(150)	Sí
environment	VARCHAR(30)	Sí
summaryJson	JSONB	Sí
createdAt	TIMESTAMPTZ	Sí
cleanedAt	TIMESTAMPTZ	No
cleanedById	UUID	No
Uso

Permite eliminar de manera segura únicamente los datos creados durante una simulación.

31. Relaciones principales
User → Team

Un usuario puede elegir un equipo favorito.

Un equipo puede ser favorito de muchos usuarios.

Season → Round

Una temporada tiene muchas jornadas.

Una jornada pertenece a una temporada.

Round → Match

Una jornada tiene muchos partidos.

Un partido pertenece a una jornada.

Match → Team

Un partido tiene:

Un equipo local.
Un equipo visitante.
User → Prediction → Match

Un usuario puede tener un pronóstico por partido.

Prediction → UserMatchScore

Un pronóstico puede producir una puntuación.

Season → Standing

Cada usuario participante tendrá un resumen de clasificación por temporada.

32. Integridad del partido doble

Debe existir exactamente un partido doble por jornada publicada.

La restricción de base de datos garantiza como máximo uno.

La lógica de aplicación debe garantizar al menos uno antes de publicar o completar la jornada.

Por tanto:

Base de datos: impide más de uno.
Servicio: impide publicar sin uno.
33. Usuarios participantes de una temporada

Se debe decidir cómo identificar quién participa en cada temporada.

Opción recomendada: SeasonParticipant

Crear una tabla explícita.

34. Tabla SeasonParticipant
Campo	Tipo	Requerido
id	UUID	Sí
seasonId	UUID	Sí
userId	UUID	Sí
joinedAt	TIMESTAMPTZ	Sí
isEligible	BOOLEAN	Sí
excludedAt	TIMESTAMPTZ	No
excludedById	UUID	No
exclusionReason	VARCHAR(500)	No
isTestData	BOOLEAN	Sí
Restricción
UNIQUE seasonId + userId
Beneficios
Permite saber quién compite.
Evita que usuarios nuevos alteren históricos.
Permite excluir usuarios sin borrar datos.
Permite generar NO_PREDICTION.
Facilita el cierre de temporada.
Regla inicial

Al aprobar un usuario durante una temporada activa, podrá agregarse automáticamente como participante.

La política exacta deberá documentarse en reglas de negocio.

35. Tabla LoginAttempt

Apoya protección contra fuerza bruta.

Campo	Tipo	Requerido
id	UUID	Sí
emailHash	VARCHAR(255)	Sí
ipAddress	VARCHAR(64)	No
success	BOOLEAN	Sí
failureReason	VARCHAR(50)	No
createdAt	TIMESTAMPTZ	Sí
Consideraciones
No guardar el correo en texto plano si no es necesario.
Aplicar retención corta.
Indexar por fecha e IP.
Puede sustituirse por una solución en memoria si el hosting lo permite gratuitamente.
36. Restricciones críticas

La base debe garantizar:

Email único
Nickname único
Un pronóstico por usuario y partido
Un participante por usuario y temporada
Un resumen de clasificación por usuario y temporada
Equipos distintos en un partido
Goles no negativos
Máximo un partido doble por jornada
Máximo una temporada activa
Máximo un superadministrador activo
Tokens únicos
Sesiones únicas
37. Borrado y comportamiento referencial
Usuarios

No borrar físicamente si tienen:

Pronósticos.
Auditorías.
Puntuaciones.
Participaciones.

Usar desactivación.

Equipos

No borrar si aparecen en partidos.

Usar isActive = false.

Temporadas

No borrar si contienen jornadas.

Usar archivado.

Jornadas

No borrar si contienen partidos.

Usar archivado.

Partidos

No borrar si tienen pronósticos.

Usar cancelación o archivado.

Pronósticos

No borrar en operaciones normales.

38. Estrategia ON DELETE

Relaciones históricas deben utilizar preferentemente:

RESTRICT
SET NULL

Evitar:

CASCADE

en datos críticos.

Ejemplos:

Usuario eliminado lógicamente: no afecta pronósticos.
Equipo: RESTRICT si tiene partidos.
Temporada: RESTRICT.
Jornada: RESTRICT.
Partido: RESTRICT.
Tokens temporales: CASCADE puede ser aceptable al eliminar físicamente un usuario durante pruebas.
39. Índices recomendados
Pronósticos
(userId, matchId) UNIQUE
(matchId)
(userId)
Partidos
(seasonId, scheduledAt)
(roundId)
(status, scheduledAt)
(predictionClosesAt)
Puntuaciones
(seasonId, userId)
(matchId)
(userId, matchId)
Clasificación
(seasonId, position)
(seasonId, totalPoints, exactCount)
Auditoría
(createdAt)
(actorUserId, createdAt)
(entityType, entityId)
(action, createdAt)
Notificaciones
(userId, readAt, createdAt)
40. Normalización

El modelo seguirá una estructura mayormente normalizada.

Se permite desnormalización controlada en:

Standing.
SeasonArchive.
AuditLog.
IntegrityCheckRun.
RecalculationRun.

La desnormalización se acepta cuando:

Mejora la consulta.
Conserva una instantánea.
Permite auditoría.
Puede reconstruirse o validarse.
41. Versionado de resultados

Si un resultado procesado cambia:

Se incrementa Match.resultVersion.
Se conservan o reemplazan puntuaciones según estrategia.
Se registra auditoría.
Se crea una nueva clasificación.
Se conserva trazabilidad.
Estrategia recomendada

Mantener puntuaciones por versión.

Ejemplo:

resultVersion = 1
resultVersion = 2

La clasificación utiliza únicamente la versión activa del partido.

Esto facilita auditar correcciones.

42. Consistencia de clasificación

La suma de puntos en Standing.totalPoints debe coincidir con:

SUM(UserMatchScore.awardedPoints)

para la versión activa de cada resultado.

El verificador de integridad deberá revisar esta condición.

43. Prisma schema conceptual

Ejemplo parcial:

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  PENDING_EMAIL_CONFIRMATION
  PENDING_APPROVAL
  APPROVED
  REJECTED
  BLOCKED
  DISABLED
}

model User {
  id              String      @id @default(uuid()) @db.Uuid
  firstName       String      @db.VarChar(100)
  lastName        String      @db.VarChar(100)
  nickname        String      @unique @db.VarChar(50)
  email           String      @unique @db.VarChar(254)
  passwordHash    String
  role            UserRole    @default(USER)
  status          UserStatus  @default(PENDING_EMAIL_CONFIRMATION)
  emailVerifiedAt DateTime?    @db.Timestamptz(6)
  favoriteTeamId  String?      @db.Uuid
  isTestUser      Boolean      @default(false)
  createdAt       DateTime     @default(now()) @db.Timestamptz(6)
  updatedAt       DateTime     @updatedAt @db.Timestamptz(6)
  deletedAt       DateTime?    @db.Timestamptz(6)

  favoriteTeam    Team?        @relation(fields: [favoriteTeamId], references: [id])
  predictions     Prediction[]
  sessions        Session[]
  standings       Standing[]
}

El esquema final deberá incluir nombres de relaciones explícitos cuando existan varias relaciones entre las mismas tablas.

44. Migraciones

Toda modificación del modelo deberá incluir:

Migración Prisma.
Revisión SQL.
Prueba en base temporal.
Estrategia de rollback.
Respaldo para cambios destructivos.
Actualización de este documento.

No editar migraciones ya aplicadas en producción.

45. Seeds

El seed inicial deberá crear:

Configuración base.
Valores de puntuación.
Doce equipos.
Textos iniciales.
Tipos o catálogos necesarios.

No deberá crear:

Superadministrador conocido.
Contraseñas por defecto.
Usuarios reales.
Tokens predecibles.
46. Datos sensibles

Nunca almacenar en tablas editables:

Contraseña SMTP.
SESSION_SECRET.
Claves privadas.
Tokens de proveedores.
Contraseñas en texto plano.
Tokens de confirmación en texto plano.

Estos valores pertenecen a variables de entorno.

47. Retención
Tokens

Pueden eliminarse físicamente después de:

Expirar.
Usarse.
Superar el periodo de retención.
Sesiones

Pueden eliminarse después de expirar y cumplir el periodo de auditoría.

Intentos de login

Retención corta.

Auditoría

Retención larga o permanente para la vida útil del proyecto.

Logs técnicos

Retención limitada según espacio disponible.

48. Consultas administrativas seguras

Ejemplos útiles:

Usuarios pendientes
SELECT
  id,
  "firstName",
  "lastName",
  nickname,
  email,
  "createdAt"
FROM "User"
WHERE status = 'PENDING_APPROVAL'
ORDER BY "createdAt";
Partidos cerrados no procesados
SELECT
  m.id,
  r.name AS round_name,
  ht.name AS home_team,
  at.name AS away_team,
  m."scheduledAt"
FROM "Match" m
JOIN "Round" r ON r.id = m."roundId"
JOIN "Team" ht ON ht.id = m."homeTeamId"
JOIN "Team" at ON at.id = m."awayTeamId"
WHERE m.status IN ('CLOSED', 'FINISHED_PENDING')
ORDER BY m."scheduledAt";
Validar doble por jornada
SELECT
  r.id,
  r.name,
  COUNT(m.id) FILTER (WHERE m."isDoublePoints" = true) AS double_count
FROM "Round" r
LEFT JOIN "Match" m
  ON m."roundId" = r.id
  AND m."archivedAt" IS NULL
  AND m.status <> 'CANCELLED'
GROUP BY r.id, r.name
HAVING COUNT(m.id) FILTER (WHERE m."isDoublePoints" = true) <> 1;
Comparar puntos
SELECT
  s."userId",
  s."totalPoints",
  COALESCE(SUM(ums."awardedPoints"), 0) AS calculated_points
FROM "Standing" s
LEFT JOIN "UserMatchScore" ums
  ON ums."seasonId" = s."seasonId"
  AND ums."userId" = s."userId"
WHERE s."seasonId" = :season_id
GROUP BY s."userId", s."totalPoints"
HAVING s."totalPoints" <> COALESCE(SUM(ums."awardedPoints"), 0);
49. Verificaciones de integridad

El sistema deberá detectar:

Más de una temporada activa.
Más de un superadministrador.
Jornadas publicadas sin partido doble.
Jornadas con más de un partido doble.
Partidos con equipos iguales.
Pronósticos duplicados.
Puntuaciones duplicadas.
Partidos procesados sin resultado.
Partidos no procesados con puntuaciones.
Clasificación inconsistente.
Usuarios aprobados sin correo confirmado.
Tokens usados múltiples veces.
Partidos con cierre posterior al inicio.
Usuarios participantes sin Standing.
Standing de usuarios no participantes.
50. Criterios de aceptación

El modelo será aceptado cuando:

Soporte todos los flujos funcionales.
Evite duplicados críticos.
Permita recalcular la temporada.
Soporte reprogramaciones.
No dependa del orden de jornadas.
Conserve históricos.
Permita posiciones compartidas.
Soporte múltiples administradores.
Proteja auditorías.
Sea compatible con PostgreSQL y Prisma.
Use transacciones para operaciones críticas.
Evite borrados destructivos.
Permita datos de prueba identificables.
Tenga índices para consultas principales.
51. Decisiones pendientes

Antes de generar el esquema final deberán confirmarse:

UUID generado por Prisma o PostgreSQL.
Implementación de índices parciales.
Estrategia exacta de mayúsculas para email y nickname.
Si NO_PREDICTION se materializa.
Retención exacta de sesiones y tokens.
Máximo de goles permitido.
Política de ingreso de participantes a una temporada activa.
Estrategia final de versionado de puntuación.
Uso o no de tabla de logs técnicos.

Estas decisiones deberán registrarse en:

docs/14-DecisionesArquitectonicas.md
52. Documentos relacionados

Consultar:

docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/04-ReglasNegocio.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
53. Conclusión

El modelo de datos de Kickoff está diseñado para que los resultados sean:

Reproducibles.
Auditables.
Seguros.
Consistentes.
Históricos.
Independientes del orden de las jornadas.

La base de datos deberá impedir inconsistencias estructurales, mientras que los servicios de aplicación reforzarán las reglas dependientes de tiempo, permisos y estados.