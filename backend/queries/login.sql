
SELECT id_usuario, usuario, rol
FROM usuarios
WHERE usuario = $1 AND contrasena = $2;
