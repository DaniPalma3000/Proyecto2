# Proyecto de Control de Asistencia con Reconocimiento Facial

Este sistema permite el registro de asistencia de empleados mediante reconocimiento facial, con funciones de mantenimiento, reportes y gestión desde una interfaz web construida en React y una API en Node.js con PostgreSQL.

---

## Requisitos Previos

### Instalaciones necesarias:

| Componente      | Versión recomendada |
|-----------------|---------------------|
| Node.js         | >= 18.x             |
| PostgreSQL      | >= 14.x             |
| Git             | Cualquiera          |
| npm o yarn      | >= 8.x              |
| Python (opcional) | Para convertir imágenes si es necesario |

---

## Estructura del proyecto

```
Proyecto2/
│
├── backend/              → API REST con Node.js y PostgreSQL
│   ├── controllers/      
│   ├── routes/           
│   ├── queries/          
│   ├── db.js             → Configuración de PostgreSQL
│   └── index.js          → Servidor Express
│
├── frontend/             → Aplicación en React (con Vite)
│   └── public/models     → Modelos de face-api.js
│
└── README.md             → Este documento
```

---

## Configuración rápida

### Clonar el repositorio o bien utiliza el archivo zip

```bash
git clone https://github.com/tu_usuario/Proyecto2.git
cd Proyecto2
```

## 🔁 Configurar el Backend

cd backend

### 1. Instalar dependencias

npm install

```js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'asistencia',
  password: 'tu_password',
  port: 5432,
});
```

### 2. Crear la base de datos y ejecutar las tablas

```sql
CREATE DATABASE asistencia;
```

Ejecuta tus scripts `.sql` para crear tablas y funciones (`insertar_marca` etc.).

---

### 3. Iniciar el servidor

```bash
npm start
```

---

## Configurar el Frontend

```bash
cd ../frontend
```

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev
```

---

## 📁 Modelos de reconocimiento facial

En `frontend/public/models` coloca los modelos desde:

https://github.com/justadudewhohacks/face-api.js-models

Debe tener archivos `.bin` y `.json` correspondientes.

---

## 👤 Funcionalidades disponibles

| Funcionalidad               | Ruta                     |
|----------------------------|--------------------------|
| Registrar empleado         | `/empleados`            |
| Reconocimiento facial      | `/scanner`              |
| Reporte de asistencia      | `/reportes`             |
| Gestión de jornadas        | `/jornadas`             |
| Gestión de departamentos   | `/departamentos`        |
| Mantenimiento de empleados | `/mantenimiento-empleados` |
| Inicio de sesión           | `/login`                |


---

## ⚠️ Errores comunes

| Error | Solución |
|-------|----------|
| `Cannot PUT /api/empleado/15` | Revisa si la ruta está definida |
| `descriptor no válido`        | Verifica que se detecte un rostro |
| `violación de llave foránea` | Borra marcas antes de eliminar un empleado o usa `ON DELETE CASCADE` |

---

Desarrollado por **Natalia Sosa y Daniel Palma**  
Estudiantes de Universidad Galileo  
Carrera: Ingeniería en Sistemas
