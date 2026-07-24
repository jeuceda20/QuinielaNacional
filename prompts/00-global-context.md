# Global Context for Codex

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Tipo:** Contexto global obligatorio  
**Aplicación:** Todas las tareas de implementación, corrección, pruebas, refactorización y despliegue  
**Audiencia:** Codex y otros agentes de desarrollo asistido por IA

---

# 1. Propósito

Este archivo contiene el contexto global que deberá aplicarse a **todas** las tareas realizadas sobre el proyecto **Quiniela Nacional La Goleada – Kickoff**.

Este prompt no representa una tarea concreta.

Debe combinarse con:

- Un prompt de fase.
- Una tarea específica de `docs/19-IMPLEMENTATION_PLAN.md`.
- Los documentos técnicos relacionados con esa tarea.

Ejemplo de uso:

```text
Lee prompts/00-global-context.md.

Lee prompts/04-predictions.md.

Implementa únicamente TASK-062 de
docs/19-IMPLEMENTATION_PLAN.md.
```

---

# 2. Identidad del proyecto

El producto se llama:

```text
Quiniela Nacional La Goleada
```

El nombre interno es:

```text
Kickoff
```

La versión inicial objetivo es:

```text
1.0
```

La aplicación es una quiniela de fútbol destinada a una comunidad de amigos.

No es:

- Una casa de apuestas.
- Una plataforma de pagos.
- Una red social.
- Un sistema de múltiples ligas privadas en la versión 1.0.
- Una aplicación de resultados deportivos automáticos.
- Una aplicación móvil nativa.

---

# 3. Objetivo general

Construir una aplicación web que permita:

1. Registrar usuarios.
2. Confirmar sus correos.
3. Aprobarlos administrativamente.
4. Crear temporadas, jornadas y partidos.
5. Enviar pronósticos de marcador.
6. Cerrar pronósticos cinco minutos antes de cada partido.
7. Mostrar los pronósticos después del cierre.
8. Procesar resultados oficiales.
9. Calcular puntos.
10. Actualizar la clasificación.
11. Mantener auditoría.
12. Reconstruir la clasificación desde la fuente de verdad.

La prioridad principal es preservar la justicia y la confianza de la competencia.

---

# 4. Restricción económica

La aplicación deberá poder desarrollarse y operarse utilizando únicamente opciones gratuitas.

Requisito:

```text
Costo mensual obligatorio = 0
```

No introducir dependencias obligatorias de:

- Servicios de pago.
- Redis administrado de pago.
- Scheduler de pago.
- Monitoreo de pago.
- Autenticación de pago.
- Almacenamiento premium.
- APIs deportivas pagadas.

Una dependencia gratuita solo deberá incorporarse si:

- Es realmente necesaria.
- Tiene una alternativa o estrategia de migración.
- No crea acoplamiento irreversible.
- Está autorizada por la tarea.

---

# 5. Documentación obligatoria

Antes de modificar código, lee los documentos relacionados con la tarea.

Los documentos principales son:

```text
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
docs/19-IMPLEMENTATION_PLAN.md
```

No necesitas releer todos los documentos completos para cada tarea si ya están cargados en el contexto, pero debes consultar todos los que puedan afectar la implementación.

---

# 6. Jerarquía documental

Cuando exista una contradicción, utiliza este orden de prioridad:

```text
1. Instrucción explícita de la tarea actual

2. prompts/00-global-context.md

3. docs/17-CODEX_INSTRUCTIONS.md

4. docs/14-DecisionesArquitectonicas.md

5. docs/04-ReglasNegocio.md

6. docs/03-ModeloBaseDatos.md

7. docs/02-Arquitectura.md

8. docs/07-Seguridad.md

9. docs/06-API.md

10. docs/08-Testing.md

11. docs/05-UI-UX.md

12. Resto de documentación
```

Una instrucción de tarea no puede modificar silenciosamente una regla de negocio o una ADR.

Si la tarea contradice una decisión congelada:

1. No implementes la contradicción.
2. Identifica el conflicto.
3. Informa qué documentos están afectados.
4. Solicita una decisión o una nueva ADR.

---

# 7. Arquitectura congelada

La arquitectura oficial de Kickoff es:

```text
Monolito modular
Next.js App Router
React
TypeScript estricto
Tailwind CSS
PostgreSQL
Prisma
Zod
Server Actions
Route Handlers
Cookies de sesión HttpOnly
Vitest
Playwright
```

