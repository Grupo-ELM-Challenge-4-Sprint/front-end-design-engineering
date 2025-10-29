import { useState, useEffect } from 'react';
import PacientePage from '../../components/Painel/PacientePage';
import type { LembreteConsulta } from '../../hooks/useApiUsuarios';
import { useApiUsuarios } from '../../hooks/useApiUsuarios';
import { ConsultaCard } from '../../components/LembreteCard/LembreteCard';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useLembretes } from '../../hooks/useLembretes';

import Loading from '../../components/Loading/Loading';
// Certifique-se que essas funções existem e estão corretas em dateUtils.ts
import { formatLocalDateTimeForInput, formatISODateTimeLocal } from '../../utils/dateUtils';

export default function Consultas() {
    useAuthCheck();
    const { adicionarConsulta, atualizarConsulta, removerConsulta } = useApiUsuarios();
    // Renomeado 'lembretes' para 'lembretesConsultas' para clareza, vindo de useLembretes
    const { lembretesConsultas, loading, error, refreshLembretes, usuarioApi } = useLembretes();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLembrete, setEditingLembrete] = useState<LembreteConsulta | null>(null);

    // ## Ajuste 1: Estado do formulário usa dataHoraConsulta ##
    const [formData, setFormData] = useState<{
        tipoConsulta: 'Presencial' | 'Teleconsulta';
        especialidadeConsulta: string;
        medicoConsulta: string;
        dataHoraConsulta: string; // Campo único para datetime-local
        localConsulta: string;
        observacoesConsulta: string;
    }>({
        tipoConsulta: 'Presencial',
        especialidadeConsulta: '',
        medicoConsulta: '',
        dataHoraConsulta: '', // Inicializa vazio
        localConsulta: '',
        observacoesConsulta: '',
    });

    // ## Ajuste 2: useEffect usa formatLocalDateTimeForInput ##
    useEffect(() => {
        if (editingLembrete) {
            setFormData({
                tipoConsulta: editingLembrete.tipo,
                especialidadeConsulta: editingLembrete.especialidade,
                medicoConsulta: editingLembrete.medico,
                // Formata o LocalDateTime string do backend para o input datetime-local
                dataHoraConsulta: formatLocalDateTimeForInput(editingLembrete.hora),
                localConsulta: editingLembrete.local, // Usa o campo 'local' correto
                observacoesConsulta: editingLembrete.observacoes,
            });
        } else {
            // Resetar form
             const agora = new Date();
             // Formato YYYY-MM-DDTHH:mm exigido pelo input datetime-local
             const agoraFormatado = agora.toISOString().substring(0, 16);
            setFormData({
                tipoConsulta: 'Presencial',
                especialidadeConsulta: '',
                medicoConsulta: '',
                dataHoraConsulta: agoraFormatado, // Define um valor inicial válido
                localConsulta: '',
                observacoesConsulta: '',
            });
        }
    }, [editingLembrete]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };



    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioApi) return;

        // ## Ajuste 3: Usa formatISODateTimeLocal para enviar ao backend ##
        // Garante que a string está no formato YYYY-MM-DDTHH:mm:ss (ou o esperado pelo backend)
        const dataHoraBackend = formatISODateTimeLocal(formData.dataHoraConsulta);

        // ## Ajuste 4: Usa idUser do backend ##
        const usuarioId = usuarioApi.idUser;

        // ## Ajuste 5: Payload alinhado com a API (campo 'hora' recebe a string ISO) ##
        const consultaData = {
            especialidade: formData.especialidadeConsulta,
            medico: formData.medicoConsulta || 'Não especificado', // Mantém 'medico'
            data: dataHoraBackend.split('T')[0], // Extrai a data da string ISO
            hora: dataHoraBackend, // Campo 'hora' recebe a string combinada formatada
            tipo: formData.tipoConsulta,
            local: formData.localConsulta, // Mantém 'local'
            observacoes: formData.observacoesConsulta,
        };


        if (editingLembrete) {
            // ## Ajuste 6: Usa idConsulta ##
            await atualizarConsulta(editingLembrete.idConsulta, {
                ...consultaData,
                status: editingLembrete.status, // Preserva status
            });
        } else {
            await adicionarConsulta(usuarioId, {
                ...consultaData,
                status: 'Agendada',
            });
        }

        refreshLembretes();
        setIsModalOpen(false);
        setEditingLembrete(null);
    };

    // ## Ajuste 7: Funções de manipulação usam idConsulta ##
    const handleRemoveLembrete = async (id: number) => {
        await removerConsulta(id); // id aqui é idConsulta
        refreshLembretes();
    };

    const handleConcluirLembrete = async (id: number) => {
        await atualizarConsulta(id, { status: 'Concluída' }); // id aqui é idConsulta
        refreshLembretes();
    };

    const handleReverterLembrete = async (id: number) => {
        await atualizarConsulta(id, { status: 'Agendada' }); // id aqui é idConsulta
        refreshLembretes();
    };

    const handleOpenAddModal = () => {
        setEditingLembrete(null); // Reseta o formulário
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: LembreteConsulta) => {
        setEditingLembrete(lembrete); // Popula o formulário com dados existentes
        setIsModalOpen(true);
    };



    return (
        <PacientePage>
            <section className="py-2"
                data-guide-step="1"
                data-guide-title="Seus Lembretes de Consulta"
                data-guide-text="Adicione e gerencie seus lembretes de consulta para não esquecer de nenhum agendamento."
                data-guide-arrow="down">

                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-left">
                        Meus Lembretes de Consulta
                    </h1>
                    <button onClick={handleOpenAddModal}
                            className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer"
                            data-guide-step="2"
                            data-guide-title="Adicionar Consulta"
                            data-guide-text="Clique aqui para agendar uma nova consulta ou teleconsulta."
                            data-guide-arrow="up">
                        Adicionar Lembrete
                    </button>
                </div>

                <div id="lembretes-consultas-content" className="space-y-6">
                    <Loading loading={loading} message="Carregando lembretes de consultas..." />
                    {error && <p className="text-center text-red-600">Erro ao carregar lembretes: {error}</p>}
                    {/* ## Ajuste 8: Usa lembretesConsultas e idConsulta ## */}
                    {!loading && !error && lembretesConsultas.length > 0 ? (
                        lembretesConsultas.map((lembrete) => (
                            <ConsultaCard
                                key={lembrete.idConsulta} // Usa idConsulta como key
                                lembrete={lembrete}
                                handleOpenEditModal={handleOpenEditModal}
                                // Passa idConsulta para as funções handler
                                handleConcluirLembrete={() => handleConcluirLembrete(lembrete.idConsulta)}
                                handleReverterLembrete={() => handleReverterLembrete(lembrete.idConsulta)}
                                handleRemoveLembrete={() => handleRemoveLembrete(lembrete.idConsulta)}
                            />
                        ))
                    ) : (
                         !loading && !error && ( // Só mostra a mensagem se não estiver carregando e não houver erro
                            <div className=" border border-slate-200 rounded-xl p-6 shadow-sm text-center">
                                <p className="text-slate-600">Você não possui nenhum lembrete de consulta.</p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Modal de Adicionar/Editar Lembrete */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-start z-60 overflow-y-auto py-8" aria-labelledby="modalAgendarTitle">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative m-4">
                        <button type="button" className="absolute top-4 right-4 text-2xl font-semibold text-slate-500 hover:text-slate-800" aria-label="Fechar modal" onClick={() => setIsModalOpen(false)} >
                            &times;
                        </button>
                        <h3 id="modalAgendarTitle" className="text-2xl font-bold text-slate-900 mb-4">
                            {editingLembrete ? 'Alterar Lembrete' : 'Adicionar Lembrete'}
                        </h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* ... (campos tipoConsulta, especialidadeConsulta, medicoConsulta) ... */}
                             <div>
                                <label htmlFor="tipoConsulta" className="form-consultas">Tipo de Consulta*:</label>
                                <select id="tipoConsulta" name="tipoConsulta" value={formData.tipoConsulta} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
                                    <option value="Presencial">Presencial</option>
                                    <option value="Teleconsulta">Teleconsulta</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="especialidadeConsulta" className="form-consultas">Especialidade*:</label>
                                <input type="text" id="especialidadeConsulta" name="especialidadeConsulta" value={formData.especialidadeConsulta} onChange={handleInputChange} placeholder="Ex: Cardiologia" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="medicoConsulta" className="form-consultas">Médico (Opcional):</label>
                                <input type="text" id="medicoConsulta" name="medicoConsulta" value={formData.medicoConsulta} onChange={handleInputChange} placeholder="Nome do médico" className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>

                            {/* ## Ajuste 9: Input datetime-local usando dataHoraConsulta ## */}
                            <div>
                                <label htmlFor="dataHoraConsulta" className="form-consultas">Data e Hora*:</label>
                                <input type="datetime-local" id="dataHoraConsulta" name="dataHoraConsulta"
                                       value={formData.dataHoraConsulta} onChange={handleInputChange} required
                                       className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>

                             {/* ## Ajuste 10: Input localConsulta ## */}
                            <div>
                                <label htmlFor="localConsulta" className="form-consultas">Local/Link*:</label>
                                <input type="text" id="localConsulta" name="localConsulta" value={formData.localConsulta} onChange={handleInputChange} placeholder="Ex: Unidade Paulista ou link da sala" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>

                             {/* ... (campo observacoesConsulta e botões) ... */}
                             <div>
                                <label htmlFor="observacoesConsulta" className="form-consultas">Observações:</label>
                                <textarea id="observacoesConsulta" name="observacoesConsulta" value={formData.observacoesConsulta} onChange={handleInputChange} rows={3} placeholder="Ex: Trazer exames anteriores" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingLembrete(null); }} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PacientePage>
    );
}