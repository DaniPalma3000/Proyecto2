import React, { useState, useEffect } from 'react';
import UserNavbar from '../components/UserNavbar';

const Permisos = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoIdSeleccionado, setEmpleadoIdSeleccionado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/empleados');
        if (!res.ok) throw new Error('Error al cargar empleados');
        const data = await res.json();
        setEmpleados(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los empleados');
      }
    };

    fetchEmpleados();
  }, []);

  const solicitarPermiso = async () => {
    if (!motivo || !fecha || !tipo || !empleadoIdSeleccionado) {
      setError('Debe completar todos los campos');
      return;
    }

    try {
      setError('');
      setMensaje('');

      const res = await fetch('http://localhost:3000/api/permisos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, fecha, tipo, empleado_id: parseInt(empleadoIdSeleccionado) }),
      });

      if (!res.ok) throw new Error('Error al solicitar permiso');

      const nuevoPermiso = await res.json();
      setPermisos([...permisos, nuevoPermiso]);
      setMotivo('');
      setFecha('');
      setTipo('');
      setMensaje('Permiso solicitado con éxito');
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar la solicitud');
    }
  };

  const obtenerPermisos = async () => {
    try {
      setError('');
      if (!empleadoIdSeleccionado) {
        setError('Seleccione un empleado');
        return;
      }

      const res = await fetch(`http://localhost:3000/api/permisos?empleado_id=${parseInt(empleadoIdSeleccionado)}`);
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

        {/* Select Empleado */}
        <div className="mb-4">
          <label className="block text-white mb-2">Seleccione Empleado</label>
          <select
            value={empleadoIdSeleccionado}
            onChange={(e) => setEmpleadoIdSeleccionado(e.target.value)}
            className="p-2 border rounded-lg shadow-sm text-sm text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            {empleados.map((emp) => (
              <option key={emp.e_id} value={emp.e_id}>
                {emp.nombre} (ID: {emp.e_id})
              </option>
            ))}
          </select>
        </div>

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
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="p-2 border rounded-lg shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione tipo</option>
              <option value="Personal">Personal</option>
              <option value="Médico">Médico</option>
              <option value="Vacaciones">Vacaciones</option>
              <option value="Otros">Otros</option>
            </select>
            <button
              onClick={solicitarPermiso}
              className="bg-blue-600 text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Enviar solicitud
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permisos;
