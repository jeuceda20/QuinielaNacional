# Entorno de preview

Cada preview usa una base PostgreSQL exclusiva y secretos distintos de produccion. No se permite conectar `DATABASE_URL` ni `DIRECT_DATABASE_URL` a produccion.

Configura el proveedor gratuito con los nombres de `.env.preview.example` y valores propios del preview. Mantener desactivados diagnosticos, consola SQL, escrituras SQL, herramientas de datos de prueba y SMTP real.

Antes de publicar un preview, verificar:

- La URL publica coincide con `APP_URL`.
- La base se identifica como preview y no contiene datos reales.
- `SESSION_SECRET` e `INITIAL_SETUP_TOKEN` son exclusivos.
- El correo no puede entregar mensajes a usuarios reales.
- El pipeline CI completo pasa antes del despliegue.
