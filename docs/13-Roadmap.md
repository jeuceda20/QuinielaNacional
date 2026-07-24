# Roadmap del Proyecto

## Quiniela Nacional La Goleada

**Versión del documento:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Plan inicial de implementación  
**Objetivo de la primera versión:** Publicar una quiniela funcional, segura, auditable y operable con costo obligatorio igual a cero  
**Enfoque:** Desarrollo incremental orientado por riesgos

---

## 1. Propósito

Este documento define el roadmap de implementación de **Quiniela Nacional La Goleada – Kickoff**.

El roadmap organiza el desarrollo en fases para evitar construir toda la aplicación al mismo tiempo.

Cada fase deberá:

- Tener objetivos claros.
- Producir resultados verificables.
- Incluir criterios de aceptación.
- Incluir pruebas.
- Reducir riesgos.
- Mantener compatibilidad con la arquitectura definida.
- Evitar dependencias obligatorias de pago.

Este roadmap no representa fechas contractuales.

Las fechas reales dependerán de:

- Disponibilidad del equipo.
- Complejidad encontrada.
- Cambios de alcance.
- Límites de proveedores gratuitos.
- Resultados de pruebas.
- Hallazgos de seguridad.

---

# 2. Principios del roadmap

## ROAD-001 — Primero la integridad

Las reglas de negocio críticas se implementarán antes que las funciones decorativas.

Prioridad:

1. Pronósticos.
2. Cierre.
3. Privacidad.
4. Puntuación.
5. Clasificación.
6. Procesamiento.
7. Auditoría.
8. Administración.
9. Mejoras visuales.

---

## ROAD-002 — Primero el flujo completo mínimo

Se buscará completar tempranamente un flujo vertical:


Usuario
→ Partido
→ Pronóstico
→ Resultado
→ Puntos
→ Clasificación

Este flujo deberá funcionar antes de construir herramientas secundarias.

ROAD-003 — Sin deuda funcional crítica

No se postergarán para después de producción:

Validación del servidor.
Seguridad por roles.
Cierre por hora del servidor.
Privacidad de pronósticos.
Transacciones de procesamiento.
Auditoría.
Recalculo.
ROAD-004 — Funciones peligrosas al final

Se implementarán después del núcleo:

SQL Console.
SQL de escritura.
Importaciones.
Generador masivo.
Restauración desde interfaz.
Herramientas avanzadas.
ROAD-005 — Producción gradual

La aplicación no deberá iniciar directamente con una temporada oficial.

Antes se ejecutarán:

Pruebas automatizadas.
Temporada ficticia.
Simulación completa.
Prueba con usuarios seleccionados.
Revisión operativa.
3. Alcance de la versión 1.0

La versión 1.0 deberá incluir como mínimo:

Registro público.
Confirmación de correo.
Aprobación administrativa.
Login y sesiones.
Recuperación de contraseña.
Roles.
Equipos.
Temporadas.
Jornadas.
Partidos.
Partido doble.
Pronósticos.
Cierre cinco minutos antes.
Privacidad temporal.
Resultados.
Puntuación.
Clasificación.
Posiciones compartidas.
Reprogramación.
Suspensión.
Cancelación.
Auditoría.
Recalculo.
Dashboard.
Notificaciones internas básicas.
Patrocinadores.
Diagnóstico esencial.
Exportación funcional.
Despliegue gratuito.
Manuales.
Pruebas automatizadas.
4. Elementos fuera del alcance inicial

No son obligatorios para la primera versión:

Aplicación móvil nativa.
Múltiples ligas privadas.
Chat.
Comentarios públicos.
Pagos.
Premios financieros.
Inicio de sesión con Google.
Inicio de sesión con redes sociales.
Avatares personales.
Estadísticas deportivas externas.
Resultados automáticos desde terceros.
Notificaciones push.
WebSockets.
Microservicios.
Inteligencia artificial.
Apuestas.
Integración con casas de apuestas.
Marketplace.
Sistema de referidos.
5. Estrategia de versiones
0.1 — Base técnica
0.2 — Autenticación
0.3 — Gestión deportiva
0.4 — Pronósticos
0.5 — Resultados y clasificación
0.6 — Administración completa
0.7 — Diagnóstico y recuperación
0.8 — Estabilización
0.9 — Piloto
1.0 — Producción

Las versiones pueden agruparse o cambiar según el progreso real.

6. Fase 0 — Preparación documental
Objetivo

