# Results Processing Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Procesamiento de resultados y clasificación  
**Parte:** 1 de 2  
**Tareas principales:** TASK-068 a TASK-070  
**Tipo:** Prompt maestro de fase

---

# 1. Propósito

Este documento define el contexto específico para implementar el procesamiento oficial de resultados.

Esta fase es responsable de:

- registrar resultados oficiales,
- calcular la puntuación,
- actualizar la clasificación,
- mantener la consistencia,
- impedir duplicaciones,
- garantizar reproducibilidad.

Un error aquí afecta directamente:

- la clasificación,
- los puntos,
- el campeón,
- la confianza de todos los participantes.

Por ello todas las operaciones deberán ser completamente deterministas.

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

prompts/00-global-context.md

prompts/05-results.md

prompts/09-task-template.md

Implementa únicamente TASK-068.
```

Nunca solicitar:

```text
Implementa el módulo completo de resultados.
```

La regla sigue siendo:

```text
Una ejecución = una tarea.
```

---

# 3. Tareas cubiertas

Esta primera parte cubre:

```text
TASK-068
Procesamiento oficial

TASK-069
Control de concurrencia

TASK-070
Idempotencia
```

La Parte 2 cubrirá:

```text
TASK-071
UI procesamiento

TASK-072
Clasificación pública

TASK-073
Resultados públicos

TASK-074
Corrección

TASK-075
Vista previa

TASK-076
Recalculo

TASK-077
UI recalculo
```

---

# 4. Objetivo funcional

Después de ingresar un resultado oficial el sistema debe:

```text
Guardar resultado

↓

Calcular todos los pronósticos

↓

Guardar puntuaciones

↓

Actualizar standings

↓

Crear snapshot

↓

Auditar

↓

Commit
```

Nunca dejar un estado parcial.

---

# 5. Documentación obligatoria

Antes de implementar cualquier tarea revisar:

```text
docs/03-ModeloBaseDatos.md

docs/04-ReglasNegocio.md

docs/06-API.md

docs/07-Seguridad.md

docs/08-Testing.md

docs/10-ManualAdministrador.md

docs/14-DecisionesArquitectonicas.md

docs/15-Riesgos.md

docs/17-CODEX_INSTRUCTIONS.md

docs/18-DEVELOPER_RULES.md

docs/19-IMPLEMENTATION_PLAN.md
```

---

# 6. Principio fundamental

Existe exactamente un:

```text
Resultado oficial vigente.
```

Todos los cálculos utilizan ese resultado.

Nunca utilizar:

- resultados provisionales,
- cálculos cliente,
- datos cacheados.

---

# 7. Fuente de verdad

Para procesar utilizar únicamente:

```text
Resultado oficial

+

Prediction

+

Reglas deportivas

+

Multiplicador
```

Nunca utilizar:

```text
Standing
```

como entrada.

Standing siempre es una consecuencia.

---

# 8. Procesamiento

Un partido se procesa exactamente una vez.

Después del procesamiento:

```text
PROCESSED
```

---

# 9. Flujo completo

```text
Validar sesión

↓

Validar rol

↓

Validar partido

↓

Validar estado

↓

Guardar resultado

↓

Obtener pronósticos

↓

Calcular puntuación

↓

Guardar PredictionScore

↓

Actualizar Standing

↓

Crear Snapshot

↓

Auditar

↓

Commit
```

---

# 10. Transacción

Toda la operación debe ejecutarse dentro de:

```text
Una única transacción.
```

Nunca permitir:

```text
Resultado guardado

↓

Standing sin actualizar.
```

---

# 11. TASK-068

Este caso de uso debe ser el único autorizado para:

```text
Procesar un partido.
```

No crear varios servicios diferentes.

Preferir:

```text
ProcessMatchResultService
```

---

# 12. Entrada

Debe recibir:

```text
Match

Resultado oficial

