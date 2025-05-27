
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  //si no estamos logueados, no mostramos el navbar
  if (!usuario) return null;

  return (
    <nav className="bg-slate-800 p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">
        <Link to="/admin" className="hover:text-blue-400 transition">
          Panel de Administración
        </Link>
      </div>
      <div className="space-x-4">
        <Link to="/admin" className="hover:underline">Inicio</Link>
        <Link to="/empleados" className="hover:underline">Nuevo Empleado</Link>
        <Link to="/mantempleados" className="hover:underline">Mantenimiento Empleados</Link>
        <Link to="/reportes" className="hover:underline">Reportes</Link>
        <Link to="/departamentos" className="hover:underline">Departamentos</Link>
        <Link to="/jornadas" className="hover:underline">Jornadas</Link>
        <Link to="/permisosAdmin" className="hover:underline">Permisos</Link>
        <button onClick={handleLogout} className="hover:underline text-red-400">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
