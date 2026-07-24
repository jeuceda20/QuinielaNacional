# Authentication Phase Prompt

## Quiniela Nacional La Goleada

**Versión del prompt:** 1.0  
**Nombre interno del proyecto:** Kickoff  
**Fase:** Autenticación, correo y acceso público  
**Tareas principales:** TASK-029 a TASK-045  
**Tipo:** Prompt maestro de fase  
**Aplicación:** Ejecutar una sola tarea de esta fase por vez

---

# 1. Propósito

Este prompt define el contexto específico para implementar la autenticación de **Quiniela Nacional La Goleada – Kickoff**.

Esta fase incluye:

- Hashing de contraseñas.
- Sesiones.
- Registro.
- Confirmación de correo.
- Reenvío de confirmación.
- Login.
- Logout.
- Recuperación de contraseña.
- Setup inicial.
- Proveedor de correo.
- Gmail SMTP.
- Proveedor falso de correo.
- Layout público.
- Pantallas de registro y login.
- Pantallas de confirmación.
- Pantallas de recuperación.

Esta fase no incluye todavía:

- Aprobación administrativa completa.
- Gestión de usuarios.
- Gestión de temporadas.
- Gestión de jornadas.
- Gestión de partidos.
- Pronósticos.
- Procesamiento de resultados.
- Clasificación.
- Dashboard autenticado completo.

---

# 2. Uso obligatorio

Este prompt debe combinarse con:

```text
prompts/00-global-context.md
prompts/09-task-template.md
docs/19-IMPLEMENTATION_PLAN.md
```

Formato recomendado:

```text
Lee y aplica:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md

Implementa únicamente TASK-XXX de
docs/19-IMPLEMENTATION_PLAN.md.
```

No solicitar:

```text
Implementa toda la autenticación.
```

La regla es:

```text
Una ejecución = una tarea
```

---

# 3. Tareas cubiertas

Este prompt aplica a:

```text
TASK-029 — Implementar hashing de contraseña
TASK-030 — Implementar sesiones
TASK-031 — Implementar registro
TASK-032 — Implementar confirmación de correo
TASK-033 — Implementar reenvío de confirmación
TASK-034 — Implementar login
TASK-035 — Implementar logout
TASK-036 — Implementar recuperación de contraseña
TASK-037 — Implementar setup inicial
TASK-038 — Crear interfaz de proveedor de correo
TASK-039 — Implementar Gmail SMTP
TASK-040 — Crear proveedor falso de correo
TASK-041 — Crear layout público
TASK-042 — Crear pantalla de registro
TASK-043 — Crear pantalla de login
TASK-044 — Crear pantallas de confirmación y aprobación pendiente
TASK-045 — Crear recuperación de contraseña
```

---

# 4. Objetivo de la fase

Al finalizar esta fase debe existir un flujo seguro de acceso:

```text
Registro
↓
Confirmación de correo
↓
Pendiente de aprobación
↓
Aprobación futura por administrador
↓
Login
↓
Sesión segura
```

También debe existir:

```text
Recuperación de contraseña
+
Setup inicial del primer superadministrador
+
Infraestructura SMTP
+
UI pública accesible y responsive
```

La fase no debe permitir todavía que un usuario no aprobado acceda a funciones privadas.

---

# 5. Documentos obligatorios

Antes de ejecutar tareas de esta fase, revisar según corresponda:

```text
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
docs/14-DecisionesArquitectonicas.md
docs/15-Riesgos.md
docs/16-Glosario.md
docs/17-CODEX_INSTRUCTIONS.md
docs/18-DEVELOPER_RULES.md
docs/19-IMPLEMENTATION_PLAN.md
```

---

# 6. Principios de autenticación

## 6.1 Autenticación propia

La autenticación es self-managed.

No introducir:

- Auth.js.
- NextAuth.
- Clerk.
- Auth0.
- Supabase Auth.
- Firebase Auth.
- Cognito.
- OAuth social.
- Magic links como reemplazo del password.

El proyecto utiliza:

```text
Email
+
Password
+
Sesión opaca almacenada en cookie HttpOnly
```

---

## 6.2 Backend autoritativo

Todas las decisiones se validan en servidor:

- Registro.
- Confirmación.
- Login.
- Estado de usuario.
- Sesión.
- Logout.
- Recuperación.
- Setup.
- Rate limiting.

La UI puede mejorar la experiencia, pero nunca representa el control definitivo.

---

## 6.3 Respuestas seguras

Evitar revelar:

- Si un correo existe.
- Si una cuenta está registrada.
- Si un token pertenecía a alguien.
- Si una contraseña anterior era correcta durante recuperación.
- Detalles internos de estado cuando puedan facilitar enumeración.

Los flujos públicos deben usar mensajes genéricos cuando corresponda.

---

# 7. Estados del usuario

La implementación debe respetar los estados definidos en el modelo y la documentación.

Estados conceptuales esperados:

```text
PENDING_EMAIL_VERIFICATION
PENDING_APPROVAL
ACTIVE
REJECTED
BLOCKED
DISABLED
```

Los nombres exactos deben coincidir con el esquema existente.

No crear estados duplicados si Prisma ya define el enum.

---

## 7.1 Acceso por estado

### PENDING_EMAIL_VERIFICATION

Puede:

- Solicitar reenvío de confirmación.
- Confirmar correo.

No puede:

- Iniciar sesión funcional.
- Acceder al área privada.

### PENDING_APPROVAL

Puede:

- Ver mensaje de aprobación pendiente cuando el flujo lo permita.
- Recibir correo de aprobación futura.

No puede:

- Acceder a la aplicación privada.

### ACTIVE

Puede:

- Iniciar sesión.
- Mantener sesión.
- Recuperar contraseña.
- Acceder según rol.

### REJECTED

No puede:

- Iniciar sesión.
- Reutilizar el mismo flujo sin decisión administrativa documentada.

### BLOCKED

No puede:

- Iniciar sesión.
- Mantener sesiones activas si el bloqueo exige revocación.

### DISABLED

No puede:

- Iniciar sesión.
- Utilizar sesiones existentes.

---

# 8. Reglas para TASK-029 — Hashing de contraseña

Implementar una abstracción como:

```typescript
interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, passwordHash: string): Promise<boolean>;
}
```

La implementación preferida es:

```text
Argon2id
```

Si el entorno de despliegue impide Argon2id, cualquier alternativa requiere:

- Justificación técnica.
- Compatibilidad con la seguridad documentada.
- Actualización de ADR si cambia la decisión.
- Aprobación explícita.

---

## 8.1 Parámetros

Los parámetros del algoritmo deben:

- Ser seguros.
- Ser configurables de forma controlada si es necesario.
- No degradarse automáticamente en producción.
- Ser razonables para el plan gratuito.

