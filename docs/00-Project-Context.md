# Project Context

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Idioma principal:** Español  
**Zona horaria oficial:** `America/Tegucigalpa`  
**Estado:** Diseño y documentación previos al desarrollo

---

## 1. Propósito de este documento

Este archivo es el punto de entrada obligatorio para cualquier desarrollador, agente de IA o herramienta de automatización que participe en el proyecto.

Antes de crear, modificar o eliminar código, se deberá leer este documento y consultar los archivos especializados ubicados en `docs/`.

Este documento resume:

- La visión del producto.
- Las restricciones no negociables.
- Las principales reglas de negocio.
- La arquitectura objetivo.
- Los roles del sistema.
- Las decisiones que no deben reinterpretarse.
- El orden recomendado de implementación.

No sustituye los documentos detallados. Su función es evitar que una implementación tome decisiones contrarias al producto definido.

---

## 2. Visión del producto

**Quiniela Nacional La Goleada** es una aplicación web responsive para organizar una única quiniela comunitaria de la Liga Nacional de Honduras.

Cualquier persona podrá solicitar una cuenta, pero solo podrá participar después de:

1. Confirmar su correo electrónico.
2. Ser aprobada por un administrador.

Los usuarios pronosticarán el marcador de los partidos y competirán en una clasificación general.

La experiencia debe priorizar:

- Simplicidad.
- Transparencia.
- Seguridad.
- Uso desde celular.
- Administración sin cálculos manuales.
- Operación sin servicios obligatorios de pago.

---

## 3. Restricción principal

> El proyecto debe poder desarrollarse, desplegarse y operar utilizando exclusivamente herramientas, bibliotecas y planes gratuitos.

Esta restricción es obligatoria.

No se deben introducir servicios que:

- Requieran tarjeta para funcionar en condiciones normales.
- Generen cobros automáticos inesperados.
- Sean esenciales y solo tengan una prueba temporal.
- Bloqueen la operación cuando expire un periodo gratuito.
- Obliguen a migrar la aplicación para continuar usándola sin pagar.

Si una funcionalidad no puede implementarse de forma gratuita y confiable, deberá:

1. Buscarse una alternativa gratuita.
2. Simplificarse.
3. Excluirse de la versión 1.0.

Nunca se debe ocultar un costo potencial.

---

## 4. Alcance funcional resumido

La versión 1.0 deberá incluir:

- Registro de usuarios.
- Confirmación de correo.
- Aprobación manual de cuentas.
- Inicio de sesión.
- Recuperación de contraseña.
- Roles de usuario, administrador y superadministrador.
- Una sola quiniela activa.
- Temporadas históricas.
- Doce equipos precargados.
- Jornadas con nombres personalizados.
- Partidos con fecha y hora propia.
- Pronósticos mediante marcador.
- Cierre cinco minutos antes de cada partido.
- Partido doble, exactamente uno por jornada.
- Procesamiento individual de resultados.
- Clasificación automática.
- Visualización pública de pronósticos después del cierre.
- Auditoría administrativa.
- Reprogramaciones y suspensiones.
- Dashboard de usuario.
- Panel administrativo.
- Centro de diagnóstico.
- Exportaciones y respaldos.
- Datos de prueba.
- Pruebas automatizadas.
- Documentación técnica y operativa.

---

## 5. Regla crítica sobre jornadas y fechas

El sistema nunca debe asumir que las jornadas se juegan en orden cronológico.

Ejemplo válido:

- Jornada 5: un partido se juega el 15 de octubre.
- Jornada 10: finaliza el 20 de septiembre.

Esto no es un error.

La jornada representa una agrupación deportiva y administrativa. La fecha y hora del partido determinan:

- Cuándo se puede pronosticar.
- Cuándo cierra el pronóstico.
- Cuándo aparece como próximo.
- Cuándo puede procesarse.
- Su estado actual.

La numeración o nombre de la jornada nunca debe utilizarse para inferir el orden de juego.

---

## 6. Sistema de puntuación

Las reglas iniciales son:

