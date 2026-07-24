# Diseño UI/UX

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Diseño funcional y visual inicial  
**Enfoque:** Mobile-first, responsive, moderno y minimalista  
**Idioma principal:** Español  
**Zona horaria visible:** `America/Tegucigalpa`

---

## 1. Propósito

Este documento define la experiencia de usuario y las pautas visuales de **Quiniela Nacional La Goleada – Kickoff**.

Su objetivo es establecer:

- Estructura de navegación.
- Jerarquía visual.
- Diseño de pantallas.
- Estados de partidos.
- Comportamiento de formularios.
- Adaptación móvil.
- Accesibilidad.
- Componentes reutilizables.
- Mensajes y confirmaciones.
- Identidad visual.
- Criterios de aceptación de interfaz.

La aplicación debe sentirse como un producto terminado, no como una herramienta administrativa improvisada.

---

## 2. Principios de experiencia

### 2.1 Mobile-first

La mayoría de los usuarios probablemente utilizará la aplicación desde el celular.

Por tanto:

- Las acciones principales deben ser fáciles de tocar.
- Los marcadores deben poder ingresarse sin zoom.
- Las tablas deben adaptarse.
- Los contadores deben ser visibles.
- Los menús no deben ocupar demasiado espacio.
- La navegación debe requerir pocos pasos.

### 2.2 Claridad antes que decoración

La interfaz debe ser atractiva, pero la prioridad será que el usuario comprenda rápidamente:

- Qué partidos puede pronosticar.
- Cuándo cierra cada partido.
- Si su pronóstico fue guardado.
- Qué partido vale doble.
- Cuántos puntos tiene.
- Qué posición ocupa.

### 2.3 Transparencia visible

La aplicación debe dejar claro:

- Cuándo los pronósticos están ocultos.
- Cuándo pasan a ser públicos.
- Cuándo un resultado aún no fue procesado.
- Cuándo una modificación administrativa afectó un partido.

### 2.4 Estados consistentes

Todos los partidos deberán mostrar estados de manera uniforme.

Un mismo estado deberá usar:

- La misma etiqueta.
- El mismo icono.
- El mismo estilo.
- El mismo significado.

### 2.5 Acciones seguras

Las operaciones destructivas o críticas deberán:

- Mostrar advertencia.
- Explicar el impacto.
- Solicitar confirmación.
- Evitar clics accidentales.

---

## 3. Identidad visual

La interfaz se inspirará en el logo de **La Goleada**.

La identidad debe transmitir:

- Fútbol.
- Competencia.
- Energía.
- Comunidad.
- Confianza.
- Modernidad.

No se debe copiar literalmente el diseño del logo en todos los elementos. Se utilizará como referencia para construir una interfaz coherente.

---

## 4. Paleta de colores

La paleta final deberá tomarse del archivo oficial del logo.

### 4.1 Colores base sugeridos


Primary Red
Primary Blue
Dark Navy
Light Background
White
Neutral Gray
Success Green
Warning Amber
Error Red

Ejemplo inicial de variables:

:root {
  --color-primary: #d71920;
  --color-primary-hover: #b8141a;

  --color-secondary: #173b7a;
  --color-secondary-hover: #102d60;

  --color-background: #f6f8fb;
  --color-surface: #ffffff;
  --color-surface-muted: #eef2f7;

  --color-text: #172033;
  --color-text-muted: #667085;
  --color-border: #d9e0ea;

  --color-success: #168a4a;
  --color-warning: #b26a00;
  --color-error: #c62828;
  --color-info: #2563eb;
}

Estos valores son provisionales y deberán ajustarse después de extraer la paleta exacta del logo.

5. Contraste

Todo texto deberá cumplir contraste suficiente sobre su fondo.

No se permitirá:

Texto rojo pequeño sobre fondo azul.
Texto gris demasiado claro.
Estados comunicados únicamente mediante color.
Botones sin foco visible.
Etiquetas con contraste insuficiente.

Cada estado incluirá además:

Texto.
Icono.
Etiqueta o forma.
6. Tipografía

Se utilizará una tipografía moderna, legible y gratuita.

Opciones adecuadas:

Inter.
Manrope.
Nunito Sans.
Source Sans 3.

La selección final deberá:

