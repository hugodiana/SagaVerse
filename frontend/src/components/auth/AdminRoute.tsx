import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>; // Ou um componente de spinner
  }

  // Se o usuário estiver logado e for um admin, renderiza o conteúdo da rota (Outlet)
  // Caso contrário, redireciona para a página inicial
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;