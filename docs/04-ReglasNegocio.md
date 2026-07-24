# Reglas de Negocio

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Aprobado para implementación  
**Zona horaria oficial:** `America/Tegucigalpa`  
**Restricción principal:** Todas las funcionalidades esenciales deben operar mediante herramientas y planes gratuitos.

---

## 1. Propósito

Este documento define las reglas de negocio obligatorias de **Quiniela Nacional La Goleada – Kickoff**.

Estas reglas determinan:

- Cómo se registran y aprueban los usuarios.
- Cuándo pueden realizarse pronósticos.
- Cómo se calculan los puntos.
- Cómo se procesa un partido.
- Cómo se ordena la clasificación.
- Cómo se manejan reprogramaciones.
- Qué acciones puede realizar cada rol.
- Cómo se conserva la transparencia.
- Cómo se protege la integridad de la competencia.

Cuando exista una diferencia entre la implementación y este documento, deberá considerarse correcta la regla descrita aquí, salvo que exista una decisión posterior documentada y aprobada.

---

# 2. Convenciones

Cada regla se identifica con un código único.

Ejemplo:


BR-AUTH-001
Prefijos utilizados:

Prefijo Área
BR-GEN  Reglas generales
BR-AUTH Registro, login y contraseñas
BR-USER Usuarios y perfiles
BR-ROLE Roles y permisos
BR-SEASON Temporadas
BR-TEAM Equipos
BR-ROUND  Jornadas
BR-MATCH  Partidos
BR-RESCHEDULE Reprogramaciones
BR-PRED Pronósticos
BR-SCORE  Puntuación
BR-STAND  Clasificación
BR-RESULT Resultados
BR-NOTIF  Notificaciones
BR-SPONSOR  Patrocinadores
BR-AUDIT  Auditoría
BR-DIAG Diagnóstico
BR-DATA Integridad y conservación
BR-TIME Fecha y hora
3. Reglas generales
BR-GEN-001 — Una sola quiniela activa

El sistema administrará una única quiniela activa.

No se implementarán grupos privados, ligas paralelas ni múltiples competencias simultáneas en la versión 1.0.

BR-GEN-002 — Una sola temporada activa

Solo una temporada podrá tener estado activo al mismo tiempo.

Las temporadas anteriores podrán mantenerse cerradas o archivadas.

BR-GEN-003 — Operación gratuita

Ninguna funcionalidad esencial podrá depender de un servicio obligatorio de pago.

Cuando una funcionalidad opcional no pueda operar gratuitamente:

Deberá deshabilitarse.
No deberá impedir el funcionamiento principal.
Deberá documentarse.
BR-GEN-004 — El servidor es la autoridad

Las reglas críticas siempre se validarán en el servidor.

Esto incluye:

Hora de cierre.
Permisos.
Estado de partido.
Rol del usuario.
Puntuación.
Procesamiento.
Acceso a pronósticos ajenos.

La interfaz nunca será la única capa de control.

BR-GEN-005 — Fuente de verdad

La fuente de verdad de la clasificación estará formada por:

Usuarios participantes.
Partidos procesados.
Resultados oficiales.
Pronósticos.
Reglas de puntuación.
Multiplicadores.

La tabla de posiciones deberá poder reconstruirse completamente.

BR-GEN-006 — Prohibición de cálculos manuales

Los administradores no deberán ingresar manualmente:

Puntos de un usuario.
Resultados exactos.
Resultados parciales.
Posiciones.

Todos estos valores serán calculados por el sistema.

BR-GEN-007 — Integridad sobre conveniencia

Si una operación puede provocar inconsistencias, el sistema deberá:

Detenerla.
Mostrar una advertencia clara.
Solicitar confirmación reforzada cuando corresponda.
Ejecutarla dentro de una transacción.
Registrar auditoría.
4. Fecha y hora
BR-TIME-001 — Zona horaria oficial

Toda regla visible de fechas y horarios se interpretará usando:

America/Tegucigalpa
BR-TIME-002 — Almacenamiento en UTC

Las fechas deberán almacenarse en UTC.

La aplicación deberá convertirlas a hora de Honduras para:

Presentación.
Cálculo de cierres.
Auditoría visible.
Notificaciones.
BR-TIME-003 — El reloj del cliente no es confiable

La hora del dispositivo del usuario no podrá autorizar ni rechazar operaciones.

El backend determinará si el pronóstico continúa abierto.

BR-TIME-004 — Cierre predeterminado

El pronóstico cerrará cinco minutos antes del inicio programado del partido.

Ejemplo:

Inicio: 19:00
Cierre: 18:55
BR-TIME-005 — Configuración del cierre

Los minutos de cierre podrán ser configurables a nivel de temporada.

Valor inicial:

5 minutos

Un cambio de configuración no deberá alterar retroactivamente partidos procesados.

BR-TIME-006 — Estado “cierra pronto”

Un partido se considerará próximo a cerrar cuando falten treinta minutos o menos para su cierre.

Este estado será informativo.

La autorización definitiva seguirá dependiendo de la hora calculada en el servidor.

5. Registro y autenticación
BR-AUTH-001 — Registro público controlado

Cualquier visitante podrá completar el formulario de registro.

Registrarse no concede acceso automático a la quiniela.

BR-AUTH-002 — Datos obligatorios

El registro deberá solicitar:

Nombre.
Apellido.
Nickname.
Correo.
Contraseña.
Confirmación de contraseña.
Equipo favorito.
Aceptación de reglas.
BR-AUTH-003 — Correo único

No podrán existir dos cuentas activas o históricas con el mismo correo normalizado.

El correo se comparará sin distinguir mayúsculas y minúsculas.

BR-AUTH-004 — Nickname único

No podrán existir dos usuarios con el mismo nickname normalizado.

La comparación no distinguirá mayúsculas y minúsculas.

Ejemplo:

LaGoleada
lagoleada
LAGOLEADA

deberán considerarse el mismo nickname.

