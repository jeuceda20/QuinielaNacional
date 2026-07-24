# Estrategia de Testing

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Estrategia de pruebas inicial  
**Herramientas objetivo:** Vitest, Playwright y PostgreSQL de testing  
**Principio principal:** Ninguna regla crítica de la quiniela deberá depender únicamente de pruebas manuales.

---

## 1. Propósito

Este documento define la estrategia de calidad y pruebas de **Quiniela Nacional La Goleada – Kickoff**.

Su objetivo es verificar:

- Reglas de puntuación.
- Cierres de pronósticos.
- Privacidad antes del cierre.
- Transparencia después del cierre.
- Clasificación.
- Reprogramaciones.
- Procesamiento de resultados.
- Autenticación.
- Roles.
- Auditoría.
- Diagnóstico.
- Integridad de datos.
- Compatibilidad móvil.
- Seguridad.
- Despliegue.

Las pruebas deben detectar errores antes de que afecten la competencia real.

---

# 2. Objetivos de calidad

La estrategia de testing deberá asegurar que:

1. Los puntos se calculen correctamente.
2. Nadie pueda pronosticar después del cierre.
3. Nadie pueda ver pronósticos ajenos antes del cierre.
4. Los partidos reprogramados funcionen sin depender de la jornada.
5. Los resultados se procesen de manera transaccional.
6. Las posiciones compartidas se calculen correctamente.
7. Los roles se respeten.
8. La auditoría registre acciones importantes.
9. El recalculo reproduzca la misma clasificación.
10. El sistema pueda desplegarse sin depender de servicios de pago.

---

# 3. Principios de testing

## TEST-001 — Prioridad a reglas críticas

Las reglas con mayor impacto deberán tener pruebas unitarias, de integración y, cuando aplique, end-to-end.

Reglas críticas:

- Exacto.
- Parcial.
- Partido doble.
- Cierre.
- Visibilidad de pronósticos.
- Procesamiento.
- Recalculo.
- Roles.
- Reprogramaciones.

---

## TEST-002 — Pruebas deterministas

Una prueba deberá producir el mismo resultado cada vez.

No dependerá de:

- Hora real no controlada.
- Datos externos.
- Gmail real.
- Internet.
- Resultados deportivos reales.
- Orden aleatorio sin semilla.

---

## TEST-003 — Tiempo controlado

Las pruebas relacionadas con cierres deberán usar un reloj controlado.

Ejemplo conceptual:


vi.setSystemTime(new Date("2026-08-15T00:54:59.000Z"));

No deberá esperarse tiempo real.

TEST-004 — Base de datos aislada

Las pruebas de integración usarán una base separada.

Nunca deberán:

Ejecutarse contra producción.
Usar datos reales.
Modificar una temporada activa.
Enviar correos reales.
TEST-005 — Datos mínimos

Cada prueba deberá crear únicamente los datos necesarios.

Se evitarán fixtures gigantes cuando una prueba pueda explicarse con pocos registros.

TEST-006 — Nombres descriptivos

Los nombres deberán expresar comportamiento.

Ejemplo:

debe rechazar un pronóstico recibido exactamente en la hora de cierre

No usar:

test1
casoA
funciona
4. Pirámide de pruebas
                ┌───────────────┐
                │ End-to-End    │
                │ Pocas y clave │
                └───────────────┘
              ┌───────────────────┐
              │ Integración       │
              │ Servicios + DB    │
              └───────────────────┘
          ┌───────────────────────────┐
          │ Unitarias                 │
          │ Muchas, rápidas y puras   │
          └───────────────────────────┘

Distribución orientativa:

Unitarias: 60–70 %
Integración: 20–30 %
End-to-End: 10–15 %

No será una regla rígida. La cobertura se enfocará en riesgo.

5. Tipos de pruebas
5.1 Unitarias

Cubren funciones puras y reglas aisladas.

Ejemplos:

Cálculo de puntos.
Determinación de desenlace.
Clasificación.
Posiciones compartidas.
Hora de cierre.
Transiciones de estado.
Validaciones.
Políticas de permisos.

Herramienta:

Vitest
5.2 Integración

