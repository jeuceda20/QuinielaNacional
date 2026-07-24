# Bootstrap Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Bootstrap, infraestructura inicial, modelo de datos y dominio base  
**Tareas principales:** TASK-001 a TASK-028  
**Tipo:** Prompt maestro de fase  
**Aplicación:** Ejecutar una sola tarea de esta fase por vez

---

# 1. Propósito

Este prompt define el contexto específico para construir la base técnica de **Quiniela Nacional La Goleada – Kickoff**.

Esta fase establece:

- El repositorio.
- La aplicación Next.js.
- Las convenciones del proyecto.
- La estructura modular.
- La configuración.
- La conexión a PostgreSQL.
- Prisma.
- La infraestructura de pruebas.
- El modelo de datos.
- Las migraciones.
- El seed base.
- Las reglas de dominio puras.
- Los repositorios iniciales.
- El contexto de solicitud.

Esta fase no implementa todavía:

- Registro funcional completo.
- Login.
- Confirmación de correo.
- Pantallas administrativas completas.
- Pronósticos persistentes.
- Procesamiento de resultados.
- Dashboard.
- Deployment de producción.

---

# 2. Uso obligatorio

Este prompt debe utilizarse junto con:

```text
prompts/00-global-context.md
prompts/09-task-template.md
docs/19-IMPLEMENTATION_PLAN.md
```

Formato recomendado:

```text
Lee y aplica:

- prompts/00-global-context.md
- prompts/01-bootstrap.md
- prompts/09-task-template.md

Implementa únicamente TASK-XXX de
docs/19-IMPLEMENTATION_PLAN.md.
```

Nunca solicitar:

```text
Implementa toda la fase bootstrap.
```

La regla es:

```text
Una ejecución = una tarea
```

---

# 3. Tareas cubiertas

Este prompt aplica a:

```text
TASK-001 — Crear repositorio y estructura inicial
TASK-002 — Inicializar Next.js
TASK-003 — Configurar TypeScript estricto
TASK-004 — Configurar formato y convenciones
TASK-005 — Crear estructura modular
TASK-006 — Validación de variables de entorno
TASK-007 — Configurar Prisma
TASK-008 — Configurar PostgreSQL de desarrollo
TASK-009 — Crear infraestructura de testing
TASK-010 — Crear manejo estándar de errores
TASK-011 — Implementar modelos de usuario y autenticación
TASK-012 — Implementar modelos deportivos
TASK-013 — Implementar modelos de pronóstico y puntuación
TASK-014 — Implementar modelos administrativos
TASK-015 — Crear migración inicial
TASK-016 — Crear seed base
TASK-017 — Implementar cálculo de desenlace
TASK-018 — Implementar cálculo de puntuación
TASK-019 — Implementar clasificación
TASK-020 — Implementar tendencia
TASK-021 — Implementar cálculo de cierre
TASK-022 — Implementar máquina de estados de partido
TASK-023 — Implementar políticas de autorización
TASK-024 — Crear repositorio de usuarios
TASK-025 — Crear repositorios deportivos
TASK-026 — Crear repositorios de pronósticos y tabla
TASK-027 — Crear repositorio de auditoría
TASK-028 — Crear contexto de solicitud
```

No aplica a tareas posteriores salvo como referencia técnica.

---

# 4. Objetivo de la fase

Al finalizar esta fase debe existir una base capaz de soportar el resto de la aplicación sin rediseños estructurales.

Resultado esperado:

```text
Proyecto ejecutable
+
Arquitectura modular
+
Configuración validada
+
PostgreSQL conectado
+
Prisma configurado
+
Modelo de datos inicial
+
Migración reproducible
+
Seed seguro
+
Infraestructura de pruebas
+
Dominio deportivo probado
+
Repositorios base
+
Manejo estándar de errores
+
Contexto de solicitud
```

---

# 5. Documentos obligatorios de la fase

Antes de ejecutar una tarea de esta fase, revisar según corresponda:

```text
README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/09-Deployment.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/16-Glosario.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
docs/19-IMPLEMENTATION_PLAN.md
```

No todos deben modificarse.

Solo deben utilizarse como fuente de verdad.

---

# 6. Principios específicos de bootstrap

## 6.1 Construir la base, no el producto completo

Esta fase debe crear infraestructura reutilizable.

No adelantar:

- Formularios de autenticación.
- Servicios completos de registro.
- UI administrativa.
- Procesamiento.
- Dashboard.
- Notificaciones funcionales.
- Exportaciones completas.

---

## 6.2 Evitar código temporal

No crear implementaciones provisionales que luego deban eliminarse.

Ejemplos prohibidos:

```typescript
const currentUser = {
  id: "temporary-user"
};
```

```typescript
const database = [];
```

```typescript
if (process.env.NODE_ENV === "development") {
  return true;
}
```

La base debe ser real, aunque todavía no esté conectada a todos los flujos.

---

## 6.3 Dependencias mínimas

No instalar bibliotecas por conveniencia sin necesidad demostrada.

Antes de agregar una dependencia:

1. Revisar si Next.js ya resuelve el problema.
2. Revisar si Node.js ya incluye la capacidad.
3. Revisar si una dependencia existente la cubre.
4. Confirmar que corresponde a la tarea actual.

