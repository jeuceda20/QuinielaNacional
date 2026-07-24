# Seguridad

## Quiniela Nacional La Goleada

**Versión:** 1.0  
**Nombre interno:** Kickoff  
**Estado:** Diseño de seguridad inicial  
**Clasificación:** Aplicación web comunitaria con datos personales básicos  
**Zona horaria de negocio:** `America/Tegucigalpa`  
**Principio principal:** La seguridad no deberá depender únicamente de la interfaz.

---

## 1. Propósito

Este documento define los requisitos, controles y prácticas de seguridad de **Quiniela Nacional La Goleada – Kickoff**.

Su objetivo es proteger:

- Cuentas de usuario.
- Contraseñas.
- Sesiones.
- Pronósticos privados.
- Resultados.
- Clasificación.
- Herramientas administrativas.
- Auditoría.
- Configuración.
- Datos personales.
- Integridad de la competencia.

Este documento debe utilizarse junto con:

- Reglas de negocio.
- Arquitectura.
- Modelo de datos.
- API.
- Testing.
- Deployment.

---

# 2. Objetivos de seguridad

La aplicación deberá garantizar razonablemente:

## 2.1 Confidencialidad

Evitar acceso no autorizado a:

- Contraseñas.
- Sesiones.
- Pronósticos antes del cierre.
- Herramientas administrativas.
- Datos internos.
- Exportaciones.
- Variables de entorno.

## 2.2 Integridad

Evitar modificaciones no autorizadas en:

- Pronósticos.
- Resultados.
- Puntuaciones.
- Clasificación.
- Roles.
- Auditoría.
- Configuración.

## 2.3 Disponibilidad

Reducir el riesgo de interrupción provocado por:

- Abuso de login.
- Solicitudes excesivas.
- Consultas SQL pesadas.
- Exportaciones masivas.
- Procesamientos duplicados.
- Errores de configuración.

## 2.4 Trazabilidad

Registrar las acciones administrativas relevantes para poder determinar:

- Quién realizó una acción.
- Cuándo la realizó.
- Qué entidad fue afectada.
- Qué cambió.
- Desde qué solicitud se ejecutó.

---

# 3. Modelo de amenazas

## 3.1 Actores considerados

- Visitante no autenticado.
- Usuario registrado no aprobado.
- Usuario normal aprobado.
- Administrador.
- Superadministrador.
- Atacante externo.
- Usuario con credenciales robadas.
- Administrador que comete un error.
- Administrador malintencionado.
- Script automatizado.
- Dependencia comprometida.
- Proveedor externo indisponible.

---

## 3.2 Activos protegidos

- Contraseñas.
- Tokens.
- Cookies de sesión.
- Direcciones de correo.
- Pronósticos.
- Resultados.
- Clasificación.
- Historial de temporadas.
- Auditoría.
- Base de datos.
- Credenciales SMTP.
- Secretos de aplicación.
- Respaldos.
- Exportaciones.
- Consola SQL.

---

## 3.3 Amenazas principales

- Fuerza bruta.
- Credential stuffing.
- Robo de sesión.
- Fijación de sesión.
- CSRF.
- XSS.
- Inyección SQL.
- Enumeración de usuarios.
- Escalamiento de privilegios.
- Acceso horizontal a datos.
- Manipulación de pronósticos.
- Pronósticos enviados después del cierre.
- Procesamiento duplicado.
- Alteración de resultados.
- Exposición de auditoría.
- Descarga de exportaciones ajenas.
- Uso indebido de diagnóstico.
- Dependencias vulnerables.
- Secretos incluidos en repositorio.
- Logs con datos sensibles.

---

# 4. Principios obligatorios

## SEC-001 — Servidor como autoridad

El backend deberá validar siempre:

- Sesión.
- Estado de cuenta.
- Rol.
- Permisos.
- Hora de cierre.
- Propiedad del recurso.
- Estado del partido.
- Visibilidad de pronósticos.

Ocultar controles en el frontend no constituye autorización.

---

## SEC-002 — Mínimo privilegio

Cada usuario y componente tendrá únicamente los permisos necesarios.

Ejemplos:

- Usuario normal no consulta auditoría.
- Administrador no promueve administradores.
- Superadministrador no recibe secretos en pantalla.
- El proceso web no debe tener permisos de administración total sobre PostgreSQL.

---

## SEC-003 — Defensa en profundidad

Las reglas críticas deberán protegerse mediante varias capas:

- Validación.
- Autorización.
- Restricciones de base de datos.
- Transacciones.
- Auditoría.
- Pruebas.

---

## SEC-004 — Fallo seguro

Cuando exista incertidumbre, el sistema deberá denegar la operación.

