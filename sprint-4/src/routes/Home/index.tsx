import { Link } from 'react-router-dom';

export default function Home(){
    return(
    <main>
        {/* Seção principal de destaque (hero), apresenta o propósito do site e botões de ação rápida */}
        <section className="bg-[#e9f3fb] py-6 text-center"
                 data-guide-step="1" 
                 data-guide-title="Bem-vindo ao SimplesHC!" 
                 data-guide-text="Esta é a nossa seção principal, onde você encontra um resumo do nosso propósito e botões de acesso rápido."
                 data-guide-arrow="up">
            <div className="container flex flex-col md:flex-row items-center gap-[25px] px-8 py-10 md:text-[17px]">
                <div>
                    <h1 className='mb-5 text-4xl font-bold text-[#1a237e]'>Simplificando o acesso à saúde</h1>
                    <p className='mb-[25px] text-[#333]'>O SimplesHC torna mais fácil o acesso aos serviços do Hospital das Clínicas para todos os pacientes, especialmente para os idosos.</p>
                    <div className="flex flex-col md:flex-row gap-[12px] w-full items-center"
                         data-guide-step="2" 
                         data-guide-title="Ações Rápidas"
                         data-guide-text="Use estes botões para acessar sua área ou conhecer nossas unidades."
                         data-guide-arrow="down">
                        <Link to="/perfil" className="btn btn-primary">Acesse sua área de paciente</Link>
                        <Link to="/hospitais" className="btn btn-secondary">Conheça nossas unidades</Link>
                    </div>
                </div>
                <div className="mt-[10px] mx-auto w-full max-w-[400px] md:max-w-[500px]">
                    <img src="https://media.istockphoto.com/id/2169942837/pt/foto/female-doctor-working-on-laptop-in-the-office.jpg?s=612x612&w=0&k=20&c=kCXaecxqLqXsaTuG6xrbkcWEI7kFLSD3MvcyPeBDp10=" alt="Profissional de saúde utilizando um laptop em um ambiente moderno" className=' rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] mx-auto' />
                </div>
            </div>
        </section>

        {/* Seção de apresentação dos principais serviços oferecidos */}
        <section>
            <div className="container">
                <h2 className='text-center mt-3'>Nossos Serviços</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-[25px] gap-6">
                    <div className="service-card">
                        <img src="https://www.svgrepo.com/show/527687/document-add.svg" alt="ícone exames" />
                        <h3>Como Entrar no App HC</h3>
                        <p>Veja como instalar e acessar o App HC no seu celular e fazer login com segurança.</p>
                    </div>
                    <div className="service-card">
                        <img src="https://www.svgrepo.com/show/528080/calendar.svg" alt="ícone agendamento" />
                        <h3>Como Acessar os Serviços no App HC</h3>
                        <p>Aprenda a encontrar e utilizar os principais serviços do App HC de forma simples.</p>
                    </div>
                    <div className="service-card">
                        <img src="https://www.svgrepo.com/show/528785/videocamera.svg" alt="ícone teleconsulta" />
                        <h3>Como entrar na Teleconsulta no App HC</h3>
                        <p>Descubra como agendar e participar de uma teleconsulta pelo App HC, sem sair de casa.</p>
                    </div>
                </div>
                <Link to="/servicos" className="block text-center mt-[15px] font-bold text-[#007bff] text-[18px] hover:underline mb-5">Ver todos os serviços →</Link>
            </div>
        </section>

        {/* Seção dedicada ao recursos de acessibilidade */}
        <section >
            <div className="flex flex-col md:flex-row items-center gap-[20px] text-center bg-gray-100 md:text-[17px] lg:text-[20px]">
                <div className="mx-auto my-6">
                    <img src="https://static.vecteezy.com/ti/vetor-gratis/p1/37895316-masculino-segurando-seringa-e-chamando-para-paciente-em-video-ligar-vetor.jpg" alt="Guia interativo" className='w-full max-w-[400px] md:max-w-[500px] md:mx-5 rounded-lg shadow-lg ' />
                </div>
                <div className="guide-text md:mx-auto">
                    <h2 className='text-3xl mb-5 text-center mt-5 md:text-left'>Guia Interativo</h2>
                    <p className='text-[0.9em] mb-7 mx-5'>Nossa plataforma conta com um assistente que ajuda você a navegar pelo sistema, explicando cada função e recurso disponível.</p>
                    <div className="bg-white p-3 rounded-md border border-gray-300 mx-auto mb-5 text-left max-w-[90%] accessibility-features">
                        <h4 className='text-neutral-800 mb-2 font-bold text-lg'>Recursos de Acessibilidade</h4>
                        <ul className='list-disc pl-5'>
                            <li>Interface simplificada e responsiva, adaptada para celulares</li>
                            <li>Guia interativo para ajudar na navegação passo a passo</li>
                            <li>Textos diretos e linguagem acessível para usuários com pouca familiaridade digital</li>
                            <li>Botões e elementos visuais organizados de forma clara e intuitiva</li>
                        </ul>

                    </div>
                    <Link to="/faq" className="btn btn-primary mx-auto my-5">Ver perguntas frequentes</Link>
                </div>
            </div>
        </section>

        {/* Seção de depoimentos de pacientes */}
        <section className='p-10 md:p-5'>
            <div className="container">
                <h2 className='text-center'>O que dizem nossos pacientes</h2>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                    <div className="testimonial-card">
                        <div className="initials">RS</div>
                        <h4>Roberto Silva</h4>
                        <span>Paciente há 3 anos</span>
                        <p>"O SimplesHC tornou muito mais fácil acessar meus exames e agendar consultas. Não preciso mais ir ao hospital só para buscar resultados."</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="initials">AP</div>
                        <h4>Ana Paula</h4>
                        <span>Paciente há 1 ano</span>
                        <p>"A função de teleconsulta é excelente para minha mãe idosa, que tem dificuldade de locomoção. Agora ela consegue falar com o médico sem sair de casa."</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="initials">JO</div>
                        <h4>João Oliveira</h4>
                        <span>Paciente há 2 anos</span>
                        <p>"O guia interativo me ajudou muito a entender como usar o sistema. Mesmo não tendo muita experiência com tecnologia, consegui aprender rapidamente."</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    );
}