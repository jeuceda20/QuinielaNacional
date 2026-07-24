# Administration Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Administración de usuarios, equipos, temporadas, jornadas y partidos  
**Tareas principales:** TASK-046 a TASK-061  
**Tipo:** Prompt maestro de fase  
**Aplicación:** Ejecutar una sola tarea de esta fase por vez

---

# 1. Propósito

Este prompt define el contexto específico para implementar las funciones administrativas de **Quiniela Nacional La Goleada – Kickoff**.

Esta fase incluye:

- Aprobación de usuarios.
- Rechazo de usuarios.
- Bloqueo y desbloqueo.
- Activación y desactivación.
- Promoción y retiro de administradores.
- Gestión de equipos.
- Creación y activación de temporadas.
- Incorporación de participantes.
- Gestión de jornadas.
- Creación de partidos.
- Designación del partido doble.
- Reprogramaciones.
- Suspensiones.
- Reanudaciones.
- Cancelaciones.
- Interfaces administrativas relacionadas.

Esta fase no incluye todavía:

- Captura de pronósticos.
- Procesamiento de resultados.
- Clasificación pública.
- Recalculo.
- Dashboard del participante.
- Notificaciones completas.
- Exportaciones.
- Centro de diagnóstico completo.

---

# 2. Uso obligatorio

Este prompt debe combinarse con:

```text
prompts/00-global-context.md
prompts/09-task-template.md
docs/19-IMPLEMENTATION_PLAN.md
```

Formato recomendado:

```text
Lee y aplica:

- prompts/00-global-context.md
- prompts/03-admin.md
- prompts/09-task-template.md

Implementa únicamente TASK-XXX de
docs/19-IMPLEMENTATION_PLAN.md.
```

No solicitar:

```text
Implementa todo el módulo administrativo.
```

La regla obligatoria es:

```text
Una ejecución = una tarea
```

---

# 3. Tareas cubiertas

Este prompt aplica a:

```text
TASK-046 — Implementar aprobación de usuarios
TASK-047 — Implementar rechazo, bloqueo y desactivación
TASK-048 — Implementar promoción de administradores
TASK-049 — Crear UI administrativa de usuarios
TASK-050 — Crear módulo de equipos
TASK-051 — Implementar creación de temporada
TASK-052 — Implementar activación de temporada
TASK-053 — Implementar participantes de temporada
TASK-054 — Implementar jornadas
TASK-055 — Crear UI de temporadas y jornadas
TASK-056 — Implementar creación de partido
TASK-057 — Implementar partido doble
TASK-058 — Implementar reprogramación
TASK-059 — Implementar suspensión y reanudación
TASK-060 — Implementar cancelación
TASK-061 — Crear UI administrativa de partidos
```

---

# 4. Objetivo de la fase

Al finalizar esta fase, un administrador autorizado debe poder preparar y administrar la competencia antes de que comiencen los pronósticos.

Resultado esperado:

```text
Usuarios aprobados y gestionados
+
Roles administrativos controlados
+
Equipos configurados
+
Temporada activa
+
Participantes incorporados
+
Jornadas creadas y publicadas
+
Partidos programados
+
Un partido doble por jornada
+
Reprogramaciones con historial
+
Suspensiones y cancelaciones auditadas
+
UI administrativa segura
```

---

# 5. Documentos obligatorios

