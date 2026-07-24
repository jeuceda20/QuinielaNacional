# Dashboard Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Dashboard y experiencia del participante  
**Tareas principales:** TASK-078 a TASK-083  
**Tipo:** Prompt maestro de fase

---

# 1. Propósito

Este documento define el contexto para implementar el Dashboard del participante y las funcionalidades de visualización posteriores al procesamiento de resultados.

El Dashboard es el punto principal de interacción del usuario autenticado.

Su objetivo es presentar información clara, rápida y segura, sin exponer datos privados de otros participantes.

---

# 2. Uso obligatorio

Este prompt debe utilizarse junto con:

```text
prompts/00-global-context.md
prompts/09-task-template.md
docs/19-IMPLEMENTATION_PLAN.md
```

Ejemplo:

```text
Lee:

- prompts/00-global-context.md
- prompts/06-dashboard.md
- prompts/09-task-template.md

Implementa únicamente TASK-078.
```

---

# 3. Tareas cubiertas

```text
TASK-078 — Dashboard del usuario
TASK-079 — Notificaciones internas
TASK-080 — Centro de notificaciones
TASK-081 — Patrocinadores
TASK-082 — Configuración pública
TASK-083 — Modo mantenimiento
```

---

# 4. Objetivo funcional

Después del login, un usuario debe poder visualizar rápidamente:

- Su posición actual.
- Sus puntos.
- Su tendencia.
- Próximos partidos pendientes.
- Últimos resultados.
- Clasificación resumida.
- Notificaciones relevantes.

El Dashboard no reemplaza las vistas detalladas.

Debe actuar como un resumen ejecutivo.

---

# 5. Documentación obligatoria

Consultar según corresponda:

```text
docs/01-PRD.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/11-ManualUsuario.md
docs/14-DecisionesArquitectonicas.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
docs/19-IMPLEMENTATION_PLAN.md
```

---

# 6. Principios del Dashboard

El Dashboard debe responder tres preguntas:

1. ¿Cómo voy?
2. ¿Qué debo hacer ahora?
3. ¿Qué ocurrió recientemente?

Todo el contenido debe responder a alguna de estas preguntas.

---

# 7. Información personal

Mostrar únicamente información del usuario autenticado.

Nunca utilizar datos obtenidos desde el cliente.

Todas las consultas deben filtrarse por:

```text
currentUserId
```

---

# 8. TASK-078 — Dashboard del usuario

Debe incluir al menos:

## Resumen personal

- Nickname.
- Equipo favorito.
- Posición.
- Puntos.
- Exactos.
- Parciales.
- Tendencia.

---

## Próximo partido pendiente

Mostrar el siguiente partido abierto sin pronóstico.

Si no existen:

```text
No tienes pronósticos pendientes.
```

---

## Último resultado procesado

Mostrar:

- Partido.
- Resultado oficial.
- Pronóstico del usuario.
- Puntos obtenidos.

---

## Clasificación resumida

Mostrar:

- Top 5.
- Posición propia aunque no esté en el Top 5.

Nunca ocultar la posición del usuario.

---

## Rendimiento

Mostrar indicadores simples:

- Exactos.
- Parciales.
- Total de pronósticos.

No agregar estadísticas avanzadas en la versión 1.0.

---

# 9. Rendimiento del Dashboard

El Dashboard debe minimizar consultas.

Preferir:

- consultas agregadas,
- DTO específicos,
- proyecciones optimizadas.

No ejecutar múltiples consultas redundantes.

---

# 10. Cache

Puede utilizar:

```text
private
```

Nunca:

```text
public
```

Después de:

- guardar pronóstico,
- procesamiento,
- recalculo,

debe revalidarse el Dashboard.

---

# 11. TASK-079 — Notificaciones internas

Implementar un sistema de notificaciones internas.

Eventos mínimos:

- Cuenta aprobada.
- Partido reprogramado.
- Partido suspendido.
- Partido cancelado.
- Resultado procesado.

No implementar push notifications en versión 1.0.

---

# 12. Lectura

Cada notificación debe soportar:

- Leída.
- No leída.

Debe existir:

```text
markAsRead()
```

---

# 13. TASK-080 — Centro de notificaciones

Debe permitir:

- Listado.
- Marcar como leída.
- Marcar todas.
- Paginación.

