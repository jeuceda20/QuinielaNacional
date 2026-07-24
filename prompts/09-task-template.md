# Task Execution Template for Codex

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Tipo:** Plantilla reutilizable para ejecución de tareas  
**Aplicación:** Una única tarea de `docs/19-IMPLEMENTATION_PLAN.md` por ejecución

---

# 1. Propósito

Esta plantilla se utiliza para solicitar a Codex la implementación de una tarea específica del plan de implementación.

Debe combinarse siempre con:

```text
prompts/00-global-context.md
```

y, cuando corresponda, con el prompt de fase relacionado.

Ejemplo:

```text
prompts/04-predictions.md
```

La regla principal es:

```text
Una ejecución = una tarea
```

No utilizar esta plantilla para solicitar la implementación simultánea de múltiples tareas.

---

# 2. Instrucción de uso

Reemplaza todos los valores entre:

```text
[CORCHETES]
```

antes de enviar el prompt a Codex.

No dejes secciones sin completar.

Cuando una sección no aplique, escribe:

```text
No aplica.
```

---

# 3. Prompt reutilizable

```text
PROYECTO:
Quiniela Nacional La Goleada – Kickoff

TAREA:
[TASK-XXX — NOMBRE EXACTO DE LA TAREA]

PRIORIDAD:
[P0 / P1 / P2 / P3]

FASE:
[NOMBRE DE LA FASE DE IMPLEMENTACIÓN]

OBJETIVO:
[DESCRIBIR EL RESULTADO CONCRETO QUE DEBE QUEDAR IMPLEMENTADO]

CONTEXTO OBLIGATORIO:
Antes de modificar código, lee y aplica:

- prompts/00-global-context.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

PROMPT DE FASE:
[ARCHIVO DE PROMPT DE FASE O "No aplica"]

DOCUMENTOS FUNCIONALES OBLIGATORIOS:
- [DOCUMENTO 1]
- [DOCUMENTO 2]
- [DOCUMENTO 3]

DOCUMENTOS TÉCNICOS OBLIGATORIOS:
- [DOCUMENTO 1]
- [DOCUMENTO 2]
- [DOCUMENTO 3]

DEPENDENCIAS DE LA TAREA:
- [TASK-XXX]
- [TASK-XXX]

Confirma mediante inspección del repositorio que estas dependencias estén implementadas.

Si una dependencia obligatoria no existe o está incompleta:

1. No improvises una alternativa.
2. No implementes la dependencia como parte de esta tarea.
3. Informa el bloqueo.
4. Indica qué tarea debe completarse primero.

ALCANCE:
Esta tarea puede crear o modificar únicamente los siguientes módulos, carpetas o archivos:

- [RUTA O MÓDULO]
- [RUTA O MÓDULO]
- [RUTA O MÓDULO]

También puede modificar archivos de configuración estrictamente necesarios para completar esta tarea:

- [ARCHIVO DE CONFIGURACIÓN]
- [ARCHIVO DE CONFIGURACIÓN]

No modifiques archivos fuera de este alcance salvo que exista una dependencia técnica directa e inevitable.

Si necesitas hacerlo:

1. Explica la necesidad.
2. Limita el cambio al mínimo.
3. Inclúyelo en el resumen final.

FUERA DE ALCANCE:
No implementes:

- [FUNCIONALIDAD EXCLUIDA]
- [FUNCIONALIDAD EXCLUIDA]
- [TASK FUTURA EXCLUIDA]

No avances tareas posteriores del plan.

REGLAS DE NEGOCIO APLICABLES:
- [REGLA 1]
- [REGLA 2]
- [REGLA 3]

No copies ni reimplementes una regla que ya exista en otro módulo.

Si la regla ya está implementada, reutilízala.

REQUISITOS FUNCIONALES:
1. [REQUISITO]
2. [REQUISITO]
3. [REQUISITO]

REQUISITOS TÉCNICOS:
1. [REQUISITO]
2. [REQUISITO]
3. [REQUISITO]

REQUISITOS DE SEGURIDAD:
1. [REQUISITO]
2. [REQUISITO]
3. [REQUISITO]

REQUISITOS DE DATOS:
1. [REQUISITO]
2. [REQUISITO]
3. [REQUISITO]

REQUISITOS DE UI/UX:
1. [REQUISITO O "No aplica"]
2. [REQUISITO O "No aplica"]
3. [REQUISITO O "No aplica"]

CONTRATOS:
Respeta los contratos definidos en:

- docs/06-API.md
- [OTRO DOCUMENTO O "No aplica"]

No cambies contratos existentes sin autorización.

ARCHIVOS ESPERADOS:
Se espera crear, modificar o revisar archivos similares a:

- [ARCHIVO ESPERADO]
- [ARCHIVO ESPERADO]
- [ARCHIVO ESPERADO]

Esta lista es orientativa.

Primero inspecciona el repositorio y adapta las rutas a la estructura real sin romper la arquitectura definida.

PRUEBAS OBLIGATORIAS:
Agrega o actualiza las siguientes pruebas:

Unitarias:
- [CASO DE PRUEBA]
- [CASO DE PRUEBA]

Integración:
- [CASO DE PRUEBA O "No aplica"]

API:
- [CASO DE PRUEBA O "No aplica"]

E2E:
- [CASO DE PRUEBA O "No aplica"]

Casos límite:
- [CASO LÍMITE]
- [CASO LÍMITE]

No elimines ni debilites pruebas existentes.

CRITERIOS DE ACEPTACIÓN:
La tarea se considera completa únicamente cuando:

- [CRITERIO VERIFICABLE]
- [CRITERIO VERIFICABLE]
- [CRITERIO VERIFICABLE]
- [CRITERIO VERIFICABLE]

Todos los criterios deben poder comprobarse mediante código, pruebas o inspección objetiva.

RESTRICCIONES:
- Implementa únicamente esta tarea.
- No cambies la arquitectura.
- No cambies reglas de negocio.
- No agregues dependencias sin justificarlo.
- No utilices `any` sin justificación documentada.
- No expongas modelos Prisma directamente.
- No expongas secretos.
- No uses datos de producción.
- No elimines historial.
- No introduzcas SQL directo salvo autorización expresa.
- No dejes TODO críticos.
- No ocultes errores de TypeScript.
- No deshabilites lint o pruebas para conseguir que pase.
- No realices refactorizaciones globales no relacionadas.

INSPECCIÓN PREVIA:
Antes de implementar:

1. Inspecciona la estructura del repositorio.
2. Localiza módulos relacionados.
3. Revisa implementaciones similares.
4. Revisa pruebas existentes.
5. Confirma las dependencias.
6. Identifica posibles conflictos documentales.

PLAN DE IMPLEMENTACIÓN:
Antes de modificar archivos, presenta un plan breve con:

1. Archivos a crear.
2. Archivos a modificar.
3. Pruebas a agregar.
4. Riesgos técnicos.
5. Suposiciones mínimas.

No inicies un rediseño arquitectónico.

IMPLEMENTACIÓN:
Después del plan:

1. Implementa el cambio mínimo completo.
2. Reutiliza servicios y reglas existentes.
3. Mantén la separación UI, Application, Domain e Infrastructure.
4. Agrega validación de runtime.
5. Agrega autorización cuando corresponda.
6. Maneja errores de forma tipada.
7. Agrega auditoría cuando corresponda.
8. Agrega o actualiza pruebas.
9. Revisa seguridad y exposición de datos.

COMANDOS DE VALIDACIÓN:
Ejecuta, como mínimo, los comandos aplicables:

- npm run format:check
- npm run lint
- npm run typecheck
- npm test
- npm run build

Cuando corresponda:

- npm run test:integration
- npm run test:e2e
- npx prisma validate
- npx prisma generate

Si el proyecto utiliza comandos distintos, inspecciona `package.json` y usa los comandos reales equivalentes.

No afirmes que un comando pasó si no fue ejecutado.

Si no puedes ejecutar alguno:

1. Indícalo claramente.
2. Explica el motivo.
3. Informa qué falta para ejecutarlo.

FORMATO DE RESPUESTA FINAL:

## Resumen

[DESCRIPCIÓN BREVE DE LO IMPLEMENTADO]

## Archivos creados

- [ARCHIVO]
- [ARCHIVO]

## Archivos modificados

- [ARCHIVO]
- [ARCHIVO]

## Pruebas agregadas o actualizadas

- [PRUEBA]
- [PRUEBA]

## Comandos ejecutados

- `[COMANDO]` — [RESULTADO]
- `[COMANDO]` — [RESULTADO]

## Criterios de aceptación

- [x] [CRITERIO CUMPLIDO]
- [x] [CRITERIO CUMPLIDO]
- [ ] [CRITERIO NO CUMPLIDO Y MOTIVO]

## Decisiones o supuestos

- [DECISIÓN O "Ninguno"]

## Pendientes o bloqueos

- [PENDIENTE O "Ninguno"]

## Riesgos detectados

- [RIESGO O "Ninguno"]

No presentes como completa una tarea con criterios pendientes.
```

