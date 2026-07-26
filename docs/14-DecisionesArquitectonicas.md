# Decisiones Arquitectónicas

## Quiniela Nacional La Goleada

**Versión:** 1.0
**Nombre interno:** Kickoff
**Estado:** Arquitectura congelada para versión 1.0
**Tipo de documento:** Architecture Decision Record (ADR)
**Objetivo:** Registrar todas las decisiones arquitectónicas importantes del proyecto para evitar ambigüedades durante el desarrollo.

---

# 1. Propósito

Este documento registra todas las decisiones arquitectónicas relevantes del proyecto.

Su finalidad es responder preguntas como:

- ¿Por qué usamos PostgreSQL?
- ¿Por qué no usamos MongoDB?
- ¿Por qué existe un único servidor?
- ¿Por qué no usamos microservicios?
- ¿Por qué la autenticación es propia?
- ¿Por qué los pronósticos permanecen ocultos?
- ¿Por qué el servidor controla el cierre?
- ¿Por qué elegimos Prisma?
- ¿Por qué usamos Server Actions?

Cada decisión registrada aquí deberá considerarse **congelada** para la versión 1.0.

Modificar una decisión requiere:

- analizar impacto,
- actualizar documentación,
- actualizar pruebas,
- registrar una nueva decisión.

---

# 2. Convenciones

Cada decisión utiliza el siguiente formato:

## Estado

Aceptada

Contexto

Problema que se intenta resolver.

Decisión

La decisión tomada.

Alternativas consideradas

Otras posibilidades evaluadas.

Consecuencias

Impacto positivo y negativo.

Justificación

Motivos por los cuales se eligió esta solución.

ADR-001
Arquitectura Monolítica Modular
Estado

Aceptada.

Contexto

La aplicación es utilizada por una comunidad pequeña.

No existen cientos de miles de usuarios.

No existen múltiples equipos desarrollando servicios independientes.

No existe necesidad de despliegues separados.

Decisión

Kickoff será una aplicación:

Monolítica
Modular

Toda la aplicación se desplegará como una única unidad.

La lógica estará organizada por módulos internos.

Ejemplo:

Auth
Users
Teams
Matches
Predictions
Scoring
Standings
Audit
Diagnostics
Notifications
Alternativas consideradas
Microservicios

Descartado.

Razones:

mayor complejidad
mayor costo
más infraestructura
más monitoreo
más puntos de fallo
Backend separado + Frontend separado

Descartado.

No aporta beneficios para este proyecto.

Consecuencias

Positivas

menor complejidad
menor costo
despliegue sencillo
debugging sencillo
desarrollo rápido

Negativas

crecimiento futuro requerirá refactorización si el proyecto cambia de escala.
Justificación

El volumen esperado no justifica una arquitectura distribuida.

ADR-002
Next.js App Router
Estado

Aceptada.

Contexto

Se requiere:

SSR
Server Components
Server Actions
Route Handlers
buena experiencia SEO
buen rendimiento
Decisión

Utilizar:

Next.js App Router

No utilizar Pages Router.

Alternativas consideradas

React + Express

Descartado.

Razón:

Duplicación de proyecto.

Vite

Descartado.

No integra naturalmente:

Server Components
Server Actions
Consecuencias

Positivas

una sola aplicación
SSR
routing moderno
buen rendimiento

Negativas

curva de aprendizaje mayor.
Justificación

App Router representa la arquitectura actual recomendada por Next.js.

ADR-003
React Server Components por defecto
Estado

Aceptada.

Contexto

Muchas pantallas son principalmente de lectura.

Ejemplos:

clasificación
resultados
dashboard
historial

No necesitan JavaScript completo en cliente.

Decisión

Utilizar:

Server Components

como opción por defecto.

Client Components solo cuando sean necesarios.

Ejemplos de Client Components
formularios
inputs
modales
contador
toasts
drag & drop futuro
Alternativas consideradas

Todo Client Components.

Descartado.

Produce:

más JavaScript
mayor consumo
peor rendimiento inicial
Consecuencias

Positivas

menor bundle
SSR eficiente
mejor rendimiento

Negativas

