
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';

(async () => {
  tf.env().set('WEBGL_CPU_FORWARD', false);
  tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', false);
  tf.env().set('WEBGL_VERSION', 0);
  tf.env().set('HAS_WEBGL', false);

  await tf.setBackend('cpu');
  await tf.ready();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