Tener licencia libre.
Ser legible en móvil.
Incluir suficientes pesos.
No afectar negativamente el rendimiento.
Escala sugerida
Display: 36–48 px
H1: 30–36 px
H2: 24–30 px
H3: 20–24 px
Body large: 18 px
Body: 16 px
Small: 14 px
Caption: 12 px

En móvil se podrá reducir la escala manteniendo jerarquía.

7. Espaciado

Se utilizará una escala consistente basada en múltiplos de cuatro.

4 px
8 px
12 px
16 px
20 px
24 px
32 px
40 px
48 px
64 px

Las pantallas no deben verse saturadas.

El espacio debe ayudar a separar:

Secciones.
Tarjetas.
Controles.
Grupos de información.
8. Bordes y sombras
Bordes
Small radius: 6 px
Medium radius: 10 px
Large radius: 16 px
Pill radius: 999 px
Sombras

Las sombras serán suaves.

Se evitarán:

Sombras oscuras exageradas.
Efectos tridimensionales pesados.
Brillos excesivos.
Gradientes innecesarios.
9. Iconografía

Se utilizará una librería gratuita y consistente, como Lucide Icons.

Ejemplos:

Acción	Icono conceptual
Pronósticos	Target o clipboard
Tabla	Trophy
Resultados	ListChecks
Administración	Settings
Partido doble	Flame o Star
Cerrado	Lock
Reprogramado	CalendarClock
Suspendido	PauseCircle
Procesado	CheckCircle
Notificaciones	Bell
Equipo favorito	Shield

Los iconos nunca deberán sustituir completamente al texto en acciones importantes.

10. Logo y recursos

El logo deberá ubicarse en:

public/branding/logo.png

También se incluirán:

public/branding/logo-mark.png
public/branding/favicon.ico
public/branding/apple-touch-icon.png

El diseño deberá tolerar que el logo sea reemplazado sin modificar código.

11. Layout general
Escritorio
┌──────────────────────────────────────────────────────┐
│ Logo | Dashboard | Pronósticos | Tabla | Resultados │
│      | Cómo funciona | Perfil | Notificaciones      │
├──────────────────────────────────────────────────────┤
│                                                      │
│                 Contenido principal                  │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Patrocinadores | Enlaces | Información               │
└──────────────────────────────────────────────────────┘
Móvil
┌──────────────────────────┐
│ Logo              Menú   │
├──────────────────────────┤
│                          │
│     Contenido principal  │
│                          │
├──────────────────────────┤
│ Navegación inferior      │
└──────────────────────────┘

Se podrá utilizar una barra inferior móvil con accesos a:

Inicio.
Pronósticos.
Tabla.
Resultados.

El resto de opciones podrá estar en el menú.

12. Navegación pública

Antes de iniciar sesión:

Inicio.
Cómo funciona.
Patrocinadores.
Iniciar sesión.
Registrarse.

La página principal pública debe explicar de forma breve:

Qué es la quiniela.
Cómo participar.
Cómo se obtienen puntos.
Por qué se requiere aprobación.
Que el servicio es gratuito.
13. Navegación autenticada
Usuario
Dashboard.
Pronósticos.
Tabla.
Resultados.
Cómo funciona.
Patrocinadores.
Mi perfil.
Cerrar sesión.
Administrador

Además:

Administración.
Usuarios pendientes.
Jornadas.
Partidos.
Auditoría.
Superadministrador

Además:

Configuración.
Diagnóstico.
Exportaciones.
Herramientas de prueba.
Gestión de administradores.
14. Página pública de inicio
Estructura
Encabezado.
Hero principal.
Cómo funciona en tres pasos.
Sistema de puntuación.
Partido doble.
Beneficios.
Patrocinadores.
Llamada a registrarse.
Pie de página.
Hero sugerido
Quiniela Nacional La Goleada

Pronostica. Compite. Disfruta cada jornada.

Participa con tu comunidad en una quiniela moderna,
gratuita y transparente de la Liga Nacional de Honduras.

