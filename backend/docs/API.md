# Backend - Notitas API

## Overview
REST API para gestión de notas de usuarios con autenticación JWT.

## Base URL
```
http://localhost:3000
```

## Autenticación

### Access Token
- Expira en **15 minutos**
- Se envía en el header: `Authorization: Bearer <access_token>`

### Refresh Token
- Expira en **1 año**
- Se almacena en la base de datos
- Se usa para obtener un nuevo access token

---

## Endpoints

### Usuarios

#### Register - Registro de usuario
```
POST /users/register
```

**Body:**
```json
{
  "name": "string (required, max 255)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6, max 100)"
}
```

**Response (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 1,
    "name": "Sebastian",
    "email": "sebastian@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### Login - Inicio de sesión
```
POST /users/login
```

**Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "name": "Sebastian",
    "email": "sebastian@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (401):**
```json
{
  "error": "Credenciales inválidas"
}
```

---

#### Refresh Token - Renovar access token
```
POST /users/refresh-token
```

**Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (401):**
```json
{
  "error": "Refresh token inválido" // o "Refresh token expirado"
}
```

---

#### Get Users - Obtener todos los usuarios
```
GET /users
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Sebastian",
      "email": "sebastian@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error (401):**
```json
{
  "error": "Token no proporcionado"
}
```

**Error (403):**
```json
{
  "error": "Token inválido o expirado"
}
```

---

### Notas

#### Get All Notes - Obtener todas las notas
```
GET /notitas
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "notitas": [
    {
      "id": 1,
      "title": "Mi nota",
      "content": "Contenido de la nota",
      "userId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Create Note - Crear nota
```
POST /notitas
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "title": "string (required)",
  "content": "string (optional)"
}
```

**Response (201):**
```json
{
  "notita": {
    "id": 1,
    "title": "Mi nota",
    "content": "Contenido",
    "userId": 1
  }
}
```

---

#### Update Note - Actualizar nota
```
PUT /notitas/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

**Response (200):**
```json
{
  "notita": {
    "id": 1,
    "title": "Titulo actualizado",
    "content": "Contenido actualizado",
    "userId": 1
  }
}
```

---

#### Delete Note - Eliminar nota
```
DELETE /notitas/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Nota eliminada"
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Bad Request (validación) |
| 401 | Unauthorized (credenciales inválidas) |
| 403 | Forbidden (token inválido) |
| 500 | Internal Server Error |

---

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `ACCESS_TOKEN_SECRET` | Secret para access token | access_secret_2024 |
| `REFRESH_TOKEN_SECRET` | Secret para refresh token | refresh_secret_2024 |
| `JWT_SECRET` | Secret legacy (deprecated) | sebastian_secret_key_2024 |
| `PORT` | Puerto del servidor | 3000 |

---

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración de Sequelize
│   ├── controllers/
│   │   ├── notita.controller.ts  # Controller de notas
│   │   └── user.controller.ts   # Controller de usuarios
│   ├── middleware/
│   │   └── auth.middleware.ts    # Middleware de autenticación JWT
│   ├── models/
│   │   ├── associations.ts       # Relaciones entre modelos
│   │   ├── notitas.models.ts    # Modelo de notas
│   │   ├── refreshToken.models.ts# Modelo de refresh tokens
│   │   └── user.models.ts       # Modelo de usuarios
│   ├── routes/
│   │   ├── notita.router.ts      # Rutas de notas
│   │   └── user.router.ts        # Rutas de usuarios
│   ├── validations/
│   │   └── user.validation.ts    # Esquemas de validación Zod
│   ├── app.ts                    # Configuración de Express
│   └── index.ts                 # Punto de entrada
└── package.json
```

---

## Tecnologías

- **Express** - Framework web
- **Sequelize** - ORM para base de datos
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **Zod** - Validación de datos
- **Bcrypt** - Hash de contraseñas
- **TypeScript** - Lenguaje