No eliminar notificaciones automáticamente.

---

# 14. TASK-081 — Patrocinadores

Los patrocinadores son opcionales.

Nunca romper la UI si no existen.

Mostrar:

- Logo.
- Nombre.
- Enlace.

No utilizar scripts externos inseguros.

---

# 15. TASK-082 — Configuración pública

Debe permitir administrar:

- Nombre de la aplicación.
- Logo.
- Descripción.
- Redes sociales.
- Registro habilitado.

No almacenar secretos en ApplicationSettings.

---

# 16. TASK-083 — Modo mantenimiento

Solo:

```text
SUPER_ADMIN
```

Debe permitir:

- Activar.
- Desactivar.
- Mostrar mensaje público.

Durante mantenimiento:

- Usuarios normales no pueden acceder.
- SUPER_ADMIN sí puede acceder.

---

# 17. Responsive

El Dashboard debe adaptarse a:

```text
320 px
375 px
390 px
768 px
1366 px
1920 px
```

Preferir tarjetas (cards) sobre tablas.

---

# 18. Accesibilidad

Todos los widgets deben incluir:

- Labels.
- Roles.
- Navegación por teclado.
- Contraste suficiente.
- Estados anunciados.

---

# 19. Errores funcionales

Ejemplos:

```text
DASHBOARD_UNAVAILABLE
NOTIFICATION_NOT_FOUND
MAINTENANCE_MODE_ENABLED
FORBIDDEN
```

---

# 20. Pruebas mínimas

TASK-078

- Dashboard con datos.
- Dashboard vacío.
- Top 5.
- Posición propia.
- Partido pendiente.

TASK-079

- Crear notificación.
- Marcar leída.

TASK-080

- Listado.
- Paginación.

TASK-081

- Sin patrocinadores.
- Con patrocinadores.

TASK-082

- Configuración válida.
- Configuración inválida.

TASK-083

- Activar mantenimiento.
- Usuario bloqueado.
- SUPER_ADMIN permitido.

---

# 21. Errores comunes

Nunca:

## Error 1

Consultar datos de otros usuarios.

---

## Error 2

Cachear Dashboard públicamente.

---

## Error 3

Romper UI por ausencia de patrocinadores.

---

## Error 4

Mostrar estadísticas inconsistentes.

---

## Error 5

Ocultar la posición del usuario.

---

## Error 6

Permitir acceso normal durante mantenimiento.

---

## Error 7

Guardar secretos en configuración pública.

---

# 22. Criterios de salida

La fase queda completa cuando:

- Dashboard funciona.
- Próximos partidos correctos.
- Top 5 correcto.
- Posición correcta.
- Notificaciones funcionan.
- Patrocinadores opcionales.
- Configuración pública editable.
- Modo mantenimiento operativo.
- Responsive.
- Accesible.
- Tests pasan.
- Lint pasa.
- Build pasa.

---

# 23. Prompt base

```text
Implementa únicamente TASK-078.

No implementes notificaciones.

No implementes mantenimiento.

Crear únicamente Dashboard.

Agregar pruebas.

Ejecutar:

lint

typecheck

tests

build
```

---

# 24. Ejemplo — TASK-078

```text
Implementa únicamente TASK-078.

Objetivo:

Crear el Dashboard del participante.

Debe mostrar:

- Posición.
- Puntos.
- Tendencia.
- Próximo partido pendiente.
- Último resultado.
- Top 5.

No modificar reglas deportivas.

No recalcular datos.

Utilizar únicamente consultas existentes.

Agregar pruebas de componente e integración.
```

---

# 25. Ejemplo — TASK-079

```text
Implementa únicamente TASK-079.

Crear sistema de notificaciones internas.

No implementar correo.

No implementar push.

Agregar pruebas.
```

---

# 26. Ejemplo — TASK-083

```text
Implementa únicamente TASK-083.

Crear modo mantenimiento.

Solo SUPER_ADMIN.

Usuarios normales reciben página de mantenimiento.

Agregar pruebas.
```

---

# 27. Conclusión

El Dashboard debe ofrecer una visión rápida, clara y consistente del estado del participante dentro de la competencia.

No debe contener lógica deportiva propia.

Toda la información presentada debe provenir de servicios ya existentes y respetar siempre la privacidad, la autorización y la consistencia del sistema.