BR-AUTH-005 — Correo inmutable

El correo no podrá ser modificado después del registro.

No podrá cambiarlo:

El usuario.
Un administrador.
El superadministrador mediante la interfaz normal.

Una corrección excepcional requerirá procedimiento técnico documentado y auditoría.

BR-AUTH-006 — Confirmación obligatoria

Una cuenta no podrá iniciar sesión hasta que el correo haya sido confirmado.

BR-AUTH-007 — Aprobación administrativa obligatoria

Después de confirmar el correo, la cuenta quedará pendiente de aprobación.

Solo después de ser aprobada podrá participar.

BR-AUTH-008 — Orden del flujo

El flujo será:

Registro.
Confirmación de correo.
Aprobación administrativa.
Inicio de sesión.

No deberá aprobarse una cuenta cuyo correo no esté confirmado, salvo el superadministrador inicial.

BR-AUTH-009 — Contraseña segura

La contraseña deberá cumplir una política mínima definida en seguridad.

Nunca se almacenará en texto plano.

BR-AUTH-010 — Recuperación de contraseña

La recuperación se realizará mediante enlace enviado al correo registrado.

El token deberá:

Ser de un solo uso.
Tener expiración.
Invalidarse después de utilizarse.
Almacenarse como hash.
BR-AUTH-011 — Respuesta no reveladora

Al solicitar recuperación de contraseña, el sistema no deberá confirmar públicamente si el correo existe.

Respuesta esperada:

Si existe una cuenta asociada, se enviarán instrucciones.

BR-AUTH-012 — Revocación de sesiones

Después de cambiar la contraseña, el sistema podrá revocar todas las sesiones activas del usuario.

La sesión utilizada para completar el cambio también podrá requerir un nuevo login.

BR-AUTH-013 — Primer superadministrador

Cuando no exista un superadministrador, el sistema permitirá completar una instalación inicial protegida.

El primer usuario quedará:

Confirmado.
Aprobado.
Activo.
Con rol SUPER_ADMIN.
BR-AUTH-014 — Instalación inicial única

Después de crear el primer superadministrador, el flujo inicial deberá quedar deshabilitado.

No deberá depender de cookies ni almacenamiento local.

La condición será determinada por la base de datos.

6. Usuarios y perfiles
BR-USER-001 — Nombre público

El nickname será el nombre mostrado en:

Clasificación.
Resultados.
Pronósticos públicos.
Dashboard.
BR-USER-002 — Identificación administrativa

Nombre y apellido serán visibles para administradores, con el objetivo de identificar participantes cuyo nickname no sea suficientemente claro.

BR-USER-003 — Sin fotografía personal

La versión 1.0 no permitirá fotos ni avatares personalizados.

Se mostrará el logo del equipo favorito.

BR-USER-004 — Equipo favorito

Cada usuario deberá elegir un equipo favorito durante el registro.

Si el equipo queda inactivo posteriormente:

El usuario conservará la referencia histórica.
Podrá solicitarse una nueva selección mediante una función futura.
El sistema no deberá fallar.
BR-USER-005 — Estados de cuenta

Los estados funcionales serán:

Pendiente de confirmación.
Pendiente de aprobación.
Aprobada.
Rechazada.
Bloqueada.
Desactivada.
BR-USER-006 — Cuenta rechazada

Una cuenta rechazada no podrá iniciar sesión.

El administrador podrá registrar un motivo opcional.

BR-USER-007 — Cuenta bloqueada

Una cuenta bloqueada:

No podrá iniciar sesión.
No perderá datos históricos.
No será eliminada de temporadas anteriores.
Podrá ser desbloqueada por un administrador autorizado.
BR-USER-008 — Cuenta desactivada

Una cuenta desactivada:

No podrá iniciar sesión.
Mantendrá pronósticos y puntos históricos.
No deberá borrarse físicamente.
BR-USER-009 — Participación en temporada activa

Cuando un usuario sea aprobado durante una temporada activa, podrá añadirse automáticamente como participante de esa temporada.

Regla inicial:

Se incorpora desde el momento de aprobación.
No recibe puntos retroactivos.
Los partidos anteriores sin pronóstico no alterarán puntos.
Podrán contarse como NO_PREDICTION únicamente para estadísticas internas si así se define.
7. Roles y permisos
BR-ROLE-001 — Roles disponibles

Los roles serán:

USER
ADMIN
SUPER_ADMIN
BR-ROLE-002 — Un solo superadministrador

Solo podrá existir un superadministrador activo.

BR-ROLE-003 — Promoción de administradores

Solo el superadministrador podrá promover un usuario a administrador.

BR-ROLE-004 — Retiro de permisos

Solo el superadministrador podrá retirar el rol de administrador.

BR-ROLE-005 — Protección del superadministrador

Un administrador común no podrá:

Bloquear al superadministrador.
Desactivar al superadministrador.
Modificar su rol.
Eliminar sus sesiones de forma administrativa.
Cambiar configuraciones reservadas.
BR-ROLE-006 — Administradores también participan

Los administradores y el superadministrador podrán participar como jugadores de la quiniela.

Sus pronósticos deberán estar sujetos a las mismas reglas y cierres que los demás usuarios.

BR-ROLE-007 — Prohibición de privilegios deportivos

Ser administrador no permitirá:

Pronosticar después del cierre.
Editar su pronóstico cerrado.
Ver pronósticos ajenos antes del cierre.
Asignarse puntos.
modificar puntos manualmente.
BR-ROLE-008 — Autorización en servidor

Toda acción administrativa deberá validar el rol en el servidor.

Ocultar un botón no será suficiente.

8. Equipos
BR-TEAM-001 — Doce equipos iniciales

El sistema incluirá doce equipos precargados.

Los nombres y logos definitivos podrán actualizarse antes de producción.

BR-TEAM-002 — Equipo activo

Solo equipos activos podrán seleccionarse para nuevos partidos.

BR-TEAM-003 — Conservación histórica

