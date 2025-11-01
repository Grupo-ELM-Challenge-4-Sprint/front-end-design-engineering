import { useState, useEffect } from 'react';
import PacientePage from '../../components/Painel/PacientePage';
import type { LembreteConsulta } from '../../hooks/useApiUsuarios';
import { useApiUsuarios } from '../../hooks/useApiUsuarios';
import { ConsultaCard } from '../../components/LembreteCard/LembreteCard';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useLembretes } from '../../hooks/useLembretes';
import { useUser } from '../../hooks/useUser';
import Loading from '../../components/Loading/Loading';

export default function Consultas() {
    useAuthCheck();
    const { adicionarConsulta, atualizarConsulta, removerConsulta } = useApiUsuarios();
    const { lembretesConsultas: lembretes, loading, error, refreshLembretes, paciente } = useLembretes();
    const { usuarioApi } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLembrete, setEditingLembrete] = useState<LembreteConsulta | null>(null);

    const [formData, setFormData] = useState<{
        tipoConsulta: 'Presencial' | 'Teleconsulta';
        especialidadeConsulta: string;
        medicoConsulta: string;
        dataConsulta: string;
        localConsulta: string;
        observacoesConsulta: string;
    }>({
        tipoConsulta: 'Presencial',
        especialidadeConsulta: '',
        medicoConsulta: '',
        dataConsulta: '',
        localConsulta: '',
        observacoesConsulta: '',
    });

    useEffect(() => {
        if (editingLembrete) {
            setFormData({
                tipoConsulta: editingLembrete.tipo,
                especialidadeConsulta: editingLembrete.especialidade,
                medicoConsulta: editingLembrete.medico,
                dataConsulta: `${editingLembrete.data}T${editingLembrete.hora}`,
                localConsulta: editingLembrete.local,
                observacoesConsulta: editingLembrete.observacoes,
            });
        } else {
            setFormData({
                tipoConsulta: 'Presencial',
                especialidadeConsulta: '',
                medicoConsulta: '',
                dataConsulta: '',
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
        const [data, hora] = formData.dataConsulta.split('T');
        const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.id : usuarioApi.id;

        if (editingLembrete) {
            await atualizarConsulta(editingLembrete.id, {
                especialidade: formData.especialidadeConsulta,
                medico: formData.medicoConsulta || 'Não especificado',
                data,
                hora,
                tipo: formData.tipoConsulta as 'Presencial' | 'Teleconsulta',
                local: formData.localConsulta,
                observacoes: formData.observacoesConsulta,
                status: editingLembrete.status,
            });
        } else {
            await adicionarConsulta(usuarioId, {
                especialidade: formData.especialidadeConsulta,
                medico: formData.medicoConsulta || 'Não especificado',
                data,
                hora,
                tipo: formData.tipoConsulta as 'Presencial' | 'Teleconsulta',
                local: formData.localConsulta,
                observacoes: formData.observacoesConsulta,
                status: 'Agendada',
            });
        }

        // Recarregar lembretes
        refreshLembretes();

        setIsModalOpen(false);
        setEditingLembrete(null);
    };

    const handleRemoveLembrete = async (id: number) => {
        await removerConsulta(id);
        refreshLembretes();
    };

    const handleConcluirLembrete = async (id: number) => {
        await atualizarConsulta(id, { status: 'Concluída' });
        refreshLembretes();
    };

    const handleReverterLembrete = async (id: number) => {
        await atualizarConsulta(id, { status: 'Agendada' });
        refreshLembretes();
    };

    const handleOpenAddModal = () => {
        setEditingLembrete(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: LembreteConsulta) => {
        setEditingLembrete(lembrete);
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
                    {!loading && !error && lembretes.length > 0 ? (
                        lembretes.map((lembrete) => (
                            <ConsultaCard
                                key={lembrete.id}
                                lembrete={lembrete}
                                handleOpenEditModal={handleOpenEditModal}
                                handleConcluirLembrete={handleConcluirLembrete}
                                handleReverterLembrete={handleReverterLembrete}
                                handleRemoveLembrete={handleRemoveLembrete}
                            />
                        ))
                    ) : (
                        <div className=" border border-slate-200 rounded-xl p-6 shadow-sm text-center">
                            <p className="text-slate-600">Você não possui nenhum lembrete de consulta.</p>
                        </div>
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
                            <div>
                                <label htmlFor="dataConsulta" className="form-consultas">Data e Hora*:</label>
                                <input type="datetime-local" id="dataConsulta" name="dataConsulta" value={formData.dataConsulta} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="localConsulta" className="form-consultas">Local/Link*:</label>
                                <input type="text" id="localConsulta" name="localConsulta" value={formData.localConsulta} onChange={handleInputChange} placeholder="Ex: Unidade Paulista ou link da sala" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
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