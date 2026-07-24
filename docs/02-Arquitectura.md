# Arquitectura Técnica

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Diseño técnico inicial  
**Arquitectura objetivo:** Aplicación web full stack modular  
**Restricción principal:** Todos los componentes esenciales deberán operar mediante tecnologías y planes gratuitos.

---

## 1. Propósito

Este documento define la arquitectura técnica de **Quiniela Nacional La Goleada – Kickoff**.

Su objetivo es establecer:

- Tecnologías principales.
- Organización del código.
- Límites entre capas.
- Flujo de datos.
- Estrategia de autenticación.
- Estrategia de persistencia.
- Seguridad.
- Despliegue.
- Manejo de errores.
- Reglas para mantener el proyecto desacoplado.
- Criterios técnicos que Codex deberá respetar.

Este documento no sustituye las reglas funcionales ni el modelo de datos.

---

## 2. Principios arquitectónicos

### 2.1 Gratuito por diseño

La arquitectura debe funcionar sin servicios obligatorios de pago.

Toda dependencia externa deberá:

- Tener alternativa gratuita.
- Poder ser reemplazada.
- No contener lógica de negocio esencial.
- Estar encapsulada detrás de una interfaz o servicio interno.

### 2.2 Monolito modular

La versión 1.0 utilizará un monolito modular.

Esto significa:

- Un único repositorio.
- Una única aplicación web.
- Un backend integrado.
- Una única base de datos.
- Módulos internos claramente separados.

No se utilizarán microservicios en Kickoff.

Motivos:

- Menor complejidad.
- Menor costo.
- Despliegue sencillo.
- Menos puntos de fallo.
- Mejor adecuación para una comunidad pequeña o mediana.
- Mantenimiento más fácil.

### 2.3 Lógica de negocio fuera de la interfaz

La lógica de puntuación, cierres, permisos y procesamiento no debe residir dentro de componentes visuales.

Los componentes deberán:

- Renderizar información.
- Capturar interacción.
- Invocar servicios o acciones.
- Mostrar resultados y errores.

Las reglas deberán vivir en módulos de dominio y servicios.

### 2.4 El servidor es la autoridad

El frontend nunca será la fuente de verdad para:

- Permisos.
- Hora de cierre.
- Estado de partido.
- Puntuación.
- Rol.
- Procesamiento.
- Acceso a datos de terceros.
- Validación de pronósticos.

Toda operación sensible deberá validarse en el servidor.

### 2.5 Bajo acoplamiento

La aplicación no debe depender excesivamente de:

- Vercel.
- Supabase.
- Gmail.
- Un proveedor de almacenamiento específico.
- Un proveedor de autenticación externo.

Las integraciones deberán estar encapsuladas.

### 2.6 Fuente de verdad reproducible

La clasificación podrá almacenarse como resumen, pero debe poder reconstruirse a partir de:

- Partidos procesados.
- Pronósticos.
- Resultados.
- Reglas de puntuación.
- Multiplicador.

---

## 3. Arquitectura general


flowchart TD
    U[Usuario en navegador] --> W[Next.js Web App]

    W --> UI[Componentes UI]
    W --> SA[Server Actions]
    W --> API[Route Handlers]

    SA --> APP[Application Services]
    API --> APP

    APP --> DOM[Domain Services]
    APP --> REP[Repositories]

    DOM --> RULES[Reglas de negocio]
    REP --> ORM[Prisma ORM]
    ORM --> DB[(PostgreSQL)]

    APP --> MAIL[Email Service]
    MAIL --> SMTP[Gmail SMTP]

    APP --> AUDIT[Audit Service]
    AUDIT --> DB

    APP --> LOG[Logging Service]