No reemplazar estas tecnologías sin autorización explícita y una nueva ADR.

No proponer ni introducir:

- Express como backend separado.
- NestJS.
- MongoDB.
- Firebase.
- Supabase Auth.
- Clerk.
- Auth0.
- NextAuth o Auth.js.
- GraphQL.
- Microservicios.
- Kafka.
- RabbitMQ.
- Kubernetes.
- Event Sourcing.
- CQRS.
- WebSockets sin necesidad documentada.
- Aplicación móvil nativa.
- Otra librería de estilos como sustitución de Tailwind.

---

# 8. Arquitectura interna

El flujo general debe respetar:

```text
UI
↓
Application
↓
Domain
↓
Infrastructure
```

Nunca implementar:

```text
React Component
↓
Prisma directamente
```

Las responsabilidades son:

## UI

- Presentación.
- Formularios.
- Interacciones.
- Estados visuales.
- Accesibilidad.

## Application

- Casos de uso.
- Coordinación.
- Transacciones.
- Autorización contextual.
- Auditoría del caso de uso.

## Domain

- Reglas deportivas.
- Políticas.
- Cálculos.
- Transiciones válidas.
- Funciones puras cuando sea posible.

## Infrastructure

- Prisma.
- PostgreSQL.
- SMTP.
- Persistencia.
- Integraciones externas.

---

# 9. Organización modular

La aplicación se organiza por dominio.

Módulos previstos:

```text
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
exports
settings
```

Estructura conceptual:

```text
src/modules/<module>/
├── application/
├── domain/
├── infrastructure/
├── schemas/
└── ui/
```

No crear estructuras paralelas que dupliquen responsabilidades.

Antes de crear una carpeta nueva:

1. Revisa la estructura existente.
2. Identifica el módulo propietario.
3. Mantén el patrón usado por módulos similares.

---

# 10. Reglas de negocio no negociables

## 10.1 Pronósticos

El pronóstico se realiza únicamente mediante marcador.

Ejemplo:

```text
Olimpia 2
Motagua 1
```

No existe selección independiente de:

- Ganador.
- Empate.
- Resultado doble.
- Apuesta.

El desenlace se deriva del marcador.

---

## 10.2 Cierre

Cada pronóstico cierra:

```text
5 minutos antes del inicio oficial del partido
```

La validación exacta es:

```text
serverNow < predictionClosesAt
```

Exactamente en `predictionClosesAt` ya está cerrado.

Nunca usar la hora del cliente como autoridad.

---

## 10.3 Visibilidad

Antes del cierre:

```text
Cada usuario solo puede ver su propio pronóstico.
```

Después del cierre:

```text
Todos los usuarios autenticados participantes pueden ver los pronósticos.
```

Antes del procesamiento:

```text
Los puntos y el tipo de acierto permanecen ocultos.
```

Después del procesamiento:

```text
Pronóstico, tipo y puntos pueden mostrarse.
```

No devolver pronósticos ajenos al cliente antes del cierre.

No ocultarlos únicamente con CSS o JavaScript.

Esta regla también aplica a administradores y superadministradores participantes.

---

## 10.4 Puntuación

Reglas oficiales:

```text
Exacto = 3 puntos
Parcial = 1 punto
Incorrecto = 0 puntos
Sin pronóstico = 0 puntos
```

El parcial significa acertar el desenlace general:

- Victoria local.
- Victoria visitante.
- Empate.

---

## 10.5 Partido doble

Cada jornada publicada tiene exactamente un partido doble.

Multiplicador:

```text
×2
```

Por tanto:

```text
Exacto doble = 6
Parcial doble = 2
Incorrecto doble = 0
Sin pronóstico = 0
```

No permitir dos partidos dobles en la misma jornada publicada.

---

## 10.6 Clasificación

Columnas oficiales:

- Posición.
- Nickname.
- Parciales.
- Exactos.
- Puntos.
- Tendencia.

Orden deportivo:

```text
1. Puntos descendentes
2. Exactos descendentes
```

Los parciales no desempatan.

Si puntos y exactos coinciden, los participantes comparten posición.

Usar clasificación de competencia:

```text
1, 2, 2, 4
```

No usar:

```text
1, 2, 2, 3
```

---

## 10.7 Jornadas y cronología

Las jornadas son agrupaciones lógicas.

No representan necesariamente el orden real de juego.

Es válido:

```text
Un partido de Jornada 5 se juega después de Jornada 10.
```

Para cronología usar:

```text
scheduledAt
predictionClosesAt
processedAt
```

Nunca usar `round.sequence` como autoridad cronológica.

---

## 10.8 Procesamiento

Los resultados se procesan un partido a la vez.

Flujo obligatorio:

```text
Validar
↓
Guardar resultado oficial
↓
Evaluar todos los pronósticos
↓
Guardar puntuaciones
↓
Actualizar exactos y parciales
↓
Actualizar clasificación
↓
Crear snapshots
↓
Crear auditoría
↓
Commit
```

Todo debe ocurrir dentro de una transacción.

No permitir resultados parcialmente procesados.

---

## 10.9 Recalculo

La clasificación debe poder reconstruirse completamente.

Fuente de verdad:

```text
Participantes de temporada
+
Partidos procesados
+
Resultados oficiales vigentes
+
Pronósticos
+
Reglas de temporada
+
Multiplicador
```

`Standing` no es la fuente de verdad.

No recalcular a partir de totales previamente almacenados.

---

# 11. Roles

Roles oficiales:

```text
USER
ADMIN
SUPER_ADMIN
```

## USER

Puede:

- Participar.
- Pronosticar.
- Ver resultados.
- Ver clasificación.
- Administrar su sesión y contraseña.

## ADMIN

Además puede:

- Aprobar y rechazar usuarios.
- Bloquear y desbloquear.
- Crear temporadas según permisos definidos.
- Crear jornadas.
- Crear partidos.
- Reprogramar.
- Suspender.
- Reanudar.
- Cancelar.
- Procesar resultados.
- Gestionar patrocinadores.
- Consultar auditoría permitida.

## SUPER_ADMIN

Además puede:

- Promover administradores.
- Retirar administradores.
- Corregir resultados procesados.
- Cerrar temporadas.
- Recalcular.
- Usar diagnóstico.
- Administrar mantenimiento.
- Acceder a funciones avanzadas habilitadas.

Solo el superadministrador puede promover o retirar administradores.

El primer setup debe crear un único superadministrador.

---

# 12. Estados principales

Estados oficiales de partido:

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

Utilizar enums o un equivalente tipado.

No representar el estado mediante combinaciones ambiguas de booleanos.

Ejemplo prohibido:

```typescript
{
  isClosed: true,
  isCancelled: false,
  isProcessed: true
}
```

El módulo de dominio deberá controlar las transiciones permitidas.

---

# 13. Reprogramaciones

Cuando un partido se reprograma:

- Conservar los pronósticos.
- Conservar la fecha anterior.
- Registrar la fecha nueva.
- Recalcular el nuevo cierre.
- Registrar el motivo.
- Crear auditoría.
- Permitir reapertura solo si la acción lo indica y las reglas lo permiten.

No cambiar automáticamente la jornada.

No eliminar pronósticos.

No asumir que una jornada anterior debe jugarse primero.

---

# 14. Suspensión y cancelación

## Suspensión

Un partido suspendido:

- No debe procesarse.
- Conserva pronósticos.
- Puede reanudarse.
- Puede reprogramarse.
- Puede cancelarse.

## Cancelación

Un partido cancelado:

- No otorga puntos.
- No cuenta como error.
- Conserva pronósticos para trazabilidad.
- Conserva historial.
- No debe eliminarse físicamente.

---

# 15. Registro y autenticación

Flujo oficial:

```text
Registro público
↓
Confirmación de correo
↓
Pendiente de aprobación
↓
Aprobación administrativa
↓
Login
```

Campos de registro:

- Nombre.
- Apellido.
- Nickname.
- Correo.
- Contraseña.
- Confirmación de contraseña.
- Equipo favorito.
- Aceptación de reglas.

El correo es inmutable.

El nickname es público.

No existen avatares personales.

Se utiliza el logo del equipo favorito.

---

# 16. Sesiones

Las sesiones deben ser opacas y revocables.

La cookie deberá utilizar:

```text
HttpOnly
Secure en producción
SameSite=Lax o más restrictivo
Path=/
```

No almacenar tokens de autenticación en:

- `localStorage`.
- `sessionStorage`.

La base de datos deberá conservar solo el hash del token de sesión cuando el diseño lo requiera.

---

# 17. Contraseñas y tokens

Las contraseñas deben utilizar:

```text
Argon2id preferido
```

o la alternativa aprobada por la ADR si Argon2id no es viable.

