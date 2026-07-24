# Centro de Diagnóstico

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Audiencia:** Superadministrador y soporte técnico autorizado  
**Clasificación:** Herramienta administrativa crítica  
**Acceso predeterminado:** Deshabilitado en producción  
**Principio principal:** Diagnosticar y reparar sin comprometer la seguridad ni la integridad de la competencia.

---

## 1. Propósito

Este documento define el diseño funcional y operativo del **Centro de Diagnóstico** de **Quiniela Nacional La Goleada – Kickoff**.

El Centro de Diagnóstico permitirá:

- Consultar el estado general de la aplicación.
- Verificar la conexión con PostgreSQL.
- Verificar el envío de correo.
- Detectar inconsistencias de datos.
- Revisar errores recientes.
- Ejecutar verificaciones de integridad.
- Reconstruir la clasificación.
- Generar exportaciones.
- Gestionar importaciones controladas.
- Crear datos de prueba.
- Ejecutar simulaciones.
- Consultar información técnica segura.
- Ejecutar consultas SQL de lectura.
- Habilitar excepcionalmente SQL restringido de escritura.
- Apoyar procedimientos de recuperación.

No sustituye:

- Las pruebas automatizadas.
- Los respaldos.
- Las migraciones.
- La auditoría.
- El monitoreo del proveedor.
- La revisión humana antes de operaciones críticas.

---

# 2. Objetivos

El Centro de Diagnóstico tendrá cinco objetivos principales.

## 2.1 Observabilidad

Permitir conocer el estado de:

- Aplicación.
- Base de datos.
- Correo.
- Datos.
- Procesamientos.
- Exportaciones.
- Errores.

---

## 2.2 Integridad

Detectar inconsistencias como:

- Puntos incorrectos.
- Clasificación desactualizada.
- Pronósticos duplicados.
- Jornadas sin partido doble.
- Resultados incompletos.
- Estados imposibles.
- Usuarios con participación inconsistente.

---

## 2.3 Recuperación

Facilitar acciones controladas como:

- Recalcular temporada.
- Regenerar clasificación.
- Reintentar correos.
- Exportar datos.
- Validar respaldos.
- Restaurar en entornos autorizados.

---

## 2.4 Soporte

Proporcionar información suficiente para investigar incidentes sin exponer:

- Contraseñas.
- Tokens.
- Cookies.
- Connection strings.
- Secretos.
- Datos personales innecesarios.

---

## 2.5 Testing operativo

Permitir crear y limpiar datos ficticios en entornos controlados.

---

# 3. Alcance

El Centro de Diagnóstico incluirá los siguientes módulos:

1. Estado general.
2. Base de datos.
3. SMTP.
4. Integridad.
5. Recalculo.
6. Errores.
7. Métricas.
8. Exportaciones.
9. Importaciones.
10. Datos de prueba.
11. Simulador.
12. Consola SQL.
13. Mantenimiento.
14. Información del despliegue.
15. Historial de ejecuciones.

---

# 4. Restricciones de acceso

## 4.1 Rol requerido

El acceso completo estará reservado a:


SUPER_ADMIN
Los administradores normales podrán recibir acceso únicamente a vistas funcionales específicas si una decisión posterior lo autoriza.

Ejemplo:

Resumen de integridad sin detalles técnicos
4.2 Bandera de entorno

En producción deberá estar deshabilitado por defecto:

ENABLE_DIAGNOSTICS=false

Cuando esté deshabilitado:

La ruta no debe aparecer en la navegación.
Los endpoints deben rechazar solicitudes.
Conocer la URL no debe conceder acceso.
No debe cargarse información técnica.
4.3 SQL separado

La consola SQL tendrá banderas independientes:

ENABLE_SQL_CONSOLE=false
ENABLE_SQL_WRITE=false

Activar diagnóstico no deberá activar automáticamente SQL.

4.4 Herramientas de prueba

Las herramientas de generación de datos usarán:

ENABLE_TEST_DATA_TOOLS=false

En producción deberán permanecer deshabilitadas.

4.5 Reautenticación

Las operaciones de alto riesgo requerirán una autenticación reciente.

Ejemplos:

Recalculo.
Importación.
Restauración.
Limpieza de datos.
SQL de escritura.
Activación de mantenimiento.

Periodo sugerido:

15 minutos
5. Principios de diseño
DIAG-001 — Solo información necesaria

No mostrar datos técnicos que no ayuden a diagnosticar.

DIAG-002 — Sin secretos

Nunca mostrar:

DATABASE_URL.
DIRECT_DATABASE_URL.
SESSION_SECRET.
SMTP_APP_PASSWORD.
INITIAL_SETUP_TOKEN.
Tokens de sesión.
Cookies.
Hashes de contraseña.
DIAG-003 — Lectura por defecto

Las herramientas deben comenzar en modo de solo lectura.

Las acciones que modifican datos deben ser explícitas, separadas y confirmadas.

DIAG-004 — Auditoría obligatoria

Toda operación ejecutada desde diagnóstico deberá registrar:

Actor.
Rol.
Acción.
Parámetros sanitizados.
Resultado.
Duración.
Fecha.
Request ID.
Motivo cuando corresponda.
DIAG-005 — Operaciones reproducibles

Las ejecuciones importantes deberán crear un registro consultable.

Ejemplo:

IntegrityCheckRun
RecalculationRun
ExportRun
ImportRun
SimulationRun
SqlExecution
DIAG-006 — Fallo seguro

Si una herramienta no puede determinar si una acción es segura, debe detenerse.

DIAG-007 — No confiar en la interfaz

Los endpoints deberán validar permisos y banderas de entorno, aunque el botón esté oculto.

6. Navegación

Ruta sugerida:

/super-admin/diagnostics

Secciones:

Resumen
Base de datos
SMTP
Integridad
Recalculo
Errores
Exportaciones
Importaciones
Datos de prueba
Simulador
SQL
Mantenimiento
Despliegue
Historial
7. Dashboard de diagnóstico

El dashboard deberá ofrecer una vista rápida.

7.1 Indicadores
Estado de aplicación.
Estado de base de datos.
Estado SMTP.
Temporada activa.
Último procesamiento.
Último recalculo.
Último backup o exportación.
Errores recientes.
Alertas de integridad.
Modo mantenimiento.
Estado de herramientas avanzadas.
7.2 Estados visuales
OK
WARNING
ERROR
CRITICAL
UNKNOWN
DISABLED

