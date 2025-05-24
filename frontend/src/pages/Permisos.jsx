import React, { useState } from 'react';
import UserNavbar from '../components/UserNavbar';

const UserDashboard = () => {
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const solicitarPermiso = async () => {
    if (!motivo || !fecha) {
      setError('Debe completar todos los campos');
      return;
    }

    try {
      setError('');
      setMensaje('');

      const res = await fetch('http://localhost:3000/api/permisos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, fecha }),
      });

      if (!res.ok) throw new Error('Error al solicitar permiso');

      const nuevoPermiso = await res.json();
      setPermisos([...permisos, nuevoPermiso]);
      setMotivo('');
      setFecha('');
      setMensaje('Permiso solicitado con éxito');
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar la solicitud');
    }
  };

  const obtenerPermisos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/permisos');
      if (!res.ok) throw new Error('Error al obtener permisos');
      const data = await res.json();
      setPermisos(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron obtener los permisos');
    }
  };

  return (
    <>
     <UserNavbar />
    <div className="p-6">

      {mensaje && <div className="bg-green-500 text-white p-3 mb-4 rounded">{mensaje}</div>}
      {error && <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>}

      {/* Solicitar Permiso */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Solicitar Permiso</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="p-2 border rounded-lg shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="p-2 border rounded-lg shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={solicitarPermiso}
            className="bg-blue-600 text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar solicitud
          </button>
        </div>
      </div>

      {/* Ver Permisos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Mis Permisos</h3>
          <button
            onClick={obtenerPermisos}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Cargar Permisos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-300">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Motivo</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {permisos.length > 0 ? (
                permisos.map((permiso, i) => (
                  <tr key={i} className={`border-t ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-6 py-3">{permiso.fecha}</td>
                    <td className="px-6 py-3">{permiso.motivo}</td>
                    <td className="px-6 py-3">{permiso.estado || 'Pendiente'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-center">No hay permisos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserDashboard;
