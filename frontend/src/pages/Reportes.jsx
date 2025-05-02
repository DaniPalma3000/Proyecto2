
import React, { useState } from 'react';

const Reportes = () => {
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [reporte, setReporte] = useState([]);

  const obtenerReporte = async () => {
    if (!inicio || !fin) {
      alert('Debe seleccionar ambas fechas');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/reportes/asistencia?inicio=${inicio}&fin=${fin}`);
      const data = await res.json();
      setReporte(data);
    } catch (err) {
      console.error('Error al obtener reporte:', err);
      alert('No se pudo obtener el reporte');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reporte de Asistencia</h2>
      <div className="flex gap-4 mb-4">
        <div>
          <label>Desde:</label>
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label>Hasta:</label>
          <input
            type="date"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button onClick={obtenerReporte} className="bg-blue-600 text-white px-4 py-2 rounded h-fit mt-5">
          Generar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Empleado</th>
              <th className="px-4 py-2">Depto</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Entrada</th>
              <th className="px-4 py-2">Salida</th>
              <th className="px-4 py-2">Tarde (min)</th>
              <th className="px-4 py-2">Temprano (min)</th>
            </tr>
          </thead>
          <tbody>
            {reporte.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{r.codigo_empleado}</td>
                <td className="px-4 py-2">{r.nombre_empleado}</td>
                <td className="px-4 py-2">{r.departamento}</td>
                <td className="px-4 py-2">{r.fecha}</td>
                <td className="px-4 py-2">{r.hora_entrada || '--'}</td>
                <td className="px-4 py-2">{r.hora_salida || '--'}</td>
                <td className="px-4 py-2">{r.minutos_tarde}</td>
                <td className="px-4 py-2">{r.minutos_temprano}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
