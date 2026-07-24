# CODEX INSTRUCTIONS

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Documento:** Instrucciones oficiales para Codex y otros agentes de desarrollo asistido por IA.

---

# 1. Propósito

Este documento contiene las instrucciones oficiales que deberá seguir cualquier agente de IA encargado de implementar el proyecto **Quiniela Nacional La Goleada – Kickoff**.

Estas instrucciones tienen prioridad sobre cualquier interpretación que el agente considere "mejor".

Cuando exista conflicto entre una decisión del agente y este documento, prevalece este documento.

---

# 2. Objetivo del agente

El objetivo NO es escribir la mayor cantidad de código.

El objetivo es construir una aplicación:

- correcta,
- mantenible,
- segura,
- consistente,
- completamente alineada con la documentación.

La velocidad nunca tiene prioridad sobre la calidad.

---

# 3. Regla principal

Nunca inventes comportamiento.

Si una funcionalidad no está documentada:

- no la inventes,
- no la supongas,
- no la improvises.

Debes:

- consultar la documentación,
- reutilizar decisiones existentes,
- o solicitar aclaración.

---

# 4. La documentación es la fuente de verdad

El orden de prioridad es:

```text
17-CODEX_INSTRUCTIONS.md

↓

14-DecisionesArquitectonicas.md

↓

04-ReglasNegocio.md

↓

03-ModeloBaseDatos.md

↓

02-Arquitectura.md

↓

06-API.md

↓

resto de documentos
```

Nunca contradigas la documentación.

---

# 5. No rediseñar el proyecto

No propongas cambiar:

- arquitectura,
- framework,
- ORM,
- autenticación,
- base de datos,
- lenguaje,
- estructura.

Ya fueron elegidos.

---

# 6. Arquitectura congelada

La arquitectura oficial es:

```text
Monolito modular

Next.js App Router

React

TypeScript

Tailwind

PostgreSQL

Prisma

Server Actions

Route Handlers

Cookies HttpOnly
```

No propongas:

- Express
- NestJS
- Firebase
- MongoDB
- Supabase Auth
- NextAuth
- GraphQL
- Microservicios

salvo que exista una nueva ADR.

---

# 7. El dominio manda

Las reglas deportivas tienen prioridad sobre cualquier optimización.

Ejemplo:

Nunca aceptar:

```text
"Podemos mejorar el rendimiento mostrando todos los pronósticos y ocultándolos con CSS."
```

Eso rompe la privacidad.

Debe rechazarse.

---

# 8. Nunca asumir

Nunca asumir:

- horarios,
- puntos,
- reglas,
- estados,
- permisos.

Siempre leer primero:

```text
04-ReglasNegocio.md
```

---

# 9. Nunca duplicar lógica

Una regla debe existir una sola vez.

Ejemplo:

La puntuación exacta debe calcularse únicamente mediante:

```typescript
calculatePredictionScore()
```

No volver a implementarla en:

- API
- UI
- Dashboard
- Testing

---

# 10. Backend primero

Toda regla crítica pertenece al servidor.

Nunca confiar en:

- JavaScript del navegador
- estado visual
- botones deshabilitados
- reloj del cliente

---

# 11. El frontend nunca es confiable

Todo dato recibido desde el cliente debe validarse.

Siempre.

---

# 12. No modificar reglas deportivas

Las siguientes reglas están congeladas:

- exacto = 3

- parcial = 1

- doble = ×2

- cierre = 5 minutos

- desempate por exactos

- posiciones compartidas

- jornada ≠ cronología

No modificarlas.

---

# 13. Priorizar simplicidad

Cuando existan dos soluciones válidas:

Elegir la más simple.

No introducir complejidad innecesaria.

---

# 14. Evitar dependencias

No agregar nuevas dependencias si pueden evitarse.

Antes de instalar una librería preguntarse:

¿Realmente resuelve un problema que no pueda resolverse con el stack actual?

---

# 15. Mantener módulos pequeños

Cada módulo debe tener una responsabilidad clara.

Evitar módulos gigantes.

---

# 16. Escribir código legible

Priorizar:

- claridad
- nombres descriptivos
- funciones pequeñas

Nunca optimizar sacrificando legibilidad.

---

# 17. Evitar comentarios innecesarios

El código debe ser suficientemente claro.

Comentar únicamente:

- reglas deportivas
- decisiones complejas
- casos excepcionales

---

# 18. No escribir código muerto

No implementar:

- funciones "por si acaso"
- parámetros sin usar
- clases vacías
- TODO permanentes

---

# 19. No crear abstracciones prematuras

No crear:

- Factory Factory
- RepositoryFactoryBuilder
- ServiceLocator
- EventBus

si no existe una necesidad real.

---

# 20. Todo debe probarse

Cada regla nueva requiere pruebas.

No implementar primero y probar después.

---

# 21. Testing obligatorio

Cada cambio importante debe incluir:

- Unit Test

o

- Integration Test

o

- E2E

según corresponda.

---

# 22. Nunca romper pruebas existentes

Si una prueba falla:

Primero entender por qué.

No eliminar pruebas para que el proyecto compile.

---

# 23. No romper compatibilidad

Cambios grandes requieren:

- actualización de documentación
- actualización de pruebas
- migraciones

---

# 24. Seguridad por defecto

Toda implementación debe asumir:

- usuarios maliciosos
- clientes modificados
- solicitudes repetidas
- intentos de abuso

---

# 25. SQL

Nunca escribir:

```typescript
"SELECT * FROM User WHERE email='" + email + "'"
```

Usar Prisma.

SQL directo solo cuando esté documentado.

---

# 26. No exponer secretos

Nunca devolver:

- passwordHash
- token
- cookie
- SESSION_SECRET
- DATABASE_URL

---

# 27. No exponer auditoría sensible

Nunca mostrar:

- cookies
- tokens
- passwords
- hashes

---

# 28. Soft Delete

Nunca eliminar físicamente datos importantes.

Utilizar Soft Delete.

---

# 29. Auditoría

Toda acción administrativa importante debe auditarse.

Nunca olvidar crear auditoría.

---

# 30. Recalculo

La clasificación siempre debe poder reconstruirse.

Standing nunca es la fuente de verdad.

---

# 31. Reprogramaciones

Nunca asumir que:

```text
Jornada 5

ocurre antes de

Jornada 10
```

Ordenar por fecha real.

---

# 32. Partido doble

Siempre existe exactamente uno por jornada publicada.

Nunca permitir dos.

---

# 33. Prioridad de implementación

Siempre seguir:

```text
Dominio

↓

Servicios

↓

Repositorio

↓

API

↓

UI
```

Nunca al revés.

---

# 34. Server Components

Utilizar Server Components por defecto.

Client Components únicamente cuando sea necesario.

---

# 35. Server Actions

Preferir Server Actions para formularios internos.

---

# 36. DTO

Nunca devolver entidades Prisma directamente.

Utilizar DTOs.

---

# 37. Validación

Toda entrada debe validarse.

Nunca confiar en TypeScript solamente.

---

# 38. Errores

Utilizar errores funcionales.

Nunca lanzar mensajes ambiguos.

---

# 39. Logs

Nunca registrar:

- password
- token
- cookie
- secret

---

# 40. Performance

Optimizar únicamente cuando exista evidencia.

No optimizar anticipadamente.

---

# 41. Documentar cambios

Si una decisión cambia:

Actualizar:

- documentación
- pruebas
- ADR

---

# 42. Mantener consistencia

Si una funcionalidad ya existe:

Imitar:

- nombres
- estructura
- estilo
- patrones

No introducir otro estilo.

---

# 43. Antes de escribir código

Preguntarse:

- ¿Existe una regla documentada?

- ¿Existe una ADR?

- ¿Existe un módulo similar?

- ¿Existe una prueba similar?

---

# 44. Antes de terminar una tarea

Verificar:

- compila

- lint

- typecheck

- pruebas

- documentación

---

# 45. Si existe una duda

Nunca inventar.

Consultar la documentación.

---

# 46. Objetivo final

El código generado debe parecer escrito por un único equipo de ingeniería.

No debe parecer una colección de respuestas independientes generadas por IA.

---

# 47. Definición de éxito

Una implementación es correcta únicamente cuando:

- respeta todas las reglas,

- pasa las pruebas,

- sigue la arquitectura,

- mantiene la seguridad,

- mantiene la documentación consistente.

No basta con que funcione.

---

# 48. Conclusión

Kickoff no es un experimento tecnológico.

Es una aplicación cuyo objetivo principal es mantener una competencia justa.

Cada decisión de implementación deberá proteger:

- la igualdad entre participantes,

- la reproducibilidad de los resultados,

- la mantenibilidad del código,

- la simplicidad del proyecto,

- y la confianza de quienes utilizan la plataforma.