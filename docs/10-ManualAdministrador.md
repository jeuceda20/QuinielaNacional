# Manual del Administrador

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Audiencia:** Administradores y superadministrador  
**Zona horaria oficial:** `America/Tegucigalpa`  
**Objetivo:** Explicar la operación diaria de la quiniela sin necesidad de realizar cálculos manuales ni acceder directamente a la base de datos.

---

## 1. Propósito

Este manual explica cómo administrar **Quiniela Nacional La Goleada – Kickoff**.

Incluye los procedimientos para:

- Iniciar y cerrar sesiones administrativas.
- Aprobar o rechazar usuarios.
- Gestionar usuarios.
- Crear temporadas.
- Crear jornadas.
- Crear partidos.
- Elegir el partido de puntuación doble.
- Reprogramar, suspender y cancelar partidos.
- Procesar resultados.
- Corregir resultados.
- Consultar la clasificación.
- Gestionar patrocinadores.
- Consultar auditorías.
- Cerrar una temporada.
- Generar respaldos.
- Ejecutar verificaciones de integridad.
- Utilizar herramientas reservadas al superadministrador.

Los administradores no deberán calcular puntos ni modificar posiciones manualmente.

---

# 2. Roles administrativos

## 2.1 Administrador

Un administrador puede:

- Aprobar usuarios.
- Rechazar usuarios.
- Bloquear y desbloquear usuarios.
- Crear y editar jornadas.
- Crear y editar partidos.
- Reprogramar partidos.
- Suspender y reanudar partidos.
- Cancelar partidos.
- Definir el partido doble.
- Procesar resultados.
- Gestionar patrocinadores.
- Consultar auditorías permitidas.

Un administrador no puede:

- Promover otros administradores.
- Retirar administradores.
- Modificar al superadministrador.
- Ejecutar SQL de escritura.
- Restaurar respaldos.
- Cambiar secretos.
- Eliminar auditorías.
- Modificar puntos directamente.
- Pronosticar después del cierre.

---

## 2.2 Superadministrador

El superadministrador puede realizar todas las acciones del administrador y además:

- Promover usuarios a administrador.
- Retirar permisos administrativos.
- Gestionar configuraciones críticas.
- Activar mantenimiento.
- Cerrar temporadas.
- Corregir resultados procesados.
- Recalcular temporadas.
- Generar y restaurar respaldos.
- Acceder al centro de diagnóstico.
- Utilizar herramientas de prueba.
- Utilizar la consola SQL protegida.

Solo existirá un superadministrador activo.

---

# 3. Acceso al panel administrativo

## 3.1 Iniciar sesión

1. Abra el sitio.
2. Seleccione **Iniciar sesión**.
3. Ingrese su correo.
4. Ingrese su contraseña.
5. Seleccione **Ingresar**.
6. Abra la opción **Administración**.

Si la cuenta está bloqueada o desactivada, el sistema no permitirá el acceso.

---

## 3.2 Seguridad de la sesión

No comparta:

- Contraseña.
- Cookie de sesión.
- Enlaces de recuperación.
- Códigos de inicialización.
- Credenciales SMTP.

Al utilizar un equipo compartido:

1. Cierre sesión al terminar.
2. No guarde la contraseña en el navegador.
3. Cierre todas las ventanas.
4. No descargue respaldos en carpetas públicas.

---

## 3.3 Cerrar sesión

Seleccione:


Perfil → Cerrar sesión

El sistema revocará la sesión actual.

4. Dashboard administrativo

El dashboard administrativo resume el estado operativo.

Podrá mostrar:

Usuarios pendientes.
Partidos abiertos.
Partidos próximos a cerrar.
Partidos cerrados sin procesar.
Partidos reprogramados.
Jornadas activas.
Últimas acciones administrativas.
Advertencias de integridad.
Estado general del sistema.

Acciones rápidas:

Aprobar usuarios
Crear jornada
Crear partido
Procesar resultado
5. Gestión de usuarios pendientes
5.1 Flujo de aprobación

Una cuenta debe cumplir:

Correo confirmado.
Estado pendiente de aprobación.
Datos básicos válidos.

Para aprobar:

Abra Administración.
Seleccione Usuarios pendientes.
Revise:
Nombre.
Apellido.
Nickname.
Correo.
Equipo favorito.
Confirme que pertenece a la comunidad.
Seleccione Aprobar.
Confirme la acción.

El usuario podrá iniciar sesión después de la aprobación.

5.2 Incorporación a temporada activa

Si existe una temporada activa, el sistema podrá mostrar:

Agregar a la temporada activa

Al habilitar esta opción:

El usuario aparecerá en la clasificación.
Comenzará con cero puntos.
No obtendrá puntos retroactivos.
Podrá pronosticar partidos todavía abiertos.
5.3 Rechazar una cuenta
Abra la solicitud.
Seleccione Rechazar.
Ingrese un motivo opcional.
Confirme.

Una cuenta rechazada no podrá iniciar sesión.

La acción quedará registrada en auditoría.

5.4 Cuenta no confirmada

No apruebe manualmente una cuenta sin correo confirmado.

El sistema deberá impedirlo.

Puede solicitar al usuario que:

Revise su correo.
Revise spam.
Utilice Reenviar confirmación.
6. Gestión de usuarios aprobados
6.1 Consultar usuarios

En:

Administración → Usuarios

Filtros disponibles:

Todos.
Pendientes.
Aprobados.
Rechazados.
Bloqueados.
Desactivados.
Administradores.

Búsqueda:

Nombre.
Apellido.
Nickname.
Correo.
6.2 Bloquear usuario

Use el bloqueo cuando el acceso deba detenerse temporalmente.

Abra el usuario.
Seleccione Bloquear.
Ingrese el motivo.
Confirme.

Efectos:

No podrá iniciar sesión.
Sus pronósticos y puntos históricos se conservan.
Sus datos no se eliminan.
La acción queda auditada.
6.3 Desbloquear usuario
Abra un usuario bloqueado.
Seleccione Desbloquear.
Confirme.

El usuario podrá volver a iniciar sesión si continúa aprobado y activo.

6.4 Desactivar usuario

Use la desactivación cuando la cuenta ya no deba participar.

Efectos:

No podrá iniciar sesión.
Se conservará su historial.
No se eliminarán pronósticos.
No se eliminarán puntos históricos.
6.5 Correo inmutable

El correo no puede modificarse desde el panel.

Ni el usuario ni el administrador pueden cambiarlo.

Una corrección excepcional requiere:

Procedimiento técnico.
Justificación.
Respaldo.
Auditoría.
Validación de duplicados.
6.6 Nickname

El nickname tampoco deberá modificarse libremente desde la operación normal si ya aparece en históricos.

Cualquier función futura de cambio deberá:

Conservar trazabilidad.
Evitar duplicados.
No alterar tablas históricas guardadas.
7. Gestión de administradores
7.1 Promover un usuario

Solo el superadministrador puede hacerlo.

Abra Usuarios.
Seleccione un usuario aprobado.
Seleccione Convertir en administrador.
Ingrese el motivo.
Confirme.

La acción:

Cambia el rol.
Registra historial de roles.
Registra auditoría.
Puede invalidar o renovar sesiones.
7.2 Selección de administradores

Antes de promover a alguien, confirme que:

Pertenece a la comunidad.
Comprende las reglas.
Puede procesar resultados correctamente.
Mantendrá confidencialidad.
No compartirá credenciales.
Comprende que tampoco puede ver pronósticos abiertos.
7.3 Retirar permisos

Solo el superadministrador puede retirar permisos.

Abra el administrador.
Seleccione Retirar rol de administrador.
Ingrese el motivo.
Confirme.

Sus datos deportivos no se alteran.

7.4 Protección del superadministrador

Ningún administrador normal puede:

Bloquearlo.
Desactivarlo.
Cambiar su rol.
Promover a otro superadministrador.
Retirar sus permisos.
8. Gestión de equipos
8.1 Equipos precargados

La aplicación incluirá doce equipos iniciales.

Cada equipo tendrá:

Nombre.
Nombre corto.
Logo.
Estado.
Orden visual.
8.2 Activar o desactivar equipo

Un equipo inactivo:

