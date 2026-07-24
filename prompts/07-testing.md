# Testing Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Testing, validación y aseguramiento de calidad  
**Tareas principales:** TASK-107 a TASK-116  
**Tipo:** Prompt maestro de fase

---

# 1. Propósito

Este documento define el contexto específico para implementar y mantener la estrategia de pruebas del proyecto.

El objetivo principal es garantizar que cada regla de negocio, caso de uso y flujo crítico pueda verificarse automáticamente.

Las pruebas son parte del producto.

Una funcionalidad sin pruebas no se considera terminada.

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
- prompts/07-testing.md
- prompts/09-task-template.md

Implementa únicamente TASK-107.
```

---

# 3. Tareas cubiertas

```text
TASK-107 — Completar pruebas unitarias
TASK-108 — Completar pruebas de integración
TASK-109 — Completar pruebas API
TASK-110 — Completar pruebas E2E
TASK-111 — Accesibilidad
TASK-112 — Responsive
TASK-113 — Revisar consultas N+1
TASK-114 — Procesamiento masivo
TASK-115 — Recalculo masivo
TASK-116 — Límites del plan gratuito
```

---

# 4. Objetivo

El sistema debe demostrar automáticamente que:

- Las reglas deportivas funcionan.
- La seguridad se mantiene.
- La autorización es correcta.
- Las regresiones son detectadas.
- La experiencia de usuario permanece estable.

---

# 5. Principios

Las pruebas deben ser:

- Deterministas.
- Repetibles.
- Independientes.
- Pequeñas.
- Claras.
- Rápidas cuando sea posible.

Nunca depender de:

- Hora real.
- Producción.
- Datos reales.
- Servicios externos.

---

# 6. Pirámide de pruebas

Prioridad:

```text
Unitarias
↓

Integración
↓

API
↓

E2E
```

No intentar cubrir toda la lógica únicamente con E2E.

---

# 7. TASK-107 — Unit Tests

Cubrir principalmente:

- calculatePredictionScore()
- getMatchOutcome()
- calculatePredictionClosesAt()
- calculateStandings()
- calculateTrend()
- políticas de autorización
- máquina de estados
- validaciones

Cada función crítica del dominio debe tener cobertura.

---

# 8. Cobertura

No perseguir un porcentaje arbitrario.

La prioridad es cubrir:

- reglas deportivas,
- casos límite,
- errores,
- transiciones inválidas.

---

# 9. Casos límite obligatorios

Ejemplos:

- 0-0.
- Partido doble.
- Empates.
- Usuario sin pronóstico.
- Cierre exacto.
- Dos participantes empatados.
- Reprogramación.
- Cancelación.

---

# 10. TASK-108 — Integración

Probar:

- Prisma.
- Repositorios.
- Transacciones.
- Auditoría.
- Sesiones.
- SMTP falso.

No usar producción.

---

# 11. Base de pruebas

Debe ser independiente.

Nunca ejecutar integración contra producción.

Agregar validaciones defensivas para evitarlo.

---

# 12. TASK-109 — API

Verificar:

- Status HTTP.
- Formato JSON.
- Autorización.
- Errores.
- Validaciones.
- Contratos.

No romper el contrato definido en:

```text
docs/06-API.md
```

---

# 13. TASK-110 — E2E

Flujos mínimos:

- Registro.
- Confirmación.
- Login.
- Pronóstico.
- Edición.
- Cierre.
- Procesamiento.
- Clasificación.
- Reprogramación.
- Corrección.
- Recuperación de contraseña.

---

# 14. TASK-111 — Accesibilidad

Verificar:

- Navegación por teclado.
- Labels.
- Roles.
- Focus visible.
- Contraste.
- Lectores de pantalla.
- Mensajes de error.

La aplicación debe ser usable sin mouse.

---

# 15. TASK-112 — Responsive

Resoluciones mínimas:

```text
320
375
390
768
1366
1920
```

No permitir scroll horizontal innecesario.

---

# 16. TASK-113 — Rendimiento de consultas

Revisar:

- N+1.
- Consultas duplicadas.
- Consultas innecesarias.
- Índices.

Optimizar únicamente cuando exista evidencia.

---

# 17. TASK-114 — Procesamiento masivo

Simular:

```text
50 usuarios