Eliminar ambigüedades antes de comenzar a programar.

Entregables
README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/09-Deployment.md
docs/10-ManualAdministrador.md
docs/11-ManualUsuario.md
docs/12-CentroDiagnostico.md
docs/13-Roadmap.md
Documentos restantes.
Criterios de aceptación
Reglas principales documentadas.
Arquitectura seleccionada.
Modelo de datos definido.
Roles definidos.
Flujo de registro definido.
Estados de partidos definidos.
Procesamiento definido.
Seguridad definida.
Testing definido.
Deployment definido.
Estado
EN PROGRESO
7. Fase 1 — Inicialización técnica
Versión objetivo
0.1
Objetivo

Crear una base de proyecto estable, compilable y desplegable.

Tareas
Proyecto
Crear repositorio.
Inicializar Next.js.
Configurar TypeScript estricto.
Configurar App Router.
Configurar Tailwind CSS.
Configurar ESLint.
Configurar Prettier.
Configurar aliases.
Crear estructura modular.
Base de datos
Instalar Prisma.
Configurar PostgreSQL.
Crear esquema inicial.
Crear primera migración.
Crear cliente Prisma reutilizable.
Validación
Configurar validación de variables de entorno.
Configurar esquemas de entrada.
Configurar manejo de errores.
Testing
Instalar Vitest.
Instalar Playwright.
Configurar base de testing.
Crear primera prueba unitaria.
Crear primer smoke test.
CI
Crear GitHub Actions.
Ejecutar:
Lint.
Typecheck.
Unit tests.
Build.
Entregables
Aplicación inicia localmente
Build exitoso
Base conecta
Migración aplica
Pipeline funciona
Criterios de aceptación
npm install funciona.
npm run dev funciona.
npm run build funciona.
npm run lint funciona.
npm run typecheck funciona.
npm test funciona.
Prisma conecta.
Variables inválidas detienen el arranque.
No hay secretos en el repositorio.
8. Fase 2 — Modelo de dominio y reglas puras
Versión objetivo
0.1–0.2
Objetivo

Implementar las reglas fundamentales sin depender todavía de la UI.

Tareas
Puntuación
Desenlace local.
Desenlace visitante.
Empate.
Exacto.
Parcial.
Incorrecto.
Sin pronóstico.
Multiplicador doble.
Clasificación
Orden por puntos.
Desempate por exactos.
Posiciones compartidas.
Tendencia.
Participante con cero puntos.
Tiempo
Cálculo de cierre.
Comparación con servidor.
Conversión UTC.
Presentación en Honduras.
Estados
Transiciones de temporada.
Transiciones de jornada.
Transiciones de partido.
Reprogramación.
Suspensión.
Cancelación.
Procesamiento.
Permisos
USER.
ADMIN.
SUPER_ADMIN.
Pruebas obligatorias
Exacto normal.
Exacto doble.
Parcial normal.
Parcial doble.
Incorrecto.
0-0.
Cierre un segundo antes.
Cierre exacto.
Un segundo después.
Posiciones 1, 2, 2, 4.
Jornada 5 después de Jornada 10.
Transiciones inválidas.
Criterios de aceptación
Reglas implementadas como funciones o servicios de dominio.
Sin dependencia de componentes React.
Cobertura alta del dominio.
Tiempo controlable en pruebas.
Puntuación reproducible.
9. Fase 3 — Autenticación y usuarios
Versión objetivo
0.2
Objetivo

Permitir registro, confirmación, aprobación y acceso seguro.

Tareas
Registro
Formulario.
Validación.
Normalización.
Correo único.
Nickname único.
Equipo favorito.
Estado inicial.
Confirmación
Token seguro.
Hash del token.
Expiración.
Reenvío.
Plantilla de correo.
Aprobación
Lista de pendientes.
Aprobar.
Rechazar.
Auditoría.
Incorporación a temporada activa.
Login
Verificación de contraseña.
Sesión opaca.
Cookie segura.
Logout.
Estados bloqueados.
Recuperación
Solicitud genérica.
Token temporal.
Restablecimiento.
Revocación de sesiones.
Setup inicial
Crear primer superadministrador.
Token de setup.
Bloqueo de segundo setup.
Pruebas
Registro correcto.
Correo duplicado.
Nickname duplicado.
Confirmación.
Token expirado.
Token reutilizado.
Aprobación sin confirmación.
Login correcto.
Login pendiente.
Sesión revocada.
Setup simultáneo.
Criterios de aceptación
Usuario no aprobado no accede.
Password nunca se guarda en texto plano.
Sesiones revocables.
Correo inmutable.
Primer superadministrador único.
Rate limiting básico activo.
10. Fase 4 — Catálogos y temporadas
Versión objetivo
0.3
Objetivo