Cubren interacción entre:

Servicios.
Repositorios.
Prisma.
PostgreSQL.
Auditoría.
Transacciones.
Sesiones.
Tokens.

Ejemplos:

Guardar pronóstico.
Procesar partido.
Aprobar usuario.
Reprogramar partido.
Recalcular temporada.
5.3 API

Cubren Route Handlers y contratos HTTP.

Ejemplos:

Status code.
Forma de respuesta.
Autenticación.
Autorización.
Validaciones.
Paginación.
Códigos de error.
5.4 End-to-End

Simulan el uso real en navegador.

Herramienta:

Playwright

Flujos prioritarios:

Registro.
Confirmación simulada.
Aprobación.
Login.
Pronóstico.
Cierre.
Procesamiento.
Consulta de tabla.
Reprogramación.
5.5 Visuales

Verifican:

Layout móvil.
Estados de partido.
Tabla con empates.
Dashboard.
Panel administrativo.
Página de mantenimiento.

Podrán utilizar capturas de Playwright.

No deben sustituir pruebas funcionales.

5.6 Seguridad

Cubren:

Escalamiento de privilegios.
CSRF.
XSS.
Inyección SQL.
IDOR.
Tokens reutilizados.
Sesiones revocadas.
Rate limiting.
5.7 Rendimiento

Verifican:

Tiempo de respuesta.
Consultas N+1.
Procesamiento con muchos usuarios.
Recalculo.
Listados paginados.
Carga de dashboard.
6. Entornos de prueba
6.1 Unitarias

No necesitan base de datos.

Usan:

Funciones puras.
Mocks mínimos.
Reloj controlado.
6.2 Integración

Usan:

PostgreSQL separado.
Migraciones reales.
Variables de entorno exclusivas.
SMTP falso.
Datos aislados por prueba o suite.
6.3 End-to-End

Usan una aplicación levantada en modo testing.

Ejemplo:

http://localhost:3000

Con:

Base de datos E2E.
Usuarios ficticios.
Correo interceptado.
Herramientas de seed controladas.
7. Estructura de carpetas
tests/
├── unit/
│   ├── scoring/
│   ├── standings/
│   ├── time/
│   ├── permissions/
│   └── validation/
│
├── integration/
│   ├── auth/
│   ├── users/
│   ├── matches/
│   ├── predictions/
│   ├── scoring/
│   ├── standings/
│   ├── audit/
│   └── diagnostics/
│
├── api/
│   ├── auth/
│   ├── predictions/
│   ├── admin/
│   └── diagnostics/
│
├── e2e/
│   ├── auth.spec.ts
│   ├── predictions.spec.ts
│   ├── standings.spec.ts
│   ├── results.spec.ts
│   ├── admin.spec.ts
│   └── rescheduling.spec.ts
│
├── fixtures/
├── factories/
├── helpers/
└── setup/
8. Convenciones de datos

Se crearán factories para:

createTestUser()
createTestAdmin()
createTestSuperAdmin()
createTestSeason()
createTestRound()
createTestTeam()
createTestMatch()
createTestPrediction()

Ejemplo conceptual:

const user = await createTestUser({
  nickname: "juan",
  status: "APPROVED",
});

Las factories deberán generar valores válidos por defecto y permitir sobrescrituras.

9. Pruebas unitarias de puntuación
9.1 Exacto normal

Entrada:

Pronóstico: 2-1
Resultado: 2-1
Multiplicador: 1

Resultado:

Tipo: EXACT
Base: 3
Puntos: 3
9.2 Exacto doble

Entrada:

Pronóstico: 2-1
Resultado: 2-1
Multiplicador: 2

Resultado:

Tipo: EXACT
Base: 3
Puntos: 6
9.3 Parcial victoria local
Pronóstico: 1-0
Resultado: 3-2

Resultado:

PARTIAL
1 punto
9.4 Parcial victoria visitante
Pronóstico: 0-1
Resultado: 1-3

Resultado:

PARTIAL
1 punto
9.5 Parcial empate
Pronóstico: 1-1
Resultado: 2-2

Resultado:

PARTIAL
1 punto
9.6 Incorrecto
Pronóstico: 2-0
Resultado: 0-1

Resultado:

WRONG
0 puntos
9.7 Sin pronóstico

Resultado:

NO_PREDICTION
0 puntos
9.8 Marcador 0-0

Debe distinguirse entre:

Pronóstico 0-0

y:

Sin pronóstico

El pronóstico 0-0 es válido.

9.9 Valores inválidos

Rechazar:

Negativos.
Decimales.
Texto.
NaN.
Valores mayores al máximo.
Valores incompletos.
10. Pruebas unitarias de desenlace

La función deberá clasificar:

HOME_WIN
AWAY_WIN
DRAW

Casos:

Local	Visitante	Resultado
1	0	HOME_WIN
3	2	HOME_WIN
0	1	AWAY_WIN
1	4	AWAY_WIN
0	0	DRAW
2	2	DRAW
11. Pruebas de cierre

Supongamos:

Inicio: 19:00
Cierre: 18:55
Zona: America/Tegucigalpa
11.1 Antes del cierre
18:54:59

Debe permitir guardar.

11.2 Exactamente en el cierre
18:55:00

Debe rechazar.

Regla:

now < predictionClosesAt
11.3 Después del cierre
18:55:01

Debe rechazar.

11.4 Reloj del cliente incorrecto

Aunque el cliente indique una hora anterior, el servidor debe rechazar si ya cerró.

11.5 Cambio de zona horaria

La presentación podrá variar, pero el instante UTC de cierre deberá ser el mismo.

12. Pruebas de privacidad
12.1 Partido abierto

Usuario A no puede ver el pronóstico de Usuario B.

Verificar:

API.
HTML.
Datos serializados.
Caché.
Server Component.
DevTools de red.
12.2 Partido cerrado

Usuario A puede ver el pronóstico de Usuario B.

12.3 Cerrado no procesado

Puede ver marcador pronosticado, pero no:

Tipo de acierto.
Puntos.
Clasificación del partido.
12.4 Procesado

Puede ver:

Pronóstico.
Tipo.
Puntos.
12.5 Administrador

Un administrador tampoco puede ver pronósticos ajenos antes del cierre.

13. Pruebas de clasificación
13.1 Orden por puntos

Usuarios:

A: 10 puntos
B: 12 puntos

Resultado:

B primero
A segundo
13.2 Desempate por exactos
A: 10 puntos, 3 exactos
B: 10 puntos, 2 exactos

Resultado:

A primero
B segundo
13.3 Parciales no desempatan
A: 10 puntos, 3 exactos, 4 parciales
B: 10 puntos, 3 exactos, 8 parciales

Resultado:

Ambos comparten posición
13.4 Clasificación de competencia

Datos:

A: 15 puntos
B: 12 puntos
C: 12 puntos
D: 10 puntos

Posiciones:

1, 2, 2, 4
13.5 Usuario con cero puntos

Debe aparecer.

13.6 Orden estable entre empatados

Los empatados podrán ordenarse alfabéticamente sin cambiar su posición deportiva.

14. Pruebas de tendencia
14.1 Subida

Antes:

Posición 4

Después:

Posición 2

Resultado:

UP
14.2 Bajada

Antes:

Posición 2

Después:

Posición 5

Resultado:

DOWN
14.3 Igual

Misma posición.

14.4 Nuevo participante

Sin snapshot anterior:

NEW o NONE

La decisión final debe ser consistente con UI.

15. Pruebas de reprogramación
15.1 Partido abierto reprogramado
Fecha nueva futura.
Pronósticos conservados.
Cierre actualizado.
Estado reprogramado.
Auditoría creada.
15.2 Partido cerrado reprogramado
Nueva fecha futura.
Pronósticos conservados.
Puede reabrirse.
Usuarios pueden editar.
Notificación creada.
15.3 Reprogramación sin reapertura
Fecha cambia.
Pronósticos siguen bloqueados.
Debe quedar explícito.
15.4 Jornada anterior, fecha posterior

Crear:

Jornada 5: 15 de octubre
Jornada 10: 20 de septiembre

Verificar:

No hay error.
Pronósticos ordenados por fecha.
Jornada 5 conserva su nombre.
Tabla se actualiza cuando se procesa.
15.5 Historial

Cada cambio debe conservar:

Fecha anterior.
Fecha nueva.
Usuario.
Motivo.
16. Pruebas de partido doble
16.1 Máximo uno por jornada

Intentar crear dos dobles.

Resultado:

Rechazo por conflicto
16.2 Jornada publicada sin doble

Debe rechazar publicación.

16.3 Cambio antes del procesamiento

Debe mover el indicador correctamente.

16.4 Cambio después del procesamiento

Debe requerir flujo especial y recalculo.

16.5 Puntuación doble

Validar exactos y parciales.

17. Pruebas de procesamiento
17.1 Procesamiento exitoso

Debe:

Guardar resultado.
Crear puntuaciones.
Actualizar tabla.
Crear snapshot.
Cambiar estado.
Crear auditoría.
Crear notificaciones cuando corresponda.
17.2 Partido ya procesado

El flujo normal debe rechazarlo.

17.3 Partido cancelado

Debe rechazar procesamiento.

17.4 Partido suspendido

Debe rechazar mientras no exista transición válida.

17.5 Usuario sin pronóstico

Debe recibir cero puntos.

17.6 Transacción fallida

Simular error al actualizar clasificación.

Verificar:

Resultado no guardado.
Puntuaciones no parciales.
Estado no cambiado.
Auditoría no incompleta.
17.7 Procesamiento simultáneo

Lanzar dos solicitudes.

Resultado:

Una exitosa.
Una con conflicto.
Sin puntuaciones duplicadas.
17.8 Idempotencia

Repetir con la misma Idempotency-Key.

Resultado:

No duplicar.
Devolver resultado original o equivalente.
18. Pruebas de corrección de resultado
18.1 Permiso

Usuario y admin normal no autorizado deben ser rechazados si la política reserva la corrección al superadmin.

18.2 Motivo obligatorio

Sin motivo, rechazar.

18.3 Versión

Debe incrementar resultVersion.

18.4 Recalculo

Debe modificar:

Puntos del partido.
Totales.
Posiciones.
Tendencias.
18.5 Auditoría

Debe registrar antes y después.

19. Pruebas de recalculo completo
19.1 Reproducibilidad

Ejecutar dos veces sin cambios.

Resultado idéntico.

19.2 Reparación

Alterar un Standing en base de testing.

Ejecutar recalculo.

Debe corregirlo.

19.3 Sin partidos procesados

Todos los participantes quedan con cero puntos.

19.4 Usuarios incorporados tarde

No deben recibir puntos anteriores.

19.5 Partidos cancelados

No deben contar.

19.6 Resultado versionado

Solo usar versión activa.

19.7 Concurrencia

No permitir dos recalculos simultáneos para la misma temporada.

20. Pruebas de usuarios
20.1 Registro válido

Crea cuenta pendiente de confirmación.

20.2 Correo duplicado

Rechaza.

20.3 Nickname duplicado por mayúsculas
Juancho
JUANCHO

Debe rechazar.

20.4 Confirmación

Token válido cambia a pendiente de aprobación.

20.5 Token reutilizado

Debe rechazar.

20.6 Aprobación

Admin aprueba cuenta confirmada.

20.7 Aprobación sin confirmar

Debe rechazar.

20.8 Rechazo

Cuenta no puede iniciar sesión.

20.9 Bloqueo

Revoca o invalida acceso.

20.10 Correo inmutable

No debe existir operación normal para cambiarlo.

21. Pruebas de roles
Acción	User	Admin	Superadmin
Pronosticar	Sí	Sí	Sí
Aprobar usuario	No	Sí	Sí
Crear partido	No	Sí	Sí
Procesar	No	Sí	Sí
Promover admin	No	No	Sí
SQL	No	No	Sí

Cada combinación deberá probarse al menos una vez.

22. Pruebas de sesión
22.1 Cookie válida

Acceso correcto.

22.2 Cookie alterada

Rechazo.

22.3 Sesión expirada

Rechazo y redirección a login.