4. Stack tecnológico objetivo
4.1 Aplicación
Next.js.
React.
TypeScript.
App Router.
Server Components donde sea apropiado.
Client Components solo cuando exista interacción real.
4.2 Interfaz
Tailwind CSS.
Componentes accesibles.
Lucide Icons o alternativa libre.
Formularios con validación compartida.
Diseño responsive mobile-first.
4.3 Backend
Route Handlers.
Server Actions cuando sean adecuadas.
Servicios de aplicación.
Servicios de dominio.
Repositorios.
Validación mediante esquemas.
4.4 Persistencia
PostgreSQL.
Prisma ORM.
Migraciones versionadas.
Restricciones de base de datos.
Transacciones.
Índices explícitos.
4.5 Autenticación
Autenticación propia.
Sesiones persistentes.
Cookies seguras.
Contraseñas con Argon2id o bcrypt.
Tokens aleatorios para confirmación y recuperación.
4.6 Correo
SMTP.
Gmail con contraseña de aplicación.
Plantillas HTML y texto plano.
Cola simple o reintentos controlados cuando sea viable.
4.7 Pruebas
Vitest para pruebas unitarias.
Pruebas de integración sobre servicios.
Playwright para pruebas end-to-end.
Base de datos separada para testing.
4.8 Herramientas
ESLint.
Prettier.
TypeScript en modo estricto.
GitHub.
GitHub Actions cuando pueda ejecutarse gratuitamente.
Dependabot o herramienta equivalente opcional.
5. Estructura del repositorio
Quiniela-Nacional-La-Goleada/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (protected)/
│   ├── admin/
│   ├── api/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── auth/
│   ├── dashboard/
│   ├── predictions/
│   ├── standings/
│   ├── results/
│   ├── admin/
│   └── shared/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── teams/
│   ├── seasons/
│   ├── rounds/
│   ├── matches/
│   ├── predictions/
│   ├── scoring/
│   ├── standings/
│   ├── sponsors/
│   ├── notifications/
│   ├── audit/
│   ├── diagnostics/
│   └── settings/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── mail/
│   ├── validation/
│   ├── logging/
│   ├── errors/
│   ├── time/
│   ├── permissions/
│   └── utils/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
│   ├── branding/
│   ├── teams/
│   ├── sponsors/
│   └── icons/
│
├── scripts/
│   ├── create-super-admin.ts
│   ├── seed-demo-data.ts
│   ├── verify-integrity.ts
│   ├── recalculate-season.ts
│   └── export-data.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── fixtures/
│   └── helpers/
│
├── docs/
├── prompts/
├── middleware.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
6. Organización por módulos

Cada módulo deberá contener únicamente la lógica de su dominio.

Ejemplo:

modules/predictions/
├── prediction.types.ts
├── prediction.schemas.ts
├── prediction.repository.ts
├── prediction.service.ts
├── prediction.policy.ts
├── prediction.mapper.ts
└── prediction.errors.ts
6.1 Tipos

Definen contratos internos.

No deben duplicar innecesariamente los tipos generados por Prisma.

6.2 Schemas

Validan:

Entradas de formularios.
Requests.
Parámetros.
Variables de entorno.
Respuestas cuando sea necesario.
6.3 Repositories

Se encargan del acceso a datos.

No deben contener reglas de puntuación ni decisiones de negocio complejas.

6.4 Services

Coordinan operaciones.

Ejemplo:

processMatchResult()

Este servicio podrá:

Validar permisos.
Abrir una transacción.
Leer partido y pronósticos.
Calcular puntos.
Guardar resultados.
Registrar auditoría.
6.5 Policies

Contienen reglas de autorización o comportamiento.

Ejemplo:

canEditPrediction()
canProcessMatch()
canPromoteAdministrator()
6.6 Errors

Cada módulo podrá definir errores específicos y tipados.

Ejemplo:

PredictionClosedError
MatchAlreadyProcessedError
UnauthorizedRoleError
7. Capas de la aplicación
7.1 Presentación

Incluye:

Páginas.
Layouts.
Componentes.
Formularios.
Estados visuales.
Navegación.

No debe conocer detalles de Prisma.

7.2 Aplicación

Coordina casos de uso.

Ejemplos:

Registrar usuario.
Aprobar cuenta.
Crear partido.
Guardar pronóstico.
Procesar resultado.
Recalcular temporada.
7.3 Dominio

Contiene reglas puras.

