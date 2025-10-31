import { useState } from "react";
import { Link } from "react-router-dom";
import { faqData } from "../../data/faq";

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <main>
            <section className="bg-[#e9f3fb] py-10 text-center md:text-[17px] lg:text-[20px]"
                data-guide-step="1"
                data-guide-title="Perguntas Frequentes"
                data-guide-text="Bem-vindo à nossa seção de Perguntas Frequentes! Aqui você pode encontrar respostas rápidas para as dúvidas mais comuns."
                data-guide-arrow="down">
                <div className="container">
                    <h2>Perguntas Frequentes</h2>
                    <p>Encontre respostas para as dúvidas mais comuns sobre o SimplesHC.</p>
                </div>
            </section>

            {/*Seção de perguntas e respostas em formato de acordeão*/}
            <section className="py-9"
                data-guide-step="2"
                data-guide-title="Como Usar o FAQ"
                data-guide-text="Clique em uma pergunta para expandir e ver a resposta. O ícone ao lado indica se a resposta está visível."
                data-guide-arrow="up">
                <div className="container">
                    <div className="max-w-[800px] mx-auto border border-gray-200 rounded-lg overflow-hidden md:text-[18px]">
                        {faqData.map((faq, indice) => (
                            <div className="border-b border-gray-200" key={faq.id}>
                                <button
                                    className="faq-question text-[#1a237e] cursor-pointer text-[1.05em] p-5 w-full text-left flex justify-between items-center font-semibold hover:bg-[#eff1f7] focus:bg-[#eff1f7] focus:outline-none duration-200"
                                    type="button"
                                    aria-expanded={openIndex === indice}
                                    aria-controls={`faq-answer-${faq.id}`}
                                    onClick={() => setOpenIndex(openIndex === indice ? null : indice)}
                                >
                                    <span>{faq.question}</span>
                                    <span className={`transition-transform duration-300 ease-in-out ml-[10px] w-[12px] h-[12px] border-r-2 border-b-2 border-[#007bff] inline-block ${
                                        openIndex === indice
                                            ? "translate-y-[2px] -rotate-[135deg]"
                                            : "-translate-y-[2px] rotate-45"}`}>
                                    </span>
                                </button>
                                <div className={`px-5 bg-white overflow-hidden transition-all duration-300 ease-in-out
                                        ${openIndex === indice
                                            ? "max-h-[500px] pt-4 pb-4 opacity-100 pointer-events-auto"
                                            : "max-h-0 pt-0 pb-0 opacity-0 pointer-events-none"}`}>
                                    <p className="py-5">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center my-10 md:text-[18px]">
                        <p>Não encontrou o que procurava?</p>
                        <Link to="/contato" className="btn btn-primary mx-auto my-5">Entre em contato conosco</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