22.4 Sesión revocada

Rechazo inmediato.

22.5 Cambio de contraseña

Revoca sesiones definidas por política.

22.6 Fijación de sesión

El identificador debe cambiar tras login.

23. Pruebas de recuperación
Correo existente.
Correo inexistente.
Misma respuesta pública.
Token válido.
Token expirado.
Token usado.
Nueva contraseña inválida.
Revocación de sesiones.
Rate limiting.
24. Pruebas de auditoría

Verificar que se audite:

Aprobación.
Rechazo.
Bloqueo.
Cambio de rol.
Creación de jornada.
Reprogramación.
Procesamiento.
Corrección.
Recalculo.
SQL.
Mantenimiento.

Verificar que no se guarde:

Contraseña.
Hash.
Token.
Cookie.
Secretos.
25. Pruebas de API

Cada endpoint deberá verificar:

Status code.
Estructura JSON.
Código funcional.
Autenticación.
Rol.
Validación.
Datos sensibles ausentes.
Paginación.
Orden.

Ejemplo:

expect(response.status).toBe(409);
expect(body.error.code).toBe("PREDICTION_CLOSED");
26. Pruebas end-to-end prioritarias
E2E-001 — Registro completo
Abrir registro.
Completar formulario.
Ver mensaje de correo.
Simular confirmación.
Ver pantalla pendiente.
Admin aprueba.
Usuario inicia sesión.
E2E-002 — Pronóstico
Login.
Abrir Pronósticos.
Ingresar marcador.
Ver “Guardando”.
Ver “Guardado”.
Recargar.
Confirmar persistencia.
E2E-003 — Cierre
Configurar tiempo antes del cierre.
Guardar.
Avanzar reloj.
Intentar editar.
Ver rechazo.
Confirmar campos bloqueados.
E2E-004 — Transparencia
Usuario A pronostica.
Usuario B pronostica.
Antes del cierre, no ven datos ajenos.
Después del cierre, ambos los ven.
Antes de procesamiento, no ven puntos.
Después, ven puntos.
E2E-005 — Procesamiento administrativo
Admin inicia sesión.
Abre partido.
Ingresa resultado.
Confirma.
Ve resumen.
Usuario consulta tabla actualizada.
E2E-006 — Reprogramación
Admin reprograma Jornada 5.
Nueva fecha queda después de Jornada 10.
Usuario ve “Reprogramado”.
Pronóstico anterior se conserva.
Puede editar si fue reabierto.
E2E-007 — Posiciones compartidas

Preparar datos empatados y verificar:

1, 2, 2, 4
27. Pruebas visuales responsive

Resoluciones mínimas:

320 × 568
375 × 667
390 × 844
768 × 1024
1366 × 768
1920 × 1080

Validar:

Sin desbordamiento.
Botones accesibles.
Tabla legible.
Marcadores utilizables.
Menú funcional.
Modales visibles.
Contador no cortado.
28. Pruebas de accesibilidad

Se deberá verificar:

Navegación por teclado.
Foco visible.
Etiquetas de formularios.
Orden de tabulación.
Lectura de errores.
Contraste.
Texto alternativo.
Modales con foco.
Estados no dependientes del color.
prefers-reduced-motion.

Se podrá utilizar una herramienta automatizada como axe, además de revisión manual.

29. Pruebas de seguridad
29.1 XSS

Intentar valores como:

<script>alert(1)</script>

en:

Nickname.
Motivo.
Patrocinador.
Notas.
Cómo funciona.

Debe renderizarse como texto o rechazarse.

29.2 SQL injection

Probar filtros como:

' OR 1=1 --

No debe alterar la consulta.

29.3 IDOR

Usuario A intenta acceder a:

Notificación de B.
Sesión de B.
Exportación de B.
Pronóstico privado de B.

Debe rechazarse.

29.4 CSRF

Intentar operación desde origen no permitido.

Debe rechazarse.

29.5 Escalamiento

Modificar request para usar rutas admin.

Debe responder 403.

29.6 CSV injection

Datos que comienzan con:

=
+
-
@

deben exportarse de forma segura.

30. Pruebas de rendimiento