---

# 4. Versión corta para tareas simples

Utiliza esta versión únicamente cuando la tarea sea pequeña, autocontenida y sin cambios críticos de seguridad o datos.

```text
Implementa únicamente [TASK-XXX] de docs/19-IMPLEMENTATION_PLAN.md.

Lee primero:

- prompts/00-global-context.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md
- [DOCUMENTOS RELACIONADOS]

Objetivo:

[OBJETIVO]

Alcance:

- [MÓDULO O ARCHIVOS]

Fuera de alcance:

- [EXCLUSIONES]

Criterios de aceptación:

- [CRITERIO]
- [CRITERIO]
- [CRITERIO]

Pruebas requeridas:

- [PRUEBA]
- [PRUEBA]

Restricciones:

- No implementes tareas adicionales.
- No cambies arquitectura ni reglas de negocio.
- Reutiliza código existente.
- No uses `any` sin justificación.
- No expongas secretos.
- No elimines ni debilites pruebas existentes.

Antes de modificar código:

1. Inspecciona el repositorio.
2. Verifica dependencias.
3. Presenta un plan breve.

Al terminar ejecuta los comandos aplicables:

- npm run lint
- npm run typecheck
- npm test
- npm run build

Informa:

- Resumen.
- Archivos creados.
- Archivos modificados.
- Pruebas.
- Comandos ejecutados y resultados.
- Pendientes o bloqueos.
```

