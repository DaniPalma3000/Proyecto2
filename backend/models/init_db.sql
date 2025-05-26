
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
  nombre VARCHAR(100) NOT NULL,
  jornada_id INTEGER REFERENCES jornada(id),
  departamento_id INTEGER REFERENCES departamento(id),
  descriptor JSONB
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
  tipo_marca CHAR(1) CHECK (tipo_marca IN ('E', 'S')),
  fecha DATE,
  hora TIME
);

CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  usuario VARCHAR(100) UNIQUE,
  contrasena VARCHAR(100),
  rol VARCHAR(50)
);

CREATE OR REPLACE FUNCTION insertar_marca(codigo_emp INTEGER)
RETURNS CHAR AS $$
DECLARE
  emp_id INT;
  j_id INT;
  h_entrada TIME;
  h_salida TIME;
  ya_tiene_entrada BOOLEAN;
  ya_tiene_salida BOOLEAN;
  tipo CHAR(1);
  ahora TIME := CURRENT_TIME;
BEGIN
  SELECT e_id, jornada_id INTO emp_id, j_id
  FROM empleado
  WHERE e_id = codigo_emp;

  IF emp_id IS NULL THEN
    RAISE EXCEPTION 'Empleado no encontrado con código: %', codigo_emp;
  END IF;

  SELECT hora_entrada, hora_salida INTO h_entrada, h_salida
  FROM jornada
  WHERE id = j_id;

  IF h_entrada IS NULL OR h_salida IS NULL THEN
    RAISE EXCEPTION 'Jornada no definida correctamente para el empleado %', emp_id;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM marcas
    WHERE empleado_id = emp_id AND tipo_marca = 'E' AND fecha = CURRENT_DATE
  ) INTO ya_tiene_entrada;

  SELECT EXISTS (
    SELECT 1 FROM marcas
    WHERE empleado_id = emp_id AND tipo_marca = 'S' AND fecha = CURRENT_DATE
  ) INTO ya_tiene_salida;

  IF NOT ya_tiene_entrada AND ahora <= (h_entrada + ((h_salida - h_entrada) / 2)) THEN
    tipo := 'E';
  ELSIF NOT ya_tiene_salida AND ahora > (h_entrada + ((h_salida - h_entrada) / 2)) THEN
    tipo := 'S';
  ELSE
    RAISE NOTICE 'Ya tiene ambas marcas hoy o está fuera de rango';
    RETURN NULL;
  END IF;

  INSERT INTO marcas (empleado_id, tipo_marca, fecha, hora)
  VALUES (emp_id, tipo, CURRENT_DATE, CURRENT_TIME);

  RETURN tipo;
END;
$$ LANGUAGE plpgsql;