| Situación | Puntos | Partido doble |
|---|---:|---:|
| Marcador exacto | 3 | 6 |
| Acierta ganador o empate | 1 | 2 |
| Pronóstico incorrecto | 0 | 0 |
| Sin pronóstico | 0 | 0 |

### Desempate

1. Mayor cantidad de puntos.
2. Mayor cantidad de resultados exactos.
3. Si ambos valores coinciden, se comparte posición.

La tabla mostrará:

- Posición.
- Nickname.
- Resultados parciales.
- Resultados exactos.
- Puntos.
- Movimiento de posición.

---

## 7. Privacidad y transparencia de pronósticos

Mientras un partido esté abierto:

- Cada usuario solo podrá ver su propio pronóstico.
- Los pronósticos de otros usuarios permanecerán ocultos.

Después del cierre:

- Todos los participantes podrán ver todos los pronósticos.
- Ningún pronóstico podrá modificarse.
- Si el partido no fue procesado, no se mostrarán puntos.
- Después del procesamiento, se mostrarán los puntos obtenidos.

Esta regla es esencial para la honestidad de la quiniela.

---

## 8. Cierre de pronósticos

El cierre predeterminado será cinco minutos antes de la fecha y hora programada del partido.

El cálculo deberá realizarse en el servidor usando la zona horaria:


America/Tegucigalpa
La hora del dispositivo del usuario no será la fuente de verdad.

La interfaz podrá mostrar un contador regresivo, pero el backend siempre validará si el partido continúa abierto.

9. Roles
9.1 Usuario

Puede:

Consultar el dashboard.
Registrar y editar pronósticos antes del cierre.
Ver la clasificación.
Ver resultados.
Ver pronósticos cerrados.
Consultar su perfil.
Leer el reglamento.

No puede:

Aprobar usuarios.
Crear jornadas.
Crear partidos.
Procesar resultados.
Consultar herramientas administrativas.
9.2 Administrador

Puede:

Aprobar o rechazar usuarios.
Bloquear o desactivar usuarios.
Crear y editar jornadas.
Crear y editar partidos.
Reprogramar partidos.
Suspender o cancelar partidos.
Seleccionar el partido doble.
Procesar resultados.
Gestionar patrocinadores.
Consultar auditorías según permisos.

No puede:

Cambiar al superadministrador.
Promover administradores sin autorización.
Alterar configuraciones críticas reservadas.
Borrar auditorías.
9.3 Superadministrador

Es el propietario funcional del sistema.

Puede:

Realizar todas las funciones administrativas.
Promover o retirar administradores.
Configurar parámetros críticos.
Activar modo mantenimiento.
Acceder al centro de diagnóstico.
Ejecutar consultas seguras.
Generar datos de prueba.
Exportar respaldos.
Ejecutar el recalculo completo.

El primer superadministrador se crea mediante un flujo de inicialización protegido.

10. Datos del usuario

El registro deberá solicitar:

Nombre.
Apellido.
Nickname único.
Correo único.
Contraseña.
Confirmación de contraseña.
Equipo favorito.

El nickname será el nombre público usado en la tabla y resultados.

El nombre y apellido se almacenarán para identificación administrativa.

El correo será inmutable después del registro. No podrá cambiarlo el usuario ni un administrador.

No habrá foto ni avatar personal. El perfil mostrará el logo del equipo favorito.

11. Flujo de registro
El visitante completa el registro.
El sistema valida que correo y nickname sean únicos.
La contraseña se almacena únicamente como hash seguro.
Se envía un correo de confirmación mediante Gmail SMTP.
El usuario confirma su correo.
La cuenta queda pendiente de aprobación.
Un administrador aprueba o rechaza la solicitud.
Solo una cuenta confirmada, aprobada y activa puede iniciar sesión.

El rechazo, bloqueo y desactivación deben quedar auditados.

12. Primer inicio del sistema

Cuando no exista ningún superadministrador, se habilitará un proceso de instalación inicial.

Este proceso:

Debe estar protegido.
Debe crear exactamente un superadministrador inicial.
Debe marcar su correo como confirmado.
Debe aprobar automáticamente la cuenta.
Debe quedar deshabilitado después de completarse.
No debe volver a aparecer aunque se eliminen cookies o sesiones.

