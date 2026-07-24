# Predictions Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Pronósticos y privacidad deportiva  
**Parte:** 1 de 2  
**Tareas principales:** TASK-062 a TASK-063 (inicio de TASK-064)  
**Tipo:** Prompt maestro de fase

---

# 1. Propósito

Este documento define el contexto específico para implementar el módulo de pronósticos.

Esta fase representa el núcleo funcional de la aplicación.

Un error aquí afecta directamente:

- justicia deportiva,
- privacidad,
- puntuación futura,
- clasificación,
- confianza de los participantes.

Por esa razón todas las reglas deben implementarse exactamente como están documentadas.

Nunca simplificarlas.

Nunca reinterpretarlas.

---

# 2. Uso obligatorio

Este prompt siempre debe utilizarse junto con:

```text
prompts/00-global-context.md
prompts/09-task-template.md
docs/19-IMPLEMENTATION_PLAN.md
```

Ejemplo:

```text
Lee:

prompts/00-global-context.md

prompts/04-predictions.md

prompts/09-task-template.md

Implementa únicamente TASK-062.
```

---

# 3. Tareas cubiertas

Esta fase cubre:

```text
TASK-062
Guardar pronóstico

TASK-063
Editar pronóstico

TASK-064 (inicio)
Política de privacidad de pronósticos
```

La segunda parte cubrirá:

- resto de TASK-064
- TASK-065
- TASK-066
- TASK-067

---

# 4. Objetivo funcional

El usuario participante debe poder:

- consultar partidos abiertos,
- registrar un marcador,
- editarlo antes del cierre,
- consultar únicamente su propio pronóstico antes del cierre,
- perder automáticamente la capacidad de edición cuando el servidor cierre el partido.

Nunca debe depender del reloj del navegador.

---

# 5. Documentación obligatoria

Antes de implementar una tarea de esta fase revisar:

```text
docs/01-PRD.md

docs/03-ModeloBaseDatos.md

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

# 6. Principio principal

Un pronóstico representa:

```text
La intención oficial del usuario
antes del inicio del partido.
```

No representa:

- una apuesta,
- una preferencia,
- un voto.

Es un dato histórico.

Una vez cerrado el partido:

```text
el pronóstico ya forma parte
de la competencia.
```

---

# 7. Modelo mental

Cada partido tiene exactamente un estado para efectos del participante.

```text
ABIERTO

↓

CERRADO

↓

PROCESADO
```

El participante solamente puede escribir durante:

```text
ABIERTO
```

---

# 8. Autoridad del tiempo

Nunca utilizar:

```javascript
Date.now()
```

del navegador.

Nunca confiar en:

```javascript
new Date()
```

del cliente.

Toda decisión depende de:

```text
serverNow
```

---

# 9. Regla oficial de cierre

El cierre se calcula como:

```text
predictionClosesAt
=
scheduledAt
-
5 minutos
```

La condición oficial es:

```text
serverNow < predictionClosesAt
```

Si:

```text
serverNow == predictionClosesAt
```

entonces:

```text
CERRADO
```

---

# 10. Consecuencias del cierre

Después del cierre:

No se puede:

- crear,
- editar,
- eliminar,
- reemplazar.

No existen excepciones para usuarios.

Ni siquiera administradores modifican pronósticos mediante el flujo normal.

---

# 11. Un pronóstico por partido

Restricción obligatoria:

```text
userId

+

matchId

=

único
```

No permitir:

```text
dos pronósticos
```

para el mismo partido.

---

# 12. Edición

Mientras el partido esté abierto:

El usuario puede editar:

```text
goles local

goles visitante
```

La edición reemplaza el valor anterior.

No crea historial.

No versiona.

El historial administrativo pertenece a auditoría, no a Prediction.

---

# 13. Goles permitidos

Los goles deben ser:

```text
enteros

>=0
```

Ejemplos válidos:

```text
0-0

1-0

5-4

12-8
```

Ejemplos inválidos:

```text
-1

2.5

null

texto
```

---

# 14. 0-0

Muy importante.

```text
0-0
```

es un pronóstico completamente válido.

Nunca confundir:

```text
0-0
```

con:

```text
sin pronóstico
```

---

# 15. Sin pronóstico

Sin pronóstico significa:

```text
Prediction inexistente
```

No:

```text
Prediction con valores cero
```

---

# 16. Participación

Solo puede pronosticar un usuario que sea:

```text
ACTIVE