No instalar dependencias de fases futuras.

---

## 6.4 Configuración segura desde el inicio

Desde bootstrap deben existir:

- Variables de entorno validadas.
- `.env.example`.
- Separación de ambientes.
- Manejo seguro de errores.
- Protección contra exposición de secretos.
- Scripts claros.
- Base de pruebas separada.

---

# 7. Estructura esperada del repositorio

La estructura exacta puede ajustarse a las convenciones de Next.js, pero debe respetar el diseño modular.

Estructura orientativa:

```text
.
├── docs/
├── prompts/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── modules/
│   │   ├── audit/
│   │   ├── auth/
│   │   ├── diagnostics/
│   │   ├── matches/
│   │   ├── notifications/
│   │   ├── predictions/
│   │   ├── rounds/
│   │   ├── scoring/
│   │   ├── seasons/
│   │   ├── settings/
│   │   ├── standings/
│   │   ├── teams/
│   │   └── users/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
├── tests/
│   ├── e2e/
│   ├── fixtures/
│   ├── integration/
│   ├── unit/
│   └── setup/
├── .env.example
├── eslint.config.*
├── next.config.*
├── package.json
├── playwright.config.*
├── tsconfig.json
└── vitest.config.*
```

No crear carpetas vacías únicamente para aparentar completitud.

Crear una carpeta cuando la tarea la necesite o cuando forme parte de la estructura inicial acordada.

---

# 8. Reglas para TASK-001 a TASK-005

## 8.1 Repositorio

El repositorio inicial debe:

- Estar versionado con Git.
- Incluir documentación.
- Excluir secretos.
- Tener una rama principal estable.
- Tener un `.gitignore` adecuado para Next.js, Node.js, Prisma y archivos de entorno.

No incluir:

```text
.env
.env.local
node_modules
.next
coverage
playwright-report
test-results
```

---

## 8.2 Inicialización de Next.js

Debe utilizar:

```text
Next.js App Router
React
TypeScript
Tailwind CSS
ESLint
src directory
```

No utilizar Pages Router como arquitectura principal.

No agregar un backend Express separado.

---

## 8.3 TypeScript

Activar modo estricto.

La configuración deberá impedir errores silenciosos cuando sea razonable.

