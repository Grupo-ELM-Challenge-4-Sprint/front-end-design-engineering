import { NavLink, useNavigate } from 'react-router-dom';

export default function PacienteSidebar() {

  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove os dados de autenticação do localStorage
    localStorage.removeItem('cpfLogado');

    // Redireciona para a página inicial
    navigate('/');
  };

  return (
    <aside className="paciente-sidebar"
      data-guide-step="10"
      data-guide-title="Navegação da Área do Usuário"
      data-guide-text="Use este menu para navegar entre as diferentes seções da sua área, como seus dados e tutoriais."
      data-guide-arrow="down">
      <div className="paciente-sidebar-header">
        <h3>Área do Usuário</h3>
      </div>
      <nav className="paciente-nav" aria-label="Navegação Área do Usuário">
        <ul>
          <li><NavLink to="/perfil"><span className="nav-icon">👤</span> Meus Dados </NavLink></li>
          <li><NavLink to="/tutoriais"><span className="nav-icon">📄</span> Tutoriais </NavLink></li>
          <li><NavLink to="/receitas"><span className="nav-icon">💊</span> Receitas </NavLink></li>
          <li><NavLink to="/consultas"><span className="nav-icon">📅</span> Consultas </NavLink></li>
          <li><button onClick={handleLogout} className="botao-logout"><span className="nav-icon">🚪</span>Sair</button></li>
        </ul>
      </nav>
    </aside>
  );
}


