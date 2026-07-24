# Deployment Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** CI/CD, despliegue, piloto y puesta en producción  
**Tareas principales:** TASK-117 a TASK-138  
**Tipo:** Prompt maestro de fase  
**Aplicación:** Ejecutar una sola tarea de esta fase por vez

---

# 1. Propósito

Este documento define el contexto específico para desplegar **Quiniela Nacional La Goleada – Kickoff** de forma segura, reproducible y compatible con operación gratuita.

Esta fase incluye:

- Integración continua.
- Entornos de preview.
- Base de datos de producción.
- Hosting.
- Gmail SMTP de producción.
- Migraciones.
- Seed base.
- Setup inicial.
- Smoke tests.
- Piloto.
- Simulación de temporada.
- Verificación de recalculo.
- Backup y restauración.
- Revisión final de seguridad.
- Publicación de la primera jornada.
- Monitoreo inicial.

Esta fase no debe utilizarse para completar funcionalidades pendientes.

El despliegue no corrige una aplicación incompleta.

---

# 2. Uso obligatorio

Este prompt debe utilizarse junto con:

```text
prompts/00-global-context.md
prompts/09-task-template.md
docs/09-Deployment.md
docs/19-IMPLEMENTATION_PLAN.md
```

Formato recomendado:

```text
Lee y aplica:

- prompts/00-global-context.md
- prompts/08-deployment.md
- prompts/09-task-template.md

Implementa únicamente TASK-XXX de
docs/19-IMPLEMENTATION_PLAN.md.
```

No solicitar:

```text
Despliega todo a producción.
```

La regla continúa siendo:

```text
Una ejecución = una tarea
```

---

# 3. Tareas cubiertas

Este prompt aplica a:

```text
TASK-117 — Crear pipeline CI
TASK-118 — Configurar entorno de preview
TASK-119 — Crear base de producción
TASK-120 — Configurar hosting
TASK-121 — Configurar Gmail SMTP de producción
TASK-122 — Aplicar migraciones de producción
TASK-123 — Ejecutar seed base
TASK-124 — Crear superadministrador inicial
TASK-125 — Cerrar setup
TASK-126 — Ejecutar smoke tests
TASK-127 — Crear temporada ficticia completa
TASK-128 — Simular temporada completa
TASK-129 — Comparar recalculo
TASK-130 — Probar backup y restore
TASK-131 — Ejecutar piloto con usuarios reales
TASK-132 — Corregir hallazgos del piloto
TASK-133 — Revisión final de seguridad
TASK-134 — Revisión final de documentación
TASK-135 — Crear backup inicial de producción
TASK-136 — Crear temporada oficial
TASK-137 — Publicar primera jornada
TASK-138 — Monitorear primera jornada
```

---

# 4. Objetivo de la fase

Al finalizar esta fase debe existir:

```text
Código validado por CI
+
Entornos separados
+
Base de producción segura
+
Aplicación desplegada
+
Migraciones controladas
+
Setup cerrado
+
Backups probados
+
Piloto ejecutado
+
Primera jornada publicada
+
Monitoreo operativo
```

La aplicación debe poder reconstruirse y desplegarse nuevamente sin depender de pasos no documentados.

---

# 5. Documentación obligatoria