---

# 5. Plantilla de continuación

Utiliza esta variante cuando una tarea haya quedado incompleta en una ejecución anterior.

```text
Continúa únicamente con [TASK-XXX].

Lee:

- prompts/00-global-context.md
- prompts/09-task-template.md
- docs/19-IMPLEMENTATION_PLAN.md
- [PROMPT DE FASE]
- [DOCUMENTOS RELACIONADOS]

Contexto de la ejecución anterior:

[RESUMEN EXACTO]

Archivos ya modificados:

- [ARCHIVO]
- [ARCHIVO]

Comandos ya ejecutados:

- [COMANDO Y RESULTADO]

Pendientes confirmados:

- [PENDIENTE]
- [PENDIENTE]

Objetivo de esta ejecución:

[OBJETIVO LIMITADO]

No repitas cambios ya completados.

Antes de modificar:

1. Inspecciona el estado actual del repositorio.
2. Verifica que el resumen anterior coincida con el código.
3. Identifica cambios parciales o inconsistentes.
4. Presenta un plan breve de continuación.

No avances a tareas posteriores.

Al terminar, utiliza el formato de respuesta final definido en
prompts/09-task-template.md.
```

---

# 6. Plantilla de corrección

Utiliza esta variante para corregir un defecto sin ampliar funcionalidad.

```text
Corrige el defecto [ID O NOMBRE] relacionado con [TASK-XXX].

Lee:

- prompts/00-global-context.md
- docs/04-ReglasNegocio.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- [DOCUMENTOS RELACIONADOS]

Comportamiento actual:

[DESCRIPCIÓN REPRODUCIBLE]

Comportamiento esperado:

[DESCRIPCIÓN REPRODUCIBLE]

Pasos para reproducir:

1. [PASO]
2. [PASO]
3. [PASO]

Evidencia:

[ERROR, REQUEST ID O RESULTADO DE PRUEBA]

Alcance permitido:

- [MÓDULO]
- [ARCHIVOS]

Fuera de alcance:

- Nuevas funcionalidades.
- Refactorizaciones globales.
- Cambios arquitectónicos.
- Cambios de reglas.

Requisitos:

1. Identifica la causa raíz.
2. Agrega una prueba que falle antes de la corrección.
3. Aplica el cambio mínimo.
4. Confirma que la prueba pase.
5. Ejecuta regresión relacionada.
6. No elimines validaciones o pruebas existentes.

Criterios de aceptación:

- El defecto no puede reproducirse.
- Existe prueba de regresión.
- No se rompe el comportamiento relacionado.
- Lint y typecheck pasan.
- Las pruebas aplicables pasan.

Utiliza el formato de respuesta final definido en
prompts/09-task-template.md.
```

