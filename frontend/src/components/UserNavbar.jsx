
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
        <Link to="/user" className="hover:text-blue-400 transition">
          Panel de usuario
        </Link></div>
      <div className="space-x-4">
        <Link to="/user" className="hover:underline">Inicio</Link>
        <Link to="/permisos" className="hover:underline">Solicitar permiso</Link>
        <button onClick={handleLogout} className="hover:underline text-red-400">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
