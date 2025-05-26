import React, { useEffect, useState } from 'react';

const Jornadas = () => {
  const [jornadas, setJornadas] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEntrada, setEditEntrada] = useState('');
  const [editSalida, setEditSalida] = useState('');

  const fetchJornadas = () => {
    fetch('http://localhost:3000/api/jornadas')
      .then(res => res.json())
      .then(data => setJornadas(data))
      .catch(err => console.error('Error cargando jornadas:', err));
  };

  useEffect(() => {
    fetchJornadas();
  }, []);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoNombre || !horaEntrada || !horaSalida) return;

    fetch('http://localhost:3000/api/jornadas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, hora_entrada: horaEntrada, hora_salida: horaSalida })
    })
      .then(res => res.json())
      .then(() => {
        setNuevoNombre('');
        setHoraEntrada('');
        setHoraSalida('');
        fetchJornadas();
      })
      .catch(err => console.error('Error agregando jornada:', err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta jornada?')) return;

    fetch(`http://localhost:3000/api/jornadas/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchJornadas())
      .catch(err => console.error('Error eliminando jornada:', err));
  };

  const iniciarEdicion = (j) => {
    setEditandoId(j.id);
    setEditNombre(j.nombre);
    setEditEntrada(j.hora_entrada);
    setEditSalida(j.hora_salida);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditNombre('');
    setEditEntrada('');
    setEditSalida('');
  };

  const guardarEdicion = (id) => {
    fetch(`http://localhost:3000/api/jornadas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editNombre, hora_entrada: editEntrada, hora_salida: editSalida })
    })
      .then(() => {
        cancelarEdicion();
        fetchJornadas();
      })
      .catch(err => console.error('Error editando jornada:', err));
  };

  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Jornadas Laborales</h1>

      <form onSubmit={handleAgregar} className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre de jornada"
          className="p-2 rounded text-black"
        />
        <input
          type="time"
          value={horaEntrada}
          onChange={(e) => setHoraEntrada(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="time"
          value={horaSalida}
          onChange={(e) => setHoraSalida(e.target.value)}
          className="p-2 rounded text-black"
        />
        <button type="submit" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded">Agregar</button>
      </form>

      {jornadas.length === 0 ? (
        <p>No hay jornadas registradas.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-600">
          <thead className="bg-slate-800">
            <tr>
              <th className="border border-gray-600 p-2">ID</th>
              <th className="border border-gray-600 p-2">Nombre</th>
              <th className="border border-gray-600 p-2">Entrada</th>
              <th className="border border-gray-600 p-2">Salida</th>
              <th className="border border-gray-600 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {jornadas.map((j) => (
              <tr key={j.id} className="bg-slate-700 hover:bg-slate-600">
                <td className="border border-gray-600 p-2 text-center">{j.id}</td>
                <td className="border border-gray-600 p-2">
                  {editandoId === j.id ? (
                    <input
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="text-black p-1 rounded"
                    />
                  ) : (
                    j.nombre
                  )}
                </td>
                <td className="border border-gray-600 p-2">
                  {editandoId === j.id ? (
                    <input
                      type="time"
                      value={editEntrada}
                      onChange={(e) => setEditEntrada(e.target.value)}
                      className="text-black p-1 rounded"
                    />
                  ) : (
                    j.hora_entrada
                  )}
                </td>
                <td className="border border-gray-600 p-2">
                  {editandoId === j.id ? (
                    <input
                      type="time"
                      value={editSalida}
                      onChange={(e) => setEditSalida(e.target.value)}
                      className="text-black p-1 rounded"
                    />
                  ) : (
                    j.hora_salida
                  )}
                </td>
                <td className="border border-gray-600 p-2 text-center space-x-2">
                  {editandoId === j.id ? (
                    <>
                      <button
                        onClick={() => guardarEdicion(j.id)}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="bg-gray-500 hover:bg-gray-400 px-3 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => iniciarEdicion(j)}
                        className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(j.id)}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Jornadas;
