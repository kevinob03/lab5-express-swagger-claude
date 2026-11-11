# Laboratorio 5: API REST con Express, Swagger y DeepSeek

Aplicación full stack para crear, consultar, listar y eliminar notas con una página React. También permite enviar preguntas a DeepSeek y resumir notas. Express sirve la API y SQLite conserva los datos después de reiniciar el servidor.

## Autoría

- Estudiante: kevinob03.
- Modalidad: trabajo individual.
- Integración IA: DeepSeek API.

## Requisitos

- Node.js 20 o superior.
- Una API key de DeepSeek.

## Instalación y ejecución

```bash
npm install
npm install --prefix frontend
```

Inicia el backend y el frontend en dos terminales distintas:

```bash
npm run dev
npm run dev:frontend
```

La página queda en `http://localhost:5173` y Swagger en `http://localhost:3000/api-docs`. Para compilar la página para Express, ejecuta `npm run build:frontend`; Express sirve el resultado desde `frontend/dist`.

## Variables de entorno

Configura estas variables en un archivo local `.env`. No compartas ni subas ese archivo.

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`
- `PORT`
- `DATABASE_PATH`

Usa `.env.example` como referencia. `.gitignore` excluye `.env`, `node_modules/` y el archivo local de SQLite.

## Base de datos

SQLite guarda las notas en `data/notas.db`. El backend crea el directorio y la tabla `notas` si no existen. Ese archivo persiste entre reinicios y no se sube a GitHub.

## Frontend

La interfaz React permite crear, listar, resumir y eliminar notas, y preguntar a DeepSeek. En desarrollo, Vite reenvía `/api` a Express; la clave de DeepSeek permanece en el backend.

## Endpoints

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/notas` | Lista notas |
| GET | `/api/notas/:id` | Obtiene una nota |
| POST | `/api/notas` | Crea una nota |
| DELETE | `/api/notas/:id` | Elimina una nota |
| POST | `/api/ia/preguntar` | Envía una pregunta a DeepSeek |
| POST | `/api/notas/:id/resumen` | Resume una nota en tres viñetas |
| GET | `/api-docs` | Abre Swagger UI |

Las notas se almacenan en SQLite y permanecen después de reiniciar el servidor.

## Verificación realizada

Verificado: build de React, frontend servido por Express (`200`), CRUD y validación, Swagger (`200`), respuesta de pregunta y resumen de DeepSeek. Una nota siguió disponible tras reiniciar el backend. La pregunta usó 54 tokens de entrada y 84 de salida; el resumen usó 73 tokens de entrada y 121 de salida.

## Capturas

Pregunta exitosa de `POST /api/ia/preguntar` (200):

![Pregunta respondida por DeepSeek](docs/capturas/pregunta-deepseek.png)

Clave inválida, con respuesta genérica `IA_NO_DISPONIBLE` (502):

![Respuesta con API key inválida](docs/capturas/clave-invalida.png)

## Reflexión

1. **¿Por qué la API key no puede estar en el frontend?** Si se incluye en el código o bundle del navegador, cualquier usuario puede inspeccionarlo, copiarla y usarla, posiblemente consumiendo la cuota del propietario. La clave se guarda en el backend dentro de `.env`.
2. **¿Qué responde la API cuando DeepSeek rechaza la clave?** El manejador transforma los errores del proveedor en `IA_NO_DISPONIBLE` y no expone el mensaje original al cliente.
3. **¿Qué diferencia hay entre `system` y `messages`?** `system` define instrucciones generales; el mensaje del usuario contiene la petición concreta. Para un resumen, el `system` pide tres viñetas breves y el contenido de la nota es el mensaje del usuario.
4. **¿Cuántos tokens usaron dos llamadas y cómo limitar el costo?** La pregunta usó 54 tokens de entrada y 84 de salida; el resumen usó 73 de entrada y 121 de salida. `max_tokens` limita la salida; la validación Zod también limita la longitud de entrada.
5. **¿Qué ocurriría sin validar el body?** Entradas vacías o enormes podrían generar respuestas inútiles y aumentar el consumo; también podrían causar errores evitables.
6. **¿Qué conflicto de Git tuvieron al integrar ramas?** No hubo integración de ramas ni conflicto porque el trabajo se realiza individualmente. No se atribuyen commits ni revisiones a otra persona.

## Entrega individual

Repositorio: https://github.com/kevinob03/lab5-express-swagger-claude

La guía original evalúa colaboración en pareja. Este repositorio se desarrolla individualmente: no hubo pull request ni revisión de pareja.