Actor
```

No necesita:

- navegador,
- React,
- cookies.

---

# 13. Validaciones

Antes de procesar verificar:

- sesión,
- rol,
- partido existente,
- partido no cancelado,
- partido no procesado,
- estado válido,
- marcador válido.

---

# 14. Marcador oficial

Debe validar:

```text
>=0

enteros
```

Nunca:

```text
2.5

-1

texto
```

---

# 15. Resultado oficial

Debe persistirse antes del cálculo.

Nunca calcular utilizando únicamente el input recibido.

---

# 16. Predictions

Después de guardar resultado:

Consultar:

```text
Prediction

WHERE

matchId
```

No utilizar cache.

---

# 17. Puntuación

Cada Prediction debe pasar por:

```text
calculatePredictionScore()
```

No duplicar lógica.

Nunca recalcular manualmente.

---

# 18. PredictionScore

Guardar:

- tipo,
- puntos base,
- multiplicador,
- puntos finales.

No guardar únicamente puntos.

---

# 19. Standing

Actualizar:

- puntos,
- exactos,
- parciales.

Nunca modificar directamente posición.

La posición se deriva del orden.

---

# 20. Orden

Orden oficial:

```text
Puntos DESC

↓

Exactos DESC
```

No usar:

```text
Parciales
```

como desempate.

---

# 21. Posiciones

Empates:

```text
1

2

2

4
```

Nunca:

```text
1

2

2

3
```

---

# 22. Snapshot

Después de recalcular:

Crear snapshot.

No antes.

---

# 23. Auditoría

Registrar:

- actor,
- partido,
- resultado,
- request id,
- fecha.

Nunca registrar:

- secretos,
- cookies,
- tokens.

---

# 24. Commit

Únicamente después de:

```text
Standing actualizado.
```

---

# 25. TASK-069

Debe impedir:

```text
Dos administradores

↓

Procesando el mismo partido.
```

---

# 26. Estrategias válidas

Puede utilizar:

- lock,
- versión,
- update condicional,
- transaction.

Nunca confiar únicamente en:

```text
Botón deshabilitado.
```

---

# 27. Resultado esperado

Dos solicitudes simultáneas deben terminar con:

```text
1 éxito

1 conflicto
```

Nunca:

```text
dos procesos exitosos.
```

---

# 28. Estado parcial

Nunca permitir:

```text
PredictionScore duplicado.
```

---

# 29. TASK-070

Procesar nuevamente el mismo partido debe producir:

```text
Resultado idéntico.
```

No duplicar:

- PredictionScore,
- Standing,
- Snapshot.

---

# 30. Idempotencia

Si la segunda solicitud contiene exactamente el mismo resultado:

Debe responder de forma segura.

No alterar información.

---

# 31. Resultado distinto

Si intenta procesarse nuevamente con otro marcador:

Debe rechazarse.

La corrección pertenece a:

```text
TASK-074
```

---

# 32. Estados

Procesar únicamente:

```text
FINISHED_PENDING
```

o equivalente documentado.

Nunca:

```text
CANCELLED

SUSPENDED

PROCESSED
```

---

# 33. Concurrencia + Idempotencia

Ambas deben coexistir.

No basta con una.

---

# 34. Performance

No consultar Prediction una por una.

Preferir:

```text
Consulta única.

↓

Procesamiento.

↓

Persistencia eficiente.
```

---

# 35. Dominio

El dominio solamente calcula.

Nunca:

- consulta Prisma,
- envía correo,
- conoce React.

---

# 36. Errores funcionales

Ejemplos:

```text
MATCH_ALREADY_PROCESSED

MATCH_CANCELLED

MATCH_NOT_READY

INVALID_RESULT

CONCURRENT_PROCESSING