Consultar según la tarea:

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
docs/10-ManualAdministrador.md
docs/11-ManualUsuario.md
docs/12-CentroDiagnostico.md
docs/13-Roadmap.md
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
docs/19-IMPLEMENTATION_PLAN.md
```

Las decisiones concretas sobre proveedores deben registrarse en documentación y ADR cuando corresponda.

---

# 6. Principios de despliegue

## 6.1 Producción no es un entorno de pruebas

Nunca utilizar producción para:

- Probar migraciones por primera vez.
- Ejecutar datos ficticios.
- Desarrollar funcionalidades.
- Validar scripts destructivos.
- Experimentar con configuración.
- Probar SQL manual no revisado.

Todo cambio debe validarse primero en:

```text
Local
↓
Testing
↓
Preview o staging
↓
Producción
```

---

## 6.2 Despliegue reproducible

El despliegue debe depender de:

- Código versionado.
- Variables de entorno.
- Migraciones versionadas.
- Scripts versionados.
- Documentación.
- Pipeline automatizado.

No depender de:

- Cambios manuales no registrados.
- Archivos locales personales.
- Credenciales dentro del repositorio.
- Pasos conocidos por una sola persona.

---

## 6.3 Portabilidad

La aplicación debe permanecer portable.

No acoplar la lógica de negocio a:

- APIs propietarias de un host.
- Base de datos no estándar.
- Servicios de autenticación externos.
- Funciones exclusivas de un proveedor sin abstracción.

El proveedor de hosting puede cambiar sin reescribir el dominio.

---

## 6.4 Operación gratuita

La arquitectura objetivo debe mantenerse dentro de opciones gratuitas.

Antes de activar un servicio verificar:

- Límite mensual.
- Límite de almacenamiento.
- Límite de conexiones.
- Tiempo de ejecución.
- Suspensión por inactividad.
- Tráfico.
- Retención de logs.
- Política de backups.
- Posibles cargos automáticos.

No introducir una tarjeta o servicio facturable sin autorización explícita.

---

# 7. Entornos

Deben existir como mínimo:

```text
Development
Test
Preview o Staging
Production
```

Cada entorno debe tener:

- Base independiente.
- Variables independientes.
- Secretos independientes.
- URLs independientes.
- Configuración identificable.

Nunca compartir la base de producción con preview.

---

## 7.1 Development

Uso:

- Desarrollo local.
- Migraciones nuevas.
- Datos ficticios.
- Debugging.

Puede usar:

- PostgreSQL local.
- Docker Compose.
- FakeEmailProvider.

No usar secretos de producción.

---

## 7.2 Test

Uso:

- Unit tests.
- Integration tests.
- E2E.

Debe:

- Ser aislado.
- Poder limpiarse.
- Usar datos ficticios.
- Bloquear conexiones de producción.

---

## 7.3 Preview o Staging

Uso:

- Validación de Pull Requests.
- Smoke tests.
- Pruebas visuales.
- Piloto interno.

Debe usar:

- Base separada.
- SMTP falso o restringido.
- Setup propio.
- Sin datos reales innecesarios.

---

## 7.4 Production

Uso exclusivo:

- Competencia oficial.
- Usuarios reales.
- Resultados oficiales.
- Clasificación oficial.

Debe tener:

- HTTPS.
- Cookies Secure.
- Diagnóstico restringido.
- SQL Console deshabilitada.
- Herramientas de test deshabilitadas.
- Backups.
- Setup cerrado.

---

# 8. Variables de entorno

Las variables deben configurarse en cada entorno.

Mínimas previstas:

```text
NODE_ENV
APP_URL
APP_TIMEZONE
DATABASE_URL
DIRECT_DATABASE_URL
SESSION_SECRET
INITIAL_SETUP_TOKEN
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_APP_PASSWORD
EMAIL_FROM
ENABLE_DIAGNOSTICS
ENABLE_SQL_CONSOLE
ENABLE_SQL_WRITE
ENABLE_TEST_DATA_TOOLS
```

Puede haber otras variables aprobadas.

---

## 8.1 Reglas

Nunca:

- Guardar secretos en Git.
- Copiar valores reales a `.env.example`.
- Imprimir variables completas.
- Reutilizar SESSION_SECRET entre entornos.
- Reutilizar INITIAL_SETUP_TOKEN después del setup.
- Exponer variables server-only con prefijo público.

---

## 8.2 Producción

Configuración recomendada:

```text
ENABLE_DIAGNOSTICS=false
ENABLE_SQL_CONSOLE=false
ENABLE_SQL_WRITE=false
ENABLE_TEST_DATA_TOOLS=false
```

El diagnóstico puede habilitarse de forma controlada si la documentación lo exige, pero nunca debe exponer secretos.

---

# 9. TASK-117 — Pipeline CI

Crear un pipeline que se ejecute al menos en:

- Pull Requests.
- Cambios hacia rama principal.
- Ejecución manual cuando corresponda.

---

## 9.1 Pasos mínimos

```text
Checkout
↓
Configurar runtime
↓
Instalar dependencias con lockfile
↓
Format check
↓
Lint
↓
Typecheck
↓
Unit tests
↓
Integration tests
↓
Build
↓
E2E smoke cuando sea viable
```

---

## 9.2 Instalación reproducible

Utilizar el mecanismo correspondiente al lockfile.

Ejemplo:

```bash
npm ci
```

No usar una instalación que cambie versiones silenciosamente.

---

## 9.3 Versiones

Fijar o declarar:

- Versión de Node.js.
- Gestor de paquetes.
- PostgreSQL de CI.
- Variables de test.

No depender de la versión predeterminada cambiante del runner.

---

## 9.4 Secretos en CI

Utilizar secretos del proveedor de CI.

No:

- Escribirlos en workflow.
- Imprimirlos.
- Enviarlos a Pull Requests no confiables.
- Permitir que forks accedan a producción.

---

## 9.5 Base de integración

El pipeline puede levantar PostgreSQL como servicio.

Debe:

- Usar una base efímera.
- Aplicar migraciones.
- Ejecutar seed de pruebas si se requiere.
- Limpiar al finalizar.

---

## 9.6 Fallos

Cualquier fallo obligatorio debe bloquear merge.

No permitir:

```text
continue-on-error
```

en lint, typecheck, tests o build críticos.

---

## 9.7 Artefactos

Puede conservar:

- Reportes de pruebas.
- Capturas E2E.
- Trazas.
- Cobertura.

No conservar:

- `.env`.
- Dumps con datos reales.
- Logs con secretos.

---

## 9.8 Pruebas mínimas

- Pipeline exitoso.
- Lint fallido bloquea.
- Typecheck fallido bloquea.
- Test fallido bloquea.
- Build fallido bloquea.
- Secretos no aparecen en logs.

---

# 10. TASK-118 — Entorno de preview

Cada Pull Request puede generar un entorno temporal si el proveedor lo permite gratuitamente.

---

## 10.1 Aislamiento

Preview no debe conectarse a producción.

Debe usar:

- Base específica.
- Base compartida de preview con datos ficticios, si se controla.
- Ramas de base, si el proveedor gratuito lo permite.

No usar DATABASE_URL de producción.

---

## 10.2 Email

Preferir:

```text
FakeEmailProvider
```

o una bandeja de prueba.

No enviar emails reales desde previews.

---

## 10.3 Acceso

Si el preview expone funciones administrativas:

- Usar datos ficticios.
- Proteger con credenciales de prueba.
- Evitar indexación.
- No colocar información real.

---

## 10.4 Limpieza

Los entornos temporales deben poder eliminarse sin afectar datos permanentes.

Documentar:

- Creación.
- Migración.
- Seed.
- Eliminación.

---

# 11. TASK-119 — Base de producción

La base debe ser PostgreSQL compatible con Prisma.

---

## 11.1 Selección

Evaluar:

- Plan gratuito real.
- Almacenamiento.
- Conexiones.
- Pooling.
- Backups.
- Suspensión.
- Región.
- Latencia.
- Exportación.
- Portabilidad.

Registrar la decisión final en documentación.

---

## 11.2 Región

Preferir una región cercana a:

- Usuarios.
- Hosting de la aplicación.

Evitar diferencias geográficas innecesarias entre aplicación y base.

---

## 11.3 Pooling

Configurar correctamente:

```text
DATABASE_URL
```

para runtime y pooling, cuando el proveedor lo requiera.

Utilizar:

```text
DIRECT_DATABASE_URL
```

para migraciones directas cuando sea necesario.

No intercambiar ambas sin comprender el proveedor.

---

## 11.4 Permisos

El usuario de runtime debe tener solo permisos necesarios.

Si es viable:

- Usuario de migración.
- Usuario de aplicación.
- Usuario de solo lectura para diagnóstico.

No utilizar superusuario de base como credencial normal.

---

## 11.5 SSL

La conexión a producción debe usar cifrado según el proveedor.

No desactivar verificación SSL de forma insegura.

---

## 11.6 Prueba inicial

Antes de migrar:

- Verificar conexión.
- Verificar esquema vacío esperado.
- Confirmar entorno.
- Confirmar que no es una base compartida.
- Registrar fecha y responsable.

---

# 12. TASK-120 — Hosting

El hosting debe soportar:

- Next.js App Router.
- Server Components.
- Server Actions.
- Route Handlers.
- Variables secretas.
- HTTPS.
- Conexión PostgreSQL.
- Build reproducible.

---

## 12.1 Configuración

Definir:

- Rama de producción.
- Comando de build.
- Directorio raíz.
- Versión de Node.js.
- Variables.
- Dominio.
- Región cuando sea configurable.

---

## 12.2 HTTPS

Producción debe servirse únicamente mediante HTTPS.

Redirigir HTTP a HTTPS.

Las cookies deben usar:

```text
Secure
```

---

## 12.3 Dominio

Configurar:

- Dominio principal.
- APP_URL exacta.
- Redirecciones canónicas.
- Certificado.
- DNS.

No construir enlaces de correo con dominios temporales después del lanzamiento.

---

## 12.4 Funciones serverless

Revisar límites de:

- Tiempo.
- Memoria.
- Tamaño de payload.
- Conexiones.
- Región.

Procesamiento y recalculo deben probarse dentro de esos límites.

No asumir que una función de larga duración completará sin pruebas.

---

## 12.5 Logs

Configurar logs mínimos útiles.

No registrar:

- Tokens.
- Cookies.
- Passwords.
- Variables.
- Connection strings.

---

# 13. TASK-121 — Gmail SMTP de producción

Configurar Gmail mediante:

```text
App Password
```

No usar la contraseña normal de la cuenta.

---

## 13.1 Cuenta

Preferir una cuenta dedicada al proyecto.

Configurar:

- SMTP_USER.
- SMTP_APP_PASSWORD.
- EMAIL_FROM.
- Nombre visible.

---

## 13.2 Seguridad

La App Password debe:

- Guardarse como secreto.
- No compartirse por Git.
- Rotarse si se expone.
- No aparecer en diagnóstico.
- No incluirse en backups funcionales.

---

## 13.3 Prueba

Enviar un correo de prueba controlado a una dirección autorizada.

Verificar:

- Remitente.
- Asunto.
- Texto.
- HTML.
- Enlaces.
- APP_URL.
- Entrega.
- Spam.

No usar usuarios reales para pruebas masivas.

---

## 13.4 Fallos

Una falla SMTP no debe corromper:

- Registro.
- Aprobación.
- Procesamiento.
- Reprogramación.

Debe quedar un mecanismo de reintento manual apropiado.

---

# 14. TASK-122 — Migraciones de producción

Las migraciones deben aplicarse mediante:

```bash
prisma migrate deploy
```

o el comando oficial equivalente del proyecto.

No utilizar en producción:

```bash
prisma migrate dev
```

---

## 14.1 Precondiciones

Antes de migrar:

- CI exitoso.
- Backup si existen datos.
- Migración probada en base vacía.
- Migración probada sobre copia representativa cuando aplique.
- SQL revisado.
- Variables confirmadas.
- Ventana operativa definida.

---

## 14.2 Revisión

Revisar:

- DROP.
- ALTER destructivo.
- Columnas NOT NULL.
- Defaults.
- Índices.
- Locks.
- Cascadas.
- Conversión de datos.

No ejecutar una migración destructiva sin plan de recuperación.

---

## 14.3 Registro

Documentar:

- Versión.
- Commit.
- Migraciones aplicadas.
- Fecha.
- Resultado.
- Responsable.
- Backup relacionado.

---

## 14.4 Fallo

Si falla:

1. No ejecutar comandos aleatorios.
2. Capturar error seguro.
3. Verificar estado de migraciones.
4. Detener deployment.
5. Aplicar plan documentado.
6. No modificar manualmente la tabla de migraciones sin análisis.

---

# 15. TASK-123 — Seed base de producción

Ejecutar únicamente el seed seguro definido en TASK-016.

Debe crear:

- Equipos.
- Configuración mínima.
- Datos maestros aprobados.

No debe crear:

- Usuarios ficticios.
- Administradores.
- Pronósticos.
- Resultados.
- Temporadas ficticias.
- Passwords conocidas.

---

## 15.1 Idempotencia

El seed debe poder ejecutarse de nuevo sin duplicar datos.

Verificar conteos antes y después.

---

## 15.2 Entorno

El script debe detectar producción y ejecutar únicamente operaciones autorizadas.

No incluir opciones ocultas que generen datos de prueba en producción.

---

# 16. TASK-124 — Superadministrador inicial

Crear el primer SUPER_ADMIN mediante el flujo de setup.

No mediante:

- SQL manual.
- Seed.
- Prisma Studio.
- Edición directa.
- Script improvisado.

---

## 16.1 Preparación

Antes de ejecutar:

- Confirmar base.
- Confirmar que no existen usuarios.
- Configurar INITIAL_SETUP_TOKEN.
- Abrir ruta o acción de setup.
- Tener datos definitivos del administrador.

---

## 16.2 Ejecución

Verificar:

- Usuario ACTIVE.
- Email confirmado.
- Rol SUPER_ADMIN.
- Password hasheada.
- Equipo favorito válido.
- Auditoría creada.
- Una sola cuenta creada.

---

## 16.3 Después

- Probar login.
- Probar acceso administrativo.
- Confirmar que setup ya no funciona.
- Rotar o eliminar INITIAL_SETUP_TOKEN.

---

# 17. TASK-125 — Cerrar setup

El setup debe quedar cerrado en:

- Aplicación.
- Base.
- Configuración.

---

## 17.1 Verificaciones

- Segunda solicitud rechazada.
- Token anterior inútil.
- Ruta no permite otro usuario.
- Concurrencia no crea duplicados.
- Logs no contienen token.

---

## 17.2 Variable

Después de completar, retirar o rotar:

```text
INITIAL_SETUP_TOKEN
```

La aplicación debe continuar funcionando con setup cerrado según el diseño.

---

# 18. TASK-126 — Smoke tests

Ejecutar smoke tests después del primer deployment y de cambios importantes.

---

## 18.1 Flujos mínimos

- Página pública responde.
- Registro carga.
- Login carga.
- Base conecta.
- SMTP de prueba funciona.
- Sesión funciona.
- Dashboard protegido.
- Admin protegido.
- Health check seguro.
- Assets cargan.

---

## 18.2 No destructivos

Los smoke tests de producción no deben:

- Crear grandes cantidades de datos.
- Procesar partidos oficiales.
- Recalcular temporadas.
- Eliminar información.
- Enviar spam.

Usar cuentas y datos controlados.

---

## 18.3 Evidencia

Registrar:

- Fecha.
- Versión.
- Entorno.
- Casos.
- Resultado.
- Request IDs de fallos.

---

# 19. TASK-127 — Temporada ficticia

Ejecutar en staging o piloto, no en producción oficial.

Crear:

```text
50 usuarios ficticios
10 jornadas
5 partidos por jornada
1 doble por jornada
```

Usar correos:

```text
@example.invalid
```

---

## 19.1 Datos

Los datos deben ser:

- Deterministas.
- Reproducibles.
- Identificables como prueba.
- Eliminables en entorno de prueba.

No usar nombres o correos de personas reales sin consentimiento.

---

# 20. TASK-128 — Simulación completa

La simulación debe incluir:

- Registro.
- Aprobación.
- Incorporación.
- Pronósticos.
- Cierres.
- Procesamiento.
- Reprogramación.
- Suspensión.
- Reanudación.
- Cancelación.
- Corrección.
- Participante tardío.
- Empates.
- Partidos dobles.

---

## 20.1 Objetivo

Demostrar que el sistema completa una temporada sin intervención directa en base.

No corregir datos mediante SQL durante la simulación.

Si es necesario hacerlo, registrar el defecto.

---

## 20.2 Evidencia

Conservar:

- Resultados de pruebas.
- Conteos.
- Clasificación final.
- Errores.
- Tiempos.
- Hallazgos.

---

# 21. TASK-129 — Comparar recalculo

Después de la simulación:

1. Guardar clasificación actual.
2. Ejecutar preview.
3. Ejecutar recalculo.
4. Comparar todos los participantes.

Criterio obligatorio:

```text
Diferencias = 0
```

Comparar:

- Puntos.
- Exactos.
- Parciales.
- Posición.
- PredictionScore.
- Resultados vigentes.

Una diferencia invalida la salida a producción hasta investigarse.

---

# 22. TASK-130 — Backup y restore

No basta con generar un backup.

Debe probarse la restauración.

---

## 22.1 Backup

Según el proveedor, puede utilizarse:

- Dump PostgreSQL.
- Backup del proveedor.
- Exportación funcional complementaria.

Un export JSON de aplicación no reemplaza necesariamente un backup completo de base.

---

## 22.2 Seguridad

El backup puede contener datos personales.

Debe:

- Estar cifrado o protegido.
- Tener acceso restringido.
- No guardarse en repositorio.
- No compartirse públicamente.
- Tener política de retención.

---

## 22.3 Restauración

Restaurar en:

```text
Entorno aislado
```

Nunca sobrescribir producción para probar.

---

## 22.4 Verificación posterior

Después de restaurar:

- Ejecutar migraciones si corresponde.
- Verificar conteos.
- Ejecutar integridad.
- Verificar usuarios.
- Verificar partidos.
- Verificar resultados.
- Verificar pronósticos.
- Comparar standings.
- Probar login controlado.

---

## 22.5 Evidencia

Registrar:

- Fecha del backup.
- Tamaño.
- Método.
- Tiempo de restauración.
- Resultado.
- Diferencias.
- Responsable.

---

# 23. TASK-131 — Piloto con usuarios reales

El piloto debe ejecutarse antes de la competencia oficial.

---

## 23.1 Alcance

Utilizar un grupo reducido y controlado.

El piloto debe cubrir:

- Registro.
- Confirmación.
- Aprobación.
- Login.
- Pronóstico.
- Edición.
- Cierre.
- Visualización posterior.
- Procesamiento.
- Clasificación.

---

## 23.2 Comunicación

Informar a participantes:

- Que es un piloto.
- Que los datos pueden reiniciarse.
- Qué comportamiento probar.
- Cómo reportar problemas.
- Qué información no compartir.

---

## 23.3 Datos

No mezclar el piloto con la temporada oficial salvo decisión explícita.

Preferir:

- Temporada piloto.
- Partidos ficticios.
- Reinicio posterior.

---

## 23.4 Hallazgos

Clasificar:

```text
Bloqueante
Alto
Medio
Bajo
Mejora
```

No lanzar producción con defectos bloqueantes abiertos.

---

# 24. TASK-132 — Correcciones del piloto

Cada defecto debe:

1. Tener reproducción.
2. Tener prioridad.
3. Tener causa raíz.
4. Tener prueba de regresión.
5. Corregirse en código.
6. Pasar CI.
7. Validarse nuevamente.

No corregir manualmente solo los datos del piloto sin corregir la causa.

---

# 25. TASK-133 — Revisión final de seguridad

Revisar al menos:

- Variables.
- Secretos.
- Cookies.
- Sesiones.
- Autorización.
- IDOR.
- CSRF y origen.
- XSS.
- Rate limiting.
- Logs.
- SMTP.
- CORS si existe.
- Cabeceras.
- Dependencias.
- Diagnóstico.
- SQL Console.
- Herramientas de prueba.
- Backups.
- Open redirects.
- Privacidad de pronósticos.

---

## 25.1 Configuración obligatoria

Confirmar:

```text
ENABLE_SQL_CONSOLE=false
ENABLE_SQL_WRITE=false
ENABLE_TEST_DATA_TOOLS=false
```

y diagnóstico según política.

---

## 25.2 Secret scanning

Revisar repositorio e historial reciente para detectar:

- Passwords.
- Tokens.
- Connection strings.
- App Passwords.
- `.env`.

Si un secreto fue expuesto, eliminarlo del código no es suficiente.

Debe rotarse.

---

## 25.3 Dependencias

Ejecutar auditoría aprobada.

No actualizar versiones mayores justo antes de producción sin pruebas completas.

---

## 25.4 Resultado

La revisión debe terminar con:

```text
APPROVED
```

o:

```text
BLOCKED
```

No usar una aprobación ambigua cuando existan hallazgos críticos.

---

# 26. TASK-134 — Revisión documental

Confirmar que la documentación coincide con el sistema real.

Revisar:

- Variables.
- Scripts.
- URLs.
- Roles.
- Flujos.
- Estados.
- Backup.
- Restore.
- Diagnóstico.
- Setup.
- Operación diaria.
- Solución de problemas.

No publicar documentación que describa comandos inexistentes.

---

# 27. TASK-135 — Backup inicial

Antes de abrir la temporada oficial:

- Crear backup inicial.
- Verificar que puede descargarse o restaurarse.
- Registrar checksum cuando corresponda.
- Guardar ubicación segura.
- Registrar fecha.

Este backup sirve como punto de retorno previo al inicio oficial.

---

# 28. TASK-136 — Temporada oficial

Crear la temporada oficial mediante la UI o caso de uso normal.

No mediante SQL.

Verificar:

- Nombre.
- Fechas.
- Estado.
- Reglas.
- Participantes.
- Equipos.
- Administradores.

Debe comenzar en estado documentado y activarse explícitamente.

---

# 29. TASK-137 — Primera jornada

Antes de publicar:

- Jornada correcta.
- Partidos correctos.
- Equipos correctos.
- Fechas correctas.
- Zona horaria correcta.
- Cierres correctos.
- Exactamente un partido doble.
- Sin duplicados accidentales.
- Pronósticos todavía abiertos cuando corresponda.

La publicación debe auditarse.

---

# 30. TASK-138 — Monitoreo inicial

Durante la primera jornada revisar:

- Registro.
- Login.
- Sesiones.
- Guardado de pronósticos.
- Edición.
- Cierre.
- Privacidad.
- SMTP.
- Errores.
- Base.
- Latencia.
- Procesamiento.
- Clasificación.
- Revalidación de caché.

---

## 30.1 Ventanas críticas

Monitorear especialmente:

```text
30 minutos antes del primer cierre
5 minutos antes
Momento exacto del cierre
Inicio del partido
Procesamiento del resultado
Publicación de clasificación
```

---

## 30.2 Respuesta a incidentes

Ante un incidente:

1. No modificar puntos manualmente.
2. Conservar evidencia.
3. Registrar Request ID.
4. Identificar alcance.
5. Activar mantenimiento si es necesario.
6. Corregir causa.
7. Recalcular desde fuente de verdad.
8. Auditar acciones extraordinarias.
9. Comunicar el resultado.

---

# 31. Estrategia de rollback

Debe existir un plan antes del deployment.

Distinguir:

```text
Rollback de código
```

de:

```text
Rollback de base
```

---

## 31.1 Código

Puede volver a una versión anterior si:

- Es compatible con el esquema actual.
- No elimina datos nuevos.
- No rompe contratos.

---

## 31.2 Base de datos

No revertir migraciones destructivamente sin plan.

Opciones:

- Migración correctiva hacia adelante.
- Restauración de backup.
- Mantenimiento temporal.

Preferir migraciones hacia adelante cuando sea seguro.

---

## 31.3 Resultados deportivos

Nunca solucionar un incidente mediante:

- UPDATE manual de Standing.
- UPDATE manual de puntos.
- Eliminación manual de PredictionScore.

Usar:

```text
Corrección
+
Recalculo
```

---

# 32. Health checks

El health check público debe revelar lo mínimo.

Puede informar:

```text
status
version
timestamp
```

No debe mostrar:

- DATABASE_URL.
- Host interno.
- Credenciales.
- Stack traces.
- Detalle completo de base.
- Variables.

Las verificaciones profundas pertenecen al Centro de Diagnóstico protegido.

---

# 33. Observabilidad gratuita

Utilizar primero:

- Logs del hosting.
- Request ID.
- AuditLog.
- DiagnosticRun.
- Health check.
- Alertas gratuitas disponibles.

No agregar una plataforma de pago obligatoria.

Los logs deben permitir investigar:

- Error.
- Ruta.
- Duración.
- Request ID.
- Código funcional.

---

# 34. Retención y privacidad

Definir retención razonable para:

- Logs.
- Backups.
- Exportaciones.
- DiagnosticRun.
- Archivos temporales.

Eliminar archivos temporales cuando expiren.

No conservar datos personales indefinidamente sin necesidad.

---

# 35. Cronología recomendada

```text
TASK-117 — CI
↓
TASK-118 — Preview
↓
TASK-119 — Base producción
↓
TASK-120 — Hosting
↓
TASK-121 — SMTP
↓
TASK-122 — Migraciones
↓
TASK-123 — Seed
↓
TASK-124 — Superadmin
↓
TASK-125 — Cerrar setup
↓
TASK-126 — Smoke tests
↓
TASK-127 — Temporada ficticia
↓
TASK-128 — Simulación
↓
TASK-129 — Comparación de recalculo
↓
TASK-130 — Backup y restore
↓
TASK-131 — Piloto
↓
TASK-132 — Correcciones
↓
TASK-133 — Seguridad
↓
TASK-134 — Documentación
↓
TASK-135 — Backup inicial
↓
TASK-136 — Temporada oficial
↓
TASK-137 — Primera jornada
↓
TASK-138 — Monitoreo
```

No omitir piloto, recalculo o restore por presión de fecha.

---

# 36. Criterios de salida

La fase deployment se considera completa cuando:

- CI bloquea fallos.
- Preview está aislado.
- Producción usa PostgreSQL independiente.
- Hosting usa HTTPS.
- Variables están configuradas.
- Secretos no están en Git.
- Gmail SMTP funciona.
- Migraciones están aplicadas.
- Seed es correcto.
- Existe un solo SUPER_ADMIN inicial.
- Setup está cerrado.
- Smoke tests pasan.
- Simulación completa pasa.
- Recalculo produce cero diferencias.
- Backup fue creado.
- Restore fue probado.
- Piloto fue ejecutado.
- Defectos bloqueantes fueron corregidos.
- Seguridad fue aprobada.
- Documentación coincide con producción.
- Temporada oficial fue creada.
- Primera jornada fue publicada correctamente.
- Monitoreo inicial fue completado.

---

# 37. Bloqueantes de producción

No lanzar si existe alguno:

```text
CI fallando
Migración no probada
Restore no probado
Recalculo con diferencias
Setup abierto
SQL Console activa
SQL Write activo
Test Data Tools activos
Pronósticos visibles antes del cierre
Cierre dependiente del cliente
Sesiones inseguras
Secretos expuestos
Sin backup
Defectos bloqueantes del piloto
Sin SUPER_ADMIN recuperable
```

---

# 38. Errores comunes

## Error 1 — Compartir base entre preview y producción

Debe estar aislada.

---

## Error 2 — Ejecutar `prisma migrate dev` en producción

Usar deployment de migraciones.

---

## Error 3 — Crear admin mediante SQL

Usar setup.

---

## Error 4 — Mantener setup abierto

Cerrar y rotar token.

---

## Error 5 — Considerar backup sin probar restore

Un backup no probado no es una garantía.

---

## Error 6 — Sembrar datos ficticios en producción

El seed productivo es mínimo.

---

## Error 7 — Permitir que CI continúe tras fallos

Los controles críticos deben bloquear.

---

## Error 8 — Usar secretos de producción en Pull Requests

Prohibido.

---

## Error 9 — Activar herramientas de diagnóstico peligrosas

Deben estar deshabilitadas.

---

## Error 10 — Lanzar sin piloto

El piloto es obligatorio.

---

## Error 11 — Corregir standings manualmente

Usar recalculo.

---

## Error 12 — Depender de pasos manuales no documentados

Todo paso recurrente debe documentarse o automatizarse.

---

# 39. Comandos esperados

Los comandos reales deben confirmarse en `package.json`.

Ejemplos:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
npm run build
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run seed
```