Un equipo inactivo seguirá visible en partidos históricos.

BR-TEAM-004 — Local y visitante diferentes

Un partido no podrá tener el mismo equipo como local y visitante.

BR-TEAM-005 — Logos reemplazables

Los logos deberán poder reemplazarse sin modificar la lógica del sistema.

9. Temporadas
BR-SEASON-001 — Una temporada activa

Solo una temporada podrá encontrarse activa.

BR-SEASON-002 — Estados de temporada

Los estados serán:

Borrador.
Activa.
Cerrada.
Archivada.
BR-SEASON-003 — Temporada en borrador

Una temporada en borrador podrá configurarse sin ser visible para usuarios normales.

BR-SEASON-004 — Activación

Antes de activar una temporada deberán validarse:

Configuración de puntuación.
Equipos disponibles.
Nombre.
Reglas de cierre.
Ausencia de otra temporada activa.
BR-SEASON-005 — Parámetros congelados

Al activar una temporada deberán conservarse sus parámetros:

Puntos por exacto.
Puntos por parcial.
Puntos por error.
Multiplicador doble.
Minutos de cierre.
Máximo de goles.
BR-SEASON-006 — Cambios de reglas durante una temporada

Cambiar reglas de puntuación en una temporada activa requerirá:

Confirmación reforzada.
Auditoría.
Recalculo completo.
Registro de la configuración anterior.

La versión 1.0 deberá evitar cambios frecuentes en estas reglas.

BR-SEASON-007 — Cierre de temporada

Una temporada solo podrá cerrarse mediante acción del superadministrador o permiso equivalente explícito.

BR-SEASON-008 — Validaciones de cierre

Antes de cerrar deberá verificarse:

Si existen partidos abiertos.
Si existen partidos cerrados no procesados.
Si existen partidos suspendidos.
Si la clasificación es consistente.
Si se generó la tabla final.

El sistema podrá permitir el cierre con excepciones, pero deberá mostrar advertencias.

BR-SEASON-009 — Historial final

Al cerrar una temporada se guardará una instantánea final con:

Posiciones.
Nicknames.
Puntos.
Exactos.
Parciales.
Campeón o campeones.
BR-SEASON-010 — Campeones compartidos

Si dos o más usuarios comparten la primera posición según los criterios definidos, todos serán considerados campeones.

10. Jornadas
BR-ROUND-001 — Nombre libre

Una jornada podrá tener nombres como:

Jornada 1.
Jornada 5.
Repechaje Ida.
Semifinal Vuelta.
Final.
BR-ROUND-002 — Secuencia no cronológica

El campo de secuencia solo se utilizará para organización visual.

No determinará el orden real de los partidos.

BR-ROUND-003 — Jornada incompleta permitida

Una jornada podrá crearse sin todos sus partidos.

El sistema podrá mostrar una advertencia, pero no deberá bloquear su edición.

BR-ROUND-004 — Publicación

Una jornada podrá publicarse cuando:

Tenga al menos un partido.
Tenga exactamente un partido doble.
Todos sus partidos tengan equipos y fecha válidos.
BR-ROUND-005 — Exactamente un partido doble

Cada jornada publicada deberá tener exactamente un partido de puntuación doble.

BR-ROUND-006 — Jornada con partidos reprogramados

Una jornada podrá permanecer incompleta durante semanas o meses debido a reprogramaciones.

Esto no será una inconsistencia.

BR-ROUND-007 — Finalización de jornada

Una jornada podrá considerarse completada cuando todos sus partidos no cancelados estén procesados.

No se utilizará la fecha de otras jornadas para determinarlo.

BR-ROUND-008 — Archivo

Una jornada con partidos históricos deberá archivarse en lugar de eliminarse.

11. Partidos
BR-MATCH-001 — Datos obligatorios

Todo partido deberá tener:

Temporada.
Jornada.
Equipo local.
Equipo visitante.
Fecha y hora.
Estado.
Indicador de partido doble.
BR-MATCH-002 — Fecha independiente

Cada partido tendrá su propia fecha y hora.

No se heredará obligatoriamente una única fecha desde la jornada.

BR-MATCH-003 — Duplicados

El sistema deberá advertir si parece existir un partido duplicado.

La advertencia podrá considerar:

Misma jornada.
Mismos equipos.
Fecha similar.
Local y visitante invertidos.

El administrador podrá confirmar si realmente se trata de otro partido válido.

BR-MATCH-004 — Estados válidos

Los estados serán:

Programado.
Reprogramado.
Cerrado.
Suspendido.
Reanudado.
Finalizado pendiente.
Procesado.
Cancelado.
BR-MATCH-005 — Partido programado

Un partido programado y cuyo cierre esté en el futuro permitirá pronósticos.

BR-MATCH-006 — Partido cerrado

Un partido se considera cerrado cuando:

La hora de cierre ya pasó.
No fue cancelado.
No existe una reapertura válida.
BR-MATCH-007 — Partido suspendido

Un partido suspendido no podrá procesarse hasta que exista una decisión oficial.

Podrá:

Reanudarse.
Reprogramarse.
Cancelarse.
Procesarse posteriormente con resultado oficial.
BR-MATCH-008 — Partido cancelado

Un partido cancelado:

No otorgará puntos.
No deberá contar como error del usuario.
No deberá procesarse con marcador.
Mantendrá sus pronósticos históricos.
Deberá quedar auditado.
BR-MATCH-009 — Partido finalizado pendiente

Este estado indica que el partido terminó, pero el administrador todavía no procesó el resultado.

Los pronósticos serán visibles.

Los puntos aún no serán visibles.

BR-MATCH-010 — Partido procesado

Un partido procesado deberá tener:

Marcador oficial.
Fecha de procesamiento.
Administrador responsable.
Versión de resultado.
Puntuaciones calculadas.
BR-MATCH-011 — Orden de visualización

En páginas de pronósticos y dashboard, los partidos deberán ordenarse por fecha real.

Prioridad inicial:

Abiertos más próximos a cerrar.
Cerrados pendientes.
Procesados recientes.
Procesados antiguos.
BR-MATCH-012 — La jornada no determina orden

Un partido de Jornada 5 podrá aparecer después de partidos de Jornada 10 si su fecha real es posterior.

12. Reprogramaciones
BR-RESCHEDULE-001 — Reprogramación válida

Un administrador podrá cambiar la fecha y hora de un partido no cancelado.

BR-RESCHEDULE-002 — Historial obligatorio

Toda reprogramación deberá guardar:

Fecha anterior.
Nueva fecha.
Cierre anterior.
Nuevo cierre.
Administrador.
Fecha del cambio.
Motivo opcional.
BR-RESCHEDULE-003 — No se considera error cronológico

No se deberá generar error si la nueva fecha pertenece cronológicamente a una jornada posterior.

BR-RESCHEDULE-004 — Conservación de jornada

El partido conservará su jornada original, salvo corrección administrativa explícita.

BR-RESCHEDULE-005 — Conservación de pronósticos

Los pronósticos existentes se conservarán después de una reprogramación.

No se eliminarán automáticamente.

BR-RESCHEDULE-006 — Reapertura automática controlada

Si:

El partido no fue procesado.
La nueva hora de cierre está en el futuro.
El partido no está cancelado.

Entonces podrá volver a estar abierto.

BR-RESCHEDULE-007 — Reapertura visible

Cuando un partido vuelva a abrirse:

Se mostrará como reprogramado.
Los usuarios podrán editar sus pronósticos.
La acción quedará auditada.
Podrá generarse una notificación interna.
BR-RESCHEDULE-008 — Reprogramación después de cierre

Si el partido ya había cerrado, pero es reprogramado:

Los pronósticos existentes permanecerán.
Los usuarios podrán modificarlos si se reabre.
La interfaz deberá informar claramente la nueva fecha.
BR-RESCHEDULE-009 — Reprogramación después de procesamiento

Un partido procesado no podrá reprogramarse mediante el flujo normal.

Primero deberá revertirse o corregirse el resultado mediante una operación administrativa especial.

13. Pronósticos
BR-PRED-001 — Un pronóstico por partido

Cada usuario podrá tener como máximo un pronóstico por partido.

Las modificaciones actualizarán el mismo registro.

BR-PRED-002 — Solo marcador

El pronóstico consistirá únicamente en:

Goles del local.
Goles del visitante.

No se seleccionará el ganador por separado.

BR-PRED-003 — Valores enteros

Los goles deberán ser números enteros.

BR-PRED-004 — Valores no negativos

No se aceptarán valores negativos.

BR-PRED-005 — Límite máximo

Los goles no podrán superar el máximo configurado para la temporada.

Valor sugerido inicial:

20
BR-PRED-006 — Guardado antes del cierre

El pronóstico podrá crearse o editarse mientras:

hora actual del servidor < predictionClosesAt
BR-PRED-007 — Bloqueo al cierre

Cuando:

hora actual del servidor >= predictionClosesAt

el pronóstico no podrá crearse ni modificarse.

BR-PRED-008 — Solicitud iniciada antes del cierre

No importa cuándo el usuario comenzó a escribir.

La operación deberá recibirse y validarse en el servidor antes del cierre.

BR-PRED-009 — Guardado automático

La interfaz podrá usar guardado automático.

El estado visual deberá indicar:

Guardando.
Guardado.
Error.
Cerrado.
BR-PRED-010 — Confirmación del backend

La interfaz solo deberá mostrar “guardado” después de recibir confirmación del servidor.

BR-PRED-011 — Pronóstico incompleto

Un pronóstico que no tenga ambos marcadores válidos no se considerará registrado.

Ejemplo inválido:

Local: 2
Visitante: vacío
BR-PRED-012 — Ausencia de pronóstico

Si al cierre no existe un pronóstico válido:

El usuario recibe cero puntos.
No se crea automáticamente un marcador 0-0.
No debe interpretarse como una predicción de empate.
BR-PRED-013 — Edición administrativa prohibida

Los administradores no podrán editar pronósticos de otros usuarios desde la interfaz normal.

BR-PRED-014 — Pronósticos de administradores

Los administradores deberán guardar sus pronósticos mediante el mismo flujo que los usuarios.

BR-PRED-015 — Privacidad antes del cierre

Mientras el partido esté abierto:

El usuario solo verá su pronóstico.
No podrá consultar pronósticos agregados.
No podrá consultar pronósticos de administradores.
No se mostrarán distribuciones de marcadores.
BR-PRED-016 — Visibilidad después del cierre

Después del cierre, los pronósticos registrados serán visibles para todos los usuarios aprobados.

BR-PRED-017 — Sin puntos antes del procesamiento

Después del cierre pero antes de procesar el resultado:

Se mostrarán pronósticos.
No se mostrarán puntos.
No se clasificará como exacto, parcial o incorrecto.
BR-PRED-018 — Pronóstico histórico

Después del procesamiento, el pronóstico no deberá modificarse.

14. Partido doble
BR-SCORE-001 — Un partido doble por jornada

Cada jornada publicada tendrá exactamente un partido doble.

BR-SCORE-002 — Multiplicador

El partido doble multiplicará por dos los puntos base.

BR-SCORE-003 — Exacto doble

Un exacto en partido doble otorgará:

3 × 2 = 6 puntos
BR-SCORE-004 — Parcial doble

Un parcial en partido doble otorgará:

1 × 2 = 2 puntos
BR-SCORE-005 — Incorrecto doble

Un pronóstico incorrecto en partido doble otorgará cero puntos.

BR-SCORE-006 — Sin pronóstico doble

No pronosticar el partido doble otorgará cero puntos.

BR-SCORE-007 — Cambio antes del inicio

El administrador podrá cambiar el partido doble mientras:

Ningún partido afectado haya sido procesado.
La operación no contradiga cierres ya consumados.
El sistema muestre advertencia cuando existan pronósticos cerrados.
BR-SCORE-008 — Cambio después de procesamiento