+

SeasonParticipant
```

No basta con estar registrado.

---

# 17. Validaciones obligatorias

Antes de guardar un pronóstico verificar:

1.

Existe sesión.

2.

Usuario activo.

3.

Usuario participante.

4.

Partido existente.

5.

Partido abierto.

6.

Marcador válido.

7.

No eliminado.

8.

No cancelado.

9.

No procesado.

10.

Hora del servidor.

---

# 18. Flujo de TASK-062

```text
Validar sesión

↓

Validar usuario

↓

Validar participante

↓

Validar partido

↓

Validar estado

↓

Validar horario

↓

Validar goles

↓

Guardar

↓

Commit

↓

Revalidar cache
```

---

# 19. Upsert

La implementación recomendada es:

```text
UPSERT
```

Conceptualmente:

```text
Si existe

↓

Actualizar

Si no existe

↓

Insertar
```

No crear lógica duplicada.

---

# 20. Transacción

Guardar el pronóstico normalmente requiere una sola escritura.

No crear transacciones innecesarias.

Sí utilizar transacción cuando posteriormente se agreguen operaciones relacionadas.

---

# 21. Request Context

El caso de uso deberá utilizar:

```text
RequestContext
```

para conocer:

- usuario,
- request id,
- rol.

Nunca confiar en:

```text
userId
```

enviado por el cliente.

---

# 22. Auditoría

Guardar un pronóstico normal:

```text
NO
```

genera AuditLog permanente.

Es un flujo esperado.

Puede generar:

- logs operacionales,
- métricas.

La auditoría permanente queda reservada para acciones administrativas.

---

# 23. Rate limiting

Aplicar protección razonable.

Especialmente para:

- guardado masivo,
- automatización,
- abuso.

Nunca impedir que un usuario normal pueda editar varias veces antes del cierre.

---

# 24. Reglas de dominio

El dominio nunca debe conocer:

- React,
- Prisma,
- cookies,
- HTTP.

Debe recibir únicamente:

```typescript
PredictionInput
```

y devolver:

```typescript
PredictionResult
```

---

# 25. Errores funcionales

Ejemplos:

```text
MATCH_NOT_FOUND

MATCH_CLOSED

MATCH_CANCELLED

MATCH_PROCESSED

USER_NOT_PARTICIPANT

INVALID_SCORE

FORBIDDEN
```

Nunca devolver errores Prisma directamente.

---

# 26. TASK-063

Editar utiliza exactamente las mismas reglas que crear.

La diferencia es:

```text
Prediction existente
```

No crear un caso de uso completamente diferente.

Preferir reutilizar:

```text
SavePredictionService
```

con comportamiento idempotente.

---

# 27. Idempotencia

Si el usuario guarda exactamente:

```text
2-1
```

y luego vuelve a guardar:

```text
2-1
```

el resultado final debe seguir siendo:

```text
2-1
```

No generar efectos secundarios.

---

# 28. Concurrencia

Dos solicitudes simultáneas del mismo usuario deben terminar con:

```text
un único pronóstico válido
```

Nunca:

```text
duplicados
```

Utilizar:

- constraint único,
- upsert,
- transacción cuando sea necesario.

---

# 29. Política de privacidad (inicio TASK-064)

Esta es una de las reglas más importantes del sistema.

Antes del cierre:

```text
Cada usuario solamente puede consultar

SU propio pronóstico.
```

Nunca:

```text
los de otros participantes.
```

---

# 30. Privacidad en servidor

No hacer esto:

```text
Consultar todos

↓

filtrar en React
```

Correcto:

```text
Consultar únicamente

Prediction

WHERE

userId = currentUser
```

---

# 31. Administradores

La privacidad también aplica.

Ser administrador NO significa:

```text
ver pronósticos antes del cierre
```

Si el administrador participa en la competencia:

también debe esperar el cierre.

Las herramientas extraordinarias pertenecen a diagnóstico y no a la aplicación normal.

---

# 32. API

Nunca devolver:

```json
[
  {
    "userId":"otro",
    "homeGoals":2,
    "awayGoals":1
  }
]
```

antes del cierre.

La respuesta debe contener únicamente:

```json
{
  "prediction":{
      ...
  }
}
```

del usuario autenticado.

---

# 33. Caché

Durante esta fase asumir:

```text
private