Nunca utilizar:

- Texto plano.
- MD5.
- SHA-1.
- SHA-256 directo.
- Cifrado reversible.

Los tokens de confirmación y recuperación:

- Deben ser criptográficamente aleatorios.
- Deben tener expiración.
- Deben ser de un solo uso.
- Deben almacenarse como hash.

Nunca registrar tokens completos.

---

# 18. Validación

Toda entrada externa debe validarse en tiempo de ejecución con Zod.

Esto incluye:

- Formularios.
- Route Handlers.
- Server Actions.
- Parámetros de ruta.
- Query parameters.
- Importaciones.
- Configuración editable.

TypeScript no reemplaza la validación de runtime.

Los esquemas deberán estar cerca del módulo propietario.

---

# 19. Persistencia

PostgreSQL es la base oficial.

Prisma es el mecanismo normal de persistencia.

No usar SQL directo salvo:

- Migraciones.
- Consultas especiales justificadas.
- Diagnóstico autorizado.
- Optimización demostrada.

Toda consulta SQL directa debe:

- Ser parametrizada.
- Estar documentada.
- Tener pruebas.
- Evitar datos sensibles.

---

# 20. Identificadores

Las entidades principales utilizan UUID.

No asumir:

- Identificadores consecutivos.
- Orden de creación basado en ID.
- IDs predecibles.

La autorización no depende de que el ID sea difícil de adivinar.

Siempre verificar propiedad y permiso.

---

# 21. DTO y exposición de datos

No devolver modelos Prisma directamente a la UI o a respuestas HTTP.

Utilizar:

- DTO.
- ViewModel.
- Mapper.
- Select explícito.

Nunca exponer:

- `passwordHash`.
- Hashes de token.
- Tokens.
- Sesiones completas.
- Cookies.
- Secretos.
- Credenciales.
- Campos internos innecesarios.

---

# 22. Soft delete

Entidades históricas importantes utilizarán eliminación lógica.

Incluye al menos:

- Usuarios.
- Temporadas cuando corresponda.
- Jornadas.
- Partidos.
- Patrocinadores.

No eliminar físicamente registros con historial deportivo desde flujos normales.

Las consultas habituales deben excluir registros eliminados cuando corresponda.

---

# 23. Auditoría

La auditoría es append-only.

No crear operaciones de:

- Edición.
- Eliminación.
- Alteración de actor.
- Alteración de fecha.

Acciones auditables incluyen:

- Aprobación.
- Rechazo.
- Bloqueo.
- Desbloqueo.
- Cambio de rol.
- Creación de temporada.
- Creación o publicación de jornada.
- Creación de partido.
- Reprogramación.
- Suspensión.
- Reanudación.
- Cancelación.
- Cambio de partido doble.
- Procesamiento.
- Corrección.
- Recalculo.
- Mantenimiento.
- Exportación.
- Importación.
- SQL.
- Herramientas de prueba.

Nunca registrar en auditoría:

- Passwords.
- Password hashes.
- Tokens.
- Cookies.
- Secretos.
- Credenciales SMTP.
- Connection strings.

---

# 24. Errores

Utilizar errores funcionales tipados.

La respuesta pública deberá incluir:

- Código.
- Mensaje comprensible.
- Errores de campo cuando aplique.
- Request ID.

No enviar al cliente:

- Stack trace.
- SQL.
- Variables de entorno.
- Rutas internas sensibles.
- Detalles de Prisma innecesarios.

Ejemplo conceptual:

```typescript
type ApplicationError = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
};
```

---

# 25. Request ID

Cada solicitud o acción relevante debe tener un Request ID.

El Request ID debe utilizarse en:

- Respuestas de error.
- Logs.
- Auditoría.
- Diagnóstico.
- Soporte.

No incluir información personal dentro del Request ID.

---

# 26. Seguridad

Toda operación protegida debe validar en servidor:

1. Sesión.
2. Estado de cuenta.
3. Rol.
4. Permiso.
5. Entrada.
6. Estado de la entidad.
7. Propiedad del recurso cuando aplique.
8. Hora del servidor cuando aplique.

Ocultar un botón no representa autorización.

No confiar en middleware como único control de autorización.

Repetir la validación dentro del caso de uso o endpoint protegido.

---

# 27. Protección de pronósticos

La privacidad temporal de los pronósticos es un requisito crítico.