Ejemplos:

Calcular puntos.
Determinar si el resultado es exacto.
Determinar si es parcial.
Calcular posición compartida.
Determinar cierre.
Validar transición de estado.
7.4 Infraestructura

Incluye:

Prisma.
PostgreSQL.
Gmail SMTP.
Logging.
Almacenamiento.
Exportaciones.
Variables de entorno.
8. Flujo de una solicitud

Ejemplo: guardar pronóstico.

sequenceDiagram
    participant U as Usuario
    participant UI as Interfaz
    participant A as Server Action/API
    participant S as Prediction Service
    participant P as Policy
    participant R as Repository
    participant DB as PostgreSQL

    U->>UI: Ingresa marcador
    UI->>A: Envía pronóstico
    A->>S: savePrediction()
    S->>P: canEditPrediction()
    P-->>S: Permitido / denegado
    S->>R: upsertPrediction()
    R->>DB: INSERT o UPDATE
    DB-->>R: Pronóstico guardado
    R-->>S: Resultado
    S-->>A: Confirmación
    A-->>UI: Pronóstico guardado

9. Server Components y Client Components
9.1 Server Components

Preferidos para:

Dashboard inicial.
Tabla.
Resultados.
Listados.
Páginas administrativas.
Datos que no requieren interacción inmediata.

Ventajas:

Menos JavaScript en cliente.
Mejor seguridad.
Acceso directo a servicios de servidor.
Mejor rendimiento inicial.
9.2 Client Components

Se utilizarán para:

Formularios interactivos.
Contadores regresivos.
Guardado automático.
Modales.
Menús.
Toasts.
Filtros dinámicos.
Componentes que usan estado local.

No deberá marcarse una página completa como cliente cuando solo un componente pequeño lo requiera.

10. Estrategia de API

La aplicación podrá combinar:

Server Actions.
Route Handlers.
Servicios internos.
10.1 Server Actions

Adecuadas para:

Formularios internos.
Operaciones autenticadas.
Acciones simples con respuesta directa.

Ejemplos:

Guardar pronóstico.
Aprobar usuario.
Crear jornada.
10.2 Route Handlers

Adecuados para:

Endpoints consumidos por JavaScript.
Health checks.
Exportaciones.
Integraciones futuras.
Operaciones que requieran métodos HTTP claros.
Herramientas de diagnóstico.
10.3 Servicios internos

Toda lógica deberá pasar por servicios.

No se deberá invocar Prisma directamente desde componentes o rutas, salvo casos muy simples y explícitamente aceptados.

11. Persistencia
11.1 Prisma

Prisma administrará:

Modelos.
Relaciones.
Migraciones.
Transacciones.
Consultas.
Tipos.
11.2 SQL directo

Solo se permitirá cuando:

Prisma no resuelva eficientemente la operación.
Exista una consulta analítica específica.
Se documente la razón.
Se utilicen parámetros.
Se cubra con pruebas.
11.3 Restricciones de base de datos

La base de datos deberá reforzar reglas como:

Correo único.
Nickname único.
Un pronóstico por usuario y partido.
Un equipo no puede jugar contra sí mismo.
Goles no negativos.
Un solo superadministrador activo, cuando la estrategia elegida lo permita.
Relaciones obligatorias.
Integridad referencial.
12. Transacciones

Operaciones obligatoriamente transaccionales:

Procesar resultado.
Corregir resultado.
Recalcular temporada.
Cerrar temporada.
Promover administrador.
Crear o cambiar partido doble cuando afecte puntos.
Restaurar datos.
Importar datos.
Limpiar datos de prueba.

Ejemplo conceptual:

await prisma.$transaction(async (tx) => {
  // leer partido
  // guardar resultado
  // calcular puntos
  // actualizar resúmenes
  // registrar auditoría
});

La auditoría de la operación deberá guardarse dentro de la misma transacción cuando sea posible.

13. Concurrencia

El sistema deberá prevenir:

Dos administradores procesando el mismo partido.
Dos solicitudes guardando un pronóstico después del cierre.
Dos usuarios creando el mismo nickname.
Doble uso de tokens.
Procesamiento duplicado.