no-store
```

para información privada.

La estrategia completa de caché se desarrolla en la Parte 2.

---

# 34. Pruebas mínimas

TASK-062

- guardar válido,
- actualizar válido,
- partido cerrado,
- partido inexistente,
- usuario sin temporada,
- goles negativos,
- goles decimales,
- 0-0,
- duplicado concurrente.

TASK-063

- editar abierto,
- editar cerrado,
- editar procesado,
- guardar mismo valor,
- edición concurrente.

TASK-064 (inicio)

- usuario solo ve el suyo,
- otro usuario no visible,
- administrador participante tampoco.

---

# 35. Errores comunes

Nunca hacer:

## Error 1

Usar reloj cliente.

---

## Error 2

Mostrar todos y ocultar con CSS.

---

## Error 3

Permitir editar exactamente al cierre.

---

## Error 4

Confundir:

```text
0-0

=

sin pronóstico
```

---

## Error 5

Crear dos Prediction.

---

## Error 6

Guardar userId recibido por POST.

---

## Error 7

Permitir pronosticar partido cancelado.

---

## Error 8

Permitir partido procesado.

---

## Error 9

Crear un caso de uso distinto para editar.

---

## Error 10

Duplicar reglas deportivas en React.

---

# 36. Criterios de salida de esta parte

La Parte 1 queda completa cuando:

- existe SavePrediction,
- existe edición,
- existe validación completa,
- existe privacidad previa al cierre,
- las reglas utilizan hora del servidor,
- no hay duplicados,
- 0-0 funciona,
- los tests unitarios pasan,
- los tests de integración pasan,
- lint pasa,
- typecheck pasa.

---

# 37. Prompt base

```text
Implementa únicamente TASK-062.

Lee:

- prompts/00-global-context.md
- prompts/04-predictions.md
- prompts/09-task-template.md

No avances TASK-063.

No avances TASK-064.

Implementa únicamente el guardado.

Agrega pruebas.

Ejecuta lint, typecheck, tests y build.

Entrega el formato estándar.
```

---

# 38. Conclusión

Los pronósticos representan el corazón de la competencia.

Toda la lógica de puntuación futura depende de que:

- el momento del cierre sea correcto,
- el participante adecuado pueda guardar,
- nadie pueda modificar después del cierre,
- nadie pueda conocer los pronósticos de otros antes de tiempo.

La prioridad absoluta de esta fase es preservar la integridad deportiva y la privacidad temporal de la competencia.

# Predictions Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Pronósticos y privacidad deportiva  
**Parte:** 2 de 2  
**Tareas principales:** Final de TASK-064, TASK-065, TASK-066 y TASK-067  
**Tipo:** Prompt maestro de fase

---

# 39. Final de TASK-064 — Política de privacidad

La privacidad de los pronósticos es una regla deportiva.

No es únicamente una regla de UI.

Debe aplicarse:

- en consultas,
- en servicios,
- en APIs,
- en Server Actions,
- en componentes.

---

## 39.1 Antes del cierre

Un usuario autenticado únicamente puede consultar:

```text
Su propio pronóstico.
```

Nunca:

- marcador de otro participante,
- cantidad de goles elegida por otro,
- resultado más votado,
- estadísticas agregadas que permitan inferencias.

---

## 39.2 Después del cierre

Después de:

```text
predictionClosesAt
```

todos los participantes autenticados pueden consultar:

- marcador pronosticado,
- nickname,
- equipo favorito cuando corresponda.

Pero todavía NO deben mostrarse:

- puntos,
- tipo de acierto,
- posición modificada.

Hasta:

```text
Match PROCESSED
```

---

## 39.3 Después del procesamiento

Se permite mostrar:

- pronóstico,
- resultado oficial,
- tipo de acierto,
- puntos obtenidos.

---

## 39.4 Consultas

Nunca hacer:

```sql
SELECT *
FROM Prediction
```

para después filtrar en memoria.

Siempre consultar únicamente la información permitida para el usuario actual.

---

## 39.5 APIs

Los endpoints deben comportarse como:

Antes del cierre:

```json
{
  "predictions": [
    {
      "userId": "current-user"
    }
  ]
}
```

Después del cierre:

```json
{
  "predictions": [
    {
      "nickname": "...",
      "homeGoals": 2,
      "awayGoals": 1
    }
  ]
}
```

Antes del procesamiento:

Nunca incluir:

```json
"points": 3
```

---

# 40. TASK-065 — Pendientes

El sistema debe permitir consultar:

```text
Partidos pendientes de pronóstico
```

No significa:

```text
partidos abiertos
```

Significa:

```text
Partidos abiertos

