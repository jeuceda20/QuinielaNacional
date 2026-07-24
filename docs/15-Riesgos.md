# Riesgos del Proyecto

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Registro inicial de riesgos (Risk Register)  
**Objetivo:** Identificar, evaluar y mitigar los principales riesgos técnicos, operativos y funcionales del proyecto.

---

# 1. Propósito

Este documento registra los riesgos identificados para el proyecto **Quiniela Nacional La Goleada – Kickoff**.

Su finalidad es:

- anticipar problemas,
- reducir el impacto de incidentes,
- priorizar acciones preventivas,
- facilitar la toma de decisiones,
- mantener la estabilidad del sistema.

Este documento deberá revisarse antes de cada versión importante.

---

# 2. Metodología

Cada riesgo incluye:

- Identificador
- Categoría
- Descripción
- Probabilidad
- Impacto
- Nivel de riesgo
- Mitigación
- Plan de contingencia

---

## Escala de probabilidad

| Nivel | Significado |
|---------|-------------|
| Baja | Poco probable |
| Media | Puede ocurrir |
| Alta | Muy probable |

---

## Escala de impacto

| Nivel | Significado |
|---------|-------------|
| Bajo | Poco efecto |
| Medio | Afecta parcialmente |
| Alto | Afecta funciones críticas |
| Crítico | Impide operar correctamente |

---

## Nivel de riesgo

| Probabilidad | Impacto | Riesgo |
|--------------|---------|---------|
| Baja | Bajo | Bajo |
| Baja | Alto | Medio |
| Media | Alto | Alto |
| Alta | Crítico | Crítico |

---

# 3. Riesgos funcionales

---

## RISK-001

### Nombre

Pronósticos aceptados después del cierre.

### Categoría

Funcional

### Probabilidad

Media

### Impacto

Crítico

### Descripción

Un error permitiría guardar pronósticos cuando el partido ya cerró.

Esto rompería completamente la confianza de la competencia.

### Mitigación

- Hora controlada por servidor.
- Validación en backend.
- Pruebas automáticas.
- Comparación UTC.

### Contingencia

- Bloquear inmediatamente el partido.
- Revisar auditoría.
- Ejecutar investigación.
- Corregir mediante procedimiento documentado.

---

## RISK-002

### Nombre

Filtración de pronósticos antes del cierre.

### Categoría

Seguridad

### Probabilidad

Baja

### Impacto

Crítico

### Mitigación

- Backend nunca devuelve pronósticos ajenos.
- Cache privada.
- Pruebas E2E.
- Revisiones de seguridad.

---

## RISK-003

### Nombre

Cálculo incorrecto de puntos.

### Categoría

Dominio

### Probabilidad

Baja

### Impacto

Crítico

### Mitigación

- Reglas unitarias.
- Integración.
- Recalculo reproducible.
- Auditoría.

---

## RISK-004

### Nombre

Clasificación inconsistente.

### Categoría

Dominio

### Probabilidad

Media

### Impacto

Alto

### Mitigación

- Fuente de verdad.
- Recalculo.
- Verificador de integridad.
- Snapshots.

---

## RISK-005

### Nombre

Partido doble mal configurado.

### Categoría

Administración

### Probabilidad

Media

### Impacto

Alto

### Mitigación

- Exactamente un doble por jornada.
- Validaciones.
- Advertencias.
- Integridad.

---

# 4. Riesgos técnicos

---

## RISK-006

### Nombre

Fallo durante procesamiento.

### Probabilidad

Media

### Impacto

Crítico

### Mitigación

- Transacciones.
- Idempotencia.
- Bloqueo de concurrencia.

---

## RISK-007

### Nombre

Migración fallida.

### Categoría

Deployment

### Probabilidad

Media

### Impacto

Alto

### Mitigación

- Backup previo.
- Testing.
- Migraciones revisadas.

---

## RISK-008

### Nombre

Pérdida de datos.

### Categoría

Infraestructura

### Probabilidad

Baja

### Impacto

Crítico

### Mitigación

- Backups.
- Exportaciones.
- Restauraciones probadas.

---

## RISK-009

### Nombre

Proveedor gratuito cambia condiciones.

### Categoría

Infraestructura

### Probabilidad

Alta

### Impacto

Medio

### Mitigación

- Arquitectura portable.
- PostgreSQL estándar.
- Variables externas.
- Deployment independiente.

---

## RISK-010

### Nombre

Límite de conexiones PostgreSQL.

### Categoría

Infraestructura

### Probabilidad

Media

### Impacto

Medio

### Mitigación

- Pooling.
- Cliente Prisma reutilizable.
- Optimización.

---

# 5. Riesgos de seguridad

---

## RISK-011

### Nombre

Robo de cuenta.

### Probabilidad

Media

### Impacto

Alto

### Mitigación

- Hash Argon2/bcrypt.
- Cookies HttpOnly.
- Rate limiting.
- Recuperación segura.

---

## RISK-012

### Nombre

Credential stuffing.

### Mitigación

- Rate limiting.
- Bloqueo temporal.
- Auditoría.

---

## RISK-013

### Nombre

SQL Injection.

### Mitigación

- Prisma.
- Zod.
- Parámetros.
- SQL restringido.

---

## RISK-014

### Nombre

XSS.

### Mitigación

- React.
- CSP.
- Sanitización.
- Sin HTML arbitrario.

---

## RISK-015

### Nombre

CSRF.

### Mitigación

- SameSite.
- Origin.
- Server Actions.
- Tokens cuando aplique.

---

## RISK-016

### Nombre

Escalamiento de privilegios.