[Registrarme] [Cómo funciona]
Beneficios
Pronósticos privados hasta el cierre.
Puntuación automática.
Tabla actualizada.
Partidos reprogramados.
Transparencia total.
15. Registro
Campos
Nombre.
Apellido.
Nickname.
Correo.
Contraseña.
Confirmar contraseña.
Equipo favorito.
Aceptación de reglas.
Comportamiento
Validación en línea.
Mensajes claros.
Indicador de contraseña.
Logos de equipos en selector.
Botón principal visible.
Enlace a login.
Confirmación

Después del registro:

Revisa tu correo

Te enviamos un enlace de confirmación.
Después de confirmar tu correo, tu cuenta quedará pendiente
de aprobación por un administrador.

No se debe hacer creer al usuario que ya puede ingresar.

16. Inicio de sesión
Campos
Correo.
Contraseña.
Recordar sesión, si se implementa.
Recuperar contraseña.
Mensajes

Error genérico:

No fue posible iniciar sesión con los datos proporcionados.

Estados especiales:

Tu correo todavía no ha sido confirmado.
Tu cuenta está pendiente de aprobación.
Tu cuenta está bloqueada.

Los mensajes deberán ser suficientemente claros sin revelar información innecesaria.

17. Recuperación de contraseña

Flujo:

Ingresar correo.
Mostrar confirmación genérica.
Recibir enlace.
Crear nueva contraseña.
Confirmación.
Volver al login.

Pantalla de confirmación:

Si existe una cuenta asociada a ese correo,
recibirás instrucciones para restablecer tu contraseña.
18. Estado pendiente de aprobación

Cuando el usuario ya confirmó el correo pero todavía no fue aprobado:

Tu cuenta está pendiente de aprobación

Un administrador revisará tu solicitud.
Recibirás acceso cuando tu cuenta sea aprobada.

La pantalla podrá mostrar:

Nickname.
Correo.
Equipo favorito.
Botón cerrar sesión.

No deberá mostrar el dashboard.

19. Dashboard
Objetivo

Dar una visión inmediata de la situación del usuario.

Estructura sugerida
Hola, Juan 👋

┌────────────┐ ┌────────────┐
│ Posición 3 │ │ 47 puntos  │
└────────────┘ └────────────┘

┌────────────┐ ┌────────────┐
│ 11 exactos │ │ 14 parciales│
└────────────┘ └────────────┘

Próximo cierre
Olimpia vs Motagua
Cierra en 01:42:31
Doble puntuación

Pronósticos pendientes
3 partidos
[Ir a pronosticar]

Top 5
1. Carlos
2. Luis
3. Juan
4. Pedro
5. Mario
Prioridad móvil

En móvil:

Tarjetas en dos columnas cuando sea posible.
Una columna en pantallas muy pequeñas.
Botón de pronosticar fijo o muy visible.
Cuenta regresiva destacada.
20. Tarjetas de resumen

Componente:

StatCard

Propiedades:

Título.
Valor.
Icono.
Tendencia opcional.
Texto auxiliar.
Estado de carga.

Ejemplos:

Posición.
Puntos.
Exactos.
Parciales.

No deben utilizar demasiados colores distintos.

21. Página de pronósticos
Orden

Los partidos se ordenarán por fecha real.

Agrupaciones sugeridas:

Hoy.
Mañana.
Esta semana.
Próximamente.
Cerrados recientemente.
Procesados.

Dentro de cada partido se mostrará la jornada.

Ejemplo:

Jornada 5
Reprogramado

Olimpia            [ 2 ]
Motagua            [ 1 ]

Cierra en 01:42:31

Pronóstico guardado
Tarjeta de partido

Información:

Jornada.
Estado.
Fecha.
Hora.
Local.
Visitante.
Logos.
Marcadores.
Contador.
Partido doble.
Estado de guardado.
Partido doble

Debe destacar mediante:

🔥 Doble puntuación

La etiqueta no debe interferir con la lectura.

22. Estados de pronóstico
Sin completar
Pronóstico pendiente
Guardando
Guardando...
Guardado
Pronóstico guardado
Error
No fue posible guardar. Intenta nuevamente.
Cierra pronto
Cierra en 18:32
Cerrado
Pronóstico cerrado
Reprogramado y abierto
Partido reprogramado
Nuevo cierre: 15 de octubre, 6:55 p. m.
23. Entrada de marcador

La entrada debe ser fácil en celular.

Opciones:

Campo numérico grande.
Botones de más y menos.
Teclado numérico.
Ancho limitado.
Etiqueta clara.

Ejemplo:

[ - ]  2  [ + ]

No se deben usar selectores muy lentos.

El control deberá aceptar escritura directa.

24. Guardado automático

Comportamiento sugerido:

El usuario modifica un valor.
El sistema espera entre 500 y 1,000 ms.
Envía el pronóstico.
Muestra “Guardando”.
Confirma “Guardado”.

Si el usuario sigue escribiendo:

Se cancela la solicitud pendiente cuando sea posible.
Se guarda el último valor válido.
No se muestran confirmaciones falsas.

El sistema podrá incluir un botón Guardar como respaldo visual si se considera necesario.

25. Cuenta regresiva

El contador se mostrará como:

01:42:31

Cuando queden más de 24 horas:

2 días 04:15

Cuando falten menos de treinta minutos:

Se destacará.
Mostrará una advertencia.
No dependerá únicamente del color.

Cuando cierre:

Cerrado

El contador del cliente es informativo. La validación definitiva corresponde al servidor.

26. Tabla general
Escritorio
Pos.	Jugador	Parciales	Exactos	Puntos	Tendencia
1	Carlos	14	12	50	↑
2	Ana	16	11	47	—
2	Pedro	16	11	47	↑
4	Juan	18	9	45	↓
Móvil

La tabla podrá convertirse en filas compactas:

🥇 1  Carlos
50 pts · 12 exactos · 14 parciales
↑ Subió

No debe requerir desplazamiento horizontal excesivo.

Primeras posiciones

Se podrán usar:

Medalla dorada.
Medalla plateada.
Medalla bronce.

Las medallas no deben alterar la numeración cuando existan posiciones compartidas.

27. Posiciones compartidas

Ejemplo:

1 Carlos
2 Ana
2 Pedro
4 Juan

La interfaz debe mostrar claramente que Ana y Pedro comparten posición.

No debe renumerar visualmente como 1, 2, 2, 3.

28. Tendencia

Estados:

Subió.
Bajó.
Se mantuvo.
Sin comparación.

Iconos sugeridos:

↑ Subió
↓ Bajó
— Igual
• Nuevo

Nunca mostrar una flecha sin texto accesible.

29. Página de resultados
Secciones
Cerrados pendientes de procesamiento.
Procesados recientemente.
Resultados anteriores.
Partido pendiente
Jornada 8
Olimpia vs Motagua

Resultado pendiente de procesamiento

Pronósticos:
Juan      2-1
Carlos    1-0
Ana       Sin pronóstico

No se muestran puntos.

Partido procesado
Olimpia 2-1 Motagua

Juan      2-1   Exacto    3 pts
Carlos    1-0   Parcial   1 pt
Ana       —     Sin pronóstico   0 pts
30. Detalle de partido

El detalle podrá mostrar:

Jornada.
Fecha y hora.
Estado.
Equipos.
Marcador oficial.
Partido doble.
Historial de reprogramación.
Pronósticos.
Puntos.
Información de procesamiento.

Antes del cierre, la lista de pronósticos no debe estar disponible.

31. Cómo funciona

La sección tendrá tarjetas o pasos.

Paso 1
Regístrate y confirma tu correo
Paso 2
Espera la aprobación de un administrador
Paso 3
Pronostica antes del cierre
Puntuación
Marcador exacto: 3 puntos
Ganador o empate: 1 punto
Incorrecto: 0 puntos
Partido doble: puntos ×2
Transparencia
Los pronósticos de los demás se muestran únicamente
después del cierre.
32. Perfil

Mostrará:

Nombre.
Apellido.
Nickname.
Correo de solo lectura.
Equipo favorito.
Logo del equipo.
Posición.
Puntos.
Exactos.
Parciales.

Acciones:

Cambiar contraseña.
Cerrar otras sesiones, si se implementa.
Cerrar sesión.

No incluirá cambio de correo.

33. Notificaciones
Centro de notificaciones

Cada elemento incluirá:

Icono.
Título.
Mensaje breve.
Fecha.
Estado leído.
Enlace opcional.

Ejemplos:

Partido reprogramado
Olimpia vs Motagua ahora se jugará el 15 de octubre.
Tienes 3 pronósticos pendientes
El próximo cierre es hoy a las 6:55 p. m.
Indicador

El encabezado mostrará:

Bell + cantidad no leída
34. Patrocinadores

La sección podrá mostrar:

Tarjetas.
Logos.
Enlaces.
Carrusel opcional.

Cuando no existan patrocinadores:

No mostrar contenedores vacíos innecesarios.
Mantener el pie de página limpio.
35. Panel administrativo
Inicio administrativo

Tarjetas:

Usuarios pendientes.
Partidos abiertos.
Partidos cerrados pendientes.
Jornadas activas.
Errores recientes.
Últimas acciones.

Acciones rápidas:

Crear jornada.
Crear partido.
Procesar resultado.
Aprobar usuarios.
36. Usuarios pendientes

Cada solicitud mostrará:

Nombre completo.
Nickname.
Correo.
Equipo favorito.
Fecha de registro.
Estado de confirmación.

Acciones:

Aprobar.
Rechazar.
Ver detalle.

El rechazo podrá solicitar motivo opcional.

37. Gestión de usuarios

Filtros:

Todos.
Pendientes.
Aprobados.
Bloqueados.
Desactivados.
Administradores.

Columnas:

Nombre.
Nickname.
Correo.
Rol.
Estado.
Equipo.
Acciones.

El correo siempre será de solo lectura.

38. Gestión de jornadas

Lista:

Nombre.
Temporada.
Estado.
Cantidad de partidos.
Partido doble.
Procesados.
Pendientes.

Acciones:

Crear.
Editar.
Publicar.
Archivar.
Ver partidos.

Advertencias:

Sin partidos.
Sin partido doble.
Más de un doble.
Partidos sin fecha.
39. Gestión de partidos

Lista ordenable por:

Fecha.
Jornada.
Estado.
Equipo.

Filtros:

Abiertos.
Reprogramados.
Cerrados.
Pendientes de procesamiento.
Procesados.
Suspendidos.
Cancelados.

Acciones:

Crear.
Editar.
Reprogramar.
Suspender.
Reanudar.
Cancelar.
Procesar.
40. Formulario de partido

Campos:

Temporada.
Jornada.
Equipo local.
Equipo visitante.
Fecha.
Hora.
Estadio.
Partido doble.
Notas.

Validaciones visibles:

Equipos distintos.
Fecha válida.
Jornada válida.
Doble único.
Posible duplicado.

La advertencia de duplicado no deberá bloquear automáticamente.

41. Reprogramación

Modal o pantalla:

Reprogramar partido

Fecha actual:
10 de agosto, 7:00 p. m.

Nueva fecha:
[ fecha ] [ hora ]

Motivo:
[ opcional ]

Los pronósticos existentes se conservarán.
Si el nuevo cierre está en el futuro, el partido podrá reabrirse.

[Cancelar] [Confirmar reprogramación]
42. Procesamiento de resultado

Pantalla:

Procesar resultado

Olimpia vs Motagua

Olimpia    [ 2 ]
Motagua    [ 1 ]

Este partido vale doble.

Esta acción calculará los puntos de todos los usuarios
y actualizará la clasificación.

[Cancelar] [Procesar resultado]

Después:

Resultado procesado correctamente

Usuarios evaluados: 48
Exactos: 8
Parciales: 21
Incorrectos: 15
Sin pronóstico: 4
43. Corrección de resultado

Debe usar una confirmación reforzada.

Corregir resultado procesado

Resultado actual: 2-1
Nuevo resultado: 1-1

Esta acción recalculará la clasificación completa.

Motivo obligatorio:
[ texto ]

Escribe CORREGIR para confirmar:
[          ]
44. Auditoría

La tabla mostrará:

Fecha.
Administrador.
Acción.
Entidad.
Resumen.
Detalle.

Filtros:

Fecha.
Actor.
Acción.
Entidad.

Detalle expandible:

Antes
scheduledAt: 10/08/2026 19:00

Después
scheduledAt: 15/10/2026 20:00

Los registros no tendrán acciones de editar o eliminar.

45. Centro de diagnóstico

Tarjetas:

Base de datos.
SMTP.
Usuarios.
Partidos.
Pronósticos.
Errores.
Auditoría.

