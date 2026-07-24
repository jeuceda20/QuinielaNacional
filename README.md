# Quiniela Nacional La Goleada

## Versión 1.0 — Kickoff

**Nombre interno:** Kickoff  
**Tipo de producto:** Aplicación web responsive para quinielas de la Liga Nacional de Honduras  
**Idioma principal:** Español  
**Zona horaria oficial:** `America/Tegucigalpa`  
**Restricción principal:** El sistema debe desarrollarse, desplegarse y operar utilizando únicamente herramientas y planes gratuitos.

---

## 1. Descripción

**Quiniela Nacional La Goleada** es una plataforma web gratuita para que una comunidad de amigos y aficionados a la Liga Nacional de Honduras pueda registrar pronósticos, competir en una clasificación general y consultar resultados con total transparencia.

La aplicación administrará una sola quiniela activa. Los usuarios podrán pronosticar los marcadores de los partidos correspondientes a:

- Jornadas regulares.
- Repechajes.
- Semifinales.
- Finales.
- Cualquier otra fase configurada como una jornada con nombre personalizado.

Los administradores crearán las temporadas, jornadas y partidos, seleccionarán el partido de puntuación doble y procesarán los resultados oficiales.

El sistema calculará automáticamente:

- Puntos obtenidos.
- Resultados exactos.
- Resultados parciales.
- Posiciones.
- Cambios de posición.
- Estadísticas del dashboard.
- Clasificación general.

---

## 2. Objetivo

Construir una aplicación moderna, segura, intuitiva, fácil de administrar y completamente gratuita que permita:

1. Registrar participantes.
2. Confirmar sus correos electrónicos.
3. Aprobar manualmente a cada participante.
4. Recibir pronósticos hasta cinco minutos antes de cada partido.
5. Mantener privados los pronósticos mientras el partido esté abierto.
6. Revelar los pronósticos de todos los participantes después del cierre.
7. Procesar individualmente cada partido.
8. Calcular automáticamente la clasificación.
9. Mantener un historial final de temporadas.
10. Auditar las acciones administrativas.
11. Probar el sistema mediante datos simulados y pruebas automatizadas.
12. Operar sin servicios obligatorios de pago.

---

## 3. Filosofía del proyecto

> Crear la mejor plataforma gratuita para disfrutar una quiniela de la Liga Nacional de Honduras, priorizando la transparencia, la simplicidad, la estabilidad y una experiencia moderna para jugadores y administradores.

---

## 4. Principios

### 4.1 Gratuito por diseño

Ninguna funcionalidad esencial podrá depender de una suscripción o servicio de pago.

Cuando una función requiera un proveedor externo:

1. Se deberá elegir una alternativa gratuita.
2. Se deberán documentar sus límites.
3. Se evitará cualquier riesgo de cobro automático.
4. Si no existe una alternativa gratuita razonable, la función quedará fuera del alcance.

### 4.2 Transparencia

Los pronósticos de otros usuarios permanecerán ocultos mientras el partido esté abierto.

Una vez cerrado el periodo de pronóstico:

- Todos podrán ver los pronósticos registrados.
- Nadie podrá modificar su pronóstico.
- Antes de procesar el resultado no se mostrarán puntos.
- Después de procesarlo se mostrarán los puntos obtenidos.

Las acciones administrativas relevantes quedarán registradas en una auditoría.

### 4.3 Automatización

Los administradores no deberán realizar cálculos manuales.

Al procesar un resultado, el sistema deberá:

- Evaluar todos los pronósticos.
- Asignar puntos.
- Actualizar exactos y parciales.
- Actualizar la clasificación.
- Actualizar posiciones.
- Actualizar el dashboard.
- Registrar la acción en auditoría.

### 4.4 Simplicidad

La aplicación debe poder ser utilizada fácilmente desde un teléfono móvil.

Una persona que nunca haya usado una quiniela debe comprender el funcionamiento básico en pocos minutos.

### 4.5 Integridad

Las fuentes de verdad serán:

- Los partidos.
- Los pronósticos.
- Los resultados oficiales.
- Las reglas de puntuación.

La tabla general no será la fuente primaria de verdad y deberá poder reconstruirse completamente.

### 4.6 Independencia del orden de las jornadas

