import { useState, useEffect } from 'react';
import PacientePage from '../../components/Painel/PacientePage';
import type { LembreteReceita } from '../../hooks/useApiUsuarios';
import { useApiUsuarios } from '../../hooks/useApiUsuarios';
import type { Usuario } from '../../hooks/useApiUsuarios';
import { ReceitaCard } from '../../components/LembreteCard/LembreteCard';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useUser } from '../../hooks/useUser';

export default function Receitas() {
    useAuthCheck();
    const { listarReceitas, adicionarReceita, atualizarReceita, removerReceita, loading, error, getUsuarioPorCpf } = useApiUsuarios();
    const { usuarioApi } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paciente, setPaciente] = useState<Usuario | null>(null);
    const [lembretes, setLembretes] = useState<LembreteReceita[]>([]);
    const [editingLembrete, setEditingLembrete] = useState<LembreteReceita | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Buscar lembretes ao carregar
    useEffect(() => {
        if (usuarioApi) {
            // Se for cuidador e tiver paciente vinculado, buscar lembretes do paciente
            if (usuarioApi.tipoUsuario === 'CUIDADOR' && usuarioApi.cpfPaciente) {
                getUsuarioPorCpf(usuarioApi.cpfPaciente).then((paciente) => {
                    if (paciente) {
                        setPaciente(paciente);
                        listarReceitas(paciente.id).then(setLembretes);
                    }
                });
            } else {
                listarReceitas(usuarioApi.id).then(setLembretes);
            }
        }
    }, [usuarioApi, getUsuarioPorCpf, listarReceitas]);
    const [formData, setFormData] = useState<{
        nome: string;
        frequencia: string;
        dias: string[];
        horaPrimeiraDose: string;
        numeroDias: number;
        observacoes: string;
    }>({
        nome: '',
        frequencia: 'A cada 24 horas',
        dias: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        horaPrimeiraDose: '08:00',
        numeroDias: 7,
        observacoes: '',
    });

    const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    useEffect(() => {
        if (editingLembrete) {
            setFormData({
                nome: editingLembrete.nome,
                frequencia: editingLembrete.frequencia,
                dias: editingLembrete.dias.sort((a, b) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b)),
                horaPrimeiraDose: editingLembrete.horaPrimeiraDose,
                numeroDias: editingLembrete.numeroDias,
                observacoes: editingLembrete.observacoes,
            });
        } else {
            setFormData({
                nome: '',
                frequencia: 'A cada 24 horas',
                dias: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
                horaPrimeiraDose: '08:00',
                numeroDias: 7,
                observacoes: '',
            });
        }
    }, [editingLembrete]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            const day = value;
            setFormData(prevState => ({
                ...prevState,
                dias: checked
                    ? [...prevState.dias, day]
                    : prevState.dias.filter(d => d !== day)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'number' ? parseInt(value) || 0 : value
            }));
        }
    };



    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        if (!formData.nome) return;
        if (formData.dias.length === 0) {
            setErrorMessage('Selecione pelo menos um dia da semana.');
            return;
        }

        if (!usuarioApi) return;
        const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.id : usuarioApi.id;

        if (editingLembrete) {
            await atualizarReceita(editingLembrete.id, formData);
        } else {
            await adicionarReceita(usuarioId, {
                ...formData,
                status: 'Ativo',
            });
        }

        // Recarregar lembretes
        listarReceitas(usuarioId).then(setLembretes);

        setIsModalOpen(false);
        setEditingLembrete(null);
    };

    const handleRemoveLembrete = async (id: number) => {
        await removerReceita(id);
        if (usuarioApi) {
            const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.id : usuarioApi.id;
            listarReceitas(usuarioId).then(setLembretes);
        }
    };

    const handleConcluirLembrete = async (id: number) => {
        await atualizarReceita(id, { status: 'Inativo' });
        if (usuarioApi) {
            const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.id : usuarioApi.id;
            listarReceitas(usuarioId).then(setLembretes);
        }
    };

    const handleReativarLembrete = async (id: number) => {
        await atualizarReceita(id, { status: 'Ativo' });
        if (usuarioApi) {
            const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.id : usuarioApi.id;
            listarReceitas(usuarioId).then(setLembretes);
        }
    };

    const handleOpenAddModal = () => {
        setEditingLembrete(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: LembreteReceita) => {
        setEditingLembrete(lembrete);
        setIsModalOpen(true);
    };



    return (
        <PacientePage>
            <section className="py-2">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-left"
                        data-guide-step="1"
                        data-guide-title="Bem-vindo às Receitas!"
                        data-guide-text="Esta é a página onde você gerencia seus lembretes de medicamentos e receitas médicas."
                        data-guide-arrow="down">
                        Meus Lembretes de Medicamentos
                    </h1>
                    <button onClick={handleOpenAddModal}
                            className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer"
                            data-guide-step="2"
                            data-guide-title="Adicionar Lembrete"
                            data-guide-text="Clique aqui para adicionar um novo lembrete de medicamento ou receita."
                            data-guide-arrow="up">
                        Adicionar Lembrete
                    </button>
                </div>

                <div id="lembretes-receitas-content" className="space-y-6"
                     data-guide-step="3"
                     data-guide-title="Seus Lembretes"
                     data-guide-text="Aqui você vê todos os seus lembretes de medicamentos. Cada card mostra o nome do medicamento e suas instruções."
                     data-guide-arrow="up">
                    {loading && <p className="text-center text-slate-600">Carregando lembretes...</p>}
                    {error && <p className="text-center text-red-600">Erro ao carregar lembretes: {error}</p>}
                    {!loading && !error && lembretes.length > 0 ? (
                        lembretes.map((lembrete) => (
                            <ReceitaCard
                                key={lembrete.id}
                                lembrete={lembrete}
                                handleOpenEditModal={handleOpenEditModal}
                                handleConcluirLembrete={handleConcluirLembrete}
                                handleReativarLembrete={handleReativarLembrete}
                                handleRemoveLembrete={handleRemoveLembrete}
                            />
                        ))
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center"
                             data-guide-step="4"
                             data-guide-title="Nenhum Lembrete"
                             data-guide-text="Quando você não tem lembretes, esta mensagem aparece. Use o botão 'Adicionar Lembrete' para criar um novo."
                             data-guide-arrow="up">
                            <p className="text-slate-600">Você não possui nenhum lembrete de medicamento.</p>
                        </div>
                    )}
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-start z-60 overflow-y-auto py-8">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative m-4">
                        <button type="button" className="absolute top-4 right-4 text-2xl font-semibold text-slate-500 hover:text-slate-800" aria-label="Fechar modal" onClick={() => setIsModalOpen(false)}>
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            {editingLembrete ? 'Alterar Lembrete' : 'Adicionar Lembrete'}
                        </h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome do Medicamento*</label>
                                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Ex: Paracetamol 750mg" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="frequencia" className="block text-sm font-medium text-slate-700 mb-1">Frequência*</label>
                                <select id="frequencia" name="frequencia" value={formData.frequencia} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
                                    <option value="A cada 4 horas">A cada 4 horas</option>
                                    <option value="A cada 6 horas">A cada 6 horas</option>
                                    <option value="A cada 8 horas">A cada 8 horas</option>
                                    <option value="A cada 12 horas">A cada 12 horas</option>
                                    <option value="A cada 24 horas">A cada 24 horas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dias da Semana*</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(dia => (
                                        <label key={dia} className="flex items-center">
                                            <input className="mr-2"
                                                type="checkbox"
                                                checked={formData.dias.includes(dia)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData(prev => ({ ...prev, dias: [...prev.dias, dia].sort((a, b) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b)) }));
                                                    } else {
                                                        setFormData(prev => ({ ...prev, dias: prev.dias.filter(d => d !== dia) }));
                                                    }
                                                }}
                                            />
                                            {dia}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="horaPrimeiraDose" className="block text-sm font-medium text-slate-700 mb-1">Horário da Primeira Dose*</label>
                                <input type="time" id="horaPrimeiraDose" name="horaPrimeiraDose" value={formData.horaPrimeiraDose} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="numeroDias" className="block text-sm font-medium text-slate-700 mb-1">Número de Dias de Tratamento*</label>
                                <input type="number" id="numeroDias" name="numeroDias" value={formData.numeroDias} onChange={handleInputChange} min="1" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="observacoes" className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                                <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleInputChange} rows={3} placeholder="Ex: Tomar após as refeições, 1 comprimido" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
                            </div>
                            {errorMessage && (
                                <div className="text-red-600 text-sm">
                                    {errorMessage}
                                </div>
                            )}
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