Escenarios sugeridos:

30.1 Dashboard

Con:

200 usuarios.
100 partidos.
10,000 pronósticos.

Objetivo inicial:

Respuesta de servidor razonable, idealmente inferior a 1 segundo en condiciones normales.

No es un SLA contractual.

30.2 Tabla

Debe obtenerse con pocas consultas y sin N+1.

30.3 Procesamiento

Probar con:

10 usuarios.
100 usuarios.
500 usuarios.

Verificar tiempo y memoria.

30.4 Recalculo

Probar varias temporadas y miles de puntuaciones.

30.5 Exportación

No cargar toda la base en memoria cuando el volumen pueda crecer.

31. Pruebas de SMTP

No se enviarán correos reales en unitarias o integración.

Se usará un proveedor falso:

class FakeEmailProvider

Verificar:

Destinatario.
Plantilla.
Enlace.
Token no incluido en logs.
Reintentos controlados.
Error de proveedor.

Una prueba manual de Gmail SMTP se hará en staging o diagnóstico.

32. Pruebas de errores

Simular:

Base de datos no disponible.
SMTP caído.
Transacción fallida.
Token inválido.
Error durante exportación.
Error de imagen.
Timeout SQL.
Migración pendiente.

La aplicación deberá:

Mostrar mensaje seguro.
Generar request ID.
No exponer stack.
No dejar datos parciales.
33. Cobertura

Objetivos iniciales sugeridos:

Dominio y reglas críticas: 95 % o más
Servicios críticos: 85 % o más
Proyecto general: 75 % o más

La cobertura no reemplaza la calidad.

No se escribirán pruebas inútiles únicamente para aumentar porcentaje.

34. Comandos sugeridos
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:integration && npm run test:e2e"
  }
}

Las herramientas exactas podrán ajustarse.

35. Pipeline de integración continua

En cada Pull Request:

Instalar dependencias.
Validar formato.
Ejecutar lint.
Verificar TypeScript.
Ejecutar unitarias.
Ejecutar integración.
Construir aplicación.
Ejecutar E2E esenciales.
Verificar migraciones.

Ejemplo conceptual:

lint
typecheck
unit
integration
build
e2e-smoke

El pipeline deberá usar opciones gratuitas disponibles.

36. Smoke tests de producción

Después del despliegue:

Health check responde.
Página pública carga.
Login carga.
Base de datos conecta.
Configuración pública carga.
No se muestran errores.
Diagnóstico permanece protegido.
SQL permanece deshabilitado.
Setup no vuelve a abrirse.

No se deberán crear pronósticos reales durante un smoke test automático sin un usuario específico de prueba.

37. Gestión de datos de prueba

Los datos deberán:

Estar marcados como test.
Pertenecer a un batch.
Poder limpiarse.
No mezclarse con producción.
No usar correos reales.
No enviar emails reales.

Formato sugerido:

test-user-001@example.invalid
38. Seeds de testing

Diferenciar:

seed base
seed desarrollo
seed testing
seed demo

El seed base crea catálogos.

El seed testing crea datos efímeros.

El seed demo no deberá ejecutarse en producción sin confirmación.

39. Matriz de trazabilidad

Cada requisito crítico deberá asociarse con pruebas.

Ejemplo:

Regla	Unit	Integración	E2E
Exacto = 3	Sí	Sí	Opcional
Parcial = 1	Sí	Sí	Opcional
Cierre	Sí	Sí	Sí
Privacidad	Sí	Sí	Sí
Partido doble	Sí	Sí	Sí
Reprogramación	Sí	Sí	Sí
Desempate	Sí	Sí	Sí
Roles	Sí	Sí	Sí
Auditoría	No	Sí	Sí
Recalculo	Sí	Sí	Sí

La matriz completa podrá almacenarse en:

tests/TRACEABILITY.md
40. Criterios de severidad
Crítico
Pronósticos visibles antes del cierre.
Pronóstico aceptado tarde.
Puntuación incorrecta.
Pérdida de datos.
Escalamiento de privilegios.
Resultado parcialmente procesado.
Dos superadministradores.
Secretos expuestos.