Estrategias:

Restricciones únicas.
Transacciones.
Verificación de versión.
Bloqueo lógico.
Actualizaciones condicionales.
Idempotencia cuando corresponda.

Ejemplo:

UPDATE match
SET status = PROCESSING
WHERE id = ?
AND status IN (CLOSED, FINISHED_PENDING)

Solo una operación debería conseguir la transición.

14. Autenticación
14.1 Sesiones

Se recomienda autenticación basada en sesiones almacenadas en base de datos.

Cada sesión tendrá:

Identificador aleatorio.
Usuario.
Fecha de creación.
Fecha de expiración.
Último uso.
Revocación.
Información técnica opcional.

La cookie contendrá únicamente un identificador opaco.

14.2 Cookies

Configuración en producción:

HttpOnly: true
Secure: true
SameSite: Lax o más restrictivo cuando sea viable.
Path: /
Expiración controlada.
14.3 Contraseñas

Se utilizará:

Argon2id preferentemente.
bcrypt como alternativa compatible.

Nunca:

SHA simple.
MD5.
Contraseñas cifradas reversiblemente.
Texto plano.
14.4 Tokens

Los tokens de confirmación y recuperación:

Se generarán criptográficamente.
Se almacenarán como hash.
Tendrán expiración.
Serán de un solo uso.
Se invalidarán después de utilizarse.
15. Autorización

La autorización deberá validarse en servidor.

Ejemplo de niveles:

USER
ADMIN
SUPER_ADMIN

No se deberán repartir verificaciones de rol por toda la aplicación.

Se implementará un servicio central:

requireAuthenticatedUser()
requireAdmin()
requireSuperAdmin()

También podrán existir permisos específicos:

authorize(user, "MATCH_PROCESS")
authorize(user, "ADMIN_PROMOTE")
16. Manejo de tiempo

La zona oficial será:

America/Tegucigalpa
16.1 Persistencia

Las fechas deberán guardarse en UTC.

16.2 Presentación

Se mostrarán convertidas a hora de Honduras.

16.3 Cierre

El cierre se calculará en servidor:

scheduledStart - closingMinutes

Valor inicial:

closingMinutes = 5
16.4 Librería

Se podrá utilizar una librería moderna de fechas si reduce errores, pero deberá evitarse una dependencia innecesariamente grande.

17. Motor de puntuación

La lógica deberá ser una función pura.

Ejemplo:

type ScoreInput = {
  predictedHome: number;
  predictedAway: number;
  actualHome: number;
  actualAway: number;
  multiplier: number;
};

type ScoreResult = {
  category: "EXACT" | "PARTIAL" | "WRONG";
  basePoints: number;
  awardedPoints: number;
};

Ejemplo conceptual:

calculatePredictionScore(input): ScoreResult

Esta función:

No accede a base de datos.
No usa hora actual.
No registra logs.
No depende de Next.js.
Puede probarse de forma aislada.
18. Clasificación

La clasificación podrá implementarse de dos maneras:

Opción A: cálculo dinámico

Ventaja:

Siempre derivada.

Desventaja:

Mayor costo de consulta.
Opción B: tabla resumen

Ventaja:

Lectura rápida.
Dashboard sencillo.

Desventaja:

Requiere sincronización.
Decisión recomendada

Mantener:

Registros de puntuación por pronóstico como fuente derivada persistida.
Tabla resumen de clasificación.
Función de recalculo completo.

La tabla resumen nunca será la única fuente de verdad.

19. Auditoría

Se implementará un servicio central.

Ejemplo:

auditService.record({
  actorId,
  action,
  entityType,
  entityId,
  before,
  after,
  metadata,
});

Reglas:

No editar auditorías.
No borrar desde la aplicación.
Limitar datos sensibles.
No guardar contraseñas.
No guardar tokens completos.
No guardar secretos.
Evitar almacenar cuerpos excesivamente grandes.
20. Logging

Se distinguirán:

Logs técnicos

Para:

Errores.
Advertencias.
Fallos SMTP.
Problemas de conexión.
Tiempos de respuesta.
Auditoría funcional

Para:

Acciones administrativas.
Cambios de datos.
Procesamientos.
Roles.
Configuración.

No deberán confundirse.

Los logs técnicos podrán enviarse inicialmente a:

Consola estructurada.
Salida del proveedor de hosting.

No se utilizará un servicio externo de pago.

21. Manejo de errores

Se definirá una jerarquía de errores.

Ejemplos:

ApplicationError
ValidationError
AuthenticationError
AuthorizationError
ConflictError
NotFoundError
RateLimitError
InfrastructureError

Cada error deberá incluir:

Código interno.
Mensaje seguro.
Estado HTTP.
Detalles opcionales no sensibles.

El usuario no debe recibir:

Stack traces.
SQL.
Variables de entorno.
Información interna.
Confirmación de existencia de cuentas en recuperación.
22. Validación

La validación deberá existir en dos niveles:

Cliente

Para mejorar experiencia.

Servidor

Como validación definitiva.

Los esquemas deberán compartirse cuando sea posible.

Ejemplos:

Registro.
Login.
Pronóstico.
Jornada.
Partido.
Resultado.
Reprogramación.
23. Correo electrónico

Se creará una abstracción:

interface EmailProvider {
  send(message: EmailMessage): Promise<EmailResult>;
}

Implementación inicial:

GmailSmtpEmailProvider

Esto permitirá reemplazar Gmail sin modificar la lógica de negocio.

Plantillas:

Confirmación.
Recuperación.
Aprobación opcional.
Cambio de contraseña.
Notificación administrativa opcional.
24. Notificaciones internas

Las notificaciones deberán persistirse en base de datos.

Cada notificación tendrá:

Usuario.
Tipo.
Título.
Mensaje.
Enlace opcional.
Fecha.
Estado leída/no leída.

Podrán generarse cuando:

Un partido se reprograma.
Una cuenta se aprueba.
Un resultado se procesa.
Existen pronósticos pendientes.
Un partido cierra pronto.
25. Archivos e imágenes
25.1 Logos de equipos

Se almacenarán inicialmente en:

public/teams/
25.2 Logo de la aplicación
public/branding/logo.png
25.3 Patrocinadores

Podrán almacenarse:

En public/sponsors/.
En almacenamiento gratuito compatible.

Para Kickoff se priorizará la opción más simple.

25.4 Restricciones
Validar formato.
Limitar tamaño.
Optimizar imágenes.
Evitar ejecución de archivos.
No usar nombres originales directamente.
26. Configuración

La configuración se dividirá entre:

Variables de entorno

Para secretos y datos de infraestructura:

URL de base de datos.
Credenciales SMTP.
Secretos de sesión.
URL pública.
Entorno.
Configuración de base de datos

Para valores editables:

Nombre de la aplicación.
Temporada activa.
Minutos de cierre.
Puntos por exacto.
Puntos por parcial.
Multiplicador doble.
Modo mantenimiento.
Textos configurables.

No deben almacenarse credenciales SMTP desde la interfaz administrativa.

27. Variables de entorno

Archivo .env.example:

NODE_ENV=development
APP_URL=http://localhost:3000
APP_TIMEZONE=America/Tegucigalpa

DATABASE_URL=
DIRECT_DATABASE_URL=

SESSION_SECRET=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_APP_PASSWORD=
SMTP_FROM_NAME=Quiniela Nacional La Goleada
SMTP_FROM_EMAIL=

INITIAL_SETUP_TOKEN=

ENABLE_DIAGNOSTICS=false
ENABLE_SQL_CONSOLE=false
ENABLE_TEST_DATA_TOOLS=false

Nunca se deberá subir .env al repositorio.

28. Middleware

El middleware podrá utilizarse para:

Redirigir usuarios no autenticados.
Bloquear acceso básico a rutas protegidas.
Detectar modo mantenimiento.

No deberá usarse como única capa de autorización.

Cada acción sensible deberá validar permisos de nuevo en el servidor.