MENOS

los ya pronosticados.
```

---

## 40.1 Flujo

```text
Obtener participante

↓

Partidos abiertos

↓

Excluir Prediction existentes

↓

Ordenar por scheduledAt

↓

Responder
```

---

## 40.2 Orden

Siempre ordenar por:

```text
scheduledAt
```

Nunca por:

```text
round.sequence
```

---

## 40.3 Información mínima

Cada pendiente debe incluir:

- equipos,
- logos,
- jornada,
- fecha,
- hora,
- cierre,
- indicador doble.

No incluir información deportiva futura.

---

## 40.4 Partido doble

Debe mostrarse claramente.

Ejemplo:

```text
⭐ Partido Doble
```

No debe requerir abrir el detalle.

---

## 40.5 Pruebas

- pendiente correcto,
- sin pendientes,
- partido cerrado desaparece,
- partido pronosticado desaparece,
- orden cronológico,
- doble visible.

---

# 41. TASK-066 — UI de pronósticos

La interfaz debe ser extremadamente simple.

El usuario debe poder completar todos sus pronósticos rápidamente.

---

## 41.1 Vista principal

Cada partido deberá mostrar:

```text
Local

Logo

VS

Logo

Visitante
```

Fecha.

Hora.

Cierre.

Indicador doble.

---

## 41.2 Inputs

Dos cajas:

```text
Local

Visitante
```

Aceptar únicamente:

```text
enteros
```

---

## 41.3 Estados

Mostrar claramente:

```text
Abierto

↓

Editable
```

```text
Cerrado

↓

Solo lectura
```

```text
Procesado

↓

Resultado disponible
```

---

## 41.4 Feedback

Guardar debe mostrar:

```text
Pronóstico guardado.
```

Editar:

```text
Pronóstico actualizado.
```

Nunca refrescar toda la página innecesariamente.

---

## 41.5 Accesibilidad

Cada input debe tener:

```text
label
```

No depender únicamente del placeholder.

---

## 41.6 Mobile

La aplicación debe funcionar correctamente en:

```text
320 px
```

Sin scroll horizontal.

---

## 41.7 Estados vacíos

Si no existen partidos abiertos:

Mostrar:

```text
No hay partidos disponibles para pronosticar.
```

---

## 41.8 Errores

Errores esperados:

```text
MATCH_CLOSED

INVALID_SCORE

MATCH_NOT_FOUND

FORBIDDEN
```

Nunca mostrar:

```text
Prisma Error
```

---

## 41.9 UX

El foco debe pasar naturalmente.

Ejemplo:

```text
Local

↓

Visitante

↓

Guardar
```

---

## 41.10 Partido doble

Debe destacarse visualmente.

Nunca mediante texto oculto.

---

## 41.11 Responsive

Desktop:

Cards.

Tablet:

Cards.

Mobile:

Cards verticales.

No utilizar tablas complejas.

---

## 41.12 Skeleton

Mientras carga:

Mostrar skeletons.

No mostrar layout saltando.

---

## 41.13 Pruebas

Componentes:

- render,
- loading,
- vacío,
- abierto,
- cerrado,
- doble,
- error.

E2E:

- guardar,
- editar,
- cierre,
- responsive.

---

# 42. TASK-067 — Caché segura

La privacidad depende también del caché.

---

## 42.1 Información privada

Nunca cachear:

- Prediction propio,
- dashboard,
- perfil.

Utilizar:

```text
no-store
```

---

## 42.2 Información pública

Después del cierre:

Puede cachearse prudentemente.

Nunca durante:

```text
match abierto
```

---

## 42.3 Revalidation

Después de guardar:

Revalidar:

```text
prediction:{matchId}