El sistema nunca asumirá que los partidos se juegan según el orden numérico de las jornadas.

Un partido de la Jornada 5 podrá disputarse después de la Jornada 10 sin considerarse un error.

Los cierres, estados y procesamientos dependerán de la fecha y hora real de cada partido.

---

## 5. Alcance de la versión 1.0

La versión **Kickoff** incluirá:

### Usuarios y autenticación

- Registro público.
- Confirmación de correo.
- Aprobación manual por administradores.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Sesiones seguras.
- Usuario normal.
- Administrador.
- Superadministrador.
- Creación inicial del superadministrador.
- Bloqueo y desactivación de cuentas.
- Promoción y retiro de administradores.

### Perfil

Cada usuario tendrá:

- Nombre.
- Apellido.
- Nickname único.
- Correo único e inmutable.
- Contraseña almacenada mediante hash seguro.
- Equipo favorito.
- Rol.
- Estado de cuenta.

No se incluirán fotografías ni avatares personales. El perfil mostrará el logo del equipo favorito.

### Equipos

- Doce equipos precargados.
- Nombre.
- Nombre corto.
- Logo.
- Estado activo o inactivo.
- Gestión administrativa.
- Logos almacenados como recursos del proyecto o mediante almacenamiento gratuito.

### Temporadas

- Una temporada activa.
- Nombre configurable, por ejemplo:
  - Apertura 2026.
  - Clausura 2027.
- Fecha de inicio y finalización.
- Estado de temporada.
- Cierre de temporada.
- Conservación de la tabla final.
- Historial de campeones.
- Reinicio controlado para la siguiente temporada.

### Jornadas

- Jornadas con nombres personalizados.
- Jornada 1, Jornada 2, etc.
- Repechaje Ida.
- Repechaje Vuelta.
- Semifinal Ida.
- Semifinal Vuelta.
- Final Ida.
- Final Vuelta.
- Creación, edición, archivo y consulta.
- Exactamente un partido de puntuación doble por jornada.

### Partidos

- Equipo local.
- Equipo visitante.
- Jornada.
- Fecha.
- Hora.
- Estadio opcional.
- Estado.
- Marcador oficial.
- Indicador de partido doble.
- Reprogramaciones.
- Suspensiones.
- Reanudaciones.
- Cancelaciones.
- Procesamiento individual.

### Pronósticos

- Marcador local.
- Marcador visitante.
- Guardado automático.
- Modificación antes del cierre.
- Bloqueo cinco minutos antes del partido.
- Contador regresivo.
- Estado visual.
- Privacidad antes del cierre.
- Visibilidad después del cierre.
- Cero puntos cuando no exista pronóstico.

### Clasificación

La tabla mostrará:

- Posición.
- Nickname.
- Resultados parciales.
- Resultados exactos.
- Puntos.
- Indicador de subida, bajada o permanencia.

### Resultados

La página de resultados mostrará:

- Partidos cerrados todavía no procesados.
- Partidos procesados.
- Marcador oficial.
- Pronósticos de todos los usuarios.
- Puntos obtenidos después del procesamiento.
- Jornada correspondiente.
- Estado del partido.

### Dashboard

El dashboard del usuario mostrará:

- Saludo personalizado.
- Posición actual.
- Puntos.
- Resultados exactos.
- Resultados parciales.
- Próximo partido.
- Próximo cierre.
- Cuenta regresiva.
- Pronósticos pendientes.
- Partido de puntuación doble.
- Top 5 de la clasificación.
- Notificaciones internas.

### Administración

Los administradores podrán:

- Aprobar usuarios.
- Rechazar usuarios.
- Bloquear usuarios.
- Desactivar usuarios.
- Crear jornadas.
- Editar jornadas.
- Archivar jornadas.
- Crear partidos.
- Editar partidos.
- Reprogramar partidos.
- Suspender partidos.
- Cancelar partidos.
- Definir el partido doble.
- Procesar resultados.
- Gestionar patrocinadores.
- Consultar auditorías.
- Ejecutar recalculaciones autorizadas.

### Superadministración

El superadministrador podrá además:

- Promover usuarios a administrador.
- Retirar permisos administrativos.
- Gestionar configuraciones críticas.
- Activar modo mantenimiento.
- Exportar respaldos.
- Utilizar el centro de diagnóstico.
- Utilizar la consola SQL segura.
- Generar datos de prueba.
- Simular jornadas.
- Ejecutar verificaciones de integridad.
- Ejecutar el recalculo completo del torneo.

### Auditoría

Se registrarán, como mínimo:

- Inicio y cierre de sesión de administradores.
- Aprobación o rechazo de usuarios.
- Promoción o retiro de administradores.
- Creación y modificación de jornadas.
- Creación, modificación y cancelación de partidos.
- Reprogramaciones.
- Cambios del partido doble.
- Procesamiento de resultados.
- Correcciones de resultados.
- Recalculo de la temporada.
- Cambios de configuración.
- Activación del modo mantenimiento.
- Operaciones avanzadas de diagnóstico.
- Consultas SQL que modifiquen datos.

Los registros de auditoría no podrán editarse ni eliminarse desde la aplicación.

### Centro de diagnóstico

Incluirá:

- Estado de la base de datos.
- Estado del SMTP.
- Conteo de usuarios.
- Conteo de partidos.
- Conteo de pronósticos.
- Conteo de auditorías.
- Últimos errores.
- Verificador de integridad.
- Exportaciones.
- Generador de datos.
- Simulador.
- Consola SQL segura.
- Ejecución de pruebas disponibles.
- Recalculo completo.

---

## 6. Sistema de puntuación

| Tipo de acierto | Puntos normales | Partido doble |
|---|---:|---:|
| Marcador exacto | 3 | 6 |
| Acierta ganador o empate | 1 | 2 |
| Pronóstico incorrecto | 0 | 0 |
| Sin pronóstico | 0 | 0 |

### Resultado exacto

El marcador pronosticado coincide completamente con el marcador oficial.

Ejemplo:

- Pronóstico: Olimpia 2-1 Motagua.
- Resultado: Olimpia 2-1 Motagua.
- Puntos: 3.
- Si es doble: 6.

### Resultado parcial

El usuario acierta el ganador o el empate, pero no el marcador exacto.

Ejemplo:

- Pronóstico: Olimpia 1-0 Motagua.
- Resultado: Olimpia 2-1 Motagua.
- Puntos: 1.
- Si es doble: 2.

### Incorrecto

El usuario no acierta el ganador ni el empate.

Ejemplo:

- Pronóstico: Olimpia 1-0 Motagua.
- Resultado: Olimpia 0-2 Motagua.
- Puntos: 0.

---

## 7. Desempates

Los criterios de clasificación serán:

1. Mayor cantidad de puntos.
2. Mayor cantidad de resultados exactos.
3. Si ambos valores coinciden, los usuarios compartirán posición.

Ejemplo:

| Posición | Usuario | Puntos | Exactos |
|---:|---|---:|---:|
| 1 | Carlos | 50 | 12 |
| 2 | Ana | 47 | 11 |
| 2 | Pedro | 47 | 11 |
| 4 | Juan | 47 | 9 |

Se utilizará una clasificación con posiciones compartidas y saltos posteriores.

---

## 8. Registro y aprobación

El flujo será:

1. El visitante abre el registro.
2. Ingresa nombre y apellido.
3. Elige un nickname único.
4. Ingresa un correo único.
5. Elige una contraseña.
6. Confirma la contraseña.
7. Selecciona su equipo favorito.
8. Acepta las reglas y política aplicable.
9. El sistema crea la cuenta sin acceso.
10. Se envía un enlace de confirmación.
11. El usuario confirma el correo.
12. La cuenta queda pendiente de aprobación.
13. Un administrador la aprueba o rechaza.
14. Después de ser aprobada, podrá iniciar sesión.

El correo no podrá modificarse posteriormente, ni por el usuario ni por un administrador.

---

## 9. Primer administrador

Cuando el sistema no tenga ningún usuario con rol de superadministrador, habilitará un proceso de inicialización protegido.

El formulario solicitará:

- Nombre.
- Apellido.
- Nickname.
- Correo.
- Contraseña.
- Confirmación de contraseña.
- Equipo favorito.

El primer usuario creado mediante este flujo será:

- Superadministrador.
- Correo confirmado.
- Cuenta aprobada.
- Cuenta activa.

Después de la creación, el proceso inicial quedará deshabilitado permanentemente.

---

## 10. Pronósticos y cierres

El usuario registrará únicamente el marcador.

Ejemplo:

Olimpia       [ 2 ]
Motagua       [ 1 ]

Reglas:

Los goles deben ser números enteros.
No se aceptan valores negativos.
Se deberá establecer un límite razonable de goles.
El pronóstico podrá modificarse hasta el cierre.
El cierre será cinco minutos antes del inicio.
El servidor determinará si un partido está abierto.
La hora del dispositivo del usuario nunca será la fuente de verdad.
Después del cierre no se permitirán cambios.
La aplicación mostrará una cuenta regresiva.
Cuando falten menos de treinta minutos, el estado visual cambiará.
Las alertas por correo antes del cierre solo se incluirán si pueden ejecutarse gratuitamente y con fiabilidad suficiente.
Las notificaciones internas sí serán obligatorias.
11. Reprogramaciones

Cada partido tendrá su propia fecha y hora.

Su jornada será únicamente una clasificación lógica.

Ejemplo válido:

Jornada 5
Olimpia vs Motagua
Fecha original: 10 de agosto

Nueva fecha: 15 de octubre

Jornada 10
Finalizada el 20 de septiembre

El partido de Jornada 5 continuará perteneciendo a Jornada 5.

No será considerado inconsistente aunque se dispute después de Jornada 10.

La clasificación se actualizará cuando el partido sea procesado.

Estados previstos
Programado.
Reprogramado.
Cerrado para pronósticos.
Suspendido.
Reanudado.
Finalizado pendiente de procesamiento.
Procesado.
Cancelado.

Toda reprogramación deberá conservar:

Fecha anterior.
Nueva fecha.
Administrador responsable.
Fecha de modificación.
Motivo opcional.
12. Partido de puntuación doble

Cada jornada tendrá exactamente un partido doble.

La interfaz deberá destacarlo mediante:

Icono.
Texto visible.
Estilo diferenciado.
Indicador “Doble puntuación”.

El administrador podrá cambiarlo mientras ningún partido afectado haya iniciado o sido procesado.

Los cambios posteriores requerirán una operación controlada y recalculo.

13. Procesamiento de resultados

Los partidos se procesarán individualmente.

El administrador ingresará:

Goles del equipo local.
Goles del equipo visitante.
Confirmación del resultado.

Antes de procesar, se mostrará una advertencia:

Esta acción calculará los puntos de todos los usuarios y actualizará la clasificación. ¿Desea continuar?

El procesamiento deberá ejecutarse dentro de una transacción.

Si ocurre un error:

No se guardará el resultado parcialmente.
No se asignarán puntos incompletos.
No se actualizará parcialmente la tabla.
La operación completa será revertida.
14. Recalculo

El sistema tendrá una función para recalcular toda la temporada.

El recalculo:

Leerá todos los partidos procesados.
Leerá todos los pronósticos.
Aplicará las reglas vigentes correspondientes.
Reconstruirá los puntos.
Reconstruirá los exactos.
Reconstruirá los parciales.
Reconstruirá las posiciones.
Verificará la integridad final.
Registrará la operación en auditoría.
15. Historial de temporadas

Al finalizar una temporada se conservará:

Nombre de la temporada.
Fecha de cierre.
Tabla final.
Campeón o campeones.
Posiciones finales.
Puntos.
Exactos.
Parciales.

Los partidos y pronósticos podrán archivarse o eliminarse mediante un proceso administrativo controlado después de generar un respaldo.

No deberán borrarse automáticamente.

16. Tecnología objetivo

La arquitectura inicialmente prevista es:

Componente  Tecnología
Aplicación web  Next.js
Lenguaje  TypeScript
Estilos Tailwind CSS
Componentes Componentes accesibles y reutilizables
Backend Next.js Route Handlers y servicios internos
Base de datos PostgreSQL
ORM Prisma
Autenticación Propia
Sesiones  Cookies HTTP-only seguras
Hash de contraseña  Argon2id o bcrypt
Correo  Gmail SMTP
Pruebas unitarias Vitest
Pruebas E2E Playwright
Repositorio GitHub
Hosting Proveedor con plan gratuito
Base de datos alojada Proveedor PostgreSQL con plan gratuito

