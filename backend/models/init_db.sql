
CREATE TABLE departamento (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE jornada (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  hora_entrada TIME,
  hora_salida TIME
);

CREATE TABLE empleado (
  e_id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) UNIQUE,
  nombre VARCHAR(100),
  jornada_id INTEGER REFERENCES jornada(id),
  departamento_id INTEGER REFERENCES departamento(id)
);

CREATE TABLE permisos (
  id SERIAL PRIMARY KEY,
  empleado_id INTEGER REFERENCES empleado(e_id),
  fecha DATE,
  motivo VARCHAR(300),
  tipo VARCHAR(100)
);

CREATE TABLE marcas (
  id SERIAL PRIMARY KEY,
  empleado_id INTEGER REFERENCES empleado(e_id),
  tipo_marca VARCHAR(10),
  fecha DATE,
  hora TIME
);

CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  usuario VARCHAR(100) UNIQUE,
  contrasena VARCHAR(100),
  rol VARCHAR(50)
);
