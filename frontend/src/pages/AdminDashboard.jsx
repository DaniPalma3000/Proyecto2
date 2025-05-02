
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.rol !== 'admin') {
      alert('Acceso no autorizado');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <ul className="space-y-2">
        <li><a href="/empleados" className="text-blue-400 hover:underline">Gestión de Empleados</a></li>
        <li><a href="/reportes" className="text-blue-400 hover:underline">Reportes de Asistencia</a></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
