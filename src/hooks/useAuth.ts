import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cpfLogado = localStorage.getItem('cpfLogado');
    setIsLoggedIn(!!cpfLogado);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cpfLogado');
    localStorage.removeItem('usuarioApi');
    localStorage.removeItem('tipoUsuario');
    setIsLoggedIn(false);
    navigate('/entrar');
  };

  const checkAuth = () => {
    const cpfLogado = localStorage.getItem('cpfLogado');
    if (!cpfLogado) {
      navigate('/entrar');
    }
  };

  return { isLoggedIn, handleLogout, checkAuth };
};