---

# 7. Plantilla de revisión sin cambios

Utiliza esta variante cuando se requiera analizar código antes de autorizar una implementación.

```text
Revisa [TASK-XXX O MÓDULO] sin modificar archivos.

Lee:

- prompts/00-global-context.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md
- [DOCUMENTOS RELACIONADOS]

Objetivo de la revisión:

[OBJETIVO]

Analiza:

- Cumplimiento funcional.
- Cumplimiento arquitectónico.
- Seguridad.
- Validación.
- Autorización.
- Exposición de datos.
- Transacciones.
- Concurrencia.
- Pruebas.
- Deuda técnica.
- Documentación.

Entrega:

## Resumen ejecutivo

## Hallazgos críticos

## Hallazgos altos

## Hallazgos medios

## Hallazgos bajos

## Pruebas faltantes

## Documentación inconsistente

## Recomendación

No modifiques código.

No inventes hallazgos.

Incluye rutas y referencias concretas.
```

---

# 8. Plantilla de revisión de Pull Request

```text
Revisa el Pull Request relacionado con [TASK-XXX].

Contexto obligatorio:

- prompts/00-global-context.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md
- [PROMPT DE FASE]
- [DOCUMENTOS RELACIONADOS]

Alcance declarado del PR:

[ALCANCE]

Archivos modificados:

[LISTA O INSTRUCCIÓN PARA INSPECCIONAR EL DIFF]

Verifica:

1. El PR implementa únicamente la tarea declarada.
2. Respeta reglas de negocio.
3. Respeta arquitectura.
4. No duplica lógica.
5. Valida entradas.
6. Aplica autorización.
7. No expone datos sensibles.
8. Usa transacciones cuando corresponde.
9. Maneja concurrencia.
10. Incluye pruebas.
11. No debilita pruebas existentes.
12. No introduce dependencias innecesarias.
13. No deja TODO críticos.
14. Mantiene documentación consistente.

Formato:

## Resultado

APPROVE

o

REQUEST CHANGES

## Bloqueantes

## Observaciones no bloqueantes

## Pruebas faltantes

## Riesgos

## Archivos y líneas relevantes

No modifiques el código durante esta revisión.
```

---

# 9. Reglas para completar la plantilla

## 9.1 Objetivos concretos

Correcto:

```text
Implementar una función pura que clasifique un pronóstico como
EXACT, PARTIAL, WRONG o NO_PREDICTION y calcule los puntos aplicando
el multiplicador del partido.
```

Incorrecto:

```text
Hacer el scoring.
```

---

## 9.2 Alcance explícito

Correcto:

```text
src/modules/scoring/domain/
tests/unit/scoring/
```

Incorrecto:

```text
Todo lo necesario.
```

---

## 9.3 Criterios verificables

Correcto:

```text
Un pronóstico 2-1 contra un resultado 2-1 devuelve EXACT y 3 puntos.
```

Incorrecto:

```text
La puntuación funciona bien.
```

---

## 9.4 Fuera de alcance

Cada tarea deberá indicar qué no debe implementarse.

Ejemplo:

```text
No crear todavía repositorios Prisma.
No crear UI.
No implementar procesamiento de partidos.
```

Esto evita que Codex adelante fases.

---

## 9.5 Dependencias

No listar únicamente paquetes técnicos.

Listar las tareas del plan que deben estar terminadas.

Ejemplo:

```text
TASK-017 — Implementar cálculo de desenlace.
```

---

## 9.6 Pruebas

Las pruebas deberán describir comportamientos.

Correcto:

```text
Debe rechazar un pronóstico enviado exactamente en predictionClosesAt.
```

Incorrecto:

```text
Agregar tests.
```

---

# 10. Ejemplo completo — TASK-018

