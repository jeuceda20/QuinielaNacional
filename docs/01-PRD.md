# Product Requirements Document

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Aprobado para diseño técnico e implementación  
**Idioma principal:** Español  
**Zona horaria oficial:** `America/Tegucigalpa`

---

## 1. Resumen ejecutivo

Quiniela Nacional La Goleada es una aplicación web gratuita orientada a una comunidad de amigos y aficionados a la Liga Nacional de Honduras.

La plataforma permitirá que los participantes pronostiquen los marcadores de los partidos, compitan en una clasificación general y consulten de manera transparente los pronósticos de los demás una vez cerrado cada encuentro.

La aplicación administrará una sola quiniela activa a la vez y soportará:

- Jornadas regulares.
- Repechajes.
- Semifinales.
- Finales.
- Cualquier fase representada mediante jornadas con nombres personalizados.

Los administradores podrán crear jornadas, programar partidos, seleccionar el partido de puntuación doble y procesar individualmente los resultados oficiales.

El sistema calculará automáticamente los puntos, los resultados exactos, los resultados parciales y la clasificación.

---

## 2. Problema que resuelve

Las quinielas administradas mediante grupos de mensajería o archivos manuales suelen presentar problemas como:

- Pronósticos enviados fuera de tiempo.
- Dudas sobre cuándo se registró un marcador.
- Participantes que pueden ver pronósticos ajenos antes de enviar el suyo.
- Errores en cálculos manuales.
- Dificultad para manejar partidos reprogramados.
- Falta de trazabilidad cuando existen varios administradores.
- Falta de historial.
- Dependencia de hojas de cálculo.

La aplicación resolverá estos problemas mediante:

- Cierres automáticos.
- Validación de servidor.
- Privacidad temporal de pronósticos.
- Cálculo centralizado.
- Auditoría administrativa.
- Procesamiento transaccional.
- Historial de temporadas.
- Herramientas de recalculo y diagnóstico.

---

## 3. Visión del producto

Crear una plataforma gratuita, moderna y confiable para organizar una quiniela comunitaria de la Liga Nacional de Honduras, priorizando:

- Transparencia.
- Facilidad de uso.
- Integridad de resultados.
- Administración sencilla.
- Experiencia móvil.
- Operación sin costos obligatorios.
- Código mantenible.
- Reglas de negocio claras.

---

## 4. Objetivos

### 4.1 Objetivos principales

1. Permitir que cualquier visitante solicite una cuenta.
2. Verificar la propiedad del correo electrónico.
3. Permitir que los administradores aprueben o rechacen participantes.
4. Permitir pronósticos únicamente mediante marcador.
5. Cerrar cada pronóstico cinco minutos antes del partido.
6. Ocultar los pronósticos ajenos mientras el partido esté abierto.
7. Revelar los pronósticos al cerrar el periodo.
8. Calcular automáticamente puntos, exactos, parciales y posiciones.
9. Permitir procesar partidos individualmente.
10. Permitir procesar partidos fuera del orden de las jornadas.
11. Registrar las acciones administrativas.
12. Mantener la aplicación completamente gratuita.

### 4.2 Objetivos secundarios

- Proporcionar un dashboard útil.
- Mantener historial final de temporadas.
- Facilitar pruebas mediante datos simulados.
- Ofrecer herramientas de diagnóstico.
- Permitir exportaciones y respaldos.
- Facilitar el mantenimiento futuro.
- Mantener una experiencia consistente en celular y computadora.

---

## 5. Restricción principal

> Toda la versión 1.0 debe poder construirse, desplegarse y utilizarse mediante tecnologías, bibliotecas y planes gratuitos.

No se aceptarán como dependencias obligatorias:

- Servicios con prueba gratuita temporal únicamente.
- Servicios que exijan pago para continuar operando.
- Proveedores con cargos automáticos inevitables.
- APIs deportivas de pago.
- Plataformas de autenticación de pago.
- Servicios de correo comerciales obligatorios.
- Infraestructura con costo fijo.

Si una funcionalidad no puede operar gratuitamente, deberá:

1. Buscar una alternativa gratuita.
2. Simplificarse.
3. Posponerse.
4. Excluirse del alcance.

---

## 6. Usuarios objetivo

### 6.1 Participante

Persona aprobada que compite en la quiniela.

Necesita:

- Pronosticar rápidamente desde el celular.
- Saber cuánto falta para el cierre.
- Confirmar que el pronóstico fue guardado.
- Ver sus puntos.
- Ver su posición.
- Ver los pronósticos de los demás después del cierre.
- Comprender fácilmente las reglas.

### 6.2 Administrador

Persona responsable de la operación deportiva.

Necesita:

- Aprobar participantes.
- Crear jornadas.
- Crear partidos.
- Reprogramar partidos.
- Elegir el partido doble.
- Ingresar resultados.
- Evitar errores de procesamiento.
- Consultar auditorías.

### 6.3 Superadministrador

Propietario funcional del sistema.

Necesita:

- Mantener el control de roles.
- Supervisar la configuración.
- Acceder a herramientas avanzadas.
- Ejecutar respaldos.
- Revisar diagnósticos.
- Recuperar el sistema ante inconsistencias.
- Promover o retirar administradores.

---

## 7. Roles y permisos

### 7.1 Usuario normal

Puede:

- Iniciar sesión.
- Cerrar sesión.
- Ver el dashboard.
- Crear pronósticos.
- Editar sus pronósticos antes del cierre.
- Consultar la clasificación.
- Consultar resultados.
- Ver pronósticos cerrados.
- Consultar su perfil.
- Leer el reglamento.
- Ver patrocinadores.

No puede:

- Ver pronósticos abiertos de otros usuarios.
- Crear jornadas.
- Crear partidos.
- Procesar resultados.
- Aprobar cuentas.
- Ver herramientas administrativas.
- Modificar su correo.
- Modificar roles.

### 7.2 Administrador

Puede realizar las funciones del usuario y además:

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
- Reanudar partidos.
- Cancelar partidos.
- Seleccionar el partido doble.
- Procesar resultados.
- Gestionar patrocinadores.
- Consultar auditorías.

No puede:

- Modificar al superadministrador.
- Eliminar auditorías.
- Ejecutar herramientas técnicas reservadas.
- Cambiar correos de usuarios.
- Promover administradores sin autorización.

### 7.3 Superadministrador

Puede realizar todas las funciones anteriores y además:

- Promover usuarios a administrador.
- Retirar permisos administrativos.
- Gestionar configuraciones críticas.
- Activar modo mantenimiento.
- Acceder al centro de diagnóstico.
- Ejecutar exportaciones.
- Crear respaldos.
- Generar datos de prueba.
- Ejecutar simulaciones.
- Ejecutar consultas SQL seguras.
- Ejecutar recalculo completo.
- Supervisar errores técnicos.

---

## 8. Registro y autenticación

### 8.1 Datos de registro

El formulario solicitará:

- Nombre.
- Apellido.
- Nickname único.
- Correo único.
- Contraseña.
- Confirmación de contraseña.
- Equipo favorito.
- Aceptación de reglas.

### 8.2 Flujo de registro

1. El visitante completa el formulario.
2. El sistema valida los datos.
3. El sistema valida nickname y correo únicos.
4. La contraseña se transforma mediante un hash seguro.
5. Se crea una cuenta sin acceso.
6. Se envía un correo de confirmación.
7. El usuario confirma el correo.
8. La cuenta pasa a estado pendiente de aprobación.
9. Un administrador aprueba o rechaza la solicitud.
10. Solo una cuenta confirmada, aprobada y activa puede iniciar sesión.

### 8.3 Correo inmutable

El correo no podrá cambiarse después del registro.

No podrá modificarlo:

- El usuario.
- Un administrador.
- El superadministrador desde la interfaz normal.

### 8.4 Recuperación de contraseña

El usuario podrá solicitar un enlace de recuperación.

El enlace deberá:

- Ser de un solo uso.
- Tener expiración.
- Invalidarse después del cambio.
- No revelar públicamente si el correo existe.
- Utilizar un token almacenado de forma segura.

### 8.5 Primer superadministrador

Cuando no exista ningún superadministrador, el sistema habilitará un proceso inicial protegido.

El primer usuario creado mediante este proceso quedará:

- Con correo confirmado.
- Aprobado.
- Activo.
- Con rol de superadministrador.

El proceso deberá quedar deshabilitado después de completarse.

---

## 9. Estados de cuenta

Estados funcionales previstos:

- Pendiente de confirmación de correo.
- Pendiente de aprobación.
- Aprobada.
- Rechazada.
- Bloqueada.
- Desactivada.

Para iniciar sesión y participar, la cuenta deberá estar:

- Confirmada.
- Aprobada.
- Activa.
- No bloqueada.

---

## 10. Perfil de usuario

El perfil mostrará:

- Nombre.
- Apellido.
- Nickname.
- Correo en modo de solo lectura.
- Equipo favorito.
- Logo del equipo favorito.
- Posición actual.
- Puntos.
- Exactos.
- Parciales.

No incluirá:

- Fotografía personal.
- Avatar personalizado.
- Cambio de correo.

El nickname será el nombre público mostrado en la clasificación y resultados.

El nombre y apellido se utilizarán para identificación administrativa.

---

## 11. Equipos

La aplicación iniciará con doce equipos precargados.

Cada equipo tendrá:

- Nombre.
- Nombre corto.
- Identificador.
- Slug.
- Logo.
- Estado activo o inactivo.
- Orden opcional.

Un equipo inactivo:

- No podrá utilizarse en nuevos partidos.
- Permanecerá visible en información histórica.

Los logos deberán ser reemplazables sin modificar la lógica.

---

## 12. Temporadas

### 12.1 Reglas generales

- Solo una temporada podrá estar activa.
- Se podrán conservar temporadas cerradas.
- El nombre será configurable.
- La temporada será la agrupación principal de jornadas y partidos.

Ejemplos:

- Apertura 2026.
- Clausura 2027.

### 12.2 Cierre de temporada

Al cerrar una temporada se conservará:

- Nombre.
- Fecha de cierre.
- Clasificación final.
- Campeón o campeones.
- Posición de cada usuario.
- Puntos.
- Exactos.
- Parciales.

No se eliminarán automáticamente:

- Partidos.
- Pronósticos.
- Resultados.
- Auditorías.

Antes de limpiar información deberá existir:

- Respaldo.
- Confirmación administrativa.
- Auditoría.
- Verificación del historial final.

---

## 13. Jornadas

Las jornadas serán agrupaciones lógicas y tendrán nombres personalizados.

Ejemplos:

- Jornada 1.
- Jornada 10.
- Repechaje Ida.
- Repechaje Vuelta.
- Semifinal Ida.
- Semifinal Vuelta.
- Final Ida.
- Final Vuelta.

Cada jornada deberá tener exactamente un partido doble antes de considerarse lista.

Una jornada podrá estar incompleta mientras se configura.

El sistema podrá advertir que parece incompleta, pero no deberá impedir su creación.

---

## 14. Partidos

Cada partido deberá contener:

- Temporada.
- Jornada.
- Equipo local.
- Equipo visitante.
- Fecha y hora programada.
- Estado.
- Indicador de partido doble.

Campos opcionales:

- Estadio.
- Observaciones.
- Motivo de reprogramación.
- Fecha y hora original.
- Información de suspensión.

Validaciones:

- Local y visitante deben ser distintos.
- Ambos equipos deben existir.
- No se aceptan goles negativos.
- Se deberán advertir posibles duplicados.
- El sistema no deberá asumir que una advertencia implica un error real.

---

## 15. Estados de partido

Estados mínimos:

- Programado.
- Reprogramado.
- Cerrado para pronósticos.
- Suspendido.
- Reanudado.
- Finalizado pendiente de procesamiento.
- Procesado.
- Cancelado.

El estado visible podrá derivarse parcialmente de:

- Fecha.
- Hora.
- Estado persistido.
- Existencia de resultado.

Las incidencias deberán persistirse explícitamente.

---

## 16. Reprogramaciones

### 16.1 Regla principal

La aplicación nunca dependerá del número de jornada para determinar el orden cronológico.

Ejemplo válido:

- Un partido de Jornada 5 se disputa después de Jornada 10.

Esto no será considerado error.

### 16.2 Datos conservados

Al reprogramar se guardará:

- Fecha y hora anterior.
- Nueva fecha y hora.
- Administrador responsable.
- Fecha del cambio.
- Motivo opcional.

### 16.3 Reapertura

Si:

- El partido no fue procesado.
- La nueva hora de cierre está en el futuro.

Entonces podrá volver a abrirse para pronósticos.

Los pronósticos existentes se conservarán.

La reapertura deberá:

- Ser visible.
- Quedar auditada.
- No eliminar pronósticos automáticamente.

---

## 17. Pronósticos

### 17.1 Forma de ingreso

El usuario registrará únicamente:

- Goles del local.
- Goles del visitante.

### 17.2 Reglas

- Solo números enteros.
- Sin valores negativos.
- Con límite máximo configurable.
- Un solo pronóstico por usuario y partido.
- Editable hasta el cierre.
- Bloqueado después del cierre.
- Sin pronóstico equivale a cero puntos.

### 17.3 Guardado automático

La interfaz guardará automáticamente después de un breve periodo sin cambios.

Mostrará estados como:

- Guardando.
- Pronóstico guardado.
- Error al guardar.
- Pronóstico cerrado.

El backend deberá validar siempre el horario, aunque la interfaz muestre el partido abierto.

### 17.4 Privacidad

Antes del cierre:

- El usuario solo ve su pronóstico.
- No ve pronósticos de terceros.

Después del cierre:

- Todos ven todos los pronósticos.
- Nadie puede modificarlos.
- Los puntos no se muestran hasta que exista resultado procesado.

---

## 18. Cierre de pronósticos

El cierre predeterminado será cinco minutos antes del inicio.

La validación se ejecutará en el servidor usando:


America/Tegucigalpa
La hora del dispositivo del usuario no será válida para autorizar una modificación.

La interfaz mostrará:

Abierto.
Cierra pronto.
Cerrado.
Procesado.

Cuando falten menos de treinta minutos, el estado deberá destacarse.

19. Partido de puntuación doble

Cada jornada tendrá exactamente un partido doble.

La interfaz deberá destacarlo mediante:

Icono.
Etiqueta.
Color o borde diferenciado.
Texto “Doble puntuación”.

Puntuación:

Resultado	Puntos
Exacto	6
Parcial	2
Incorrecto	0

No deberá cambiarse libremente después de que un partido afectado haya sido procesado.

Una corrección deberá provocar:

Advertencia.
Recalculo.
Auditoría.
20. Sistema de puntuación
20.1 Marcador exacto

El marcador pronosticado coincide completamente con el resultado oficial.

Puntos:

Partido normal: 3.
Partido doble: 6.
20.2 Resultado parcial

El usuario acierta:

Victoria local.
Victoria visitante.
Empate.

Pero no acierta el marcador exacto.

Puntos:

Partido normal: 1.
Partido doble: 2.
20.3 Incorrecto

No acierta el desenlace.

Puntos: 0.

20.4 Sin pronóstico

No existe pronóstico válido.

Puntos: 0.

21. Procesamiento de resultados

Los resultados se procesarán uno por uno.

21.1 Flujo
El administrador abre el partido.
Ingresa goles local y visitante.
El sistema valida el marcador.
Muestra una confirmación.
El administrador confirma.
Se inicia una transacción.
Se guarda el resultado.
Se calculan los puntos.
Se actualizan exactos.
Se actualizan parciales.
Se actualiza la clasificación.
Se registra auditoría.
Se confirma la transacción.
21.2 Seguridad transaccional

Si ocurre un error:

No se guardará el resultado parcialmente.
No se asignarán puntos incompletos.
No se actualizará parcialmente la tabla.
Toda la operación será revertida.
21.3 Corrección de resultados

Si un partido ya fue procesado:

Se mostrará una advertencia reforzada.
Se registrarán el resultado anterior y el nuevo.
Se ejecutará un recalculo.
La acción quedará auditada.
22. Clasificación general

La tabla mostrará:

Posición.
Nickname.
Resultados parciales.
Resultados exactos.
Puntos.
Indicador de movimiento.
22.1 Desempate
Mayor cantidad de puntos.
Mayor cantidad de resultados exactos.
Si ambos son iguales, comparten posición.

Ejemplo:

Posición	Nickname	Puntos	Exactos
1	Carlos	50	12
2	Ana	47	11
2	Pedro	47	11
4	Juan	47	9
22.2 Tendencia

La tendencia podrá indicar:

Subió.
Bajó.
Se mantuvo.

Debe compararse contra una instantánea anterior válida.

23. Resultados

La sección Resultados mostrará:

Partidos cerrados no procesados.
Partidos procesados.
Jornada.
Fecha.
Equipos.
Marcador oficial.
Pronósticos de usuarios.
Puntos obtenidos después del procesamiento.