No estará disponible para nuevos partidos.
Seguirá apareciendo en partidos históricos.
Seguirá mostrándose como equipo favorito histórico.

No elimine físicamente un equipo utilizado.

8.3 Cambiar logo
Abra el equipo.
Seleccione Cambiar logo.
Cargue una imagen válida.
Revise la previsualización.
Guarde.

Recomendaciones:

PNG o WebP.
Fondo transparente.
Imagen optimizada.
Sin archivos demasiado grandes.
9. Crear una temporada
9.1 Datos requeridos

En:

Administración → Temporadas → Nueva temporada

Ingrese:

Nombre.
Fecha de inicio opcional.
Puntos por exacto.
Puntos por parcial.
Puntos por error.
Multiplicador doble.
Minutos antes del cierre.
Máximo de goles permitido.

Valores iniciales:

Exacto: 3
Parcial: 1
Incorrecto: 0
Multiplicador: 2
Cierre: 5 minutos
9.2 Estado borrador

La nueva temporada deberá crearse inicialmente en borrador.

En borrador podrá:

Añadir jornadas.
Añadir partidos.
Verificar equipos.
Revisar reglas.
Corregir configuración.

Los usuarios normales no deberán verla como activa.

9.3 Activar temporada

Antes de activar:

Confirme que no existe otra activa.
Revise reglas.
Revise equipos.
Revise el nombre.
Revise zona horaria.
Cree respaldo si reemplaza una temporada anterior.

Seleccione:

Activar temporada

Después de activarla, los cambios de puntuación deberán restringirse.

10. Crear una jornada
10.1 Acceso
Administración → Jornadas → Nueva jornada
10.2 Datos

Ingrese:

Temporada.
Nombre.
Secuencia opcional.
Descripción opcional.

Ejemplos:

Jornada 1
Jornada 10
Repechaje Ida
Semifinal Vuelta
Final
10.3 Secuencia

La secuencia se utiliza para organización visual.

No determina el orden cronológico.

Un partido de Jornada 5 puede jugarse después de Jornada 10.

10.4 Jornada incompleta

Puede guardar una jornada aunque todavía no tenga todos los partidos.

El sistema podrá mostrar:

Jornada incompleta

Esto es una advertencia, no necesariamente un error.

10.5 Publicar jornada

Para publicar, confirme:

Tiene al menos un partido.
Todos los partidos tienen fecha.
Los equipos son válidos.
Existe exactamente un partido doble.
11. Crear un partido
11.1 Acceso
Administración → Partidos → Nuevo partido
11.2 Datos obligatorios

Seleccione:

Temporada.
Jornada.
Equipo local.
Equipo visitante.
Fecha.
Hora.
Indicador de partido doble.

Datos opcionales:

Estadio.
Notas.
11.3 Hora de Honduras

Ingrese siempre la hora oficial de Honduras.

La interfaz deberá indicar:

Hora de Honduras

El sistema la almacenará internamente en UTC.

11.4 Validaciones

El sistema no permitirá:

Mismo equipo como local y visitante.
Equipos inexistentes.
Fecha inválida.
Más de un partido doble en una jornada.
11.5 Posible duplicado

Si existe un encuentro similar, el sistema mostrará una advertencia.

Revise:

Jornada.
Local.
Visitante.
Fecha.
Si los equipos están invertidos.

La advertencia no siempre significa que sea un error.

12. Partido de puntuación doble
12.1 Regla

Cada jornada publicada debe tener exactamente un partido doble.

12.2 Seleccionar doble

Puede seleccionarlo:

Al crear el partido.
Desde la lista de partidos de la jornada.
Mediante la opción Definir partido doble.
12.3 Verificación

Antes de publicar la jornada, confirme que se muestre:

🔥 Doble puntuación
12.4 Cambio antes del procesamiento

Puede cambiarse mientras no exista impacto histórico irreversible.

Si ya cerraron pronósticos, el sistema deberá mostrar una advertencia.

12.5 Cambio después del procesamiento

No use el flujo normal.

Requiere:

Superadministrador.
Confirmación reforzada.
Motivo.
Recalculo.
Auditoría.
13. Editar un partido
13.1 Cambios menores