PROCESSING_FAILED
```

---

# 37. Pruebas mínimas

TASK-068

- proceso correcto,
- partido inexistente,
- cancelado,
- ya procesado,
- doble,
- empate,
- sin pronóstico.

TASK-069

- dos administradores,
- lock,
- conflicto.

TASK-070

- doble ejecución,
- resultado idéntico,
- resultado distinto.

---

# 38. Errores comunes

Nunca hacer:

## Error 1

Actualizar Standing antes de guardar PredictionScore.

---

## Error 2

Procesar fuera de transacción.

---

## Error 3

Modificar posición directamente.

---

## Error 4

Duplicar cálculo.

---

## Error 5

Procesar partido cancelado.

---

## Error 6

Procesar utilizando datos cacheados.

---

## Error 7

No controlar concurrencia.

---

## Error 8

Aceptar segundo resultado diferente.

---

## Error 9

Actualizar parcialmente.

---

## Error 10

Guardar puntos sin guardar tipo.

---

# 39. Criterios de salida

La Parte 1 queda completa cuando:

- existe ProcessMatchResultService,
- procesamiento transaccional,
- PredictionScore correcto,
- Standing actualizado,
- concurrencia controlada,
- idempotencia,
- snapshot preparado,
- auditoría preparada,
- pruebas pasan,
- lint pasa,
- build pasa.

---

# 40. Prompt base

```text
Implementa únicamente TASK-068.

No implementes UI.

No implementes recalculo.

No implementes corrección.

Implementa solamente el procesamiento oficial.

Agregar pruebas.

Ejecutar:

lint

typecheck

tests

build
```

---

# 41. Conclusión

El procesamiento oficial constituye el punto de mayor responsabilidad del sistema.

Cada ejecución debe producir exactamente el mismo resultado para un mismo conjunto de datos, sin duplicaciones, sin efectos secundarios y sin estados intermedios visibles.

La prioridad absoluta de esta fase es garantizar consistencia transaccional, reproducibilidad e integridad deportiva.

# Results Processing Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Procesamiento de resultados y clasificación  
**Parte:** 2 de 2  
**Tareas principales:** TASK-071 a TASK-077  
**Tipo:** Prompt maestro de fase

---

# 42. Finalidad de esta parte

Esta parte completa el ciclo deportivo del sistema.

Después del procesamiento oficial deben existir:

```text
Resultado oficial

↓

PredictionScore

↓

Standing

↓

Snapshot

↓

Clasificación pública

↓

Resultados públicos

↓

Corrección controlada

↓

Recalculo completo
```

---

# 43. TASK-071 — UI de procesamiento

La interfaz de procesamiento está destinada únicamente a:

```text
ADMIN

SUPER_ADMIN
```

Nunca debe estar disponible para:

```text
USER
```

---

## 43.1 Objetivo

Permitir ingresar:

```text
Resultado oficial
```

y ejecutar exactamente un procesamiento.

---

## 43.2 Información mostrada

Antes del procesamiento mostrar:

- Jornada.
- Partido.
- Equipos.
- Fecha.
- Estado.
- Cantidad de pronósticos recibidos.

Nunca mostrar:

- Marcadores de otros participantes.
- Predicciones individuales.

---

## 43.3 Formulario

Campos:

```text
Goles Local

Goles Visitante
```

Botón:

```text
Procesar Resultado
```

---

## 43.4 Confirmación

Antes de ejecutar:

```text
Este proceso actualizará
la clasificación oficial.

¿Desea continuar?
```

---

## 43.5 Durante procesamiento

Mostrar:

```text
Procesando...
```

Deshabilitar:

- botón,
- inputs.

---

## 43.6 Resultado

Mostrar:

- éxito,
- cantidad de pronósticos procesados,
- duración,
- requestId.

Nunca mostrar stack traces.

---

# 44. TASK-072 — Clasificación pública

La clasificación es pública únicamente después del procesamiento.

---

## 44.1 Columnas

Mostrar:

```text
Posición

Nickname

Parciales

Exactos

Puntos

Tendencia
```

No mostrar:

- correo,
- nombre,
- apellido,
- identificadores internos.

---

## 44.2 Orden

Orden obligatorio:

```text
Puntos DESC

↓

Exactos DESC
```

Nunca usar:

```text
Nickname
```

como desempate deportivo.

Solo para mantener orden visual estable.

---

## 44.3 Tendencia

Mostrar:

```text
↑