No ejecutar comandos destructivos sin confirmar entorno.

---

# 40. Formato de entrega

Cada tarea debe terminar con:

```text
## Resumen

## Entorno afectado

## Archivos creados

## Archivos modificados

## Configuración agregada

## Variables requeridas

## Comandos ejecutados

## Pruebas realizadas

## Evidencia

## Criterios de aceptación

## Plan de rollback

## Pendientes o bloqueos

## Riesgos detectados
```

Agregar:

```text
Tareas adicionales implementadas: ninguna
```

Nunca mostrar valores secretos en la entrega.

---

# 41. Prompt base de ejecución

```text
Implementa únicamente [TASK-XXX — NOMBRE] de
docs/19-IMPLEMENTATION_PLAN.md.

Contexto obligatorio:

- prompts/00-global-context.md
- prompts/08-deployment.md
- prompts/09-task-template.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/09-Deployment.md
- docs/14-DecisionesArquitectonicas.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Antes de modificar:

1. Inspecciona el repositorio.
2. Confirma el entorno objetivo.
3. Confirma las dependencias.
4. Revisa scripts existentes.
5. Revisa variables.
6. Identifica operaciones destructivas.
7. Presenta un plan breve.
8. Define rollback.
9. Confirma que no se expondrán secretos.

Implementa únicamente el cambio mínimo requerido.

No completes tareas funcionales pendientes.

No avances a producción si los criterios previos no se cumplen.

Ejecuta las validaciones aplicables.

Entrega el resultado con el formato definido en
prompts/09-task-template.md y este prompt.
```