No reducir seguridad solamente para acelerar pruebas.

Para tests puede utilizarse una configuración específica, sin cambiar producción.

---

## 8.2 Passwords

Nunca:

- Guardar password en texto plano.
- Registrar password.
- Devolver password.
- Incluirlo en auditoría.
- Comparar hashes manualmente.
- Utilizar hash general como SHA-256 directo.

---

## 8.3 Verificación

La verificación debe devolver:

```text
true o false
```

No debe lanzar errores por una contraseña incorrecta normal.

Los errores de infraestructura sí deben mapearse de forma segura.

---

## 8.4 Rehash

Si la librería permite detectar parámetros antiguos, puede prepararse una estrategia de rehash al login.

No es obligatorio adelantarla si no forma parte de la tarea.

---

## 8.5 Pruebas mínimas

- Hash diferente al password.
- Dos hashes del mismo password pueden ser distintos.
- Password correcta verifica.
- Password incorrecta no verifica.
- Password vacía es rechazada por validación previa.
- El hash no aparece en logs.

---

# 9. Reglas de contraseña

La política exacta debe coincidir con `docs/07-Seguridad.md`.

Como mínimo, la implementación debe:

- Validar longitud mínima.
- Permitir frases de contraseña.
- Evitar límites máximos irrazonablemente bajos.
- Rechazar entradas vacías.
- Confirmar que password y confirmación coinciden.
- No eliminar espacios internos válidos.
- No normalizar silenciosamente el contenido del password.

No exigir reglas arbitrarias no documentadas como:

- Un símbolo obligatorio.
- Una mayúscula obligatoria.
- Cambio periódico obligatorio.

salvo que la documentación lo establezca.

---

# 10. Reglas para TASK-030 — Sesiones

Las sesiones son opacas.

Flujo conceptual:

```text
Generar token aleatorio
↓
Guardar hash del token en base
↓
Enviar token plano solo en cookie
↓
Validar cookie en solicitudes posteriores
```

No guardar el token plano en la base.

---

## 10.1 Token de sesión

Debe ser:

- Criptográficamente aleatorio.
- De longitud suficiente.
- No predecible.
- Independiente del ID del usuario.
- Independiente del Request ID.

No utilizar:

- UUID secuencial como único secreto.
- JWT si no está autorizado por ADR.
- Email codificado.
- User ID firmado de forma casera.

---

## 10.2 Cookie

La cookie debe utilizar:

```text
HttpOnly
Secure en producción
SameSite=Lax o más restrictivo
Path=/
```

Debe definir expiración coherente con la sesión.

No almacenar la sesión en:

```text
localStorage
sessionStorage
IndexedDB
```

---

## 10.3 Duración

La duración de la sesión debe provenir de configuración o constante central.

No dispersar valores de expiración por el código.

Debe existir una política clara para:

- Expiración absoluta.
- Renovación, si se implementa.
- Revocación.
- Limpieza de sesiones vencidas.

No implementar renovación infinita silenciosa.

---

## 10.4 Validación

Al validar una sesión:

1. Leer cookie.
2. Validar formato.
3. Calcular hash.
4. Buscar sesión activa.
5. Verificar expiración.
6. Verificar usuario.
7. Verificar estado de cuenta.
8. Rechazar sesiones revocadas.
9. Actualizar actividad solo si está documentado.

No confiar en datos de usuario almacenados únicamente en la cookie.

---

## 10.5 Revocación

Debe poder:

- Revocar sesión actual.
- Revocar todas las sesiones.
- Revocar otras sesiones.
- Revocar sesiones al cambiar password.
- Revocar sesiones cuando el usuario se bloquea o desactiva, según el flujo correspondiente.

---

## 10.6 DTO de sesión

No devolver:

- Token hash.
- Cookie.
- Token.
- Datos internos del proveedor.

Un DTO de sesión puede incluir:

```text
ID
Creación
Expiración
Dispositivo resumido
Sesión actual
```

---

## 10.7 Pruebas mínimas

- Crear sesión.
- Cookie segura.
- Token almacenado como hash.
- Sesión válida.
- Sesión expirada.
- Sesión revocada.
- Usuario bloqueado.
- Logout.
- Revocación múltiple.
- Token inválido.

---

# 11. Protección CSRF y origen

Las operaciones mutables deben seguir la estrategia definida en seguridad.

Para Server Actions y Route Handlers, validar según corresponda:

- Origen.
- Método.
- Cookie SameSite.
- Token CSRF si el diseño lo requiere.
- Encabezados confiables.

No asumir que usar Server Actions elimina toda necesidad de revisar origen.

Las protecciones completas podrán endurecerse en TASK-101, pero esta fase no debe crear endpoints claramente vulnerables.

---

# 12. Reglas para TASK-031 — Registro

El registro es público.

Campos oficiales:

```text
Nombre
Apellido
Nickname
Correo
Password
Confirmación de password
Equipo favorito
Aceptación de reglas
```

---

## 12.1 Flujo

```text
Validar entrada
↓
Normalizar correo y nickname
↓
Verificar formato y restricciones
↓
Verificar duplicados para mensaje amigable
↓
Hash de password
↓
Crear usuario pendiente de confirmación
↓
Crear token de confirmación
↓
Enviar correo
↓
Responder de forma segura
```

La base debe conservar restricciones únicas aunque exista verificación previa.

---

## 12.2 Email

El correo:

- Se normaliza.
- Se guarda en forma estable.
- Es único.
- No puede cambiarse después.
- No debe exponerse públicamente.

Normalización mínima:

```text
trim
lowercase
```

No aplicar transformaciones específicas de proveedores como eliminar puntos de Gmail salvo decisión explícita.

---

## 12.3 Nickname

El nickname:

- Es público.
- Es único de forma normalizada.
- Debe conservar versión visible.
- Debe tener reglas de longitud y caracteres.
- No debe contener contenido prohibido según validación definida.

No usar el nickname como credencial de login salvo que se documente.

---

## 12.4 Nombre y apellido

Son datos privados de perfil.

No deben mostrarse en la clasificación pública.

La clasificación utiliza nickname.

---

## 12.5 Equipo favorito

Debe referenciar un Team válido y activo.

No aceptar:

- ID inexistente.
- Equipo eliminado.
- Equipo inactivo si no está permitido.

El logo del equipo favorito se utilizará como representación visual del usuario.

No crear avatar personal.

---

## 12.6 Aceptación de reglas

Debe registrarse:

- Que fueron aceptadas.
- Fecha.
- Versión de reglas o términos cuando el modelo lo contemple.

No confiar únicamente en checkbox del navegador.

---

## 12.7 Transacción

La creación de:

- Usuario.
- Token de confirmación.
- Datos relacionados indispensables.

debe ser consistente.

El envío de correo no debe dejar el sistema en un estado corrupto.

Puede utilizarse una estrategia segura como:

```text
Commit de usuario y token
↓
Intento de envío
↓
Permitir reenvío si SMTP falla
```

No mantener una transacción de base abierta durante una llamada SMTP lenta.

---

## 12.8 Respuesta

Evitar filtrar demasiado detalle.

Para un registro nuevo puede confirmarse:

```text
Revisa tu correo para continuar.
```

Para duplicados, seguir exactamente la política documentada de enumeración y experiencia de usuario.

No improvisar mensajes que revelen cuentas sensibles.

---

## 12.9 Auditoría

El registro público puede generar:

- Evento operacional.
- Log seguro.
- Auditoría específica si el modelo lo define.

No registrar el password ni el token.

---

## 12.10 Pruebas mínimas

- Registro válido.
- Email normalizado.
- Nickname normalizado.
- Email duplicado.
- Nickname duplicado.
- Equipo inválido.
- Password inválida.
- Confirmación diferente.
- Reglas no aceptadas.
- Usuario queda pendiente de confirmación.
- Token creado como hash.
- Password guardada como hash.
- Sin password en respuesta.
- Error concurrente de unicidad.

---

# 13. Tokens de confirmación y recuperación

Ambos flujos deben usar tokens:

- Aleatorios.
- De un solo uso.
- Con expiración.
- Almacenados como hash.
- Invalidados al usarse.

No reutilizar el token de sesión.

No reutilizar un único tipo de token sin distinguir propósito.

---

## 13.1 Generación

Utilizar criptografía segura de Node.js.

Ejemplo conceptual:

```typescript
crypto.randomBytes(...)
```

No utilizar:

```typescript
Math.random()
```

---

## 13.2 URL

Las URLs deben construirse desde:

```text
APP_URL
```

No usar hosts recibidos arbitrariamente de la solicitud sin validación.

No incluir datos personales innecesarios en query parameters.

---

## 13.3 Comparación

Comparar mediante hash del token recibido.

No buscar tokens planos.

---

# 14. Reglas para TASK-032 — Confirmación de correo

Flujo:

```text
Recibir token
↓
Validar formato
↓
Calcular hash
↓
Buscar token vigente
↓
Verificar expiración
↓
Verificar que no fue usado
↓
Confirmar correo
↓
Cambiar estado a pendiente de aprobación
↓
Consumir token
↓
Commit
```

La operación debe ser transaccional.

---

## 14.1 Idempotencia segura

Si el correo ya fue confirmado, el flujo puede mostrar un resultado seguro y comprensible.

No debe:

- Confirmar dos veces.
- Reactivar usuarios rechazados.
- Cambiar usuarios activos a estados anteriores.

---

## 14.2 Token inválido

Usar un mensaje seguro:

```text
El enlace no es válido o ha expirado.
```

No indicar:

- Si existía.
- A qué usuario pertenecía.
- Si fue utilizado previamente.

---

## 14.3 Estado final

Después de confirmar:

```text
PENDING_APPROVAL
```

El usuario todavía no puede entrar al área privada.

---

## 14.4 Pruebas mínimas

- Token válido.
- Token inválido.
- Token expirado.
- Token consumido.
- Correo ya confirmado.
- Cambio a pendiente de aprobación.
- Transacción.
- Concurrencia de dos confirmaciones.

---

# 15. Reglas para TASK-033 — Reenvío de confirmación

El endpoint o acción debe aceptar un correo.

La respuesta pública debe ser genérica.

Ejemplo:

```text
Si la cuenta existe y necesita confirmación, enviaremos un nuevo enlace.
```

---

## 15.1 Condiciones

Solo generar nuevo token cuando:

- El usuario existe.
- El correo no está confirmado.
- El estado permite confirmación.

No enviar confirmación a:

- Usuario ya activo.
- Usuario rechazado.
- Usuario bloqueado, salvo regla explícita.
- Usuario desactivado.

---

## 15.2 Invalidación

Al crear un nuevo token:

- Invalidar tokens anteriores activos.
- Crear uno nuevo.
- Mantener trazabilidad segura.

---

## 15.3 Rate limiting

Debe existir protección por:

- IP.
- Identificador normalizado cuando sea seguro.
- Ventana temporal.

No revelar cuándo se alcanzó un límite de una cuenta específica si facilita enumeración.

---

## 15.4 Pruebas mínimas

- Usuario pendiente.
- Usuario inexistente.
- Usuario ya confirmado.
- Token anterior invalidado.
- Rate limit.
- Respuesta genérica equivalente.

---

# 16. Reglas para TASK-034 — Login

El login utiliza:

```text
Email
Password
```

No utilizar nickname como credencial salvo cambio documentado.

---

## 16.1 Flujo

```text
Validar entrada
↓
Normalizar email
↓
Buscar usuario
↓
Verificar password de forma segura
↓
Verificar estado
↓
Crear sesión
↓
Configurar cookie
↓
Registrar evento seguro
```

---

## 16.2 Enumeración

Para email inexistente y password incorrecta utilizar un mensaje equivalente:

```text
Correo o contraseña incorrectos.
```

No decir:

```text
El correo no existe.
```

---

## 16.3 Timing

Cuando el usuario no exista, utilizar una estrategia que reduzca diferencias obvias de tiempo, por ejemplo:

- Comparar contra un hash ficticio válido.
- Utilizar una abstracción de verificación consistente.

No inventar criptografía propia.

---

## 16.4 Estados especiales

### Pendiente de confirmación

No iniciar sesión.

Puede mostrar:

```text
Debes confirmar tu correo.
```

solo después de credenciales válidas, evitando enumeración previa.

### Pendiente de aprobación

No crear una sesión privada normal.

Puede redirigir a una pantalla segura de aprobación pendiente si el diseño lo permite.

### Bloqueado o deshabilitado

No iniciar sesión.

Usar mensaje seguro.

### Activo

Crear sesión.

---

## 16.5 Rate limiting

Aplicar límites por:

- IP.
- Cuenta normalizada cuando corresponda.
- Ventana temporal.

Registrar intentos fallidos sin password.

No bloquear permanentemente una cuenta solo por ataques externos sin una política documentada.

---

## 16.6 Cookie

Configurar la cookie únicamente después de una autenticación válida.

No incluir datos del usuario dentro de la cookie aparte del token opaco.

---

## 16.7 Redirección

Validar cualquier `returnTo`.

No permitir open redirect.

Aceptar únicamente rutas internas seguras.

Ejemplo:

```text
/dashboard
```

No aceptar:

```text
https://sitio-malicioso.example
```

---

