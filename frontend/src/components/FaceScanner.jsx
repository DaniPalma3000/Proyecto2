import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';

tf.setBackend('cpu').then(() => {
});

const FaceScanner = () => {
  const videoRef = useRef(null);
  const lastRecognition = useRef({ e_id: '', timestamp: 0 });
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

  const loadDescriptors = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/descriptores');
      const data = await res.json();
      localStorage.removeItem('descriptores');

      // Guardar un mapa de e_id a nombre para mostrar luego
      const idToNombre = {};
      data.forEach((d) => {
        if (d && d.e_id && d.nombre) {
          idToNombre[String(d.e_id)] = d.nombre;
        }
      });

      // Guardar el mapa en una ref para accederlo en recognizeFace
      FaceScanner.idToNombreMap = idToNombre;

      return data
        .filter((d) => d && d.descriptor && d.descriptor.length === 128)
        .map((d) => {
          const descriptor = new Float32Array(d.descriptor);
          return new faceapi.LabeledFaceDescriptors(String(d.e_id), [descriptor]);
        });
    } catch (err) {
      console.error('Error al cargar descriptores desde la base:', err);
      return [];
    }
  };

  const recognizeFace = async (labeledDescriptors) => {
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;

      if (!video || !video.srcObject || video.readyState !== 4) return;
      if (!videoRef.current || !videoRef.current.srcObject) return;
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (
        detections &&
        detections.descriptor instanceof Float32Array &&
        detections.descriptor.length === 128
      ) {
        const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
        console.log('Mejor coincidencia:', bestMatch);
        const ahora = Date.now();
        if (
          bestMatch.label === lastRecognition.current.e_id &&
          ahora - lastRecognition.current.timestamp < 60000
        ) {
          return;
        }

        if (bestMatch.label !== 'unknown') {
          lastRecognition.current = { e_id: bestMatch.label, timestamp: ahora };

          // Obtener el nombre usando el mapa guardado
          const nombre = FaceScanner.idToNombreMap?.[bestMatch.label] || bestMatch.label;

          console.log('Empleado reconocido:', nombre);
          setMensaje(`✅ Empleado reconocido: ${nombre}`);

          enviarMarca(bestMatch.label);

          setTimeout(() => setMensaje(''), 3000);
        }
      }
    }, 3000);
  };

  const enviarMarca = async (e_id) => {
    const now = new Date();
    const payload = {
      e_id: Number(e_id),
      tipo_marca: 'auto',
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0],
    };
    console.log('Enviando marca:', payload);
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

  const intervalRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      await tf.setBackend('cpu');
      await tf.ready();
      console.log('TensorFlow backend listo:', tf.getBackend());

      await loadModels();
      await startVideo();

      const labeled = await loadDescriptors();
      if (labeled.length === 0) {
        setMensaje('⚠️ No hay datos registrados, por favor registre un rostro.');
      } else {
        recognizeFace(labeled);
      }
    };

    init();

    return () => {
      console.log('🧹 Limpiando FaceScanner');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="flex flex-col items-center space-y-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center">Escaneo Facial</h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full max-w-lg rounded shadow"
        />

        {mensaje && (
          <p className="text-green-400 text-lg font-semibold text-center">{mensaje}</p>
        )}

        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaceScanner;
