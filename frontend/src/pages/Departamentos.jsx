import React, { useEffect, useState } from 'react';

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error loading departments:', err));
  }, []);

  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Departamentos</h1>

      {departamentos.length === 0 ? (
        <p>No hay departamentos registrados.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-600">
          <thead>
            <tr className="bg-slate-800">
              <th className="border border-gray-600 p-2">ID</th>
              <th className="border border-gray-600 p-2">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.map((d) => (
              <tr key={d.id} className="bg-slate-700 hover:bg-slate-600 cursor-default">
                <td className="border border-gray-600 p-2 text-center">{d.id}</td>
                <td className="border border-gray-600 p-2">{d.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Departamentos;