## 16.8 Pruebas mínimas

- Login válido.
- Email normalizado.
- Password incorrecta.
- Usuario inexistente.
- Mensaje equivalente.
- Pendiente de confirmación.
- Pendiente de aprobación.
- Bloqueado.
- Deshabilitado.
- Sesión creada.
- Cookie configurada.
- Rate limit.
- `returnTo` interno.
- Open redirect rechazado.

---

# 17. Reglas para TASK-035 — Logout

Logout debe:

1. Identificar sesión actual.
2. Revocarla en servidor.
3. Eliminar cookie.
4. Responder de forma idempotente.

Aunque la cookie no exista, logout no debe fallar de forma peligrosa.

No limitarse a borrar la cookie sin revocar la sesión almacenada.

---

## 17.1 Pruebas mínimas

- Sesión válida revocada.
- Cookie eliminada.
- Logout sin sesión.
- Segundo logout.
- Token revocado no vuelve a funcionar.

---

# 18. Reglas para TASK-036 — Recuperación de contraseña

La recuperación consta de dos partes:

```text
Solicitud
+
Restablecimiento
```

---

## 18.1 Solicitud

Entrada:

```text
Email
```

Respuesta pública genérica:

```text
Si la cuenta existe, enviaremos instrucciones.
```

No revelar existencia.

---

## 18.2 Condiciones

Puede crearse token cuando:

- El usuario existe.
- El estado permite recuperación.
- El correo está confirmado, según reglas.
- No excede rate limit.

No enviar a cuentas rechazadas o desactivadas si la política lo impide.

---

## 18.3 Restablecimiento

Flujo:

```text
Validar token
↓
Validar nueva password
↓
Verificar expiración y uso
↓
Hash nueva password
↓
Actualizar usuario
↓
Consumir token
↓
Revocar sesiones
↓
Commit
```

Debe ser transaccional.

No solicitar la password anterior.

---

## 18.4 Reutilización de password

No implementar historial de passwords salvo requisito documentado.

No impedir reutilización basándose en datos que no existen.

---

## 18.5 Revocación

Después de cambiar password:

```text
Revocar todas las sesiones activas
```

Puede crearse una sesión nueva solo si la documentación lo define.

Por defecto, redirigir al login.

---

## 18.6 Tokens anteriores

Al crear un nuevo token de recuperación:

- Invalidar anteriores vigentes.
- Mantener un solo flujo activo cuando sea razonable.

---

## 18.7 Pruebas mínimas

Solicitud:

- Usuario existente.
- Usuario inexistente.
- Respuesta equivalente.
- Rate limiting.
- Token hash.
- Expiración.

Restablecimiento:

- Token válido.
- Token inválido.
- Token expirado.
- Token consumido.
- Password inválida.
- Password actualizada.
- Sesiones revocadas.
- Token de un uso.
- Concurrencia.

---

# 19. Reglas para TASK-037 — Setup inicial

El setup inicial crea el primer:

```text
SUPER_ADMIN
```

Este flujo es crítico.

---

## 19.1 Condiciones de disponibilidad

El setup solo está disponible cuando:

- No existe ningún usuario.
- No existe ningún superadministrador.
- El setup no ha sido cerrado.
- Se presenta `INITIAL_SETUP_TOKEN` válido.
- La aplicación está en un estado compatible.

No basta con ocultar la ruta.

---

## 19.2 Token inicial

`INITIAL_SETUP_TOKEN`:

- Proviene de variable de entorno.
- Nunca se almacena en frontend.
- Nunca se registra.
- Nunca aparece en respuesta.
- Debe compararse de forma segura.

No colocarlo en query string si puede evitarse.

Preferir:

- Header seguro.
- Formulario POST.
- Campo tratado como secreto.

---

## 19.3 Datos del primer usuario

El primer superadministrador debe proporcionar:

- Nombre.
- Apellido.
- Nickname.
- Email.
- Password.
- Equipo favorito cuando sea obligatorio.

Puede quedar:

- Con correo confirmado.
- Aprobado.
- Activo.
- Rol SUPER_ADMIN.

Esto debe estar explícitamente documentado y auditado.

---

## 19.4 Concurrencia

Dos solicitudes simultáneas no pueden crear dos superadministradores.

Usar:

- Transacción.
- Restricción.
- Lock.
- Verificación dentro de transacción.

No depender de una consulta previa fuera de transacción.

---

## 19.5 Cierre

Después de un setup exitoso:

```text
El setup queda cerrado permanentemente.
```

Las solicitudes posteriores deben devolver:

```text
SETUP_ALREADY_COMPLETED
```

sin revelar detalles innecesarios.

---

## 19.6 Seed

No crear el superadministrador mediante seed.

El setup es el único flujo oficial inicial.

---

## 19.7 Auditoría

Registrar:

- Setup completado.
- ID del superadministrador.
- Fecha.
- Request ID.
- Contexto seguro.

No registrar:

- Setup token.
- Password.
- Hash de password.

---

## 19.8 Pruebas mínimas

- Setup válido.
- Token inválido.
- Token ausente.
- Usuario existente.
- Superadmin existente.
- Setup cerrado.
- Dos solicitudes concurrentes.
- Un único superadmin creado.
- Password hasheada.
- Usuario activo y confirmado.
- Auditoría segura.

---

# 20. Reglas para TASK-038 — Interfaz de correo

Crear una abstracción independiente del proveedor.

Ejemplo conceptual:

```typescript
interface EmailProvider {
  sendVerificationEmail(input: VerificationEmailInput): Promise<void>;
  sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void>;
  sendAccountApprovedEmail(input: AccountApprovedEmailInput): Promise<void>;
  sendTestEmail(input: TestEmailInput): Promise<void>;
}
```

No acoplar servicios de aplicación directamente a Nodemailer o Gmail.

---

## 20.1 Entradas tipadas

Cada método debe recibir:

- Destinatario.
- Datos mínimos.
- URL segura cuando aplique.
- Locale si se utiliza.

No aceptar HTML arbitrario desde el usuario.

---

## 20.2 Resultados

Definir comportamiento consistente para:

- Éxito.
- Error temporal.
- Error permanente.
- Timeout.

No exponer errores internos de SMTP al usuario.

---

## 20.3 Templates

Los templates deben:

- Estar en español.
- Tener asunto claro.
- Tener versión HTML y/o texto.
- Evitar estilos complejos.
- No incluir secretos.
- No depender de imágenes externas críticas.

---

# 21. Reglas para TASK-039 — Gmail SMTP

La implementación inicial utiliza Gmail SMTP.

Configuración mediante:

```text
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_APP_PASSWORD
```

No usar password normal de Gmail.

---

## 21.1 Transporte

Configurar:

- TLS.
- Timeout.
- Remitente.
- Manejo seguro de errores.

No desactivar validación TLS.

No aceptar certificados inseguros.

---

## 21.2 Logs

Puede registrar:

- Tipo de email.
- Dominio del destinatario si es seguro.
- Message ID del proveedor cuando corresponda.
- Duración.
- Resultado.

No registrar:

- Password SMTP.
- Token dentro de URL.
- Contenido completo sensible.
- Email completo si no es necesario.

---

## 21.3 Errores

Mapear errores a códigos como:

```text
EMAIL_DELIVERY_FAILED
EMAIL_PROVIDER_UNAVAILABLE
EMAIL_CONFIGURATION_INVALID
```

No devolver mensajes crudos de Nodemailer al cliente.

---

## 21.4 Reintentos

No implementar una cola compleja en versión 1.0 salvo tarea específica.

Puede permitirse reintento manual mediante:

- Reenvío de confirmación.
- Nueva solicitud de recuperación.

No realizar reintentos infinitos dentro de la solicitud.

---

## 21.5 Pruebas

No enviar emails reales en pruebas automáticas.

Probar:

- Configuración.
- Construcción de mensaje.
- Error sanitizado.
- Timeout simulado.
- Credenciales ausentes.
- TLS habilitado.

---

# 22. Reglas para TASK-040 — Proveedor falso de correo

Crear una implementación para tests.

Debe permitir:

- Capturar emails enviados.
- Consultar destinatario.
- Consultar tipo.
- Consultar contenido necesario.
- Simular error.
- Limpiar estado entre pruebas.

Ejemplo conceptual:

```typescript
class FakeEmailProvider implements EmailProvider {
  readonly sentEmails: SentEmail[] = [];
}
```

No utilizar una variable global compartida sin limpieza.

---

## 22.1 Seguridad

El proveedor falso solo debe utilizarse en:

- Tests.
- Desarrollo explícito cuando se configure.

No activarlo accidentalmente en producción.

Agregar una validación defensiva del entorno.

---

# 23. Reglas para TASK-041 — Layout público

El layout público debe incluir:

- Branding.
- Nombre de la aplicación.
- Navegación mínima.
- Contenedor responsive.
- Footer.
- Accesibilidad.
- Metadatos básicos.

Rutas previstas:

```text
/login
/register
/verify-email
/pending-approval
/forgot-password
/reset-password
/setup
```

La ruta de setup puede usar un layout más restringido.

---

## 23.1 Navegación

Mostrar enlaces según contexto:

- Iniciar sesión.
- Registrarse.
- Volver al inicio.

No mostrar enlaces administrativos.

---

## 23.2 Responsive

Debe funcionar en:

```text
320 px
375 px
390 px
768 px
1366 px
1920 px
```

Evitar formularios demasiado anchos.

---

## 23.3 Accesibilidad

Incluir:

- Skip link cuando corresponda.
- Jerarquía de headings.
- Labels.
- Foco visible.
- Contraste.
- Mensajes asociados a campos.
- `aria-live` para resultados dinámicos cuando sea necesario.

---

# 24. Reglas generales de formularios

Los formularios deben utilizar:

- Validación cliente solo como ayuda.
- Validación servidor obligatoria.
- Mensajes de campo.
- Estado de envío.
- Prevención de doble envío visual.
- Resultado seguro.

No confiar en:

- `required` del navegador.
- Inputs deshabilitados.
- Campos ocultos.
- Estado React.

---

## 24.1 Password inputs

Deben incluir:

- Tipo password.
- Autocomplete correcto.
- Opción de mostrar/ocultar si el diseño la contempla.
- No copiar password a logs.
- No repoblar password después de error.

Valores recomendados:

```text
autocomplete="new-password"
autocomplete="current-password"
```

según el formulario.

---

## 24.2 Errores

Mostrar:

- Error general.
- Errores por campo.
- Mensaje seguro.
- Request ID solo cuando ayude a soporte.

No mostrar stack traces.

---

# 25. Reglas para TASK-042 — Pantalla de registro

Campos:

```text
Nombre
Apellido
Nickname
Correo
Equipo favorito
Password
Confirmación
Aceptación de reglas
```

---

## 25.1 Equipos

Cargar únicamente equipos activos.

Mostrar:

- Nombre.
- Logo cuando exista.
- Alternativa textual.

No romper la pantalla si un logo falta.

---

## 25.2 Resultado exitoso

Después del registro:

```text
Mostrar instrucciones para revisar el correo.
```

No iniciar sesión automáticamente.

No omitir confirmación de correo.

---

## 25.3 Errores

Mapear:

```text
EMAIL_ALREADY_EXISTS
NICKNAME_ALREADY_EXISTS
INVALID_TEAM
INVALID_PASSWORD
VALIDATION_ERROR
RATE_LIMITED
```

a mensajes comprensibles.

No exponer detalles de base.

---

## 25.4 Pruebas mínimas

Componentes:

- Render.
- Labels.
- Navegación por teclado.
- Errores de campo.
- Estado de envío.

E2E:

- Registro válido.
- Duplicado.
- Password no coincide.
- Reglas no aceptadas.
- Flujo hacia confirmación.

---

# 26. Reglas para TASK-043 — Pantalla de login

Campos:

```text
Correo
Password
```

Elementos:

- Botón de login.
- Enlace a registro.
- Enlace a recuperación.
- Mensajes de estado.

---

## 26.1 Autocomplete

Usar:

```text
email
current-password
```

---

## 26.2 Estados especiales

Después de credenciales válidas:

- Pendiente de confirmación → instrucciones.
- Pendiente de aprobación → pantalla correspondiente.
- Activo → área privada.
- Bloqueado o deshabilitado → mensaje seguro.

No distinguir usuarios inexistentes antes de verificar credenciales.

---

## 26.3 Redirección

Usar únicamente rutas internas validadas.

No construir redirecciones desde valores no confiables.

---

## 26.4 Pruebas mínimas

- Login válido.
- Password incorrecta.
- Usuario inexistente.
- Pendiente de confirmación.
- Pendiente de aprobación.
- Bloqueado.
- Recuperación accesible.
- Open redirect bloqueado.
- Accesibilidad.

---

# 27. Reglas para TASK-044 — Confirmación y aprobación pendiente

Crear estados visuales para:

- Confirmación exitosa.
- Token inválido.
- Token expirado.
- Token ya usado.
- Reenvío disponible.
- Aprobación pendiente.

---

## 27.1 Confirmación exitosa

Mensaje:

```text
Tu correo fue confirmado.
Tu cuenta está pendiente de aprobación.
```

No prometer tiempos de aprobación.

---

## 27.2 Token inválido

Mensaje seguro:

```text
El enlace no es válido o ha expirado.
```

Ofrecer reenvío cuando corresponda.

---

## 27.3 Aprobación pendiente

La pantalla debe explicar:

- Que el correo está confirmado.
- Que un administrador debe aprobar.
- Que se notificará al usuario cuando corresponda.
- Que todavía no puede acceder.

No mostrar información interna de administradores.

---

## 27.4 Polling

No implementar polling constante para aprobación salvo requisito explícito.

Puede ofrecer:

- Volver al login.
- Revisar nuevamente manualmente.
- Esperar correo.

---

## 27.5 Pruebas mínimas

- Confirmación exitosa.
- Inválida.
- Expirada.
- Reenvío.
- Pendiente.
- Accesibilidad.
- Sin exposición de token en UI o logs.

---

# 28. Reglas para TASK-045 — Recuperación de contraseña

Incluye dos pantallas:

```text
/forgot-password
/reset-password
```

---

## 28.1 Solicitud

Campo:

```text
Email
```

Siempre mostrar respuesta genérica después de envío válido.

No cambiar el mensaje según existencia.

---

## 28.2 Restablecimiento

Campos:

```text
Nueva password
Confirmación
```

El token puede recibirse por URL, pero:

- No debe registrarse.
- No debe enviarse a analytics.
- No debe conservarse en storage.
- Debe consumirse únicamente en servidor.

---

## 28.3 Después del cambio

Mostrar:

```text
Tu contraseña fue actualizada.
Inicia sesión nuevamente.
```

No mostrar sesiones ni datos de cuenta.

---

## 28.4 Pruebas mínimas

- Solicitud válida.
- Email inexistente con misma respuesta.
- Token válido.
- Token inválido.
- Token expirado.
- Password no coincide.
- Password actualizada.
- Login anterior invalidado.
- Accesibilidad.

---

# 29. Server Actions y servicios

Las pantallas pueden usar Server Actions.

Flujo obligatorio:

```text
UI
↓
Server Action
↓
Schema Zod
↓
Application Service
↓
Repository / Provider
```

No colocar dentro de la Server Action:

- Hashing directo.
- Consultas Prisma complejas.
- Reglas de estado.
- Construcción completa de email.
- Lógica reutilizable.

La Server Action debe ser delgada.

---

# 30. Route Handlers

Usar Route Handlers cuando sea necesario para:

- Confirmación mediante enlace GET con transición segura posterior.
- Endpoints explícitos.
- Integraciones.
- Casos que requieran HTTP.

No realizar cambios sensibles mediante GET sin protección.

Una estrategia válida para confirmación puede ser:

```text
GET muestra estado o formulario
POST confirma el token
```

o una transición segura equivalente documentada.

No crear mutaciones CSRF-vulnerables mediante enlaces GET si pueden evitarse.

---

# 31. Normalización

Crear funciones centrales para:

```text
normalizeEmail
normalizeNickname
```

No repetir normalización en:

- UI.
- Service.
- Repository.

La validación puede ocurrir en varias capas, pero la transformación canónica debe ser consistente.

---

## 31.1 Email

Ejemplo conceptual:

```typescript
function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
```

---

## 31.2 Nickname

La normalización debe corresponder a las reglas documentadas.

Puede incluir:

- Trim.
- Normalización Unicode.
- Lowercase para unicidad.

Debe conservarse la versión visible elegida por el usuario cuando sea válida.

No eliminar caracteres arbitrariamente después de aceptar el formulario.

---

# 32. Rate limiting

Esta fase debe implementar o preparar límites para:

- Registro.
- Login.
- Reenvío.
- Recuperación.
- Setup.

La implementación final de endurecimiento se revisará en TASK-102.

---

## 32.1 Plan gratuito

No introducir Redis de pago.

Opciones aceptables dependen del hosting y arquitectura.

La solución debe:

- Ser segura para el alcance.
- Documentar limitaciones.
- Ser reemplazable.
- No crear una falsa garantía si el hosting es distribuido.

Si durante esta fase no existe infraestructura suficiente, crear una interfaz y una implementación apropiada para el entorno actual, dejando documentado el riesgo.

No afirmar que un rate limiter en memoria protege múltiples instancias.

---

# 33. Auditoría y eventos

Acciones de autenticación que deben registrarse según el modelo:

- Setup completado.
- Login exitoso.
- Login fallido resumido cuando sea seguro.
- Logout.
- Password restablecida.
- Sesiones revocadas.
- Correo confirmado.
- Reenvío solicitado.
- Registro creado.

Distinguir:

```text
AuditLog
```

de:

```text
Operational security log
```

No todos los intentos públicos necesitan una fila de auditoría permanente.

Evitar llenar AuditLog con ruido innecesario.

---

# 34. Privacidad

Datos privados:

- Nombre.
- Apellido.
- Email.
- IP.
- User agent.
- Sesiones.
- Historial de recuperación.

No exponerlos públicamente.

El nickname y equipo favorito pueden ser visibles dentro de la competencia según reglas.

---

# 35. Caché

Las páginas y acciones de autenticación deben evitar caché pública.

Aplicar según corresponda:

```text
no-store
private
dynamic
```

No cachear:

- Usuario actual.
- Estado de sesión.
- Tokens.
- Pantalla de setup.
- Confirmación.
- Recuperación.

---

# 36. Logs seguros

Antes de registrar inputs de autenticación, eliminar:

```text
password
passwordConfirmation
token
sessionToken
cookie
authorization
smtpAppPassword
initialSetupToken
```

Puede registrarse:

- Request ID.
- Ruta.
- Resultado.
- Código de error.
- User ID después de resolverlo, cuando sea necesario.
- Duración.

No registrar el cuerpo completo del formulario.

---

# 37. Orden recomendado

```text
TASK-029
↓
TASK-030
↓
TASK-038
↓
TASK-040
↓
TASK-039
↓
TASK-031
↓
TASK-032
↓
TASK-033
↓
TASK-034
↓
TASK-035
↓
TASK-036
↓
TASK-037
↓
TASK-041
↓
TASK-042
↓
TASK-043
↓
TASK-044
↓
TASK-045
```

El orden puede variar ligeramente, pero deben respetarse dependencias.

Por ejemplo:

- Registro requiere hashing y repositorio.
- Confirmación requiere tokens.
- Login requiere sesiones.
- UI requiere servicios funcionales.
- Gmail puede implementarse después de la interfaz y el fake.

---

# 38. Criterios de salida de la fase

La fase auth se considera completa cuando:

- Password hashing funciona.
- Passwords nunca se guardan en texto plano.
- Las sesiones son opacas.
- La cookie es HttpOnly.
- Los tokens se almacenan como hash.
- Registro crea usuario pendiente de confirmación.
- Confirmación cambia a pendiente de aprobación.
- Reenvío invalida tokens anteriores.
- Login evita enumeración básica.
- Solo usuarios activos acceden.
- Logout revoca sesión.
- Recuperación cambia password y revoca sesiones.
- Setup crea exactamente un superadministrador.
- Setup queda cerrado.
- Existe EmailProvider.
- Gmail SMTP está aislado.
- Existe FakeEmailProvider.
- La UI pública es responsive.
- Los formularios son accesibles.
- Los errores están tipados.
- El rate limiting básico está aplicado o claramente preparado.
- Las pruebas unitarias pasan.
- Las pruebas de integración pasan.
- Los E2E principales pasan.
- Lint pasa.
- Typecheck pasa.
- Build pasa.

---

# 39. Fuera de alcance

No implementar durante esta fase:

- Aprobación administrativa.
- Rechazo administrativo.
- Bloqueo desde UI administrativa.
- Promoción de administradores.
- Gestión de temporadas.
- Gestión de jornadas.
- Gestión de partidos.
- Pronósticos.
- Clasificación.
- Dashboard completo.
- Notificaciones internas completas.
- Correos de recordatorio.
- OAuth.
- MFA.
- Passkeys.
- Login social.
- Cambio de email.
- Avatar personal.

No crear funcionalidades futuras por anticipación.

---

# 40. Errores comunes

## Error 1 — Crear sesión para usuario pendiente

Solo un usuario activo puede obtener una sesión privada normal.

---

## Error 2 — Guardar token plano

La base conserva hash, no token.

---

## Error 3 — Usar JWT por conveniencia

La arquitectura eligió sesiones opacas.

---

## Error 4 — Enviar correo dentro de una transacción larga

No mantener bloqueos de base mientras SMTP responde.

---

## Error 5 — Exponer “correo no existe”

Evitar enumeración.

---

## Error 6 — Borrar solo cookie en logout

También revocar servidor.

---

## Error 7 — Setup basado solo en ruta oculta

Debe validar token, estado y concurrencia.

---

## Error 8 — Crear admin en seed

Prohibido.

---

## Error 9 — Confiar en validación del formulario

Validar nuevamente en servidor.

---

## Error 10 — Registrar formularios completos

Nunca registrar passwords o tokens.

---

## Error 11 — Mutar estado mediante GET inseguro

Usar una estrategia segura para confirmaciones.

---

## Error 12 — Activar FakeEmailProvider en producción

Agregar protección defensiva.

---

# 41. Pruebas mínimas de seguridad

Al terminar esta fase deben existir pruebas para:

- Password no aparece en respuesta.
- Password no aparece en logs de prueba.
- Token plano no se guarda.
- Cookie HttpOnly.
- Cookie Secure en producción.
- Sesión revocada no funciona.
- Usuario bloqueado no funciona.
- Usuario pendiente no accede.
- Correo inexistente no se enumera.
- Reset revoca sesiones.
- Tokens son de un uso.
- Setup concurrente crea uno solo.
- Open redirect rechazado.
- SMTP error sanitizado.
- Rate limit básico.
- Formularios validan servidor.

---

# 42. Comandos de validación

Según la tarea:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
npm run build
npx prisma validate
npx prisma generate
```

No enviar Gmail real durante tests automáticos.

No ejecutar tests contra producción.

---

# 43. Formato de entrega

Cada tarea debe terminar con:

```text
## Resumen

## Archivos creados

## Archivos modificados

## Pruebas agregadas o actualizadas

## Comandos ejecutados

## Criterios de aceptación

## Decisiones o supuestos

## Pendientes o bloqueos

## Riesgos detectados
```

Agregar:

```text
Tareas adicionales implementadas: ninguna
```

---

# 44. Prompt base de ejecución

```text
Implementa únicamente [TASK-XXX — NOMBRE] de
docs/19-IMPLEMENTATION_PLAN.md.

Contexto obligatorio:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md
- docs/17-CODEX_INSTRUCTIONS.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Documentos específicos:

- [DOCUMENTO]
- [DOCUMENTO]
- [DOCUMENTO]

Antes de modificar código:

1. Inspecciona el repositorio.
2. Confirma dependencias.
3. Revisa contratos existentes.
4. Revisa pruebas existentes.
5. Presenta un plan breve.
6. Identifica riesgos de autenticación y privacidad.

Implementa únicamente el cambio mínimo completo.

No avances tareas posteriores.

Agrega pruebas unitarias, de integración, API o E2E según corresponda.

Ejecuta los comandos aplicables.

Entrega el resultado usando prompts/09-task-template.md.
```

---

# 45. Ejemplo — TASK-029

```text
Implementa únicamente TASK-029 — Implementar hashing de contraseña.

Lee:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md
- docs/02-Arquitectura.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-024 — UserRepository disponible.

Objetivo:

Crear una abstracción PasswordHasher y una implementación segura con
Argon2id.

Alcance:

- src/modules/auth/application/ o domain/ según la arquitectura existente.
- src/modules/auth/infrastructure/
- tests/unit/auth/
- package.json únicamente si se requiere la dependencia aprobada.

Fuera de alcance:

- Registro.
- Login.
- Sesiones.
- Recuperación.
- UI.

Requisitos:

- hash(password) devuelve un hash seguro.
- verify(password, hash) devuelve boolean.
- Password incorrecta no lanza error funcional.
- No usar SHA directo.
- No usar `any`.
- No registrar password.
- Parámetros seguros para producción.
- Parámetros de test pueden ser más rápidos sin afectar producción.

Pruebas:

- Hash no coincide con texto plano.
- Verificación correcta.
- Verificación incorrecta.
- Dos hashes pueden diferir.
- Hash malformado produce resultado o error seguro según contrato.

Ejecuta:

- npm run format:check
- npm run lint
- npm run typecheck
- npm test
- npm run build
```

---

# 46. Ejemplo — TASK-031

```text
Implementa únicamente TASK-031 — Implementar registro.

Lee:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md
- docs/01-PRD.md
- docs/03-ModeloBaseDatos.md
- docs/04-ReglasNegocio.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/11-ManualUsuario.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-024 — UserRepository
- TASK-025 — TeamRepository
- TASK-027 — AuditLogRepository
- TASK-029 — PasswordHasher
- TASK-038 — EmailProvider
- TASK-040 — FakeEmailProvider para pruebas

Objetivo:

Implementar el caso de uso de registro público, creando un usuario
pendiente de confirmación y enviando un correo con token seguro.

Alcance:

- src/modules/auth/application/
- src/modules/auth/domain/
- src/modules/auth/schemas/
- Repositorios estrictamente necesarios.
- tests/unit/auth/
- tests/integration/auth/