Antes de ejecutar tareas de esta fase, revisar según corresponda:

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
docs/10-ManualAdministrador.md
docs/11-ManualUsuario.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/16-Glosario.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
docs/19-IMPLEMENTATION_PLAN.md
```

---

# 6. Principios administrativos

## 6.1 Toda acción administrativa se valida en servidor

La UI nunca representa la autorización definitiva.

Toda operación debe validar:

1. Sesión.
2. Estado activo del actor.
3. Rol.
4. Permiso específico.
5. Estado actual de la entidad.
6. Reglas de transición.
7. Entrada.
8. Concurrencia.
9. Auditoría.

Ocultar un botón no protege una operación.

---

## 6.2 Separación de roles

Roles oficiales:

```text
USER
ADMIN
SUPER_ADMIN
```

Un ADMIN no debe adquirir permisos de SUPER_ADMIN por:

- Manipular una solicitud.
- Modificar un campo oculto.
- Invocar directamente una Server Action.
- Acceder a una ruta conocida.
- Alterar el ID objetivo.

---

## 6.3 No modificar datos históricos directamente

Las operaciones administrativas deben preservar:

- Historial de roles.
- Historial de reprogramaciones.
- Auditoría.
- Resultados futuros asociados.
- Participaciones.
- Pronósticos existentes cuando correspondan.

No utilizar eliminación física para simplificar flujos.

---

## 6.4 Cambios mínimos y explícitos

Las acciones de administración deben tener nombres claros.

Preferir:

```text
approveUser
blockUser
activateSeason
rescheduleMatch
cancelMatch
```

No utilizar una operación genérica como:

```text
updateStatus
```

para permitir cualquier transición sin políticas específicas.

---

# 7. Matriz general de permisos

La implementación exacta debe coincidir con las políticas de autorización existentes.

Matriz conceptual:

| Acción | USER | ADMIN | SUPER_ADMIN |
|---|---:|---:|---:|
| Aprobar usuario | No | Sí | Sí |
| Rechazar usuario | No | Sí | Sí |
| Bloquear usuario | No | Sí | Sí |
| Desbloquear usuario | No | Sí | Sí |
| Desactivar usuario | No | Sí, con límites | Sí |
| Promover a ADMIN | No | No | Sí |
| Retirar rol ADMIN | No | No | Sí |
| Gestionar equipos | No | Sí | Sí |
| Crear temporada | No | Sí, según política | Sí |
| Activar temporada | No | Sí, según política | Sí |
| Gestionar participantes | No | Sí | Sí |
| Crear jornada | No | Sí | Sí |
| Publicar jornada | No | Sí | Sí |
| Crear partido | No | Sí | Sí |
| Reprogramar partido | No | Sí | Sí |
| Suspender partido | No | Sí | Sí |
| Cancelar partido | No | Sí | Sí |
| Corregir resultado procesado | No | No | Sí |
| Recalcular | No | No | Sí |
| Diagnóstico avanzado | No | No | Sí |

No ampliar permisos por conveniencia.

---

# 8. Reglas para TASK-046 — Aprobación de usuarios

La aprobación ocurre después de la confirmación de correo.

Estado esperado antes de aprobar:

```text
PENDING_APPROVAL
```

No aprobar usuarios que todavía estén:

```text
PENDING_EMAIL_VERIFICATION
```

---

## 8.1 Flujo

```text
Validar actor
↓
Validar usuario objetivo
↓
Validar estado PENDING_APPROVAL
↓
Aprobar usuario
↓
Cambiar estado a ACTIVE
↓
Agregar a temporada activa si la acción lo solicita y es válido
↓
Crear auditoría
↓
Commit
↓
Enviar notificación o correo fuera de la transacción
```

---

## 8.2 Incorporación a temporada

La aprobación puede permitir:

```text
Aprobar cuenta únicamente
```

o:

```text
Aprobar e incorporar a temporada activa
```

según el diseño aprobado.

Si se incorpora a una temporada:

- Crear SeasonParticipant.
- Registrar fecha de incorporación.
- Iniciar con cero puntos.
- No otorgar puntos retroactivos.
- No calcular partidos anteriores.
- Evitar duplicados.

---

## 8.3 Transacción

La aprobación y la incorporación opcional deben ser consistentes.

Dentro de la transacción:

- Cambiar estado.
- Crear participante si corresponde.
- Crear auditoría.

El correo de aprobación debe enviarse después del commit.

Una falla de SMTP no debe revertir la aprobación ya confirmada.

---

## 8.4 Concurrencia

Dos administradores no deben aprobar dos veces al mismo usuario.

La segunda ejecución debe:

- Ser idempotente cuando sea seguro.
- O devolver conflicto funcional.

No crear dos SeasonParticipant.

---

## 8.5 Autoaprobación

Un administrador no debe usar este flujo para modificar su propia cuenta de forma indebida.

La política debe definir si:

- Puede aprobarse a sí mismo.
- Puede cambiar su propio estado.
- Puede incorporarse a temporada.

Por defecto, el primer superadministrador ya se crea activo mediante setup.

---

## 8.6 Auditoría

Registrar:

- Actor.
- Usuario aprobado.
- Estado anterior.
- Estado nuevo.
- Temporada incorporada, si aplica.
- Request ID.
- Fecha.

No registrar datos privados innecesarios.

---

## 8.7 Pruebas mínimas

- ADMIN aprueba usuario pendiente.
- SUPER_ADMIN aprueba usuario pendiente.
- USER no puede aprobar.
- Usuario sin correo confirmado es rechazado.
- Usuario ya activo no se duplica.
- Incorporación opcional a temporada.
- Inicio con cero puntos.
- Sin retroactividad.
- Dos aprobaciones concurrentes.
- Auditoría creada.
- Falla de email no revierte aprobación.

---

# 9. Reglas para TASK-047 — Rechazo, bloqueo y desactivación

Estas acciones son distintas y no deben tratarse como sinónimos.

---

## 9.1 Rechazo

El rechazo aplica normalmente a una cuenta:

```text
PENDING_APPROVAL
```

Efectos:

- Cambiar estado a REJECTED.
- Registrar motivo cuando sea requerido.
- Auditar.
- Impedir login.

No eliminar la cuenta.

No eliminar tokens o historial sin una política explícita.

---

## 9.2 Bloqueo

El bloqueo aplica a una cuenta existente que debe perder acceso temporalmente.

Efectos:

- Cambiar estado a BLOCKED.
- Revocar sesiones activas.
- Conservar participación e historial.
- Auditar.
- Registrar motivo.

No eliminar pronósticos ni puntos históricos.

---

## 9.3 Desbloqueo

El desbloqueo:

- Restaura el estado permitido.
- No restaura sesiones anteriores.
- Requiere nuevo login.
- Audita el cambio.

Debe definirse el estado de retorno.

No asumir siempre `ACTIVE` si el usuario estaba en otro estado antes del bloqueo, salvo que el modelo lo establezca.

Puede requerirse conservar:

```text
previousStatus
```

o utilizar una transición controlada.

---

## 9.4 Desactivación

La desactivación representa una cuenta que ya no debe operar.

Efectos:

- Estado DISABLED.
- Revocación de sesiones.
- Conservación de historial.
- Exclusión de nuevas acciones.
- Auditoría.

No debe borrar al usuario.

---

## 9.5 Reactivación

Solo implementar si la tarea y documentación lo permiten.

Debe validar:

- Estado anterior.
- Motivo.
- Actor.
- Participación.
- Sesiones.

No recrear automáticamente participaciones eliminadas lógicamente sin reglas claras.

---

## 9.6 Restricciones entre administradores

Un ADMIN no debe poder:

- Bloquear a un SUPER_ADMIN.
- Desactivar a un SUPER_ADMIN.
- Alterar el rol de otro administrador.
- Eliminarse restricciones a sí mismo.
- Realizar acciones que requieran SUPER_ADMIN.

La política exacta debe estar centralizada.

---

## 9.7 Pruebas mínimas

- Rechazar pendiente.
- No rechazar activo sin flujo autorizado.
- Bloquear activo.
- Revocar sesiones al bloquear.
- Desbloquear.
- Sesión anterior sigue inválida.
- Desactivar.
- USER no puede ejecutar.
- ADMIN no puede bloquear SUPER_ADMIN.
- SUPER_ADMIN puede actuar según política.
- Historial preservado.
- Auditoría creada.
- Concurrencia controlada.

---

# 10. Reglas para TASK-048 — Promoción de administradores

Solo:

```text
SUPER_ADMIN
```

puede promover o retirar administradores.

---

## 10.1 Promoción

Flujo:

```text
Validar SUPER_ADMIN
↓
Validar usuario objetivo ACTIVE
↓
Validar que no sea ya ADMIN o SUPER_ADMIN
↓
Cambiar rol USER → ADMIN
↓
Crear RoleHistory
↓
Crear AuditLog
↓
Commit
```

---

## 10.2 Retiro de rol

Flujo permitido:

```text
ADMIN → USER
```

No degradar un SUPER_ADMIN mediante este flujo salvo una funcionalidad específica documentada.

---

## 10.3 Protección del último superadministrador

El sistema nunca debe quedar sin SUPER_ADMIN.

No permitir:

- Degradar al último SUPER_ADMIN.
- Desactivar al último SUPER_ADMIN.
- Bloquear al último SUPER_ADMIN mediante flujos incompatibles.
- Eliminar lógicamente al último SUPER_ADMIN sin sustituto.

---

## 10.4 Autoacciones

Un SUPER_ADMIN puede o no cambiar su propio rol según la política documentada.

Por seguridad, cualquier acción que pueda dejar el sistema sin superadministrador debe rechazarse.

---

## 10.5 RoleHistory

Registrar:

- Usuario afectado.
- Rol anterior.
- Rol nuevo.
- Actor.
- Motivo.
- Fecha.

No actualizar entradas anteriores.

---

## 10.6 Pruebas mínimas

- SUPER_ADMIN promueve USER.
- ADMIN no puede promover.
- USER no puede promover.
- Usuario bloqueado no puede ser promovido.
- Usuario ya ADMIN devuelve conflicto o resultado idempotente.
- Retiro ADMIN → USER.
- RoleHistory creado.
- AuditLog creado.
- Último SUPER_ADMIN protegido.
- Manipulación de ID no omite autorización.

---

# 11. Reglas para TASK-049 — UI administrativa de usuarios

La UI debe permitir:

- Listar usuarios.
- Buscar.
- Filtrar.
- Ver detalle.
- Aprobar.
- Rechazar.
- Bloquear.
- Desbloquear.
- Desactivar.
- Reactivar si está permitido.
- Promover o retirar ADMIN solo para SUPER_ADMIN.

---

## 11.1 Lista

Columnas sugeridas:

- Nickname.
- Nombre completo, solo para administradores.
- Email.
- Equipo favorito.
- Estado.
- Rol.
- Fecha de registro.
- Fecha de confirmación.
- Temporada actual.
- Acciones.

No mostrar información sensible como:

- Password hash.
- Tokens.
- Sesiones.
- IP histórica completa sin necesidad.

---

## 11.2 Filtros

Filtros mínimos:

```text
Estado
Rol
Correo confirmado
Participación en temporada
Equipo favorito
Fecha de registro
```

La búsqueda puede incluir:

- Nickname.
- Nombre.
- Apellido.
- Email.

Debe existir paginación o límite razonable.

---

## 11.3 Acciones

Cada acción crítica debe:

- Mostrar confirmación.
- Indicar consecuencia.
- Solicitar motivo cuando corresponda.
- Deshabilitarse visualmente cuando no aplique.
- Validarse nuevamente en servidor.

Ejemplo:

```text
¿Bloquear a este usuario?

