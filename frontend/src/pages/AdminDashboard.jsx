import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaChartBar, FaBuilding } from 'react-icons/fa';
import { MdWork } from "react-icons/md";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.rol !== 'admin') {
      alert('Acceso no autorizado');
      navigate('/login');
    }
  }, [navigate]);

  const sections = [
    {
      name: 'Gestión de Empleados',
      icon: <FaUsers className="text-3xl text-blue-400" />,
      link: '/empleados',
    },
    {
      name: 'Reportes de Asistencia',
      icon: <FaChartBar className="text-3xl text-green-400" />,
      link: '/reportes',
    },
    {
      name: 'Gestión de Departamentos',
      icon: <FaBuilding className="text-3xl text-purple-400" />,
      link: '/departamentos',
    },
     {
      name: 'Gestión de Jornadas',
      icon: <MdWork className="text-3xl text-blue-400" />,
      link: '/jornadas',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <a
            key={index}
            href={section.link}
            className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 hover:scale-105 hover:bg-slate-700"
          >
            <div className="flex items-center gap-4">
              {section.icon}
              <span className="text-lg font-semibold">{section.name}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