mayor cuidado al dividir componentes.
ADR-004
TypeScript estricto
Estado

Aceptada.

Contexto

El dominio contiene:

reglas
cálculos
auditoría
permisos

Errores de tipos pueden producir errores de puntuación.

Decisión

Activar:

strict=true

No utilizar:

any

salvo casos excepcionales documentados.

Alternativas

JavaScript puro.

Descartado.

Consecuencias

Positivas

menos errores
refactorizaciones seguras
mejor soporte de IA

Negativas

mayor tiempo inicial.
ADR-005
Tailwind CSS
Estado

Aceptada.

Contexto

Se necesita:

desarrollo rápido
responsive
consistencia visual
Decisión

Toda la interfaz utilizará:

Tailwind CSS
Alternativas

CSS Modules

Descartado.

Bootstrap

Descartado.

Material UI

Descartado.

Justificación

Tailwind reduce CSS personalizado y acelera el desarrollo.

ADR-006
PostgreSQL como base de datos
Estado

Aceptada.

Contexto

La aplicación requiere:

relaciones
transacciones
integridad
restricciones
consultas complejas
auditoría
Decisión

Base de datos:

PostgreSQL
Alternativas

MongoDB

Descartado.

Razón:

El modelo es altamente relacional.

SQLite

Descartado.

Adecuado para pruebas.

No para producción compartida.

MySQL

Válido técnicamente.

No elegido porque Prisma tiene excelente integración con PostgreSQL y existen varios planes gratuitos.

Consecuencias

Positivas

ACID
transacciones
restricciones
excelente soporte

Negativas

mayor complejidad que SQLite.
ADR-007
Prisma ORM
Estado

Aceptada.

Contexto

Se necesita:

migraciones
tipado
consultas seguras
Decisión

Utilizar:

Prisma ORM
Alternativas

TypeORM

Descartado.

Knex

Descartado.

SQL manual

Solo para casos excepcionales.

Consecuencias

Positivas

tipado
migraciones
productividad

Negativas

dependencia del ORM.
ADR-008
Server Actions para formularios
Estado

Aceptada.

Contexto

La mayoría de formularios son internos.

Ejemplos:

login
registro
guardar pronóstico
aprobar usuario
Decisión

Utilizar:

Server Actions

cuando sean apropiadas.

Route Handlers

Reservados principalmente para:

APIs
paginación
exportaciones
diagnóstico
Justificación

Reduce código repetitivo y simplifica el flujo.

ADR-009
UUID como identificador
Estado

Aceptada.

Contexto

No queremos que los usuarios puedan inferir información mediante IDs consecutivos.

Decisión

Todos los recursos principales utilizarán:

UUID

Ejemplos:

Usuario
Partido
Jornada
Temporada
Pronóstico
Auditoría
Alternativas

Enteros autoincrementales.

Descartados.

Justificación

Mejor seguridad y menor capacidad de enumeración.

ADR-010
Hora del servidor como única autoridad
Estado

Aceptada.

Contexto

La regla más importante de la quiniela es el cierre.

No puede depender del reloj del navegador.

Decisión

La validación siempre será:

Hora del servidor

Nunca:

Hora del cliente
Consecuencias

Positivas

igualdad para todos
evita manipulación

Negativas

una solicitud iniciada antes del cierre puede ser rechazada si llega después.

Ese comportamiento es correcto.

ADR-011
Autenticación propia
Estado

Aceptada.

Contexto

La aplicación requiere:

aprobación manual
correo inmutable
flujo específico de registro
control total del ciclo de vida del usuario
Decisión

Implementar autenticación propia.

No utilizar:

NextAuth
Firebase Auth
Auth0
Clerk
Justificación

El flujo de aprobación y las reglas del proyecto son muy específicas y no requieren un proveedor externo.

ADR-012
Sesiones mediante cookies HttpOnly
Estado

Aceptada.

Decisión

Las sesiones utilizarán cookies:

HttpOnly
Secure (producción)
SameSite=Lax o más restrictivo

Nunca se almacenarán tokens de sesión en:

localStorage
sessionStorage
Justificación

