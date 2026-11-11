# Progreso del Laboratorio 5

## Checklist

- [x] Preparación del proyecto, dependencias y estructura.
- [x] Configuración base de Express y Swagger UI.
- [x] CRUD de notas con validación Zod y errores centralizados.
- [x] Persistencia de notas en SQLite.
- [x] Página frontend React con Vite conectada a la API.
- [x] Modularización de frontend y backend en componentes, páginas, rutas, modelos y controladores.
- [x] Build del frontend y persistencia comprobada después de reiniciar Express.
- [x] Servicio DeepSeek y endpoints de pregunta y resumen.
- [x] Documentación OpenAPI de siete operaciones.
- [x] Verificación manual local del CRUD, validación y Swagger.
- [x] Guardar en `docs/capturas/` las capturas de pregunta exitosa y clave inválida (casos ★).
- [x] Registrar tokens de dos llamadas reales.
- [x] Revisar el estado final de Git y publicar el proyecto en `main`.
- [ ] Entregar la coevaluación individual que indique el docente.
- [ ] Consultar con el docente cómo adaptar el puntaje de colaboración al trabajo individual.

## Errores y observaciones

- Una llamada de pregunta y otra de resumen a DeepSeek devolvieron respuesta; su uso se registró en README.
- Las notas ahora persisten en SQLite; una prueba confirmó que permanecen tras reiniciar Express.
- El commit `d58fcf3` fue publicado en `origin/main`.
- No se creó pull request ni revisión de pareja porque el proyecto se trabaja individualmente.

## Conceptos trabajados

- Express conecta rutas HTTP con funciones del backend.
- Zod valida los datos del body antes de procesarlos.
- Los servicios separan reglas de notas y comunicación con DeepSeek.
- Swagger muestra el contrato OpenAPI y permite probar endpoints.
- `.env` mantiene credenciales locales; `.gitignore` evita incluirlo en Git.

## Tiempo restante

Actualizar según la hora y el tiempo disponible para la entrega.
