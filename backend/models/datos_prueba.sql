
-- Departamentos y Jornadas
INSERT INTO departamento (nombre) VALUES ('Contabilidad'), ('RRHH'), ('Desarrollo');
INSERT INTO jornada (nombre, hora_entrada, hora_salida) VALUES
('Diurna', '08:00', '17:00'),
('Matutina', '07:00', '14:00'),
('Vespertina', '14:00', '20:00');

-- Usuario admin
INSERT INTO usuarios (usuario, contrasena, rol) VALUES
('admin', '1234', 'admin');