Revisar opciones como:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "forceConsistentCasingInFileNames": true
}
```

No activar opciones incompatibles sin revisar su impacto.

Configurar alias claros, por ejemplo:

```text
@/*
```

No crear múltiples sistemas de alias.

---

## 8.4 Formato y lint

Configurar scripts consistentes:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "...",
    "lint": "...",
    "typecheck": "...",
    "format": "...",
    "format:check": "..."
  }
}
```

No deshabilitar reglas importantes globalmente solo para eliminar errores.

Las excepciones deben ser locales y justificadas.

---

## 8.5 Estructura modular

Los módulos deben separar:

```text
domain
application
infrastructure
schemas
ui
```

No todos los módulos necesitan todas las carpetas desde el primer momento.

No colocar toda la lógica en:

```text
src/lib
```

`src/lib` debe reservarse para capacidades transversales, por ejemplo:

- Prisma client.
- Environment.
- Logging.
- Request ID.
- Shared errors.
- Cryptography.
- Date/time infrastructure.

---

# 9. Reglas para TASK-006 — Variables de entorno

Crear un módulo central de configuración.

Objetivo conceptual:

```typescript
const env = validateEnvironment(process.env);
```

No leer `process.env` directamente por toda la aplicación.

Separar variables según disponibilidad:

```text
Server-only
Public
Test
Optional feature flags
```

Variables mínimas previstas:

```text
NODE_ENV
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
ENABLE_DIAGNOSTICS
ENABLE_SQL_CONSOLE
ENABLE_SQL_WRITE
ENABLE_TEST_DATA_TOOLS
```

Solo las variables que realmente deban llegar al navegador pueden usar prefijos públicos.

No marcar secretos como públicos.

La aplicación debe fallar de manera clara y segura si falta una variable crítica.

El error puede mencionar el nombre de la variable faltante, pero nunca su valor.

---

# 10. Reglas para TASK-007 y TASK-008 — Prisma y PostgreSQL

## 10.1 Prisma Client

Crear una única estrategia reutilizable para Prisma Client.

Debe evitar múltiples conexiones durante hot reload en desarrollo.

Ejemplo conceptual:

```typescript
globalThis.prisma ??= new PrismaClient();
```

La implementación exacta debe ser tipada y compatible con el entorno.

No crear una instancia nueva en cada repositorio o solicitud.

---

## 10.2 Conexiones

Utilizar:

```text
DATABASE_URL
```

para ejecución normal.

Utilizar:

```text
DIRECT_DATABASE_URL
```

cuando sea necesario para migraciones o conexión directa, según el proveedor.

No asumir un proveedor específico en el dominio.

---

## 10.3 PostgreSQL local

La documentación de desarrollo debe explicar cómo levantar PostgreSQL.

Puede utilizarse una opción gratuita y local como:

- Instalación nativa.
- Docker Compose.

No convertir Docker en requisito obligatorio si no lo era.

Si se crea `docker-compose.yml`, debe limitarse a desarrollo local y testing.

No incluir contraseñas reales.

---

## 10.4 Prueba de conexión

La prueba debe verificar:

- Conexión.
- Consulta simple.
- Manejo de error sanitizado.

No crear un endpoint público inseguro solo para probar la conexión.

---

# 11. Reglas para TASK-009 — Infraestructura de testing

Configurar:

```text
Vitest
Playwright
Testing Library cuando corresponda
Base de datos de integración separada
SMTP falso
Reloj controlable
```

Scripts recomendados:

```text
test
test:watch
test:unit
test:integration
test:e2e
test:e2e:ui
coverage
```

Usar solo los scripts que aporten valor real.

---

## 11.1 Separación de pruebas

```text
tests/unit
tests/integration
tests/e2e
```

Las pruebas unitarias no deben requerir base de datos.

Las pruebas de integración pueden requerir PostgreSQL de testing.

Las pruebas E2E deben ejecutarse contra una instancia de prueba.

---

## 11.2 Entorno de pruebas

Usar variables separadas.

Ejemplo:

```text
DATABASE_URL_TEST
```

o una estrategia equivalente documentada.

No permitir que una prueba se conecte accidentalmente a una base cuyo entorno sea producción.

Agregar una comprobación defensiva.

Ejemplo conceptual:

```typescript
assertTestDatabaseUrl(databaseUrl);
```

---

## 11.3 Datos de prueba

Usar:

```text
@example.invalid
```

No utilizar correos reales.

Los fixtures deben ser:

- Repetibles.
- Pequeños.
- Claros.
- Deterministas.

---

## 11.4 Reloj

Crear una abstracción de reloj cuando la lógica de negocio lo requiera.

Ejemplo conceptual:

```typescript
interface Clock {
  now(): Date;
}
```

Implementaciones posibles:

```text
SystemClock
FixedClock
```

No utilizar `new Date()` directamente en reglas críticas si impide pruebas deterministas.

---

# 12. Reglas para TASK-010 — Manejo de errores

Crear una jerarquía pequeña y práctica.

Ejemplo conceptual:

```typescript
class ApplicationError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;
}
```

Categorías posibles:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
RateLimitError
InfrastructureError
```

No crear una clase distinta para cada mensaje de error si no aporta valor.

Los errores deben poder mapearse a:

- Server Actions.
- Route Handlers.
- Logs.
- Auditoría.
- UI.

---

## 12.1 Códigos de error

Usar códigos estables:

```text
USER_NOT_FOUND
EMAIL_ALREADY_EXISTS
PREDICTION_CLOSED
MATCH_ALREADY_PROCESSED
FORBIDDEN
INVALID_INPUT
```

No usar el texto visible como identificador técnico.

---

## 12.2 Sanitización

Errores de infraestructura como Prisma o SMTP no deben exponerse directamente.

Transformar:

```text
Prisma error interno
```

en:

```text
DATABASE_OPERATION_FAILED
```

Manteniendo detalle técnico solo en logs seguros.

---

# 13. Reglas generales del modelo de datos

El modelo debe seguir `docs/03-ModeloBaseDatos.md`.

No cambiar nombres, relaciones o cardinalidades sin revisar ese documento.

Principios:

- UUID como identificador principal.
- Fechas en UTC.
- Enums explícitos.
- Índices según consultas previstas.
- Restricciones únicas en base.
- Soft delete cuando corresponda.
- Auditoría append-only.
- Historial preservado.
- Relaciones con nombres claros.

---

# 14. Reglas para TASK-011 — Usuarios y autenticación

Entidades previstas:

```text
User
Session
EmailVerificationToken
PasswordResetToken
RoleHistory
```

## 14.1 User

Debe soportar como mínimo:

- ID UUID.
- Nombre.
- Apellido.
- Nickname.
- Nickname normalizado.
- Correo.
- Correo normalizado.
- Password hash.
- Equipo favorito.
- Rol.
- Estado.
- Confirmación de correo.
- Fechas.
- Soft delete.

No guardar confirmación de contraseña.

No guardar contraseña en texto plano.

---

## 14.2 Unicidad

La base debe garantizar unicidad de:

```text
normalizedEmail
normalizedNickname
```

No depender únicamente de una consulta previa.

La consulta previa puede mejorar el mensaje, pero la restricción de base es obligatoria.

---

## 14.3 Session

Debe permitir:

- Token hash.
- Usuario.
- Expiración.
- Revocación.
- Fecha de creación.
- Información mínima del dispositivo cuando se defina.

No guardar token plano si el diseño establece hash.

---

## 14.4 Tokens

EmailVerificationToken y PasswordResetToken deben soportar:

- Token hash.
- Expiración.
- Consumo.
- Usuario.
- Fecha de creación.

No deben poder reutilizarse.

---

## 14.5 RoleHistory

Debe conservar:

- Usuario afectado.
- Rol anterior.
- Rol nuevo.
- Actor.
- Motivo cuando aplique.
- Fecha.

No reemplaza AuditLog.

---

# 15. Reglas para TASK-012 — Modelo deportivo

Entidades previstas:

```text
Team
Season
SeasonParticipant
Round
Match
MatchScheduleHistory
```

---

## 15.1 Team

Debe soportar:

- Nombre.
- Código o slug único.
- Logo.
- Estado activo.
- Fechas.

El equipo favorito del usuario debe referenciar Team.

No almacenar el nombre del equipo duplicado en User.

---

## 15.2 Season

Debe soportar:

- Nombre.
- Estado.
- Fecha de inicio.
- Fecha de finalización opcional.
- Reglas configurables permitidas.
- Activación.
- Cierre.
- Soft delete cuando corresponda.

Debe existir protección para que solo una temporada esté activa cuando esa sea la regla oficial.

---

## 15.3 SeasonParticipant

Debe soportar:

- Temporada.
- Usuario.
- Fecha de incorporación.
- Estado.
- Datos necesarios para participación.

Debe existir una restricción única:

```text
seasonId + userId
```

Los usuarios incorporados tarde comienzan desde cero.

No calcular puntos retroactivos automáticamente.

---

## 15.4 Round

Debe soportar:

- Temporada.
- Nombre.
- Secuencia lógica.
- Estado.
- Publicación.
- Soft delete.

La secuencia no debe utilizarse como autoridad cronológica.

---

## 15.5 Match

Debe soportar:

- Jornada.
- Equipo local.
- Equipo visitante.
- Fecha programada.
- Fecha de cierre.
- Estado.
- Indicador de partido doble.
- Fechas de procesamiento.
- Soft delete.
- Versionado o control de concurrencia cuando corresponda.

No permitir que el mismo equipo sea local y visitante.

---

## 15.6 MatchScheduleHistory

Debe conservar:

- Partido.
- Fecha anterior.
- Fecha nueva.
- Cierre anterior.
- Cierre nuevo.
- Motivo.
- Actor.
- Fecha del cambio.

El historial no debe editarse desde flujos normales.

---

# 16. Reglas para TASK-013 — Pronósticos y puntuación

Entidades previstas:

```text
Prediction
MatchResult
PredictionScore
Standing
StandingSnapshot
```

---

## 16.1 Prediction

Debe soportar:

- Usuario.
- Partido.
- Goles locales.
- Goles visitantes.
- Fecha de creación.
- Fecha de actualización.

Restricción única:

```text
userId + matchId
```

Los valores de goles deben ser enteros no negativos.

Un marcador 0-0 es válido.

---

## 16.2 MatchResult

Debe soportar:

- Partido.
- Goles oficiales.
- Versión.
- Estado vigente.
- Actor.
- Motivo de corrección cuando aplique.
- Fecha.

No sobrescribir silenciosamente el resultado anterior.

---

## 16.3 PredictionScore

Debe soportar:

- Pronóstico.
- Resultado utilizado.
- Tipo de acierto.
- Puntos base.
- Multiplicador.
- Puntos otorgados.
- Fecha de cálculo.

La persistencia no define las reglas.

Las reglas pertenecen al dominio.

---

## 16.4 Standing

Debe soportar:

- Temporada.
- Usuario.
- Posición.
- Exactos.
- Parciales.
- Puntos.
- Tendencia.
- Fecha de actualización.

Standing es una proyección derivada.

No es la fuente de verdad.

---

## 16.5 StandingSnapshot

Debe permitir comparar cambios en la clasificación.

Debe conservar como mínimo:

- Temporada.
- Momento o evento.
- Usuario.
- Posición.
- Exactos.
- Parciales.
- Puntos.
- Fecha.

---

# 17. Reglas para TASK-014 — Modelos administrativos

Entidades previstas:

```text
AuditLog
Notification
Sponsor
ApplicationSetting
OperationalLock
DiagnosticRun
ExportRun
```

---

## 17.1 AuditLog

Append-only.

Debe soportar:

- Actor.
- Acción.
- Tipo de entidad.
- ID de entidad.
- Estado anterior seguro.
- Estado posterior seguro.
- Request ID.
- IP.
- User agent.
- Fecha.

No almacenar secretos.

---

## 17.2 Notification

Debe soportar:

- Usuario.
- Tipo.
- Título.
- Mensaje.
- Estado de lectura.
- Datos seguros opcionales.
- Fecha.

No crear todavía toda la lógica de envío.

---

## 17.3 Sponsor

Debe soportar:

- Nombre.
- Imagen.
- Enlace.
- Orden.
- Estado.
- Soft delete.

Un patrocinador inválido o ausente nunca debe romper la UI.

---

## 17.4 ApplicationSetting

Debe utilizar claves controladas.

No convertirlo en almacenamiento arbitrario de secretos.

Los secretos siguen perteneciendo a variables de entorno.

---

## 17.5 OperationalLock

Debe soportar bloqueos para:

- Procesamiento.
- Recalculo.
- Importación.
- Operaciones críticas.

Debe incluir expiración o recuperación segura cuando corresponda.

---

## 17.6 DiagnosticRun y ExportRun

Deben registrar:

- Tipo.
- Actor.
- Estado.
- Inicio.
- Fin.
- Resumen seguro.
- Error sanitizado.
- Request ID.

No almacenar archivos completos innecesariamente en la base.

---

# 18. Reglas para TASK-015 — Migración inicial

La migración debe:

- Crear todas las entidades aprobadas.
- Crear enums.
- Crear índices.
- Crear restricciones únicas.
- Crear foreign keys.
- Aplicar políticas de borrado correctas.
- Ser reproducible en una base vacía.

Revisar cuidadosamente los `ON DELETE`.

No utilizar cascade indiscriminadamente.

Para datos históricos, preferir:

```text
Restrict
SetNull
Soft delete
```

según el caso.

---

## 18.1 Revisión obligatoria del SQL

Antes de aceptar la migración:

- Revisar nombres.
- Revisar tipos.
- Revisar índices.
- Revisar restricciones.
- Revisar cascadas.
- Revisar defaults.
- Revisar columnas nullable.
- Revisar timestamps.

No aceptar una migración solo porque Prisma la generó.

---

# 19. Reglas para TASK-016 — Seed base

El seed inicial debe crear:

- Equipos base.
- Configuración pública mínima.
- Valores de referencia aprobados.

No debe crear:

- Usuario administrador conocido.
- Contraseña por defecto.
- Sesiones.
- Tokens.
- Pronósticos.
- Resultados.
- Datos personales reales.

Debe ser idempotente cuando sea razonable.

Ejemplo:

```text
upsert por código de equipo
```

No duplicar equipos al ejecutarlo varias veces.

El primer superadministrador se crea mediante el setup inicial de TASK-037, no mediante el seed.

---

# 20. Reglas para TASK-017 — Desenlace

Implementar una función pura.

Entrada conceptual:

```typescript
type Score = {
  homeGoals: number;
  awayGoals: number;
};
```

Salida conceptual:

```typescript
type MatchOutcome =
  | "HOME_WIN"
  | "DRAW"
  | "AWAY_WIN";
```

Reglas:

```text
homeGoals > awayGoals → HOME_WIN
homeGoals = awayGoals → DRAW
homeGoals < awayGoals → AWAY_WIN
```

Validar:

- Enteros.
- No negativos.
- 0-0 permitido.

No depender de:

- Prisma.
- React.
- Zona horaria.
- Base de datos.

---

# 21. Reglas para TASK-018 — Puntuación

Implementar una función pura que devuelva:

```text
Tipo de acierto
Puntos base
Multiplicador
Puntos otorgados
```

Tipos oficiales:

```text
EXACT
PARTIAL
WRONG
NO_PREDICTION
```

Reglas:

```text
Exacto = 3
Parcial = 1
Incorrecto = 0
Sin pronóstico = 0
```

Multiplicador permitido en versión 1.0:

```text
1 o 2
```

No confundir:

```text
Pronóstico 0-0
```

con:

```text
Ausencia de pronóstico
```

---

# 22. Reglas para TASK-019 — Clasificación

Entrada:

- Participantes.
- Puntos.
- Exactos.
- Parciales.
- Posición anterior cuando corresponda.

Orden deportivo:

```text
1. Puntos descendentes
2. Exactos descendentes
```

No usar parciales como desempate.

Para orden visual estable entre empatados puede utilizarse un criterio no deportivo, como nickname, siempre que:

- No altere la posición.
- No se presente como desempate.
- Sea determinista.

Posiciones:

```text
1, 2, 2, 4
```

No usar ranking denso.

---

# 23. Reglas para TASK-020 — Tendencia

Estados:

```text
UP
DOWN
SAME
NEW
```

Reglas generales:

```text
Posición nueva menor que anterior → UP
Posición nueva mayor que anterior → DOWN
Posición igual → SAME
Sin snapshot anterior → NEW
```

Recordar:

```text
Posición 1 es mejor que posición 2.
```

No derivar tendencia únicamente de puntos.

---

# 24. Reglas para TASK-021 — Cierre de pronósticos

Constante oficial:

```text
5 minutos
```

Función conceptual:

```typescript
calculatePredictionClosesAt(scheduledAt)
```

Resultado:

```text
scheduledAt - 5 minutos
```

Política de edición:

```typescript
canSubmitPrediction({
  serverNow,
  predictionClosesAt
})
```

Regla:

```text
serverNow < predictionClosesAt
```

Casos obligatorios:

- Un segundo antes: abierto.
- Exactamente al cierre: cerrado.
- Un segundo después: cerrado.

No utilizar `Date.now()` dentro de la regla si impide inyectar el tiempo en pruebas.

---

# 25. Reglas para TASK-022 — Máquina de estados

Estados oficiales:

```text
SCHEDULED
RESCHEDULED
CLOSED
SUSPENDED
RESUMED
FINISHED_PENDING
PROCESSED
CANCELLED
```

La tarea debe definir explícitamente:

- Transiciones permitidas.
- Transiciones prohibidas.
- Estados terminales.
- Condiciones adicionales.

Ejemplo conceptual:

```text
SCHEDULED → RESCHEDULED
SCHEDULED → CLOSED
SCHEDULED → SUSPENDED
SCHEDULED → CANCELLED
RESCHEDULED → CLOSED
SUSPENDED → RESUMED
SUSPENDED → CANCELLED
RESUMED → FINISHED_PENDING
FINISHED_PENDING → PROCESSED
```

La lista final debe coincidir con las reglas documentadas.

No permitir transiciones arbitrarias mediante actualización directa de estado.

---

# 26. Reglas para TASK-023 — Autorización

Implementar políticas puras o servicios de dominio/aplicación según corresponda.

Funciones previstas:

```typescript
canApproveUser
canManageMatch
canProcessResult
canPromoteAdmin
canUseDiagnostics
```

Las políticas deben considerar:

- Rol.
- Estado de cuenta.
- Propiedad cuando corresponda.
- Estado de entidad.
- Restricciones específicas.

No mezclar autorización con visibilidad de botones.

No consultar Prisma directamente desde una función pura de política.

---

# 27. Reglas para TASK-024 a TASK-027 — Repositorios

Los repositorios deben definir contratos claros.

Ejemplo:

```typescript
interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByNormalizedEmail(email: string): Promise<UserEntity | null>;
  create(input: CreateUserPersistenceInput): Promise<UserEntity>;
}
```

No devolver modelos Prisma fuera de infrastructure.

Mapear:

```text
Prisma model
↓
Domain entity o DTO interno
```

---

## 27.1 Responsabilidades permitidas

Un repositorio puede:

- Consultar.
- Insertar.
- Actualizar.
- Aplicar filtros.
- Participar en una transacción.
- Mapear datos.

No puede:

- Decidir puntuación.
- Decidir permisos deportivos.
- Renderizar mensajes.
- Enviar correos.
- Controlar UI.

---

## 27.2 Transacciones

Diseñar repositorios para funcionar con:

- Prisma client normal.
- Prisma transaction client.

Evitar duplicar repositorios completos para transacciones.

Utilizar tipos compatibles y claros.

---

## 27.3 Consultas mínimas

Implementar únicamente operaciones requeridas por la tarea y las siguientes tareas inmediatas.

No crear repositorios genéricos universales.

No implementar:

```typescript
BaseRepository<T>
```

si no aporta una necesidad concreta.

---

# 28. Reglas para TASK-027 — Auditoría

El repositorio de auditoría debe permitir únicamente creación desde los servicios normales.

Ejemplo conceptual:

```typescript
interface AuditLogRepository {
  create(entry: CreateAuditLogEntry): Promise<void>;
}
```

No exponer:

```typescript
updateAuditLog()
deleteAuditLog()
```

El repositorio debe sanitizar o exigir datos previamente sanitizados.

Preferir una capa explícita para construir eventos de auditoría.

---

# 29. Reglas para TASK-028 — Contexto de solicitud

El contexto de solicitud debe contener solo información necesaria.

Campos previstos:

```typescript
type RequestContext = {
  requestId: string;
  userId: string | null;
  role: UserRole | null;
  ipAddress: string | null;
  userAgent: string | null;
};
```

Puede incluir otros campos documentados si son necesarios.

No incluir:

- Password.
- Token de sesión.
- Cookie completa.
- Authorization header completo.
- Secretos.

---

## 29.1 Request ID

Debe ser:

- Único.
- No predecible cuando sea razonable.
- Seguro para logs.
- Independiente de datos personales.

Puede reutilizarse uno recibido de infraestructura confiable solo si se valida.

---

## 29.2 IP y proxy

No confiar ciegamente en cualquier encabezado enviado por el cliente.

La estrategia de IP debe considerar el proveedor de hosting.

Durante bootstrap puede definirse una interfaz y una implementación segura mínima.

No crear lógica propietaria innecesaria antes de seleccionar el hosting.

---

# 30. Orden recomendado dentro de la fase

El orden normal es:

```text
TASK-001
↓
TASK-002
↓
TASK-003 y TASK-004
↓
TASK-005 y TASK-006
↓
TASK-007 y TASK-008
↓
TASK-009 y TASK-010
↓
TASK-011
↓
TASK-012
↓
TASK-013
↓
TASK-014
↓
TASK-015
↓
TASK-016
↓
TASK-017
↓
TASK-018
↓
TASK-019
↓
TASK-020
↓
TASK-021
↓
TASK-022
↓
TASK-023
↓
TASK-024
↓
TASK-025
↓
TASK-026
↓
TASK-027
↓
TASK-028
```

Algunas tareas pueden trabajarse en paralelo solo si:

- No comparten archivos críticos.
- Sus dependencias están completas.
- El equipo coordina las migraciones.
- No se generan conflictos de arquitectura.

Para Codex, se recomienda ejecución secuencial.

---

# 31. Criterios de salida de la fase

La fase bootstrap se considera completa cuando:

- El proyecto ejecuta localmente.
- Next.js utiliza App Router.
- TypeScript está en modo estricto.
- Lint y formato están configurados.
- La estructura modular existe.
- Las variables están validadas.
- Prisma genera correctamente.
- PostgreSQL de desarrollo conecta.
- Las pruebas unitarias ejecutan.
- Las pruebas de integración tienen entorno separado.
- Playwright está configurado.
- El manejo de errores está centralizado.
- El esquema Prisma refleja la documentación.
- La migración inicial funciona en una base vacía.
- El seed es seguro e idempotente.
- Las reglas deportivas puras tienen pruebas.
- La clasificación usa posiciones compartidas.
- El cierre usa hora del servidor.
- La máquina de estados rechaza transiciones inválidas.
- Las políticas de autorización están tipadas.
- Los repositorios no exponen modelos Prisma.
- La auditoría es append-only.
- Existe un RequestContext seguro.
- `npm run lint` pasa.
- `npm run typecheck` pasa.
- `npm test` pasa.
- `npm run build` pasa.

---

# 32. Fuera de alcance de la fase

No implementar en bootstrap:

- Hashing completo de contraseña.
- Creación de sesiones funcional.
- Registro funcional.
- Confirmación de correo.
- Login.
- Recuperación de contraseña.
- Setup inicial.
- Gmail SMTP funcional.
- Pantallas públicas completas.
- Aprobación administrativa funcional.
- Gestión completa de temporada.
- Guardado real de pronósticos como caso de uso.
- Procesamiento transaccional.
- Recalculo completo.
- Dashboard.
- Centro de notificaciones.
- Exportaciones funcionales.
- Deployment de producción.

Los modelos o interfaces necesarios pueden existir, pero no los flujos completos.

---

# 33. Errores comunes que deben evitarse

## Error 1 — Implementar autenticación antes del modelo

No crear login antes de completar:

```text
User
Session
Password strategy
Error handling
Repositories
```

---

## Error 2 — Crear todo en `src/lib`

Cada dominio debe conservar su módulo.

---

## Error 3 — Acoplar dominio a Prisma

Código prohibido dentro de `domain/`:

```typescript
import { PrismaClient } from "@prisma/client";
```

---

## Error 4 — Crear enums duplicados

No definir un enum diferente en:

- Prisma.
- Dominio.
- UI.

Debe existir una estrategia clara de mapeo y una fuente conceptual única.

---

## Error 5 — Usar `Date.now()` en todas partes

La lógica crítica debe aceptar el tiempo como entrada o usar un Clock inyectable.

---

## Error 6 — Usar SQLite porque es más simple

La base oficial es PostgreSQL.

Las pruebas deben representar PostgreSQL cuando dependan de comportamiento de base.

---

## Error 7 — Sembrar un administrador con contraseña conocida

El primer superadministrador se crea mediante setup seguro.

---

## Error 8 — Exponer Prisma Client al navegador

Prisma es server-only.

---

## Error 9 — Crear una abstracción genérica excesiva

No crear frameworks internos antes de tener casos reales.

---

## Error 10 — Tratar Standing como tabla maestra

Standing siempre debe ser reconstruible.

---

# 34. Pruebas mínimas de dominio

Al terminar las tareas de dominio deben existir pruebas para:

## Desenlace

- Victoria local.
- Empate.
- Victoria visitante.
- Marcador inválido.

## Puntuación

- Exacto.
- Parcial local.
- Parcial visitante.
- Parcial empate.
- Incorrecto.
- Sin pronóstico.
- Doble.
- 0-0.

## Clasificación

- Orden por puntos.
- Desempate por exactos.
- Parciales ignorados para desempate.
- Posiciones compartidas.
- Secuencia 1, 2, 2, 4.
- Orden visual determinista.

## Tendencia

- UP.
- DOWN.
- SAME.
- NEW.

## Cierre

- Antes.
- Exactamente.
- Después.
- Reprogramación recalcula cierre.

## Estados

- Cada transición válida.
- Cada transición inválida relevante.
- Estado terminal.

## Autorización

- USER rechazado en operaciones administrativas.
- ADMIN permitido donde corresponde.
- ADMIN rechazado en promoción.
- SUPER_ADMIN permitido en promoción y diagnóstico.
- Cuenta bloqueada rechazada.

---

# 35. Comandos de validación de la fase

Según la tarea, ejecutar:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
npm run build
npx prisma format
npx prisma validate
npx prisma generate
npx prisma migrate dev
```

No ejecutar migraciones destructivas contra una base compartida sin autorización.

Para comprobar la migración inicial, preferir una base vacía de desarrollo o testing.

No afirmar que un comando pasó si no se ejecutó.

---

# 36. Formato de entrega por tarea

Cada ejecución debe terminar con:

```text
## Resumen

## Archivos creados

## Archivos modificados

## Pruebas agregadas o actualizadas

## Comandos ejecutados

## Criterios de aceptación

## Decisiones o supuestos

## Pendientes o bloqueos

## Riesgos detectados
```

Indicar expresamente:

```text
Tareas adicionales implementadas: ninguna
```

Si se modificó algo fuera del alcance esperado, justificarlo.

---

# 37. Prompt base de ejecución

Utilizar este bloque como base para cada tarea:

```text
Implementa únicamente [TASK-XXX — NOMBRE] de
docs/19-IMPLEMENTATION_PLAN.md.

Contexto obligatorio:

- prompts/00-global-context.md
- prompts/01-bootstrap.md
- prompts/09-task-template.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Documentos específicos:

- [DOCUMENTO]
- [DOCUMENTO]
- [DOCUMENTO]

Antes de modificar código:

1. Inspecciona el repositorio.
2. Confirma que las dependencias de la tarea están completas.
3. Revisa implementaciones y pruebas existentes.
4. Presenta un plan breve.
5. Informa cualquier contradicción documental.

Implementa el cambio mínimo completo.

No avances tareas posteriores.

Agrega las pruebas requeridas.

Ejecuta los comandos aplicables.

Entrega el resultado usando el formato definido en
prompts/09-task-template.md.
```

---

# 38. Ejemplo — TASK-006

```text
Implementa únicamente TASK-006 — Validación de variables de entorno.

Lee:

- prompts/00-global-context.md
- prompts/01-bootstrap.md
- prompts/09-task-template.md
- docs/02-Arquitectura.md
- docs/07-Seguridad.md
- docs/09-Deployment.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Objetivo:

Crear un módulo server-only que valide variables de entorno con Zod
y exponga una configuración tipada.

Dependencias:

- TASK-003 terminada.

Alcance:

- src/lib/env/
- .env.example
- tests/unit/env/
- Archivos de configuración estrictamente necesarios.

Fuera de alcance:

- Conexión real a PostgreSQL.
- Configuración Prisma.
- Envío SMTP.
- Setup inicial.
- Deployment.

Requisitos:

- No leer process.env directamente fuera del módulo, salvo bootstrap
  del propio módulo o necesidades documentadas de framework.
- No exponer secretos al cliente.
- Fallar al iniciar cuando falte una variable crítica.
- No imprimir valores secretos.
- APP_TIMEZONE debe aceptar America/Tegucigalpa.
- Flags deben convertirse a booleanos reales.
- SMTP_PORT debe convertirse a número válido.
- Debe existir .env.example sin secretos.

Pruebas:

- Configuración válida.
- Variable crítica ausente.
- Puerto SMTP inválido.
- Flag true.
- Flag false.
- Secretos no incluidos en mensajes de error.
- Variable server-only no accesible desde un módulo de cliente.

No agregues todavía Prisma ni Nodemailer.

Ejecuta:

- npm run format:check
- npm run lint
- npm run typecheck
- npm test
- npm run build
```

---

# 39. Ejemplo — TASK-015

```text
Implementa únicamente TASK-015 — Crear migración inicial.

Lee:

- prompts/00-global-context.md
- prompts/01-bootstrap.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/07-Seguridad.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias obligatorias:

- TASK-011
- TASK-012
- TASK-013
- TASK-014

Objetivo:

Crear y revisar la primera migración completa del esquema PostgreSQL.

Alcance:

- prisma/schema.prisma
- prisma/migrations/
- Pruebas de esquema o integración relacionadas.
- Documentación mínima si el proceso real difiere.

Fuera de alcance:

- Seed.
- Creación de superadministrador.
- Datos ficticios.
- Cambios funcionales no relacionados.
- Migraciones de producción.

Requisitos:

- Aplicar en una base vacía.
- Incluir UUID.
- Incluir enums.
- Incluir índices.
- Incluir constraints únicos.
- Revisar ON DELETE.
- Evitar cascadas destructivas.
- AuditLog sin update/delete desde el diseño de aplicación.
- Standing identificado como proyección.
- Unicidad de Prediction por userId y matchId.
- Unicidad de SeasonParticipant por seasonId y userId.
- Unicidad normalizada de email y nickname.

Pruebas o verificaciones:

- npx prisma format
- npx prisma validate
- npx prisma generate
- Aplicar migración en base vacía.
- Verificar migración desde cero.
- Ejecutar pruebas de integración aplicables.

Antes de finalizar, revisa manualmente el SQL generado e informa:

- Índices.
- Constraints.
- Cascadas.
- Riesgos.
```

---

# 40. Ejemplo — TASK-021

```text
Implementa únicamente TASK-021 — Implementar cálculo de cierre.

Lee:

- prompts/00-global-context.md
- prompts/01-bootstrap.md
- docs/04-ReglasNegocio.md
- docs/08-Testing.md
- docs/14-DecisionesArquitectonicas.md
- docs/16-Glosario.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Objetivo:

Implementar funciones puras para calcular el cierre de un partido y
determinar si un pronóstico puede crearse o editarse.

Alcance:

- src/modules/predictions/domain/
- src/modules/matches/domain/ cuando la arquitectura existente lo
  determine.
- tests/unit/predictions/ o ruta equivalente.

Fuera de alcance:

- Guardar pronósticos.
- Server Actions.
- UI.
- Reprogramación persistente.
- Notificaciones.
- Procesamiento.

Reglas:

- El cierre ocurre cinco minutos antes del scheduledAt.
- serverNow < predictionClosesAt significa abierto.
- Exactamente en predictionClosesAt significa cerrado.
- La hora del navegador no es autoridad.
- Las fechas representan instantes UTC.
- No usar la secuencia de jornada.

Pruebas:

- Calcula exactamente cinco minutos antes.
- Un segundo antes está abierto.
- Exactamente en el cierre está cerrado.
- Un segundo después está cerrado.
- Funciona al cruzar medianoche.
- Funciona al cruzar mes y año.
- No depende de timezone local de la máquina.
- Fechas inválidas son rechazadas según el contrato definido.

No uses Prisma ni React.

No uses Date.now() dentro de la regla.
```

---

# 41. Conclusión

La fase bootstrap debe producir una base pequeña, estricta y confiable.

No debe intentar demostrar progreso mediante muchas pantallas o funcionalidades superficiales.

El éxito de esta fase se mide por:

```text
Arquitectura estable
Modelo correcto
Reglas puras
Pruebas deterministas
Configuración segura
Persistencia reproducible
Código preparado para crecer sin rediseño
```

Una base incorrecta hará más costosas todas las fases posteriores.

Por ello, cada tarea de bootstrap debe completarse y validarse antes de avanzar.