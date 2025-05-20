
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Departamento from './pages/Departamentos';
import Navbar from './components/Navbar';
import FaceScanner from './components/FaceScanner';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Empleados from './pages/Empleados';
import Reportes from './pages/Reportes';

const App = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        {usuario && <Navbar />}
        <Routes>
          <Route path="/" element={<FaceScanner />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path='/departamentos' element={<Departamento />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
