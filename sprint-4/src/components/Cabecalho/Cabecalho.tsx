import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../../hooks/useAuth';
import imagemLogo from '/img/imagem-index/imagem-logo.jpeg';

export default function Cabecalho() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, handleLogout } = useAuth();
    const location = useLocation();

    const userAreaPaths = ['/perfil', '/tutoriais', '/receitas', '/consultas'];
    const isUserArea = userAreaPaths.includes(location.pathname);

    // Fecha o menu automaticamente quando a rota muda
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
    <header className="bg-white py-2.5 border-b border-[#eee] relative z-10">
        <div className="w-[90%] flex justify-between items-center relative m-5">
            <Link to="/" className="font-bold flex items-center">
                <img src={imagemLogo} alt="Logo SimplesHC" className="w-24 h-auto mr-2" />
                <span className="text-2xl text-[#005c99]">SimplesHC</span>
            </Link>

            <button className="hidden max-[951px]:block" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}>
                <img src="https://www.svgrepo.com/show/510067/menu.svg" alt="Menu" className="w-10" />
            </button>
            <nav className={`
                    ${menuOpen ? "block" : "hidden"}
                    min-[951px]:flex min-[951px]:items-center min-[951px]:gap-4 min-[951px]:text-xl
                    max-[951px]:absolute max-[951px]:top-full max-[951px]:left-0 max-[951px]:w-full max-[951px]:bg-white max-[951px]:shadow-md max-[951px]:py-5
                `}>
                <ul className="menu-list flex flex-col items-center w-full min-[951px]:flex-row min-[951px]:w-auto">
                    <li><NavLink to={'/'} className="linksHeader">Início</NavLink></li>
                    <li><NavLink to={'/hospitais'} className="linksHeader">Hospitais</NavLink></li>
                    <li><NavLink to={'/servicos'} className="linksHeader">Serviços</NavLink></li>
                    <li><NavLink to={'/integrantes'} className="linksHeader">Integrantes</NavLink></li>
                    <li><NavLink to={'/faq'} className="linksHeader">FAQ</NavLink></li>
                    <li><NavLink to={'/contato'} className="linksHeader">Contato</NavLink></li>
                    <li>
                        {isLoggedIn && isUserArea ? (
                            <button onClick={handleLogout} className="botao-sair">Sair</button>
                        ) : (
                            <NavLink to={'/perfil'} className="botao-entrar">Entrar</NavLink>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}