---

# 42. Ejemplo — TASK-117

```text
Implementa únicamente TASK-117 — Crear pipeline CI.

Lee:

- prompts/00-global-context.md
- prompts/08-deployment.md
- prompts/09-task-template.md
- docs/08-Testing.md
- docs/09-Deployment.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Objetivo:

Crear un pipeline de integración continua para Pull Requests y rama
principal.

Alcance:

- .github/workflows/
- Scripts de package.json estrictamente necesarios.
- Configuración de tests para CI.
- Documentación mínima del pipeline.

Fuera de alcance:

- Deployment de producción.
- Creación de base productiva.
- Cambios funcionales.
- Actualización masiva de dependencias.

Requisitos:

- Usar versión explícita de Node.
- Usar npm ci.
- Levantar PostgreSQL de testing.
- Validar URL de test.
- Aplicar migraciones.
- Ejecutar format:check.
- Ejecutar lint.
- Ejecutar typecheck.
- Ejecutar unit tests.
- Ejecutar integration tests.
- Ejecutar build.
- Ejecutar E2E smoke cuando sea viable.
- Fallos críticos bloquean.
- No exponer secretos.
- Guardar reportes seguros cuando falle.

Pruebas:

- Workflow válido.
- Fallo de lint bloquea.
- Fallo de test bloquea.
- Build exitoso.
- Base de test aislada.
```