Puede editar:

Estadio.
Notas.
Información descriptiva.

Estos cambios no afectan pronósticos.

13.2 Cambio de equipos

No cambie equipos después de existir pronósticos salvo que sea una corrección real.

Si el encuentro cambió completamente:

Cancele el partido anterior.
Cree un partido nuevo.
Informe a los usuarios.
13.3 Cambio de fecha

No edite directamente la fecha.

Utilice:

Reprogramar partido

Esto conserva el historial.

14. Reprogramar un partido
14.1 Cuándo utilizarlo

Utilice reprogramación cuando cambie:

Fecha.
Hora.
Fecha y hora.
14.2 Procedimiento
Abra el partido.
Seleccione Reprogramar.
Revise la fecha actual.
Ingrese nueva fecha.
Ingrese nueva hora.
Añada motivo opcional.
Decida si reabrirá pronósticos.
Confirme.
14.3 Pronósticos existentes

Los pronósticos existentes se conservan.

No deben eliminarse automáticamente.

14.4 Reapertura

Si el nuevo cierre está en el futuro, podrá seleccionar:

Reabrir pronósticos

Los usuarios podrán modificar sus marcadores hasta el nuevo cierre.

14.5 Partido de jornada anterior

Es válido que un partido de Jornada 5 quede programado después de Jornada 10.

No debe:

Moverse automáticamente.
Considerarse inconsistente.
Cambiar de jornada.
Bloquearse por orden.
14.6 Verificación posterior

Después de reprogramar, confirme:

Nueva fecha.
Nueva hora.
Nuevo cierre.
Estado reprogramado.
Pronósticos conservados.
Notificación interna generada.
Auditoría registrada.
15. Suspender un partido
15.1 Procedimiento
Abra el partido.
Seleccione Suspender.
Ingrese motivo.
Confirme.
15.2 Efectos

Un partido suspendido:

No se procesa.
No genera puntos.
Mantiene pronósticos.
Puede reanudarse.
Puede reprogramarse.
Puede cancelarse.
16. Reanudar un partido
Abra el partido suspendido.
Seleccione Reanudar.
Ingrese fecha y hora si corresponde.
Ingrese motivo.
Confirme.

Verifique si el sistema:

Reabre pronósticos.
Conserva pronósticos.
Actualiza cierre.
Genera notificación.
17. Cancelar un partido
17.1 Procedimiento
Abra el partido.
Seleccione Cancelar.
Ingrese motivo.
Revise la advertencia.
Confirme.
17.2 Efectos

Un partido cancelado:

No otorga puntos.
No se procesa.
No cuenta como pronóstico incorrecto.
Conserva historial.
Conserva pronósticos para trazabilidad.
Queda auditado.
18. Revisar partidos por procesar

Acceda a:

Administración → Partidos → Pendientes de procesamiento

Un partido podrá aparecer como:

Cerrado
Finalizado pendiente

Revise:

Equipos.
Jornada.
Fecha.
Partido doble.
Estado.
Marcador oficial disponible.

No procese un partido suspendido sin resultado oficial.

19. Procesar un resultado
19.1 Procedimiento
Abra el partido.
Seleccione Procesar resultado.
Ingrese goles del local.
Ingrese goles del visitante.
Verifique si es doble.
Revise la confirmación.
Seleccione Procesar resultado.
19.2 Confirmación

El sistema mostrará:

Esta acción calculará los puntos de todos los usuarios y actualizará la clasificación.

Revise cuidadosamente el marcador antes de confirmar.

19.3 Operaciones automáticas

El sistema deberá:

Guardar resultado.
Evaluar todos los pronósticos.
Otorgar puntos.
Contar exactos.
Contar parciales.
Actualizar clasificación.
Actualizar posiciones.
Crear snapshot.
Registrar auditoría.
Mostrar resumen.
19.4 Resumen esperado

Ejemplo:

Usuarios evaluados: 48
Exactos: 8
Parciales: 21
Incorrectos: 15
Sin pronóstico: 4
19.5 Si ocurre un error

No vuelva a presionar repetidamente.