100 usuarios

500 usuarios
```

Procesar resultados.

Verificar:

- consistencia,
- tiempo,
- memoria.

---

# 18. TASK-115 — Recalculo masivo

Probar temporadas completas.

Comparar:

Standing original

↓

Standing reconstruido

Debe ser idéntico.

---

# 19. TASK-116 — Plan gratuito

Validar:

- memoria,
- tiempo de respuesta,
- límites del hosting,
- tamaño de base.

No introducir dependencias de pago para resolver problemas no comprobados.

---

# 20. Reloj controlado

Todas las pruebas relacionadas con tiempo deben utilizar:

```text
Clock
```

o equivalente.

Nunca depender de:

```javascript
new Date()
```

durante la prueba.

---

# 21. Fake Providers

Utilizar implementaciones falsas para:

- SMTP.
- Clock.
- Repositorios cuando corresponda.
- Notificaciones.

No enviar correos reales.

---

# 22. Datos de prueba

Utilizar:

```text
@example.invalid
```

No utilizar datos reales.

Los fixtures deben ser pequeños y deterministas.

---

# 23. Seguridad

Las pruebas también deben validar:

- IDOR.
- Acceso por rol.
- Manipulación de parámetros.
- Rate limiting.
- Privacidad de pronósticos.

---

# 24. Regresión

Cada defecto corregido debe agregar:

```text
Una prueba que falle antes
↓

Pase después
```

No corregir errores sin dejar evidencia automática.

---

# 25. Errores comunes

Nunca:

## Error 1

Eliminar pruebas para que el build pase.

---

## Error 2

Modificar reglas para que la prueba pase.

---

## Error 3

Usar producción.

---

## Error 4

Depender de Internet.

---

## Error 5

Esperar minutos reales.

---

## Error 6

No limpiar fixtures.

---

## Error 7

Compartir estado entre pruebas.

---

## Error 8

Mockear la lógica deportiva.

---

# 26. Criterios de salida

La fase queda completa cuando:

- Unit tests pasan.
- Integración pasa.
- API pasa.
- E2E pasa.
- Accesibilidad validada.
- Responsive validado.
- Consultas revisadas.
- Procesamiento masivo probado.
- Recalculo masivo probado.
- Hosting gratuito validado.
- Lint pasa.
- Build pasa.

---

# 27. Prompt base

```text
Implementa únicamente TASK-107.

No implementes nuevas funcionalidades.

Agregar únicamente las pruebas necesarias.

No modificar reglas deportivas.

Ejecutar:

npm run lint

npm run typecheck

npm test

npm run test:integration

npm run test:e2e

npm run build
```

---

# 28. Ejemplo — TASK-110

```text
Implementa únicamente TASK-110.

Crear pruebas E2E para:

- Registro.
- Login.
- Pronóstico.
- Procesamiento.
- Clasificación.

No modificar producción.

Utilizar FakeEmailProvider.

Agregar pruebas Playwright.
```

---

# 29. Definición de éxito

Una tarea de implementación no está terminada únicamente porque compile.

Debe demostrar mediante pruebas que:

- Funciona.
- Sigue funcionando.
- No rompió funcionalidades anteriores.
- Cumple las reglas deportivas.

---

# 30. Conclusión

Las pruebas representan el contrato vivo del proyecto.

Cada nueva funcionalidad debe ir acompañada de pruebas que demuestren su comportamiento esperado.

La estabilidad de la aplicación dependerá más de la calidad de estas pruebas que del volumen de código implementado.