Reduce la superficie de ataque frente a XSS y mantiene un modelo de autenticación más seguro.

ADR-013
Soft Delete
Estado

Aceptada.

Contexto

La información histórica de una quiniela no debe perderse.

Decisión

Las entidades principales utilizarán eliminación lógica.

Ejemplos:

Usuarios
Jornadas
Partidos
Patrocinadores
Justificación

Permite conservar historial y facilitar auditorías.

ADR-014
Auditoría Append-Only
Estado

Aceptada.

Decisión

La auditoría será exclusivamente de inserción.

No existirán funciones para:

editar
eliminar
modificar actor
modificar fecha
Justificación

Garantiza trazabilidad e integridad administrativa.

ADR-015
El servidor controla las reglas de negocio
Estado

Aceptada.

Contexto

El frontend puede modificarse o manipularse.

Decisión

Todas las reglas críticas deberán validarse nuevamente en el servidor.

Ejemplos:

cierre
permisos
roles
puntos
resultados
partido doble
visibilidad de pronósticos
clasificación
Justificación

El cliente nunca será considerado una fuente confiable.

Fin de la Parte 1

Las decisiones ADR-001 a ADR-015 constituyen el núcleo de la arquitectura de Kickoff y no deberán modificarse durante el desarrollo de la versión 1.0 salvo mediante una nueva decisión arquitectónica documentada.

# 14-DecisionesArquitectonicas.md

# Parte 2

---

# ADR-016

## Arquitectura Modular por Dominio

### Estado

Aceptada.

---

### Contexto

Conforme el proyecto crezca, organizar únicamente por tipo de archivo (`components`, `pages`, `services`) hará difícil localizar la lógica relacionada con una funcionalidad.

---

### Decisión

La aplicación se organizará principalmente por dominios funcionales.

Ejemplo:

```text
src/
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
│   ├── audit/
│   ├── diagnostics/
│   └── notifications/
```

Cada módulo podrá contener:

```text
application/
domain/
infrastructure/
ui/
schemas/
```

---

### Alternativas consideradas

Organización únicamente por tipo de archivo.

Descartada.

---

### Consecuencias

Positivas

- mayor mantenibilidad
- mejor escalabilidad
- menor acoplamiento

Negativas

- estructura inicial más extensa.

---

# ADR-017

## Separación de capas

### Estado

Aceptada.

---

### Decisión

Todo módulo seguirá la separación:

```text
UI
↓

Application

↓

Domain

↓

Infrastructure
```

Nunca:

```text
UI
↓

Base de datos
```

---

### Justificación

Las reglas deportivas no deben depender de React.

---

# ADR-018

## Regla de negocio fuera de la interfaz

### Estado

Aceptada.

---

### Contexto

Las reglas pueden ser utilizadas desde:

- Server Actions
- APIs
- Scripts
- Recalculo
- Diagnóstico

---

### Decisión

Toda regla deberá vivir dentro del dominio.

Ejemplos:

```text
calculateScore()

calculateStanding()

canEditPrediction()

canProcessMatch()
```

Nunca dentro de componentes React.

---

# ADR-019

## Prisma como única puerta de acceso a PostgreSQL

### Estado

Aceptada.

---

### Decisión

La aplicación accederá normalmente a PostgreSQL únicamente mediante Prisma.

SQL directo será permitido únicamente para:

- migraciones
- mantenimiento
- diagnóstico
- optimizaciones justificadas

---

### Justificación

Reduce:

- SQL Injection
- duplicación
- inconsistencias

---

# ADR-020

## Transacciones obligatorias

### Estado

Aceptada.

---

### Contexto

Existen operaciones que afectan múltiples tablas.

Ejemplo:

Procesar resultado.

---

### Decisión

Las siguientes operaciones serán transaccionales:

- procesar resultado
- corregir resultado
- recalcular temporada
- aprobar usuario
- cerrar temporada
- restauración
- importaciones

---

### Justificación

Nunca deben existir puntos parcialmente calculados.

---

# ADR-021

## Server Actions como primera opción

### Estado

Aceptada.

---

### Decisión

Cuando un formulario sea utilizado únicamente por la propia aplicación:

Utilizar:

```text
Server Actions
```

---

### Ejemplos

- login

- registro

- guardar pronóstico

- aprobar usuario

- crear jornada

---

### Route Handlers

Solo cuando realmente exista necesidad HTTP.

---

# ADR-022

## Route Handlers para APIs

### Estado

Aceptada.

---

### Decisión

Los Route Handlers se utilizarán principalmente para:

- exportaciones
- paginación
- Client Components
- diagnóstico
- descargas
- health
- pruebas HTTP

---

### Justificación

Separar claramente acciones internas de APIs.

---

# ADR-023

## Validación mediante Zod

### Estado

Aceptada.

---

### Contexto

Toda entrada debe validarse antes de llegar al dominio.

---

### Decisión

Los DTO utilizarán:

```text
Zod
```

Ejemplos:

```text
registerSchema

loginSchema

predictionSchema

seasonSchema

matchSchema
```

---

### Justificación

Un único sistema de validación.

---

# ADR-024

## DTO separados de entidades

### Estado

Aceptada.

---

### Decisión

Nunca exponer directamente entidades de Prisma hacia la interfaz.

Siempre utilizar:

```text
DTO

ViewModel

Mapper
```

---

### Justificación

Evita exponer información interna.

---

# ADR-025

## Repository Pattern

### Estado

Aceptada.

---

### Decisión

El dominio no conocerá Prisma.

El acceso será mediante repositorios.

Ejemplo:

```typescript
PredictionRepository

StandingRepository

UserRepository
```

---

### Justificación

Permite:

- testing
- mocks
- menor acoplamiento

---

# ADR-026

## Servicios de aplicación

### Estado

Aceptada.

---

### Decisión

Los casos de uso vivirán en Application.

Ejemplos:

```text
ApproveUserService

SavePredictionService

ProcessMatchResultService

RecalculateSeasonService
```

---

### Justificación

Un único flujo reutilizable.

---

# ADR-027

## Revalidación mediante Tags

### Estado

Aceptada.

---

### Contexto

Next.js permite invalidar caché.

---

### Decisión

Utilizar:

```text
revalidateTag()
```

Ejemplos:

```text
dashboard

standings

match:{id}

round:{id}
```

---

### Justificación

Evita recargar toda la aplicación.

---

# ADR-028

## Cache mínima

### Estado

Aceptada.

---

### Decisión

No cachear información privada.

Nunca cachear:

- dashboard

- perfil

- pronósticos abiertos

- auditoría

- diagnóstico

---

### Justificación

La privacidad tiene prioridad sobre el rendimiento.

---

# ADR-029

## Hora oficial UTC

### Estado

Aceptada.

---

### Decisión

Toda fecha persistida será UTC.

Presentación:

```text
America/Tegucigalpa
```

---

### Justificación

Evita inconsistencias entre servidores.

---

# ADR-030

## Estados explícitos

### Estado

Aceptada.

---

### Contexto

No utilizar múltiples booleanos.

Ejemplo incorrecto:

```text
processed=true

cancelled=false

closed=true
```

---

### Decisión

Utilizar enums.

Ejemplo:

SCHEDULED

RESCHEDULED

CLOSED

SUSPENDED

RESUMED

FINISHED_PENDING

PROCESSED

CANCELLED


---

### Justificación

Los estados son mutuamente excluyentes.

---

# Fin Parte 2

Las decisiones ADR-016 a ADR-030 establecen la arquitectura interna, el flujo de datos, la organización del código y la forma en que Next.js, Prisma y el dominio interactúan. Ninguna implementación deberá romper estas decisiones durante la versión 1.0.

# 14-DecisionesArquitectonicas.md

# Parte 3

---

# ADR-031

## Auditoría Append-Only

### Estado

Aceptada.

---

### Contexto

Las acciones administrativas deben poder reconstruirse incluso meses después.

No debe existir la posibilidad de alterar el historial.

---

### Decisión

La tabla de auditoría será:

```text
Append-Only
```

No existirán funciones para:

- editar registros
- eliminar registros
- modificar actor
- modificar fecha
- modificar valores anteriores