29. Caché

La caché deberá usarse con precaución.

Datos potencialmente cacheables:

Equipos.
Patrocinadores.
Texto de Cómo funciona.
Temporadas históricas.

Datos que requieren invalidación precisa:

Dashboard.
Pronósticos.
Clasificación.
Resultados.
Usuarios pendientes.
Auditorías.

La aplicación debe priorizar consistencia sobre una optimización prematura.

30. Rendimiento

Buenas prácticas:

Seleccionar solo columnas necesarias.
Evitar consultas N+1.
Usar paginación.
Crear índices.
Procesar por lotes cuando corresponda.
Optimizar imágenes.
Limitar datos enviados.
Utilizar Server Components.
Medir antes de optimizar.
31. Seguridad de diagnóstico

Las herramientas de diagnóstico deberán:

Estar desactivadas por defecto en producción.
Requerir superadministrador.
Requerir una bandera de entorno.
Registrar auditoría.
Evitar mostrar secretos.
Limitar consultas.
Limitar exportaciones sensibles.
Solicitar confirmación reforzada para escritura.
32. Exportaciones

Formatos iniciales:

CSV.
JSON.

Datos exportables:

Usuarios sin contraseñas ni tokens.
Equipos.
Temporadas.
Jornadas.
Partidos.
Pronósticos.
Resultados.
Clasificación.
Auditoría.
Configuración no sensible.

Las exportaciones deberán:

Registrar actor.
Registrar fecha.
Excluir secretos.
Respetar permisos.
33. Importaciones

Las importaciones no serán esenciales en la primera iteración, pero la arquitectura podrá prever:

Partidos desde CSV.
Equipos desde CSV.
Patrocinadores.

Toda importación deberá:

Validar primero.
Mostrar una previsualización.
Ejecutarse en transacción.
Informar errores por fila.
Registrar auditoría.
34. Pruebas
Unitarias

Para:

Puntuación.
Desempates.
Cierre.
Transiciones de estado.
Permisos.
Validaciones.
Integración

Para:

Repositorios.
Procesamiento.
Registro.
Tokens.
Recalculo.
Auditoría.
End-to-end

Para:

Registro completo.
Aprobación.
Login.
Pronóstico.
Cierre.
Procesamiento.
Tabla.
Reprogramación.
35. Entornos
Desarrollo
Base local o gratuita.
SMTP de prueba controlado.
Herramientas de diagnóstico activables.
Datos ficticios.
Testing
Base separada.
Datos aislados.
Limpieza automática.
No enviar correos reales.
Producción
Diagnóstico limitado.
Consola SQL deshabilitada por defecto.
Cookies seguras.
Logs sin datos sensibles.
Migraciones controladas.
36. Despliegue

flowchart LR
    B[Browser] --> H[Hosting gratuito Next.js]
    H --> P[(PostgreSQL gratuito)]
    H --> G[Gmail SMTP]
    GH[GitHub] --> H

Arquitectura inicial:

El despliegue deberá incluir:

Build.
Migraciones.
Variables de entorno.
Seed inicial de equipos.
Inicialización de superadministrador.
Health check.
Pruebas básicas.
37. Migraciones

Reglas:

Toda modificación de esquema tendrá migración.
No editar migraciones aplicadas.
Probar migraciones en entorno separado.
Respaldar antes de cambios importantes.
Documentar migraciones destructivas.
Evitar pérdida de datos.
38. Seeds

El seed inicial deberá crear:

Configuración base.
Doce equipos.
Valores de puntuación.
Minutos de cierre.
Textos básicos.

No deberá crear:

Usuarios reales.
Contraseñas conocidas.
Administradores por defecto.

El superadministrador se creará mediante el flujo seguro de inicialización.

39. Health checks

Endpoint interno:

GET /api/health

Respuesta pública mínima:

{
  "status": "ok"
}

La versión administrativa podrá verificar:

Base de datos.
SMTP.
Configuración.
Migraciones.
Tareas pendientes.

Nunca debe revelar secretos.

40. Escalabilidad