Un cambio posterior al procesamiento requerirá:

Permiso de superadministrador.
Confirmación reforzada.
Recalculo.
Auditoría.
Conservación del valor anterior.
BR-SCORE-009 — Visibilidad

El partido doble deberá identificarse claramente antes de que el usuario pronostique.

15. Cálculo de puntuación
BR-SCORE-010 — Resultado exacto

Existe resultado exacto cuando:

predictedHomeGoals = officialHomeGoals
AND
predictedAwayGoals = officialAwayGoals

Puntos base:

3
BR-SCORE-011 — Resultado parcial

Existe resultado parcial cuando no hay exacto, pero se acierta el desenlace.

Desenlaces posibles:

Victoria local.
Victoria visitante.
Empate.

Puntos base:

1
BR-SCORE-012 — Resultado incorrecto

Existe resultado incorrecto cuando no se acierta el desenlace.

Puntos:

0
BR-SCORE-013 — Función de desenlace

El desenlace se determinará así:

HOME_WIN si homeGoals > awayGoals
AWAY_WIN si homeGoals < awayGoals
DRAW si homeGoals = awayGoals
BR-SCORE-014 — Prioridad del exacto

Primero se deberá verificar si el resultado es exacto.

Solo si no es exacto se evaluará si es parcial.

BR-SCORE-015 — Multiplicación posterior

El multiplicador se aplicará después de determinar los puntos base.

awardedPoints = basePoints × multiplier
BR-SCORE-016 — Puntos no negativos

Ninguna regla podrá generar puntos negativos en Kickoff.

BR-SCORE-017 — Partido cancelado

Un partido cancelado no generará puntuaciones.

BR-SCORE-018 — Partido suspendido

Un partido suspendido no generará puntuaciones hasta que exista un resultado oficial procesable.

BR-SCORE-019 — Resultado administrativo

Solo un resultado procesado oficialmente generará puntos.

La fecha de cierre por sí sola no genera puntuación.

BR-SCORE-020 — Configuración histórica

La puntuación deberá aplicar las reglas asociadas a la temporada y versión correspondientes.

No deberá depender únicamente de la configuración global actual.

16. Procesamiento de resultados
BR-RESULT-001 — Procesamiento individual

Los partidos se procesarán uno por uno.

BR-RESULT-002 — Permiso requerido

Solo un administrador o superadministrador podrá procesar un resultado.

BR-RESULT-003 — Marcador obligatorio

Para procesar se deberán informar:

Goles oficiales del local.
Goles oficiales del visitante.
BR-RESULT-004 — Marcador válido

Los goles oficiales deberán:

Ser enteros.
Ser no negativos.
Respetar un límite técnico razonable.
BR-RESULT-005 — Confirmación obligatoria

Antes de procesar, el sistema mostrará una confirmación.

BR-RESULT-006 — Transacción

El procesamiento completo deberá ejecutarse dentro de una transacción.

BR-RESULT-007 — Operaciones del procesamiento

La transacción deberá incluir:

Validación del partido.
Guardado del resultado.
Cálculo de puntuaciones.
Actualización de exactos y parciales.
Actualización de clasificación.
Creación de snapshot.
Cambio de estado.
Auditoría.
BR-RESULT-008 — Fallo total

Si una parte falla, toda la operación deberá revertirse.

BR-RESULT-009 — Procesamiento concurrente

Dos administradores no podrán procesar el mismo partido simultáneamente.

Solo una solicitud podrá completar la transición.

BR-RESULT-010 — Usuarios sin pronóstico

Durante el procesamiento, los usuarios participantes sin pronóstico recibirán cero puntos.

BR-RESULT-011 — Usuarios bloqueados

Un usuario bloqueado después de haber pronosticado conservará su puntuación histórica.

BR-RESULT-012 — Usuario aprobado tarde

Un usuario incorporado después del cierre de un partido no recibirá puntos y no deberá generar inconsistencias.

BR-RESULT-013 — Corrección de resultado

Un partido procesado podrá corregirse únicamente mediante flujo especial.

BR-RESULT-014 — Datos de corrección

La corrección conservará:

Marcador anterior.
Marcador nuevo.
Administrador.
Motivo.
Fecha.
Versión anterior.
Versión nueva.
BR-RESULT-015 — Recalculo por corrección

Una corrección deberá recalcular:

Puntuaciones del partido.
Totales de temporada.
Clasificación.
Posiciones.
Tendencias.
17. Clasificación
BR-STAND-001 — Columnas visibles

La tabla mostrará:

Posición.
Nickname.
Parciales.
Exactos.
Puntos.
Tendencia.
BR-STAND-002 — Primer criterio

El primer criterio de orden será mayor cantidad de puntos.

BR-STAND-003 — Segundo criterio

En igualdad de puntos, tendrá ventaja quien tenga más resultados exactos.

BR-STAND-004 — Empate completo

Si puntos y exactos son iguales, los usuarios compartirán posición.

BR-STAND-005 — Parciales no desempatan

La cantidad de resultados parciales no será criterio de desempate en Kickoff.

BR-STAND-006 — Orden visual entre empatados

Cuando dos usuarios compartan posición, podrán ordenarse visualmente por nickname para estabilidad de la tabla.

Esto no implicará un desempate deportivo.

BR-STAND-007 — Posición de competencia

Se utilizará clasificación de competencia.

Ejemplo:

1, 2, 2, 4

No:

1, 2, 2, 3
BR-STAND-008 — Tendencia

La tendencia comparará la posición actual con la instantánea anterior.

Valores:

Subió.
Bajó.
Igual.
Sin dato previo.
BR-STAND-009 — Empates y tendencia

Si un usuario pasa de posición 3 a compartir posición 2, se considerará que subió.

BR-STAND-010 — Recalculo reproducible

La clasificación calculada desde cero deberá coincidir con la clasificación almacenada.