---

### Consecuencias

Positivas

- trazabilidad completa
- investigaciones sencillas
- mayor confianza

Negativas

- crecimiento constante de la tabla

---

### Justificación

La integridad histórica es más importante que ahorrar almacenamiento.

---

# ADR-032

## Soft Delete

### Estado

Aceptada.

---

### Contexto

Usuarios, partidos y temporadas forman parte del historial deportivo.

Eliminar físicamente información rompería auditorías e históricos.

---

### Decisión

Las entidades principales utilizarán:

```text
deletedAt
deletedBy
```

La eliminación física solo será posible mediante procedimientos excepcionales.

---

### Entidades

- User
- Season
- Round
- Match
- Sponsor

---

### Justificación

Permite restauración y mantiene integridad histórica.

---

# ADR-033

## Recalculo desde la fuente de verdad

### Estado

Aceptada.

---

### Contexto

La clasificación puede reconstruirse.

Los puntos almacenados nunca serán la fuente oficial.

---

### Decisión

La fuente de verdad será:

```text
Resultados oficiales

+

Pronósticos

+

Reglas de temporada

+

Multiplicador
```

Nunca:

```text
Standing
```

---

### Justificación

El sistema siempre podrá reconstruirse.

---

# ADR-034

## Seguridad por defecto

### Estado

Aceptada.

---

### Decisión

Las herramientas peligrosas permanecerán deshabilitadas.

Ejemplos:

```text
Diagnóstico

SQL Console

SQL Write

Test Data

Importaciones
```

Se habilitarán únicamente mediante:

Variables de entorno.

---

### Justificación

La configuración más segura debe ser la configuración inicial.

---

# ADR-035

## Centro de Diagnóstico restringido

### Estado

Aceptada.

---

### Decisión

El Centro de Diagnóstico será exclusivo para:

```text
SUPER_ADMIN
```

Nunca estará disponible para usuarios normales.

---

### Justificación

Contiene información operativa crítica.

---

# ADR-036

## SQL Console separada

### Estado

Aceptada.

---

### Contexto

Las consultas SQL representan una herramienta extremadamente poderosa.

---

### Decisión

Existirán dos niveles:

SQL Read

SQL Write

SQL Write permanecerá deshabilitada por defecto.

---

### Justificación

La mayoría de tareas administrativas nunca requerirá escritura directa.

---

# ADR-037

## Testing primero

### Estado

Aceptada.

---

### Decisión

Toda regla crítica deberá implementarse junto con sus pruebas.

Ejemplos:

- puntuación

- clasificación

- cierre

- privacidad

- procesamiento

- recalculo

---

### Justificación

Las reglas deportivas no deben romperse durante refactorizaciones.

---

# ADR-038

## Deployment gratuito

### Estado

Aceptada.

---

### Contexto

Uno de los requisitos principales del proyecto es:

```text
Costo obligatorio = 0
```

---

### Decisión

La arquitectura no dependerá de servicios pagos.

---

### Ejemplos

Permitido:

- GitHub

- Vercel

- PostgreSQL gratuito

- Gmail SMTP

---

Evitar depender de:

- Redis de pago

- Scheduler pago

- Observabilidad paga

- Servicios propietarios innecesarios

---

### Justificación

La aplicación debe poder mantenerse sin costos mensuales.

---

# ADR-039

## Portabilidad

### Estado

Aceptada.

---

### Contexto

Los planes gratuitos pueden cambiar.

---

### Decisión

La aplicación podrá migrarse.

No deberá depender de APIs propietarias.

---

### Ejemplos

Base:

```text
PostgreSQL
```

No:

```text
Funciones exclusivas de un proveedor
```

---

### Justificación

Reduce riesgo futuro.

---

# ADR-040

## Gmail SMTP

### Estado

Aceptada.

---

### Decisión

Versión 1.0 utilizará:

```text
Gmail SMTP
```

Mediante:

- contraseña de aplicación

- variables de entorno

---

### Justificación

Gratuito.

Suficiente para el volumen esperado.

---

# ADR-041

## Historial permanente

### Estado

Aceptada.

