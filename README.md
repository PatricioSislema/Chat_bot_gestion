# Sistema de Gestión de Citas Médicas con Chatbot

## 📌 Descripción
Sistema completo para la gestión de citas médicas con:
- **Backend:** Spring Boot (Java)
- **Frontend:** React (JavaScript)
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Chatbot:** Telegram (en desarrollo)

---

## 🛠️ Tecnologías
| **Tecnología** | **Versión** |
|----------------|-------------|
| Spring Boot | 4.1.0 |
| React | 18+ |
| PostgreSQL | 15+ |
| Docker | (próximamente) |

---

## 🚀 Instalación y configuración

### 1. Requisitos previos
- [Git](https://git-scm.com/)
- [Java JDK 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (para backend) y [VS Code](https://code.visualstudio.com/) (para frontend)

---

### 2. Clonar el repositorio
```bash
git clone https://github.com/PatricioSislema/citas-medicas-backend.git
cd citas-medicas-backend

Configurar la base de datos (PostgreSQL)
3.1. Crear la base de datos

Abre pgAdmin o la terminal de PostgreSQL y ejecuta:
sql

CREATE DATABASE citas_medicas;

3.2. Configurar usuario y contraseña

El sistema usa el usuario postgres por defecto. Si tienes una contraseña diferente, actualízala en el archivo de configuración.

Credenciales por defecto:

    Usuario: postgres

    Contraseña: postgres (cámbiala si es diferente)

3.3. Ejecutar el script de creación de tablas

El script SQL para crear la base de datos y las tablas se encuentra en:
`backend/src/main/resources/db/citas_medicas.sql`

Ejecútalo en PostgreSQL (pgAdmin o terminal) para crear la base de datos `citas_medicas`.

4. Configurar el Backend (Spring Boot)
4.1. Configurar application.properties

Ve a backend/src/main/resources/application.properties y ajusta la contraseña de PostgreSQL:
properties

# Base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/citas_medicas
spring.datasource.username=postgres
spring.datasource.password=TU_CONTRASEÑA  # ← Cámbiala aquí

# Configuración de JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Puerto del servidor
server.port=8081

4.2. Ejecutar el backend

Desde IntelliJ:

    Abre el proyecto en IntelliJ.

    Ve a BackendApplication.java.

    Haz clic en el triángulo verde ▶️.

Desde la terminal:
bash

cd backend
./mvnw spring-boot:run

4.3. Verificar que el backend corre

Prueba el login en Postman:

    URL: POST http://localhost:8081/api/auth/login

    Body:

json

{
  "username": "admin",
  "password": "admin123"
}

5. Configurar el Frontend (React)
5.1. Crear el proyecto (si no existe)

Si el frontend no está en el repositorio:
bash

# 1. Ve a la carpeta raíz del proyecto
cd citas-medicas-backend

# 2. Crea la carpeta frontend
mkdir frontend
cd frontend

# 3. Crea el proyecto con Vite
npm create vite@latest . -- --template react

# 4. Instala dependencias
npm install
npm install axios react-router-dom

5.2. Configurar variables de entorno (opcional)

Crea un archivo .env en la raíz de frontend/:
env

VITE_API_URL=http://localhost:8081/api

5.3. Ejecutar el frontend
bash

cd frontend
npm run dev

El frontend estará en http://localhost:5173.
6. Ejecutar el sistema completo

    Backend: corriendo en http://localhost:8081

    Frontend: corriendo en http://localhost:5173

Login (desde el frontend):

    Usuario: admin

    Contraseña: admin123

📂 Estructura del repositorio
text

citas-medicas-backend/
├── backend/                 # Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Código fuente
│   │   │   └── resources/   # application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/                # React
│   ├── src/
│   │   ├── api/             # Configuración Axios
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore

🔐 Credenciales de prueba
Usuario	Contraseña	Rol
admin	admin123	ADMIN
editor	editor123	EDITOR
viewer	viewer123	VIEWER
🛠️ Solución de problemas comunes
Problema	Solución
Connection refused en backend	PostgreSQL no está corriendo o credenciales incorrectas.
401 Unauthorized	Token inválido o expirado. Haz login de nuevo.
403 Forbidden	El usuario no tiene permisos para ese endpoint.
Puerto 8081 en uso	Cambia server.port=8082 en application.properties.
Puerto 5173 en uso	Cambia el puerto en vite.config.js.
No se conecta al backend	Verifica VITE_API_URL en el frontend.