Los partidos cerrados sin resultado mostrarán los pronósticos, pero no los puntos.

24. Dashboard

Será la primera pantalla después del login.

Mostrará:

Saludo.
Posición.
Puntos.
Exactos.
Parciales.
Próximo partido.
Próximo cierre.
Cuenta regresiva.
Pronósticos pendientes.
Partido doble próximo.
Top 5.
Notificaciones.

Incluirá una acción principal:

Ir a pronosticar
25. Notificaciones internas

Ejemplos:

Tienes partidos pendientes.
Un partido cierra en menos de treinta minutos.
Se procesó un resultado.
Tu cuenta fue aprobada.
Un partido fue reprogramado.
Una jornada fue publicada.

Las notificaciones podrán marcarse como leídas.

26. Patrocinadores

Cada patrocinador podrá tener:

Nombre.
Imagen.
Enlace opcional.
Orden.
Estado activo.

La interfaz deberá funcionar correctamente aunque no existan patrocinadores.

27. Sección Cómo funciona

Deberá explicar:

Cómo registrarse.
Cómo ser aprobado.
Cómo pronosticar.
Cuándo cierra un partido.
Cómo se obtienen tres puntos.
Cómo se obtiene un punto.
Cómo funciona el partido doble.
Cómo se resuelven empates.
Cuándo se muestran los pronósticos.
Cómo se manejan reprogramaciones.
28. Auditoría

La auditoría será de solo anexado.

Registrará:

Actor.
Rol.
Acción.
Entidad.
Identificador.
Valores anteriores.
Valores nuevos.
Fecha y hora.
IP cuando sea razonable.
Identificador de sesión o solicitud.

Acciones mínimas:

Login y logout administrativo.
Aprobación de usuarios.
Rechazo de usuarios.
Bloqueos.
Cambios de rol.
Creación de jornadas.
Edición de jornadas.
Creación de partidos.
Reprogramaciones.
Cambio de partido doble.
Procesamiento.
Corrección de resultados.
Recalculo.
Cambios de configuración.
Uso de herramientas avanzadas.

Nadie podrá editar o borrar auditorías desde la aplicación.

29. Centro de diagnóstico

Disponible para el superadministrador.

Incluirá:

Estado de la base de datos.
Estado del SMTP.
Cantidad de usuarios.
Cantidad de partidos.
Cantidad de pronósticos.
Cantidad de auditorías.
Errores recientes.
Verificador de integridad.
Exportaciones.
Generador de datos de prueba.
Simulador.
Recalculo.
Consola SQL segura.
30. Consola SQL
30.1 Modo seguro

Por defecto solo permitirá:

SELECT
30.2 Modo avanzado

Las operaciones de escritura deberán:

Estar restringidas al superadministrador.
Requerir confirmación adicional.
Mostrar advertencias.
Quedar auditadas.
Bloquear instrucciones peligrosas cuando sea posible.

La consola podrá deshabilitarse en producción.

31. Datos de prueba

El centro de diagnóstico permitirá crear:

10 usuarios.
50 usuarios.
100 usuarios.
Jornadas.
Partidos.
Pronósticos aleatorios.
Resultados aleatorios.

Los datos se identificarán como ficticios.

No podrán generarse accidentalmente en producción sin confirmación reforzada.

32. Recalculo completo

La clasificación será un dato derivado.

El recalculo deberá:

Leer partidos procesados.
Leer pronósticos.
Aplicar las reglas.
Reconstruir puntos.
Reconstruir exactos.
Reconstruir parciales.
Reconstruir posiciones.
Verificar integridad.
Registrar auditoría.
33. Modo mantenimiento

El superadministrador podrá activarlo.

Durante mantenimiento:

Los usuarios normales no accederán a funciones operativas.
Se mostrará una página informativa.
Los administradores autorizados podrán conservar acceso.
La activación y desactivación se auditarán.
34. Soft delete

No se eliminará físicamente información crítica mediante operaciones normales.

Comportamiento:

Usuarios: bloqueados o desactivados.
Jornadas: archivadas.
Partidos: cancelados o archivados.
Patrocinadores: inactivos.

La eliminación física será excepcional y requerirá respaldo.

35. Diseño y experiencia

La interfaz será:

Moderna.
Deportiva.
Minimalista.
Amigable.
Intuitiva.
Responsive.

La paleta se basará en el logo compartido, usando principalmente rojo y azul con contraste adecuado.

Debe funcionar en:

Celulares pequeños.
Celulares grandes.
Tabletas.
Laptops.
Monitores grandes.
36. Accesibilidad

La versión 1.0 considerará:

Navegación por teclado.
Foco visible.
Contraste suficiente.
Etiquetas accesibles.
Mensajes claros.
Estados que no dependan únicamente del color.
Botones con nombres descriptivos.
37. Seguridad

Requisitos mínimos:

Contraseñas con hash robusto.
Sesiones seguras.
Cookies HttpOnly.
Cookies Secure en producción.
Política SameSite.
Protección CSRF.
Validación en servidor.
Protección XSS.
Rate limiting.
Tokens de un solo uso.
Expiración de tokens.
Control de acceso por rol.
Secretos en variables de entorno.
Mensajes de error no reveladores.
38. Correo electrónico

Se utilizará Gmail SMTP mediante una cuenta genérica.

Correos previstos:

Confirmación de cuenta.
Recuperación de contraseña.
Confirmación de restablecimiento.
Notificación opcional de aprobación.

Los recordatorios antes del cierre solo serán implementados si pueden funcionar gratuitamente y con fiabilidad suficiente.

39. Tecnología objetivo
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
Hosting con plan gratuito.
Base de datos PostgreSQL con plan gratuito.

Las versiones exactas deberán validarse antes del desarrollo.

40. Requisitos no funcionales
Rendimiento
Consultas eficientes.
Índices apropiados.
Paginación.
Optimización de imágenes.
Carga diferida donde aporte valor.
Evitar consultas repetitivas.
Mantenibilidad
TypeScript estricto.
Componentes reutilizables.
Lógica centralizada.
Documentación actualizada.
Pruebas automatizadas.
Integridad
Transacciones.
Restricciones de base de datos.
Recalculo reproducible.
Auditoría.
Validaciones del servidor.
Compatibilidad
Navegadores modernos.
Diseño responsive.
Experiencia prioritaria en celular.
41. Fuera de alcance

No se implementará en Kickoff:

Múltiples quinielas simultáneas.
Múltiples deportes.
Aplicaciones móviles nativas.
Pagos.
Premios monetarios.
APIs deportivas de pago.
Resultados automáticos de terceros.
Autenticación social obligatoria.
Inteligencia artificial externa.
Estadísticas avanzadas no solicitadas.
Notificaciones push obligatorias.
42. Métricas de éxito

El producto será exitoso cuando:

Los usuarios puedan pronosticar sin ayuda.
No sea posible modificar pronósticos después del cierre.
Los puntos se calculen sin intervención manual.
Los pronósticos sean transparentes después del cierre.
Las reprogramaciones funcionen correctamente.
Las acciones administrativas sean rastreables.
El sistema opere sin costos obligatorios.
Las pruebas críticas sean exitosas.
43. Criterios de aceptación de Kickoff

La versión 1.0 se considerará lista cuando:

El primer superadministrador pueda inicializar el sistema.
Un visitante pueda registrarse.
El correo pueda confirmarse.
Un administrador pueda aprobar la cuenta.
El usuario pueda iniciar sesión.
Se puedan crear temporadas, jornadas y partidos.
Se pueda elegir un partido doble por jornada.
Los usuarios puedan pronosticar.
El backend rechace cambios tardíos.
Los pronósticos permanezcan ocultos antes del cierre.
Los pronósticos sean visibles después del cierre.
Un resultado pueda procesarse individualmente.
Los puntos se calculen correctamente.
La clasificación respete los desempates.
Las posiciones compartidas funcionen.
Las reprogramaciones no dependan del orden de jornada.
El sistema pueda recalcularse.
Las acciones críticas queden auditadas.
Existan exportaciones y respaldos.
El despliegue pueda mantenerse gratuitamente.
44. Dependencias documentales

Este documento debe leerse junto con:

README.md
docs/00-Project-Context.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/05-UI-UX.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
45. Aprobación funcional

Este documento refleja las decisiones funcionales acordadas para:

Quiniela Nacional La Goleada
Versión 1.0
Nombre interno: Kickoff

Toda desviación relevante deberá documentarse antes de implementarse.