Antes del cierre, una consulta de usuario no deberá recuperar pronósticos ajenos desde la base si no son necesarios.

Preferir:

```text
Consultar únicamente el pronóstico del usuario actual.
```

No:

```text
Consultar todos y filtrar después en el navegador.
```

Las respuestas privadas deberán utilizar una política de caché segura.

Ejemplo:

```text
private
no-store
```

---

# 28. Caché

Server Components son la opción por defecto, pero la caché debe aplicarse con cuidado.

No cachear públicamente:

- Sesión actual.
- Perfil.
- Dashboard personal.
- Pronósticos propios.
- Pronósticos antes del cierre.
- Auditoría.
- Diagnóstico.
- Exportaciones privadas.
- Datos administrativos.

Después de operaciones relevantes, revalidar tags o rutas apropiadas.

Ejemplos:

```text
dashboard
standings
match:{matchId}
round:{roundId}
notifications:{userId}
```

No inventar una estrategia de caché global sin pruebas.

---

# 29. Server Components y Client Components

Utilizar Server Components por defecto.

Crear un Client Component únicamente cuando sea necesario para:

- Estado local.
- Eventos de navegador.
- Formularios interactivos.
- Contadores.
- Modales.
- Toasts.
- Funcionalidad exclusiva del cliente.

No convertir una página completa en Client Component si solo una pequeña sección requiere interactividad.

Mantener la frontera cliente-servidor lo más pequeña posible.

---

# 30. Server Actions y Route Handlers

Preferir Server Actions para formularios internos.

Utilizar Route Handlers para:

- Endpoints HTTP.
- Paginación dinámica.
- Descargas.
- Exportaciones.
- Health checks.
- Diagnóstico.
- Integraciones.
- Casos consumidos explícitamente mediante HTTP.

Server Actions y Route Handlers deben invocar los mismos servicios de aplicación.

No duplicar lógica entre ambos.

---

# 31. Componentes y UI

La interfaz debe seguir `docs/05-UI-UX.md`.

Requisitos generales:

- Responsive.
- Mobile first cuando sea razonable.
- Accesible.
- Estados de loading.
- Estados vacíos.
- Estados de error.
- Confirmaciones claras.
- Foco visible.
- Labels asociados.
- No depender únicamente del color.
- Botones táctiles utilizables.

Idioma visible:

```text
Español
```

Código y nombres técnicos:

```text
Inglés
```

---

# 32. Fechas y zonas horarias

Persistencia:

```text
UTC
```

Zona de negocio y presentación principal:

```text
America/Tegucigalpa
```

No depender de la zona local del servidor de hosting.

No depender de la zona del navegador para validar cierres.

Las fechas deberán manejarse como instantes explícitos.

Evitar conversiones implícitas ambiguas.

---

# 33. Transacciones

Utilizar transacciones para operaciones que afecten múltiples registros relacionados.

Obligatorias al menos para:

- Procesamiento de resultado.
- Corrección de resultado.
- Recalculo.
- Aprobación e incorporación a temporada.
- Cambio de roles.
- Cierre de temporada.
- Importaciones críticas.
- Restauraciones.
- Limpiezas controladas.

La auditoría relacionada con la operación debe guardarse dentro de la misma transacción cuando sea posible.

---

# 34. Concurrencia e idempotencia

Las operaciones críticas deben protegerse contra concurrencia.

Casos:

- Procesar el mismo partido dos veces.
- Recalcular la misma temporada dos veces.
- Crear dos superadministradores.
- Activar dos temporadas.
- Ejecutar dos importaciones incompatibles.

Utilizar según corresponda:

- Restricciones únicas.
- Actualizaciones condicionales.
- Bloqueos de fila.
- Operational locks.
- Idempotency keys.
- Versionado optimista.

No usar únicamente un botón deshabilitado como protección.

---

# 35. Dependencias

No instalar una dependencia sin revisar:

- Si el proyecto ya tiene una solución.
- Si la plataforma ofrece la capacidad.
- Estado de mantenimiento.
- Licencia.
- Tamaño.
- Riesgo de seguridad.
- Compatibilidad.
- Impacto en planes gratuitos.

Toda dependencia nueva debe estar justificada por la tarea.

No actualizar dependencias no relacionadas durante una tarea funcional.

---

# 36. Testing

Toda tarea funcional debe agregar o actualizar pruebas.

Seleccionar el nivel correcto:

## Unitarias

Para:

