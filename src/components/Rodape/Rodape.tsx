import { Link, NavLink } from "react-router-dom";

export default function Rodape() {

  return (
    <footer className="grid p-5 pb-4 bg-[#202670] w-full text-white gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-center md:text-left items-start">
            <div className="footer-column">
                <h3>SimplesHC</h3>
                <p>Simplificando o acesso à saúde para todos.</p>
                <div className="social-icons flex justify-center">
                    <Link to="https://www.youtube.com/user/RedeLucyMontoro" title="Youtube da Rede Lucy Montoro" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/475700/youtube-color.svg" alt="Ícone Youtube" className="w-7" /> </Link> 
                    <Link to="https://www.instagram.com/redelucymontoro/" title="Instagram da Rede Lucy Montoro" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/452229/instagram-1.svg" alt="Ícone Instagram" className="w-7"/> </Link>
                    <Link to="https://twitter.com/redelucymontoro" title="Twitter da Rede Lucy Montoro" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="Ícone Twitter" className="w-7" /></Link>
                </div>
            </div>
            <div className="footer-column">
                <h4>Navegação</h4>
                <ul className="grid">
                    <li><NavLink to={'/'} >Início</NavLink></li>
                    <li><NavLink to={'/hospitais'} >Hospitais</NavLink></li>
                    <li><NavLink to={'/tutoriais'} >Tutoriais</NavLink></li>
                    <li><NavLink to={'/integrantes'} >Integrantes</NavLink></li>
                    <li><NavLink to={'/faq'} >FAQ</NavLink></li>
                    <li><NavLink to={'/contato'} >Contato</NavLink></li>
                </ul>
                
            </div>
            <div className="footer-column">
                <h4>Serviços</h4>
                <ul className="grid">
                    <li><NavLink to={'/perfil'} >Área do Usuário</NavLink></li>
                    <li><NavLink to={'/receitas'} >Lembrete Receitas</NavLink></li>
                    <li><NavLink to={'/consultas'} >Lembrete Teleconsulta</NavLink></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Contato</h4>
                <p>HC Hospital das Clínicas</p>
                <p>Rua Dr. Ovídio Pires de Campos, 225</p>
                <p>São Paulo - SP</p>
                <p>CEP 05403-010</p>
                <p>Telefone: (11) 2661-0000</p>
                <p>Email: contato@simplify-hc.com.br</p>
            </div>
        <div className="text-center p-3 border-t border-solid border-t-[#2c3894] col-span-1 md:col-span-2 lg:col-span-4">
            <p>© 2025 SimplesHC. Todos os direitos reservados.</p>
        </div>
    </footer>
  );
}
