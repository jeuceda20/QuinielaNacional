# Despliegue y Operación

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Guía inicial de despliegue  
**Objetivo:** Publicar y operar la aplicación utilizando únicamente servicios y planes gratuitos  
**Zona horaria de negocio:** `America/Tegucigalpa`

---

## 1. Propósito

Este documento define la estrategia para desplegar, configurar, validar, operar y mantener **Quiniela Nacional La Goleada – Kickoff**.

La guía cubre:

- Entornos.
- Requisitos previos.
- Proveedor de hosting.
- Base de datos PostgreSQL.
- Gmail SMTP.
- Variables de entorno.
- Migraciones.
- Seeds.
- Primer superadministrador.
- CI/CD.
- Backups.
- Monitoreo.
- Rollback.
- Seguridad de producción.
- Checklist de publicación.
- Operación sin costos obligatorios.

La disponibilidad y las condiciones de los planes gratuitos deberán verificarse en el momento real del despliegue. No se deberá asumir que los límites de un proveedor permanecerán iguales en el tiempo.

---

# 2. Principio de gratuidad

## DEP-001 — Sin costo obligatorio

La aplicación deberá poder mantenerse con costo mensual igual a cero, siempre que el uso permanezca dentro de los límites de los planes gratuitos elegidos.

---

## DEP-002 — Sin dependencia irreversible

La lógica de negocio no deberá acoplarse a un proveedor específico.

La aplicación debe poder migrarse a otro:

- Hosting compatible con Node.js.
- PostgreSQL.
- Proveedor SMTP.
- Almacenamiento de imágenes.

---

## DEP-003 — Verificación previa

Antes de crear cuentas o desplegar, deberán comprobarse:

- Disponibilidad del plan gratuito.
- Límites de uso.
- Política de suspensión por inactividad.
- Límites de base de datos.
- Límites de transferencia.
- Límites de funciones.
- Requisitos de tarjeta.
- Política de cobros automáticos.
- Condiciones de uso.

---

## DEP-004 — Sin cobro automático

Se priorizarán proveedores que:

- No generen cargos automáticos.
- No requieran habilitar facturación.
- Bloqueen o limiten el servicio antes de cobrar.
- Permitan revisar consumo.

---

# 3. Arquitectura de despliegue


flowchart LR
    U[Usuarios] --> WEB[Aplicación Next.js]
    WEB --> DB[(PostgreSQL)]
    WEB --> SMTP[Gmail SMTP]
    GIT[Repositorio GitHub] --> WEB
    ADMIN[Superadministrador] --> WEB

Componentes:

Frontend + Backend: Aplicación Next.js
Base de datos: PostgreSQL
Correo: Gmail SMTP
Código fuente: GitHub
Hosting: Proveedor gratuito compatible

4. Proveedores candidatos
4.1 Hosting

Proveedor seleccionado:

Netlify, plan Free.

El despliegue usa el runtime de Next.js de Netlify y se conecta a Supabase mediante variables configuradas únicamente para el contexto Production. Las vistas previas no deben recibir secretos ni la base de producción.

La selección final deberá basarse en:

Compatibilidad con Next.js.
Soporte para variables de entorno.
HTTPS.
Logs.
Builds desde GitHub.
Funciones de servidor.
Límites gratuitos suficientes.
Ausencia de cobros inesperados.
4.2 Base de datos

Proveedor seleccionado:

Supabase PostgreSQL, plan Free.

La aplicación utilizará el pooler compartido para el tráfico serverless y la conexión directa para migraciones, con TLS obligatorio. La configuración concreta está documentada en `docs/21-SUPABASE_PRODUCTION.md`.

La aplicación no deberá depender de características propietarias innecesarias.

Se utilizará PostgreSQL estándar mediante Prisma.

4.3 Correo

Proveedor inicial:

Gmail SMTP

Se utilizará:

Una cuenta genérica del proyecto.
Verificación en dos pasos.
Contraseña de aplicación.
Credenciales en variables de entorno.
4.4 Código fuente

Repositorio recomendado:

GitHub

El repositorio podrá ser:

Privado durante el desarrollo.
Público posteriormente si se decide publicar el proyecto.
5. Entornos

La aplicación tendrá al menos tres entornos lógicos.

5.1 Desarrollo

Uso:

Desarrollo local.
Pruebas rápidas.
Datos ficticios.
Diagnóstico habilitable.

Características:

NODE_ENV=development

No utilizar:

Usuarios reales.
Contraseñas reales.
Correos reales innecesarios.
Base de producción.
5.2 Testing

Uso:

Pruebas unitarias.
Integración.
End-to-end.
Simulaciones.

Características:

Base de datos separada.
SMTP falso.
Datos temporales.
Limpieza automática.
Reloj controlado.
5.3 Producción

Uso:

Usuarios reales.
Temporada activa.
Resultados reales.

Características:

NODE_ENV=production

Controles:

HTTPS.
Cookies seguras.
Diagnóstico restringido.
SQL deshabilitado.
Datos de prueba deshabilitados.
Logs sin secretos.
Backups periódicos.
6. Requisitos locales

Antes de iniciar el proyecto se necesitará:

Git.
Node.js en versión compatible.
npm, pnpm o gestor definido.
PostgreSQL local o acceso a base de desarrollo.
Cuenta GitHub.
Cuenta del proveedor de hosting.
Cuenta del proveedor PostgreSQL.
Cuenta Gmail del proyecto.

La versión exacta de Node.js deberá fijarse en:

.nvmrc

y en:

package.json

Ejemplo conceptual:

{
  "engines": {
    "node": ">=22"
  }
}

La versión definitiva deberá comprobarse con las dependencias reales.

7. Estructura de ramas

Estrategia recomendada:

main
develop
feature/*
fix/*
docs/*
main

Contiene código listo para producción.

develop

Integra funcionalidades antes de producción.

feature/*

Ejemplos:

feature/authentication
feature/predictions
feature/admin-panel
fix/*

Correcciones.

fix/prediction-closing-time
8. Flujo de despliegue
flowchart TD
    DEV[Desarrollo local] --> PR[Pull Request]
    PR --> CI[Validaciones automáticas]
    CI --> REVIEW[Revisión]
    REVIEW --> MERGE[Merge]
    MERGE --> BUILD[Build]
    BUILD --> MIGRATE[Migraciones]
    MIGRATE --> DEPLOY[Despliegue]
    DEPLOY --> SMOKE[Smoke tests]
    SMOKE --> PROD[Producción]


9. Variables de entorno

Archivo de referencia:

.env.example

Contenido sugerido:

NODE_ENV=development

APP_NAME=Quiniela Nacional La Goleada
APP_URL=http://localhost:3000
APP_TIMEZONE=America/Tegucigalpa

DATABASE_URL=
DIRECT_DATABASE_URL=

SESSION_SECRET=
INITIAL_SETUP_TOKEN=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_APP_PASSWORD=
SMTP_FROM_NAME=Quiniela Nacional La Goleada
SMTP_FROM_EMAIL=

ENABLE_DIAGNOSTICS=false
ENABLE_SQL_CONSOLE=false
ENABLE_SQL_WRITE=false
ENABLE_TEST_DATA_TOOLS=false

LOG_LEVEL=info
10. Generación de secretos

Los secretos deberán generarse mediante una fuente criptográfica.

Ejemplo con OpenSSL:

openssl rand -base64 48

Ejemplo con Node.js:

node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

Generar valores separados para:

SESSION_SECRET.
INITIAL_SETUP_TOKEN.
Otros tokens internos.

No reutilizar secretos entre desarrollo y producción.

11. Configuración de Gmail SMTP
11.1 Crear cuenta

Crear una cuenta genérica, por ejemplo:

quiniela.lagoleada@gmail.com

El nombre definitivo dependerá de disponibilidad.

11.2 Activar seguridad

En la cuenta:

Activar verificación en dos pasos.
Crear una contraseña de aplicación.
Guardar la contraseña únicamente en el proveedor de hosting.
No compartirla por mensajes ni incluirla en documentación.
11.3 Variables
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=correo@gmail.com
SMTP_APP_PASSWORD=contraseña-de-aplicacion
SMTP_FROM_NAME=Quiniela Nacional La Goleada
SMTP_FROM_EMAIL=correo@gmail.com
11.4 Prueba

Antes de producción:

Enviar correo de prueba.
Confirmar recepción.
Verificar remitente.
Verificar enlaces.
Revisar spam.
Confirmar que no se exponen tokens en logs.
11.5 Límites

El sistema deberá respetar los límites de Gmail.

Por ello:

No enviar recordatorios masivos innecesarios.
Limitar reenvíos.
Evitar correos por cada acción.
Priorizar notificaciones internas.
12. Configuración de PostgreSQL
12.1 Crear proyecto

En el proveedor seleccionado:

Crear proyecto.
Seleccionar región razonablemente cercana.
Guardar credenciales.
Habilitar TLS.
Revisar límites gratuitos.
Configurar copias o exportaciones cuando existan.
12.2 URLs

Prisma podrá requerir:

DATABASE_URL=
DIRECT_DATABASE_URL=

DATABASE_URL puede usar pooling.

DIRECT_DATABASE_URL podrá usarse para migraciones si el proveedor lo requiere.

12.3 Permisos

Se recomienda separar:

Usuario de ejecución.
Usuario de migraciones.

Cuando el plan gratuito no permita esta separación, se documentará el riesgo.

12.4 Conexiones

En entornos serverless:

Usar pooling.
Evitar abrir conexiones innecesarias.
Reutilizar el cliente Prisma.
Respetar el máximo del proveedor.

Ejemplo conceptual:

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
13. Instalación local
git clone <repository-url>
cd Quiniela-Nacional-La-Goleada
npm install

Copiar variables:

cp .env.example .env.local

Completar valores.

Generar cliente Prisma:

npx prisma generate

Aplicar migraciones:

npx prisma migrate dev

Ejecutar seed:

npm run db:seed

Iniciar:

npm run dev

Abrir:

http://localhost:3000
14. Scripts recomendados
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "verify:integrity": "tsx scripts/verify-integrity.ts",
    "recalculate:season": "tsx scripts/recalculate-season.ts"
  }
}
15. Migraciones
15.1 Desarrollo

Crear migración:

npx prisma migrate dev --name nombre_migracion

Ejemplo:

npx prisma migrate dev --name create_predictions
15.2 Producción

Aplicar:

npx prisma migrate deploy

Nunca ejecutar en producción:

npx prisma migrate reset
15.3 Antes de migrar

Para migraciones relevantes:

Crear respaldo.
Revisar SQL.
Probar en testing.
Ejecutar pruebas.
Verificar compatibilidad.
Planificar rollback.
15.4 Cambios destructivos

Una migración destructiva deberá:

Documentar el impacto.
Evitar pérdida de datos.
Usar migración por fases.
Mantener compatibilidad temporal cuando sea necesario.

Ejemplo:

Agregar nueva columna nullable.
Migrar datos.
Actualizar aplicación.
Convertir a requerida.
Eliminar columna antigua en otra versión.
16. Seed inicial

El seed de producción deberá crear:

Doce equipos.
Configuración base.
Valores de puntuación.
Minutos de cierre.
Nombre de aplicación.
Textos iniciales.

No deberá crear:

Contraseñas por defecto.
Usuarios reales.
Administrador conocido.
Tokens estáticos.
17. Primer superadministrador

Después del primer despliegue:

Confirmar que no existe superadministrador.
Acceder a la ruta de setup.
Proporcionar INITIAL_SETUP_TOKEN.
Completar nombre, apellido, nickname, correo, contraseña y equipo.
Confirmar la creación.
Verificar que el setup quede cerrado.
Rotar o eliminar INITIAL_SETUP_TOKEN.

La ruta de setup no deberá quedar abierta después de la inicialización.

18. Despliegue en hosting

Flujo general:

Crear proyecto en el proveedor.
Conectar repositorio GitHub.
Seleccionar rama main.
Configurar comando de build.
Configurar variables.
Ejecutar build.
Aplicar migraciones.
Ejecutar seed si es primera instalación.
Validar health check.
Completar setup inicial.
19. Comandos de build

Comando sugerido:

npm run build

Comando de instalación:

npm ci

Comando de migración:

npx prisma migrate deploy

Dependiendo del proveedor, podrá configurarse:

npx prisma generate && npx prisma migrate deploy && next build

No se deberá ejecutar el seed automáticamente en cada build.

20. Despliegue desde GitHub
20.1 Pull Request

Cada cambio deberá pasar:

Lint.
Typecheck.
Tests.
Build.
20.2 Merge a main

El merge podrá activar despliegue automático.

20.3 Protección de rama

Configurar cuando sea posible:

Pull Request obligatorio.
Checks exitosos.
Prohibir push directo.
Revisión para cambios críticos.
21. GitHub Actions

Pipeline conceptual:

name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build

Las pruebas de integración podrán requerir PostgreSQL temporal.

22. Migraciones en CI/CD

Se deberá evitar que múltiples builds ejecuten migraciones simultáneamente.

Opciones:

Ejecutar migraciones en un job único.
Ejecutarlas manualmente antes del despliegue.
Usar mecanismo del proveedor.
Separar migración y build.

Flujo recomendado:

Tests
→ Backup
→ Migrate
→ Deploy
→ Smoke test
23. Preview deployments

Los Pull Requests podrán generar entornos temporales si el proveedor lo permite gratuitamente.

Precauciones:

No usar base de producción.
No usar SMTP real.
No compartir secretos de producción.
Usar datos ficticios.
Desactivar herramientas peligrosas.
24. Configuración de dominio

La versión inicial podrá utilizar el subdominio gratuito del proveedor.

Ejemplo conceptual:

quiniela-la-goleada.provider.app

Un dominio personalizado solo se utilizará si existe uno disponible sin afectar la restricción de gratuidad.

La aplicación no dependerá de un dominio comprado.

25. HTTPS

El hosting deberá proporcionar TLS automático.

Verificar:

Redirección HTTP a HTTPS.
Certificado válido.
Cookies Secure.
Sin contenido mixto.
HSTS cuando sea seguro.
26. Cabeceras de seguridad

Configurar en Next.js:

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

La Content Security Policy deberá probarse antes de habilitarse en modo estricto.

27. Configuración de producción

Valores requeridos:

NODE_ENV=production
APP_URL=https://dominio-produccion
APP_TIMEZONE=America/Tegucigalpa

ENABLE_DIAGNOSTICS=false
ENABLE_SQL_CONSOLE=false
ENABLE_SQL_WRITE=false
ENABLE_TEST_DATA_TOOLS=false

No dejar habilitado:

Debug.
Setup abierto.
SQL de escritura.
Seeds de prueba.
Logs verbosos.
Credenciales temporales.
28. Health check

Endpoint:

GET /api/v1/health

Respuesta:

{
  "success": true,
  "data": {
    "status": "ok"
  }
}

No deberá revelar:

Host de base.
Credenciales.
Variables.
Stack.
Información sensible.
29. Smoke tests posteriores

Después de cada despliegue:

Abrir página pública.
Consultar health check.
Verificar conexión de base.
Abrir login.
Confirmar carga de equipos.
Probar sesión administrativa.
Consultar dashboard.
Verificar que SQL está deshabilitado.
Verificar que setup está cerrado.
Revisar logs.
30. Backups
30.1 Objetivo

Proteger:

Usuarios.
Temporadas.
Jornadas.
Partidos.
Pronósticos.
Resultados.
Clasificación.
Auditoría.
Configuración no sensible.
30.2 Tipos
Backup lógico completo

Formato:

SQL

o formato nativo del proveedor.

Exportación funcional

Formatos:

JSON
CSV
30.3 Frecuencia sugerida

Durante temporada activa:

Semanal

Antes de operaciones críticas:

Migración.
Recalculo.
Corrección masiva.
Cierre de temporada.
Limpieza.
Restauración.
30.4 Almacenamiento

Opciones gratuitas:

Descarga manual cifrada.
Repositorio privado separado, solo si no contiene datos personales sin cifrar.
Almacenamiento personal seguro.
Función de backup del proveedor, si está incluida.

No almacenar backups públicamente.

30.5 Nombre

Ejemplo:

kickoff-backup-2026-08-15T030000Z.json
30.6 Verificación

Un backup no se considerará válido hasta comprobar:

Que puede abrirse.
Que contiene datos.
Que tiene estructura esperada.
Que puede restaurarse en entorno de prueba.
31. Restauración
31.1 Antes de restaurar
Activar mantenimiento.
Crear backup del estado actual.
Verificar archivo.
Confirmar entorno.
Detener escrituras.
Registrar responsable.
31.2 Restauración
Restaurar en base temporal.
Ejecutar migraciones.
Verificar integridad.
Comparar conteos.
Probar login.
Probar tabla.
Probar partido procesado.
Cambiar producción si es correcto.
31.3 Después
Ejecutar smoke tests.
Revisar auditoría.
Desactivar mantenimiento.
Documentar incidente.
32. Rollback de aplicación

Si el despliegue falla:

Mantener o activar mantenimiento.
Revertir a la última versión estable.
Confirmar compatibilidad con el esquema.
Ejecutar smoke tests.
Revisar errores.
Documentar causa.

Una aplicación antigua no deberá ejecutarse sobre un esquema incompatible.

33. Rollback de migraciones

Prisma no genera automáticamente rollback completo.

Por eso cada migración crítica deberá tener:

Plan manual.
SQL inverso cuando sea seguro.
Backup previo.
Estrategia por fases.

No se deberá improvisar un rollback destructivo en producción.

34. Monitoreo gratuito

El monitoreo inicial podrá apoyarse en:

Logs del proveedor.
Health check.
Centro de diagnóstico.
Tabla de errores.
Auditoría.
Pruebas manuales.
Alertas gratuitas disponibles.

No se requiere una plataforma de monitoreo de pago.

35. Logs

Revisar:

Errores 500.
Fallos SMTP.
Conexiones a base.
Builds fallidos.
Procesamientos fallidos.
Rate limiting excesivo.
Intentos administrativos inválidos.

No registrar:

Passwords.
Tokens.
Cookies.
Credenciales.
Datos completos de conexión.
36. Manejo de inactividad del proveedor

Algunos proveedores gratuitos pueden suspender servicios inactivos.

La documentación operativa deberá indicar:

Si el proveedor suspende la base.
Cómo reactivarla.
Cuánto tarda.
Cómo comprobar su estado.
Cómo migrar si la política cambia.

Durante una temporada activa, el uso normal debería mantener el servicio activo, pero no debe asumirse sin verificar las condiciones vigentes.

37. Límites de uso

Se deberá revisar periódicamente:

Espacio de base.
Transferencia.
Builds.
Tiempo de ejecución.
Correos enviados.
Almacenamiento de imágenes.
Logs.
Conexiones.

El centro de diagnóstico podrá mostrar métricas disponibles sin depender de APIs de pago.

38. Optimización para plan gratuito

Medidas:

Logos optimizados.
Sin videos.
Sin archivos grandes.
Paginación.
Consultas eficientes.
Caché prudente.
Limpieza de tokens expirados.
Limpieza de sesiones antiguas.
Retención limitada de logs técnicos.
Exportaciones temporales.
Sin correos innecesarios.
39. Tareas de mantenimiento
Semanales durante temporada
Revisar errores.
Revisar espacio.
Crear backup.
Verificar SMTP.
Revisar usuarios pendientes.
Verificar integridad.
Mensuales
Actualizar dependencias seguras.
Revisar límites gratuitos.
Probar restauración.
Revisar sesiones antiguas.
Limpiar tokens expirados.
Antes de jornada
Verificar partidos.
Verificar fechas.
Verificar partido doble.
Revisar reprogramaciones.
Confirmar zona horaria.
40. Limpieza programada

Se podrán limpiar:

Tokens expirados.
Sesiones expiradas.
Intentos de login antiguos.
Exportaciones temporales.
Logs técnicos antiguos.
Datos de prueba identificados.

No limpiar automáticamente:

Pronósticos.
Resultados.
Auditoría.
Temporadas.
Clasificaciones históricas.
41. Cron jobs y tareas programadas

Se evitará depender de funciones programadas de pago.

Alternativas:

Ejecución al acceder a la aplicación.
Scripts manuales.
GitHub Actions programadas, si están disponibles dentro del uso gratuito.
Funciones gratuitas del proveedor.
Limpieza oportunista.

Ejemplo de limpieza oportunista:

Cuando un administrador abre el panel,
el sistema elimina tokens expirados antiguos.

Las operaciones críticas no deberán depender únicamente de cron jobs.

42. Recordatorios por correo

Los correos automáticos treinta minutos antes del cierre solo se desplegarán si existe una opción gratuita y fiable.

Si no existe:

Se usarán notificaciones internas.
Se mostrará el contador.
Se destacarán pendientes en dashboard.
La función de correo quedará desactivada.

No se deberá contratar un scheduler de pago.

43. Cambio de proveedor

La aplicación deberá poder migrarse mediante:

Exportar PostgreSQL.
Crear nueva base.
Aplicar migraciones.
Restaurar datos.
Actualizar DATABASE_URL.
Desplegar en nuevo hosting.
Actualizar APP_URL.
Probar SMTP.
Ejecutar smoke tests.
44. Migración de Gmail SMTP

Si Gmail deja de ser viable:

Implementar nuevo EmailProvider.
Mantener las mismas plantillas.
Cambiar variables.
Probar confirmación.
Probar recuperación.
No modificar lógica de usuarios.
45. Revisión de seguridad antes de publicar
 HTTPS activo.
 Cookies seguras.
 Secrets configurados.
 .env fuera del repositorio.
 Setup cerrado.
 SQL deshabilitado.
 Test data deshabilitado.
 Diagnóstico restringido.
 Rate limiting activo.
 Cabeceras configuradas.
 Auditoría funcionando.
 Backups probados.
 SMTP probado.
 CORS restrictivo.
 Errores sin stack.
46. Checklist de primer despliegue
Infraestructura
 Repositorio creado.
 Hosting creado.
 Base PostgreSQL creada.
 Gmail creado.
 HTTPS disponible.
Configuración
 Variables configuradas.
 Secrets generados.
 URL pública correcta.
 Zona horaria correcta.
 Flags peligrosos deshabilitados.
Base de datos
 Prisma generado.
 Migraciones aplicadas.
 Seed ejecutado.
 Doce equipos creados.
 Configuración base creada.
Aplicación
 Build exitoso.
 Health check exitoso.
 Equipos visibles.
 Registro carga.
 Email de prueba funciona.
Administración
 Superadministrador creado.
 Setup cerrado.
 Login administrativo correcto.
 Auditoría inicial creada.
Seguridad
 SQL apagado.
 Herramientas de prueba apagadas.
 Cookies seguras.
 Rate limiting.
 Backups configurados.
47. Checklist antes de iniciar temporada
 Temporada creada.
 Reglas verificadas.
 Cierre configurado en 5 minutos.
 Equipos correctos.
 Logos correctos.
 Administradores definidos.
 Jornadas iniciales creadas.
 Partidos configurados.
 Un doble por jornada.
 SMTP operativo.
 Backup creado.
 Prueba completa ejecutada.
 Usuarios aprobados.
 Zona horaria validada.
48. Checklist después de despliegue
 Página pública carga.
 Login funciona.
 Dashboard funciona.
 Tabla funciona.
 Pronósticos funcionan.
 Cierre se calcula correctamente.
 Admin puede crear partido.
 Auditoría registra.
 Correo funciona.
 No hay errores críticos.
 Herramientas avanzadas permanecen deshabilitadas.
49. Problemas comunes
Build falla por Prisma

Ejecutar:

npx prisma generate

Verificar:

DATABASE_URL.
Versión de Prisma.
Esquema válido.
Cliente generado.
No conecta a PostgreSQL

Revisar:

URL.
Contraseña.
TLS.
Pooling.
Límite de conexiones.
Estado del proyecto.
Restricciones de red.
Gmail rechaza login

Revisar:

Verificación en dos pasos.
Contraseña de aplicación.
Usuario SMTP.
Puerto.
Variable sin espacios.
Bloqueos de cuenta.
Cookies no funcionan

Revisar:

HTTPS.
Dominio.
Secure.
SameSite.
APP_URL.
Host real.
Hora incorrecta

Revisar:

APP_TIMEZONE=America/Tegucigalpa

Confirmar:

Fechas almacenadas en UTC.
Conversión en servidor.
No usar zona local del hosting.
Migración falla

No repetir sin revisar.

Leer error.
Revisar estado de migraciones.
Crear backup.
Probar en copia.
Corregir de forma controlada.
50. Criterios de aceptación del despliegue

El despliegue será aceptado cuando:

La aplicación opere por HTTPS.
La base esté conectada.
Las migraciones estén aplicadas.
Los seeds estén correctos.
El superadministrador pueda iniciar.
El setup esté cerrado.
Gmail SMTP funcione.
Los pronósticos funcionen.
La zona horaria sea correcta.
Los logs no expongan secretos.
Las herramientas peligrosas estén deshabilitadas.
Exista un backup verificable.
Los smoke tests sean exitosos.
El costo obligatorio sea cero.
51. Decisiones pendientes

Antes del despliegue real deberán confirmarse:

Límites vigentes de los planes gratuitos.
Versión de Node.js.
Estrategia de pooling.
Proceso exacto de migraciones.
Frecuencia de backups.
Almacenamiento de backups.
Dominio o subdominio.
Política de suspensión por inactividad.
Mecanismo gratuito para tareas programadas.

Estas decisiones deberán registrarse en:

docs/14-DecisionesArquitectonicas.md
52. Documentos relacionados

Consultar:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/10-ManualAdministrador.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
docs/17-CODEX_INSTRUCTIONS.md
53. Conclusión

El despliegue de Kickoff deberá priorizar:

Costo cero.
Seguridad.
Facilidad de recuperación.
Portabilidad.
Simplicidad operativa.
Integridad de los datos.

El proyecto no deberá depender de promesas permanentes de un proveedor gratuito.

La arquitectura y los respaldos deberán permitir migrar la aplicación si las condiciones de un servicio cambian en el futuro.
