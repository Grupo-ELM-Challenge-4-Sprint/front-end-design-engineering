import { Link } from "react-router-dom";
import fotoEnzo from '/img/imagens-integrantes/foto-enzo.jpeg';
import fotoLucas from '/img/imagens-integrantes/foto-lucas.jpg';
import fotoMilton from '/img/imagens-integrantes/foto-milton.jpeg';

export default function Integrantes(){
    return(
    <main>
        {/* Seção de apresentação da equipe  */}
        <section className="bg-[#e9f3fb] py-10 text-center md:text-[17px] lg:text-[20px]">
            <div className="container">
                <h2>Nossa Equipe</h2>
                <p>Conheça os desenvolvedores responsáveis pelo projeto SimplesHC.</p>
            </div>
        </section>

        {/* Cards dos integrantes, com foto, nome, RM, turma e redes sociais  */}
        <section id="membros-equipe">
            <div className="container">
                <div className="equipe-grid">
                    {/* Card Integrante 1  */}
                    <div className="integrante-card">
                        <img src={fotoEnzo} alt="Foto do Integrante 1" className="integrante-foto"/>
                        <div className="integrante-info">
                            <h3>Enzo Okuizumi</h3>
                            <p className="integrante-rm">RM: 561432</p>
                            <p className="integrante-turma">Turma: 1TDSPG</p>
                            <div className="integrante-redes">
                                <Link to="https://www.linkedin.com/in/enzo-okuizumi-b60292256/" aria-label="Linkedin Enzo Okuizumi" title="Linkedin Enzo Okuizumi" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/452047/linkedin-1.svg" alt="LinkedIn"/></Link>
                                <Link to="https://github.com/EnzoOkuizumiFiap" aria-label="GitHub Enzo Okuizumi" title="Github Enzo Okuizumi" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub"/></Link>
                            </div>
                        </div>
                    </div>

                    {/* Card Integrante 2  */}
                    <div className="integrante-card">
                        <img src={fotoLucas} alt="Foto do Integrante 2" className="integrante-foto"/>
                        <div className="integrante-info">
                            <h3>Lucas Barros Gouveia</h3>
                            <p className="integrante-rm">RM: 566422</p>
                            <p className="integrante-turma">Turma: 1TDSPG</p>
                            <div className="integrante-redes">
                                <Link to="https://www.linkedin.com/in/luz-barros-gouveia-09b147355/" aria-label="Linkedin Lucas Barros Gouveia" title="Linkedin Lucas Barros Gouveia" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/452047/linkedin-1.svg" alt="LinkedIn"/></Link>
                                <Link to="https://github.com/LuzBGouveia" aria-label="GitHub Lucas Barros Gouveia" title="GitHub Lucas Barros Gouveia" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub"/></Link>
                            </div>
                        </div>
                    </div>

                    {/* Card Integrante 3  */}
                    <div className="integrante-card">
                        <img src={fotoMilton} alt="Foto do Integrante 3" className="integrante-foto"/>
                        <div className="integrante-info">
                            <h3>Milton Marcelino</h3>
                            <p className="integrante-rm">RM: 564836</p>
                            <p className="integrante-turma">Turma: 1TDSPG</p>
                            <div className="integrante-redes">
                                <Link to="http://linkedin.com/in/milton-marcelino-250298142" aria-label="Linkedin Milton Marcelino" title="Linkedin Milton Marcelino" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/452047/linkedin-1.svg" alt="Linkedin"/></Link>
                                <Link to="https://github.com/MiltonMarcelino" aria-label="GitHub Milton Marcelino" title="GitHub Milton Marcelino" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub"/></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Seção sobre o projeto, explicando objetivos, tecnologias e impacto social  */}
        <section className="py-[30px] bg-[#f9fafb]">
            <div className="container">
                <div className="sobre-projeto-content">
                    <h2 className="text-left mb-[20px] text-[#1a237e]">Sobre o Projeto</h2>
                    <p>O <Link to="https://github.com/Grupo-ELM-Challenge-3-Sprint/front-end-design-engineering" target="_blank" rel="noopener" className="text-blue-600 hover:underline">SimplesHC</Link> (Link do Repositório GitHub) é uma plataforma web desenvolvida como parte da disciplina de Front-End Design Engineering. Seu principal objetivo é oferecer uma interface digital intuitiva e acessível para os serviços do Hospital das Clínicas, com foco especial em pacientes idosos ou com baixa familiaridade com tecnologia.</p>
                    <p>A solução busca simplificar processos como agendamento de consultas, acesso a resultados de exames, visualização de receitas médicas e participação em teleconsultas. Tudo isso é feito com base em uma abordagem centrada no usuário, prezando por clareza, simplicidade e inclusão digital.</p>
                    <p>Utilizando React + tailwindcss 4, o projeto entrega uma experiência leve, responsiva e funcional, incluindo recursos como um guia interativo, um FAQ prático e suporte visual pensado para usuários com necessidades diversas.</p>
                    <p>Mais do que uma atividade acadêmica, o SimplesHC tem como missão promover impacto social real, facilitando o acesso à saúde digital e contribuindo para a redução do absenteísmo em consultas via teleconsulta no Hospital HC.</p>
                </div>
            </div>
        </section>
    </main>
    );
}