---

# 43. Ejemplo — TASK-122

```text
Implementa únicamente TASK-122 — Aplicar migraciones de producción.

No ejecutes la migración hasta completar la inspección y recibir
confirmación del entorno cuando sea necesario.

Lee:

- prompts/00-global-context.md
- prompts/08-deployment.md
- docs/03-ModeloBaseDatos.md
- docs/07-Seguridad.md
- docs/09-Deployment.md
- docs/14-DecisionesArquitectonicas.md
- docs/19-IMPLEMENTATION_PLAN.md

Objetivo:

Preparar y ejecutar de forma controlada las migraciones versionadas en
la base de producción.

Precondiciones:

- CI exitoso.
- DATABASE_URL confirmada sin mostrarla.
- DIRECT_DATABASE_URL confirmada cuando aplique.
- SQL de migraciones revisado.
- Backup disponible si existen datos.
- Plan de rollback definido.

Alcance:

- Scripts de deployment.
- Configuración del host.
- Registro de ejecución.
- Documentación necesaria.

Fuera de alcance:

- Crear nuevas migraciones.
- Corregir manualmente datos.
- Ejecutar migrate dev.
- Seed.
- Setup.

Requisitos:

- Ejecutar prisma migrate status.
- Ejecutar prisma migrate deploy.
- Registrar migraciones aplicadas.
- No imprimir secretos.
- Detener deployment si falla.
- Verificar conexión y esquema después.

Entrega:

- Comandos ejecutados.
- Resultado.
- Migraciones aplicadas.
- Verificación.
- Plan de rollback.
- Riesgos.
```

