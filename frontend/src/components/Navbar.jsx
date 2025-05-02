
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">Panel de Administración</div>
      <div className="space-x-4">
        <Link to="/admin" className="hover:underline">Inicio</Link>
        <Link to="/empleados" className="hover:underline">Empleados</Link>
        <Link to="/reportes" className="hover:underline">Reportes</Link>
        <button onClick={handleLogout} className="hover:underline text-red-400">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
