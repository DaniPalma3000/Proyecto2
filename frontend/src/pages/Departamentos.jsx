import React, { useEffect, useState } from 'react';

const Departamentos = () => {
  // Estados para manejar departamentos, empleados, selección y nuevo nombre
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');

  // Obtener la lista de departamentos desde el backend
  const fetchDepartamentos = () => {
    fetch('http://localhost:3000/api/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error('Error loading departments:', err));
  };

  // Cargar departamentos al iniciar el componente
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  // Manejar click en un departamento para mostrar/ocultar sus empleados
  const handleDeptClick = (id) => {
    if (selectedDeptId === id) {
      setSelectedDeptId(null);
      setEmpleados([]);
      return;
    }

    setSelectedDeptId(id);
    // Obtener empleados del departamento seleccionado
    fetch(`http://localhost:3000/api/departamentos/${id}/empleados`)
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error('Error loading employees:', err));
  };

  // Agregar un nuevo departamento
  const handleAgregarDepartamento = (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    fetch('http://localhost:3000/api/departamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre })
    })
      .then(res => res.json())
      .then(() => {
        setNuevoNombre('');
        fetchDepartamentos();
      })
      .catch(err => console.error('Error adding department:', err));
  };

  // Eliminar un departamento existente
  const handleEliminarDepartamento = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este departamento?')) return;

    fetch(`http://localhost:3000/api/departamentos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        if (selectedDeptId === id) {
          setSelectedDeptId(null);
          setEmpleados([]);
        }
        fetchDepartamentos();
      })
      .catch(err => console.error('Error deleting department:', err));
  };


  //UI
  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Departamentos</h1>

      {/* Formulario para agregar un nuevo departamento */}
      <form onSubmit={handleAgregarDepartamento} className="mb-6">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nuevo departamento"
          className="p-2 rounded text-black mr-2"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
        >
          Agregar
        </button>
      </form>

      {/* Tabla de departamentos */}
      {departamentos.length === 0 ? (
        <p>No hay departamentos registrados.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-600 mb-6">
          <thead>
            <tr className="bg-slate-800">
              <th className="border border-gray-600 p-2">ID</th>
              <th className="border border-gray-600 p-2">Nombre</th>
              <th className="border border-gray-600 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.map((d) => (
              <React.Fragment key={d.id}>
                <tr
                  className="bg-slate-700 hover:bg-slate-600 cursor-pointer"
                >
                  <td
                    className="border border-gray-600 p-2 text-center"
                    onClick={() => handleDeptClick(d.id)}
                  >
                    {d.id}
                  </td>
                  <td
                    className="border border-gray-600 p-2"
                    onClick={() => handleDeptClick(d.id)}
                  >
                    {d.nombre}
                  </td>
                  <td className="border border-gray-600 p-2 text-center">
                    <button
                      onClick={() => handleEliminarDepartamento(d.id)}
                      className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
                {/* Mostrar empleados del departamento seleccionado */}
                {selectedDeptId === d.id && (
                  <tr className="bg-slate-800">
                    <td colSpan="3" className="border border-gray-600 p-4">
                      <h2 className="text-lg font-semibold mb-2">
                        Empleados del departamento
                      </h2>
                      {empleados.length === 0 ? (
                        <p>No hay empleados registrados en este departamento.</p>
                      ) : (
                        <ul className="list-disc pl-6">
                          {empleados.map((e) => (
                            <li key={e.e_id}>
                              {e.nombre} (Código: {e.codigo})
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Departamentos;