Permitir configurar la estructura deportiva.

Tareas
Equipos
Seed de doce equipos.
Logos.
Activación.
Equipo favorito.
Temporadas
Crear.
Editar en borrador.
Activar.
Configurar reglas.
Una activa.
Participantes.
Jornadas
Crear.
Nombrar libremente.
Secuencia.
Publicar.
Archivar.
Partidos
Crear.
Editar.
Validar equipos.
Fecha real.
Hora.
Cierre.
Detección de duplicado.
Partido doble
Seleccionar uno por jornada.
Validar al publicar.
Prevenir dos dobles.
Pruebas
Dos temporadas activas rechazadas.
Jornada sin partidos.
Jornada sin doble.
Jornada con dos dobles.
Partido con mismo equipo.
Partido duplicado advertido.
Fecha convertida correctamente.
Criterios de aceptación
Admin puede preparar una temporada completa.
Usuarios ven partidos publicados.
Orden cronológico usa fechas.
Jornada no define cronología.
Exactamente un doble por jornada publicada.
11. Fase 5 — Pronósticos
Versión objetivo
0.4
Objetivo

Permitir que los usuarios pronostiquen de forma segura.

Tareas
Vista
Lista de partidos abiertos.
Tarjetas de partido.
Inputs de goles.
Indicador doble.
Contador.
Estados de guardado.
Persistencia
Crear pronóstico.
Actualizar pronóstico.
Un pronóstico por usuario y partido.
Validar participante.
Validar marcador.
Validar cierre en servidor.
Privacidad
Solo pronóstico propio antes del cierre.
Pronósticos generales después.
Puntos ocultos hasta procesamiento.
Caché privada.
Dashboard
Próximo cierre.
Pendientes.
Pronósticos enviados.
Resumen personal.
Pruebas
Guardar abierto.
Editar abierto.
Rechazar en cierre.
Rechazar después.
0-0 válido.
Duplicados imposibles.
Usuario no participante rechazado.
Usuario A no ve B antes del cierre.
Admin no ve B antes del cierre.
Caché no comparte datos.
Criterios de aceptación
El reloj del cliente no controla el cierre.
Los pronósticos abiertos no se filtran.
El usuario puede verificar el guardado.
La última versión válida queda persistida.
El uso móvil es funcional.
12. Fase 6 — Resultados y clasificación
Versión objetivo
0.5
Objetivo

Completar el ciclo principal de la quiniela.

Tareas
Procesamiento
Ingreso de resultado.
Confirmación.
Evaluación de pronósticos.
Puntos.
Exactos.
Parciales.
Estado procesado.
Resumen.
Clasificación
Totales.
Orden.
Desempate.
Posiciones compartidas.
Tendencia.
Snapshots.
Resultados públicos
Resultado oficial.
Pronósticos.
Tipo de acierto.
Puntos.
Partido doble.
Transacciones
Todo o nada.
Prevención de procesamiento duplicado.
Idempotencia.
Auditoría.
Pruebas
Procesamiento normal.
Partido doble.
Sin pronóstico.
Dos administradores.
Repetición idempotente.
Fallo durante transacción.
Tabla 1, 2, 2, 4.
Puntos ocultos antes.
Puntos visibles después.
Criterios de aceptación
Un partido puede procesarse una vez.
No existen puntuaciones parciales.
La tabla se actualiza correctamente.
El resultado queda auditado.
El usuario puede explicar sus puntos.
13. Fase 7 — Estados especiales de partido
Versión objetivo
0.5–0.6
Objetivo

Manejar correctamente excepciones del calendario.

Tareas
Reprogramación
Nueva fecha.
Nueva hora.
Historial.
Conservación de pronósticos.
Reapertura opcional.
Nuevo cierre.
Suspensión
Suspender.
Conservar datos.
Bloquear procesamiento.
Reanudar.
Cancelación
Cancelar.
Cero impacto.
Historial.
Auditoría.
Corrección
Nueva versión de resultado.
Motivo.
Recalculo.
Auditoría reforzada.
Pruebas
Jornada 5 después de Jornada 10.
Reprogramación abierta.
Reprogramación cerrada.
Reapertura.
Sin reapertura.
Suspensión.
Reanudación.
Cancelación.
Corrección de resultado.
Criterios de aceptación
Reprogramar no elimina pronósticos.
El orden de jornada no rompe el flujo.
Un cancelado no entrega puntos.
Un suspendido no se procesa.
La corrección reconstruye la clasificación.
14. Fase 8 — Administración y auditoría
Versión objetivo
0.6
Objetivo

