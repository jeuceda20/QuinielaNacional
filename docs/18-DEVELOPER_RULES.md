# Developer Rules

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Documento:** Reglas obligatorias de desarrollo  
**Aplicación:** Desarrolladores humanos y agentes de IA (Codex)

---

# 1. Propósito

Este documento define las reglas obligatorias para implementar **Quiniela Nacional La Goleada – Kickoff**.

Estas reglas aplican a:

- nuevos módulos,
- correcciones,
- refactorizaciones,
- pruebas,
- scripts,
- herramientas internas.

Su objetivo es garantizar que todo el código parezca escrito por un único equipo.

---

# 2. Regla principal

Todo el código deberá ser:

- simple,
- consistente,
- tipado,
- probado,
- documentado cuando sea necesario,
- fácil de mantener.

Nunca escribir código únicamente para que "funcione".

---

# 3. Tecnología congelada

No cambiar:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zod
- Vitest
- Playwright

Estas decisiones están congeladas por las ADR.

---

# 4. Estructura del proyecto

La estructura oficial será:

```text
src/
│
├── app/
├── modules/
├── components/
├── lib/
├── hooks/
├── services/
├── types/
├── utils/
└── styles/
```

No crear estructuras paralelas.

---

# 5. Organización por módulos

Cada módulo deberá seguir el mismo patrón.

Ejemplo:

```text
modules/
    predictions/
        application/
        domain/
        infrastructure/
        schemas/
        ui/
```

Nunca mezclar módulos.

---

# 6. Responsabilidad única

Cada archivo debe tener una única responsabilidad.

Evitar archivos de miles de líneas.

---

# 7. Tamaño recomendado

Funciones:

```text
Ideal:
20–40 líneas
```

Máximo recomendado:

```text
80 líneas
```

Clases:

Mantenerlas pequeñas.

Archivos:

Ideal:

```text
<300 líneas
```

---

# 8. Nombres

Usar nombres completos.

Correcto:

```typescript
calculatePredictionScore()
```

Incorrecto:

```typescript
calc()
```

---

# 9. Idioma

Código:

Inglés.

UI:

Español.

Documentación:

Español.

Variables:

Inglés.

---

# 10. Interfaces

Usar nombres descriptivos.

Ejemplo:

```typescript
PredictionRepository
```

No:

```typescript
Repository
```

---

# 11. Tipado

Nunca utilizar:

```typescript
any
```

Excepto casos documentados.

Preferir:

```typescript
unknown
```

cuando sea necesario.

---

# 12. Null

Preferir:

```typescript
null
```

para ausencia de valor persistente.

Usar:

```typescript
undefined
```

para parámetros opcionales.

---

# 13. Booleanos

Usar nombres positivos.

Correcto:

```typescript
isPredictionOpen
```

Incorrecto:

```typescript
notClosed
```

---

# 14. Enums

Siempre utilizar enums para estados.

Nunca múltiples booleanos.

---

# 15. DTO

Nunca exponer directamente modelos Prisma.

Siempre mapear.

---

# 16. Validación

Toda entrada debe pasar por:

```text
Zod
```

Nunca confiar únicamente en TypeScript.

---

# 17. Repositorios

Los repositorios solo acceden a datos.

Nunca implementan reglas deportivas.

---

# 18. Servicios

Los servicios contienen casos de uso.

No deben renderizar UI.

---

# 19. Dominio

El dominio contiene reglas.

Nunca conoce:

- React
- Prisma
- HTTP

---

# 20. Componentes

Server Components por defecto.

Client Components únicamente cuando:

- exista estado,
- eventos,
- formularios,
- interacción.

---

# 21. Hooks

Los hooks:

- no llaman directamente a Prisma,
- no contienen reglas críticas,
- encapsulan comportamiento del cliente.

---

# 22. Utilidades

Las utilidades deben ser:

- puras,
- reutilizables,
- sin efectos secundarios.

---

# 23. Manejo de errores

Nunca usar:

```typescript
throw "error";
```

Utilizar errores tipados.

---

# 24. Logs

Nunca registrar:

- password
- token
- cookie
- secret

---

# 25. Comentarios

Comentar únicamente cuando el código no pueda expresar claramente la intención.

No comentar obviedades.

---

# 26. Imports

Orden recomendado:

```text
React

↓

Next

↓

Librerías

↓

Módulos internos

↓

Componentes

↓

Tipos

↓

CSS
```

---

# 27. Constantes

No utilizar números mágicos.

Ejemplo:

```typescript
const PREDICTION_CLOSE_MINUTES = 5;
```

---

# 28. Fechas

Persistencia:

UTC.

Presentación:

America/Tegucigalpa.

Nunca usar la hora del navegador como autoridad.

---

# 29. UUID

Nunca asumir IDs consecutivos.

---

# 30. SQL

Usar Prisma.

SQL directo únicamente cuando esté documentado.

---

# 31. Transacciones

Usar transacciones en:

- procesamiento,
- recalculo,
- correcciones,
- aprobaciones múltiples.

---

# 32. Testing

Toda regla crítica debe tener pruebas.

No fusionar código sin pruebas.

---

# 33. Cobertura

Priorizar cobertura del dominio.

No escribir pruebas solo para aumentar porcentaje.

---

# 34. Seguridad

Toda ruta debe validar:

- sesión,
- permisos,
- estado,
- entrada.

---

# 35. Autorización

Nunca confiar en botones ocultos.

---

# 36. Auditoría

Toda acción administrativa importante debe registrarse.

---

# 37. Soft Delete

Nunca eliminar datos históricos directamente.

---

# 38. Caché

No cachear:

- dashboard,
- perfil,
- pronósticos,
- auditoría.

---

# 39. Performance

Optimizar únicamente cuando exista evidencia.

---

# 40. Dependencias

Antes de instalar una librería preguntar:

- ¿Existe ya una solución?
- ¿Realmente aporta valor?
- ¿Aumenta complejidad?

---

# 41. Git

Commits pequeños.

Mensajes claros.

Ejemplo:

```text
feat(predictions): implement save prediction service
```

---

# 42. Pull Requests

Cada PR deberá incluir:

- descripción,
- pruebas,
- documentos afectados.

---

# 43. Antes de hacer merge

Verificar:

- lint
- build
- tests
- typecheck

---

# 44. Nunca hacer

Nunca:

- comentar código muerto,
- dejar TODO permanentes,
- duplicar reglas,
- cambiar arquitectura sin ADR,
- modificar reglas deportivas.

---

# 45. Clean Code

Priorizar:

- funciones pequeñas,
- nombres claros,
- bajo acoplamiento,
- alta cohesión.

---

# 46. Principios SOLID

Aplicarlos cuando agreguen claridad.

No crear sobreingeniería.

---

# 47. DRY

No duplicar lógica.

---

# 48. KISS

La solución más simple correcta es la preferida.

---

# 49. YAGNI

No implementar funcionalidades futuras que todavía no son necesarias.

---

# 50. Definition of Done

Una tarea solo está terminada cuando:

- compila,
- pasa pruebas,
- respeta documentación,
- respeta ADR,
- respeta seguridad,
- mantiene estilo,
- no rompe funcionalidades existentes.

---

# 51. Checklist del desarrollador

Antes de entregar código:

- [ ] Sigue la arquitectura.
- [ ] Sigue las ADR.
- [ ] Sigue las reglas deportivas.
- [ ] Tiene pruebas.
- [ ] No expone secretos.
- [ ] No usa any.
- [ ] No duplica lógica.
- [ ] Lint exitoso.
- [ ] Build exitoso.
- [ ] Typecheck exitoso.

---

# 52. Regla final

Cuando exista una duda entre:

- escribir código rápido,

o

- escribir código correcto,

siempre elegir:

```text
Código correcto.
```

---

# 53. Conclusión

El objetivo de estas reglas no es limitar al desarrollador.

Su objetivo es que, dentro de cinco años, cualquier persona pueda abrir el proyecto y sentir que todo fue construido por un único equipo, siguiendo una única arquitectura y un único estándar de calidad.