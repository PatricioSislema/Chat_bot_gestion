-- ============================================
-- BASE DE DATOS: citas_medicas
-- SISTEMA DE GESTIÓN DE CITAS MÉDICAS CON CHATBOT
-- ============================================

-- 1. CREAR LA BASE DE DATOS
CREATE DATABASE citas_medicas;

-- Conectarse a la base de datos
\c citas_medicas;

-- ============================================
-- TABLA: especialidades
-- ============================================
CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- ============================================
-- TABLA: doctores
-- ============================================
CREATE TABLE doctores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
    fecha_nacimiento DATE,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    foto VARCHAR(255),
    id_especialidad INTEGER NOT NULL,
    CONSTRAINT fk_doctor_especialidad FOREIGN KEY (id_especialidad)
        REFERENCES especialidades(id) ON DELETE RESTRICT
);

-- ============================================
-- TABLA: pacientes
-- ============================================
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    telegram_id VARCHAR(50) UNIQUE,
    foto VARCHAR(255),
    medicamento TEXT,
    alergias TEXT,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo'))
);

-- ============================================
-- TABLA: horarios
-- ============================================
CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_horario_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctores(id) ON DELETE CASCADE
);

-- ============================================
-- TABLA: citas
-- ============================================
CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    asunto VARCHAR(100) NOT NULL,
    motivo VARCHAR(255),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    sintomas TEXT,
    enfermedades TEXT,
    medicamentos TEXT,
    notas_adicionales TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Atendida', 'Cancelada')),
    id_paciente INTEGER NOT NULL,
    id_doctor INTEGER NOT NULL,
    id_horario INTEGER,
    CONSTRAINT fk_cita_paciente FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_cita_doctor FOREIGN KEY (id_doctor)
        REFERENCES doctores(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cita_horario FOREIGN KEY (id_horario)
        REFERENCES horarios(id) ON DELETE SET NULL
);

-- ============================================
-- TABLA: usuarios (para autenticación)
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Insertar especialidades
INSERT INTO especialidades (nombre) VALUES
('Cardiología'),
('Pediatría'),
('Dermatología'),
('Ginecología'),
('Oftalmología'),
('Ortopedia');

-- Insertar doctores
INSERT INTO doctores (nombre, apellido, sexo, fecha_nacimiento, direccion, telefono, id_especialidad) VALUES
('Ana', 'Pérez', 'F', '1980-05-15', 'Av. Principal 123', '0987654321', 1),
('Carlos', 'Gómez', 'M', '1975-08-20', 'Calle Secundaria 456', '0976543210', 2),
('María', 'López', 'F', '1985-03-10', 'Av. Central 789', '0965432109', 3);

-- Insertar pacientes
INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, sexo, direccion, telefono, email, telegram_id) VALUES
('Juan Carlos', 'Torres Bravo', '1990-02-14', 'M', 'Calle Libertad 456', '0998765432', 'juan.torres@email.com', '123456789'),
('María Elena', 'Vargas Rivera', '1985-06-20', 'F', 'Av. Amazonas 789', '0987654321', 'maria.vargas@email.com', '987654321');

-- Insertar usuarios (contraseña: admin123, editor123, viewer123)
INSERT INTO usuarios (username, password, rol) VALUES
('admin', '$2a$10$UJwvOsyKC6hh3AqhzJHoN.JuInjdpVaXUfMuARKIOIhiPhM7rah/2', 'ADMIN'),
('editor', '$2a$10$UJwvOsyKC6hh3AqhzJHoN.JuInjdpVaXUfMuARKIOIhiPhM7rah/2', 'EDITOR'),
('viewer', '$2a$10$UJwvOsyKC6hh3AqhzJHoN.JuInjdpVaXUfMuARKIOIhiPhM7rah/2', 'VIEWER');

-- Insertar horarios (próximos 7 días)
DO $$
DECLARE
    doctor_record RECORD;
    fecha_actual DATE := CURRENT_DATE;
    i INTEGER;
BEGIN
    FOR doctor_record IN SELECT id FROM doctores LOOP
        FOR i IN 0..6 LOOP
            INSERT INTO horarios (doctor_id, fecha, hora_inicio, hora_fin, disponible)
            VALUES (doctor_record.id, fecha_actual + i, '09:00:00', '09:30:00', TRUE);

            INSERT INTO horarios (doctor_id, fecha, hora_inicio, hora_fin, disponible)
            VALUES (doctor_record.id, fecha_actual + i, '09:30:00', '10:00:00', TRUE);

            INSERT INTO horarios (doctor_id, fecha, hora_inicio, hora_fin, disponible)
            VALUES (doctor_record.id, fecha_actual + i, '10:00:00', '10:30:00', TRUE);
        END LOOP;
    END LOOP;
END $$;

-- Insertar citas de ejemplo
INSERT INTO citas (asunto, motivo, fecha, hora, sintomas, estado, id_paciente, id_doctor) VALUES
('Consulta general', 'Dolor de cabeza persistente', CURRENT_DATE + 1, '09:00:00', 'Dolor de cabeza intenso', 'Confirmada', 1, 1),
('Chequeo pediátrico', 'Control de desarrollo', CURRENT_DATE + 2, '10:00:00', NULL, 'Pendiente', 2, 2);