Estados:

Operativo.
Advertencia.
Error.
No configurado.

Herramientas:

Verificar integridad.
Exportar datos.
Generar datos de prueba.
Simular jornada.
Recalcular temporada.
Consola SQL.

Cada acción avanzada deberá incluir advertencia.

46. Consola SQL
Modo seguro

Etiqueta visible:

Solo lectura

Editor:

SELECT *
FROM "User"
LIMIT 50;

Resultado en tabla con:

Paginación.
Tiempo.
Cantidad de filas.
Descarga CSV opcional.
Modo escritura

Debe estar visualmente separado.

Advertencia:

Modo avanzado

Las operaciones pueden modificar datos.
Todas las consultas serán auditadas.

No deberá activarse accidentalmente.

47. Modo mantenimiento

Pantalla pública:

Estamos realizando mantenimiento

Quiniela Nacional La Goleada volverá pronto.
Tus pronósticos y puntos están seguros.

Los administradores podrán ver:

Motivo.
Hora de activación.
Usuario que lo activó.
Botón para desactivar.
48. Temporadas históricas

Pantalla:

Historial de temporadas

Apertura 2026
Campeón: Carlos
50 puntos
12 exactos

[Ver tabla final]

Si hay campeones compartidos:

Campeones: Ana y Pedro
49. Estados vacíos

Cada pantalla deberá tener un estado vacío útil.

Sin partidos
No hay partidos programados todavía.
Sin pronósticos pendientes
Estás al día. No tienes pronósticos pendientes.
Sin resultados
Todavía no hay resultados procesados.
Sin patrocinadores

No mostrar mensaje innecesario al usuario normal.

Sin auditorías
No se encontraron acciones con los filtros seleccionados.
50. Estados de carga

Se utilizarán:

Skeletons.
Indicadores discretos.
Botones con estado cargando.
Bloqueo temporal de acciones duplicadas.

No se deberá dejar una pantalla completamente en blanco.

51. Toasts

Ejemplos:

Pronóstico guardado.
Usuario aprobado.
Partido reprogramado.
Resultado procesado.
No fue posible completar la operación.

Los toasts no deben ser el único lugar donde se muestre un error importante.

Los formularios también deberán mostrar errores junto al campo o sección correspondiente.

52. Modales

Se utilizarán para:

Confirmaciones.
Acciones breves.
Detalles secundarios.

No se utilizarán para formularios muy extensos.

Los modales deberán:

Tener foco controlado.
Cerrar con Escape cuando sea seguro.
Tener título.
Tener botones claros.
Ser accesibles.
53. Botones
Variantes
Primario.
Secundario.
Fantasma.
Peligro.
Enlace.
Reglas
Un solo botón primario principal por sección.
Botón peligro únicamente para acciones riesgosas.
Estados deshabilitados claros.
Área táctil mínima adecuada.
Texto específico.

Preferir:

Procesar resultado

En lugar de:

Aceptar
54. Formularios

Cada campo deberá tener:

Etiqueta.
Ayuda opcional.
Mensaje de error.
Estado deshabilitado.
Valor persistente cuando falle el envío.

No utilizar únicamente placeholders como etiquetas.

55. Tablas

En escritorio:

Encabezados claros.
Ordenamiento cuando aporte valor.
Paginación.
Filtros.
Búsqueda.

En móvil:

Transformar en tarjetas o filas compactas.
Mostrar primero información esencial.
Evitar columnas ilegibles.
56. Búsqueda y filtros

Filtros deberán:

Ser fáciles de limpiar.
Mostrar cuántos están activos.
Conservarse durante navegación razonable.
No esconder resultados sin explicación.
57. Paginación

Se utilizará para:

Usuarios.
Auditorías.
Resultados históricos.
Notificaciones.
Consultas SQL.
Logs.

No se requiere paginación para una jornada con pocos partidos.

58. Accesibilidad

Requisitos:

Navegación por teclado.
Foco visible.
Etiquetas semánticas.
aria-label cuando sea necesario.
Mensajes asociados a campos.
Contraste adecuado.
Estados no dependientes del color.
Orden de tabulación lógico.
Textos alternativos en logos.
Respeto a prefers-reduced-motion.
59. Animaciones