La condición debe depender de la base de datos, no del navegador.

13. Temporadas

La aplicación manejará una temporada activa a la vez.

Al finalizar una temporada se conservará:

Nombre.
Fecha de finalización.
Clasificación final.
Campeón o campeones.
Puntos.
Exactos.
Parciales.

No se debe borrar automáticamente información al cerrar una temporada.

Antes de limpiar datos operativos debe existir:

Respaldo.
Confirmación administrativa.
Auditoría.
Validación de que la tabla final fue archivada.
14. Jornadas

Las jornadas pueden llamarse:

Jornada 1.
Jornada 2.
Repechaje Ida.
Repechaje Vuelta.
Semifinal Ida.
Final Vuelta.

El nombre es libre y no modifica las reglas de puntuación.

Cada jornada debe tener exactamente un partido doble.

Una jornada podrá estar incompleta mientras se está configurando. El sistema podrá advertirlo, pero no deberá impedir su existencia automáticamente.

15. Partidos

Cada partido deberá contener al menos:

Temporada.
Jornada.
Equipo local.
Equipo visitante.
Fecha y hora.
Estado.
Indicador de partido doble.
Marcador oficial cuando corresponda.

Opcionalmente podrá contener:

Estadio.
Observaciones.
Motivo de reprogramación.
Fecha original.

No se permitirá que un equipo juegue contra sí mismo.

Se deberán detectar posibles duplicados, pero una advertencia no debe sustituir el criterio del administrador.

16. Estados de partido

Estados mínimos:

SCHEDULED: programado.
RESCHEDULED: reprogramado.
CLOSED: cerrado para pronósticos.
SUSPENDED: suspendido.
RESUMED: reanudado.
FINISHED_PENDING: finalizado pendiente de procesamiento.
PROCESSED: procesado.
CANCELLED: cancelado.

Los nombres técnicos exactos podrán ajustarse, pero su significado funcional debe conservarse.

El estado visible podrá derivarse parcialmente de la fecha, pero los estados de incidencia deberán persistirse explícitamente.

17. Reprogramaciones

Una reprogramación debe conservar:

Fecha y hora anterior.
Nueva fecha y hora.
Administrador responsable.
Fecha del cambio.
Motivo opcional.

La política de reapertura de pronósticos deberá aplicarse de forma consistente.

Regla inicial:

Si el partido todavía no fue procesado y la nueva fecha de cierre está en el futuro, podrá volver a estar abierto.
Cualquier reapertura posterior al cierre original deberá ser visible y auditada.
Los pronósticos previamente registrados se conservarán salvo decisión administrativa explícita.
18. Partido doble

Debe existir exactamente uno por jornada.

Debe mostrarse de forma llamativa mediante:

Etiqueta.
Icono.
Color o borde diferenciado.
Texto “Doble puntuación”.

No debe poder cambiarse libremente después de que un partido afectado haya sido procesado.

Cualquier corrección posterior deberá ejecutar un recalculo seguro y quedar auditada.

19. Procesamiento de resultados

Los partidos se procesan uno por uno.

Al procesar un partido, el sistema deberá:

Validar permisos.
Validar el estado del partido.
Validar el marcador.
Bloquear o controlar procesamiento simultáneo.
Guardar el resultado oficial.
Calcular puntos de todos los pronósticos.
Registrar exactos y parciales.
Actualizar o reconstruir la clasificación.
Registrar auditoría.
Confirmar la transacción.

Todo deberá ejecutarse de forma transaccional.

Si algo falla, ningún cambio parcial deberá permanecer guardado.

20. Clasificación como dato derivado

La clasificación no será la fuente primaria de verdad.

La fuente de verdad será:

Resultado oficial del partido.
Pronóstico del usuario.
Multiplicador del partido.
Reglas de puntuación aplicables.

La tabla podrá almacenarse como resumen para rendimiento, pero siempre deberá poder reconstruirse.

El sistema incluirá una función de recalculo completo.

21. Dashboard

El dashboard del usuario debe mostrar, como mínimo:

Saludo con nombre o nickname.
Posición actual.
Puntos.
Exactos.
Parciales.
Próximo partido.
Próximo cierre.
Cuenta regresiva.
Pronósticos pendientes.
Partido doble próximo.
Top 5.
Notificaciones internas.

Debe priorizar la información más próxima y útil.

Los partidos antiguos y procesados aparecerán después de los próximos encuentros.

22. Navegación principal

Para un usuario autenticado:

Dashboard.
Pronósticos.
Tabla.
Resultados.
Cómo funciona.
Patrocinadores.
Mi perfil.
Cerrar sesión.

Para administradores se añadirá:

Administración.

En celular deberá usarse una navegación compacta y accesible.

23. Patrocinadores

La aplicación tendrá espacios configurables para patrocinadores.

Inicialmente podrán estar vacíos.

Cada patrocinador podrá tener:

Nombre.
Imagen.
Enlace opcional.
Orden.
Estado activo.

No se debe romper el diseño cuando no existan patrocinadores.

24. Auditoría

La auditoría debe ser append-only desde la aplicación.

Debe registrar:

Actor.
Rol.
Acción.
Entidad afectada.
Identificador de entidad.
Valores anteriores cuando corresponda.
Valores nuevos cuando corresponda.
Fecha y hora.
Dirección IP cuando sea razonable.
Identificador de sesión o solicitud cuando sea útil.

Ningún administrador podrá editar o eliminar auditorías desde la interfaz.

Las consultas de auditoría deberán permitir filtros por:

Fecha.
Administrador.
Acción.
Tipo de entidad.
25. Centro de diagnóstico

Solo el superadministrador tendrá acceso completo.

Debe incluir:

Verificación de base de datos.
Verificación de SMTP.
Conteos principales.
Errores recientes.
Verificador de integridad.
Exportaciones.
Datos de prueba.
Simulador de jornadas.
Recalculo.
Consola SQL segura.
Consola SQL

Modo predeterminado:

Solo SELECT.

Cualquier modo de escritura deberá:

Requerir confirmación adicional.
Estar restringido al superadministrador.
Bloquear instrucciones peligrosas cuando corresponda.
Registrar consulta, actor y resultado en auditoría.

La consola SQL no debe exponerse en producción sin controles explícitos.

26. Datos de prueba

El sistema deberá poder generar:

Usuarios ficticios.
Jornadas.
Partidos.
Pronósticos aleatorios.
Resultados.

Los datos de prueba deberán identificarse claramente.

No deberán generarse accidentalmente en producción sin una confirmación reforzada.

Debe existir una forma segura de limpiar solo los datos de prueba.

27. Seguridad

Requisitos mínimos:

Contraseñas con hash seguro.
Cookies HttpOnly.
Cookies Secure en producción.
Política SameSite adecuada.
Protección contra CSRF.
Validación en servidor.
Sanitización de entradas.
Protección contra XSS.
Rate limiting en autenticación.
Tokens de confirmación y recuperación de un solo uso.
Expiración de tokens.
Control de acceso por rol en servidor.
Secretos solo en variables de entorno.
Mensajes de error que no revelen información sensible.

Nunca se confiará únicamente en restricciones de interfaz.

28. Correo electrónico

Se utilizará Gmail SMTP mediante una cuenta genérica creada para el proyecto.

Correos previstos:

Confirmación de cuenta.
Recuperación de contraseña.
Confirmación de restablecimiento.
Notificación opcional de aprobación.

Los recordatorios automáticos antes de los partidos solo se implementarán si pueden funcionar gratuitamente y con suficiente fiabilidad.

La aplicación debe seguir siendo utilizable aunque un correo no pueda enviarse, salvo cuando la confirmación sea obligatoria para completar el flujo.

29. Arquitectura objetivo

Tecnologías iniciales:

Next.js.
TypeScript estricto.
PostgreSQL.
Prisma.
Tailwind CSS.
Componentes accesibles.
Gmail SMTP.
Vitest.
Playwright.
GitHub.
Hosting y base de datos con planes gratuitos.

Las versiones específicas deberán verificarse al iniciar la implementación.

No se deben agregar dependencias innecesarias.

No se debe acoplar la lógica de negocio a un proveedor de hosting.