Revise el mensaje.
Copie el Request ID.
Recargue el partido.
Confirme si fue procesado.
Consulte auditoría.
Revise diagnóstico si tiene permisos.

El procesamiento es transaccional. No debería quedar aplicado a medias.

20. Procesamiento simultáneo

Si otro administrador ya está procesando el partido, podrá aparecer:

El partido está siendo procesado por otro administrador.

No intente forzar una segunda ejecución.

Espere y actualice la pantalla.

21. Corregir un resultado

Esta operación será reservada principalmente al superadministrador.

21.1 Cuándo usarla

Solo cuando:

El resultado fue ingresado incorrectamente.
El acta oficial cambió.
Se detectó un error real.
21.2 Procedimiento
Abra el partido procesado.
Seleccione Corregir resultado.
Revise el resultado actual.
Ingrese el nuevo marcador.
Ingrese un motivo obligatorio.
Escriba el texto de confirmación.
Confirme.
21.3 Efectos

El sistema deberá:

Conservar el resultado anterior.
Crear una nueva versión.
Recalcular puntuaciones.
Recalcular clasificación.
Actualizar posiciones.
Registrar auditoría.
Mostrar diferencias.
21.4 Verificación

Después de corregir:

Revise resultado.
Revise tabla.
Revise usuarios afectados.
Revise auditoría.
Ejecute integridad si es necesario.
22. Consultar la clasificación

Abra:

Tabla

o:

Administración → Clasificación

La tabla mostrará:

Posición.
Nickname.
Parciales.
Exactos.
Puntos.
Tendencia.
22.1 Criterios
Puntos.
Exactos.
Si ambos coinciden, comparten posición.

Los parciales no desempatan.

22.2 Posiciones compartidas

Ejemplo correcto:

1, 2, 2, 4

No debe corregirse manualmente.

22.3 Inconsistencias

Si sospecha un error:

No modifique puntos.
Ejecute verificación de integridad.
Compare puntuaciones.
Ejecute recalculo si está autorizado.
Consulte auditoría.
23. Recalcular una temporada
23.1 Cuándo utilizarlo
Después de corregir resultados.
Después de cambiar un partido doble con impacto.
Si la tabla parece inconsistente.
Después de una restauración.
Como validación antes del cierre.
23.2 Procedimiento
Abra Centro de diagnóstico.
Seleccione Recalcular temporada.
Elija la temporada.
Ingrese motivo.
Escriba la confirmación.
Ejecute.
23.3 Efectos

El sistema reconstruirá:

Puntos.
Exactos.
Parciales.
Posiciones.
Tendencias.
Resúmenes.
23.4 Precauciones

Antes de recalcular:

Cree respaldo.
Confirme que no se están procesando partidos.
No ejecute dos recalculos simultáneos.
Informe a otros administradores.
24. Gestionar patrocinadores
24.1 Crear patrocinador
Abra Administración → Patrocinadores.
Seleccione Nuevo patrocinador.
Ingrese nombre.
Cargue imagen.
Ingrese enlace opcional.
Elija ubicación.
Defina orden.
Active.
Guarde.
24.2 Sin patrocinadores

La aplicación funciona normalmente aunque no exista ninguno.

No es obligatorio crear patrocinadores.

24.3 Desactivar

Desactive en lugar de eliminar.

El patrocinador dejará de mostrarse, pero conservará historial administrativo.

25. Consultar auditoría

Abra:

Administración → Auditoría

Filtros:

Fecha.
Administrador.
Acción.
Entidad.
Identificador.
25.1 Ejemplo de registro
Administrador: Juan
Acción: Procesó resultado
Partido: Olimpia vs Motagua
Resultado: 2-1
Fecha: 15/08/2026 9:15 p. m.
25.2 Detalle

Podrá mostrar:

Antes:
status = FINISHED_PENDING

Después:
status = PROCESSED
officialHomeGoals = 2
officialAwayGoals = 1
25.3 Restricciones

No existe opción para:

Editar.
Eliminar.
Cambiar actor.
Cambiar fecha.
26. Configuración general

El superadministrador podrá configurar:

Nombre.
Logo.
Texto Cómo funciona.
Redes sociales.
Modo mantenimiento.
Parámetros de temporada permitidos.
Funciones visibles.