Fuera de alcance:

- UI de registro.
- Confirmación del token.
- Login.
- Aprobación administrativa.
- Gmail real en tests.

Requisitos:

- Validar todos los campos con Zod.
- Normalizar email y nickname.
- Validar equipo activo.
- Validar aceptación de reglas.
- Hash de password.
- Guardar únicamente passwordHash.
- Crear usuario PENDING_EMAIL_VERIFICATION.
- Crear token aleatorio.
- Guardar token hash.
- Enviar URL creada desde APP_URL.
- Manejar unicidad concurrente.
- No mantener transacción abierta durante SMTP.
- Permitir reenvío posterior si SMTP falla.
- No devolver passwordHash ni tokenHash.

Pruebas:

- Registro válido.
- Email duplicado.
- Nickname duplicado.
- Password inválida.
- Confirmación diferente.
- Equipo inexistente.
- Equipo inactivo.
- Reglas no aceptadas.
- Token guardado como hash.
- Password guardada como hash.
- Email capturado por FakeEmailProvider.
- Falla SMTP no corrompe usuario.
- Carrera de unicidad.

No implementes TASK-032 ni TASK-042.
```

---

# 47. Ejemplo — TASK-034

```text
Implementa únicamente TASK-034 — Implementar login.

Lee:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/11-ManualUsuario.md
- docs/14-DecisionesArquitectonicas.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-029 — PasswordHasher
- TASK-030 — Session service
- TASK-024 — UserRepository

Objetivo:

Implementar el caso de uso de login por email y password, creando una
sesión únicamente para usuarios activos.

Alcance:

- src/modules/auth/application/
- src/modules/auth/schemas/
- Adaptadores necesarios para cookie en capa web.
- tests/unit/auth/
- tests/integration/auth/

Fuera de alcance:

- Pantalla de login.
- Recuperación.
- Aprobación.
- MFA.
- OAuth.

Requisitos:

- Normalizar email.
- Evitar enumeración.
- Comparación segura para usuario inexistente.
- Rechazar estado pendiente, bloqueado, deshabilitado y rechazado.
- Crear sesión opaca.
- Cookie HttpOnly.
- Secure en producción.
- SameSite.
- Validar returnTo interno.
- Rate limiting.
- Logs sin password.

Pruebas:

- Credenciales válidas.
- Email inexistente.
- Password incorrecta.
- Mensajes equivalentes.
- Pendiente de correo.
- Pendiente de aprobación.
- Bloqueado.
- Deshabilitado.
- Sesión creada.
- Cookie segura.
- Open redirect.
- Rate limit.

No implementes UI ni tareas posteriores.
```

---

# 48. Ejemplo — TASK-037

```text
Implementa únicamente TASK-037 — Implementar setup inicial.

Lee:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md
- docs/03-ModeloBaseDatos.md
- docs/07-Seguridad.md
- docs/09-Deployment.md
- docs/10-ManualAdministrador.md
- docs/14-DecisionesArquitectonicas.md
- docs/15-Riesgos.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-024 — UserRepository
- TASK-025 — TeamRepository
- TASK-027 — AuditLogRepository
- TASK-029 — PasswordHasher
- TASK-030 — Session infrastructure si se requiere
- TASK-031 — Validaciones reutilizables de usuario

Objetivo:

Crear un flujo transaccional y de una sola ejecución para crear el
primer SUPER_ADMIN.

Alcance:

- src/modules/auth/application/setup/
- src/modules/auth/schemas/
- Route Handler o Server Action de setup.
- tests/integration/auth/setup/
- UI mínima únicamente si la tarea la incluye expresamente.

Fuera de alcance:

- Seed de administrador.
- Promoción posterior de administradores.
- Gestión administrativa.
- Deployment.

Requisitos:

- Validar INITIAL_SETUP_TOKEN.
- No exponer token al cliente ni logs.
- Solo disponible sin usuarios y sin superadmin.
- Crear usuario ACTIVE.
- Correo confirmado.
- Rol SUPER_ADMIN.
- Password hasheada.
- Transacción.
- Protección contra concurrencia.
- Cerrar setup.
- Auditoría.
- Solicitudes posteriores rechazadas.

Pruebas:

- Setup correcto.
- Token incorrecto.
- Token ausente.
- Usuario preexistente.
- Setup cerrado.
- Dos solicitudes paralelas.
- Un solo superadmin.
- Auditoría segura.
- Ningún secreto registrado.
```

---

# 49. Ejemplo — TASK-042

```text
Implementa únicamente TASK-042 — Crear pantalla de registro.

Lee:

- prompts/00-global-context.md
- prompts/02-auth.md
- prompts/09-task-template.md
- docs/01-PRD.md
- docs/05-UI-UX.md
- docs/06-API.md
- docs/07-Seguridad.md
- docs/08-Testing.md
- docs/11-ManualUsuario.md
- docs/18-DEVELOPER_RULES.md
- docs/19-IMPLEMENTATION_PLAN.md

Dependencias:

- TASK-031 — Registro funcional
- TASK-041 — Layout público
- Team query disponible

Objetivo:

Crear una pantalla responsive y accesible para registrar usuarios.

Alcance:

- src/app/(public)/register/
- src/modules/auth/ui/
- Componentes compartidos estrictamente necesarios.
- tests de componente.
- tests E2E de registro.

Fuera de alcance:

- Confirmación de correo.
- Login.
- Área privada.
- Administración.
- Cambio de reglas del registro.

Requisitos:

- Nombre.
- Apellido.
- Nickname.
- Email.
- Equipo favorito activo.
- Password.
- Confirmación.
- Checkbox de aceptación.
- Labels.
- Errores por campo.
- Estado de envío.
- No repoblar passwords tras error.
- Resultado exitoso con instrucciones.
- Server Action delgada.
- Validación definitiva en servidor.

Pruebas:

- Render.
- Teclado.
- Labels.
- Error de password.
- Equipo inválido.
- Reglas no aceptadas.
- Registro exitoso.
- Navegación a login.
- Mobile 320 px.
- Sin secretos en HTML o respuesta.
```

---

# 50. Conclusión

La fase de autenticación debe producir un sistema seguro y pequeño.

El objetivo no es agregar todas las formas posibles de acceso.

El objetivo es implementar correctamente:

```text
Email
+
Password
+
Confirmación
+
Aprobación
+
Sesiones opacas
+
Recuperación
+
Setup seguro
```

La autenticación controla el acceso a toda la aplicación.

Por ello, ninguna tarea de esta fase debe considerarse completa sin:

- Validación de servidor.
- Manejo seguro de estados.
- Protección de tokens.
- Pruebas de seguridad.
- Respuestas no enumerables.
- Sesiones revocables.
- Logs sin secretos.