- Reglas puras.
- Puntuación.
- Desenlace.
- Cierre.
- Clasificación.
- Tendencia.
- Estados.
- Permisos.

## Integración

Para:

- Prisma.
- Repositorios.
- Servicios.
- Transacciones.
- Auditoría.
- Sesiones.
- Tokens.
- Recalculo.

## API

Para:

- Status codes.
- Contratos.
- Autenticación.
- Autorización.
- Validaciones.

## E2E

Para:

- Registro.
- Login.
- Pronósticos.
- Cierre.
- Privacidad.
- Procesamiento.
- Clasificación.
- Reprogramaciones.
- Corrección.

No eliminar ni debilitar pruebas para conseguir que una tarea pase.

Si una prueba existente contradice una regla documentada, informa el conflicto antes de modificarla.

---

# 37. Reloj en pruebas

Las pruebas relacionadas con tiempo deben utilizar un reloj controlable.

No esperar minutos reales.

Cubrir como mínimo:

```text
Un segundo antes del cierre
Exactamente en el cierre
Un segundo después del cierre
```

No depender de la hora actual del equipo que ejecuta la prueba.

---

# 38. Base de datos de pruebas

Nunca ejecutar pruebas contra producción.

Las pruebas de integración y E2E deben usar:

- Base separada.
- Datos ficticios.
- SMTP falso.
- Variables específicas.
- Limpieza controlada.

Los datos de prueba deberán utilizar correos como:

```text
@example.invalid
```

---

# 39. Logs

Los logs deben ser estructurados cuando sea razonable.

Campos útiles:

- Level.
- Timestamp.
- Request ID.
- Error code.
- Route.
- User ID cuando sea necesario.
- Duration.

Antes de registrar un objeto, redactar:

```text
password
passwordHash
token
tokenHash
cookie
authorization
secret
smtpAppPassword
databaseUrl
session
```

No utilizar `console.log` indiscriminadamente en producción.

---

# 40. Diagnóstico

El Centro de Diagnóstico:

- Es exclusivo del superadministrador.
- Debe estar deshabilitado por defecto en producción.
- No debe mostrar secretos.
- Debe auditar operaciones.
- Debe usar límites y timeouts.

Flags relevantes:

```text
ENABLE_DIAGNOSTICS
ENABLE_SQL_CONSOLE
ENABLE_SQL_WRITE
ENABLE_TEST_DATA_TOOLS
```

Habilitar una flag no debe habilitar automáticamente las demás.

---

# 41. SQL Console

La consola SQL no es una herramienta administrativa normal.

Por defecto:

```text
Deshabilitada
```

Modo lectura:

- Solo `SELECT`.
- Una instrucción.
- Timeout.
- Límite de filas.
- Auditoría.
- Superadministrador.
- Reautenticación.

Modo escritura:

```text
No implementar o mantener deshabilitado para versión 1.0,
salvo instrucción explícita.
```

Nunca introducir una consola SQL sin las protecciones definidas.

---

# 42. Exportaciones

Las exportaciones deben excluir:

- Password hashes.
- Tokens.
- Sesiones.
- Cookies.
- Secretos.
- Variables de entorno.
- Credenciales.

Las descargas deben:

- Requerir autorización.
- Expirar.
- Registrar la descarga.
- Evitar URLs públicas permanentes.

Las exportaciones CSV deben proteger contra CSV injection en valores que comiencen con:

```text
=
+
-
@
```

---

# 43. SMTP

La implementación inicial utiliza Gmail SMTP.

Las credenciales deben provenir de variables de entorno.

Nunca:

- Registrar la contraseña de aplicación.
- Mostrarla en diagnóstico.
- Incluirla en exportaciones.
- Insertarla en código.
- Enviarla al cliente.

Las pruebas automáticas deben usar un proveedor falso.

---

# 44. Configuración y secretos

Los secretos pertenecen exclusivamente a variables de entorno.

Nunca incluir:

- `.env`.
- `.env.local`.
- `.env.production`.
- Credenciales reales.

Sí mantener:

```text
.env.example
```

sin valores reales.

La aplicación debe fallar de forma segura al iniciar si falta una variable crítica.

No imprimir su valor.

---

# 45. Deployment

La aplicación debe permanecer portable.

Evitar usar características propietarias innecesarias del proveedor.

Producción requiere:

- HTTPS.
- Cookies Secure.
- Variables válidas.
- Migraciones aplicadas.
- Setup cerrado.
- SQL deshabilitado.
- Test data deshabilitado.
- Diagnóstico restringido.
- Backup.
- Smoke tests.