Completar la operación administrativa diaria.

Tareas
Usuarios
Filtros.
Búsqueda.
Bloqueo.
Desbloqueo.
Desactivación.
Reactivación.
Roles
Promover admin.
Retirar admin.
Historial de roles.
Protección del superadministrador.
Auditoría
Registro append-only.
Filtros.
Detalle.
Antes y después.
Request ID.
Patrocinadores
Crear.
Imagen.
Enlace.
Orden.
Activar.
Desactivar.
Configuración
Nombre.
Logo.
Textos.
Mantenimiento.
Configuración pública.
Pruebas
Usuario no accede.
Admin accede.
Admin no promueve.
Superadmin promueve.
Auditoría sin secretos.
Patrocinador ausente no rompe UI.
URL peligrosa rechazada.
Mantenimiento protegido.
Criterios de aceptación
La operación diaria no requiere SQL.
Todas las acciones críticas se auditan.
Los permisos se aplican en servidor.
Los patrocinadores son opcionales.
El superadministrador está protegido.
15. Fase 9 — Notificaciones y correo
Versión objetivo
0.6–0.7
Objetivo

Mejorar la comunicación sin crear dependencia de servicios pagados.

Tareas
Notificaciones internas
Cuenta aprobada.
Partido reprogramado.
Partido suspendido.
Partido cancelado.
Resultado procesado.
Aviso administrativo.
Marcado como leído.
Correo
Confirmación.
Recuperación.
Cuenta aprobada opcional.
Avisos críticos.
Recordatorios

Evaluar recordatorios previos al cierre.

Solo implementar si:

Existe scheduler gratuito fiable.
No excede límites de Gmail.
No crea costos.
Puede deshabilitarse.
Criterios de aceptación
Registro y recuperación funcionan por correo.
Fallo SMTP no rompe la aplicación completa.
Notificaciones internas funcionan sin correo.
No se envían correos masivos innecesarios.
No aparecen tokens en logs.
16. Fase 10 — Centro de diagnóstico esencial
Versión objetivo
0.7
Objetivo

Detectar y resolver inconsistencias sin usar directamente la base.

Alcance obligatorio de versión 1.0
Estado general.
Database ping.
SMTP test.
Conteos.
Verificación de integridad.
Comparación de clasificación.
Recalculo.
Errores recientes.
Exportación funcional.
Información de despliegue.
Historial de ejecuciones.
Alcance avanzado opcional
Importaciones.
Simulador.
SQL Console.
SQL Write.
Reparaciones avanzadas.
Restauración desde interfaz.
Pruebas
Acceso solo superadmin.
Flag de entorno.
Sin secretos.
Recalculo transaccional.
Dos recalculos rechazados.
Exportación segura.
SMTP limitado.
Integridad detecta errores.
Criterios de aceptación
Clasificación reconstruible.
Errores localizables por Request ID.
Herramientas peligrosas apagadas.
Exportaciones sin secretos.
Integridad cubre reglas críticas.
17. Fase 11 — Exportaciones y respaldo
Versión objetivo
0.7
Objetivo

Permitir recuperación y preservación del historial.

Tareas
Exportación JSON.
Exportación CSV.
Backup funcional.
Checksum.
Expiración.
Descarga autorizada.
Protección de fórmulas.
Registro de descarga.
Guía de restauración.
Pruebas
Archivo válido.
Conteos correctos.
Sin hashes.
Sin tokens.
Sin sesiones.
Descarga no autorizada.
Expiración.
CSV injection.
Criterios de aceptación
Existe un backup verificable.
Puede restaurarse en testing.
El archivo no queda público.
La exportación está auditada.
18. Fase 12 — UI, accesibilidad y responsive
Versión objetivo
0.8
Objetivo

Completar la experiencia visual y de uso.