Se revocarán sus sesiones activas.
Su historial y puntos se conservarán.
```

---

## 11.4 Estado de UI

Incluir:

- Loading.
- Empty state.
- Error state.
- Success feedback.
- Optimistic UI solo si es segura.

No mostrar éxito antes de confirmación del servidor.

---

## 11.5 Accesibilidad

- Tabla navegable.
- Acciones con nombre accesible.
- Modal con foco controlado.
- Confirmaciones mediante teclado.
- Errores anunciados.
- No depender solo de iconos.

---

## 11.6 Pruebas mínimas

- Lista con datos.
- Lista vacía.
- Filtros.
- Búsqueda.
- Paginación.
- ADMIN ve acciones permitidas.
- ADMIN no ve promoción.
- SUPER_ADMIN ve promoción.
- Acción confirmada.
- Error del servidor.
- IDOR rechazado.
- Responsive.

---

# 12. Reglas para TASK-050 — Módulo de equipos

Los equipos son datos maestros.

Deben utilizarse en:

- Registro.
- Perfil.
- Partidos.
- Representación visual del usuario.

---

## 12.1 Operaciones

Según la documentación, el módulo debe permitir:

- Listar.
- Crear si está autorizado.
- Editar nombre o logo.
- Activar.
- Desactivar.
- Ordenar o identificar.
- Soft delete si aplica.

No eliminar físicamente un equipo referenciado.

---

## 12.2 Campos

Campos esperados:

```text
name
code o slug
logoUrl o referencia de imagen
isActive
createdAt
updatedAt
deletedAt
```

El código o slug debe ser único.

---

## 12.3 Logo

El logo:

- Debe tener formato permitido.
- Debe tener texto alternativo.
- No debe romper la UI si falta.
- Debe usar una imagen predeterminada o iniciales cuando falle.

No aceptar URLs peligrosas sin validación.

Si se usa almacenamiento local o público:

- Validar tipo.
- Validar tamaño.
- Evitar ejecución de contenido.
- Evitar SVG no confiable si no está sanitizado.

---

## 12.4 Desactivación

Un equipo inactivo:

- No aparece en nuevos registros.
- No puede seleccionarse para nuevos partidos.
- Sigue visible en historial.
- Sigue representando usuarios existentes cuando corresponda.

---

## 12.5 Integridad

No permitir:

- Equipos duplicados por código.
- Nombres vacíos.
- Código mutable sin análisis si se usa como referencia externa.
- Eliminación de equipo usado en partidos históricos.

---

## 12.6 Pruebas mínimas

- Listado de activos.
- Inactivo excluido de registro.
- Inactivo preservado en historial.
- Código único.
- Logo ausente no rompe UI.
- ADMIN gestiona.
- USER no gestiona.
- Soft delete.
- Auditoría.

---

# 13. Reglas para TASK-051 — Creación de temporada

Una temporada representa una competencia independiente.

---

## 13.1 Estado inicial

Toda nueva temporada debe crearse como:

```text
DRAFT
```

o el estado equivalente documentado.

No activarla automáticamente.

---

## 13.2 Campos

Debe incluir como mínimo:

- Nombre.
- Fecha de inicio.
- Fecha de finalización opcional.
- Estado.
- Reglas configurables permitidas.
- Fecha de creación.
- Actor.
- Soft delete cuando corresponda.

---

## 13.3 Reglas

No permitir:

- Nombre vacío.
- Fechas incoherentes.
- Reglas incompatibles.
- Dos temporadas activas mediante creación.
- Multiplicadores no permitidos.
- Cambios silenciosos a reglas deportivas globales.

La versión 1.0 mantiene:

```text
Exacto = 3
Parcial = 1
Doble = ×2
Cierre = 5 minutos
```

No convertir estas reglas en configurables si la documentación no lo autoriza.

---

## 13.4 Auditoría

Registrar:

- Actor.
- Temporada creada.
- Configuración inicial.
- Request ID.

Excluir datos innecesarios.

---

## 13.5 Pruebas mínimas

- ADMIN crea borrador.
- SUPER_ADMIN crea borrador.
- USER rechazado.
- Nombre inválido.
- Fechas inválidas.
- Estado inicial correcto.
- No activa automáticamente.
- Auditoría.
- Validación Zod.

---

# 14. Reglas para TASK-052 — Activación de temporada

Solo puede existir una temporada activa cuando esa es la regla oficial.

---

## 14.1 Precondiciones

Antes de activar:

- Temporada existe.
- No está eliminada.
- Está en estado permitido.
- Configuración es válida.
- No existe otra activa.
- Equipos mínimos o configuración necesaria están disponibles.
- Actor autorizado.

---

## 14.2 Transacción

La activación debe proteger contra:

- Dos admins activando temporadas distintas simultáneamente.
- Activación repetida.
- Estado parcial.

Usar:

- Restricción de base cuando sea viable.
- Transacción.
- Lock o actualización condicional.
- Auditoría.

---

## 14.3 Temporada activa existente

No desactivar automáticamente otra temporada salvo que la acción explícita y documentación lo permitan.

Preferir devolver:

```text
ACTIVE_SEASON_ALREADY_EXISTS
```

---

## 14.4 Activación idempotente

Activar nuevamente la misma temporada puede:

- Devolver éxito idempotente.
- O conflicto funcional claro.

No duplicar eventos o alterar fechas sin control.

---

## 14.5 Pruebas mínimas

- Activar borrador válido.
- USER rechazado.
- Otra activa bloquea.
- Dos activaciones concurrentes.
- Temporada inválida rechazada.
- Auditoría.
- Una única activa al finalizar.

---

# 15. Reglas para TASK-053 — Participantes de temporada

SeasonParticipant define quién compite en una temporada.

---

## 15.1 Incorporación

Solo incorporar usuarios:

- ACTIVE.
- No eliminados.
- No bloqueados o desactivados.
- No incorporados previamente.

---

## 15.2 Fecha de incorporación

Registrar:

```text
joinedAt
```

Esta fecha importa para determinar participación.

Un participante tardío:

- Comienza con cero puntos.
- No recibe puntos retroactivos.
- No se recalculan partidos anteriores para él.
- Sí puede pronosticar partidos futuros abiertos.

---

## 15.3 Estado

Puede existir estado de participación:

```text
ACTIVE
INACTIVE
WITHDRAWN
```

solo si está documentado.

No mezclar estado de usuario con estado de participación.

---

## 15.4 Retiro

Si se permite retirar un participante:

- Conservar historial.
- No borrar pronósticos.
- No borrar puntuaciones.
- No modificar resultados anteriores.
- Definir si sigue apareciendo en clasificación histórica.

No implementar retiro si no está incluido en la tarea.

---

## 15.5 Inicialización de Standing

Puede crearse Standing en cero al incorporar, si el diseño lo define.

Recordar:

```text
Standing es una proyección
```

La participación es la fuente para saber quién compite.

---

## 15.6 Pruebas mínimas

- Incorporar usuario activo.
- Evitar duplicado.
- Usuario pendiente rechazado.
- Usuario bloqueado rechazado.
- joinedAt guardado.
- Cero puntos.
- Sin retroactividad.
- Auditoría.
- Concurrencia.

---

# 16. Reglas para TASK-054 — Jornadas

Las jornadas agrupan partidos.

No determinan necesariamente la cronología real.

---

## 16.1 Campos

Una jornada debe soportar:

- Temporada.
- Nombre.
- Secuencia lógica.
- Estado.
- Fecha de publicación.
- Fecha de archivo.
- Soft delete.
- Auditoría.

---

## 16.2 Nombre

El nombre puede ser libre.

Ejemplos:

```text
Jornada 1
Fecha 5
Clásicos pendientes
Reprogramados
```

No derivar reglas cronológicas del nombre.

---

## 16.3 Secuencia

La secuencia sirve para:

- Orden administrativo.
- Presentación lógica.
- Navegación.

No sirve para:

- Determinar qué partido ocurre primero.
- Calcular cierre.
- Aplicar puntos.
- Resolver reprogramaciones.

---

## 16.4 Estados

Estados conceptuales:

```text
DRAFT
PUBLISHED
ARCHIVED
```

La implementación exacta debe coincidir con el modelo.

---

## 16.5 Publicación

Antes de publicar, validar:

- Temporada correcta.
- Jornada no eliminada.
- Configuración válida.
- Partidos si son requeridos.
- Exactamente un partido doble si la regla aplica en publicación.

Si una jornada puede publicarse vacía según documentación, no inventar la obligación de tener partidos.

---

## 16.6 Edición posterior

Una jornada publicada debe restringir cambios que alteren competencia.

Permitir solo cambios documentados y auditados.

No cambiar libremente:

- Temporada.
- Identidad.
- Partido doble después de cierres.
- Estructura con partidos procesados.

---

## 16.7 Pruebas mínimas

- Crear borrador.
- Publicar.
- Archivar.
- Nombre libre.
- Secuencia duplicada según política.
- USER rechazado.
- Soft delete.
- No usar secuencia como cronología.
- Auditoría.

---

# 17. Reglas para TASK-055 — UI de temporadas y jornadas

La UI debe permitir:

- Listar temporadas.
- Crear borrador.
- Ver estado.
- Activar temporada.
- Ver participantes.
- Incorporar participantes.
- Crear jornadas.
- Editar borradores.
- Publicar.
- Archivar cuando corresponda.

---

## 17.1 Indicadores

Mostrar claramente:

```text
DRAFT
ACTIVE
CLOSED
ARCHIVED
```

y:

```text
DRAFT
PUBLISHED
ARCHIVED
```

para jornadas.

No depender únicamente de colores.

---

## 17.2 Confirmaciones

Acciones críticas:

- Activar temporada.
- Publicar jornada.
- Archivar.
- Incorporar participantes.

deben mostrar consecuencias.

---

## 17.3 Vista de participantes

Mostrar:

- Nickname.
- Nombre completo administrativo.
- Estado de usuario.
- Fecha de incorporación.
- Puntos actuales si aplica.
- Estado de participación.

No mostrar datos sensibles.

---

## 17.4 Errores de integridad

La UI debe presentar mensajes claros para:

```text
ACTIVE_SEASON_ALREADY_EXISTS
USER_ALREADY_PARTICIPANT
ROUND_INVALID_FOR_PUBLICATION
```

No mostrar errores de Prisma.

---

## 17.5 Pruebas mínimas

- Lista.
- Crear.
- Activar.
- Error por otra activa.
- Incorporar participante.
- Duplicado.
- Crear jornada.
- Publicar.
- Permisos.
- Responsive.
- Accesibilidad.

---

# 18. Reglas para TASK-056 — Creación de partido

Un partido debe pertenecer a una jornada.

---

## 18.1 Campos

Campos mínimos:

- Jornada.
- Equipo local.
- Equipo visitante.
- Fecha y hora oficial.
- Hora de cierre calculada.
- Estado inicial.
- Indicador de doble.
- Metadatos administrativos permitidos.

---

## 18.2 Fecha

Persistir:

```text
scheduledAt en UTC
```

Calcular:

```text
predictionClosesAt = scheduledAt - 5 minutos
```

No permitir que el administrador establezca manualmente un cierre incompatible, salvo flujo autorizado.

---

## 18.3 Equipos

Validar:

- Existen.
- Están activos para nuevos partidos.
- Son distintos.
- No están eliminados.
- Pertenecen al catálogo permitido.

---

## 18.4 Estado inicial

Normalmente:

```text
SCHEDULED
```

No crear directamente como PROCESSED.

---

## 18.5 Duplicados

Detectar posibles duplicados por:

- Mismos equipos.
- Misma jornada.
- Fecha cercana o igual.

Una advertencia no necesariamente debe impedir guardar si la documentación permite partidos repetidos.

Distinguir:

```text
Duplicado exacto inválido
```

de:

```text
Partido repetido legítimo
```

---

## 18.6 Partido doble

La creación puede permitir marcarlo como doble solo si no viola la regla de la jornada.

La lógica definitiva se centraliza en TASK-057.

---

## 18.7 Auditoría

Registrar:

- Equipos.
- Fecha.
- Jornada.
- Cierre.
- Doble.
- Actor.

---

## 18.8 Pruebas mínimas

- Partido válido.
- Mismo equipo rechazado.
- Equipo inexistente.
- Equipo inactivo.
- Jornada inexistente.
- Fecha inválida.
- Cierre calculado.
- Estado SCHEDULED.
- USER rechazado.
- Auditoría.
- Duplicado advertido o rechazado según política.

---

# 19. Reglas para TASK-057 — Partido doble

Cada jornada publicada debe tener exactamente un partido doble.

---

## 19.1 Restricción

No permitir:

```text
Dos partidos dobles en la misma jornada
```

La protección debe existir en servidor y, cuando sea viable, en base de datos.

---

## 19.2 Selección

La operación debe permitir:

```text
Seleccionar un partido como doble
```

Si otro partido ya era doble, la política debe decidir entre:

- Rechazar con conflicto.
- Reemplazar explícitamente dentro de una transacción.

No cambiarlo silenciosamente.

---

## 19.3 Jornada publicada

Antes de publicar una jornada:

```text
Exactamente uno debe ser doble
```

No:

```text
Cero
Dos o más
```

---

## 19.4 Cambios después del cierre

No permitir cambiar el partido doble si:

- Algún pronóstico relacionado ya cerró.
- Algún partido fue procesado.
- El cambio alteraría puntos.

Cualquier excepción debe ser una corrección extraordinaria de SUPER_ADMIN y no parte de este flujo.

---

## 19.5 Concurrencia

Dos administradores marcando partidos diferentes al mismo tiempo no pueden dejar dos dobles.

Usar:

- Transacción.
- Restricción condicional o estrategia equivalente.
- Lock.
- Validación dentro de la transacción.

---

## 19.6 Auditoría

Registrar:

- Jornada.
- Partido anterior.
- Partido nuevo.
- Actor.
- Motivo cuando aplique.

---

## 19.7 Pruebas mínimas

- Primer doble.
- Segundo doble rechazado.
- Reemplazo explícito si está permitido.
- Jornada publicada con exactamente uno.
- Publicación con cero rechazada.
- Cambio después del cierre rechazado.
- Concurrencia.
- Auditoría.

---

# 20. Reglas para TASK-058 — Reprogramación

Una reprogramación cambia la fecha real del partido.

No cambia automáticamente la jornada.

---

## 20.1 Flujo

```text
Validar actor
↓
Validar partido
↓
Validar estado
↓
Validar nueva fecha
↓
Guardar historial anterior
↓
Actualizar scheduledAt
↓
Recalcular predictionClosesAt
↓
Aplicar política de reapertura
↓
Cambiar estado a RESCHEDULED
↓
Auditar
↓
Commit
```

---

## 20.2 Historial

MatchScheduleHistory debe conservar:

- Fecha anterior.
- Fecha nueva.
- Cierre anterior.
- Cierre nuevo.
- Motivo.
- Actor.
- Fecha de cambio.

No sobrescribir historial anterior.

---

## 20.3 Pronósticos existentes

Los pronósticos se conservan.

No:

- Eliminarlos.
- Reiniciarlos.
- Marcarlos automáticamente como inválidos.
- Cambiar sus marcadores.

---

## 20.4 Reapertura

La reprogramación puede:

```text
Mantener cerrado
```

o:

```text
Reabrir hasta el nuevo cierre
```

solo cuando la política lo permita y la acción sea explícita.

No reabrir automáticamente sin decisión documentada.

La operación debe guardar si hubo reapertura.

---

## 20.5 Nueva fecha pasada

No aceptar una nueva fecha incoherente salvo flujo especial.

Validar contra la hora del servidor.

---

## 20.6 Partido procesado

No reprogramar un partido ya procesado mediante este flujo.

Las correcciones posteriores pertenecen a otra tarea.

---

## 20.7 Notificación

La reprogramación debe generar la base necesaria para notificar a participantes.

El envío puede ocurrir fuera de la transacción.

Una falla de notificación no debe deshacer la reprogramación.

---

## 20.8 Pruebas mínimas

- Reprogramar SCHEDULED.
- Historial creado.
- Cierre recalculado.
- Pronósticos preservados.
- Jornada preservada.
- Reapertura explícita.
- Sin reapertura.
- Partido procesado rechazado.
- Fecha inválida.
- Auditoría.
- Concurrencia.
- Notificación fallida no revierte.

---

# 21. Reglas para TASK-059 — Suspensión y reanudación

Suspensión no significa cancelación.

---

## 21.1 Suspensión

Puede aplicarse a partidos en estado permitido.

Efectos:

- Cambiar a SUSPENDED.
- Conservar pronósticos.
- Conservar fecha.
- Registrar motivo.
- Auditar.
- Impedir procesamiento mientras esté suspendido.

---

## 21.2 Cierre durante suspensión

La política debe definirse de forma explícita.

No asumir que suspender reabre pronósticos.

Si el partido ya estaba cerrado:

```text
Debe permanecer cerrado
```

salvo una reprogramación posterior con reapertura autorizada.

---

## 21.3 Reanudación

Reanudar debe:

- Validar estado SUSPENDED.
- Registrar nueva situación.
- Cambiar a RESUMED o estado documentado.
- Mantener historial.
- No alterar pronósticos.
- No reabrir automáticamente.

---

## 21.4 Reanudación con nueva fecha

Si existe nueva fecha, utilizar el flujo de reprogramación o una composición explícita.

No duplicar lógica de fechas dentro de suspensión.

---

## 21.5 Procesamiento

Un partido suspendido no puede procesarse.

Un partido reanudado debe llegar al estado válido antes de procesarse.

---

## 21.6 Pruebas mínimas

- Suspender SCHEDULED.
- Suspender estado inválido.
- Pronósticos preservados.
- No reabre.
- Reanudar SUSPENDED.
- Reanudar estado inválido.
- Procesamiento suspendido bloqueado.
- Auditoría.
- Motivo requerido.

---

# 22. Reglas para TASK-060 — Cancelación

Cancelación es un estado terminal deportivo para versión 1.0, salvo decisión documentada.

---

## 22.1 Efectos

Un partido cancelado:

- No otorga puntos.
- No se procesa normalmente.
- Conserva pronósticos.
- Conserva jornada.
- Conserva historial.
- Conserva motivo.
- Se muestra como cancelado.
- No se elimina físicamente.

---

## 22.2 Estados permitidos

Puede cancelarse desde estados autorizados como:

```text
SCHEDULED
RESCHEDULED
SUSPENDED
RESUMED
```

No cancelar mediante este flujo:

```text
PROCESSED
```

Una corrección de un partido procesado pertenece a SUPER_ADMIN y otra tarea.

---

## 22.3 Partido doble cancelado

Si el partido doble de una jornada se cancela antes de que la jornada termine, la política debe definir:

- Si debe designarse otro doble.
- Hasta qué momento puede cambiarse.
- Qué ocurre si ya hubo partidos cerrados.

No inventar una reasignación automática que altere competencia.

Cuando la documentación no sea suficiente:

- Bloquear la acción afectada.
- Informar la ambigüedad.
- Solicitar decisión.

---

## 22.4 Clasificación

Un partido cancelado no debe aparecer como:

- Incorrecto.
- Sin pronóstico penalizado.
- Cero puntos procesados como si hubiera resultado.

Debe excluirse del cálculo deportivo.

---

## 22.5 Auditoría y notificación

Registrar:

- Partido.
- Estado anterior.
- Motivo.
- Actor.
- Fecha.
- Request ID.

Generar notificación según infraestructura disponible.

---

## 22.6 Pruebas mínimas

- Cancelar SCHEDULED.
- Cancelar SUSPENDED.
- PROCESSED rechazado.
- Pronósticos conservados.
- No genera puntuación.
- No permite procesamiento.
- Motivo requerido.
- Auditoría.
- Notificación fallida no revierte.
- Caso de partido doble tratado según política.

---

# 23. Reglas para TASK-061 — UI administrativa de partidos

La UI debe permitir:

- Listar.
- Filtrar.
- Crear.
- Ver detalle.
- Designar doble.
- Reprogramar.
- Suspender.
- Reanudar.
- Cancelar.

No debe incluir todavía:

- Captura de resultado oficial.
- Corrección de resultado.
- Recalculo.

---

## 23.1 Orden cronológico

Ordenar partidos por:

```text
scheduledAt
```

No por:

```text
round.sequence
```

La UI puede agrupar por jornada, pero dentro de la vista cronológica debe respetar fecha real.

---

## 23.2 Columnas

Columnas sugeridas:

- Fecha y hora.
- Jornada.
- Local.
- Visitante.
- Estado.
- Cierre de pronóstico.
- Doble.
- Pronósticos recibidos, si el permiso permite el conteo.
- Acciones.

No mostrar marcadores pronosticados antes del cierre.

---

## 23.3 Filtros

Filtros:

```text
Temporada
Jornada
Estado
Equipo
Rango de fecha
Partido doble
```

---

## 23.4 Formularios

Crear partido:

- Jornada.
- Local.
- Visitante.
- Fecha.
- Hora.
- Doble.
- Advertencia de cierre calculado.

Reprogramar:

- Fecha nueva.
- Motivo.
- Reabrir pronósticos, cuando sea permitido.
- Resumen de impacto.

Suspender:

- Motivo.

Cancelar:

- Motivo.
- Advertencia de consecuencias.

---

## 23.5 Confirmaciones

Acciones críticas deben mostrar:

```text
Estado actual
Estado nuevo
Impacto en pronósticos
Impacto en cierre
Impacto en puntuación
```

---

## 23.6 Visibilidad de pronósticos

La UI administrativa tampoco debe mostrar pronósticos ajenos antes del cierre.

Puede mostrar un conteo agregado si está permitido y no revela contenido.

No mostrar:

- Marcadores.
- Usuarios que ya pronosticaron, si la política lo considera sensible.
- Distribución de resultados.

---

## 23.7 Responsive

En móvil puede utilizar:

- Cards.
- Tablas desplazables.
- Acciones agrupadas.
- Filtros colapsables.

No ocultar información crítica únicamente por falta de espacio.

---

## 23.8 Pruebas mínimas

- Lista cronológica.
- Filtros.
- Crear partido.
- Mismo equipo rechazado.
- Cierre mostrado.
- Doble.
- Reprogramación.
- Suspensión.
- Reanudación.
- Cancelación.
- Permisos.
- Confirmaciones.
- Responsive.
- Accesibilidad.
- Sin fuga de pronósticos.

---

# 24. Server Actions y casos de uso

Las Server Actions administrativas deben ser delgadas.

Flujo:

```text
UI
↓
Server Action
↓
Autenticación
↓
Zod
↓
Application Service
↓
Repositories
↓
AuditLog
```

No colocar reglas complejas dentro de componentes.

---

## 24.1 Servicios específicos

Preferir servicios explícitos:

```text
ApproveUserService
RejectUserService
BlockUserService
PromoteAdminService
CreateSeasonService
ActivateSeasonService
AddSeasonParticipantService
CreateRoundService
PublishRoundService
CreateMatchService
SetDoubleMatchService
RescheduleMatchService
SuspendMatchService
ResumeMatchService
CancelMatchService
```

No crear un único:

```text
AdminService
```

con decenas de responsabilidades.

---

# 25. Validación de estado

Toda acción debe validar el estado actual.

Ejemplo:

```text
PENDING_APPROVAL → ACTIVE
```

No permitir:

```text
REJECTED → ACTIVE
```

mediante el servicio de aprobación normal si esa transición no está documentada.

La validación debe estar centralizada.

No duplicarla en cada UI.

---

# 26. Concurrencia

Operaciones administrativas críticas:

- Aprobación.
- Activación de temporada.
- Incorporación.
- Partido doble.
- Reprogramación.
- Suspensión.
- Cancelación.

deben considerar solicitudes simultáneas.

Utilizar según corresponda:

- Restricciones únicas.
- Transacciones.
- Versionado.
- Actualización condicional.
- Locks.

No confiar únicamente en que “solo habrá un administrador”.

---

# 27. Auditoría obligatoria

Toda acción de esta fase debe auditarse cuando modifique estado o configuración.

Campos mínimos:

```text
actorId
action
entityType
entityId
before
after
requestId
createdAt
```

Los estados before/after deben sanitizarse.

No incluir:

- Email completo cuando no sea necesario.
- Tokens.
- Sesiones.
- Password hashes.
- Datos SMTP.
- Connection strings.

---

# 28. Notificaciones

Esta fase puede generar eventos o notificaciones para:

- Cuenta aprobada.
- Cuenta rechazada.
- Cuenta bloqueada.
- Cuenta desbloqueada.
- Partido reprogramado.
- Partido suspendido.
- Partido reanudado.
- Partido cancelado.

No acoplar el caso de uso a un proveedor concreto.

Preferir:

```text
Commit
↓
Emitir o crear notificación
↓
Intentar correo fuera de transacción
```

---

# 29. Caché y revalidación

Después de acciones administrativas, revalidar únicamente datos afectados.

Tags conceptuales:

```text
admin-users
teams
seasons
season:{seasonId}
rounds:{seasonId}
round:{roundId}
matches
match:{matchId}
dashboard
```

No invalidar toda la aplicación sin necesidad.

No cachear públicamente paneles administrativos.

---

# 30. Soft delete

Aplicar soft delete en:

- Usuarios cuando corresponda.
- Temporadas.
- Jornadas.
- Partidos.
- Equipos o patrocinadores según modelo.

Las consultas administrativas pueden permitir incluir eliminados mediante filtros explícitos.

Las consultas normales deben excluirlos.

No reutilizar códigos únicos de entidades eliminadas sin política clara.

---

# 31. Fechas

Persistir UTC.

Mostrar en:

```text
America/Tegucigalpa
```

Los formularios deben convertir de zona de negocio a UTC de manera explícita.

No guardar una fecha local sin zona.

Mostrar al administrador:

```text
Fecha local
Zona horaria
Cierre calculado
```

para reducir errores.

---

# 32. Errores funcionales esperados

Códigos sugeridos:

```text
USER_NOT_PENDING_APPROVAL
USER_ALREADY_APPROVED
USER_CANNOT_BE_BLOCKED
LAST_SUPER_ADMIN_PROTECTED
USER_ALREADY_PARTICIPANT
ACTIVE_SEASON_ALREADY_EXISTS
SEASON_NOT_ACTIVATABLE
ROUND_NOT_PUBLISHABLE
MATCH_TEAMS_MUST_DIFFER
MATCH_NOT_RESCHEDULABLE
MATCH_NOT_SUSPENDABLE
MATCH_NOT_RESUMABLE
MATCH_NOT_CANCELLABLE
DOUBLE_MATCH_ALREADY_EXISTS
DOUBLE_MATCH_CHANGE_NOT_ALLOWED
INVALID_STATE_TRANSITION
FORBIDDEN
CONFLICT
```

Los nombres finales deben mantener consistencia con el proyecto.

---

# 33. Orden recomendado

```text
TASK-046
↓
TASK-047
↓
TASK-048
↓
TASK-049
↓
TASK-050
↓
TASK-051
↓
TASK-052
↓
TASK-053
↓
TASK-054
↓
TASK-055
↓
TASK-056
↓
TASK-057
↓
TASK-058
↓
TASK-059
↓
TASK-060
↓
TASK-061
```

Puede adelantarse TASK-050 si la autenticación ya necesita equipos activos.

No adelantar UI antes de que existan los casos de uso relacionados.

---

# 34. Criterios de salida de la fase

La fase administrativa se considera completa cuando:

- Los usuarios confirmados pueden aprobarse.
- La aprobación puede incorporar a temporada sin retroactividad.
- Rechazo, bloqueo y desactivación son estados distintos.
- Bloqueo y desactivación revocan sesiones.
- Solo SUPER_ADMIN cambia roles administrativos.
- El último SUPER_ADMIN está protegido.
- Los equipos se administran sin romper historial.
- Puede crearse una temporada en borrador.
- Solo existe una temporada activa.
- Pueden incorporarse participantes.
- Los participantes tardíos comienzan en cero.
- Las jornadas son agrupaciones lógicas.
- La secuencia de jornada no controla cronología.
- Los partidos calculan cierre correctamente.
- Local y visitante son distintos.
- Existe exactamente un doble por jornada publicada.
- La reprogramación conserva pronósticos e historial.
- La suspensión no elimina información.
- La cancelación no otorga puntos.
- Todas las acciones críticas generan auditoría.
- La UI administrativa valida permisos.
- No existen fugas de pronósticos.
- Las pruebas unitarias pasan.
- Las pruebas de integración pasan.
- Los E2E administrativos principales pasan.
- Lint pasa.
- Typecheck pasa.
- Build pasa.

---

# 35. Fuera de alcance

No implementar en esta fase:

- Guardado de pronósticos.
- Edición de pronósticos.
- Visibilidad pública de pronósticos.
- Procesamiento de resultados.
- Cálculo transaccional de puntos.
- Clasificación pública.
- Corrección de resultados.
- Recalculo.
- Dashboard de usuario.
- Centro de notificaciones completo.
- Patrocinadores.
- Configuración pública avanzada.
- Diagnóstico.
- Exportaciones.
- SQL Console.

No adelantar tareas posteriores.

---

# 36. Errores comunes

## Error 1 — Aprobar usuario sin correo confirmado

Debe estar en PENDING_APPROVAL.

---

## Error 2 — Permitir que ADMIN promueva roles

Solo SUPER_ADMIN.

---

## Error 3 — Desactivar borrando

Conservar historial.

---

## Error 4 — Activar dos temporadas

Proteger con transacción y restricción.

---

## Error 5 — Dar puntos retroactivos al participante tardío

Debe comenzar en cero.

---

## Error 6 — Usar jornada como cronología

Usar scheduledAt.

---

## Error 7 — Guardar cierre manual inconsistente

Calcular cinco minutos antes.

---

## Error 8 — Cambiar doble después del cierre

Debe bloquearse.

---

## Error 9 — Eliminar pronósticos al reprogramar

Se conservan.

---

## Error 10 — Reabrir automáticamente

La reapertura debe ser explícita y autorizada.

---

## Error 11 — Procesar partido suspendido o cancelado

Debe rechazarse.

---

## Error 12 — Mostrar pronósticos al administrador antes del cierre

La privacidad también aplica a administradores participantes.

---

# 37. Pruebas mínimas de seguridad

Al finalizar esta fase deben existir pruebas para:

- USER no accede a administración.
- ADMIN no promueve roles.
- ADMIN no bloquea SUPER_ADMIN.
- Último SUPER_ADMIN protegido.
- IDOR en usuario rechazado.
- IDOR en temporada rechazado.
- IDOR en partido rechazado.
- Acciones validan estado en servidor.
- Modificar campos ocultos no evita reglas.
- Auditoría no contiene secretos.
- UI administrativa no cacheada públicamente.
- Pronósticos no se filtran por UI sino en consulta.
- Acciones concurrentes mantienen integridad.

---

# 38. Comandos de validación

Según la tarea:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
npm run build
npx prisma validate
npx prisma generate
```