---

### Contexto

La quiniela tiene valor histórico.

---

### Decisión

Las temporadas finalizadas permanecerán disponibles.

Conservar:

- campeón

- clasificación

- puntos

- exactos

- parciales

- resultados

---

### Justificación

Permite consultar temporadas anteriores.

---

# ADR-042

## Arquitectura preparada para crecimiento

### Estado

Aceptada.

---

### Contexto

Aunque la versión 1.0 será sencilla, el proyecto puede crecer.

---

### Decisión

La arquitectura permitirá incorporar posteriormente:

- múltiples ligas

- múltiples temporadas activas

- API pública

- PWA

- aplicación móvil

sin reescribir completamente el núcleo.

---

### Justificación

Reducir deuda futura.

---

# ADR-043

## No depender del frontend

### Estado

Aceptada.

---

### Decisión

El frontend nunca será considerado confiable.

Toda validación crítica se repetirá en servidor.

Ejemplos:

- permisos

- cierre

- roles

- puntuación

- clasificación

- resultado

---

### Justificación

El navegador pertenece al usuario.

---

# ADR-044

## Simplicidad antes que complejidad

### Estado

Aceptada.

---

### Contexto

Muchas tecnologías modernas aumentarían el costo sin aportar valor.

---

### Decisión

Evitar:

- microservicios

- CQRS

- Event Sourcing

- Kafka

- RabbitMQ

- Kubernetes

- GraphQL

- WebSockets

mientras no exista una necesidad real.

---

### Justificación

La complejidad debe responder a un problema existente.

No a una moda.

---

# ADR-045

## Documentación como parte del producto

### Estado

Aceptada.

---

### Contexto

La documentación no será un elemento secundario.

---

### Decisión

Toda funcionalidad importante deberá tener:

- documentación

- pruebas

- criterios de aceptación

- decisiones registradas

---

### Justificación

Facilita:

- mantenimiento

- incorporación de nuevos desarrolladores

- uso de IA

- auditorías

---

# ADR-046

## Compatibilidad con IA

### Estado

Aceptada.

---

### Contexto

El proyecto será desarrollado parcialmente utilizando agentes como Codex.

---

### Decisión

La arquitectura deberá favorecer:

- nombres descriptivos

- módulos pequeños

- funciones puras

- baja complejidad ciclomática

- documentación cercana al código

- pruebas claras

---

### Justificación

Reduce errores de generación automática.

---

# ADR-047

## Un único estándar de código

### Estado

Aceptada.

---

### Decisión

Todo el proyecto seguirá:

- TypeScript estricto

- ESLint

- Prettier

- Convenciones únicas

No coexistirán estilos distintos.

---

### Justificación

Facilita mantenimiento.

---

# ADR-048

## El dominio manda

### Estado

Aceptada.

---

### Contexto

La tecnología puede cambiar.

Las reglas deportivas no.

---

### Decisión

Si existe conflicto entre:

Tecnología

y

Regla deportiva

La regla deportiva tendrá prioridad.

---

### Ejemplo

Si una optimización rompe la privacidad de los pronósticos:

La optimización será descartada.

---

### Justificación

La confianza de los participantes es el activo principal.

---

# ADR-049

## Cambios posteriores

### Estado

Aceptada.

---

### Decisión

Toda modificación importante requerirá:

1.

Nueva ADR.

2.

Actualización de documentación.

3.

Actualización de pruebas.

4.

Evaluación de impacto.

---

### Justificación

Evita cambios improvisados.

---

# ADR-050

## Congelamiento de arquitectura versión 1.0

### Estado

Aceptada.

---

### Decisión

Para la versión 1.0 quedan congeladas las decisiones relacionadas con:

- arquitectura

- autenticación

- modelo de datos

- reglas deportivas

- privacidad

- procesamiento

- auditoría

- despliegue

- diagnóstico

- testing

- seguridad

No deberán modificarse durante el desarrollo salvo una decisión arquitectónica formal.

---

# ADR-051

## Supabase PostgreSQL para producción

### Estado

Aceptada.

---

### Contexto