Los estados no dependerán únicamente del color.

Cada estado tendrá:

Icono.
Texto.
Descripción.
Fecha de última verificación.
7.3 Ejemplo
Base de datos: OK
SMTP: WARNING
Integridad: ERROR
Mantenimiento: Desactivado
SQL Console: Desactivada
Último recalculo: 15/08/2026 10:30 p. m.
8. Estado general del sistema

Endpoint conceptual:

GET /api/v1/super-admin/diagnostics/status

Información permitida:

{
  "success": true,
  "data": {
    "application": {
      "status": "OK",
      "environment": "production",
      "version": "1.0.0",
      "startedAt": "2026-08-15T20:00:00.000Z"
    },
    "database": {
      "status": "OK",
      "latencyMs": 18
    },
    "smtp": {
      "status": "WARNING",
      "lastSuccessfulTestAt": "2026-08-14T20:00:00.000Z"
    },
    "integrity": {
      "status": "OK",
      "lastCheckAt": "2026-08-15T18:00:00.000Z"
    }
  }
}
9. Información de aplicación

Podrá mostrar:

Nombre.
Versión.
Entorno.
Fecha de build.
Commit abreviado.
Tiempo de actividad aproximado.
Zona horaria de negocio.
Hora UTC actual.
Hora de Honduras actual.

No deberá mostrar:

Ruta absoluta del servidor.
Variables de entorno completas.
Datos del sistema operativo innecesarios.
Secretos de build.
10. Diagnóstico de base de datos
10.1 Verificación básica

La prueba deberá:

Abrir conexión.
Ejecutar una consulta mínima.
Medir latencia.
Confirmar lectura.
Cerrar o liberar la conexión.

Consulta conceptual:

SELECT 1;
10.2 Información permitida
Estado.
Latencia.
Tipo de base.
Versión principal opcional.
Cantidad aproximada de conexiones de la aplicación.
Última verificación.
Estado de migraciones.
Conteos funcionales.
10.3 Información prohibida
Host completo cuando no sea necesario.
Puerto.
Usuario.
Contraseña.
URL de conexión.
Certificados.
Parámetros secretos.
10.4 Conteos funcionales

Podrán mostrarse:

Usuarios
Temporadas
Jornadas
Partidos
Pronósticos
Resultados
Puntuaciones
Auditorías
Notificaciones
Sesiones activas
10.5 Estado de migraciones

Mostrar:

Migraciones aplicadas.
Última migración.
Migraciones pendientes.
Migraciones fallidas.

Ejemplo:

Estado: OK
Última migración: 20260815_add_result_versions
Pendientes: 0

No se deberán aplicar migraciones desde la interfaz en la primera versión, salvo decisión técnica explícita.

11. Diagnóstico SMTP
11.1 Objetivo

Verificar que la aplicación puede enviar correos.

11.2 Prueba de configuración

La prueba podrá validar:

Variables obligatorias presentes.
Formato del remitente.
Conectividad.
Autenticación.
Envío de un correo de prueba.

No mostrará la contraseña SMTP.

11.3 Enviar correo de prueba

Ruta conceptual:

POST /api/v1/super-admin/diagnostics/test-smtp

Entrada:

{
  "recipient": "admin@example.com"
}
11.4 Resultado
{
  "success": true,
  "data": {
    "status": "OK",
    "recipient": "ad***@example.com",
    "durationMs": 820,
    "testedAt": "2026-08-15T20:00:00.000Z"
  }
}
11.5 Rate limiting

La prueba de SMTP tendrá límites.

Ejemplo inicial:

3 pruebas por 15 minutos
11.6 Errores sanitizados

Mensaje visible:

No fue posible autenticar con el proveedor SMTP.

No mostrar:

Password.
Respuesta completa con credenciales.
Token de aplicación.
Configuración completa.
12. Verificador de integridad
12.1 Propósito

El verificador analiza si los datos cumplen las reglas del sistema.

No deberá modificar datos durante una verificación normal.

12.2 Tipos de verificación
QUICK
STANDARD
FULL
QUICK

Validaciones esenciales y rápidas.

STANDARD

Validaciones funcionales principales.

FULL

Revisión completa de temporada, puntuaciones, clasificación y relaciones.

12.3 Ejecución

Ruta conceptual:

POST /api/v1/super-admin/diagnostics/integrity-check

Entrada:

{
  "scope": "STANDARD",
  "seasonId": "uuid"
}
12.4 Resultado
{
  "success": true,
  "data": {
    "runId": "uuid",
    "status": "WARNING",
    "startedAt": "2026-08-15T20:00:00.000Z",
    "completedAt": "2026-08-15T20:00:03.000Z",
    "checksExecuted": 24,
    "errors": 0,
    "warnings": 2,
    "information": 3
  }
}
13. Catálogo de verificaciones
13.1 Configuración
MULTIPLE_ACTIVE_SEASONS

Detecta más de una temporada activa.

Severidad:

CRITICAL
MISSING_ACTIVE_SEASON

No existe temporada activa.

Severidad:

INFO o WARNING

Depende del momento operativo.

MULTIPLE_SUPER_ADMINS

Detecta más de un superadministrador activo.

Severidad:

CRITICAL
MISSING_SUPER_ADMIN

No existe superadministrador activo.

Severidad:

CRITICAL
13.2 Usuarios
DUPLICATE_NORMALIZED_EMAIL

Correos duplicados tras normalización.

DUPLICATE_NORMALIZED_NICKNAME

Nicknames duplicados sin distinguir mayúsculas.

APPROVED_WITHOUT_EMAIL_VERIFICATION

Usuario aprobado sin confirmar correo.

ACTIVE_USER_WITH_INVALID_STATUS

Combinación inconsistente entre actividad y estado.

USER_WITHOUT_SEASON_PARTICIPATION

Usuario aprobado que no participa en la temporada activa.

Puede ser válido si se decidió excluirlo.

Severidad:

INFO
13.3 Equipos
MATCH_WITH_SAME_TEAM

Local y visitante son el mismo equipo.

MATCH_WITH_INACTIVE_TEAM

Partido futuro utiliza equipo inactivo.

MISSING_TEAM_LOGO

Equipo sin logo.