↓

→

NEW
```

según la regla de dominio.

Nunca recalcular en UI.

---

## 44.4 Empates

Mostrar:

```text
1

2

2

4
```

No ranking denso.

---

## 44.5 Responsive

Desktop:

Tabla.

Mobile:

Cards.

---

## 44.6 Caché

Puede cachearse prudentemente.

Revalidar después de:

```text
ProcessMatchResult

Correction

Recalculation
```

---

# 45. TASK-073 — Resultados públicos

Después del procesamiento mostrar:

- resultado oficial,
- pronóstico,
- puntos,
- tipo.

Antes del procesamiento:

No mostrar:

```text
EXACT

PARTIAL

WRONG
```

---

## 45.1 Orden

Ordenar:

```text
Nickname
```

No por puntos.

---

## 45.2 Información

Cada fila:

```text
Nickname

Pronóstico

Resultado

Tipo

Puntos
```

---

## 45.3 Sin Prediction

Mostrar claramente:

```text
Sin pronóstico
```

No mostrar:

```text
0-0
```

---

# 46. TASK-074 — Corrección

Esta es una operación extraordinaria.

Solo:

```text
SUPER_ADMIN
```

---

## 46.1 Objetivo

Corregir un resultado oficial incorrecto.

Nunca editar Prediction.

Nunca editar PredictionScore manualmente.

---

## 46.2 Flujo

```text
Validar SUPER_ADMIN

↓

Reautenticar

↓

Guardar nuevo resultado

↓

Nueva versión

↓

Recalcular partido

↓

Recalcular standings

↓

Snapshot

↓

Auditoría

↓

Commit
```

---

## 46.3 Reautenticación

Solicitar password nuevamente.

No reutilizar únicamente la sesión.

---

## 46.4 Versionado

No sobrescribir.

Crear:

```text
MatchResult v2
```

El anterior permanece histórico.

---

## 46.5 Auditoría

Registrar:

- resultado anterior,
- resultado nuevo,
- motivo,
- actor.

---

## 46.6 Pruebas

- SUPER_ADMIN,
- ADMIN rechazado,
- nueva versión,
- standings modificados,
- auditoría,
- password requerida.

---

# 47. TASK-075 — Vista previa de recalculo

No modifica datos.

Solo simula.

---

## 47.1 Objetivo

Comparar:

```text
Actual

↓

Recalculado
```

---

## 47.2 Mostrar

Para cada participante:

- puntos actuales,
- puntos nuevos,
- diferencia,
- posición actual,
- posición nueva.

---

## 47.3 No guardar

Nunca escribir en base.

---

# 48. TASK-076 — Recalculo

El recalculo reconstruye completamente la temporada.

---

## 48.1 Fuente de verdad

```text
SeasonParticipant

+

Prediction

+

MatchResult

+

Reglas

+

Multiplicador
```

Nunca:

```text
Standing
```

---

## 48.2 Flujo

```text
Eliminar Standing lógico

↓

Procesar todos los partidos

↓

Reconstruir PredictionScore

↓

Reconstruir Standing

↓

Snapshot

↓

Auditoría

↓

Commit
```

---

## 48.3 Transacción

Debe ejecutarse completamente.

Nunca:

```text
Standing parcial.
```

---

## 48.4 Idempotencia

Ejecutar dos veces produce:

```text
exactamente el mismo resultado.
```

---

## 48.5 Rendimiento

Procesar por:

```text
scheduledAt
```

No por jornada.

---

## 48.6 Integridad

Al finalizar:

```text
PredictionScore

=

Standing

=

Snapshots
```

---

## 48.7 Pruebas

- temporada completa,
- sin partidos,
- partidos cancelados,
- empate,
- doble,
- idempotencia.

---

# 49. TASK-077 — UI de recalculo

Solo:

```text
SUPER_ADMIN
```

---

## 49.1 Mostrar

Antes:

```text
Vista previa.
```

Después:

```text
Confirmación.
```

---

## 49.2 Confirmación

```text
Este proceso reconstruirá toda la clasificación.