Tareas
Responsive
320 px.
375 px.
390 px.
Tablet.
Escritorio.
Pantallas grandes.
Accesibilidad
Teclado.
Foco.
Labels.
Contraste.
Errores.
Lectores de pantalla.
Movimiento reducido.
Estados
Loading.
Empty.
Error.
Guardando.
Guardado.
Cerrado.
Mantenimiento.
Visuales
Logos.
Iconos.
Tabla.
Cards.
Modales.
Toasts.
Patrocinadores.
Criterios de aceptación
No existe desbordamiento crítico.
Pronosticar desde teléfono es sencillo.
Los estados no dependen del color.
Los formularios son navegables.
Las acciones peligrosas son claras.
19. Fase 13 — Seguridad y endurecimiento
Versión objetivo
0.8
Objetivo

Preparar el sistema para exposición pública.

Tareas
Revisar autorización.
Revisar IDOR.
Revisar CSRF.
Revisar XSS.
Revisar SQL injection.
Configurar CSP.
Configurar cabeceras.
Cookies seguras.
Rate limiting.
Redacción de logs.
Protección de exportaciones.
Reautenticación.
Deshabilitar herramientas.
Auditar dependencias.
Pruebas
Fuerza bruta.
Token reutilizado.
Cookie alterada.
Usuario en admin.
Admin en superadmin.
XSS.
SQL injection.
CSRF.
Exportación ajena.
SQL deshabilitado.
Test data deshabilitado.
Criterios de aceptación
No existen hallazgos críticos abiertos.
Secretos fuera del repositorio.
Cookies seguras.
Rate limiting activo.
Diagnóstico cerrado.
SQL cerrado.
Logs sanitizados.
20. Fase 14 — Rendimiento y estabilidad
Versión objetivo
0.8–0.9
Objetivo

Validar que la aplicación soporte el volumen esperado.

Escenarios
50 usuarios
100 usuarios
200 usuarios
500 usuarios

Con:

Múltiples jornadas.
Miles de pronósticos.
Procesamientos.
Recalculos.
Exportaciones.
Tareas
Revisar índices.
Detectar N+1.
Optimizar dashboard.
Optimizar tabla.
Medir procesamiento.
Medir recalculo.
Medir exportación.
Revisar memoria.
Revisar conexiones.
Revisar límites gratuitos.
Criterios de aceptación
Flujo normal responde razonablemente.
Procesamiento no excede límites.
Recalculo es viable.
No agota conexiones.
No existe crecimiento descontrolado de logs.
Los límites gratuitos son suficientes para el piloto.
21. Fase 15 — Temporada simulada
Versión objetivo
0.9
Objetivo

Ejecutar una temporada completa con datos ficticios.

Escenario mínimo
50 usuarios.
10 jornadas.
5 partidos por jornada.
1 doble por jornada.
Reprogramaciones.
Suspensión.
Cancelación.
Corrección.
Usuario tardío.
Empates.
Procedimiento
Crear temporada de prueba.
Crear participantes.
Crear jornadas.
Generar pronósticos.
Cerrar partidos.
Procesar uno a uno.
Revisar tabla.
Reprogramar un partido.
Corregir un resultado.
Recalcular.
Comparar.
Cerrar temporada.
Exportar.
Restaurar en otra base.
Criterios de aceptación
No hay diferencias tras recalculo.
El historial se conserva.
La tabla final es correcta.
El backup puede restaurarse.
Los manuales coinciden con el comportamiento.
22. Fase 16 — Piloto con usuarios reales
Versión objetivo
0.9
Objetivo

Probar la aplicación con un grupo pequeño antes de la competencia oficial.

Alcance sugerido
5 a 15 participantes
1 a 3 jornadas de prueba
Validaciones
Registro.
Correo.
Aprobación.
Uso móvil.
Pronósticos.
Comprensión del cierre.
Resultado.
Tabla.
Reprogramaciones.
Soporte.
Recopilación de feedback

Preguntar:

¿Fue fácil registrarse?
¿Fue claro guardar?
¿Entendió el partido doble?
¿Entendió cuándo cerraba?
¿Encontró la tabla?
¿Tuvo problemas en teléfono?
¿Confió en que el pronóstico quedó guardado?
Criterios de aceptación
Sin errores críticos.
Usuarios pueden pronosticar sin ayuda.
Flujo de correo funciona.
El administrador puede operar usando el manual.
Las dudas recurrentes se corrigen en UI o documentación.
23. Fase 17 — Preparación de producción
Versión objetivo
1.0-rc
Objetivo

Dejar lista la versión candidata.