Ejemplos:

- No puede comprobarse la sesión.
- El horario no puede determinarse.
- El partido está en estado inconsistente.
- El rol no es válido.
- El token no puede verificarse.

---

## SEC-005 — Sin seguridad por ocultamiento

La seguridad no dependerá de:

- Rutas difíciles de adivinar.
- Identificadores ocultos.
- Botones invisibles.
- Código JavaScript ofuscado.
- Nombres de endpoints secretos.

---

# 5. Clasificación de datos

## 5.1 Públicos

- Nombre de la aplicación.
- Logo.
- Equipos activos.
- Reglamento.
- Patrocinadores.
- Configuración pública.

## 5.2 Internos

- Estados administrativos.
- Auditoría.
- Configuración operativa.
- Errores técnicos.
- Diagnóstico.

## 5.3 Personales básicos

- Nombre.
- Apellido.
- Nickname.
- Correo.
- Equipo favorito.
- Fecha de registro.
- Historial de participación.

## 5.4 Sensibles de autenticación

- Contraseña.
- Hash de contraseña.
- Tokens.
- Sesiones.
- Cookies.
- Secretos.
- Credenciales SMTP.

Los datos sensibles de autenticación nunca deberán exponerse en respuestas, logs o auditorías.

---

# 6. Contraseñas

## 6.1 Almacenamiento

Las contraseñas deberán almacenarse utilizando:

1. Argon2id como opción preferida.
2. bcrypt como alternativa.

Nunca se utilizará:

- Texto plano.
- MD5.
- SHA-1.
- SHA-256 sin una función específica de password hashing.
- Cifrado reversible.

---

## 6.2 Política mínima

La contraseña deberá:

- Tener al menos 10 caracteres.
- Permitir frases largas.
- Aceptar caracteres especiales.
- No imponer reglas confusas innecesarias.
- Tener un máximo técnico para evitar abuso.

Máximo sugerido:


128 caracteres

Se podrá exigir al menos:

Una letra.
Un número.

No se recomienda obligar a cambiar la contraseña periódicamente sin evidencia de compromiso.

6.3 Comparación

La comparación del hash deberá utilizar la función segura de la librería seleccionada.

No deberá implementarse manualmente.

6.4 Rehash

Cuando cambien los parámetros del algoritmo, el sistema podrá recalcular el hash después de un login exitoso.

6.5 Contraseñas en memoria

Las contraseñas deberán:

Procesarse únicamente durante la operación requerida.
No registrarse.
No incluirse en errores.
No almacenarse en auditoría.
No enviarse a servicios externos.
7. Registro
7.1 Validación

El registro deberá validar:

Nombre.
Apellido.
Nickname.
Correo.
Contraseña.
Equipo favorito.
Aceptación de reglas.

La validación definitiva se hará en el servidor.

7.2 Normalización

El correo deberá:

Eliminar espacios exteriores.
Convertirse a minúsculas.
Validarse sintácticamente.

El nickname deberá:

Eliminar espacios exteriores.
Aplicar reglas de longitud.
Compararse sin distinguir mayúsculas.
Bloquear caracteres de control.
7.3 Enumeración

El registro podrá informar que correo o nickname están en uso porque el usuario está creando una cuenta.

Sin embargo, los endpoints de recuperación deberán utilizar respuestas genéricas.

7.4 Rate limiting

Aplicar límites por:

IP.
Correo normalizado o hash.
Ventana de tiempo.

Ejemplo inicial:

5 registros por IP por hora

Los valores finales deberán ser configurables.

7.5 Bots

No se incluirá CAPTCHA de pago.

Controles gratuitos posibles:

Campo honeypot.
Tiempo mínimo razonable del formulario.
Rate limiting.
Bloqueo temporal.
Validación de comportamiento.
Aprobación administrativa.

La aprobación manual ya reduce significativamente el impacto de cuentas automatizadas.

8. Confirmación de correo
8.1 Token

El token deberá:

Ser generado con fuente criptográfica.
Tener entropía suficiente.
Ser impredecible.
Ser de un solo uso.
Tener expiración.

Longitud sugerida:

32 bytes aleatorios o más
8.2 Persistencia

La base de datos guardará únicamente:

hash(token)

El token sin hash se enviará por correo.

8.3 Expiración

Periodo inicial sugerido:

24 horas
8.4 Reenvío

Al reenviar confirmación:

Podrán invalidarse tokens anteriores.
Se aplicará rate limiting.
La respuesta será genérica.
No se enviarán correos ilimitados.
9. Recuperación de contraseña
9.1 Respuesta genérica

El sistema responderá:

Si existe una cuenta asociada, recibirás instrucciones.

No deberá indicar si:

El correo existe.
La cuenta está bloqueada.
La cuenta está pendiente.
El correo no fue confirmado.
9.2 Token

El token será:

Aleatorio.
De un solo uso.
Almacenado como hash.
Con expiración corta.

Periodo inicial sugerido:

30 minutos
9.3 Después del cambio

Al completar el restablecimiento:

Invalidar el token.
Revocar sesiones existentes.
Registrar un evento de seguridad.
Enviar confirmación opcional al correo.
No incluir la nueva contraseña en ningún mensaje.
10. Sesiones
10.1 Tipo

La autenticación utilizará sesiones opacas persistidas en base de datos.

La cookie contendrá un token aleatorio, no datos del usuario.

10.2 Cookie

En producción:

HttpOnly = true
Secure = true
SameSite = Lax
Path = /

El nombre no deberá revelar detalles innecesarios.

Ejemplo:

kickoff_session
10.3 Expiración

Sesión normal sugerida:

8 a 24 horas

Sesión recordada opcional:

7 a 30 días

La decisión final deberá registrarse en decisiones arquitectónicas.

10.4 Rotación

Después de un login exitoso:

Crear una nueva sesión.
No reutilizar un identificador de sesión previo.
Evitar fijación de sesión.

Se podrá rotar la sesión después de:

Cambio de contraseña.
Promoción de rol.
Reautenticación.
Acción administrativa crítica.
10.5 Revocación

Las sesiones podrán revocarse cuando:

El usuario cierra sesión.
Cambia la contraseña.
La cuenta se bloquea.
La cuenta se desactiva.
Un administrador retira permisos.
Se detecta actividad sospechosa.
10.6 Almacenamiento

La base guardará:

Hash del token.
Usuario.
Creación.
Expiración.
Último uso.
Revocación.
IP opcional.
User agent opcional.

Nunca se guardará el token real.

11. Inicio de sesión
11.1 Error general

Ante credenciales incorrectas:

No fue posible iniciar sesión con los datos proporcionados.
11.2 Estados especiales

Después de comprobar correctamente la contraseña, el sistema podrá mostrar:

Correo pendiente.
Cuenta pendiente de aprobación.
Cuenta bloqueada.
Cuenta desactivada.

Esto evita revelar estados a quien no conoce la contraseña.

11.3 Rate limiting

Estrategia inicial sugerida:

5 intentos fallidos en 15 minutos por cuenta/IP

Después:

Espera progresiva.
Bloqueo temporal.
Registro de evento.

No bloquear permanentemente una cuenta solo por solicitudes externas.

11.4 Timing attacks

El flujo deberá reducir diferencias visibles entre:

Correo existente.
Correo inexistente.

Se podrá comparar contra un hash ficticio cuando el correo no exista.

12. Autorización
12.1 Roles
USER
ADMIN
SUPER_ADMIN
12.2 Verificación centralizada

Se deberán implementar funciones como:

requireAuthenticatedUser()
requireApprovedUser()
requireAdmin()
requireSuperAdmin()

No se copiará lógica diferente en cada endpoint.

12.3 Acceso horizontal

El sistema deberá impedir que un usuario acceda a recursos de otro usuario cambiando un UUID.

Ejemplos:

Sesiones.
Notificaciones.
Pronóstico privado.
Perfil.
Exportaciones.
12.4 Acceso vertical

El sistema deberá impedir que un usuario normal invoque endpoints administrativos directamente.

12.5 Administradores como participantes

Los administradores no tendrán permiso especial para:

Pronosticar tarde.
Ver pronósticos abiertos.
Cambiar sus puntos.
Editar pronósticos cerrados.
12.6 Reautenticación

Acciones críticas del superadministrador podrán requerir contraseña reciente:

Activar SQL de escritura.
Promover administrador.
Corregir resultado.
Restaurar respaldo.
Cerrar temporada.
Cambiar configuración crítica.

Periodo de reautenticación sugerido:

15 minutos
13. Pronósticos privados
13.1 Control en servidor

Antes del cierre, el servidor no deberá devolver pronósticos de terceros.

No se aceptará:

Devolverlos y ocultarlos con CSS.
Incluirlos en HTML invisible.
Enviarlos al cliente y filtrarlos con JavaScript.
Incluirlos en atributos o caché del navegador.
13.2 Caché

Las respuestas de pronósticos privados deberán usar políticas que eviten compartir caché entre usuarios.

Ejemplo conceptual:

Cache-Control: private, no-store
13.3 Hora de cierre

La hora se validará en el servidor inmediatamente antes de guardar.

No se confiará en:

Contador visual.
Hora del navegador.
Estado almacenado previamente.
Solicitud iniciada antes del cierre.
13.4 Condición de carrera