Cuando existan cambios de esquema:

```bash
npx prisma migrate dev
```

solo contra una base de desarrollo o testing autorizada.

---

# 39. Formato de entrega

Cada tarea debe terminar con:

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

Agregar:

```text
Tareas adicionales implementadas: ninguna
```

---

# 40. Prompt base de ejecución

```text
Implementa únicamente [TASK-XXX — NOMBRE] de
docs/19-IMPLEMENTATION_PLAN.md.

Contexto obligatorio:

- prompts/00-global-context.md
- prompts/03-admin.md
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
2. Confirma dependencias.
3. Revisa políticas de autorización.
4. Revisa estados y transiciones.
5. Revisa pruebas existentes.
6. Presenta un plan breve.
7. Identifica riesgos de integridad, concurrencia y auditoría.

Implementa únicamente el cambio mínimo completo.

No avances tareas posteriores.

Agrega pruebas unitarias, de integración, API o E2E según corresponda.

Ejecuta los comandos aplicables.

Entrega el resultado usando prompts/09-task-template.md.
```

---

# 41. Ejemplo — TASK-046

```text
Implementa únicamente TASK-046 — Implementar aprobación de usuarios.

Lee:

- prompts/00-global-context.md
- prompts/03-admin.md
- prompts/09-task-template.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/10-ManualAdministrador.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-024 — UserRepository
- TASK-025 — SeasonRepository
- TASK-026 — StandingRepository si aplica
- TASK-027 — AuditLogRepository
- TASK-030 — Sesiones
- TASK-032 — Confirmación de correo
- TASK-038 — EmailProvider

Objetivo:

Implementar un caso de uso transaccional para aprobar un usuario con
correo confirmado y, opcionalmente, incorporarlo a la temporada activa.

Alcance:

- src/modules/users/application/
- src/modules/seasons/application/
- Schemas relacionados.
- Repositorios estrictamente necesarios.
- tests/unit/users/
- tests/integration/users/

Fuera de alcance:

- UI administrativa.
- Rechazo.
- Bloqueo.
- Promoción.
- Creación de temporadas.

Requisitos:

- Actor ADMIN o SUPER_ADMIN.
- Usuario objetivo PENDING_APPROVAL.
- Cambiar a ACTIVE.
- Incorporación opcional a temporada.
- joinedAt actual.
- Cero puntos iniciales.
- Sin retroactividad.
- Evitar SeasonParticipant duplicado.
- Transacción.
- Auditoría dentro de transacción.
- Correo de aprobación fuera de transacción.
- Falla SMTP no revierte aprobación.
- Concurrencia controlada.

Pruebas:

- Aprobación válida.
- Usuario sin confirmar rechazado.
- Usuario activo.
- USER como actor.
- Incorporación.
- Sin incorporación.
- Duplicado.
- Concurrencia.
- Auditoría.
- Falla SMTP.
```