Severidad:

WARNING
13.4 Jornadas
ROUND_WITHOUT_MATCHES

Jornada sin partidos.

ROUND_WITHOUT_DOUBLE_MATCH

Jornada publicada sin partido doble.

ROUND_WITH_MULTIPLE_DOUBLE_MATCHES

Jornada con más de un partido doble.

ROUND_SEQUENCE_DUPLICATE

Dos jornadas tienen la misma secuencia.

Puede permitirse según configuración, pero debe advertirse.

13.5 Partidos
MATCH_INVALID_DATE

Fecha inexistente o no interpretable.

MATCH_CLOSE_AFTER_START

El cierre ocurre después o exactamente al inicio de manera incorrecta.

MATCH_CLOSE_RULE_MISMATCH

La diferencia entre inicio y cierre no coincide con la regla configurada.

PROCESSED_MATCH_WITHOUT_RESULT

Partido procesado sin resultado oficial.

UNPROCESSED_MATCH_WITH_RESULT

Resultado oficial presente en partido no procesado.

CANCELLED_MATCH_WITH_POINTS

Partido cancelado con puntos otorgados.

SUSPENDED_MATCH_PROCESSED

Partido suspendido marcado como procesado.

DUPLICATE_MATCH_SUSPECTED

Posible partido duplicado.

MATCH_STATE_TRANSITION_INVALID

Estado actual imposible según historial.

13.6 Pronósticos
DUPLICATE_PREDICTION

Más de un pronóstico del mismo usuario para el mismo partido.

PREDICTION_AFTER_CLOSING

Pronóstico creado o actualizado después del cierre.

Este hallazgo deberá investigarse cuidadosamente considerando:

Reprogramaciones.
Reaperturas.
Historial de cierre.
PREDICTION_FOR_INACTIVE_PARTICIPANT

Pronóstico de usuario que no participaba en la temporada.

PREDICTION_INVALID_SCORE

Marcador negativo, decimal o fuera del máximo.

PREDICTION_FOR_CANCELLED_MATCH

Pronóstico existente en partido cancelado.

Esto puede ser válido históricamente y normalmente será informativo.

13.7 Puntuaciones
MISSING_PREDICTION_SCORE

Partido procesado sin evaluación para un participante esperado.

DUPLICATE_PREDICTION_SCORE

Evaluaciones duplicadas.

SCORE_POINTS_MISMATCH

Puntos otorgados no coinciden con:

Pronóstico.
Resultado.
Regla.
Multiplicador.
SCORE_TYPE_MISMATCH

El tipo EXACT, PARTIAL, WRONG o NO_PREDICTION es incorrecto.

DOUBLE_MULTIPLIER_MISMATCH

Puntos no respetan el multiplicador doble.

13.8 Clasificación
STANDING_POINTS_MISMATCH

Total almacenado no coincide con la suma de puntuaciones.

STANDING_EXACT_COUNT_MISMATCH

Exactos almacenados incorrectos.

STANDING_PARTIAL_COUNT_MISMATCH

Parciales almacenados incorrectos.

STANDING_POSITION_MISMATCH

Posición no coincide con puntos y exactos.

STANDING_MISSING_PARTICIPANT

Participante activo sin fila de clasificación.

STANDING_DUPLICATE_PARTICIPANT

Más de una fila por participante y temporada.

INVALID_SHARED_POSITION

Empates no representan el esquema:

1, 2, 2, 4
13.9 Auditoría
ADMIN_ACTION_WITHOUT_AUDIT

Acción crítica sin registro de auditoría.

AUDIT_WITH_SENSITIVE_KEYS

Registro con claves como:

password
token
cookie
secret
AUDIT_INVALID_ACTOR

Actor inexistente o relación inconsistente.

13.10 Sesiones y tokens
EXPIRED_SESSION_ACTIVE

Sesión expirada no marcada como inactiva.

EXPIRED_TOKEN_PENDING_CLEANUP

Token expirado pendiente de limpieza.

Normalmente:

INFO
14. Presentación de resultados de integridad

Cada hallazgo mostrará:

Código.
Severidad.
Descripción.
Entidad.
Identificador.
Cantidad.
Recomendación.
Reparación automática disponible o no.

Ejemplo:

Código: STANDING_POINTS_MISMATCH
Severidad: ERROR
Temporada: Apertura 2026
Usuarios afectados: 2
Recomendación: Ejecutar recalculo completo.
15. Reparaciones automáticas
15.1 Principio

La verificación normal no modifica datos.

Las reparaciones se ejecutarán mediante acciones independientes.

15.2 Reparaciones permitidas

Podrán existir acciones como:

Limpiar tokens expirados.
Revocar sesiones expiradas.
Regenerar clasificación.
Recalcular temporada.
Crear filas faltantes de clasificación.
Regenerar estadísticas derivadas.
15.3 Reparaciones prohibidas automáticamente

No reparar automáticamente:

Resultados oficiales.
Pronósticos.
Roles.
Correos.
Equipos de partidos.
Partido doble con impacto histórico.
Auditoría.

Estas requieren revisión humana.

16. Recalculo de temporada
16.1 Fuente de verdad

El recalculo utilizará:

Participantes de temporada.
Partidos procesados.
Pronósticos.
Resultados oficiales vigentes.
Reglas de la temporada.
Multiplicadores.

No utilizará los totales existentes como fuente.

16.2 Operación

Ruta conceptual:

POST /api/v1/super-admin/seasons/:seasonId/recalculate
16.3 Confirmación

Requerirá:

Motivo.
Reautenticación reciente.
Texto de confirmación.
Idempotency key.

Ejemplo:

{
  "reason": "Verificación después de corregir resultado.",
  "confirmationText": "RECALCULAR"
}
16.4 Fases
Validar temporada
Bloquear recalculo concurrente
Leer participantes
Leer partidos procesados
Leer resultados vigentes
Leer pronósticos
Calcular puntuaciones
Calcular totales
Calcular posiciones
Crear comparación
Aplicar cambios
Crear snapshots
Registrar auditoría
Liberar bloqueo
16.5 Modo simulación

Antes de aplicar podrá existir:

Vista previa

La vista previa mostrará:

Usuarios afectados.
Puntos antes.
Puntos después.
Posición antes.
Posición después.
Diferencias.

No modifica datos.