Una solicitud recibida cerca del cierre deberá ejecutarse con una validación atómica o suficientemente consistente.

El servicio debe comprobar:

now < predictionClosesAt

dentro del flujo de persistencia.

13.5 Auditoría de cambios

Los pronósticos normales no necesitan auditoría administrativa completa.

Se podrá conservar:

submittedAt.
updatedAt.
IP opcional.
Historial opcional solo si se considera necesario.

Las ediciones administrativas excepcionales sí deben auditarse.

14. Procesamiento de resultados
14.1 Transacción

La operación deberá ser completamente transaccional.

14.2 Concurrencia

Se deberá evitar que dos administradores procesen el mismo partido.

Controles posibles:

Estado intermedio PROCESSING.
Actualización condicional.
Bloqueo de fila.
Restricción de versión.
Idempotency key.
14.3 Idempotencia

Repetir la misma solicitud con la misma clave no deberá duplicar:

Puntuaciones.
Snapshots.
Auditorías.
Notificaciones.
14.4 Corrección de resultados

La corrección deberá requerir:

Superadministrador.
Reautenticación reciente.
Motivo obligatorio.
Confirmación textual.
Nueva versión.
Auditoría.
Recalculo.
14.5 Asignación manual prohibida

No deberán existir endpoints normales para modificar directamente:

Puntos.
Exactos.
Parciales.
Posición.
15. CSRF
15.1 Operaciones protegidas

Toda operación que modifique datos deberá estar protegida contra CSRF.

15.2 Controles

Se combinarán:

Cookies SameSite.
Verificación de Origin.
Verificación de Host.
Token CSRF cuando sea necesario.
Server Actions protegidas.
Métodos HTTP correctos.
15.3 GET sin efectos secundarios

Las solicitudes GET no deberán:

Aprobar usuarios.
Procesar partidos.
Cerrar sesiones.
Modificar configuración.
Recalcular.
Enviar correos.
16. XSS
16.1 Renderizado seguro

React escapa texto por defecto.

No se deberá usar:

dangerouslySetInnerHTML

salvo que:

Sea estrictamente necesario.
El contenido esté sanitizado.
Existan pruebas específicas.
16.2 Contenido configurable

Campos como “Cómo funciona” deberán almacenarse preferentemente como:

Texto estructurado.
Markdown limitado.
Bloques predefinidos.

Si se permite HTML, deberá sanitizarse con una lista permitida.

16.3 URLs

Los enlaces de patrocinadores deberán aceptar únicamente esquemas permitidos:

https
http, solo si existe una razón explícita

Bloquear:

javascript:
data:
vbscript:
16.4 Content Security Policy

Se deberá implementar una CSP adecuada.

Ejemplo inicial conceptual:

default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';

La política final deberá adaptarse a Next.js sin volverla innecesariamente permisiva.

17. Inyección SQL
17.1 Prisma

Las consultas normales utilizarán Prisma o parámetros seguros.

17.2 SQL directo

Toda consulta directa deberá:

Utilizar parámetros.
Evitar concatenación.
Estar revisada.
Tener pruebas.
Documentar su necesidad.

Nunca:

`SELECT * FROM User WHERE email = '${email}'`
17.3 Filtros y ordenamiento

Los nombres de columnas para ordenamiento deberán seleccionarse desde una lista permitida.

No deberán insertarse directamente desde parámetros del usuario.

17.4 Consola SQL

La consola SQL constituye una función de alto riesgo.

Deberá:

Estar deshabilitada por defecto.
Ser exclusiva del superadministrador.
Requerir reautenticación.
Tener límites de tiempo.
Tener límites de filas.
Registrar auditoría.
Bloquear múltiples instrucciones.
Bloquear comandos peligrosos.
Poder deshabilitarse completamente en producción.
18. Archivos e imágenes
18.1 Tipos permitidos

Para logos y patrocinadores:

image/png
image/jpeg
image/webp
image/svg+xml, solo si se sanitiza o controla

Se recomienda evitar SVG subido por usuarios debido a su capacidad de incluir contenido activo.

18.2 Tamaño

Límite inicial sugerido:

2 MB por imagen
18.3 Validación real

No confiar únicamente en:

Extensión.
Content-Type enviado por navegador.

Verificar firma o decodificación cuando sea viable.

18.4 Nombres

Los archivos deberán renombrarse con identificadores generados.

No usar directamente el nombre original.

18.5 Ubicación

Los archivos no deberán poder ejecutarse como código.

19. Variables de entorno
19.1 Secretos

Se almacenarán como variables de entorno:

DATABASE_URL.
DIRECT_DATABASE_URL.
SESSION_SECRET.
SMTP_USER.
SMTP_APP_PASSWORD.
INITIAL_SETUP_TOKEN.
Claves futuras.
19.2 Repositorio

No se subirán:

.env
.env.local
.env.production

Sí se subirá:

.env.example

sin valores reales.

19.3 Validación al iniciar

La aplicación deberá validar las variables requeridas durante el arranque.

Si falta un secreto crítico:

Fallar de forma clara.
No iniciar parcialmente.
No imprimir el valor.
19.4 Rotación

Deberá existir documentación para rotar:

Contraseña SMTP.
Secretos de sesión.
Credenciales de base.
Token de instalación.
20. Gmail SMTP
20.1 Contraseña de aplicación

Se utilizará una contraseña de aplicación, no la contraseña normal de Gmail.

20.2 Protección

La credencial:

Solo estará en variables de entorno.
No aparecerá en diagnóstico.
No se incluirá en exportaciones.
No se registrará en logs.
20.3 Errores de correo

Los errores deberán registrarse sin incluir:

Contraseña.
Token de confirmación completo.
Cuerpo sensible.
Información SMTP innecesaria.
20.4 Abuso

Aplicar rate limiting a:

Confirmación.
Reenvío.
Recuperación.
Pruebas SMTP.
21. Auditoría
21.1 Append-only

La aplicación no ofrecerá funciones para:

Editar auditorías.
Eliminar auditorías.
Cambiar actor.
Cambiar fecha.
21.2 Datos registrados
Actor.
Rol.
Acción.
Entidad.
Valores anteriores.
Valores posteriores.
Fecha.
Request ID.
IP opcional.
User agent opcional.
21.3 Datos prohibidos

No registrar:

Contraseñas.
Hashes.
Tokens.
Cookies.
Secretos.
Credenciales.
Cuerpo completo de recuperación.
Contenido completo de sesiones.
21.4 Integridad

Cuando sea viable:

La auditoría se guardará en la misma transacción.
La cuenta de aplicación no tendrá permisos de actualización o eliminación sobre la tabla.
Las exportaciones de auditoría tendrán checksum opcional.
21.5 Acceso

Los administradores podrán consultar auditoría funcional.

El superadministrador tendrá acceso completo.

Los datos técnicos sensibles podrán ocultarse a administradores normales.

22. Logging técnico
22.1 Logs estructurados

Formato recomendado:

{
  "level": "error",
  "timestamp": "2026-08-15T03:15:00.000Z",
  "requestId": "req_123",
  "errorCode": "MATCH_PROCESSING_FAILED",
  "route": "/api/v1/admin/matches/.../process-result"
}
22.2 Redacción

Antes de registrar objetos se deberán eliminar:

password
passwordHash
token
tokenHash
cookie
authorization
smtpAppPassword
databaseUrl
sessionSecret
22.3 Stack traces
Permitidos en desarrollo.
Restringidos en producción.
Nunca enviados al cliente.
No deberán contener secretos.
23. Cabeceras HTTP de seguridad

La aplicación deberá configurar, cuando sea compatible:

Content-Security-Policy
X-Content-Type-Options: nosniff
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
X-Frame-Options o frame-ancestors
Configuración conceptual
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()

HSTS solo se habilitará en producción con HTTPS correctamente configurado.

24. HTTPS

Producción deberá usar exclusivamente HTTPS.

No deberán enviarse por HTTP:

Cookies.
Contraseñas.
Tokens.
Datos personales.
Pronósticos.

El proveedor de hosting gratuito deberá proporcionar TLS.

25. CORS

Al tratarse de una aplicación del mismo origen:

CORS deberá ser restrictivo.
No se utilizará Access-Control-Allow-Origin: * para endpoints autenticados.
No se habilitarán orígenes externos sin necesidad.
26. Clickjacking

La aplicación no deberá poder cargarse dentro de iframes de terceros.

Usar:

frame-ancestors 'none'

o encabezado equivalente.

27. Rate limiting
27.1 Operaciones prioritarias

Aplicar límites a:

Login.
Registro.
Recuperación.
Reenvío de verificación.
Guardado automático.
SQL.
Exportaciones.
Recalculo.
Diagnóstico.
Prueba SMTP.
27.2 Almacenamiento del límite

Opciones gratuitas:

Base de datos PostgreSQL.
Memoria local para desarrollo.
Proveedor gratuito compatible.

La estrategia no deberá requerir obligatoriamente Redis de pago.

27.3 Respuesta
429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Has realizado demasiados intentos. Intenta nuevamente más tarde."
  }
}

No mostrar detalles que faciliten evasión.

28. Protección de endpoints administrativos
28.1 Verificación doble

