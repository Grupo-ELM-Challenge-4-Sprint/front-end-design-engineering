import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PacientePage from '../../components/Painel/PacientePage';
import type { LembreteConsulta } from '../../data/dados';
import { useApiUsuarios } from '../../hooks/useApiUsuarios';
import type { Usuario } from '../../hooks/useApiUsuarios';

export default function Consultas() {
    const navigate = useNavigate();
    const { getUsuarioPorCpf, atualizarUsuario, loading, error } = useApiUsuarios();

    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (!cpfLogado) {
            navigate('/entrar');
        }
    }, [navigate]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioApi, setUsuarioApi] = useState<Usuario | null>(null);
    const [lembretes, setLembretes] = useState<LembreteConsulta[]>([]);
    const [editingLembrete, setEditingLembrete] = useState<LembreteConsulta | null>(null);

    // Buscar usuário da API ao carregar
    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (cpfLogado) {
            getUsuarioPorCpf(cpfLogado).then((usuario) => {
                if (usuario) {
                    setUsuarioApi(usuario);
                    setLembretes(usuario.lembretesConsulta || []);
                }
            });
        }
    }, [getUsuarioPorCpf]);

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
            // Converter data de DD/MM/YYYY para YYYY-MM-DD para input datetime-local
            const [day, month, year] = editingLembrete.data.split('/');
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setFormData({
                tipoConsulta: editingLembrete.tipo,
                especialidadeConsulta: editingLembrete.especialidade,
                medicoConsulta: editingLembrete.medico,
                dataConsulta: `${formattedDate}T${editingLembrete.hora}`,
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

    // Atualiza os lembretes do usuário na API
    const persistLembretes = async (novosLembretes: LembreteConsulta[]) => {
        if (!usuarioApi) return;
        const sucesso = await atualizarUsuario(usuarioApi.id, {
            lembretesConsulta: novosLembretes
        });
        if (sucesso) {
            setUsuarioApi({ ...usuarioApi, lembretesConsulta: novosLembretes });
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const [data, hora] = formData.dataConsulta.split('T');
        // Converter YYYY-MM-DD para DD/MM/YYYY para armazenamento consistente
        const [year, month, day] = data.split('-');
        const formattedData = `${day}/${month}/${year}`;

        if (editingLembrete) {
            const novos = lembretes.map(l => l.id === editingLembrete.id ? {
                ...l,
                especialidade: formData.especialidadeConsulta,
                medico: formData.medicoConsulta || 'Não especificado',
                data: formattedData,
                hora,
                tipo: formData.tipoConsulta as 'Presencial' | 'Teleconsulta',
                local: formData.localConsulta,
                observacoes: formData.observacoesConsulta,
                status: l.status as 'Agendada' | 'Concluída',
            } : l);
            setLembretes(novos);
            persistLembretes(novos);
        } else {
            const novoLembrete: LembreteConsulta = {
                id: Date.now(),
                especialidade: formData.especialidadeConsulta,
                medico: formData.medicoConsulta || 'Não especificado',
                data: formattedData,
                hora,
                tipo: formData.tipoConsulta as 'Presencial' | 'Teleconsulta',
                local: formData.localConsulta,
                observacoes: formData.observacoesConsulta,
                status: 'Agendada',
            };
            const novos = [...lembretes, novoLembrete];
            setLembretes(novos);
            persistLembretes(novos);
        }

        setIsModalOpen(false);
        setEditingLembrete(null);
    };

    const handleRemoveLembrete = (id: number) => {
        const novos = lembretes.filter(lembrete => lembrete.id !== id);
        setLembretes(novos);
        persistLembretes(novos);
    };

    const handleConcluirLembrete = (id: number) => {
        const novos = lembretes.map(l => l.id === id ? { ...l, status: 'Concluída' as 'Concluída' } : l);
        setLembretes(novos);
        persistLembretes(novos);
    };

    const handleReverterLembrete = (id: number) => {
        const novos = lembretes.map(l => l.id === id ? { ...l, status: 'Agendada' as 'Agendada' } : l);
        setLembretes(novos);
        persistLembretes(novos);
    };

    const handleOpenAddModal = () => {
        setEditingLembrete(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: LembreteConsulta) => {
        setEditingLembrete(lembrete);
        setIsModalOpen(true);
    };

    const formatarDataHora = (dataStr: string, horaStr: string) => {
        if (!dataStr || !horaStr) return '';
        return `${dataStr} às ${horaStr}`;
    }

    return (
        <PacientePage>
            <section
                className="py-2"
                data-guide-step="1"
                data-guide-title="Seus Lembretes de Consulta"
                data-guide-text="Adicione e gerencie seus lembretes de consulta para não esquecer de nenhum agendamento."
                data-guide-arrow="down"
            >
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
                    {loading && <p className="text-center text-slate-600">Carregando lembretes...</p>}
                    {error && <p className="text-center text-red-600">Erro ao carregar lembretes: {error}</p>}
                    {!loading && !error && lembretes.length > 0 ? (
                        lembretes.map(lembrete => (
                            <div key={lembrete.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                {/* Cabeçalho do Card */}
                                <div className="p-4 md:p-5 flex justify-between items-center bg-slate-50/80 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-indigo-800">
                                        {lembrete.especialidade} {lembrete.tipo === 'Teleconsulta' && '(Teleconsulta)'}
                                    </h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${lembrete.status === 'Agendada' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {lembrete.status}
                                    </span>
                                </div>

                                {/* Corpo do Card */}
                                <div className="p-4 md:p-5 space-y-3 text-slate-700">
                                    <p><strong className="card-body">Médico:</strong> {lembrete.medico}</p>
                                    <p><strong className="card-body">Data e Horário:</strong> {formatarDataHora(lembrete.data, lembrete.hora)}</p>
                                    <p><strong className="card-body">Local:</strong> {lembrete.local}</p>
                                    {lembrete.observacoes && (
                                        <p><strong className="card-body">Observações:</strong> {lembrete.observacoes}</p>
                                    )}
                                </div>

                                {/* Rodapé do Card */}
                                <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col md:flex-row justify-end items-center gap-3">
                                    {lembrete.status === 'Agendada' ? (
                                        <>
                                            <button onClick={() => handleOpenEditModal(lembrete)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                                Alterar
                                            </button>
                                            <button onClick={() => handleConcluirLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                                Marcar como Concluída
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleReverterLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                                Reverter
                                            </button>
                                            <button onClick={() => handleRemoveLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full md:w-auto cursor-pointer">
                                                Remover Lembrete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
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