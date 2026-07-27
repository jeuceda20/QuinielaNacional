# Resumen de continuidad — Quiniela la Goleada

Última actualización: 2026-07-26

## Rama de trabajo

- Rama activa para cambios: `dev`.
- `main` permanece estable y solo debe recibir cambios aprobados.
- `dev` fue creada desde `main` en el commit `86175e3`.
- Antes de trabajar, confirmar con:

```powershell
git branch --show-current
git status
```

## Estado funcional actual

- Registro crea cuentas en estado `PENDING_APPROVAL`.
- Un administrador aprueba usuarios y los agrega automáticamente a la temporada activa.
- La recuperación por correo y la confirmación de correo fueron eliminadas.
- El administrador restablece una cuenta con contraseña temporal; el usuario debe cambiarla al iniciar sesión.
- Contraseñas: mínimo 10 y máximo 128 caracteres, validadas en interfaz y servidor.
- Dashboard: marca `Quiniela la Goleada` y avatar con emoji del equipo favorito; si no tiene equipo, usa la inicial del nickname.
- Panel admin incluye Temporadas, Jornadas y partidos, Usuarios, Auditoría y Exportaciones.
- Auditoría: `/admin/audit`, con filtros y diseño oscuro.
- Exportaciones: `/admin/exports`, solo superadministrador. Permite JSON de respaldo y CSV de usuarios, partidos, pronósticos y tabla.
- Los equipos se muestran con nombres alternativos y emojis definidos en `prisma/seed.ts`.

## Base de datos y migraciones

- Base local de desarrollo: PostgreSQL en `localhost:5433`.
- La migración `20260726220000_remove_smtp_auth_artifacts` ya fue aplicada localmente.
- Esa migración elimina `EmailVerificationToken`, `PasswordResetToken` y `User.emailVerifiedAt`.
- Cuando se reactive un despliegue de producción, ejecutar migraciones antes de publicar el código:

```powershell
npx prisma migrate deploy
```

- Las variables `SMTP_*` ya no son necesarias y pueden eliminarse de Netlify cuando se vuelva a administrar producción.
- No registrar ni compartir valores de `.env.local`, `.env.pilot.local` o variables de Netlify/Supabase.

## Git reciente

- `86175e3 feat(auth): allow ten character passwords`
- `8fecb90 style(dashboard): show favorite team avatar`
- `f98bfb8 refactor(auth): remove obsolete SMTP workflow`
- `0a4edef feat(admin): add data export center`
- `79fedaa feat(admin): expose and style audit log`

## Validaciones recientes

Ejecutadas correctamente después de la limpieza SMTP:

```powershell
npm run typecheck
npm test
npm run build
```

Resultado de pruebas unitarias: 209 aprobadas.

## Despliegue

- GitHub: `https://github.com/jeuceda20/QuinielaNacional`
- Netlify quedó con publicación automática bloqueada por límite de créditos.
- Los pushes a `dev` no deben afectar producción; revisar configuración de rama de producción antes de desbloquear Netlify.

## Próximas tareas sugeridas

1. Piloto completo: simular temporada con más usuarios y casos de reprogramación, suspensión, cancelación y corrección.
2. Comparar recálculo con la tabla final y comprobar diferencias igual a cero.
3. Probar respaldo y restauración en una base de prueba.
4. Ejecutar piloto con usuarios reales de la comunidad y corregir hallazgos.
5. Antes de producción: revisión final de seguridad, backup inicial y publicación de temporada oficial.

## Notas de trabajo

- Puede aparecer `next-env.d.ts` modificado después de iniciar Next.js. Es un archivo generado: no incluirlo en commits salvo que exista un cambio intencional.
- Hacer commits y pushes a `dev`. Para llevar una mejora aprobada a `main`, usar una revisión/merge explícito.
