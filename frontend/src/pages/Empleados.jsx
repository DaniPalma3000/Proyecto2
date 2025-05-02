import React, { useState } from 'react';
import * as faceapi from 'face-api.js';

const Empleados = () => {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [foto, setFoto] = useState(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
  };

  const handleGuardar = async () => {
    if (!foto || !nombre || !codigo) {
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
        body: JSON.stringify({ codigo, nombre }),
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
    setFoto(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registrar Empleado</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Código"
          className="border p-2 w-full text-black"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 w-full text-black"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFotoChange} />
        <button
          onClick={handleGuardar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar Empleado
        </button>
      </div>
    </div>
  );
};

export default Empleados;