---

# 44. Ejemplo — TASK-129

```text
Implementa únicamente TASK-129 — Comparar recalculo.

Lee:

- prompts/00-global-context.md
- prompts/05-results.md
- prompts/07-testing.md
- prompts/08-deployment.md
- docs/04-ReglasNegocio.md
- docs/08-Testing.md
- docs/09-Deployment.md
- docs/12-CentroDiagnostico.md
- docs/19-IMPLEMENTATION_PLAN.md

Objetivo:

Demostrar que el recalculo reconstruye exactamente la clasificación de
la temporada simulada.

Alcance:

- Scripts o pruebas de comparación.
- Entorno de staging o testing.
- Reporte de diferencias.

Fuera de alcance:

- Modificar reglas.
- Corregir Standing manualmente.
- Ejecutar sobre temporada oficial.
- Ignorar diferencias.

Comparar:

- PredictionScore.
- Exactos.
- Parciales.
- Puntos.
- Posición.
- Cantidad de participantes.
- Cantidad de partidos procesados.

Criterio:

Diferencias = 0.

Si existen diferencias:

1. No marcar tarea como completa.
2. No modificar datos para ocultarlas.
3. Entregar detalle por participante y partido.
4. Identificar posible causa raíz.
```

---

# 45. Ejemplo — TASK-130