BR-STAND-011 — Usuarios sin puntos

Los participantes con cero puntos deberán aparecer en la tabla.

BR-STAND-012 — Usuarios desactivados

Un usuario desactivado podrá seguir apareciendo en tablas históricas.

En la temporada activa podrá mostrarse con estado especial o excluirse de nuevas participaciones según decisión administrativa.

18. Resultados y transparencia
BR-RESULT-016 — Visibilidad por cierre

Los pronósticos se harán visibles cuando el partido cierre, no cuando sea procesado.

BR-RESULT-017 — Puntos por procesamiento

Los puntos solo se harán visibles después de procesar el resultado.

BR-RESULT-018 — Información antes del procesamiento

Se mostrará:

Nickname.
Marcador pronosticado.

No se mostrará:

Exacto.
Parcial.
Incorrecto.
Puntos.
BR-RESULT-019 — Información después del procesamiento

Se mostrará:

Nickname.
Pronóstico.
Tipo de acierto.
Puntos obtenidos.
BR-RESULT-020 — Usuarios sin pronóstico

Después del cierre podrá indicarse:

Sin pronóstico

Después del procesamiento mostrará:

0 puntos
BR-RESULT-021 — Orden de usuarios

La lista de pronósticos podrá ordenarse por:

Nickname.
Puntos obtenidos.
Clasificación general.

El orden predeterminado deberá ser estable y comprensible.

19. Dashboard
BR-GEN-008 — Pantalla inicial

Después de iniciar sesión, el usuario será dirigido al dashboard.

BR-GEN-009 — Información mínima

El dashboard mostrará:

Posición.
Puntos.
Exactos.
Parciales.
Próximo cierre.
Pronósticos pendientes.
Partido doble.
Top 5.
BR-GEN-010 — Próximo cierre

El próximo cierre deberá determinarse por fecha real, sin considerar el número de jornada.

BR-GEN-011 — Pronósticos pendientes

Se contarán únicamente partidos:

Disponibles para pronosticar.
En los que el usuario no tiene un pronóstico válido.
BR-GEN-012 — Acción principal

Cuando existan pendientes, el dashboard mostrará una acción clara para ir a pronosticar.

20. Notificaciones
BR-NOTIF-001 — Notificaciones internas

El sistema podrá crear notificaciones internas para:

Cuenta aprobada.
Cuenta rechazada.
Partido reprogramado.
Partido próximo a cerrar.
Resultado procesado.
Jornada publicada.
BR-NOTIF-002 — Notificación de pendientes

El dashboard deberá informar si existen partidos sin pronóstico.

BR-NOTIF-003 — Correo antes del cierre

Los recordatorios por correo antes del cierre serán opcionales.

Solo se implementarán si pueden operar gratuitamente y con suficiente fiabilidad.

BR-NOTIF-004 — No duplicación excesiva

El sistema deberá evitar enviar o crear múltiples notificaciones idénticas para el mismo evento.

BR-NOTIF-005 — Leído

El usuario podrá marcar notificaciones como leídas.

21. Patrocinadores
BR-SPONSOR-001 — Patrocinadores opcionales

La ausencia de patrocinadores no deberá afectar la interfaz.

BR-SPONSOR-002 — Datos

Un patrocinador podrá tener:

Nombre.
Imagen.
Enlace.
Orden.
Estado.
BR-SPONSOR-003 — Solo activos

Solo se mostrarán patrocinadores activos y dentro de su vigencia, cuando aplique.

BR-SPONSOR-004 — Enlaces externos

Los enlaces deberán validarse y abrirse de forma segura.

22. Auditoría
BR-AUDIT-001 — Auditoría obligatoria

Toda acción administrativa relevante deberá crear un registro de auditoría.

BR-AUDIT-002 — Solo inserción

Los registros no podrán modificarse ni eliminarse desde la aplicación.

BR-AUDIT-003 — Actor

La auditoría deberá registrar quién realizó la acción.

Para acciones automáticas se utilizará actor de sistema.

BR-AUDIT-004 — Valores anteriores y nuevos

Cuando corresponda, se conservarán:

Estado anterior.
Estado nuevo.
Valor anterior.
Valor nuevo.
BR-AUDIT-005 — Datos sensibles

La auditoría no almacenará:

Contraseñas.
Hashes de contraseñas.
Tokens.
Credenciales SMTP.
Secretos.
Cookies.
BR-AUDIT-006 — Acciones mínimas

Se auditarán:

Login administrativo.
Logout administrativo.
Aprobaciones.
Rechazos.
Bloqueos.
Cambios de rol.
Cambios de temporada.
Jornadas.
Partidos.
Reprogramaciones.
Partido doble.
Procesamiento.
Correcciones.
Recalculo.
Exportaciones.
Modo mantenimiento.
SQL avanzado.
BR-AUDIT-007 — Filtros

Los administradores autorizados podrán filtrar auditoría por:

Fecha.
Actor.
Acción.
Entidad.
BR-AUDIT-008 — Auditoría de administradores

Las acciones de los tres administradores deberán quedar diferenciadas claramente.

23. Centro de diagnóstico
BR-DIAG-001 — Acceso restringido

El centro de diagnóstico completo será exclusivo del superadministrador.

BR-DIAG-002 — Estado de servicios

Podrá verificar:

Base de datos.
SMTP.
Configuración.
Cantidad de registros.
Errores recientes.
BR-DIAG-003 — Sin secretos

Los diagnósticos no deberán mostrar secretos ni credenciales.

BR-DIAG-004 — Verificador de integridad

El verificador deberá detectar al menos:

Temporadas activas duplicadas.
Superadministradores duplicados.
Pronósticos duplicados.
Partidos con equipos iguales.
Jornadas sin partido doble.
Jornadas con múltiples partidos dobles.
Puntos inconsistentes.
Clasificación inconsistente.
Partidos procesados sin resultado.
Puntuaciones de partidos no procesados.
BR-DIAG-005 — Simulador

El simulador podrá generar:

Usuarios.
Partidos.
Pronósticos.
Resultados.
BR-DIAG-006 — Datos identificables

Todo dato simulado deberá identificarse como dato de prueba.

BR-DIAG-007 — Protección en producción

Las herramientas de prueba deberán estar deshabilitadas por defecto en producción.

BR-DIAG-008 — Recalculo

El superadministrador podrá recalcular una temporada completa.

BR-DIAG-009 — Un recalculo simultáneo

No podrán ejecutarse dos recalculos simultáneos sobre la misma temporada.

24. Consola SQL
BR-DIAG-010 — Modo predeterminado

La consola SQL funcionará en modo de solo lectura por defecto.

Permitirá únicamente consultas SELECT.

BR-DIAG-011 — Restricción de múltiples instrucciones

No se permitirán múltiples instrucciones concatenadas en modo seguro.

BR-DIAG-012 — Tiempo y cantidad

Las consultas deberán tener:

Tiempo máximo.
Límite máximo de filas.
Paginación o truncamiento.
BR-DIAG-013 — Modo escritura

El modo de escritura:

Será exclusivo del superadministrador.
Estará deshabilitado por defecto.
Requerirá bandera de entorno.
Requerirá confirmación.
Quedará auditado.
BR-DIAG-014 — Instrucciones peligrosas

Operaciones como las siguientes deberán bloquearse o requerir procedimiento técnico externo:

DROP DATABASE
DROP SCHEMA
TRUNCATE masivo
ALTER ROLE
GRANT
REVOKE
BR-DIAG-015 — Auditoría SQL

Se registrará:

Actor.
Fecha.
Tipo de consulta.
Duración.
Cantidad de filas.
Resultado general.
Consulta sanitizada cuando sea seguro.
25. Exportaciones y respaldos
BR-DATA-001 — Formatos

Las exportaciones iniciales podrán realizarse en:

CSV.
JSON.
BR-DATA-002 — Datos excluidos

Nunca se exportarán:

Contraseñas.
Hashes.
Tokens.
Secretos.
Cookies.
Credenciales SMTP.
BR-DATA-003 — Auditoría de exportación

Toda exportación administrativa deberá quedar auditada.

BR-DATA-004 — Respaldo antes de limpiar

Antes de limpiar datos de una temporada deberá generarse o confirmarse un respaldo.

BR-DATA-005 — Restauración

La restauración deberá:

Validar el formato.
Mostrar una previsualización.
Ejecutarse en transacción.
Registrar auditoría.
Evitar sobrescribir datos sin confirmación.
26. Soft delete y conservación
BR-DATA-006 — Usuarios

Los usuarios deberán desactivarse o bloquearse en lugar de eliminarse.

BR-DATA-007 — Equipos

Los equipos deberán marcarse como inactivos.

BR-DATA-008 — Jornadas

Las jornadas con historial deberán archivarse.

BR-DATA-009 — Partidos

Los partidos con pronósticos deberán cancelarse o archivarse.

BR-DATA-010 — Pronósticos

Los pronósticos no deberán eliminarse mediante flujos administrativos normales.

BR-DATA-011 — Auditoría

La auditoría no deberá eliminarse.

BR-DATA-012 — Eliminación física excepcional

Una eliminación física requerirá:

Respaldo.
Permiso de superadministrador.
Justificación.
Auditoría.
Procedimiento técnico explícito.
27. Recalculo completo
BR-STAND-013 — Fuente de recalculo

El recalculo deberá partir de:

Participantes.
Partidos procesados.
Resultados activos.
Pronósticos.
Multiplicadores.
Reglas de temporada.
BR-STAND-014 — Sustitución atómica

La nueva clasificación deberá sustituir a la anterior de forma atómica.

BR-STAND-015 — Validación posterior

Después del recalculo se verificará:

Suma de puntos.
Exactos.
Parciales.
Posiciones.
Cantidad de usuarios.
Partidos procesados.
BR-STAND-016 — Resultado repetible

Ejecutar dos veces el recalculo sin cambios de datos deberá producir el mismo resultado.

BR-STAND-017 — Auditoría

Todo recalculo deberá registrar:

Actor.
Temporada.
Inicio.
Fin.
Usuarios procesados.
Partidos procesados.
Resultado.
Errores.
28. Modo mantenimiento
BR-GEN-013 — Activación

Solo el superadministrador podrá activar el modo mantenimiento.

BR-GEN-014 — Acceso de usuarios

Durante mantenimiento, los usuarios normales verán una página informativa.

BR-GEN-015 — Acceso administrativo

Los administradores autorizados podrán conservar acceso para resolver problemas.

BR-GEN-016 — Auditoría

La activación y desactivación deberán quedar auditadas.

29. Casos especiales
BR-GEN-017 — Partido sin pronósticos

Un partido podrá procesarse aunque ningún usuario haya pronosticado.

La clasificación no cambiará.

BR-GEN-018 — Jornada con un solo partido

Una jornada podrá tener un solo partido.

Ese partido deberá ser el doble.

BR-GEN-019 — Partido agregado tarde

Un partido podrá añadirse a una jornada existente mientras no contradiga integridad histórica.

Los usuarios deberán ser notificados si todavía pueden pronosticar.

BR-GEN-020 — Cambio de equipo

Cambiar los equipos de un partido después de que existan pronósticos requerirá advertencia reforzada.

Regla recomendada:

No permitirlo después del cierre.
Antes del cierre, conservar auditoría y notificar.
Si el cambio representa otro partido, cancelar el anterior y crear uno nuevo.
BR-GEN-021 — Cambio de estadio

Cambiar el estadio no afecta pronósticos ni puntuación.

Debe quedar auditado si la modificación es administrativa relevante.

BR-GEN-022 — Partido con resultado extraordinario

La versión 1.0 utilizará únicamente el marcador oficial definido por el administrador.

No se incluirán automáticamente:

Penales de desempate.
Marcador global.
Tiempo extra como categoría separada.