Tareas
Elegir proveedores definitivos.
Crear base de producción.
Crear Gmail.
Configurar variables.
Aplicar migraciones.
Ejecutar seed.
Crear superadministrador.
Cerrar setup.
Configurar HTTPS.
Configurar headers.
Crear backup inicial.
Ejecutar smoke tests.
Verificar límites.
Verificar monitoreo.
Revisar manuales.
Checklist de bloqueo

No continuar si:

Existe una prueba crítica fallida.
Hay vulnerabilidad crítica.
No hay backup.
Setup permanece abierto.
SQL está habilitado.
Test data está habilitado.
SMTP no funciona.
La zona horaria es incorrecta.
El recalculo produce diferencias.
24. Fase 18 — Lanzamiento de versión 1.0
Objetivo

Iniciar la primera temporada oficial.

Actividades
Publicar aplicación.
Confirmar health.
Abrir registro.
Aprobar usuarios.
Crear temporada.
Crear jornadas.
Publicar partidos.
Confirmar doble.
Comunicar reglas.
Crear backup.
Monitorear primera jornada.
Atención especial

Durante la primera jornada revisar:

Registro.
Guardado.
Contadores.
Cierres.
Privacidad.
Carga móvil.
Procesamiento.
Tabla.
Notificaciones.
Logs.
25. Fase 19 — Soporte posterior al lanzamiento
Objetivo

Estabilizar la aplicación después de iniciar producción.

Primera semana
Revisar errores diariamente.
Verificar espacio.
Verificar SMTP.
Verificar cierres.
Revisar pronósticos pendientes.
Revisar auditoría.
Crear backup adicional.
Primer mes
Analizar uso.
Ajustar rate limits.
Optimizar consultas.
Corregir UX.
Actualizar manuales.
Revisar proveedores.
Probar restauración.
26. Roadmap posterior a versión 1.0

Las mejoras deberán evaluarse según valor, riesgo y gratuidad.

Versión 1.1 — Mejoras operativas

Posibles funciones:

Filtros mejorados.
Exportaciones adicionales.
Historial personal detallado.
Estadísticas por usuario.
Búsqueda avanzada.
Mejoras de dashboard.
Reintento de notificaciones.
Consultas guardadas de diagnóstico.
Versión 1.2 — Experiencia

Posibles funciones:

Instalación como PWA.
Modo oscuro.
Personalización visual.
Compartir tabla como imagen.
Resumen de jornada.
Mejor accesibilidad.
Más opciones de notificación.
Versión 1.3 — Automatización

Solo si existe una opción gratuita fiable:

Recordatorios automáticos.
Limpieza programada.
Backups programados.
Health checks externos.
Alertas automáticas.
Reportes periódicos.
Versión 2.0 — Expansión

Posibles funciones:

Varias competencias.
Varias temporadas simultáneas.
Múltiples grupos privados.
Invitaciones.
Reglas configurables por liga.
Más roles.
API externa.
Aplicación móvil.

La versión 2.0 requerirá una revisión arquitectónica.

27. Funciones no recomendadas

No se recomienda implementar sin una necesidad clara:

Chat interno.
Feed social.
Reacciones.
Rankings secundarios complejos.
Sistema de puntos manuales.
Edición administrativa de pronósticos.
Integración con apuestas.
Publicidad invasiva.
Resultados externos no verificables.
Microservicios.
Blockchain.

Estas funciones aumentan costo y complejidad sin proteger el objetivo principal.

28. Prioridad MoSCoW
Must Have
Autenticación.
Aprobación.
Pronósticos.
Cierre.
Privacidad.
Puntuación.
Partido doble.
Resultados.
Clasificación.
Reprogramación.
Roles.
Auditoría.
Recalculo.
Testing.
Deployment.
Should Have
Notificaciones internas.
Patrocinadores.
Dashboard.
Exportaciones.
Diagnóstico.
Suspensión.
Cancelación.
Corrección versionada.
Could Have
Recordatorios por correo.
Importación CSV.
Simulador avanzado.
SQL Console.
PWA.
Modo oscuro.
Estadísticas avanzadas.
Won't Have en 1.0
Pagos.
Apuestas.
App nativa.
Múltiples ligas.
Chat.
Login social.
Avatares.
Integración automática de resultados.
29. Dependencias entre fases
Inicialización
    ↓
Dominio
    ↓
Autenticación
    ↓
Temporadas y partidos
    ↓
