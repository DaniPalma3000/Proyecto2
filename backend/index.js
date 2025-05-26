
const express = require('express');
const cors = require('cors');
const app = express();

const attendanceRoutes = require('./routes/attendance');
const loginRoutes = require('./routes/login');
const reportRoutes = require('./routes/reportes');
const empleadoRoutes = require('./routes/empleado');
const departamentosRoutes = require('./routes/departamentos');
const usuarioRoutes = require('./routes/usuario');
const permisosRoutes = require('./routes/permisos');
const jornadasRoutes = require('./routes/jornadas');

app.use(cors());
app.use(express.json());

app.use('/api', attendanceRoutes);
app.use('/api', loginRoutes);
app.use('/api', reportRoutes);
app.use('/api', empleadoRoutes);
app.use('/api', departamentosRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/jornadas', jornadasRoutes);

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});
