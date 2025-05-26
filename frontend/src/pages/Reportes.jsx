import React, { useState, useEffect } from 'react';

const Reportes = () => {
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [filtroEmpleado, setFiltroEmpleado] = useState('');
  const [filtroJornada, setFiltroJornada] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/empleados')
      .then(res => res.json())
      .then(data => setEmpleados(data));
    fetch('http://localhost:3000/api/jornadas')
      .then(res => res.json())
      .then(data => setJornadas(data));
  }, []);

  const obtenerReporte = async () => {
    if (!inicio || !fin) {
      setError('Debe seleccionar ambas fechas');
      return;
    }

    setError('');
    setLoading(true);

    const queryParams = new URLSearchParams({ inicio, fin });
    if (filtroEmpleado) queryParams.append('empleado', filtroEmpleado);
    if (filtroJornada) queryParams.append('jornada', filtroJornada);

    try {
      const res = await fetch(`http://localhost:3000/api/reportes/asistencia?${queryParams.toString()}`);
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

  const formatearHora = (hora) => {
    if (!hora) return '--';
    return hora.slice(0, 5);
  };

  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Reporte de Asistencia</h2>

      {error && <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>}

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Desde:</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="p-2 rounded text-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Hasta:</label>
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="p-2 rounded text-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Empleado:</label>
          <select value={filtroEmpleado} onChange={(e) => setFiltroEmpleado(e.target.value)} className="p-2 rounded text-black">
            <option value="">Todos</option>
            {empleados.map(emp => (
              <option key={emp.e_id} value={emp.e_id}>{emp.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Jornada:</label>
          <select value={filtroJornada} onChange={(e) => setFiltroJornada(e.target.value)} className="p-2 rounded text-black">
            <option value="">Todas</option>
            {jornadas.map(j => (
              <option key={j.id} value={j.id}>{j.nombre}</option>
            ))}
          </select>
        </div>
        <button onClick={obtenerReporte} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'Cargando...' : 'Generar'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-600">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Empleado</th>
              <th className="px-4 py-2">Departamento</th>
              <th className="px-4 py-2">Jornada</th>
              {/* <th className="px-4 py-2">Horario</th> */}
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Entrada</th>
              <th className="px-4 py-2">Salida</th>
              <th className="px-4 py-2">Tarde</th>
              <th className="px-4 py-2">Temprano</th>
            </tr>
          </thead>
          <tbody>
            {reporte.length > 0 ? (
              reporte.map((r, i) => (
                <tr key={i} className={`border-t ${i % 2 === 0 ? 'bg-slate-700' : 'bg-slate-800'}`}>
                  <td className="px-4 py-2">{r.codigo_empleado}</td>
                  <td className="px-4 py-2">{r.nombre_empleado}</td>
                  <td className="px-4 py-2">{r.departamento}</td>
                  <td className="px-4 py-2">{r.jornada}</td>
                  {/* <td className="px-4 py-2">{formatearHora(r.hora_entrada)} - {formatearHora(r.hora_salida)}</td> */}
                  <td className="px-4 py-2">{r.fecha}</td>
                  <td className="px-4 py-2">{formatearHora(r.hora_entrada)}</td>
                  <td className="px-4 py-2">{formatearHora(r.hora_salida)}</td>
                  <td className="px-4 py-2">{r.minutos_tarde}</td>
                  <td className="px-4 py-2">{r.minutos_temprano}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-2 text-center">No hay datos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
