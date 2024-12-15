
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    recibe_ofertas BOOLEAN DEFAULT 0
);

CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(15),
    cargo VARCHAR(50)
);

CREATE TABLE supermercados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    ubicacion VARCHAR(255)
);

CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    ubicacion VARCHAR(255)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    oferta BOOLEAN DEFAULT 0
);

CREATE TABLE recetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    pasos TEXT,
    ingredientes TEXT
);

CREATE TABLE formulario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(15),
    peticion TEXT
);

CREATE TABLE contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    supermercado_id INT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supermercado_id) REFERENCES supermercados(id) ON DELETE SET NULL
);