---

# 42. Ejemplo — TASK-052

```text
Implementa únicamente TASK-052 — Implementar activación de temporada.

Lee:

- prompts/00-global-context.md
- prompts/03-admin.md
- prompts/09-task-template.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/10-ManualAdministrador.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-025 — SeasonRepository
- TASK-027 — AuditLogRepository
- TASK-051 — Creación de temporada

Objetivo:

Activar una temporada válida garantizando que solo exista una
temporada activa.

Alcance:

- src/modules/seasons/application/
- src/modules/seasons/domain/
- src/modules/seasons/infrastructure/
- tests/unit/seasons/
- tests/integration/seasons/

Fuera de alcance:

- Crear temporada.
- Incorporar participantes.
- UI.
- Cerrar temporada.

Requisitos:

- Actor autorizado.
- Temporada DRAFT válida.
- No eliminada.
- No existe otra activa.
- Transacción.
- Protección contra concurrencia.
- Auditoría.
- No desactivar otra automáticamente.
- Error ACTIVE_SEASON_ALREADY_EXISTS.

Pruebas:

- Activación válida.
- Otra temporada activa.
- Activación repetida.
- USER rechazado.
- Temporada inválida.
- Dos activaciones concurrentes.
- Solo una activa.
- Auditoría.
```

---

