import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Empleados = () => {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [rol, setRol] = useState('');
  const [foto, setFoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/departamentos');
        const data = await res.json();
        setDepartamentos(data);
      } catch (err) {
        console.error('Error cargando departamentos:', err);
      }
    };
    fetchDepartamentos();
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
  };

const handleGuardar = async () => {
  if (!foto || !nombre || !codigo || !departamento || !rol) {
    alert('Complete todos los campos y suba una foto.');
    return;
  }

  try {
    await tf.setBackend('cpu');
    await tf.ready();

    const MODEL_URL = '/models';

    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    ]);
    console.log('✅ Modelos cargados correctamente');

    const img = new Image();
    img.src = URL.createObjectURL(foto);
    await new Promise((resolve) => { img.onload = resolve; });
    console.log("📷 Foto cargada:", foto);

    const detections = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceDescriptor();

    if (
      !detections ||
      !detections.descriptor ||
      !(detections.descriptor instanceof Float32Array)
    ) {
      alert('⚠️ No se detectó un rostro válido en la imagen.');
      return;
    }

    const descriptorArray = Array.from(detections.descriptor);
    console.log('🧪 Descriptor generado:', descriptorArray);

    const res = await fetch('/api/empleado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo,
        nombre,
        departamento: parseInt(departamento),
        rol,
        descriptor: descriptorArray
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert('❌ Error registrando empleado: ' + (data.error || 'Error desconocido'));
      return;
    }

    alert('✅ Empleado registrado correctamente');
    setNombre('');
    setCodigo('');
    setDepartamento('');
    setRol('');
    setFoto(null);
  } catch (error) {
    console.error('❌ Error en handleGuardar:', error);
    alert('Hubo un error inesperado. Ver consola.');
  }
};


  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
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
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
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