### Mitigación

- Roles.
- Middleware.
- Validación servidor.
- Testing.

---

# 6. Riesgos operativos

---

## RISK-017

### Nombre

Administrador procesa marcador incorrecto.

### Probabilidad

Media

### Impacto

Alto

### Mitigación

- Confirmación.
- Resumen.
- Corrección versionada.
- Recalculo.

---

## RISK-018

### Nombre

Reprogramación mal realizada.

### Mitigación

- Historial.
- Auditoría.
- Validación.
- Checklist.

---

## RISK-019

### Nombre

Uso incorrecto de SQL Console.

### Mitigación

- Solo Super Admin.
- Deshabilitada.
- Auditoría.
- Confirmación.
- Backup obligatorio.

---

## RISK-020

### Nombre

Activación accidental de Test Data.

### Mitigación

- Variable de entorno.
- Advertencias.
- Deshabilitado en producción.

---

# 7. Riesgos de despliegue

---

## RISK-021

SMTP deja de funcionar.

Mitigación:

- Diagnóstico.
- Notificaciones internas.
- Cambio de proveedor.

---

## RISK-022

Hosting gratuito suspendido.

Mitigación:

- Arquitectura portable.
- Backups.
- GitHub.

---

## RISK-023

Variables mal configuradas.

Mitigación:

- Validación al iniciar.
- Startup fail-fast.

---

## RISK-024

Setup inicial abierto.

Mitigación:

- Token.
- Un solo superadministrador.
- Cierre definitivo.

---

# 8. Riesgos de rendimiento

---

## RISK-025

Consultas N+1.

Mitigación:

- Include/select.
- Profiling.
- Testing.

---

## RISK-026

Recalculo demasiado lento.

Mitigación:

- Procesamiento por lotes.
- Índices.
- Optimización.

---

## RISK-027

Dashboard lento.

Mitigación:

- Consultas agregadas.
- Cache segura.
- Tags.

---

# 9. Riesgos de mantenimiento

---

## RISK-028

Documentación desactualizada.

Mitigación:

- Documentación obligatoria.
- ADR.
- PR checklist.

---

## RISK-029

Cambios de reglas sin actualizar pruebas.

Mitigación:

- Testing obligatorio.
- ADR nueva.
- Revisión.

---

## RISK-030

Dependencias vulnerables.

Mitigación:

- npm audit.
- GitHub Dependabot.
- Actualizaciones periódicas.

---

# 10. Riesgos futuros

Algunas funciones futuras aumentan considerablemente el riesgo:

- Múltiples ligas.
- Login social.
- API pública.
- App móvil.
- WebSockets.
- Importaciones masivas.
- SQL Write.
- Restauración desde interfaz.

Cada una requerirá una revisión arquitectónica antes de implementarse.

---

# 11. Riesgos aceptados

Para la versión 1.0 se aceptan los siguientes riesgos:

- Dependencia de Gmail SMTP.
- Dependencia de un hosting gratuito.
- Posible suspensión por inactividad del proveedor.
- Limitaciones de almacenamiento gratuito.
- Operaciones largas en serverless.

Estos riesgos son aceptables porque:

- tienen mitigación,
- el volumen esperado es bajo,
- existen alternativas gratuitas.

---

# 12. Riesgos no aceptables

No podrá publicarse la versión 1.0 si existe cualquiera de los siguientes:

- Pronósticos visibles antes del cierre.
- Pronósticos tardíos aceptados.
- Puntos incorrectos.
- Procesamiento parcial.
- SQL Write habilitado.
- Setup abierto.
- Dos temporadas activas.
- Dos superadministradores.
- Contraseñas inseguras.
- Tokens expuestos.
- Backups inexistentes.
- Recalculo inconsistente.

---

# 13. Matriz resumida

| ID | Riesgo | Nivel |
|-----|---------|--------|
| 001 | Pronóstico tardío | Crítico |
| 002 | Filtración de pronósticos | Crítico |
| 003 | Puntos incorrectos | Crítico |
| 004 | Clasificación inconsistente | Alto |
| 006 | Procesamiento fallido | Crítico |
| 008 | Pérdida de datos | Crítico |
| 011 | Robo de cuenta | Alto |
| 013 | SQL Injection | Alto |
| 017 | Resultado incorrecto | Alto |
| 021 | SMTP | Medio |
| 022 | Hosting gratuito | Medio |
| 028 | Documentación | Medio |

---

# 14. Revisión de riesgos

El registro deberá revisarse:

- Antes de cada release.
- Antes del piloto.
- Antes de producción.
- Después de un incidente.
- Después de cambios arquitectónicos.

---

# 15. Criterios de aceptación

El proyecto será aceptable cuando:

- Todos los riesgos críticos tengan mitigación.
- Existan planes de contingencia.
- Los riesgos aceptados estén documentados.
- Los riesgos no aceptables estén resueltos antes de producción.

---

# 16. Documentos relacionados

- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/09-Deployment.md
- docs/12-CentroDiagnostico.md
- docs/13-Roadmap.md
- docs/14-DecisionesArquitectonicas.md

---

# 17. Conclusión

Kickoff prioriza la confianza de los participantes sobre la incorporación rápida de funcionalidades.

Los riesgos más importantes no son técnicos, sino aquellos que podrían comprometer la imparcialidad de la competencia:

- aceptar pronósticos fuera de tiempo,
- mostrar información antes del cierre,
- calcular puntos incorrectamente,
- perder la capacidad de reconstruir la clasificación.

Toda decisión futura deberá evaluarse considerando primero estos riesgos antes de valorar nuevas funcionalidades.