# 43. Ejemplo — TASK-057

```text
Implementa únicamente TASK-057 — Implementar partido doble.

Lee:

- prompts/00-global-context.md
- prompts/03-admin.md
- prompts/09-task-template.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/10-ManualAdministrador.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-025 — MatchRepository y RoundRepository
- TASK-027 — AuditLogRepository
- TASK-054 — Jornadas
- TASK-056 — Creación de partido

Objetivo:

Garantizar que una jornada publicada tenga exactamente un partido
doble y que nunca existan dos simultáneamente.

Alcance:

- src/modules/matches/application/
- src/modules/matches/domain/
- src/modules/matches/infrastructure/
- tests/unit/matches/
- tests/integration/matches/

Fuera de alcance:

- Puntuación.
- Procesamiento.
- UI.
- Corrección posterior al cierre.

Requisitos:

- Seleccionar un partido de la jornada.
- Validar pertenencia.
- Rechazar segundo doble o reemplazarlo solo de forma explícita.
- Transacción.
- Concurrencia.
- No cambiar después del cierre.
- No cambiar con partidos procesados.
- Publicación requiere exactamente uno.
- Auditoría before/after.

Pruebas:

- Primer doble.
- Segundo rechazado.
- Reemplazo explícito si está documentado.
- Cero dobles impide publicación.
- Dos solicitudes concurrentes.
- Cambio después del cierre.
- Partido de otra jornada.
- Auditoría.
```