No ejecutar seeds de prueba automáticamente durante cada deployment.

---

# 46. Alcance de cada tarea

Implementa únicamente la tarea solicitada.

No realizar tareas adicionales aunque parezcan relacionadas.

No:

- Rediseñar módulos.
- Renombrar todo el proyecto.
- Actualizar dependencias no relacionadas.
- Añadir funcionalidades futuras.
- Implementar otras tareas del plan.
- Reescribir archivos fuera del alcance sin necesidad.

Si una dependencia de la tarea todavía no existe:

1. Informa el bloqueo.
2. Identifica la tarea requerida.
3. No implementes una solución temporal que contradiga la arquitectura.

---

# 47. Inspección previa obligatoria

Antes de modificar código:

1. Lee la tarea.
2. Lee los documentos obligatorios.
3. Inspecciona el árbol del proyecto.
4. Localiza módulos similares.
5. Revisa pruebas existentes.
6. Revisa convenciones actuales.
7. Identifica archivos que deben cambiar.

No asumas que el repositorio está vacío.

No sobrescribas trabajo existente sin comprenderlo.

---

# 48. Plan previo

Antes de implementar, presenta o registra un plan breve que indique:

- Archivos a crear.
- Archivos a modificar.
- Pruebas a agregar.
- Riesgos.
- Suposiciones mínimas.

El plan no debe convertirse en una nueva arquitectura.

Debe limitarse a la tarea.

---

# 49. Cambios mínimos

Aplicar el cambio más pequeño que cumpla completamente la tarea.

Evitar:

- Refactorizaciones globales.
- Formatear todo el repositorio.
- Renombrar archivos no relacionados.
- Cambiar estilos ajenos.
- Reescribir módulos estables.

Cada archivo modificado debe poder justificarse por la tarea.

---

# 50. Calidad del código

El código deberá:

- Ser legible.
- Tener nombres descriptivos.
- Mantener bajo acoplamiento.
- Mantener alta cohesión.
- Evitar duplicación.
- Evitar abstracciones prematuras.
- Evitar números mágicos.
- Evitar funciones gigantes.
- Evitar `any`.

Preferir:

```typescript
unknown
```

cuando un valor todavía no esté validado.

Las reglas de dominio deben ser funciones puras cuando sea razonable.

---

# 51. Convenciones de idioma

Código:

```text
Inglés
```

Incluye:

- Variables.
- Funciones.
- Clases.
- Interfaces.
- Tipos.
- Archivos técnicos.
- Nombres de tests.

Texto visible al usuario:

```text
Español
```

Documentación del proyecto:

```text
Español
```

Códigos de error:

```text
Inglés y en mayúsculas con guion bajo
```

Ejemplo:

```text
PREDICTION_CLOSED
```

---

# 52. Convenciones de nombres

Funciones:

```typescript
calculatePredictionScore
savePrediction
processMatchResult
```

Booleanos:

```typescript
isPredictionOpen
canEditPrediction
hasPrediction
```

Evitar:

```typescript
notClosed
data2
tmp
obj
calc
doStuff
```

Repositorios:

```text
UserRepository
MatchRepository
PredictionRepository
```

Servicios o casos de uso:

```text
SavePredictionService
ProcessMatchResultService
ApproveUserService
```

---

# 53. Respuestas de Server Actions

Las Server Actions deberán devolver resultados tipados y controlados.

Ejemplo conceptual:

```typescript
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
```

No enviar excepciones sin controlar al cliente.

---

# 54. Contratos HTTP