16.6 Resultado
{
  "success": true,
  "data": {
    "runId": "uuid",
    "status": "COMPLETED",
    "participantsProcessed": 48,
    "matchesProcessed": 90,
    "scoresRebuilt": 4320,
    "differencesFound": 2,
    "differencesApplied": 2,
    "durationMs": 3820
  }
}
16.7 Concurrencia

No se permitirá:

Dos recalculos de la misma temporada.
Procesamiento de resultados durante recalculo.
Corrección de resultado durante recalculo.
16.8 Fallo

Si el recalculo falla:

La transacción deberá revertirse.
Los totales anteriores permanecerán.
La ejecución quedará registrada como fallida.
Se mostrará Request ID.
No se aplicarán cambios parciales.
17. Historial de recalculos

Cada ejecución guardará:

ID.
Temporada.
Actor.
Motivo.
Estado.
Inicio.
Fin.
Duración.
Diferencias.
Error sanitizado.
Versión de reglas.

Estados:

PENDING
RUNNING
COMPLETED
FAILED
CANCELLED
18. Visor de errores
18.1 Propósito

Consultar errores técnicos registrados por la aplicación.

18.2 Filtros
Fecha inicial.
Fecha final.
Nivel.
Código.
Ruta.
Request ID.
Usuario.
Estado resuelto.
18.3 Niveles
INFO
WARNING
ERROR
CRITICAL
18.4 Información visible
Fecha.
Código.
Mensaje sanitizado.
Ruta.
Método.
Request ID.
Usuario opcional.
Duración.
Repeticiones.
Stack sanitizado opcional para superadministrador.
18.5 Información oculta
Password.
Cookie.
Authorization header.
Tokens.
Connection strings.
Cuerpo completo con datos sensibles.
Stack sin sanitizar.
18.6 Agrupación

Errores iguales podrán agruparse por:

Código.
Ruta.
Firma.
Periodo.

Ejemplo:

SMTP_AUTH_FAILED
12 ocurrencias
Última: hace 5 minutos
19. Request ID

Cada error deberá tener un identificador de solicitud.

Ejemplo:

req_01J5K8H1A0

El administrador podrá buscarlo directamente.

20. Estado resuelto

Un error podrá marcarse como:

OPEN
ACKNOWLEDGED
RESOLVED
IGNORED

Esto no elimina el registro.

Registrar:

Usuario que cambió estado.
Fecha.
Comentario.
Acción tomada.
21. Métricas operativas

El Centro podrá mostrar métricas simples.

21.1 Usuarios
Registrados.
Pendientes de correo.
Pendientes de aprobación.
Aprobados.
Bloqueados.
Activos en temporada.
21.2 Partidos
Programados.
Reprogramados.
Abiertos.
Cerrados.
Suspendidos.
Pendientes de procesar.
Procesados.
Cancelados.
21.3 Pronósticos
Total.
Enviados por jornada.
Pendientes.
Usuarios sin pronóstico.
Promedio por usuario.
Guardados cerca del cierre.
21.4 Resultados
Procesados.
Corregidos.
Errores de procesamiento.
Duración promedio.
Último procesamiento.
21.5 Correo
Enviados.
Fallidos.
Confirmaciones.
Recuperaciones.
Último envío exitoso.

Las métricas deberán ser agregadas y no exponer contenido privado.

22. Exportaciones
22.1 Tipos
USERS
TEAMS
SEASONS
ROUNDS
MATCHES
PREDICTIONS
RESULTS
SCORES
STANDINGS
AUDIT
NOTIFICATIONS
FULL_BACKUP
22.2 Formatos
JSON
CSV
ZIP
22.3 Flujo
Elegir tipo.
Elegir temporada.
Elegir formato.
Confirmar contenido.
Generar.
Validar.
Descargar.
Eliminar archivo temporal.
22.4 Estados
PENDING
RUNNING
READY
FAILED
EXPIRED
DOWNLOADED
22.5 Seguridad

Las exportaciones deberán:

Excluir secretos.
Excluir hashes.
Excluir tokens.
Excluir sesiones.
Requerir sesión activa.
Tener expiración.
Registrar la descarga.
Prevenir CSV injection.
22.6 Retención

Tiempo sugerido:

24 horas

Después se eliminarán o marcarán como expiradas.

23. Backup funcional

Una exportación FULL_BACKUP incluirá:

Configuración no sensible.
Equipos.
Usuarios necesarios.
Participaciones.
Temporadas.
Jornadas.
Partidos.
Pronósticos.
Resultados.
Puntuaciones.
Clasificaciones.
Auditoría.
Patrocinadores.
Notificaciones opcionales.

No incluirá:

Password hashes salvo backup técnico especialmente protegido.
Sesiones.
Tokens.
Credenciales.
Variables de entorno.
24. Validación de exportación

Antes de marcarla como lista:

Verificar estructura.
Verificar conteos.
Calcular checksum.
Confirmar que no contiene claves prohibidas.
Confirmar tamaño.
Registrar versión de formato.

Ejemplo:

formatVersion: 1
checksumAlgorithm: SHA-256
25. Importaciones
25.1 Uso inicial

Las importaciones serán principalmente para:

Partidos.
Equipos.
Jornadas.
Restauración funcional controlada.
25.2 Flujo obligatorio
Cargar
Analizar
Previsualizar
Validar
Confirmar
Ejecutar
Verificar
Auditar
25.3 Previsualización

Deberá mostrar:

Filas válidas.
Filas inválidas.
Advertencias.
Duplicados.
Entidades nuevas.
Entidades modificadas.
Entidades ignoradas.
25.4 Confirmación

La importación no se ejecutará automáticamente después de cargar el archivo.

25.5 Transacción

Las importaciones críticas deberán ser transaccionales o trabajar por lotes claramente identificados.

25.6 Reversión

Cuando sea viable, guardar:

Batch ID.
Registros creados.
Registros modificados.
Valores anteriores.

Esto permitirá una reversión controlada.

26. Datos de prueba
26.1 Propósito

Crear escenarios para:

Desarrollo.
Testing.
Demostración.
Pruebas de rendimiento.
26.2 Restricción

En producción:

ENABLE_TEST_DATA_TOOLS=false

Aunque se active excepcionalmente, deberá mostrar una advertencia crítica.

26.3 Generador

Podrá crear:

Usuarios.
Participaciones.
Jornadas.
Partidos.
Pronósticos.
Resultados.
Clasificaciones.
26.4 Identificación

Cada lote tendrá:

testBatchId
isTestData
createdBy
createdAt
26.5 Correos

Usar:

@example.invalid

Nunca enviar correos reales a usuarios de prueba.

26.6 Semilla aleatoria

El generador aceptará una semilla opcional.

Ejemplo:

seed = 20260815

La misma semilla deberá producir datos equivalentes.

27. Limpieza de datos de prueba
27.1 Alcance

Solo podrá limpiar datos asociados a un testBatchId.

27.2 Previsualización

Antes de limpiar mostrará:

Usuarios: 50
Pronósticos: 2500
Partidos: 50
Puntuaciones: 2500
27.3 Confirmación

Requerirá:

Superadministrador.
Reautenticación.
Texto de confirmación.
Motivo.
Backup cuando aplique.
27.4 Protección

No permitir:

Borrar datos sin batch.
Borrar temporada real.
Borrar auditoría.
Borrar superadministrador.
Borrar entidades compartidas.
28. Simulador
28.1 Objetivo

Simular una jornada o temporada sin realizar manualmente cada pronóstico.

28.2 Funciones
Generar pronósticos aleatorios.
Generar resultados.
Procesar resultados.
Simular reprogramación.
Simular empate de clasificación.
Simular corrección.
Simular usuario tardío.
28.3 Modos
PREVIEW
EXECUTE_TEST_DATA

No debe ejecutar sobre datos reales por defecto.

28.4 Escenarios predefinidos
NORMAL_ROUND

Jornada normal con un partido doble.

SHARED_POSITIONS

Genera clasificación:

1, 2, 2, 4
RESCHEDULED_MATCH

Jornada anterior con partido jugado después de una jornada posterior.

SUSPENDED_MATCH

Partido suspendido y reanudado.

RESULT_CORRECTION

Procesa y corrige un resultado.

LATE_USER

Agrega participante después de partidos ya procesados.

HIGH_VOLUME

Genera cientos de usuarios y miles de pronósticos.

29. Consola SQL
29.1 Riesgo

La consola SQL es una herramienta excepcional.

No debe convertirse en el método normal de administración.

29.2 Acceso

Requisitos:

SUPER_ADMIN.
ENABLE_SQL_CONSOLE=true.
Reautenticación reciente.
Sesión segura.
Auditoría.
30. SQL de lectura
30.1 Permitido

Por defecto solo:

SELECT

También podrán permitirse:

WITH ... SELECT
EXPLAIN SELECT

si el analizador puede validarlas de forma segura.

30.2 Restricciones
Una instrucción.
Sin múltiples sentencias.
Sin comandos de escritura.
Timeout.
Máximo de filas.
Máximo de caracteres.
Sin acceso a esquemas no autorizados.
Transacción de solo lectura cuando sea posible.
30.3 Límite inicial
Máximo de filas: 500
Timeout: 5 segundos
Máximo de consulta: 10,000 caracteres
30.4 Resultado

Mostrar:

Columnas.
Filas.
Cantidad.
Duración.
Truncamiento.
Request ID.

No mostrar binarios o campos sensibles sin autorización.

30.5 Exportación

El resultado podrá exportarse en CSV únicamente después de aplicar protección contra fórmulas.

31. SQL de escritura
31.1 Estado

Deshabilitado por defecto:

ENABLE_SQL_WRITE=false
31.2 Requisitos

Para ejecutar:

Superadministrador.
SQL Console habilitada.
SQL Write habilitado.
Reautenticación reciente.
Motivo obligatorio.
Confirmación textual.
Backup reciente.
Auditoría.
Lista permitida de comandos.
31.3 Comandos potencialmente permitidos

Solo cuando exista una necesidad documentada:

UPDATE
INSERT

Operaciones como DELETE deberán estar más restringidas o completamente prohibidas.

31.4 Comandos prohibidos
DROP DATABASE
DROP SCHEMA
DROP TABLE
TRUNCATE
ALTER ROLE
CREATE ROLE
GRANT
REVOKE
COPY ... PROGRAM
CREATE EXTENSION
31.5 Protección adicional

Antes de ejecutar una escritura:

Analizar consulta.
Mostrar tablas afectadas.
Mostrar estimación de filas.
Ejecutar vista previa cuando sea posible.
Solicitar confirmación.
Ejecutar dentro de transacción.
Mostrar filas afectadas.
Ejecutar integridad relacionada.
31.6 Auditoría de SQL

Registrar:

Actor.
Fecha.
Consulta sanitizada o completa protegida.
Motivo.
Tipo.
Filas afectadas.
Duración.
Éxito o fallo.
Request ID.

La consulta no deberá contener secretos.

32. Consultas SQL guardadas

El sistema podrá ofrecer consultas seguras predefinidas.

Ejemplos:

Usuarios pendientes
Partidos pendientes de procesar
Pronósticos por jornada
Diferencias de clasificación
Sesiones expiradas
Auditorías recientes

Estas consultas son preferibles a SQL libre.

33. Modo mantenimiento
33.1 Vista

Mostrar:

Estado actual.
Fecha de activación.
Actor.
Motivo.
Usuarios conectados.
Operaciones activas.
33.2 Activación

Requiere:

Superadministrador.
Motivo.
Confirmación.
33.3 Verificación previa

Antes de activarlo, advertir si existe:

Procesamiento en curso.
Recalculo.
Importación.
Exportación crítica.
SQL de escritura.
33.4 Desactivación

Antes de desactivar:

Verificar base.
Ejecutar integridad rápida.
Consultar health check.
Confirmar migraciones.
Ejecutar smoke test.
34. Información de despliegue

Podrá mostrar:

Versión de aplicación.
Commit abreviado.
Fecha de build.
Entorno.
Versión principal de Node.js.
Versión de Prisma.
Última migración.
URL pública sanitizada.
Región general si está disponible.
Estado del modo mantenimiento.

No mostrar:

Nombres internos sensibles.
Credenciales.
Variables completas.
Rutas privadas.
35. Estado de funcionalidades

Mostrar las banderas:

Diagnóstico
SQL Console
SQL Write
Test Data
Email Reminders
Maintenance Mode

Ejemplo:

Diagnóstico: Habilitado
SQL Console: Deshabilitado
SQL Write: Deshabilitado
Test Data: Deshabilitado
36. Historial de ejecuciones

El Centro deberá centralizar:

Verificaciones de integridad.
Recalculos.
Exportaciones.
Importaciones.
Simulaciones.
Limpiezas.
SQL.
Pruebas SMTP.
Cambios de mantenimiento.

Filtros:

Tipo.
Estado.
Actor.
Fecha.
Temporada.
Request ID.
37. Modelo conceptual de ejecución
type DiagnosticRun = {
  id: string;
  type: DiagnosticRunType;
  status: DiagnosticRunStatus;
  actorUserId: string;
  seasonId?: string;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  requestId: string;
  parameters?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  errorCode?: string;
};

Los parámetros y resúmenes deberán sanitizarse.

38. Operaciones largas
38.1 Problema

Los proveedores gratuitos pueden limitar el tiempo de ejecución.

Operaciones largas:

Recalculo.
Exportación completa.
Importación.
Simulación masiva.
Verificación completa.
38.2 Estrategia

Cuando sea necesario:

Procesar por lotes.
Guardar progreso.
Permitir reanudación.
Evitar mantener una solicitud HTTP abierta demasiado tiempo.
Mostrar estado consultable.
38.3 Progreso

Ejemplo:

Estado: RUNNING
Progreso: 65 %
Partidos procesados: 58 de 90
Usuarios procesados: 48 de 48
38.4 Idempotencia

Cada operación larga deberá usar una clave idempotente o un identificador único de ejecución.

39. Bloqueos operativos

No se deberán ejecutar simultáneamente:

Dos recalculos de la misma temporada.
Recalculo y procesamiento.
Recalculo y corrección.
Restauración y cualquier escritura.
Limpieza y simulación del mismo lote.
Dos importaciones sobre la misma jornada.
40. Registro de bloqueos

El sistema podrá usar una entidad conceptual:

OperationalLock

Campos:

Tipo.
Recurso.
Actor.
Inicio.
Expiración.
Run ID.

Los bloqueos abandonados deberán poder recuperarse mediante procedimiento seguro.

41. Limpieza técnica

El Centro podrá ejecutar limpiezas seguras:

Tokens expirados.
Sesiones expiradas.
Exportaciones vencidas.
Archivos temporales.
Errores técnicos antiguos según retención.
Datos de prueba por batch.
Bloqueos operativos expirados.

No limpiar:

Auditoría.
Pronósticos reales.
Resultados.
Clasificaciones históricas.
Temporadas.
42. Diagnóstico de notificaciones

Mostrar:

Pendientes.
Enviadas.
Leídas.
Fallidas.
Duplicadas sospechosas.
Última generación.

Podrá existir una acción para regenerar notificaciones internas faltantes.

No deberá reenviar correos masivamente sin confirmación.

43. Diagnóstico de caché

Si la aplicación utiliza caché, podrá mostrar:

Tags relevantes.
Última revalidación.
Posibles datos obsoletos.
Acción de revalidación.

Ejemplos:

standings
dashboard
match:{id}
round:{id}

La revalidación no deberá modificar datos persistentes.

44. Diagnóstico de hora

Debido a la importancia del cierre, mostrar:

Hora UTC del servidor.
Hora de Honduras.
Zona configurada.
Diferencia esperada.
Próximos cierres.
Cierres ya vencidos.

Ejemplo:

Servidor UTC: 2026-08-16 01:00:00
Honduras: 2026-08-15 19:00:00
Zona configurada: America/Tegucigalpa
Estado: OK
45. Verificador de cierres

Podrá detectar:

Partido abierto cuyo cierre ya pasó.
Partido cerrado demasiado pronto.
Diferencia incorrecta.
Cierre no actualizado tras reprogramación.
Pronósticos editables cuando deberían estar cerrados.

Esta verificación es crítica.

46. Diagnóstico de clasificación

La vista deberá permitir comparar:

Valor almacenado
Valor recalculado
Diferencia

Ejemplo:

Usuario	Guardado	Calculado	Diferencia
Juancho	47	47	0
Carlos	42	44	+2

La comparación no deberá modificar datos hasta ejecutar recalculo.

47. Diagnóstico por usuario

Al consultar un participante podrá mostrar:

Estado.
Rol.
Participaciones.
Puntos por partido.
Exactos.
Parciales.
Sesiones activas.
Notificaciones.
Historial administrativo.

No mostrar:

Hash de contraseña.
Tokens.
Cookies.
Información de otros usuarios innecesaria.
48. Diagnóstico por partido

Podrá mostrar:

Equipos.
Jornada.
Fechas.
Historial de reprogramación.
Hora de cierre.
Estado.
Partido doble.
Resultado vigente.
Versiones de resultado.
Cantidad de pronósticos.
Resumen de puntuaciones.
Auditorías relacionadas.
Verificación de consistencia.
49. Diagnóstico por temporada

Podrá mostrar:

Estado.
Reglas.
Participantes.
Jornadas.
Partidos.
Procesados.
Pendientes.
Cancelados.
Integridad.
Último recalculo.
Diferencias.
Exportaciones.
50. Alertas críticas

El dashboard deberá resaltar:

Más de una temporada activa.
Más de un superadministrador.
Pronósticos visibles antes del cierre.
Pronósticos tardíos sospechosos.
Partido procesado sin resultado.
Resultado sin puntuaciones.
Clasificación inconsistente.
Partido cancelado con puntos.
SQL Write habilitado.
Test Data habilitado en producción.
Migraciones pendientes.

51. Notificación de alertas

Las alertas críticas podrán generar:

Notificación interna al superadministrador.
Banner administrativo.
Registro de error.
Correo opcional si SMTP está operativo.

No generar correos repetitivos por el mismo problema sin control.

52. UX de operaciones peligrosas

Toda operación peligrosa deberá mostrar:

Nombre de la acción.
Alcance.
Registros afectados.
Riesgo.
Recomendación de backup.
Motivo obligatorio.
Texto de confirmación.
Botón claramente diferenciado.

Ejemplo:

Escriba RECALCULAR para continuar.
53. Confirmación reforzada

No usar únicamente:

¿Está seguro?

La confirmación deberá incluir contexto.

Ejemplo:

Se recalcularán 48 participantes y 90 partidos de Apertura 2026.
54. Auditoría

