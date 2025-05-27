import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';

const MantenimientoEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editEmpleado, setEditEmpleado] = useState({ nombre: '', departamento_id: '', jornada_id: '' });
  const [fotoNueva, setFotoNueva] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [jornadas, setJornadas] = useState([]);

  const fetchData = async () => {
    const [emps, deps, jors] = await Promise.all([
      fetch('/api/empleado').then(r => r.json()),
      fetch('/api/departamentos').then(r => r.json()),
      fetch('/api/jornadas').then(r => r.json())
    ]);
    setEmpleados(emps);
    setDepartamentos(deps);
    setJornadas(jors);
  };

  useEffect(() => { fetchData(); }, []);

  const iniciarEdicion = (emp) => {
    setEditandoId(emp.e_id);
    setEditEmpleado({ ...emp });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditEmpleado({ nombre: '', departamento_id: '', jornada_id: '' });
    setFotoNueva(null);
  };

  const guardarCambios = async () => {
    await fetch(`/api/empleado/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editEmpleado)
    });
    cancelarEdicion();
    fetchData();
  };

  const actualizarFoto = async () => {
    if (!fotoNueva) return;

    await tf.setBackend('cpu');
    await tf.ready();

    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    ]);

    const img = new Image();
    img.src = URL.createObjectURL(fotoNueva);
    await new Promise(resolve => img.onload = resolve);

    const detections = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceDescriptor();

    if (!detections || !detections.descriptor) {
      alert('No se detectó un rostro válido');
      return;
    }

    const descriptorArray = Array.from(detections.descriptor);

    await fetch(`/api/empleado/${editandoId}/descriptor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descriptor: descriptorArray })
    });

    setFotoNueva(null);
    fetchData();
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm('¿Eliminar este empleado?')) return;
    await fetch(`/api/empleado/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Mantenimiento de Empleados</h1>
      <table className="w-full border border-gray-600">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Departamento</th>
            <th className="p-2 border">Jornada</th>
            <th className="p-2 border">Actualizar Foto</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.e_id} className="bg-slate-700">
              <td className="border p-2">{emp.e_id}</td>
              <td className="border p-2">
                {editandoId === emp.e_id ? (
                  <input
                    value={editEmpleado.nombre}
                    onChange={(e) => setEditEmpleado({ ...editEmpleado, nombre: e.target.value })}
                    className="text-black rounded p-1"
                  />
                ) : emp.nombre}
              </td>
              <td className="border p-2">
                {editandoId === emp.e_id ? (
                  <select value={editEmpleado.departamento_id} onChange={(e) => setEditEmpleado({ ...editEmpleado, departamento_id: e.target.value })} className="text-black rounded">
                    {departamentos.map(d => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                ) : emp.departamento_nombre}
              </td>
              <td className="border p-2">
                {editandoId === emp.e_id ? (
                  <select value={editEmpleado.jornada_id} onChange={(e) => setEditEmpleado({ ...editEmpleado, jornada_id: e.target.value })} className="text-black rounded">
                    {jornadas.map(j => (
                      <option key={j.id} value={j.id}>{j.nombre}</option>
                    ))}
                  </select>
                ) : emp.jornada_nombre}
              </td>
              <td className="border p-2">
                {editandoId === emp.e_id && (
                  <div className="flex flex-col space-y-2">
                    <input type="file" accept="image/*" onChange={(e) => setFotoNueva(e.target.files[0])} className="text-sm text-white" />
                    <button onClick={actualizarFoto} className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600">Actualizar Foto</button>
                  </div>
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editandoId === emp.e_id ? (
                  <>
                    <button onClick={guardarCambios} className="bg-green-500 px-2 py-1 rounded">Guardar</button>
                    <button onClick={cancelarEdicion} className="bg-gray-500 px-2 py-1 rounded">Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicion(emp)} className="bg-yellow-500 px-2 py-1 rounded">Editar</button>
                    <button onClick={() => eliminarEmpleado(emp.e_id)} className="bg-red-500 px-2 py-1 rounded">Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MantenimientoEmpleados;
