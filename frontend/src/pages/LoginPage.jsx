import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Icono

const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Acceso concedido');
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/admin');
      } else {
        alert(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900 text-white relative">
      {/* Back arrow */}
    <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center text-white hover:text-gray-300"
          >
            <ArrowLeft className="mr-2" /> Volver
          </button>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded shadow-md w-96 space-y-4 text-center">
        <img src="/galileo.svg" alt="Logo Galileo" className="h-20 mx-auto mb-2" />
        <h2 className="text-xl font-bold">Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          className="w-full p-2 rounded text-black"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 rounded text-black"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