Pronósticos
    ↓
Procesamiento y tabla
    ↓
Estados especiales
    ↓
Administración
    ↓
Diagnóstico
    ↓
Estabilización
    ↓
Piloto
    ↓
Producción

No deberá implementarse procesamiento antes de tener:

Pronósticos.
Resultados.
Reglas.
Participantes.
Transacciones.
30. Ruta crítica

La ruta crítica hacia producción es:

Proyecto base
→ Modelo de datos
→ Autenticación
→ Temporada
→ Partidos
→ Pronósticos
→ Cierre
→ Procesamiento
→ Clasificación
→ Auditoría
→ Recalculo
→ Testing
→ Deployment

Las funciones que no pertenecen a esta ruta no deberán bloquear innecesariamente el avance.

31. Hitos
Hito A — Proyecto funcional

La aplicación:

Compila.
Conecta.
Migra.
Ejecuta pruebas.
Hito B — Usuario autenticado

Un usuario:

Se registra.
Confirma.
Es aprobado.
Inicia sesión.
Hito C — Primer pronóstico

Un usuario guarda un pronóstico válido.

Hito D — Primer partido procesado

Un administrador procesa un resultado y la tabla cambia.

Hito E — Jornada completa

Cinco partidos procesados, incluyendo doble.

Hito F — Reprogramación validada

Un partido de jornada anterior se procesa después de una jornada posterior.

Hito G — Recalculo reproducible

La clasificación reconstruida coincide exactamente.

Hito H — Piloto exitoso

Usuarios reales completan jornadas de prueba.

Hito I — Versión 1.0

Primera jornada oficial procesada sin incidentes críticos.

32. Criterios de entrada a piloto

Antes del piloto:

Funciones Must Have completas.
Pruebas críticas exitosas.
Sin errores críticos abiertos.
SMTP funcional.
Responsive validado.
Recalculo funcional.
Auditoría funcional.
Manual de usuario disponible.
Manual de administrador disponible.
Backup probado.
33. Criterios de entrada a producción

Antes de producción:

Piloto exitoso.
Bugs críticos cerrados.
Bugs altos resueltos o aceptados formalmente.
Seguridad revisada.
Proveedores seleccionados.
Variables configuradas.
Migraciones probadas.
Backups disponibles.
Restore probado.
Smoke tests exitosos.
Centro de diagnóstico restringido.
SQL deshabilitado.
Setup cerrado.
34. Criterios de salida de versión 1.0

La versión 1.0 será considerada estable cuando:

Se complete una jornada oficial.
Todos los partidos puedan procesarse.
No existan diferencias de recalculo.
No haya filtraciones de pronósticos.
No se acepten pronósticos tardíos.
La tabla sea correcta.
Los backups funcionen.
La operación pueda realizarse desde el panel.
No sea necesario modificar la base manualmente.
35. Gestión de cambios

Toda nueva función deberá responder:

¿Es necesaria para versión 1.0?
¿Protege una regla crítica?
¿Bloquea la ruta crítica?
¿Requiere un servicio pagado?
¿Aumenta riesgo de seguridad?
¿Tiene pruebas?
¿Está documentada?

Las funciones no esenciales se moverán al backlog.

36. Backlog inicial
Funcional
Histórico detallado por usuario.
Gráficos.
Estadísticas.
Comparación entre usuarios.
Resumen semanal.
Compartir clasificación.
Configuración de notificaciones.
Importación masiva.
Técnico
PWA.
Mejor caché.
Operaciones largas reanudables.
Compresión de exportaciones.
Métricas avanzadas.
Pruebas visuales automáticas.
Rotación automatizada de logs.
Administrativo
Permisos granulares.
Consultas guardadas.
Restauración desde UI.
Revisión de auditoría por estado.
Flujos de aprobación doble.
37. Riesgos del roadmap
Cambio en planes gratuitos

Mitigación:

Arquitectura portable.
Backup.
PostgreSQL estándar.
Proveedores alternativos.
Complejidad de autenticación

Mitigación:

Implementar temprano.
Pruebas de seguridad.
Sesiones simples y opacas.
Operaciones largas en serverless

Mitigación:

Procesar por lotes.
Mantener volumen esperado.
Probar recalculo temprano.
Evitar arquitectura innecesaria.
Cambios de reglas durante desarrollo

Mitigación:

Documentos aprobados.
ADR.
Versionado de reglas.
Congelar reglas antes del piloto.
Sobrecrecimiento del alcance

