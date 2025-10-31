import { Link } from "react-router-dom";
import { useContatoForm } from "../../hooks";

export default function Contato() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isSubmitSuccessful,
    onSubmit,
  } = useContatoForm();

    return (
        <main>
            <section className="bg-[#e9f3fb] py-10 text-center md:text-[17px] lg:text-[20px]"
                data-guide-step="1"
                data-guide-title="Fale Conosco"
                data-guide-text="Bem-vindo à nossa página de Contato. Utilize as opções abaixo para nos enviar sua mensagem ou encontrar outras formas de nos contatar."
                data-guide-arrow="down">
                <div className="container">
                    <h2>Entre em Contato</h2>
                    <p>Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais breve possível.</p>
                </div>
            </section>

            {/* Seção principal com formulário de contato e informações institucionais */}
            <section className="py-10">
                <div className="container flex flex-col gap-[30px] md:flex-row">
                    <div className="p-[25px] rounded-lg border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex-[2]"
                        data-guide-step="2"
                        data-guide-title="Formulário de Contato"
                        data-guide-text="Para nos enviar uma mensagem diretamente, por favor, preencha os campos deste formulário. Campos com (*) são de preenchimento obrigatório."
                        data-guide-arrow="down">
                            
                        {/* Formulário de contato com validação e mensagens de erro */}
                        <form id="formContato" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="form-group-contato">
                                <label htmlFor="nomeCompleto">Nome Completo*</label>
                                <input type="text" id="nomeCompleto" placeholder="Seu nome completo"
                                {...register("nomeCompleto", { required: "Informe seu nome completo" })}
                                className={errors.nomeCompleto ? "invalid" : ""}/>
                                <small className="error-message">{errors.nomeCompleto?.message}</small>
                            </div>

                            <div className="form-group-contato">
                                <label htmlFor="email">Email*</label>
                                <input type="email" id="email" placeholder="seu.email@exemplo.com"
                                
                                {...register("email", {
                                    required: "Informe seu e-mail",
                                    pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "E-mail inválido",
                                    },
                                })}
                                className={errors.email ? "invalid" : ""}/>
                                <small className="error-message">{errors.email?.message}</small>
                            </div>

                            <div className="form-group-contato">
                                <label htmlFor="telefone">Telefone</label>
                                <input type="tel" id="telefone" placeholder="(99) 99999-9999"
                                {...register("telefone")}/>
                            </div>
                            
                            <div className="form-group-contato">
                                <label htmlFor="assunto">Assunto*</label>
                                <select id="assunto"
                                {...register("assunto", { required: "Selecione um assunto" })}
                                className={errors.assunto ? "invalid" : ""} defaultValue="">
                                <option value="" disabled>Selecione um assunto</option>
                                <option value="duvida">Dúvida</option>
                                <option value="sugestao">Sugestão</option>
                                <option value="problema_tecnico">Problema Técnico</option>
                                <option value="agendamento">Agendamento</option>
                                <option value="outro">Outro</option>
                                </select>
                                <small className="error-message">{errors.assunto?.message}</small>
                            </div>
                            <div className="form-group-contato">
                                <label htmlFor="mensagem">Mensagem*</label>
                                <textarea id="mensagem" placeholder="Descreva sua mensagem aqui..."
                                {...register("mensagem", { required: "Digite sua mensagem" })}
                                className={errors.mensagem ? "invalid" : ""}/>
                                <small className="error-message">{errors.mensagem?.message}</small>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary  w-full p-[12px] px-[20px] text-[1em] mb-5"
                                disabled={isSubmitting}>
                                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                            </button>
                        </form>
                        {/* Área para feedback do status do envio do formulário */}
                        <div id="formStatus" className="mt-[15px] p-[10px] rounded-[5px] text-[0.9em] text-center" aria-live="polite">
                            {isSubmitSuccessful && <span className="success bg-[#d4edda] text-[#155724] border border-[#c3e6cb] p-5 rounded">Mensagem enviada com sucesso!</span>}
                        </div>
                    </div>
                    {/* Informações institucionais e de contato ao lado do formulário */}
                    <aside className="info-contato-container"
                        data-guide-step="3"
                        data-guide-title="Outras Formas de Contato"
                        data-guide-text="Além do formulário, você pode nos encontrar através dos seguintes canais."
                        data-guide-arrow="down">

                        <h3 className="text-[#1a237e] md:text-2xl mb-[20px] pb-[10px] border-b border-gray-300 font-bold">Informações de Contato</h3>
                        <div className="info-bloco">
                            <h4>Endereço</h4>
                            <p>Hospital das Clínicas da FMUSP<br />
                            Rua Dr. Ovídio Pires de Campos, 225<br />
                            Cerqueira César - São Paulo/SP<br />
                            CEP 05403-010</p>
                        </div>
                        <div className="info-bloco">
                            <h4>Telefones</h4>
                            <p>Central de Atendimento: (11) 2661-0000</p>
                        </div>
                        <div className="info-bloco">
                            <h4>Email</h4>
                            <p><Link to="mailto:contato@simplify-hc.com.br" className="text-[#007bff] no-underline hover:underline">contato@simplify-hc.com.br</Link></p>
                        </div>
                        <div className="info-bloco">
                            <h4>Horário de Atendimento</h4>
                            <p>Segunda a Sexta: 8h às 18h</p>
                            <p>Sábado: 8h às 12h</p>
                        </div>
                        <div className="info-bloco">
                            <h4>Redes Sociais</h4>
                            <div className="info-redes-sociais flex gap-2.5 mt-2">
                                <Link to="https://www.youtube.com/user/RedeLucyMontoro" title="Youtube da Rede Lucy Montoro" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/475700/youtube-color.svg" alt="Ícone Youtube" className="w-7" /></Link>
                                <Link to="https://www.instagram.com/redelucymontoro/" title="Instagram da Rede Lucy Montoro" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/452229/instagram-1.svg" alt="Ícone Instagram" className="w-7" /></Link>
                                <Link to="https://twitter.com/redelucymontoro" title="Twitter da Rede Lucy Montoro" target="_blank" rel="noopener"><img src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="Ícone Twitter" className="w-7" /></Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}