```text
Implementa únicamente TASK-130 — Probar backup y restore.

Lee:

- prompts/00-global-context.md
- prompts/08-deployment.md
- docs/07-Seguridad.md
- docs/09-Deployment.md
- docs/12-CentroDiagnostico.md
- docs/15-Riesgos.md
- docs/19-IMPLEMENTATION_PLAN.md

Objetivo:

Crear un backup del entorno de staging y restaurarlo en una base
aislada, demostrando que los datos y la clasificación permanecen
íntegros.

Alcance:

- Script de backup.
- Script o procedimiento de restore.
- Base aislada.
- Verificación de integridad.
- Documentación.

Fuera de alcance:

- Sobrescribir producción.
- Guardar dump en Git.
- Mostrar credenciales.
- Modificar datos originales.

Verificaciones:

- Conteo de usuarios.
- Conteo de temporadas.
- Conteo de partidos.
- Conteo de pronósticos.
- Conteo de resultados.
- Conteo de puntuaciones.
- Standing.
- Integridad referencial.
- Login de cuenta controlada.
- Checksum cuando aplique.

Entrega:

- Método.
- Ubicación segura descrita sin exponer acceso.
- Tamaño.
- Duración.
- Resultado de restore.
- Diferencias.
- Riesgos.
```

---

