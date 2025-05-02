import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceScanner = () => {
  const videoRef = useRef(null);
  const lastRecognition = useRef({ codigo: '', timestamp: 0 });
  const [mensaje, setMensaje] = useState('');

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
    }
  };

  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  };

  const loadDescriptors = () => {
    const data = JSON.parse(localStorage.getItem('descriptores')) || [];
    return data.map((d) => {
      const descriptor = new Float32Array(d.descriptor);
      return new faceapi.LabeledFaceDescriptors(d.codigo_empleado, [descriptor]);
    });
  };

  const recognizeFace = async (labeledDescriptors) => {
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        const bestMatch = faceMatcher.findBestMatch(detections.descriptor);

        const ahora = Date.now();
        if (
          bestMatch.label === lastRecognition.current.codigo &&
          ahora - lastRecognition.current.timestamp < 60000
        ) {
          return;
        }

        if (bestMatch.label !== 'unknown') {
          lastRecognition.current = { codigo: bestMatch.label, timestamp: ahora };

          console.log('Empleado reconocido:', bestMatch.label);
          setMensaje(`✅ Empleado reconocido: ${bestMatch.label}`);

          enviarMarca(bestMatch.label);

          setTimeout(() => setMensaje(''), 3000);
        }
      }
    }, 3000);
  };

  const enviarMarca = async (codigo) => {
    const now = new Date();
    const payload = {
      codigo_empleado: codigo,
      tipo_marca: 'auto',
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0],
    };

    try {
      const res = await fetch('http://localhost:3000/api/marcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      console.log('Marca registrada:', json);
    } catch (err) {
      console.error('Error al registrar marca:', err);
    }
  };

  useEffect(() => {
    loadModels().then(() => {
      startVideo();
      const labeled = loadDescriptors();
      if (labeled.length === 0) {
        setMensaje('⚠️ No hay datos registrados, por favor registre un rostro.');
      } else {
        recognizeFace(labeled);
      }
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Escaneo Facial</h2>
      <video ref={videoRef} autoPlay muted playsInline width="720" height="560" />
      {mensaje && <p className="mt-4 text-green-400 text-lg font-semibold">{mensaje}</p>}
    </div>
  );
};

export default FaceScanner;