¿Continuar?
```

---

## 49.3 Resultado

Mostrar:

- partidos,
- PredictionScore,
- Standing,
- tiempo,
- requestId.

---

# 50. Snapshots

Cada procesamiento genera:

```text
StandingSnapshot
```

Nunca reutilizar snapshots.

---

## 50.1 Utilidad

Permite:

- tendencia,
- histórico,
- auditoría.

---

# 51. Auditoría

Registrar:

```text
PROCESS_MATCH

CORRECT_RESULT

RECALCULATE
```

Nunca registrar:

- passwords,
- tokens.

---

# 52. Concurrencia

Nunca permitir:

```text
Procesamiento

↓

Recalculo
```

al mismo tiempo.

Utilizar:

```text
OperationalLock
```

o equivalente.

---

# 53. Errores comunes

Nunca:

## Error 11

Modificar Standing manualmente.

---

## Error 12

Editar PredictionScore.

---

## Error 13

Corregir resultado sin versión.

---

## Error 14

Recalcular usando Standing.

---

## Error 15

Permitir ADMIN corregir.

---

## Error 16

Mostrar clasificación antes del procesamiento.

---

## Error 17

No generar Snapshot.

---

## Error 18

No bloquear concurrencia.

---

## Error 19

Procesar partidos fuera de orden cronológico.

---

## Error 20

No auditar correcciones.

---

# 54. Pruebas completas

Unitarias

- clasificación,
- snapshot,
- recalculo,
- diferencias.

Integración

- procesamiento,
- corrección,
- recalculo.

API

- permisos,
- concurrencia.

E2E

- procesamiento,
- clasificación,
- corrección,
- recalculo.

---

# 55. Ejemplo TASK-071

```text
Implementa únicamente TASK-071.

Crear únicamente la UI.

No modificar dominio.

No modificar scoring.

No modificar standings.

Agregar pruebas de componente.
```

---

# 56. Ejemplo TASK-072

```text
Implementa únicamente TASK-072.

Utilizar Standing existente.

No recalcular.

No modificar puntos.

Crear únicamente consulta y UI.
```

---

# 57. Ejemplo TASK-073

```text
Implementa únicamente TASK-073.

Mostrar PredictionScore.

Nunca mostrar puntos antes del procesamiento.

Agregar pruebas.
```

---

# 58. Ejemplo TASK-074

```text
Implementa únicamente TASK-074.

Solo SUPER_ADMIN.

Reautenticación obligatoria.

Versionar MatchResult.

No sobrescribir.

Agregar auditoría.
```

---

# 59. Ejemplo TASK-075

```text
Implementa únicamente TASK-075.

No modificar datos.

Solo simular.

Comparar standings.

Agregar pruebas.
```

---

# 60. Ejemplo TASK-076

```text
Implementa únicamente TASK-076.

Reconstruir completamente.

No utilizar Standing como entrada.

Agregar pruebas de idempotencia.
```

---

# 61. Ejemplo TASK-077

```text
Implementa únicamente TASK-077.

Crear UI.

No mover reglas.

Mostrar preview.

Mostrar confirmación.
```

---

# 62. Criterios finales

La fase queda completa cuando:

- procesamiento funciona,
- clasificación pública correcta,
- resultados públicos correctos,
- corrección versionada,
- recalculo reproduce exactamente,
- snapshots correctos,
- auditoría completa,
- concurrencia protegida,
- pruebas pasan,
- lint pasa,
- build pasa.

---

# 63. Conclusión

Esta fase define oficialmente el resultado deportivo de la competencia.

Toda la lógica implementada aquí debe garantizar que un mismo conjunto de datos produzca siempre exactamente la misma clasificación, independientemente del número de veces que se procese o recalcule.

Las operaciones de procesamiento, corrección y recalculo son las de mayor impacto del sistema y deben priorizar siempre la consistencia transaccional, la trazabilidad histórica y la reproducibilidad sobre cualquier optimización o conveniencia técnica.