No podrá configurar desde la interfaz:

Contraseña SMTP.
URL de base.
Secret de sesión.
Token inicial.
Credenciales.
27. Modo mantenimiento
27.1 Activar
Abra Configuración.
Seleccione Modo mantenimiento.
Ingrese motivo.
Confirme.
27.2 Efectos
Usuarios normales ven una página informativa.
Administradores autorizados conservan acceso.
Se detienen operaciones normales.
La activación queda auditada.
27.3 Desactivar
Confirme que el sistema está estable.
Ejecute smoke tests.
Seleccione Desactivar mantenimiento.
Revise acceso público.
28. Centro de diagnóstico

Acceso completo exclusivo del superadministrador.

Podrá mostrar:

Base de datos.
SMTP.
Usuarios.
Partidos.
Pronósticos.
Auditorías.
Errores.
Integridad.
Exportaciones.
Recalculo.
Herramientas de prueba.
SQL seguro.
29. Verificación de integridad
29.1 Ejecución
Abra Centro de diagnóstico.
Seleccione Verificar integridad.
Espere el resultado.
Revise advertencias y errores.
29.2 Validaciones

Puede detectar:

Más de una temporada activa.
Más de un superadministrador.
Jornadas sin partido doble.
Jornadas con dos dobles.
Pronósticos duplicados.
Partidos con equipos iguales.
Resultados inconsistentes.
Puntos inconsistentes.
Clasificación inconsistente.
29.3 Severidades
INFO
WARNING
ERROR
CRITICAL

Un warning no siempre exige detener el sistema.

Un error de puntuación sí deberá investigarse antes de continuar.

30. Exportar datos
30.1 Tipos

Se podrán exportar:

Usuarios.
Equipos.
Temporadas.
Jornadas.
Partidos.
Pronósticos.
Clasificación.
Auditoría.
Backup funcional.
30.2 Formatos
CSV
JSON
30.3 Procedimiento
Abra Exportaciones.
Elija tipo.
Elija temporada si aplica.
Elija formato.
Solicite exportación.
Espere generación.
Descargue.
Guarde en ubicación segura.
30.4 Datos excluidos

Una exportación nunca incluye:

Contraseñas.
Hashes.
Tokens.
Cookies.
Credenciales SMTP.
Secretos.
31. Crear respaldo

Antes de:

Migraciones.
Correcciones masivas.
Recalculo importante.
Cierre de temporada.
Limpieza.
Restauración.

Cree un respaldo.

Registre:

Fecha.
Temporada.
Responsable.
Ubicación segura.
Verificación.
32. Herramientas de prueba
32.1 Restricción

Deben estar deshabilitadas por defecto en producción.

32.2 Generar usuarios

Puede crear:

Todos deben quedar identificados como prueba.

32.3 Generar pronósticos

Puede generar pronósticos aleatorios para partidos seleccionados.

32.4 Simular resultados

Puede generar marcadores ficticios y procesarlos en entornos de prueba.

No use esta opción sobre una temporada real.

32.5 Limpiar datos

Solo elimine un lote identificado como prueba.

Nunca seleccione datos reales.

33. Consola SQL segura
33.1 Modo lectura

El modo predeterminado solo permite:

SELECT

Use consultas preparadas y documentadas.

33.2 Límites

La consola impondrá:

Máximo de filas.
Tiempo máximo.
Una instrucción.
Auditoría.
Acceso restringido.
33.3 Modo escritura

Solo utilizar en una emergencia técnica.

Requiere:

Superadministrador.
Función habilitada por entorno.
Reautenticación.
Motivo.
Confirmación.
Respaldo.
Auditoría.

No utilice SQL de escritura para tareas que ya existen en la interfaz.

33.4 Operaciones prohibidas

No ejecutar desde la consola:

DROP DATABASE
DROP SCHEMA
ALTER ROLE
GRANT
REVOKE
TRUNCATE masivo
34. Cerrar una temporada
34.1 Antes del cierre

Verifique:

Partidos abiertos.
Partidos cerrados no procesados.
Suspendidos.
Cancelados.
Clasificación.
Integridad.
Backup.
Tabla final.
34.2 Procedimiento
Abra la temporada.
Seleccione Cerrar temporada.
Revise advertencias.
Ejecute verificación de integridad.
Cree backup.
Confirme la tabla final.
Escriba la confirmación.
Cierre.
34.3 Resultado

El sistema guardará:

Tabla final.
Campeón o campeones.
Posiciones.
Puntos.
Exactos.
Parciales.
Fecha.
Responsable.
34.4 Campeones compartidos

Si dos usuarios comparten primera posición, ambos serán campeones.

No debe seleccionarse uno manualmente.

35. Preparar la siguiente temporada

Después de cerrar:

Confirme historial.
Exporte datos.
Cree nueva temporada en borrador.
Revise equipos.
Cree jornadas.
Revise reglas.
Active solo cuando esté preparada.

No elimine la temporada anterior.

36. Procedimiento diario recomendado

Durante una temporada activa:

Revisar usuarios pendientes.
Revisar próximos cierres.
Revisar reprogramaciones.
Confirmar partido doble.
Revisar partidos pendientes de resultado.
Procesar resultados oficiales.
Revisar clasificación.
Revisar alertas.
Revisar auditoría si hubo varias acciones.
37. Procedimiento antes de cada jornada
Confirmar equipos.
Confirmar fecha y hora.
Confirmar hora de Honduras.
Confirmar un partido doble.
Confirmar que no existan duplicados.
Publicar jornada.
Revisar la vista como usuario.
Verificar contador.
Revisar desde celular.
38. Procedimiento después de cada partido
Confirmar marcador oficial.
Revisar que el partido esté cerrado.
Procesar resultado.
Revisar resumen.
Revisar tabla.
Revisar resultado público.
Revisar auditoría si hubo error.
39. Procedimiento ante reprogramación
Confirmar información oficial.
Abrir partido correcto.
Usar Reprogramar.
Ingresar nueva fecha y hora.
Decidir reapertura.
Conservar pronósticos.
Confirmar notificación.
Revisar contador.
No moverlo de jornada automáticamente.
40. Procedimiento ante error de resultado
No modificar puntos.
Informar a otros administradores.
Crear backup.
Abrir corrección.
Ingresar resultado correcto.
Ingresar motivo.
Confirmar.
Revisar recalculo.
Ejecutar integridad.
Revisar auditoría.
41. Procedimiento ante falla SMTP
Verifique diagnóstico SMTP.
Revise variables.
Confirme contraseña de aplicación.
Revise cuenta Gmail.
No exponga credenciales.
Reintente correo de prueba.
Use notificaciones internas mientras se resuelve.

La quiniela puede continuar operando para usuarios ya confirmados.

42. Procedimiento ante falla de base de datos
Active mantenimiento si es posible.
No siga procesando.
Revise estado del proveedor.
Revise logs.
No repita migraciones sin revisar.
Verifique backup.
Restaure solo con procedimiento aprobado.
Ejecute integridad al recuperar.
43. Procedimiento ante cuenta administrativa comprometida
Revocar sesiones.
Bloquear temporalmente la cuenta.
Cambiar contraseña.
Revisar auditoría.
Revisar resultados procesados.
Revisar cambios de partido doble.
Ejecutar integridad.
Corregir datos si corresponde.
Rotar secretos si fueron expuestos.
44. Errores comunes
No puedo aprobar un usuario

Verifique:

Correo confirmado.
Estado pendiente.
Usuario no bloqueado.
Su rol de administrador.
No puedo publicar jornada

Verifique:

Tiene partidos.
Todos tienen fecha.
Existe exactamente un doble.
Equipos válidos.
No puedo procesar un partido

Verifique:

No está cancelado.
No está suspendido.
No fue procesado.
Tiene resultado válido.
Otro administrador no lo procesa.
La tabla parece incorrecta

No modifique manualmente.

Revise resultado.
Revise partido doble.
Ejecute integridad.
Ejecute recalculo.
Revise auditoría.
La hora parece incorrecta

Confirme:

Está usando hora de Honduras.
La fecha fue ingresada correctamente.
No confundió a. m. y p. m.
El partido fue reprogramado.
45. Buenas prácticas
Verifique dos veces cada marcador.
Use motivos claros.
No comparta cuentas.
No procese basado en rumores.
No cambie partido doble tarde.
No elimine datos históricos.
No use SQL sin respaldo.
Revise auditoría.
Informe reprogramaciones.
Mantenga un solo canal oficial para decisiones administrativas.
46. Acciones que nunca deben realizarse
Compartir contraseña.
Editar puntos manualmente.
Pronosticar después del cierre.
Ver pronósticos abiertos mediante herramientas técnicas.
Eliminar auditorías.
Borrar partidos con pronósticos.
Ejecutar SQL destructivo.
Crear dos temporadas activas.
Crear dos superadministradores.
Procesar un partido suspendido.
Modificar un resultado sin motivo.
Publicar jornada sin doble.
47. Separación de responsabilidades sugerida

Con tres administradores se puede distribuir:

Administrador 1
Usuarios.
Jornadas.
Comunicación.
Administrador 2
Partidos.
Fechas.
Reprogramaciones.
Administrador 3
Resultados.
Revisión de tabla.
Auditoría.

El superadministrador mantiene:

Roles.
Configuración.
Backups.
Diagnóstico.
Correcciones críticas.

La división es organizativa, no obligatoria.

48. Checklist rápido para procesar un partido
[ ] Partido correcto
[ ] Jornada correcta
[ ] Marcador oficial confirmado
[ ] Local y visitante en orden correcto
[ ] Estado válido
[ ] Doble verificado
[ ] Resultado revisado dos veces
[ ] Confirmación realizada
[ ] Resumen revisado
[ ] Tabla revisada
49. Checklist rápido para reprogramar
[ ] Partido correcto
[ ] Nueva fecha oficial
[ ] Nueva hora de Honduras
[ ] Motivo registrado
[ ] Decisión de reapertura
[ ] Pronósticos conservados
[ ] Nuevo cierre revisado
[ ] Notificación revisada
[ ] Auditoría creada
50. Checklist rápido para cerrar temporada
[ ] No hay partidos abiertos relevantes
[ ] Pendientes revisados
[ ] Suspendidos revisados
[ ] Resultados correctos
[ ] Integridad exitosa
[ ] Recalculo ejecutado
[ ] Tabla final revisada
[ ] Campeones correctos
[ ] Backup creado
[ ] Exportación guardada
[ ] Cierre confirmado
51. Auditoría de acciones administrativas

Las acciones importantes deberán quedar registradas automáticamente.

El administrador no debe crear registros manualmente.

Ejemplos:

Juan aprobó al usuario Carlos.
Luis reprogramó Olimpia vs Motagua.
Pedro procesó Real España 2-1 Marathón.
Juan corrigió un resultado de 2-1 a 1-1.
52. Soporte y reporte de problemas

Cuando reporte un problema incluya:

Qué intentaba hacer.
Página.
Fecha y hora.
Usuario afectado.
Partido o jornada.
Mensaje mostrado.
Request ID.
Captura sin datos sensibles.
Si la acción se repitió.
Estado actual.

No envíe:

Contraseñas.
Cookies.
Tokens.
Variables de entorno.
Backups completos por canales inseguros.
53. Criterios de aceptación del manual

Este manual será suficiente cuando un administrador pueda:

Aprobar usuarios.
Crear temporada.
Crear jornada.
Crear partido.
Definir doble.
Reprogramar.
Suspender.
Cancelar.
Procesar.
Corregir con autorización.
Revisar tabla.
Consultar auditoría.
Generar respaldo.
Cerrar temporada.

sin realizar cálculos manuales ni acceder directamente a PostgreSQL.

54. Documentos relacionados

Consultar:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/09-Deployment.md
docs/11-ManualUsuario.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
55. Conclusión

El administrador tiene la responsabilidad de mantener la información deportiva correcta, pero el sistema debe encargarse de los cálculos, cierres, puntos y posiciones.

La operación debe seguir tres principios:

Verificar antes de confirmar.
No modificar datos derivados manualmente.
Mantener trazabilidad de todas las acciones importantes.

Los privilegios administrativos no conceden ventajas dentro de la competencia.