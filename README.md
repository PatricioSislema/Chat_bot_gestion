# 🏥 Sistema de Gestión de Citas Médicas con Chatbot

Sistema completo para la gestión de citas médicas con:

- **Backend:** Spring Boot (Java)
- **Frontend:** React (JavaScript)
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Contenedores:** Docker

---

## 📌 Tecnologías

| Tecnología | Versión |
|------------|---------|
| Spring Boot | 3.2.1 |
| React | 18+ |
| PostgreSQL | 15 |
| Docker | 20.10+ |

---

## 🚀 Ejecución con Docker (Recomendado)

### 1. Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

### 2. Clonar el repositorio

```bash
git clone https://github.com/PatricioSislema/Chat_bot_gestion.git
cd Chat_bot_gestion

3. Compilar el backend
bash

cd demo
.\mvnw clean package -DskipTests
cd ..

4. Levantar los contenedores
bash

docker compose up -d

5. Acceder al sistema

    Frontend: http://localhost:5173

    Backend: http://localhost:8081

6. Credenciales de prueba
Usuario	Contraseña	Rol
admin	admin123	ADMIN
editor	editor123	EDITOR
viewer	viewer123	VIEWER
🔧 Solución a problemas de conexión

Si al intentar login aparece error Network Error o 403:
Causa

El frontend dentro de Docker no puede comunicarse con el backend debido a la configuración de red o firewall.
Paso 1: Verificar que los contenedores estén corriendo
bash

docker compose ps

Debes ver:

    citas_db → Healthy

    citas_backend → Up

    citas_frontend → Up

Paso 2: Verificar que los usuarios existen en la base de datos
bash

docker exec -it citas_db psql -U postgres -d citas_medicas -c "SELECT username, rol FROM usuarios;"

Deben aparecer: admin, editor, viewer
Paso 3: Si los usuarios no existen, crearlos
bash

docker exec -it citas_db psql -U postgres -d citas_medicas

Dentro de PostgreSQL:
sql

INSERT INTO usuarios (username, password, rol) VALUES
('admin', '$2a$12$QmEoS8JepjrN0iFoFr2D2OPGfc6hiiMTMdXUNgx9dQNL8zjKeI2Mu', 'ADMIN'),
('editor', '$2a$12$fUm4a3Rqu5iP6Xqw1YlUpewV0dR7cy2gI5SsRRBavpjdKg7B226Lq', 'EDITOR'),
('viewer', '$2a$12$D.64Ak.nyWFzG92djz9aPe0NuipwpU4E/LkXpj5ZYmApFJxpdQLDa', 'VIEWER');

Paso 4: Probar el backend con CURL
bash

curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

Respuesta esperada:
json

{"username":"admin","password":null,"token":"...","rol":"ADMIN"}

Paso 5: Cambiar la IP en el frontend (si el login falla en el navegador)

Obtén tu IP local:
bash

ipconfig  # Windows
ifconfig  # Linux/Mac

Busca la IPv4 (ej: 192.168.0.101)

Edita el archivo:
bash

notepad frontend/src/api/axiosConfig.js

Cambia la URL:
javascript

const api = axios.create({
    baseURL: 'http://192.168.0.101:8081/api'  // Tu IP
});

Reconstruye el frontend:
bash

docker compose down
docker compose build --no-cache frontend
docker compose up -d

Paso 6: Firewall (si el error persiste)

Si el login funciona con CURL pero falla en el navegador, el firewall de Windows está bloqueando el puerto 8081.

Solución temporal: Desactivar el firewall y probar.

Solución permanente: Agregar una regla de entrada para el puerto 8081:

    Presiona Windows + R, escribe wf.msc

    Reglas de entrada → Nueva regla

    Puerto → TCP → 8081 → Permitir conexión

    Finalizar

📂 Estructura del repositorio
text

Chat_bot_gestion/
├── demo/                    # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Código fuente
│   │   │   └── resources/   # application.properties, SQL
│   │   └── test/
│   └── pom.xml
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── api/             # Configuración Axios
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md

📋 Verificación final
Backend
bash

curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

Frontend

    Abre http://localhost:5173

    Usa admin / admin123

    Debes ingresar al dashboard

🤝 Contribuciones

Proyecto desarrollado como parte del módulo de Aplicaciones Distribuidas.
Hector Sislema y Henry Bonilla