Mitigación:

MoSCoW.
Ruta crítica.
Backlog separado.
No implementar “Could Have” antes de Must Have.
38. Estrategia para Codex

Codex deberá trabajar por fases pequeñas.

Cada solicitud deberá indicar:

Documento fuente.
Objetivo.
Archivos permitidos.
Criterios de aceptación.
Pruebas requeridas.
Restricciones.

No se deberá solicitar:

Construye toda la aplicación completa.

Se deberá solicitar:

Implementa el módulo de puntuación según docs/04-ReglasNegocio.md y agrega pruebas unitarias.
39. Orden recomendado de prompts para Codex
1. Inicializar proyecto
2. Crear estructura modular
3. Configurar Prisma
4. Crear modelo de datos
5. Implementar reglas de puntuación
6. Implementar clasificación
7. Implementar autenticación
8. Implementar setup inicial
9. Implementar usuarios
10. Implementar equipos
11. Implementar temporadas
12. Implementar jornadas
13. Implementar partidos
14. Implementar pronósticos
15. Implementar privacidad
16. Implementar procesamiento
17. Implementar clasificación UI
18. Implementar reprogramación
19. Implementar auditoría
20. Implementar recalculo
21. Implementar diagnóstico
22. Implementar exportaciones
23. Endurecer seguridad
24. E2E
25. Deployment
40. Definición de “Done”

Una tarea no estará completa únicamente porque compile.

Debe cumplir:

Implementación.
Validación.
Autorización.
Manejo de errores.
Pruebas.
Documentación.
Sin secretos.
Sin warnings críticos.
Build exitoso.
Criterios de aceptación.
41. Seguimiento de avance

Se podrá utilizar un tablero con estados:

BACKLOG
READY
IN_PROGRESS
IN_REVIEW
TESTING
DONE
BLOCKED

Cada tarea deberá incluir:

Fase.
Prioridad.
Dependencias.
Criterios.
Riesgo.
Documento relacionado.
42. Indicadores de progreso

No medir únicamente líneas de código.

Indicadores útiles:

Reglas cubiertas.
Pruebas exitosas.
Flujos completos.
Bugs críticos.
Hallazgos de seguridad.
Cobertura del dominio.
Tiempo de procesamiento.
Diferencias de recalculo.
Tareas Must Have terminadas.
43. Política de deuda técnica

La deuda técnica se clasificará:

Crítica

Afecta:

Seguridad.
Privacidad.
Puntuación.
Integridad.
Recuperación.

Debe resolverse antes de producción.

Importante

Afecta mantenibilidad o rendimiento.

Debe planificarse.

Menor

Cosmética o refactor opcional.

Puede entrar al backlog.

44. Política de congelamiento

Antes del piloto se congelarán:

Reglas de puntuación.
Cierre.
Desempates.
Partido doble.
Privacidad.
Estados principales.

Cambios posteriores deberán:

Documentarse.
Evaluar migración.
Actualizar pruebas.
Informarse a usuarios.
45. Documentos pendientes después del roadmap

Después de este documento deben completarse:

docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/16-Glosario.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md

Posteriormente se prepararán:

Prompts de implementación.
Tareas por fase.
Checklist de inicio para Codex.
Matriz de trazabilidad final.
46. Criterios de aceptación del roadmap

El roadmap será aceptado cuando:

Exista una ruta clara hacia versión 1.0.
Las dependencias estén identificadas.
Las funciones críticas tengan prioridad.
El piloto sea obligatorio.
El recalculo se implemente antes de producción.
La seguridad esté incluida.
El deployment esté incluido.
La gratuidad sea considerada.
Existan criterios de entrada y salida.
Las funciones futuras estén separadas.
47. Documentos relacionados

Consultar:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/09-Deployment.md
docs/10-ManualAdministrador.md
docs/11-ManualUsuario.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
48. Conclusión

Kickoff deberá desarrollarse en incrementos pequeños, verificables y seguros.

El primer objetivo no es construir todas las funciones posibles.

El primer objetivo es garantizar que el ciclo principal funcione correctamente:

Pronosticar
Cerrar
Procesar
Puntuar
Clasificar
Auditar
Reconstruir

Las mejoras secundarias solo deberán avanzar cuando ese ciclo sea estable.

La versión 1.0 deberá ser sencilla, portable, gratuita de operar y suficientemente robusta para proteger la confianza de todos los participantes.