```text
PROYECTO:
Quiniela Nacional La Goleada – Kickoff

TAREA:
TASK-018 — Implementar cálculo de puntuación

PRIORIDAD:
P0

FASE:
Fase 3 — Dominio puro

OBJETIVO:
Implementar una función pura que evalúe un pronóstico contra un
resultado oficial y devuelva el tipo de acierto, puntos base,
multiplicador y puntos otorgados.

CONTEXTO OBLIGATORIO:
Antes de modificar código, lee y aplica:

- prompts/00-global-context.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

PROMPT DE FASE:
prompts/05-results.md

DOCUMENTOS FUNCIONALES OBLIGATORIOS:
- docs/04-ReglasNegocio.md
- docs/16-Glosario.md

DOCUMENTOS TÉCNICOS OBLIGATORIOS:
- docs/02-Arquitectura.md
- docs/08-Testing.md
- docs/14-DecisionesArquitectonicas.md

DEPENDENCIAS DE LA TAREA:
- TASK-017 — Implementar cálculo de desenlace

ALCANCE:
- src/modules/scoring/domain/
- tests/unit/scoring/

FUERA DE ALCANCE:
- Persistencia Prisma.
- Procesamiento de resultados.
- Actualización de clasificación.
- UI.
- API.
- Auditoría.

REGLAS DE NEGOCIO APLICABLES:
- Exacto = 3 puntos.
- Parcial = 1 punto.
- Incorrecto = 0 puntos.
- Sin pronóstico = 0 puntos.
- Partido doble multiplica por 2.
- Un pronóstico 0-0 es válido.

REQUISITOS FUNCIONALES:
1. Clasificar EXACT, PARTIAL, WRONG y NO_PREDICTION.
2. Calcular puntos base.
3. Aplicar el multiplicador.
4. Devolver un resultado tipado.

REQUISITOS TÉCNICOS:
1. Función pura.
2. Sin dependencias de React.
3. Sin dependencias de Prisma.
4. Reutilizar getMatchOutcome() de TASK-017.
5. No usar números mágicos sin constantes o configuración explícita.

REQUISITOS DE SEGURIDAD:
No aplica directamente, pero la función no debe aceptar valores
inválidos silenciosamente.

REQUISITOS DE DATOS:
1. Los goles deben ser enteros no negativos.
2. La ausencia de pronóstico debe representarse explícitamente.
3. No confundir 0-0 con ausencia de pronóstico.

REQUISITOS DE UI/UX:
No aplica.

CONTRATOS:
No aplica.

PRUEBAS OBLIGATORIAS:

Unitarias:
- Exacto normal.
- Exacto doble.
- Parcial local.
- Parcial visitante.
- Parcial empate.
- Parcial doble.
- Incorrecto.
- Sin pronóstico.
- Pronóstico 0-0 exacto.

Casos límite:
- Valores negativos rechazados.
- Valores decimales rechazados.
- Multiplicador inválido rechazado.

CRITERIOS DE ACEPTACIÓN:
- 2-1 contra 2-1 devuelve EXACT y 3 puntos.
- 2-1 contra 2-1 con multiplicador 2 devuelve 6 puntos.
- 1-0 contra 3-2 devuelve PARTIAL y 1 punto.
- 1-1 contra 2-2 devuelve PARTIAL.
- 2-0 contra 0-1 devuelve WRONG y 0 puntos.
- Ausencia de pronóstico devuelve NO_PREDICTION y 0 puntos.
- 0-0 se evalúa como pronóstico válido.
- Todas las pruebas unitarias pasan.

RESTRICCIONES:
- Implementa únicamente TASK-018.
- No implementes repositorios, servicios de aplicación ni UI.
- No dupliques getMatchOutcome().
- No cambies las reglas oficiales.
- No uses `any`.
- No agregues dependencias.

COMANDOS DE VALIDACIÓN:
- npm run format:check
- npm run lint
- npm run typecheck
- npm test
- npm run build
```

---

# 11. Confirmación de ejecución

Antes de comenzar, Codex deberá entender:

```text
Estoy ejecutando una única tarea.

El contexto global es obligatorio.

El prompt de fase no amplía el alcance de la tarea.

Los documentos son la fuente de verdad.

No implementaré dependencias faltantes de forma implícita.

No afirmaré que la tarea está completa si quedan criterios pendientes.
```

---

# 12. Conclusión

Esta plantilla convierte cada tarea del plan en una instrucción:

- Limitada.
- Verificable.
- Reproducible.
- Auditable.
- Segura.

Su objetivo es evitar prompts ambiguos como:

```text
Haz el módulo de usuarios.
```

y reemplazarlos por solicitudes controladas que indiquen:

```text
Qué implementar.
Qué documentos leer.
Qué archivos modificar.
Qué no implementar.
Qué pruebas ejecutar.
Cómo demostrar que la tarea quedó terminada.
```

Todas las tareas de implementación deberán utilizar esta plantilla o una variante equivalente que conserve el mismo nivel de precisión.