El proyecto es una comunidad futbolera sin ingresos y debe operar sin costo obligatorio. Se requiere una base PostgreSQL administrada para producción, compatible con Prisma y separada de preview, desarrollo y pruebas.

---

### Decisión

La base de producción será un proyecto de Supabase PostgreSQL en el plan Free.

- La aplicación serverless utilizará el Shared Pooler en modo transaction.
- Las migraciones y exportaciones usarán la conexión directa, o el pooler en modo session cuando el ejecutor no disponga de IPv6.
- Las credenciales se guardarán exclusivamente como secretos del hosting.
- No se habilitarán complementos ni servicios que impliquen cobro.

---

### Consecuencias

Se mantiene PostgreSQL estándar y Prisma como única vía normal de acceso, por lo que la portabilidad se conserva. El equipo deberá revisar los límites y políticas vigentes del plan Free, conservar respaldos verificables y migrar antes de aceptar costos si las condiciones cambian.

---

# ADR-052

## Netlify Free para hosting de producción

### Estado

Aceptada.

---

### Contexto

La aplicación Next.js requiere HTTPS, variables de entorno protegidas, despliegue desde GitHub y un costo obligatorio igual a cero para una comunidad futbolera sin ingresos.

---

### Decisión

La aplicación se desplegará en Netlify Free desde la rama `main`.

- Las variables de producción se configuran solo en el contexto Production.
- El comando de build ejecuta `npx prisma migrate deploy && npm run build`.
- Las migraciones usan el Shared Pooler de Supabase en modo session cuando Netlify no dispone de IPv6 para la conexión directa.
- Preview y ramas no reciben secretos de producción.

---

### Consecuencias

Cada despliegue de producción aplica migraciones pendientes antes de publicar la aplicación. El uso y las condiciones del plan Free deben revisarse periódicamente; si cambian, la aplicación puede trasladarse a otro hosting Node.js compatible sin modificar el dominio.

---

# Resumen de decisiones

Las siguientes tecnologías quedan oficialmente adoptadas:

| Área | Decisión |
|-------|----------|
| Arquitectura | Monolito Modular |
| Framework | Next.js App Router |
| UI | React + Tailwind |
| Lenguaje | TypeScript estricto |
| Base de datos | PostgreSQL administrado en Supabase Free |
| ORM | Prisma |
| Validación | Zod |
| Autenticación | Propia |
| Sesiones | Cookies HttpOnly |
| IDs | UUID |
| API | Server Actions + Route Handlers |
| Testing | Vitest + Playwright |
| Deployment | Hosting gratuito |
| Email | Gmail SMTP |
| Auditoría | Append-Only |
| Eliminación | Soft Delete |
| Fuente de verdad | Resultados + Pronósticos |
| Diagnóstico | Solo Super Admin |
| SQL | Deshabilitado por defecto |

---

# Procedimiento para modificar una ADR

Cualquier cambio futuro deberá seguir este flujo:

```text
Necesidad detectada
        │
        ▼
Análisis técnico
        │
        ▼
Evaluación de impacto
        │
        ▼
Nueva ADR
        │
        ▼
Actualizar documentación
        │
        ▼
Actualizar pruebas
        │
        ▼
Actualizar implementación
```

Ninguna decisión arquitectónica importante deberá cambiar únicamente mediante código.

---

# Documentos relacionados

- README.md
- docs/00-Project-Context.md
- docs/01-PRD.md
- docs/02-Arquitectura.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/05-UI-UX.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/09-Deployment.md
- docs/10-ManualAdministrador.md
- docs/11-ManualUsuario.md
- docs/12-CentroDiagnostico.md
- docs/13-Roadmap.md
- docs/15-Riesgos.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md

---

# Conclusión

La arquitectura de **Kickoff** prioriza:

- simplicidad,
- mantenibilidad,
- seguridad,
- reproducibilidad,
- portabilidad,
- bajo costo operativo.

Todas las decisiones registradas en este documento constituyen la base arquitectónica oficial de la versión **1.0**.

Cualquier desviación deberá justificarse mediante una nueva Architecture Decision Record (ADR) y actualizar toda la documentación relacionada antes de implementarse.