Las versiones exactas deberán fijarse al comenzar la implementación.

Los planes gratuitos deberán verificarse antes del despliegue, porque sus límites pueden cambiar.

17. Identidad visual

La interfaz estará inspirada en el logo de La Goleada.

Características:

Estilo deportivo.
Diseño moderno.
Presentación minimalista.
Colores basados en rojo y azul.
Contraste accesible.
Tarjetas limpias.
Bordes suaves.
Sombras discretas.
Animaciones moderadas.
Tipografía clara.
Excelente experiencia móvil.
Estados visibles para partidos y pronósticos.

El logo principal deberá poder reemplazarse desde una carpeta pública sin modificar el código.

18. Estructura documental
docs/
├── 00-Project-Context.md
├── 01-PRD.md
├── 02-Arquitectura.md
├── 03-ModeloBaseDatos.md
├── 04-ReglasNegocio.md
├── 05-UI-UX.md
├── 06-API.md
├── 07-Seguridad.md
├── 08-Testing.md
├── 09-Deployment.md
├── 10-ManualAdministrador.md
├── 11-ManualUsuario.md
├── 12-CentroDiagnostico.md
├── 13-Roadmap.md
├── 14-DecisionesArquitectonicas.md
├── 15-Riesgos.md
├── 16-Glosario.md
├── 17-CODEX_INSTRUCTIONS.md
└── 18-DEVELOPER_RULES.md
19. Prompts de implementación
prompts/
├── 01-bootstrap.md
├── 02-auth.md
├── 03-admin.md
├── 04-dashboard.md
├── 05-predictions.md
├── 06-results.md
├── 07-testing.md
└── 08-deployment.md

Cada prompt deberá indicar a Codex que primero lea toda la documentación relevante.

20. Estado del proyecto
Fase  Estado
Descubrimiento funcional  Completado
Definición del alcance  Completado
Documentación En elaboración
Arquitectura detallada  Pendiente
Implementación  Pendiente
Pruebas Pendiente
Despliegue  Pendiente
21. Criterios de éxito de Kickoff

La versión 1.0 se considerará lista cuando:

Un usuario pueda registrarse.
El correo pueda confirmarse.
Un administrador pueda aprobar la cuenta.
El usuario pueda iniciar sesión.
Un administrador pueda crear temporadas, jornadas y partidos.
Los usuarios puedan pronosticar.
El cierre se aplique correctamente.
Los pronósticos permanezcan ocultos antes del cierre.
Los pronósticos sean públicos después del cierre.
Un resultado pueda procesarse individualmente.
Los puntos se calculen correctamente.
La tabla respete los criterios de desempate.
El partido doble funcione.
Las reprogramaciones no dependan del orden de jornadas.
La auditoría registre las acciones.
La temporada pueda recalcularse.
Las pruebas críticas sean exitosas.
La aplicación pueda desplegarse y utilizarse sin costo.
22. Restricciones

La versión 1.0 no utilizará:

APIs deportivas de pago.
Resultados automáticos de terceros.
Autenticación social obligatoria.
Servicios de correo de pago.
Plataformas de autenticación de pago.
Infraestructura con cobro automático obligatorio.
Múltiples ligas simultáneas.
Aplicaciones móviles nativas.
Estadísticas deportivas avanzadas.
Inteligencia artificial externa.
23. Licencia

La licencia definitiva se decidirá antes de publicar el repositorio.

Se podrá evaluar una licencia permisiva como MIT para el código fuente.

Los logos, escudos de equipos y demás recursos gráficos deberán contar con autorización o condiciones de uso compatibles antes de una publicación pública.

24. Nombre oficial

Producto: Quiniela Nacional La Goleada
Versión: 1.0
Nombre interno: Kickoff

Quiniela Nacional La Goleada es una plataforma creada para que amigos y aficionados al fútbol hondureño disfruten cada jornada compitiendo mediante pronósticos, transparencia y una experiencia moderna.

El proyecto busca demostrar que una aplicación comunitaria puede ser segura, agradable y profesional sin depender de servicios de pago.