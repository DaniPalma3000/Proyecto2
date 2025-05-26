import React, { useState } from 'react';

const Reportes = () => {
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const obtenerReporte = async () => {
    if (!inicio || !fin) {
      setError('Debe seleccionar ambas fechas');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/reportes/asistencia?inicio=${inicio}&fin=${fin}`);
      if (!res.ok) throw new Error('No se pudo obtener el reporte');
      const data = await res.json();
      setReporte(data);
    } catch (err) {
      console.error('Error al obtener reporte:', err);
      setError('No se pudo obtener el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la hora a HH:mm
  const formatearHora = (hora) => {
    if (!hora) return '--';
    return hora.slice(0, 5);
  };

  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Reporte de Asistencia</h2>

      {error && <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>}

      <div className="flex items-end gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray">Desde:</label>
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="p-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray">Hasta:</label>
          <input
            type="date"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            className="p-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <button
          onClick={obtenerReporte}
          className="bg-blue-600 text-white text-sm px-3 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Generando...' : 'Generar'}
        </button>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full text-sm text-left border border-gray-600">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Empleado</th>
              <th className="px-6 py-3">Depto</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Entrada</th>
              <th className="px-6 py-3">Salida</th>
              <th className="px-6 py-3">Tarde (min)</th>
              <th className="px-6 py-3">Temprano (min)</th>
            </tr>
          </thead>
          <tbody>
            {reporte.length > 0 ? (
              reporte.map((r, i) => (
                <tr key={i} className={`border-t ${i % 2 === 0 ? 'bg-slate-700' : 'bg-slate-800'}`}>
                  <td className="px-6 py-3">{r.codigo_empleado}</td>
                  <td className="px-6 py-3">{r.nombre_empleado}</td>
                  <td className="px-6 py-3">{r.departamento}</td>
                  <td className="px-6 py-3">{r.fecha}</td>
                  <td className="px-6 py-3">{formatearHora(r.hora_entrada)}</td>
                  <td className="px-6 py-3">{formatearHora(r.hora_salida)}</td>
                  <td className="px-6 py-3">{r.minutos_tarde}</td>
                  <td className="px-6 py-3">{r.minutos_temprano}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-3 text-center">No hay datos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
