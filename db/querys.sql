CREATE DATABASE bancosolar;

\c bancosolar;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    balance INT NOT NULL CHECK (balance >= 0),
    estado BOOLEAN NOT NULL
);

CREATE TABLE transferencias(
    id SERIAL PRIMARY KEY,
    emisor INT REFERENCES usuarios(id),
    receptor INT REFERENCES usuarios(id),
    monto INT NOT NULL,
    fecha TIMESTAMP
);
