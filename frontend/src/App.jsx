import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Departamento from './pages/Departamentos';
import Navbar from './components/Navbar';
import FaceScanner from './components/FaceScanner';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Empleados from './pages/Empleados';
import Reportes from './pages/Reportes';
import UserDashboard from './pages/UserDashboard';
import Permisos from './pages/Permisos';

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/user', '/permisos'];
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {usuario && !hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<FaceScanner />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/departamentos" element={<Departamento />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/permisos" element={<Permisos />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
