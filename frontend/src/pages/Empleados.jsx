import React, { useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Empleados = () => {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [rol, setRol] = useState('');
  const [foto, setFoto] = useState(null);
  const navigate = useNavigate();

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
  };

  const handleGuardar = async () => {
    if (!foto || !nombre || !codigo || !departamento || !rol) {
      alert('Complete todos los campos y suba una foto.');
      return;
    }

    const MODEL_URL = '/models';
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

    const img = await faceapi.bufferToImage(foto);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert('No se detectó ningún rostro.');
      return;
    }

    const nuevoDescriptor = {
      codigo_empleado: codigo,
      nombre_empleado: nombre,
      departamento,
      rol,
      descriptor: Array.from(detections.descriptor),
    };

    const descriptoresActuales =
      JSON.parse(localStorage.getItem('descriptores')) || [];
    descriptoresActuales.push(nuevoDescriptor);
    localStorage.setItem('descriptores', JSON.stringify(descriptoresActuales));

    try {
      const res = await fetch('http://localhost:3000/api/empleado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, nombre, departamento, rol }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('⚠️ Empleado registrado localmente, pero no en la base: ' + (error.error || 'Error'));
      } else {
        alert('Empleado registrado con éxito y guardado en la base de datos.');
      }
    } catch (err) {
      alert('⚠️ Registro facial guardado, pero no se pudo conectar al backend.');
      console.error(err);
    }

    setNombre('');
    setCodigo('');
    setDepartamento('');
    setRol('');
    setFoto(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-4 left-4 flex items-center text-white hover:text-gray-300 transition"
      >
        <ArrowLeft className="mr-2" /> Volver
      </button>

      <div className="flex justify-center items-center h-screen">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Registrar Empleado</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Código"
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Departamento"
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
            />
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <button
              onClick={handleGuardar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-bold transition transform hover:scale-105"
            >
              Guardar Empleado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