Bloquea producción.

Alto
Clasificación incorrecta.
Reprogramación defectuosa.
Auditoría ausente.
Recuperación insegura.
Exportación con datos sensibles.

Bloquea producción normalmente.

Medio
Estado visual incorrecto.
Filtro defectuoso.
Notificación duplicada.
Problema responsive menor.
Bajo
Texto.
Espaciado.
Icono.
Mejora cosmética.
41. Reporte de defectos

Cada defecto deberá incluir:

Título.
Entorno.
Precondiciones.
Pasos.
Resultado actual.
Resultado esperado.
Evidencia.
Severidad.
Request ID.
Datos de prueba usados.
42. Pruebas de regresión

Antes de cada release se ejecutarán al menos:

Login.
Registro.
Aprobación.
Pronóstico.
Cierre.
Privacidad.
Procesamiento.
Tabla.
Partido doble.
Reprogramación.
Auditoría.
Recalculo.
Exportación.
Seguridad por roles.
43. Checklist de release
 Unitarias exitosas.
 Integración exitosa.
 E2E críticas exitosas.
 Build exitoso.
 Migraciones probadas.
 Sin vulnerabilidades críticas conocidas.
 Privacidad de pronósticos validada.
 Cierre validado.
 Partido doble validado.
 Clasificación validada.
 Reprogramación validada.
 Auditoría validada.
 Diagnóstico protegido.
 SQL deshabilitado.
 Respaldo disponible.
 Smoke test exitoso.
44. Escenarios completos para validación manual
Escenario A — Jornada normal
10 usuarios.
5 partidos.
1 doble.
Pronósticos variados.
Procesar uno a uno.
Verificar tabla tras cada partido.
Escenario B — Empates
Usuarios con mismos puntos y exactos.
Verificar posiciones compartidas.
Escenario C — Reprogramación
Cerrar Jornada 5.
Reprogramar un partido después de Jornada 10.
Reabrir.
Editar pronósticos.
Procesar posteriormente.
Escenario D — Suspensión
Partido abierto.
Cierra.
Se suspende.
Se reprograma.
Se reanuda.
Se procesa.
Escenario E — Corrección
Procesar 2-1.
Corregir a 1-1.
Verificar puntos y tabla.
Escenario F — Usuario tardío
Aprobar usuario después de varias jornadas.
Verificar que no recibe puntos retroactivos.
Escenario G — Temporada completa
Generar 100 usuarios.
Crear jornadas.
Simular pronósticos.
Procesar resultados.
Recalcular.
Comparar.
Cerrar temporada.
45. Pruebas que no deben depender de producción

No usar producción para:

Fuerza bruta.
SQL de prueba.
Datos masivos.
Corrección simulada.
Limpieza.
Recalculo destructivo.
Pruebas de archivos maliciosos.
Pruebas de XSS.
Pruebas de inyección.
46. Criterios de aceptación de testing

La estrategia se considerará implementada cuando:

Existan suites unitarias para reglas críticas.
Existan pruebas de integración con PostgreSQL.
Existan E2E para flujos principales.
El tiempo esté controlado.
Los correos estén simulados.
Las pruebas no usen producción.
Exista una matriz de trazabilidad.
El pipeline ejecute pruebas automáticamente.
Los errores críticos bloqueen releases.
El recalculo esté cubierto.
Las reprogramaciones estén cubiertas.
La privacidad esté verificada desde red y servidor.
47. Documentos relacionados

Consultar:

docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/09-Deployment.md
docs/12-CentroDiagnostico.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
48. Conclusión

El testing de Kickoff debe proteger la justicia de la quiniela.

Los escenarios más importantes no son únicamente que una página cargue, sino que:

Un exacto siempre valga lo correcto.
Un pronóstico tarde nunca sea aceptado.
Un pronóstico abierto nunca se filtre.
Una reprogramación no rompa el torneo.
Un resultado nunca quede procesado a medias.
La clasificación pueda reconstruirse.
Los administradores no obtengan ventajas deportivas.

La versión 1.0 no deberá publicarse hasta que estos comportamientos estén cubiertos y verificados.