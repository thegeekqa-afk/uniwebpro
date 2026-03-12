# UniwebPro - Sistema de Gestión Universitaria

UniwebPro es una aplicación web corporativa diseñada para la gestión integral de matrículas, carreras y materias universitarias.

## Requisitos Previos

- **Node.js**: Versión 18 o superior.
- **MySQL**: Base de datos para almacenamiento persistente.
- **NPM**: Gestor de paquetes.

## Instalación en Hostinger (o cualquier servidor Node.js)

### 1. Preparación de la Base de Datos
1. Accede a tu panel de control de Hostinger (hPanel).
2. Ve a **Bases de Datos MySQL**.
3. Crea una nueva base de datos llamada `u785806933_uniweb` (o el nombre que prefieras).
4. Crea un usuario y asígnale todos los privilegios a la base de datos.
5. Abre **phpMyAdmin** para esa base de datos.
6. Importa el archivo `database.sql` que se encuentra en la raíz de este proyecto. Esto creará las tablas y cargará datos de ejemplo.

### 2. Configuración del Proyecto
1. Sube los archivos de este repositorio a tu servidor (vía Git o FTP).
2. En la raíz del proyecto, crea un archivo `.env` basado en `.env.example`.
3. Edita el archivo `.env` con las credenciales de tu base de datos MySQL:
   ```env
   DB_HOST="localhost"
   DB_USER="tu_usuario_mysql"
   DB_PASSWORD="tu_password_mysql"
   DB_NAME="u785806933_uniweb"
   ```

### 3. Instalación de Dependencias y Construcción
Desde la terminal de tu servidor (SSH):
```bash
# Instalar dependencias
npm install

# Construir el frontend para producción
npm run build
```

### 4. Ejecución
Para iniciar el servidor:
```bash
npm start
```
*Nota: En Hostinger, asegúrate de configurar la aplicación Node.js en el panel de control para que apunte a `server.ts` o use el script `start` de `package.json`.*

## Características Principales

- **Dashboard**: Resumen visual de estadísticas académicas.
- **Gestión de Carreras**: Registro, edición y control de estados de programas académicos.
- **Gestión de Materias**: Administración del catálogo de asignaturas vinculadas a carreras.
- **Registro de Estudiantes**: Módulo de admisión completo con validaciones de negocio.
- **Diseño Corporativo**: Interfaz limpia, moderna y responsiva con soporte para modo oscuro.

## Tecnologías Utilizadas

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express, MySQL.
- **Lenguaje**: TypeScript.

## Soporte
Para consultas técnicas, contactar al administrador del sistema.