Cada endpoint administrativo deberá validar:

Sesión válida.
Cuenta aprobada.
Cuenta activa.
Rol suficiente.
CSRF/origen.
Estado del recurso.
28.2 Rutas

No confiar en que /admin sea secreta.

28.3 Inactividad

Se podrá establecer expiración menor para sesiones administrativas.

28.4 Acciones críticas

Requerir reautenticación o confirmación reforzada para:

Promover administrador.
Retirar administrador.
Corregir resultado.
Cerrar temporada.
Restaurar respaldo.
SQL de escritura.
Eliminar físicamente datos.
Cambiar reglas activas.
29. Centro de diagnóstico
29.1 Desactivado por defecto

En producción:

ENABLE_DIAGNOSTICS=false
ENABLE_SQL_CONSOLE=false
ENABLE_TEST_DATA_TOOLS=false

Solo se activarán temporalmente cuando sea necesario.

29.2 Información permitida

Puede mostrar:

Estado general.
Latencia.
Cantidades.
Resultado de verificaciones.

No puede mostrar:

Connection strings.
Usuarios de base.
Contraseñas.
Host SMTP completo si no es necesario.
Variables de entorno.
Secretos.
29.3 Consultas pesadas

El diagnóstico deberá imponer:

Timeout.
Límite de filas.
Paginación.
Una ejecución concurrente limitada.
Cancelación cuando sea posible.
30. Exportaciones y respaldos
30.1 Autorización

Solo roles autorizados podrán exportar.

30.2 Contenido

Excluir:

Hashes.
Tokens.
Sesiones.
Credenciales.
Variables de entorno.
Intentos de login si no son necesarios.
30.3 Descarga

Las descargas deberán:

Requerir sesión.
Expirar.
Ser de un solo uso cuando sea viable.
Validar permisos.
Usar nombres no predecibles.
30.4 Almacenamiento

Los archivos temporales deberán borrarse después de un periodo corto.

30.5 CSV injection

Al exportar CSV, proteger valores que comiencen por:

=
+
-
@

Se deberán escapar o prefijar para evitar ejecución de fórmulas en hojas de cálculo.

31. Importaciones
31.1 Previsualización

No guardar directamente un archivo importado.

Primero:

Analizar.
Validar.
Mostrar errores.
Solicitar confirmación.
Ejecutar en transacción.
31.2 Límites

Aplicar límites de:

Tamaño.
Filas.
Tipo.
Tiempo.
31.3 Datos maliciosos

Tratar todo archivo como no confiable.

No ejecutar:

Macros.
Fórmulas.
Scripts.
Contenido embebido.
32. Soft delete
32.1 Consultas

Las consultas normales deberán excluir registros con:

deletedAt != null

cuando corresponda.

32.2 Acceso directo

No confiar únicamente en filtros de UI.

Los repositorios deberán incluir el criterio por defecto.

32.3 Restauración

Una restauración deberá validar:

Conflictos de email.
Conflictos de nickname.
Estado histórico.
Permisos.
33. Dependencias
33.1 Selección

Toda dependencia deberá evaluarse por:

Mantenimiento.
Licencia.
Vulnerabilidades.
Popularidad razonable.
Necesidad real.
Compatibilidad.
33.2 Versiones

Se utilizará lockfile.

No se permitirán rangos excesivamente abiertos para dependencias críticas.

33.3 Auditoría

Ejecutar regularmente:

npm audit

También se podrán usar alertas gratuitas de GitHub.

33.4 Actualizaciones

Las actualizaciones críticas deberán probarse antes de producción.

No aplicar actualizaciones automáticas directamente en producción sin validación.

34. Seguridad de la base de datos
34.1 Usuario de aplicación

Utilizar un usuario específico para la aplicación.

No usar el superusuario de PostgreSQL.

34.2 Permisos

El usuario de aplicación deberá tener únicamente permisos necesarios sobre su esquema.

34.3 Conexión
TLS cuando el proveedor lo soporte.
Credenciales en variables de entorno.
Pooling compatible con serverless.
Límites de conexión.
34.4 Auditoría protegida

Cuando sea viable, separar permisos para impedir actualización o eliminación de AuditLog.

34.5 Migraciones

Las migraciones podrán usar credenciales con permisos ampliados, separadas de las credenciales normales de ejecución.

35. Configuración segura
35.1 Separación

Distinguir:

Configuración pública.
Configuración editable.
Secretos.
Flags de entorno.
35.2 Secretos no editables

La interfaz administrativa no permitirá editar:

DATABASE_URL.
SESSION_SECRET.
SMTP_APP_PASSWORD.
INITIAL_SETUP_TOKEN.
35.3 Modo producción

En producción:

Debug desactivado
Stack traces ocultos
Cookies Secure
Herramientas de prueba desactivadas
SQL desactivado
HTTPS obligatorio
36. Setup inicial
36.1 Token de instalación

La creación del primer superadministrador requerirá un token de instalación.

36.2 Condiciones

El setup solo podrá completarse cuando:

No exista superadministrador.
No exista marcador de setup completado.
El token sea válido.
36.3 Después del setup
Invalidar el token.
Marcar setup completado.
Registrar auditoría de sistema.
Recomendar eliminar o rotar la variable.
36.4 Carrera de inicialización

Dos solicitudes simultáneas no podrán crear dos superadministradores.

La operación deberá usar:

Transacción.
Restricción única.
Bloqueo adecuado.
37. Modo mantenimiento
37.1 Autorización

Solo superadministrador.

37.2 Excepciones

Durante mantenimiento:

Usuarios normales bloqueados.
Endpoints administrativos restringidos.
Health check disponible.
Login administrativo podrá mantenerse si se define.
37.3 Bypass

No usar bypass mediante query parameter público.

Cualquier bypass deberá depender de sesión y rol.

38. Privacidad
38.1 Minimización

Solo se solicitarán datos necesarios:

Nombre.
Apellido.
Nickname.
Correo.
Equipo favorito.
38.2 Exposición pública

Los usuarios normales no deberán ver:

Correo de otros usuarios.
Nombre completo de otros usuarios si no es necesario.
IP.
User agent.
Motivos administrativos internos.

La clasificación mostrará principalmente nickname.

38.3 Administradores

Los administradores podrán ver nombre y correo para gestionar solicitudes.

38.4 Retención

Los datos históricos se conservarán por integridad de la competencia.

Las solicitudes de eliminación deberán resolverse mediante anonimización o desactivación si existen datos históricos relevantes.

39. Errores seguros
39.1 Producción

Los errores mostrarán:

Código funcional.
Mensaje comprensible.
Request ID.

No mostrarán:

Stack.
SQL.
Ruta interna.
Nombre de tabla.
Secretos.
Variables.
39.2 Ejemplo
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "No fue posible completar la operación."
  },
  "requestId": "req_123"
}
40. Request ID

Cada solicitud deberá recibir un identificador.

Uso:

Logs.
Auditoría.
Diagnóstico.
Soporte.
Correlación de errores.

No deberá contener información personal.

41. Controles de frontend

Aunque no sustituyen al backend, el frontend deberá:

Deshabilitar botones mientras se procesa.
Evitar envíos dobles.
Mostrar expiración de sesión.
No almacenar secretos.
Limpiar datos sensibles de memoria cuando sea razonable.
Utilizar autocomplete apropiado.

Ejemplos:

autocomplete="email"
autocomplete="current-password"
autocomplete="new-password"
42. Service workers y caché

No se deberá cachear de forma pública:

Perfil.
Pronósticos.
Dashboard.
Auditoría.
Diagnóstico.
Resultados privados.
Datos administrativos.

Si se implementa PWA en el futuro, deberá revisarse cuidadosamente la estrategia de caché.

43. Seguridad de Webhooks

Kickoff no requiere webhooks inicialmente.

Si se agregan en el futuro deberán:

Validar firma.
Evitar replay.
Usar timestamp.
Ser idempotentes.
Registrar eventos.
44. Monitoreo

Sin servicios de pago, el monitoreo inicial podrá incluir:

Logs estructurados del hosting.
Health check.
Tabla opcional de errores.
Notificación interna al superadministrador.
Verificación manual desde diagnóstico.

No deberá enviarse información sensible a herramientas externas sin revisión.

45. Respuesta a incidentes
45.1 Credencial SMTP expuesta
Revocar contraseña de aplicación.
Crear una nueva.
Actualizar variable de entorno.
Revisar logs.
Verificar correos enviados.
Documentar incidente.
45.2 Secret de sesión expuesto
Rotar secret.
Revocar todas las sesiones.
Obligar nuevo login.
Revisar actividad administrativa.
Documentar incidente.
45.3 Credencial de base expuesta
Rotar credencial.
Revisar conexiones y logs.
Verificar integridad.
Crear respaldo.
Revisar auditoría.
Limitar permisos.
45.4 Cuenta administrativa comprometida
Bloquear o revocar sesiones.
Cambiar contraseña.
Revisar auditoría.
Recalcular si hubo cambios.
Restaurar datos si corresponde.
Rotar secretos si fueron visibles.
46. Backups

Los respaldos deberán:

Excluir secretos.
Estar protegidos.
Tener nombre no predecible.
Tener fecha.
Verificarse periódicamente.
No permanecer públicamente accesibles.