Acciones auditadas:

Abrir diagnóstico.
Ejecutar integridad.
Probar SMTP.
Generar exportación.
Descargar exportación.
Importar.
Recalcular.
Crear datos.
Limpiar datos.
Ejecutar simulación.
Ejecutar SQL.
Activar mantenimiento.
Cambiar estado de error.

La simple navegación podrá registrarse de forma técnica, pero no necesita crear una auditoría funcional excesiva en cada vista.

55. Rate limiting

Aplicar límites a:

Prueba SMTP.
Integridad completa.
Recalculo.
Exportación.
Importación.
SQL.
Simulación.
Generación masiva.

Las operaciones críticas no deben poder lanzarse repetidamente con múltiples clics.

56. Timeouts

Valores iniciales conceptuales:

Database ping: 3 segundos
SMTP connectivity: 10 segundos
SQL read: 5 segundos
Integrity quick: 10 segundos
Export request: ejecución asíncrona
Recalculation: ejecución controlada

Los valores definitivos dependerán del proveedor.

57. Manejo de errores

Toda herramienta deberá devolver:

Código funcional.
Mensaje seguro.
Request ID.
Estado de la ejecución.
Recomendación.

Ejemplo:

{
  "success": false,
  "error": {
    "code": "RECALCULATION_FAILED",
    "message": "No fue posible completar el recalculo. No se aplicaron cambios."
  },
  "requestId": "req_123"
}
58. Códigos de error
DIAGNOSTICS_DISABLED
DIAGNOSTICS_ACCESS_DENIED
DIAGNOSTIC_RUN_NOT_FOUND
DIAGNOSTIC_RUN_ALREADY_ACTIVE

DATABASE_UNAVAILABLE
DATABASE_TIMEOUT
DATABASE_MIGRATION_PENDING

SMTP_CONFIGURATION_INVALID
SMTP_AUTH_FAILED
SMTP_SEND_FAILED
SMTP_RATE_LIMITED

INTEGRITY_CHECK_FAILED
INTEGRITY_CRITICAL_ISSUES_FOUND

RECALCULATION_IN_PROGRESS
RECALCULATION_FAILED
RECALCULATION_CONFLICT

EXPORT_FAILED
EXPORT_EXPIRED
EXPORT_NOT_FOUND

IMPORT_VALIDATION_FAILED
IMPORT_EXECUTION_FAILED

TEST_DATA_TOOLS_DISABLED
TEST_DATA_BATCH_NOT_FOUND
TEST_DATA_CLEANUP_BLOCKED

SQL_CONSOLE_DISABLED
SQL_WRITE_DISABLED
SQL_QUERY_NOT_ALLOWED
SQL_QUERY_TIMEOUT
SQL_RESULT_LIMIT_EXCEEDED

MAINTENANCE_CONFLICT
OPERATIONAL_LOCK_ACTIVE
59. Pruebas obligatorias
59.1 Acceso
Usuario normal rechazado.
Administrador normal rechazado en funciones exclusivas.
Superadministrador autorizado.
Diagnóstico deshabilitado por entorno.
URL directa rechazada.
59.2 Base de datos
Conexión exitosa.
Timeout.
Credencial inválida.
Respuesta sin secretos.
Migración pendiente.
59.3 SMTP
Configuración correcta.
Configuración ausente.
Autenticación fallida.
Rate limiting.
Logs sin contraseña.
59.4 Integridad
Temporadas múltiples.
Jornadas sin doble.
Pronóstico duplicado.
Puntos incorrectos.
Posiciones compartidas.
Partido cancelado con puntos.
Auditoría sensible.
Sin falsos positivos por reprogramación válida.
59.5 Recalculo
Sin diferencias.
Con diferencias.
Reparación correcta.
Error transaccional.
Ejecución concurrente.
Usuario tardío.
Partido cancelado.
Partido doble.
Resultado corregido.
59.6 Exportaciones
Generación.
Expiración.
Descarga autorizada.
Descarga no autorizada.
Sin secretos.
CSV injection.
Checksum.
59.7 SQL
SELECT permitido.
UPDATE bloqueado por defecto.
Sentencias múltiples bloqueadas.
Timeout.
Límite de filas.
Comandos destructivos bloqueados.
Auditoría.
Reautenticación.
59.8 Datos de prueba
Deshabilitados en producción.
Batch identificado.
Limpieza limitada al batch.
Datos reales protegidos.
Semilla reproducible.
60. Checklist antes de ejecutar recalculo
[ ] Seleccioné la temporada correcta
[ ] Revisé el motivo
[ ] No hay resultados procesándose
[ ] No hay otro recalculo activo
[ ] Existe backup reciente
[ ] Revisé la vista previa
[ ] Confirmé usuarios afectados
[ ] Escribí RECALCULAR
61. Checklist antes de SQL de escritura
[ ] No existe una función normal para resolverlo
[ ] Tengo autorización
[ ] SQL Write está habilitado temporalmente
[ ] Existe backup
[ ] Probé la consulta en testing
[ ] Revisé las filas afectadas
[ ] Ingresé un motivo
[ ] Confirmé la consulta
[ ] Ejecutaré integridad después
[ ] Deshabilitaré SQL Write al terminar
62. Checklist después de una reparación
[ ] La operación terminó correctamente
[ ] Revisé el resumen
[ ] Ejecuté integridad
[ ] Revisé clasificación
[ ] Revisé partidos afectados
[ ] Revisé auditoría
[ ] Guardé Request ID
[ ] Deshabilité funciones temporales
[ ] Documenté el incidente
63. Procedimiento ante clasificación inconsistente
No modificar puntos manualmente.
Ejecutar verificación STANDARD.
Revisar partidos afectados.
Comparar valores almacenados y calculados.
Crear backup.
Ejecutar vista previa de recalculo.
Confirmar diferencias.
Ejecutar recalculo.
Ejecutar integridad nuevamente.
Revisar auditoría.
64. Procedimiento ante pronóstico tardío sospechoso
Revisar fecha del pronóstico.
Revisar fecha de cierre vigente.
Revisar historial de reprogramación.
Revisar si el partido fue reabierto.
Revisar auditoría.
No eliminar el pronóstico inmediatamente.
Documentar el análisis.
Aplicar corrección solo mediante procedimiento autorizado.
65. Procedimiento ante procesamiento fallido
Buscar Request ID.
Abrir historial de ejecución.
Confirmar estado actual del partido.
Verificar si existe resultado.
Verificar puntuaciones.
Ejecutar integridad del partido.
No repetir si ya fue procesado.
Reintentar solo si la transacción fue revertida.
Escalar si existe estado parcial.
66. Procedimiento ante SMTP fallido
Ejecutar prueba de configuración.
Revisar si variables están presentes.
Revisar cuenta Gmail externamente.
Confirmar contraseña de aplicación.
Verificar límites.
Enviar una única prueba.
Utilizar notificaciones internas mientras se resuelve.
No mostrar credenciales en capturas.
67. Procedimiento ante migración pendiente
Activar mantenimiento.
Crear backup.
Verificar versión desplegada.
Revisar migración pendiente.
Aplicar mediante proceso de deployment.
No ejecutar SQL improvisado.
Verificar base.
Ejecutar smoke test.
Desactivar mantenimiento.
68. Procedimiento ante SQL Write habilitado accidentalmente
No ejecutar consultas.
Deshabilitar ENABLE_SQL_WRITE.
Redesplegar o reiniciar si es necesario.
Revisar auditorías SQL.
Confirmar que no hubo ejecuciones.
Documentar el evento.
69. Retención
Ejecuciones de diagnóstico

