# Glosario

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Objetivo:** Definir la terminología oficial utilizada en toda la documentación del proyecto.

---

# 1. Propósito

Este glosario reúne las definiciones oficiales utilizadas en la documentación de **Quiniela Nacional La Goleada – Kickoff**.

Su objetivo es:

- Evitar ambigüedades.
- Unificar el lenguaje.
- Facilitar el desarrollo.
- Facilitar el mantenimiento.
- Facilitar el uso de herramientas de IA.
- Servir como referencia para desarrolladores, administradores y usuarios.

Las definiciones aquí descritas prevalecen sobre interpretaciones informales.

---

# 2. Convenciones

Cuando un término aparezca en otros documentos con mayúscula inicial, deberá interpretarse utilizando la definición de este glosario.

Ejemplo:

```text
Temporada
```

No significa simplemente una temporada deportiva.

Significa la entidad definida oficialmente por Kickoff.

---

# A

## Acción Administrativa

Operación ejecutada por un administrador o superadministrador que modifica el estado del sistema.

Ejemplos:

- Aprobar usuario.
- Procesar resultado.
- Reprogramar partido.
- Activar mantenimiento.

Todas las acciones administrativas relevantes generan auditoría.

---

## ADR

Architecture Decision Record.

Documento que registra una decisión arquitectónica importante y sus motivos.

---

## Administrador

Usuario con permisos para operar la quiniela.

Puede:

- Aprobar usuarios.
- Crear partidos.
- Procesar resultados.

No puede realizar operaciones exclusivas del superadministrador.

---

## API

Conjunto de endpoints y Server Actions utilizados por la aplicación.

No está diseñada inicialmente como API pública para terceros.

---

## Auditoría

Registro permanente de acciones administrativas importantes.

Es:

- Append-only.
- No editable.
- No eliminable desde la aplicación.

---

# B

## Backup

Copia de seguridad de los datos del sistema.

Puede ser:

- Técnico.
- Funcional.

---

## Batch

Conjunto de registros creados durante una misma operación.

Ejemplos:

- Importación.
- Generación de datos de prueba.
- Limpieza.

---

# C

## Campeón

Participante que termina una temporada en la primera posición.

Puede haber más de un campeón cuando existe empate en la posición uno.

---

## Cierre

Momento a partir del cual ya no es posible modificar un pronóstico.

Se calcula:

```text
Hora oficial del partido

-

5 minutos
```

La validación la realiza el servidor.

---

## Clasificación

Tabla ordenada de participantes.

Orden principal:

1. Puntos.
2. Exactos.

Los parciales no desempatan.

---

## Cliente

Aplicación ejecutándose en el navegador del usuario.

Nunca constituye la autoridad para validar reglas críticas.

---

## Codex

Agente de desarrollo asistido por IA encargado de implementar el proyecto siguiendo esta documentación.

---

## Cookie de sesión

Cookie segura utilizada para mantener autenticado al usuario.

Debe ser:

- HttpOnly.
- Secure en producción.
- SameSite.

---

# D

## Dashboard

Pantalla principal mostrada después del inicio de sesión.

Resume:

- Posición.
- Puntos.
- Próximos partidos.
- Pronósticos pendientes.

---

## Diagnóstico

Conjunto de herramientas destinadas al superadministrador para verificar el estado del sistema.

---

## Dominio

Conjunto de reglas de negocio del proyecto.

Incluye:

- Puntuación.
- Clasificación.
- Reprogramaciones.
- Procesamiento.

---

## DTO

Data Transfer Object.

Objeto utilizado para transportar información entre capas sin exponer directamente entidades internas.

---

# E

## Exacto

Pronóstico cuyo marcador coincide exactamente con el resultado oficial.

Valor:

```text
3 puntos
```

o

```text
6 puntos
```

si corresponde al partido doble.

---

## Exportación

Proceso de generación de archivos con información del sistema.

Puede producir:

- JSON.
- CSV.
- Backup funcional.

---

# F

## Factory

Utilidad utilizada en pruebas para generar datos válidos automáticamente.

---

## Fixture

Conjunto de datos preparados para pruebas.

---

# G

## GitHub Actions

Pipeline de integración continua utilizado para validar el proyecto automáticamente.

---

# H

## Health Check

Endpoint utilizado para verificar que la aplicación está operativa.

---

## Hosting

Proveedor donde se ejecuta la aplicación.

En la versión inicial se priorizan planes gratuitos.

---

# I

## Idempotencia

Propiedad mediante la cual ejecutar la misma operación más de una vez produce el mismo resultado.

Ejemplo:

Procesar un partido dos veces con la misma clave no debe duplicar puntos.

---

## Integridad

Consistencia de los datos almacenados.

El verificador de integridad detecta inconsistencias.

---

## Importación

Proceso mediante el cual se incorporan datos externos al sistema.

Siempre requiere:

- Validación.
- Previsualización.
- Confirmación.

---

# J

## Jornada

Agrupación lógica de partidos.

Una jornada no determina necesariamente el orden cronológico.

Un partido de Jornada 5 puede jugarse después de uno de Jornada 10.

---

# K

## Kickoff

Nombre interno del proyecto.

---

# L

## Log

Registro técnico generado por la aplicación.

No debe contener:

- Contraseñas.
- Tokens.
- Secretos.

---

# M

## Match

Partido de fútbol utilizado para realizar pronósticos.

---

## Match Double

Partido de puntuación doble.

Existe exactamente uno por jornada publicada.

---

## Middleware

Componente que ejecuta lógica antes de llegar al controlador o página.

Ejemplos:

- Autenticación.
- Autorización.

---

## Migración

Cambio controlado sobre la estructura de la base de datos.