---

# 44. Ejemplo — TASK-058

```text
Implementa únicamente TASK-058 — Implementar reprogramación.

Lee:

- prompts/00-global-context.md
- prompts/03-admin.md
- prompts/09-task-template.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/10-ManualAdministrador.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-021 — Cálculo de cierre
- TASK-022 — Máquina de estados
- TASK-025 — MatchRepository
- TASK-026 — PredictionRepository
- TASK-027 — AuditLogRepository
- TASK-056 — Creación de partido

Objetivo:

Reprogramar un partido conservando pronósticos, creando historial y
recalculando el cierre.

Alcance:

- src/modules/matches/application/
- src/modules/matches/domain/
- src/modules/matches/infrastructure/
- tests/unit/matches/
- tests/integration/matches/

Fuera de alcance:

- UI.
- Eliminación o edición de pronósticos.
- Procesamiento.
- Recalculo de standings.
- Cambio automático de jornada.

Requisitos:

- Validar estado.
- Guardar fecha y cierre anteriores.
- Actualizar nueva fecha.
- Calcular nuevo cierre.
- Conservar jornada.
- Conservar pronósticos.
- Reapertura únicamente explícita.
- Motivo requerido.
- Estado RESCHEDULED.
- Transacción.
- Auditoría.
- Notificación fuera de transacción.
- Partido procesado rechazado.

Pruebas:

- Reprogramación válida.
- Historial.
- Nuevo cierre.
- Pronósticos preservados.
- Jornada preservada.
- Reapertura.
- Sin reapertura.
- Fecha inválida.
- Procesado.
- Auditoría.
- Concurrencia.
```

