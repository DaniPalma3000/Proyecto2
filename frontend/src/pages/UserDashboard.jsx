import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar } from 'react-icons/fa';
import UserNavbar from '../components/UserNavbar';


const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.rol !== 'user') {
      alert('Acceso no autorizado');
      navigate('/login');
    } else {
      setUserName(usuario.nombre || usuario.name || 'Usuario');
    }
  }, [navigate]);

  const sections = [
    {
      name: 'Solicitar Permiso',
      icon: <FaChartBar className="text-3xl text-green-400" />,
      link: '/permisos',
    },
  ];

  return (
    <>
      <UserNavbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Panel de usuario</h1>
        <div className="mb-6 text-center text-white">
          <p className="text-xl font-medium">
            Hola, <span className="text-green-400 font-bold">{userName}</span>
          </p>
        </div>

        {/* New flex container: left department + right button */}
        <div className="mb-8 flex justify-start items-center gap-x-4">
  {/* Left side */}
  <div className="text-white flex flex-col mr-4">
    <p className="font-semibold mb-1">Departamento</p>
    <div className="w-48 h-10 border border-gray-600 rounded-md bg-slate-700"></div>
  </div>

  {/* Right side: the button */}
  <a
    href={sections[0].link}
    className="bg-slate-800 p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-300 hover:scale-105 hover:bg-slate-700 flex items-center gap-3"
  >
    {sections[0].icon}
    <span className="text-lg font-semibold text-white">{sections[0].name}</span>
  </a>
</div>

      </div>
    </>
  );
};

export default UserDashboard;