El administrador deberá ingresar el resultado que deba considerarse para la quiniela según el reglamento previamente comunicado.

BR-GEN-023 — Resultados por penales

Si un partido empatado se decide por penales, la puntuación se basará en el marcador oficial configurado para la quiniela.

Por defecto:

Se utilizará el marcador del partido.
La tanda de penales no se sumará al marcador.

Cualquier excepción deberá informarse antes del partido.

30. Reglas de interfaz derivadas
BR-GEN-024 — Estados visibles

La interfaz deberá distinguir:

Abierto.
Cierra pronto.
Cerrado.
Reprogramado.
Suspendido.
Procesado.
Cancelado.
BR-GEN-025 — Color no exclusivo

Los estados no deberán comunicarse únicamente mediante color.

También usarán:

Texto.
Icono.
Etiqueta.
BR-GEN-026 — Partido doble destacado

El partido doble deberá ser visible sin necesidad de abrir el detalle.

BR-GEN-027 — Confirmaciones

Se requerirá confirmación antes de:

Procesar resultado.
Corregir resultado.
Cancelar partido.
Cambiar partido doble con impacto.
Cerrar temporada.
Recalcular.
Generar datos en producción.
Ejecutar SQL de escritura.
31. Matriz resumida de permisos
Acción  Usuario Administrador Superadministrador
Pronosticar Sí  Sí  Sí
Ver tabla Sí  Sí  Sí
Ver resultados cerrados Sí  Sí  Sí
Aprobar usuarios  No  Sí  Sí
Crear jornadas  No  Sí  Sí
Crear partidos  No  Sí  Sí
Reprogramar No  Sí  Sí
Procesar resultados No  Sí  Sí
Gestionar patrocinadores  No  Sí  Sí
Ver auditoría No  Sí  Sí
Promover administradores  No  No  Sí
Modo mantenimiento  No  No  Sí
Consola SQL No  No  Sí
Generar datos de prueba No  No  Sí
Recalcular temporada  No  Según permiso Sí
Eliminar auditoría  No  No  No
32. Ejemplos de puntuación
Ejemplo 1 — Exacto
Pronóstico: 2-1
Resultado:  2-1
Tipo: EXACT
Puntos: 3
Ejemplo 2 — Victoria local parcial
Pronóstico: 1-0
Resultado:  3-2
Tipo: PARTIAL
Puntos: 1
Ejemplo 3 — Empate parcial
Pronóstico: 1-1
Resultado:  2-2
Tipo: PARTIAL
Puntos: 1
Ejemplo 4 — Incorrecto
Pronóstico: 2-0
Resultado:  0-1
Tipo: WRONG
Puntos: 0
Ejemplo 5 — Exacto doble
Pronóstico: 2-2
Resultado:  2-2
Base: 3
Multiplicador: 2
Puntos: 6
Ejemplo 6 — Parcial doble
Pronóstico: 1-0
Resultado:  4-1
Base: 1
Multiplicador: 2
Puntos: 2
Ejemplo 7 — Sin pronóstico
Pronóstico: No registrado
Resultado:  1-0
Tipo: NO_PREDICTION
Puntos: 0
33. Criterios de aceptación generales

Las reglas se considerarán correctamente implementadas cuando:

Los cierres dependan del servidor.
Los pronósticos abiertos sean privados.
Los pronósticos cerrados sean visibles.
Los puntos solo aparezcan después del procesamiento.
El exacto otorgue tres puntos.
El parcial otorgue un punto.
El partido doble multiplique por dos.
Los empates de tabla compartan posición.
Los parciales no rompan empates.
Los partidos puedan procesarse fuera del orden de jornada.
Las reprogramaciones conserven historial.
Los administradores no tengan privilegios deportivos.
Las acciones críticas sean transaccionales.
Las acciones administrativas sean auditadas.
La clasificación pueda recalcularse.
No se requieran servicios de pago.
34. Casos que deben cubrirse con pruebas

Como mínimo:

Exacto normal.
Exacto doble.
Parcial local.
Parcial visitante.
Parcial empate.
Incorrecto.
Sin pronóstico.
Pronóstico un segundo antes del cierre.
Pronóstico exactamente en el cierre.
Pronóstico después del cierre.
Reprogramación antes del cierre.
Reprogramación después del cierre.
Partido de Jornada 5 después de Jornada 10.
Partido suspendido.
Partido cancelado.
Corrección de resultado.
Empate completo en clasificación.
Mismo puntaje con más exactos.
Usuario aprobado durante temporada.
Procesamiento simultáneo.
Recalculo repetible.
Cambio de partido doble.
Administrador intentando pronosticar tarde.
Usuario bloqueado con datos históricos.
Jornada publicada sin partido doble.
35. Reglas no modificables sin aprobación

Las siguientes decisiones requieren aprobación funcional explícita antes de cambiarse:

Exacto vale 3.
Parcial vale 1.
Incorrecto vale 0.
Partido doble multiplica por 2.
Exactamente un partido doble por jornada.
Cierre cinco minutos antes.
Los pronósticos se revelan al cierre.
Los puntos se revelan al procesamiento.
Puntos y exactos son los únicos criterios de desempate.
Los empatados comparten posición.
El correo es inmutable.
Cualquier persona puede registrarse, pero requiere aprobación.
Solo existe una quiniela activa.
Las reprogramaciones no dependen del orden de jornada.
Todo debe poder operar gratuitamente.
36. Documentos relacionados

Consultar:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/10-ManualAdministrador.md
docs/17-CODEX_INSTRUCTIONS.md
37. Conclusión

Las reglas de Kickoff están diseñadas para garantizar:

Competencia justa.
Transparencia.
Procesamiento automático.
Flexibilidad ante reprogramaciones.
Protección frente a modificaciones tardías.
Trazabilidad administrativa.
Clasificación reproducible.
Operación gratuita.

Ningún usuario, incluyendo administradores, deberá obtener ventajas deportivas por su rol dentro del sistema.