---

# 45. Ejemplo — TASK-061

```text
Implementa únicamente TASK-061 — Crear UI administrativa de partidos.

Lee:

- prompts/00-global-context.md
- prompts/03-admin.md
- prompts/09-task-template.md
- docs/05-UI-UX.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/10-ManualAdministrador.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-056 — Creación de partido
- TASK-057 — Partido doble
- TASK-058 — Reprogramación
- TASK-059 — Suspensión y reanudación
- TASK-060 — Cancelación

Objetivo:

Crear la interfaz administrativa para consultar y gestionar partidos.

Alcance:

- src/app/(admin)/admin/matches/
- src/modules/matches/ui/
- Componentes compartidos estrictamente necesarios.
- Pruebas de componente.
- E2E administrativos.

Fuera de alcance:

- Procesar resultados.
- Corregir resultados.
- Mostrar pronósticos antes del cierre.
- Recalculo.

Requisitos:

- Lista ordenada por scheduledAt.
- Filtros.
- Crear partido.
- Mostrar cierre calculado.
- Designar doble.
- Reprogramar.
- Suspender.
- Reanudar.
- Cancelar.
- Confirmaciones.
- Permisos.
- Estados de error.
- Responsive.
- Accesible.
- Sin fuga de pronósticos.

Pruebas:

- Listado cronológico.
- Crear.
- Filtros.
- Doble.
- Reprogramar.
- Suspender.
- Reanudar.
- Cancelar.
- Permisos.
- Confirmaciones.
- Mobile.
- Teclado.
- Error de servidor.
```

---

# 46. Conclusión

La fase administrativa debe producir una competencia configurable, trazable y segura.

El objetivo no es ofrecer una tabla genérica para editar cualquier campo.

El objetivo es implementar operaciones específicas con reglas claras:

```text
Aprobar
Bloquear
Promover
Crear
Activar
Publicar
Programar
Reprogramar
Suspender
Reanudar
Cancelar
```

Cada una debe:

- Validar autorización.
- Validar estado.
- Preservar historial.
- Controlar concurrencia.
- Auditar.
- Proteger la integridad deportiva.

Una administración flexible pero sin reglas pondría en riesgo toda la competencia.

Por ello, la integridad y la trazabilidad tienen prioridad sobre la comodidad administrativa.