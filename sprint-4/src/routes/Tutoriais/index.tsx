import { Link } from "react-router-dom";
import { tutorials } from '../../data/tutoriais';
import TutorialCard from '../../components/TutorialCard/TutorialCard';
import '../../globals.css';

export default function Tutoriais(){
    return(
    <main>
        {/* Seção de introdução aos serviços  */}
        <section className="bg-[#e9f3fb] py-10 text-center md:text-[17px] lg:text-[20px]"
            data-guide-step="1"
            data-guide-title="Bem-vindo aos Tutoriais!"
            data-guide-text="Esta é a página de tutoriais onde você encontra guias para usar o Portal do Paciente HC."
            data-guide-arrow="up">
            <div className="container">
                <h2>Nossos Tutoriais</h2>
                <p>Diversos Tutoriais para te ajudar a utilizar o Portal do Paciente HC.</p>
            </div>
        </section>

        {/* Grid de Tutoriais principais usando componente ServiceCard */}
        <section className="py-5">
            <div className="py-2 mx-10 my-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                         data-guide-step="2"
                         data-guide-title="Lista de Tutoriais"
                         data-guide-text="Aqui estão todos os tutoriais disponíveis. Clique em um card para acessar o tutorial desejado."
                         data-guide-arrow="up">
                      {tutorials.map(item => (
                        <TutorialCard key={item.id} title={item.title} to={item.to} />
                      ))}
                    </div>
                  </div>
        </section>

        {/* botão para Acessar minha conta ou Contato  */}
        <section className="py-10 bg-indigo-100 text-center md:text-lg"
            data-guide-step="2"
            data-guide-title="Entre em contato"
            data-guide-text="Precisa de ajuda? Acesse sua conta ou fale conosco para mais informações."
            data-guide-arrow="up">
            <div className="container">
                <h2 className="text-[#1a237e] mb-2.5">Estamos aqui para cuidar de você</h2>
                <p className="md:text-[18px] mb-[25px] text-[#2d3748] mx-auto">Adicione lembrete para sua consulta hoje mesmo ou entre em contato para saber mais sobre nossos serviços.</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2.5 md:gap-4 max-w-3xl mx-auto">
                    <Link to="/perfil" className="btn btn-primary">Acessar minha conta</Link>
                    <Link to="/contato" className="btn btn-secondary">Fale conosco</Link>
                </div>
            </div>
        </section>
    </main>
)}
