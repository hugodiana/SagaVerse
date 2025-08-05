import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { FiLogIn, FiLogOut, FiUser, FiUserPlus, FiGrid } from 'react-icons/fi';

import SagaListPage from './pages/SagaListPage';
import SagaDetailPage from './pages/SagaDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import MyProfilePage from './pages/MyProfilePage';
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="App">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#333', 
            color: '#fff', 
            border: '1px solid #555' 
          } 
        }} 
      />
      <header className="App-header">
        <Link to="/" className="logo"><h1>SagaVerse</h1></Link>
        <nav className="main-nav">
          {user ? (
            <>
              <Link to="/profile" className="nav-button icon-button">
                <FiUser /> <span>Meu Perfil</span>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-button icon-button">
                  <FiGrid /> <span>Painel Admin</span>
                </Link>
              )}
              <button onClick={handleLogout} className="nav-button icon-button">
                <FiLogOut /> <span>Sair</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button icon-button">
                <FiLogIn /> <span>Entrar</span>
              </Link>
              <Link to="/register" className="nav-button primary icon-button">
                <FiUserPlus /> <span>Cadastrar</span>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<SagaListPage />} />
          <Route path="/saga/:sagaId" element={<SagaDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<MyProfilePage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;