Las animaciones serán:

Cortas.
Discretas.
Funcionales.
Desactivables según preferencias del usuario.

Ejemplos:

Aparición de toast.
Expansión de detalle.
Cambio suave de contador.
Actualización de tendencia.

No utilizar:

Animaciones largas.
Parallax.
Efectos que distraigan.
Confeti en acciones administrativas.

Se podrá considerar una celebración discreta al finalizar una temporada.

60. Responsive breakpoints

Referencia inicial:

Small: 640 px
Medium: 768 px
Large: 1024 px
Extra Large: 1280 px

La interfaz deberá diseñarse por contenido, no únicamente por dispositivo.

61. SEO y metadatos

Páginas públicas:

Título.
Descripción.
Open Graph.
Favicon.
Logo.
Idioma es.

Páginas privadas y administrativas:

No indexar.
No exponer datos sensibles en metadatos.
62. Página 404
Página no encontrada

Parece que este balón salió de la cancha.

[Volver al inicio]
63. Página de error
Ocurrió un problema

No pudimos cargar esta información.
Tus datos no se han modificado.

[Intentar nuevamente]

No mostrar stack traces.

64. Textos y tono

El tono será:

Cercano.
Claro.
Deportivo.
Profesional.
No excesivamente informal.

Ejemplos positivos:

Tu pronóstico fue guardado.
Este partido cierra en 20 minutos.
Los pronósticos ya son públicos.

Evitar:

Error 500 inesperado.
Objeto inválido.
Operación CRUD fallida.
65. Formato de fecha

Formato visible recomendado:

15 de octubre de 2026
7:00 p. m.

Formato compacto:

15 oct · 7:00 p. m.

Siempre en hora de Honduras.

66. Formato de puntos
1 punto
2 puntos

No mostrar:

1 puntos
67. Wireframe móvil de pronósticos
┌──────────────────────────────┐
│ La Goleada              ☰    │
├──────────────────────────────┤
│ Pronósticos                  │
│ Tienes 3 pendientes          │
│                              │
│ HOY                          │
│ ┌──────────────────────────┐ │
│ │ Jornada 8               │ │
│ │ 🔥 Doble puntuación     │ │
│ │                          │ │
│ │ [Logo] Olimpia       2  │ │
│ │ [Logo] Motagua       1  │ │
│ │                          │ │
│ │ Cierra en 01:42:31      │ │
│ │ ✓ Pronóstico guardado   │ │
│ └──────────────────────────┘ │
│                              │
│ PRÓXIMAMENTE                 │
│ ┌──────────────────────────┐ │
│ │ Jornada 5               │ │
│ │ Reprogramado            │ │
│ │ ...                      │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Inicio Pronósticos Tabla ... │
└──────────────────────────────┘
68. Wireframe de dashboard
┌──────────────────────────────────────┐
│ Hola, Juan                           │
│                                      │
│ ┌─────────┐ ┌─────────┐              │
│ │ Pos. 3  │ │ 47 pts  │              │
│ └─────────┘ └─────────┘              │
│ ┌─────────┐ ┌─────────┐              │
│ │11 exact.│ │14 parcial│              │
│ └─────────┘ └─────────┘              │
│                                      │
│ Próximo cierre                       │
│ Olimpia vs Motagua                   │
│ 🔥 Doble puntuación                  │
│ 01:42:31                             │
│                                      │
│ [Completar pronósticos]              │
│                                      │
│ Top 5                                │
│ 1 Carlos                             │
│ 2 Luis                               │
│ 3 Juan                               │
└──────────────────────────────────────┘
69. Wireframe administrativo
┌─────────────────────────────────────────────┐
│ Administración                             │
├─────────────────────────────────────────────┤
│ [3 usuarios pendientes]                    │
│ [2 partidos por procesar]                  │
│ [1 partido reprogramado]                   │
│                                             │
│ Acciones rápidas                            │
│ [Crear jornada] [Crear partido]             │
│                                             │
│ Partidos pendientes                         │
│ Olimpia vs Motagua      [Procesar]          │
│ Real España vs Marathón [Procesar]          │
│                                             │
│ Últimas acciones                            │
│ Juan procesó Olimpia 2-1 Motagua            │
└─────────────────────────────────────────────┘
70. Componentes reutilizables

