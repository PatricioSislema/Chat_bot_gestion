// ============================================
// IMPORTACIONES
// ============================================
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Especialidades from './pages/Especialidades';
import Medicos from './pages/Medicos';
import Pacientes from './pages/Pacientes';
import Horarios from './pages/Horarios';
import Citas from './pages/Citas';
import Usuarios from './pages/Usuarios';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function App() {
  // ============================================
  // useNavigate: permite redirigir a otras páginas
  // ============================================
  const rol = localStorage.getItem('rol');

  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================
            RUTA: LOGIN (pública)
        ============================================ */}
        <Route path="/login" element={<Login />} />

        {/* ============================================
            RUTAS PROTEGIDAS (requieren autenticación)
            Cada ruta tiene:
            - Navbar (barra de navegación)
            - Su respectiva página
            - ProtectedRoute (verifica el token)
        ============================================ */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Especialidades */}
        <Route
          path="/especialidades"
          element={
            <ProtectedRoute>
              <Navbar />
              <Especialidades />
            </ProtectedRoute>
          }
        />

        {/* Médicos */}
        <Route
          path="/medicos"
          element={
            <ProtectedRoute>
              <Navbar />
              <Medicos />
            </ProtectedRoute>
          }
        />

        {/* Pacientes */}
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <Navbar />
              <Pacientes />
            </ProtectedRoute>
          }
        />

        {/* Horarios */}
        <Route
          path="/horarios"
          element={
            <ProtectedRoute>
              <Navbar />
              <Horarios />
            </ProtectedRoute>
          }
        />

        {/* Citas */}
        <Route
          path="/citas"
          element={
            <ProtectedRoute>
              <Navbar />
              <Citas />
            </ProtectedRoute>
          }
        />

        {/* Usuarios (solo visible para ADMIN) */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Navbar />
              <Usuarios />
            </ProtectedRoute>
          }
        />

        {/* ============================================
            RUTA POR DEFECTO: Redirige a /login
        ============================================ */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ============================================
            RUTA 404: Si la ruta no existe, redirige a login
        ============================================ */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

// ============================================
// EXPORTAR EL COMPONENTE
// ============================================
export default App;