Kickoff está diseñado para una comunidad pequeña o mediana.

La arquitectura debe soportar razonablemente:

Cientos de usuarios.
Miles de pronósticos.
Varias temporadas históricas.
Múltiples administradores.

No se requiere:

Escalabilidad global.
Microservicios.
Kubernetes.
Colas distribuidas.
Infraestructura compleja.
41. Dependencias

Criterios para añadir paquetes:

Necesidad real.
Mantenimiento activo.
Licencia compatible.
Tamaño razonable.
Seguridad.
Compatibilidad.
Alternativas nativas.

No se añadirá una librería para resolver una función trivial.

42. Convenciones técnicas
TypeScript
Modo estricto.
Evitar any.
Evitar conversiones forzadas.
Usar tipos explícitos en fronteras.
Usar unknown para datos no confiables.
Nombres
Archivos: kebab-case.
Componentes: PascalCase.
Funciones: camelCase.
Constantes: UPPER_SNAKE_CASE.
Tablas y modelos: convención definida por Prisma.
Funciones
Pequeñas.
Cohesivas.
Con una responsabilidad clara.
Sin efectos secundarios ocultos.

43. Diagrama de módulos
flowchart TD
    AUTH[Auth] --> USERS[Users]
    USERS --> PRED[Predictions]

    TEAMS[Teams] --> MATCHES[Matches]
    SEASONS[Seasons] --> ROUNDS[Rounds]
    ROUNDS --> MATCHES

    MATCHES --> PRED
    MATCHES --> SCORE[Scoring]
    PRED --> SCORE

    SCORE --> STAND[Standings]

    USERS --> STAND
    USERS --> NOTIF[Notifications]

    MATCHES --> NOTIF

    ADMIN[Admin] --> USERS
    ADMIN --> MATCHES
    ADMIN --> AUDIT[Audit]
    ADMIN --> SETTINGS[Settings]

    DIAG[Diagnostics] --> AUDIT
    DIAG --> STAND
    DIAG --> DB[(Database)]

44. Decisiones prohibidas

No se deberá:

Implementar microservicios.
Usar autenticación de pago.
Introducir APIs deportivas pagadas.
Guardar contraseñas en texto plano.
Confiar en el reloj del cliente.
Calcular puntos en componentes.
Inferir orden por jornada.
Procesar resultados sin transacción.
Borrar auditorías.
Permitir cambios de correo.
Exponer Prisma al navegador.
Guardar secretos en base de datos editable.
Habilitar SQL libre en producción por defecto.
45. Decisiones pendientes de validación

Antes de programar deberán confirmarse:

Versión exacta de Node.js.
Versión exacta de Next.js.
Proveedor PostgreSQL gratuito.
Proveedor de hosting gratuito.
Disponibilidad vigente de sus planes.
Librería final de validación.
Argon2id o bcrypt.
Estrategia final de almacenamiento de imágenes.
Política exacta de reapertura tras reprogramación.

Estas decisiones deberán registrarse en:

docs/14-DecisionesArquitectonicas.md
46. Criterios de aceptación arquitectónicos

La arquitectura será aceptada cuando:

La lógica esté modularizada.
Las reglas no dependan de la UI.
El servidor valide cierres.
Los servicios sean probables de forma aislada.
El procesamiento use transacciones.
La clasificación sea reconstruible.
Los proveedores externos estén encapsulados.
Los secretos estén fuera del código.
La autorización exista en servidor.
La auditoría sea centralizada.
Las herramientas avanzadas estén protegidas.
El proyecto pueda desplegarse gratuitamente.
47. Relación con otros documentos

Consultar además:

docs/00-Project-Context.md
docs/01-PRD.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/14-DecisionesArquitectonicas.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
48. Conclusión

Kickoff utilizará una arquitectura monolítica modular, orientada a dominio y con responsabilidades claramente separadas.

La prioridad no será introducir complejidad técnica, sino garantizar:

Seguridad.
Integridad.
Claridad.
Mantenibilidad.
Rendimiento suficiente.
Operación gratuita.
Facilidad de despliegue.