Se deberá probar la restauración antes de confiar en el proceso.

47. Checklist de seguridad previa a producción
Autenticación
 Contraseñas con Argon2id o bcrypt.
 Tokens con entropía suficiente.
 Tokens almacenados como hash.
 Cookies HttpOnly.
 Cookies Secure.
 Sesiones revocables.
 Rate limiting activo.
 Recuperación genérica.
Autorización
 Todos los endpoints validan roles.
 No existe IDOR.
 Administradores no ven pronósticos abiertos.
 Superadministrador protegido.
 Reautenticación para acciones críticas.
Aplicación
 Protección CSRF.
 CSP configurada.
 XSS revisado.
 SQL parametrizado.
 CORS restrictivo.
 Cabeceras de seguridad.
 HTTPS.
Datos
 Secretos fuera del repositorio.
 Exportaciones sin hashes.
 Logs redactados.
 Auditoría append-only.
 Backups protegidos.
 Soft delete aplicado.
Producción
 Diagnóstico restringido.
 SQL desactivado.
 Datos de prueba desactivados.
 Debug desactivado.
 Setup inicial cerrado.
 Variables validadas.
48. Pruebas de seguridad obligatorias
Login con contraseña incorrecta.
Fuerza bruta y rate limiting.
Recuperación con correo inexistente.
Reutilización de token.
Token expirado.
Sesión revocada.
Cookie manipulada.
Usuario normal accediendo a admin.
Admin accediendo a función de superadmin.
Acceso al pronóstico de otro usuario antes del cierre.
Pronóstico enviado exactamente en el cierre.
CSRF sobre procesamiento.
XSS en nickname.
XSS en patrocinador.
SQL injection en filtros.
UUID de otro usuario.
Descarga de exportación ajena.
Dos procesamientos simultáneos.
Dos setups simultáneos.
Herramientas de prueba en producción.
SQL console deshabilitada.
Auditoría sin secretos.
Logs sin password.
CSV injection.
Archivo con extensión falsa.
49. Requisitos no negociables

No se podrá liberar Kickoff si:

Las contraseñas se almacenan inseguramente.
Los pronósticos ajenos llegan al cliente antes del cierre.
Un usuario puede invocar endpoints administrativos.
El cierre depende del reloj del cliente.
Los tokens se guardan en texto plano.
Los secretos aparecen en logs.
El procesamiento no es transaccional.
La consola SQL está abierta públicamente.
El setup permite crear múltiples superadministradores.
Las cookies de producción no son seguras.
No existe rate limiting en autenticación.
Las auditorías pueden editarse desde la aplicación.
50. Decisiones pendientes

Antes de implementar deberán confirmarse:

Argon2id o bcrypt.
Duración de sesión.
Duración de sesión recordada.
Duración de token de confirmación.
Duración de token de recuperación.
Implementación gratuita de rate limiting.
CSP final compatible con Next.js.
Política de reautenticación.
Estrategia de almacenamiento de imágenes.
Nivel de acceso de administradores a auditoría técnica.
Política de anonimización de usuarios.

Estas decisiones deberán registrarse en:

docs/14-DecisionesArquitectonicas.md
51. Criterios de aceptación

La seguridad se considerará aceptable cuando:

Las contraseñas estén protegidas.
Las sesiones puedan revocarse.
Los tokens sean de un solo uso.
Los permisos se validen en servidor.
Los pronósticos permanezcan privados hasta el cierre.
Los endpoints críticos sean transaccionales.
Exista protección contra CSRF, XSS e inyección.
Los intentos abusivos estén limitados.
Los secretos permanezcan fuera del código.
Los logs estén redactados.
Las herramientas avanzadas estén cerradas.
Las auditorías no puedan alterarse.
Existan pruebas de seguridad automatizadas.
52. Documentos relacionados

Consultar:

docs/00-Project-Context.md
docs/01-PRD.md
docs/02-Arquitectura.md
docs/03-ModeloBaseDatos.md
docs/04-ReglasNegocio.md
docs/06-API.md
docs/08-Testing.md
docs/09-Deployment.md
docs/12-CentroDiagnostico.md
docs/14-DecisionesArquitectonicas.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
53. Conclusión

La seguridad de Kickoff deberá proteger tanto la aplicación como la justicia de la competencia.

El control más importante no es únicamente impedir el robo de cuentas, sino garantizar que:

Nadie vea pronósticos antes de tiempo.
Nadie pronostique después del cierre.
Nadie modifique puntos manualmente.
Nadie procese resultados sin permiso.
Toda acción administrativa relevante pueda rastrearse.

La simplicidad y la gratuidad del proyecto no justifican omitir controles esenciales.