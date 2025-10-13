import { Link } from "react-router-dom";

import '../../globals.css';
import { servicos } from '../../data/servicos';
import ServiceCard from '../../components/ServiceCard';

export default function Servicos(){
    return(
    <main>
        {/* Seção de introdução aos serviços  */}
        <section className="bg-[#e9f3fb] py-10 text-center md:text-[17px] lg:text-[20px]">
            <div className="container">
                <h2>Nossos Serviços</h2>
                <p>O Hospital das Clínicas oferece uma ampla gama de serviços de saúde com foco em qualidade, acessibilidade e experiência do paciente.</p>
            </div>
        </section>

        {/* Grid de serviços principais usando o novo componente ServiceCard */}
        <section className="py-5"
            data-guide-step="1"
            data-guide-title="Nossos Serviços"
            data-guide-text="Explore os principais serviços que o SimplesHC oferece para facilitar seu acesso à saúde."
            data-guide-arrow="up">
            <div className="container">
                <h2>Serviços em Destaque</h2>
                <div className="servicos-grid-pagina grid grid-cols-1 gap-6 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] md:gap-8">
                    {servicos.map((servico, index) => (
                        <ServiceCard key={servico.id} servico={servico} index={index} />
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
                <p className="md:text-[18px] mb-[25px] text-[#2d3748] mx-auto">Agende sua consulta hoje mesmo ou entre em contato para saber mais sobre nossos serviços.</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2.5 md:gap-4 max-w-3xl mx-auto">
                    <Link to="/perfil" className="btn btn-primary">Acessar minha conta</Link>
                    <Link to="/contato" className="btn btn-secondary">Fale conosco</Link>
                </div>
            </div>
        </section>
    </main>
)}
