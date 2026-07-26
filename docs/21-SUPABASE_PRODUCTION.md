# Base de producción en Supabase

Supabase PostgreSQL es el proveedor seleccionado para la base de producción. Se mantiene la restricción de costo obligatorio cero: crear el proyecto únicamente en el plan Free y no habilitar complementos ni facturación que puedan generar cargos.

## Creación del proyecto

1. Crear el proyecto desde el panel de Supabase con el plan Free y una región cercana a Honduras.
2. Definir una contraseña de base de datos única y guardarla en un gestor de contraseñas. No enviarla por chat ni incorporarla al repositorio.
3. Esperar a que el proyecto esté operativo y abrir **Connect** en el panel.
4. Copiar las dos URLs indicadas en `.env.production.example` hacia los secretos del hosting, sin crear ni versionar un archivo `.env.production.local`.

## URLs requeridas

| Variable | URL de Supabase | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Shared Pooler, transaction mode, puerto `6543` | Tráfico de la aplicación desplegada en hosting serverless. |
| `DIRECT_DATABASE_URL` | Direct connection, puerto `5432` | Migraciones de Prisma, exportaciones y mantenimiento. |

En el plan gratuito la conexión directa es IPv6. Si el ejecutor de migraciones solo tiene IPv4, se debe usar temporalmente la URL del Shared Pooler en session mode (puerto `5432`) para `DIRECT_DATABASE_URL`. Siempre conservar `sslmode=require` y copiar las URLs desde el panel, pues la región y el identificador del proyecto forman parte de ellas.

## Separación de entornos

- Producción usa únicamente el proyecto Supabase de producción.
- Preview conserva una base dedicada distinta, según `.env.preview.example`.
- Desarrollo y pruebas siguen usando las bases locales separadas.
- Nunca ejecutar pruebas, seeds de prueba ni `prisma migrate reset` contra Supabase producción.

## Antes de TASK-122

1. Confirmar que ambas URLs están configuradas como secretos del entorno de producción.
2. Verificar que `APP_URL` apunta al host HTTPS definitivo.
3. Generar valores diferentes para `SESSION_SECRET` e `INITIAL_SETUP_TOKEN`.
4. Mantener deshabilitados diagnóstico, consola SQL, escritura SQL y utilidades de datos de prueba.
5. Crear un respaldo verificable antes de cada migración relevante.

TASK-122 aplicará `prisma migrate deploy`; TASK-123 ejecutará el seed base una sola vez. No deben ejecutarse hasta contar con las credenciales protegidas y una base de producción real.

## Operación gratuita

Revisar periódicamente el consumo, el estado del proyecto y las condiciones vigentes del plan Free. Si el proveedor cambia sus condiciones, los datos siguen siendo portables al usar PostgreSQL y Prisma; exportar la base y migrar a otro PostgreSQL compatible antes de aceptar cualquier costo.