Formato de éxito:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Formato de error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje seguro."
  },
  "requestId": "req_example"
}
```

No crear formatos distintos por endpoint sin una razón documentada.

---

# 55. Comandos de validación

Al terminar una tarea, ejecutar los comandos aplicables.

Base esperada:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Cuando corresponda:

```bash
npm run test:integration
npm run test:e2e
npm run format:check
npx prisma validate
npx prisma generate
```

No afirmar que un comando pasó si no fue ejecutado.

Si no puede ejecutarse:

- Indicarlo claramente.
- Explicar el motivo.
- No inventar resultados.

---

# 56. Formato de entrega de Codex

Al terminar una tarea, responder con:

## Resumen

Descripción breve de lo implementado.

## Archivos creados

Lista de archivos nuevos.

## Archivos modificados

Lista de archivos modificados.

## Pruebas

Pruebas agregadas o actualizadas.

## Comandos ejecutados

Comando y resultado.

## Decisiones o supuestos

Solo los estrictamente necesarios.

## Pendientes o bloqueos

Problemas que impiden completar algo.

No incluir explicaciones extensas no relacionadas.

---

# 57. Prohibiciones absolutas

No debes:

- Cambiar las reglas de puntuación.
- Cambiar el cierre de cinco minutos.
- Permitir pronósticos tardíos.
- Mostrar pronósticos antes del cierre.
- Usar el reloj del cliente como autoridad.
- Permitir dos partidos dobles.
- Ordenar cronológicamente por número de jornada.
- Modificar puntos manualmente.
- Usar Standing como fuente de verdad.
- Eliminar auditorías.
- Eliminar historial deportivo físicamente.
- Exponer secretos.
- Guardar tokens en texto plano.
- Utilizar `localStorage` para sesiones.
- Agregar autenticación externa.
- Cambiar PostgreSQL.
- Cambiar Prisma.
- Cambiar Next.js App Router.
- Introducir microservicios.
- Eliminar pruebas para ocultar fallos.
- Ignorar errores de TypeScript.
- Ejecutar pruebas contra producción.
- Usar datos reales en tests.
- Habilitar SQL Write por defecto.
- Habilitar herramientas de prueba en producción.
- Crear una segunda fuente de lógica deportiva.

---

# 58. Manejo de ambigüedades

Cuando una especificación no sea clara:

1. Busca el término en `docs/16-Glosario.md`.
2. Revisa `docs/04-ReglasNegocio.md`.
3. Revisa las ADR.
4. Revisa API, modelo de datos y manuales.
5. Revisa código y pruebas existentes.

Si continúa ambigua:

- No inventes.
- Presenta la duda concreta.
- Explica las alternativas.
- Indica el impacto.
- Espera aclaración.

No uses la ambigüedad para ampliar el alcance.

---

# 59. Manejo de contradicciones

Si encuentras documentos contradictorios:

1. No elijas silenciosamente.
2. Cita los archivos y secciones en conflicto.
3. Aplica la jerarquía documental.
4. Informa qué decisión utilizaste.
5. Sugiere la corrección documental necesaria.

Cuando una regla crítica está en conflicto, detén la implementación afectada.

---

# 60. Cambios de arquitectura

No cambiar arquitectura durante una tarea normal.

Un cambio arquitectónico requiere:

- Justificación.
- Evaluación de alternativas.
- Impacto.
- Nueva ADR.
- Actualización de documentación.
- Actualización de pruebas.
- Aprobación explícita.

No interpretar una dificultad técnica como autorización para rediseñar.

---

# 61. Definition of Done

Una tarea está terminada únicamente cuando:

- El objetivo está completamente implementado.
- El alcance se respetó.
- La arquitectura se respetó.
- Las reglas de negocio se respetaron.
- La validación se implementó.
- La autorización se implementó cuando aplica.
- Los errores se manejan.
- La seguridad se revisó.
- Las pruebas requeridas existen.
- Las pruebas relacionadas pasan.
- Lint pasa.
- Typecheck pasa.
- Build pasa cuando aplica.
- La documentación se actualizó cuando era necesario.
- No quedan TODO críticos.
- No se introdujeron secretos.
- No se rompió funcionalidad existente.

Que el código compile no significa que la tarea esté terminada.

---

# 62. Principio final

Cuando debas elegir entre:

```text
Implementar rápido
```

y:

```text
Implementar correctamente
```

elige siempre:

```text
Implementar correctamente
```

Cuando debas elegir entre:

```text
Una solución compleja y flexible para un futuro hipotético
```

y:

```text
La solución más simple que cumple completamente los requisitos actuales
```

elige:

```text
La solución simple y correcta
```

La confianza de los participantes y la integridad de la competencia tienen prioridad sobre cualquier optimización, conveniencia o preferencia tecnológica.

---

# 63. Confirmación de contexto

Antes de iniciar una tarea, el agente deberá asumir que acepta las siguientes condiciones:


He leído el contexto global.

No modificaré la arquitectura.

No modificaré las reglas deportivas.

Implementaré únicamente la tarea solicitada.

Validaré todo en el servidor.

Agregaré las pruebas correspondientes.

No expondré secretos.

Informaré con honestidad los comandos ejecutados y sus resultados.
```