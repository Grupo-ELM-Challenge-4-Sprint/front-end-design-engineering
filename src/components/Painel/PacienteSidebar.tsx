import { NavLink } from 'react-router-dom';
import { useAuthCheck } from '../../hooks/useAuthCheck';

export default function PacienteSidebar() {
  const { usuarioApi, logout } = useAuthCheck();

  return (
    <aside className="paciente-sidebar"
      data-guide-step="10"
      data-guide-title="Navegação da Área do Usuário"
      data-guide-text="Use este menu para navegar entre as diferentes seções da sua área, como seus dados e tutoriais."
      data-guide-arrow="down">
      <div className="paciente-sidebar-header">
        <h3>Área do {usuarioApi?.tipoUsuario === 'CUIDADOR' ? 'Cuidador' : 'Paciente'}</h3>
      </div>
      <nav className="paciente-nav" aria-label="Navegação Área do Usuário">
        <ul>
          <li><NavLink to="/perfil"><span className="nav-icon">👤</span> Meus Dados </NavLink></li>
          <li><NavLink to="/receitas"><span className="nav-icon">💊</span> Receitas </NavLink></li>
          <li><NavLink to="/consultas"><span className="nav-icon">📅</span> Consultas </NavLink></li>
          <li><button onClick={logout} className="botao-logout"><span className="nav-icon">🚪</span>Sair</button></li>
        </ul>
      </nav>
    </aside>
  );
}