---

## Modo mantenimiento

Estado especial donde la aplicación restringe el acceso de usuarios normales para permitir operaciones administrativas.

---

# N

## Next.js

Framework utilizado para desarrollar Kickoff.

---

## Nickname

Nombre público utilizado por cada participante.

Debe ser único.

---

## Notificación

Mensaje generado por el sistema.

Puede ser:

- Interna.
- Por correo.

---

# P

## Parcial

Pronóstico que acierta únicamente el resultado general del partido.

Valor:

```text
1 punto
```

o

```text
2 puntos
```

si es partido doble.

---

## Participante

Usuario aprobado para competir en una temporada.

---

## Partido

Ver:

```text
Match
```

---

## Partido doble

Partido cuyo puntaje se multiplica por dos.

---

## PostgreSQL

Motor de base de datos utilizado por el proyecto.

---

## Prisma

ORM utilizado para acceder a PostgreSQL.

---

## Procesamiento

Operación administrativa que:

- Guarda el resultado.
- Calcula puntos.
- Actualiza clasificación.
- Genera auditoría.

---

## Producción

Entorno utilizado por usuarios reales.

---

## Prompt

Instrucción entregada a Codex para implementar una funcionalidad.

---

## Pronóstico

Marcador enviado por un participante antes del cierre del partido.

---

# Q

## Query

Consulta realizada a la base de datos.

---

# R

## Rate Limiting

Restricción del número de solicitudes permitidas durante un periodo determinado.

---

## React Server Component

Componente ejecutado principalmente en el servidor.

Es el tipo de componente preferido en Kickoff.

---

## Recalculo

Proceso mediante el cual se reconstruye completamente la clasificación utilizando la fuente de verdad.

---

## Reprogramación

Cambio de fecha y/o hora de un partido conservando su historial.

---

## Repository

Capa encargada del acceso a datos.

---

## Request ID

Identificador único asignado a cada solicitud.

Facilita el soporte y la investigación de errores.

---

## Resultado oficial

Marcador definitivo utilizado para calcular los puntos.

---

## Rol

Nivel de permisos de un usuario.

Valores:

- USER
- ADMIN
- SUPER_ADMIN

---

## Route Handler

Endpoint HTTP implementado mediante App Router.

---

# S

## Seed

Proceso que inserta datos iniciales en la base de datos.

---

## Server Action

Función del servidor utilizada para ejecutar acciones desde formularios sin necesidad de crear un endpoint HTTP tradicional.

---

## Server Component

Ver:

```text
React Server Component
```

---

## Sesión

Estado autenticado del usuario.

---

## Snapshot

Registro histórico de la clasificación después de un procesamiento o recalculo.

---

## Soft Delete

Eliminación lógica de un registro.

No elimina físicamente la información.

---

## SQL Console

Herramienta avanzada para ejecutar consultas SQL controladas.

Disponible únicamente para el superadministrador cuando está habilitada.

---

## Superadministrador

Usuario con el nivel máximo de permisos.

Puede realizar todas las operaciones administrativas.

---

# T

## Tabla

Clasificación general de participantes.

---

## Tag

Identificador utilizado por Next.js para invalidar caché.

---

## Temporada

Competencia completa administrada por el sistema.

Contiene:

- Participantes.
- Jornadas.
- Partidos.
- Clasificación.

---

## Test Data

Datos generados exclusivamente para pruebas.

Nunca deben mezclarse con datos reales.

---

## Token

Valor aleatorio utilizado para:

- Confirmación de correo.
- Recuperación de contraseña.
- Setup inicial.

---

## Transacción

Conjunto de operaciones ejecutadas de forma atómica.

Si una falla, todas se revierten.

---

# U

## UI

User Interface.

Interfaz gráfica del sistema.

---

## Usuario

Persona registrada en el sistema.

No necesariamente participa en la temporada.

Debe ser aprobada.

---

## UTC

Tiempo Universal Coordinado.

Todas las fechas persistidas se almacenan en UTC.

---

## UUID

Identificador único universal utilizado como clave principal.

---

# V

## Validación

Proceso mediante el cual se verifica que los datos cumplen las reglas definidas.

---

## Versión

Identificador de una publicación del sistema.

Ejemplo:

```text
1.0.0
```

---

# W

## Warning

Advertencia generada por el sistema.

No necesariamente representa un error.

---

# X

## XSS

Cross Site Scripting.

Ataque que intenta ejecutar código JavaScript en el navegador del usuario.

---

# Z

## Zod

Librería utilizada para validar datos de entrada.

---

# Acrónimos

| Acrónimo | Significado |
|-----------|-------------|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| CI | Continuous Integration |
| CSP | Content Security Policy |
| CSRF | Cross Site Request Forgery |
| DTO | Data Transfer Object |
| E2E | End-to-End |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| ORM | Object Relational Mapping |
| PWA | Progressive Web Application |
| SQL | Structured Query Language |
| SSR | Server Side Rendering |
| UI | User Interface |
| URI | Uniform Resource Identifier |
| URL | Uniform Resource Locator |
| UTC | Coordinated Universal Time |
| UUID | Universally Unique Identifier |
| XSS | Cross Site Scripting |

---

# Documentos relacionados

Consultar:

- README.md
- docs/01-PRD.md
- docs/02-Arquitectura.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/14-DecisionesArquitectonicas.md
- docs/17-CODEX_INSTRUCTIONS.md

---

# Conclusión

Este glosario establece el vocabulario oficial de **Kickoff**.

Todos los documentos, el código fuente y los prompts dirigidos a herramientas de IA deberán utilizar estos términos con el mismo significado para mantener consistencia durante todo el ciclo de vida del proyecto.