Periodo sugerido:

90 días
Errores técnicos

Periodo sugerido:

30 a 90 días
Auditoría

Conservación indefinida o según política del proyecto.

Exportaciones temporales
24 horas
Datos de prueba

Eliminar al finalizar pruebas.

70. Rendimiento

El Centro de Diagnóstico no deberá afectar el uso normal.

Medidas:

Consultas paginadas.
Agregaciones eficientes.
Índices.
Operaciones largas por lotes.
Límites de concurrencia.
Ejecución fuera de horas críticas.
Evitar COUNT(*) costosos repetitivos cuando no sean necesarios.
71. Disponibilidad gratuita

El diseño no deberá requerir:

Redis de pago.
Plataforma de observabilidad de pago.
Cola externa obligatoria.
Scheduler de pago.
Almacenamiento premium.

Se podrán utilizar:

PostgreSQL.
Logs del hosting.
Tablas internas.
GitHub Actions gratuitas cuando sean viables.
Procesamiento oportunista.
Ejecuciones manuales.
72. Implementación sugerida

Estructura conceptual:

src/
├── app/
│   └── super-admin/
│       └── diagnostics/
│
├── modules/
│   └── diagnostics/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       ├── ui/
│       └── schemas/
│
├── services/
│   ├── integrity/
│   ├── recalculation/
│   ├── exports/
│   ├── imports/
│   └── test-data/
│
└── scripts/
    ├── verify-integrity.ts
    ├── recalculate-season.ts
    └── cleanup-expired-data.ts
73. Servicios sugeridos
diagnosticsService.getSystemStatus()
diagnosticsService.testDatabase()
diagnosticsService.testSmtp()

integrityService.runCheck()
integrityService.getRun()
integrityService.listFindings()

recalculationService.preview()
recalculationService.execute()

exportService.create()
exportService.download()

importService.preview()
importService.confirm()

testDataService.generate()
testDataService.cleanup()

sqlConsoleService.executeRead()
sqlConsoleService.executeWrite()
74. Permisos sugeridos
diagnostics:view
diagnostics:database:test
diagnostics:smtp:test
diagnostics:integrity:run
diagnostics:recalculation:preview
diagnostics:recalculation:execute
diagnostics:exports:create
diagnostics:imports:preview
diagnostics:imports:execute
diagnostics:test-data:generate
diagnostics:test-data:cleanup
diagnostics:sql:read
diagnostics:sql:write
diagnostics:maintenance:manage

En la versión 1.0 estos permisos podrán derivarse directamente del rol SUPER_ADMIN.

75. Criterios de aceptación

El Centro de Diagnóstico será aceptado cuando:

Solo el superadministrador pueda acceder.
Las banderas de entorno se respeten.
No se expongan secretos.
La base pueda verificarse.
SMTP pueda probarse.
Las inconsistencias críticas puedan detectarse.
La clasificación pueda compararse y reconstruirse.
Los recalculos sean transaccionales.
Las exportaciones sean seguras.
Los datos de prueba estén aislados.
SQL esté restringido.
Las operaciones sean auditadas.
Los errores tengan Request ID.
Las operaciones concurrentes estén protegidas.
Las herramientas peligrosas estén apagadas por defecto.
76. Requisitos no negociables

No podrá liberarse el Centro de Diagnóstico si:

Está disponible para usuarios normales.
Conocer la URL evita la autorización.
Muestra variables de entorno.
Muestra contraseñas o tokens.
El recalculo puede dejar datos parciales.
SQL de escritura está habilitado por defecto.
Los datos de prueba pueden mezclarse con producción.
Las exportaciones incluyen hashes o sesiones.
La auditoría puede eliminarse.
Una reparación modifica resultados oficiales automáticamente.
No existen límites de consultas.
Las operaciones peligrosas no requieren confirmación.
77. Decisiones pendientes

Deberán confirmarse:

Modelo definitivo de ejecuciones.
Retención de errores.
Implementación de operaciones largas.
Límite máximo de SQL.
Disponibilidad de EXPLAIN.
Si administradores normales verán un resumen.
Estrategia de almacenamiento temporal.
Formato del backup funcional.
Política de restauración desde interfaz.
Reparaciones automáticas permitidas.
Método de bloqueo operativo.
Política de anonimización de logs.

Estas decisiones se registrarán en:

docs/14-DecisionesArquitectonicas.md
78. Documentos relacionados

Consultar:

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
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
79. Conclusión

El Centro de Diagnóstico debe permitir comprender el estado de Kickoff sin convertir la aplicación en una consola administrativa insegura.

Su función principal será detectar y explicar problemas antes de intentar repararlos.

La secuencia recomendada será siempre:

Observar
Verificar
Crear backup
Previsualizar
Confirmar
Ejecutar
Validar
Auditar

Las herramientas avanzadas deben permanecer deshabilitadas mientras no sean necesarias.

La integridad de los pronósticos, resultados y clasificación tendrá prioridad sobre la conveniencia operativa.