30. Diseño

Estilo:

Deportivo.
Moderno.
Minimalista.
Amigable.
Intuitivo.

La paleta se basará en el logo proporcionado, principalmente rojo y azul, manteniendo contraste accesible.

La interfaz debe funcionar correctamente en:

Celulares pequeños.
Celulares grandes.
Tabletas.
Laptops.
Monitores grandes.

El logo debe poder reemplazarse sin modificar componentes.

31. Soft delete y conservación

No se deben eliminar físicamente datos importantes desde operaciones normales.

Preferencias:

Usuarios: desactivar o bloquear.
Jornadas: archivar.
Partidos: cancelar o archivar.
Patrocinadores: desactivar.

Una eliminación física solo podrá ejecutarse mediante procesos administrativos específicos, respaldados y documentados.

32. Pruebas obligatorias

Deben existir pruebas para, al menos:

Exacto suma 3.
Parcial suma 1.
Incorrecto suma 0.
Partido doble multiplica por 2.
Sin pronóstico suma 0.
Empate pronosticado correctamente.
Cierre cinco minutos antes.
Bloqueo posterior al cierre.
Ocultamiento antes del cierre.
Visibilidad después del cierre.
Desempates.
Posiciones compartidas.
Reprogramaciones.
Procesamiento fuera del orden de jornadas.
Recalculo completo.
Autorización por rol.
Auditoría.
Aprobación de usuarios.
Recuperación de contraseña.
33. Fuera de alcance de Kickoff

No implementar en la versión 1.0:

Múltiples quinielas simultáneas.
Múltiples deportes.
Aplicaciones móviles nativas.
Integración automática con resultados deportivos.
Servicios de inteligencia artificial externos.
Autenticación social obligatoria.
Pagos.
Premios monetarios.
Notificaciones push obligatorias.
Estadísticas avanzadas no solicitadas.

La arquitectura no debe impedir futuras ampliaciones, pero no se debe sobrediseñar la primera versión.

34. Reglas para agentes de IA y Codex

Antes de modificar el proyecto:

Leer este documento.
Leer el documento especializado del módulo.
Revisar las reglas de negocio relacionadas.
Revisar el modelo de datos.
Revisar seguridad y pruebas.

Un agente no debe:

Cambiar reglas funcionales sin documentarlo.
Introducir servicios de pago.
Desactivar seguridad para simplificar.
Guardar contraseñas o tokens en texto plano.
Confiar en validaciones solo del frontend.
Eliminar auditoría.
Inferir cronología por número de jornada.
Procesar resultados sin transacción.
Crear lógica de puntuación duplicada en varios lugares.

Cuando exista una ambigüedad, deberá preservar el comportamiento más seguro y registrar la decisión pendiente.

35. Orden recomendado de desarrollo
Inicialización del repositorio.
Configuración de entorno.
Modelo de datos.
Migraciones y seeds.
Autenticación.
Inicialización del superadministrador.
Registro y aprobación.
Equipos y temporadas.
Jornadas y partidos.
Pronósticos.
Procesamiento y puntuación.
Clasificación.
Dashboard.
Resultados.
Administración.
Auditoría.
Diagnóstico.
Exportaciones.
Pruebas end-to-end.
Despliegue.

No debe construirse primero la interfaz completa sin tener definidas las reglas y el modelo de datos.

36. Definición de terminado

Una funcionalidad se considera terminada cuando:

Cumple sus criterios de aceptación.
Tiene validación de servidor.
Respeta permisos.
Tiene manejo de errores.
Registra auditoría cuando corresponde.
Tiene pruebas relevantes.
Funciona en móvil y escritorio.
No introduce servicios de pago.
Está documentada.
No rompe reglas existentes.
37. Documentos relacionados

Este archivo debe leerse junto con:

README.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
38. Identidad del proyecto

Producto: Quiniela Nacional La Goleada
Versión: 1.0
Nombre interno: Kickoff
Lema funcional: Pronosticar, competir y disfrutar con transparencia.

Toda decisión de implementación deberá proteger tres prioridades: gratuidad, transparencia e integridad de los resultados.