Componentes sugeridos:

AppHeader
MobileNavigation
Sidebar
PageHeader
SectionCard
StatCard
MatchCard
PredictionInput
Countdown
StatusBadge
DoublePointsBadge
TeamLogo
StandingTable
StandingRow
TrendIndicator
NotificationItem
EmptyState
ErrorState
LoadingSkeleton
ConfirmationDialog
DangerConfirmationDialog
AuditTable
DataTable
Pagination
FilterBar
SponsorCard
Toast
FormField
PasswordStrength
71. Estados de MatchCard

El componente deberá soportar:

OPEN
CLOSING_SOON
CLOSED
RESCHEDULED_OPEN
RESCHEDULED_CLOSED
SUSPENDED
FINISHED_PENDING
PROCESSED
CANCELLED

Cada estado deberá tener pruebas visuales.

72. Reglas para el partido doble

El partido doble deberá:

Tener etiqueta visible.
Mantener contraste.
No depender solo de rojo.
Ser anunciado antes del marcador.
Mostrarse en dashboard y lista.
Mostrar puntos dobles después de procesarse.
73. Seguridad visual

La interfaz no deberá:

Mostrar herramientas administrativas antes de validar rol.
Mostrar datos de otros usuarios antes del cierre.
Exponer identificadores técnicos innecesarios.
Mostrar secretos en diagnóstico.
Autocompletar contraseñas en campos incorrectos.
Renderizar HTML no sanitizado.
74. Rendimiento visual

Se deberá:

Optimizar logos.
Reservar espacio para imágenes.
Evitar saltos de layout.
Cargar listas por páginas.
Mostrar skeletons.
Reducir JavaScript en cliente.
Evitar animaciones pesadas.
75. Modo oscuro

El modo oscuro no es obligatorio para la primera entrega funcional.

La arquitectura visual podrá prepararse mediante variables de color.

No deberá retrasar las funciones principales.

Si se implementa:

Deberá respetar contraste.
Guardar preferencia.
Permitir modo sistema.
Probar todos los estados.
76. Criterios de aceptación UI/UX

La interfaz será aceptada cuando:

Sea usable desde un celular pequeño.
El usuario pueda pronosticar con pocos pasos.
El guardado sea claramente visible.
El cierre sea comprensible.
El partido doble sea evidente.
Los pronósticos ajenos estén ocultos correctamente.
La tabla sea legible en móvil.
Los administradores puedan procesar sin confusión.
Las acciones críticas tengan confirmación.
Los estados no dependan solo del color.
Existan estados vacíos y de error.
La navegación por teclado funcione.
El logo pueda sustituirse fácilmente.
La ausencia de patrocinadores no rompa el diseño.
Las reprogramaciones sean visibles.
La aplicación mantenga coherencia visual.
77. Pruebas visuales mínimas

Probar:

Registro en móvil.
Login.
Cuenta pendiente.
Dashboard sin puntos.
Dashboard con datos.
Pronóstico vacío.
Pronóstico guardando.
Pronóstico guardado.
Pronóstico cerrado.
Partido doble.
Partido reprogramado.
Partido suspendido.
Tabla con empate.
Tabla móvil.
Resultado pendiente.
Resultado procesado.
Panel administrativo.
Auditoría.
Diagnóstico.
Página 404.
Página de error.
Modo mantenimiento.
Navegación con teclado.
Contraste.
Reducción de movimiento.
78. Documentos relacionados

Consultar:

README.md
docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/04-ReglasNegocio.md
docs/06-API.md
docs/07-Seguridad.md
docs/08-Testing.md
docs/10-ManualAdministrador.md
docs/11-ManualUsuario.md
79. Conclusión

La experiencia de Kickoff deberá permitir que cualquier participante pueda:

Entrar.
Saber qué partidos están abiertos.
Pronosticar.
Confirmar que se guardó.
Consultar su posición.
Ver los pronósticos después del cierre.

Todo ello sin necesidad de comprender detalles técnicos ni realizar procesos complejos.

La interfaz deberá ser moderna, deportiva y atractiva, pero siempre subordinada a la claridad, la transparencia y la facilidad de uso.