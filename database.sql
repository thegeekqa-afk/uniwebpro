-- UniwebPro Database Script
-- Database: u785806933_uniweb

CREATE DATABASE IF NOT EXISTS u785806933_uniweb;
USE u785806933_uniweb;

-- Table: Carreras
CREATE TABLE IF NOT EXISTS carreras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    facultad VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_semestres INT NOT NULL,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo)
) ENGINE=InnoDB;

-- Table: Materias
CREATE TABLE IF NOT EXISTS materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    creditos INT NOT NULL,
    semestre INT NOT NULL,
    descripcion TEXT,
    carrera_id INT NOT NULL,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE CASCADE,
    INDEX idx_codigo (codigo),
    INDEX idx_carrera (carrera_id)
) ENGINE=InnoDB;

-- Table: Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    fecha_nacimiento DATE,
    direccion TEXT,
    carrera_id INT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id),
    INDEX idx_documento (numero_documento),
    INDEX idx_carrera (carrera_id)
) ENGINE=InnoDB;

-- Sample Data
INSERT INTO carreras (nombre, codigo, facultad, descripcion, duracion_semestres, estado) VALUES
('Ingeniería de Sistemas', 'IS101', 'Facultad de Ingeniería', 'Carrera enfocada en el desarrollo de software, redes y gestión de TI.', 10, 'activa'),
('Administración de Empresas', 'ADM303', 'Ciencias Económicas', 'Formación en gestión, finanzas y dirección de organizaciones.', 10, 'activa'),
('Derecho', 'DER202', 'Ciencias Jurídicas', 'Estudio de las leyes y el sistema judicial.', 10, 'activa'),
('Psicología', 'PSI505', 'Facultad de Humanidades', 'Estudio del comportamiento humano y procesos mentales.', 10, 'activa');

INSERT INTO materias (nombre, codigo, creditos, semestre, descripcion, carrera_id, estado) VALUES
('Cálculo Diferencial', 'MAT101', 5, 1, 'Fundamentos de cálculo para ingeniería.', 1, 'activa'),
('Programación I', 'PROG101', 4, 1, 'Introducción a la lógica de programación.', 1, 'activa'),
('Contabilidad General', 'CON101', 4, 1, 'Principios básicos de contabilidad.', 2, 'activa'),
('Derecho Romano', 'DER101', 3, 1, 'Historia y bases del derecho civil.', 3, 'activa'),
('Introducción a la Psicología', 'PSI101', 4, 1, 'Conceptos básicos de la mente humana.', 4, 'activa');

INSERT INTO estudiantes (nombres, apellidos, tipo_documento, numero_documento, correo, telefono, fecha_nacimiento, direccion, carrera_id, estado) VALUES
('Juan', 'Pérez', 'DNI', '12345678', 'juan.perez@example.com', '987654321', '2002-05-15', 'Calle Falsa 123', 1, 'activo'),
('María', 'García', 'DNI', '87654321', 'maria.garcia@example.com', '912345678', '2001-10-20', 'Av. Siempre Viva 742', 2, 'activo'),
('Carlos', 'López', 'DNI', '11223344', 'carlos.lopez@example.com', '955443322', '2003-01-10', 'Jr. Los Olivos 456', 1, 'activo');