dashboard

pendingPredictions
```

No invalidar toda la aplicación.

---

## 42.4 Compartición

Nunca compartir:

```text
Prediction A

↓

Usuario B
```

por error de caché.

---

## 42.5 Server Components

Preferir:

```text
Server Components
```

La información privada permanece en servidor.

---

## 42.6 Client Components

Utilizar únicamente para:

- inputs,
- loading,
- UX.

No mover lógica deportiva.

---

# 43. Errores comunes

## Error 11

Mostrar puntos antes del procesamiento.

---

## Error 12

Mostrar todos los pronósticos antes del cierre.

---

## Error 13

Ordenar por jornada.

---

## Error 14

No recalcular cierre tras reprogramación.

---

## Error 15

Guardar utilizando hora cliente.

---

## Error 16

Cachear Prediction.

---

## Error 17

Revalidar toda la aplicación.

---

## Error 18

Mostrar partido doble únicamente en detalle.

---

## Error 19

Permitir editar mediante API aunque la UI esté bloqueada.

---

## Error 20

No validar SeasonParticipant.

---

# 44. Pruebas completas

Unitarias

- SavePrediction
- EditPrediction
- PendingMatches
- VisibilityPolicy
- ClosePolicy

Integración

- Guardado
- Edición
- Concurrencia
- Upsert
- Restricción única

API

- Usuario correcto
- Otro usuario
- Partido cerrado
- Partido inexistente

E2E

- Pronosticar
- Editar
- Ver propio
- No ver otros
- Ver todos tras cierre
- Responsive

---

# 45. Ejemplo TASK-062

```text
Implementa únicamente TASK-062.

No implementes edición.

No implementes UI.

No implementes privacidad.

Implementa únicamente SavePredictionService.

Agregar pruebas.

No usar Prisma fuera del repositorio.
```

---

# 46. Ejemplo TASK-063

```text
Implementa únicamente TASK-063.

Reutiliza SavePredictionService.

No crear EditPredictionService nuevo.

Agregar pruebas de edición.
```

---

# 47. Ejemplo TASK-064

```text
Implementa únicamente TASK-064.

Modificar únicamente consultas.

No modificar scoring.

No modificar resultados.

No modificar standings.

Garantizar:

Antes del cierre:

Solo Prediction propio.

Después del cierre:

Todos.
```

---

# 48. Ejemplo TASK-065

```text
Implementa únicamente TASK-065.

Generar PendingPredictionQuery.

Orden cronológico.

Excluir Prediction existentes.

Agregar pruebas.
```

---

# 49. Ejemplo TASK-066

```text
Implementa únicamente TASK-066.

Crear únicamente UI.

No mover reglas deportivas.

Utilizar Server Components.

Client Components solo para formulario.
```

---

# 50. Ejemplo TASK-067

```text
Implementa únicamente TASK-067.

Revisar estrategia de caché.

Prediction:

no-store

Dashboard:

private

Agregar pruebas de revalidation.
```

---

# 51. Criterios finales de la fase

La fase se considera terminada cuando:

- guardar funciona,
- editar funciona,
- cierre respeta servidor,
- privacidad antes del cierre funciona,
- privacidad después del cierre funciona,
- pendientes funcionan,
- UI responsive,
- doble visible,
- caché seguro,
- no existen fugas de pronósticos,
- pruebas pasan,
- lint pasa,
- build pasa,
- typecheck pasa.

---

# 52. Conclusión

Los pronósticos son el activo más sensible de la aplicación.

La confianza de los participantes depende de cuatro garantías fundamentales:

- Nadie puede pronosticar después del cierre.
- Nadie puede modificar un pronóstico cerrado.
- Nadie puede ver los pronósticos de otros antes del cierre.
- Todos los pronósticos permanecen íntegros hasta el procesamiento oficial.

Cada decisión técnica en este módulo debe priorizar la integridad deportiva, la privacidad temporal y la reproducibilidad del sistema por encima de la conveniencia o la optimización prematura.