# 46. Ejemplo — TASK-133

```text
Implementa únicamente TASK-133 — Revisión final de seguridad.

No modifiques funcionalidad salvo correcciones explícitamente
autorizadas después de entregar hallazgos.

Lee:

- prompts/00-global-context.md
- prompts/07-testing.md
- prompts/08-deployment.md
- docs/07-Seguridad.md
- docs/12-CentroDiagnostico.md
- docs/15-Riesgos.md
- docs/19-IMPLEMENTATION_PLAN.md

Revisar:

- Secretos.
- Variables.
- Sesiones.
- Cookies.
- CSRF.
- XSS.
- IDOR.
- Roles.
- Pronósticos.
- Rate limiting.
- SMTP.
- Logs.
- Backups.
- Health check.
- Diagnóstico.
- SQL Console.
- Test Data Tools.
- Dependencias.
- Open redirects.
- Cabeceras.

Formato:

## Resultado

APPROVED o BLOCKED

## Hallazgos críticos

## Hallazgos altos

## Hallazgos medios

## Hallazgos bajos

## Evidencia

## Correcciones obligatorias

## Riesgo residual

No declarar APPROVED si existe un hallazgo crítico o alto sin resolver.
```

---

# 47. Conclusión

El despliegue no es únicamente publicar una URL.

La versión 1.0 de Kickoff se considera lista para producción cuando puede demostrar:

```text
Que el código fue validado
Que los entornos están aislados
Que los secretos están protegidos
Que las migraciones son reproducibles
Que el setup está cerrado
Que el recalculo produce cero diferencias
Que el backup puede restaurarse
Que el piloto fue exitoso
Que existe un plan ante incidentes
```

La primera jornada oficial no debe publicarse hasta que todas estas garantías estén verificadas.

La prioridad final es proteger la integridad de la competencia y asegurar que el sistema pueda recuperarse de errores sin alterar manualmente los resultados deportivos.