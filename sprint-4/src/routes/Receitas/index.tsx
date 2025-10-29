import { useState, useEffect } from 'react';
import PacientePage from '../../components/Painel/PacientePage';
import { useApiUsuarios } from '../../hooks/useApiUsuarios';
import { ReceitaCard } from '../../components/LembreteCard/LembreteCard';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useLembretes } from '../../hooks/useLembretes';

import type { LembreteReceita } from '../../hooks/useApiUsuarios';
import Loading from '../../components/Loading/Loading';
// Certifique-se que essas funções existem e estão corretas em dateUtils.ts
import { formatLocalDateForInput, formatLocalTimeForInput, combineDateAndTime } from '../../utils/dateUtils';

export default function Receitas() {
    useAuthCheck();
    const { adicionarReceita, atualizarReceita, removerReceita } = useApiUsuarios();
    // Renomeado 'lembretes' para 'lembretesReceitas' para clareza
    const { lembretesReceitas, loading, error, refreshLembretes, paciente, usuarioApi } = useLembretes();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLembrete, setEditingLembrete] = useState<LembreteReceita | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    // ## Ajuste 1: Estado formData usa nomes de campos corretos ##
    const [formData, setFormData] = useState<{
        nomeMedicamento: string;
        frequenciaHoras: number;
        dias: string[];
        numeroDiasTratamento: number;
        dataInicio: string; // YYYY-MM-DD
        horaInicio: string; // HH:mm
        observacoes: string;
    }>({
        nomeMedicamento: '',
        frequenciaHoras: 24, // number
        dias: [...diasDaSemana], // Copia array
        numeroDiasTratamento: 7,
        dataInicio: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        horaInicio: new Date().toTimeString().substring(0, 5), // HH:mm
        observacoes: '',
    });


    // ## Ajuste 2: useEffect usa nomes de campos corretos e formatação ##
    useEffect(() => {
        if (editingLembrete) {
            setFormData({
                nomeMedicamento: editingLembrete.nomeMedicamento,
                frequenciaHoras: editingLembrete.frequenciaHoras,
                dias: editingLembrete.dias.sort((a, b) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b)),
                numeroDiasTratamento: editingLembrete.numeroDiasTratamento,
                // Formata data e hora do backend para os inputs
                dataInicio: formatLocalDateForInput(editingLembrete.dataInicio),
                horaInicio: formatLocalTimeForInput(editingLembrete.horaInicio),
                observacoes: editingLembrete.observacoes,
            });
        } else {
            // Reset form com valores padrão corretos
            const agora = new Date();
            setFormData({
                nomeMedicamento: '',
                frequenciaHoras: 24,
                dias: [...diasDaSemana],
                numeroDiasTratamento: 7,
                dataInicio: agora.toISOString().split('T')[0],
                horaInicio: agora.toTimeString().substring(0, 5),
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
                    ? [...prevState.dias, day].sort((a, b) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b)) // Mantém ordenado
                    : prevState.dias.filter(d => d !== day)
            }));
        } else {
            // Garante que campos numéricos sejam tratados como números
            const newValue = (name === 'frequenciaHoras' || name === 'numeroDiasTratamento')
                             ? parseInt(value) || 0 // Ou outra lógica de validação/padrão
                             : value;
            setFormData(prevState => ({
                ...prevState,
                [name]: newValue
            }));
        }
    };



    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        // ## Ajuste 3: Valida nomeMedicamento ##
        if (!formData.nomeMedicamento) {
            setErrorMessage('O nome do medicamento é obrigatório.');
            return;
        }
        if (formData.dias.length === 0) {
            setErrorMessage('Selecione pelo menos um dia da semana.');
            return;
        }

        if (!usuarioApi) return;

        // ## Ajuste 4: Combina dataInicio e horaInicio para o backend ##
        const horaInicioBackend = combineDateAndTime(formData.dataInicio, formData.horaInicio);

        // ## Ajuste 5: Usa idUser do backend ##
        const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.idUser : usuarioApi.idUser;

        // ## Ajuste 6: Payload com nomes corretos ##
        const receitaData = {
            nomeMedicamento: formData.nomeMedicamento,
            frequenciaHoras: Number(formData.frequenciaHoras), // Garante que é número
            dias: formData.dias, // A API (useApiUsuarios) converte para string
            numeroDiasTratamento: Number(formData.numeroDiasTratamento),
            dataInicio: formData.dataInicio, // YYYY-MM-DD
            horaInicio: horaInicioBackend, // String ISO combinada
            observacoes: formData.observacoes,
        };

        try {
            if (editingLembrete) {
                // ## Ajuste 7: Usa idReceita ##
                await atualizarReceita(editingLembrete.idReceita, {
                    ...receitaData,
                    status: editingLembrete.status, // Preserva status
                });
            } else {
                await adicionarReceita(usuarioId, {
                    ...receitaData,
                    status: 'Ativo', // Status padrão para novo
                });
            }
            refreshLembretes();
            setIsModalOpen(false);
            setEditingLembrete(null);
        } catch (error) {
             console.error("Erro ao salvar receita:", error);
             setErrorMessage("Erro ao salvar lembrete. Tente novamente.");
        }
    };

    // ## Ajuste 8: Handlers usam idReceita ##
    const handleRemoveLembrete = async (id: number) => {
        await removerReceita(id); // id aqui é idReceita
        refreshLembretes();
    };

    const handleConcluirLembrete = async (id: number) => {
        await atualizarReceita(id, { status: 'Inativo' }); // id aqui é idReceita
        refreshLembretes();
    };

    const handleReativarLembrete = async (id: number) => {
        await atualizarReceita(id, { status: 'Ativo' }); // id aqui é idReceita
        refreshLembretes();
    };

    const handleOpenAddModal = () => {
        setEditingLembrete(null); // Reseta o form
        setErrorMessage(''); // Limpa mensagens de erro
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: LembreteReceita) => {
        setEditingLembrete(lembrete); // Popula o form
        setErrorMessage(''); // Limpa mensagens de erro
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
                    <Loading loading={loading} message="Carregando lembretes de medicamentos..." />
                    {error && <p className="text-center text-red-600">Erro ao carregar lembretes: {error}</p>}
                    {/* ## Ajuste 9: Usa lembretesReceitas e idReceita ## */}
                    {!loading && !error && lembretesReceitas.length > 0 ? (
                        lembretesReceitas.map((lembrete) => (
                            <ReceitaCard
                                key={lembrete.idReceita} // Usa idReceita
                                lembrete={lembrete}
                                handleOpenEditModal={handleOpenEditModal}
                                // Passa idReceita para os handlers
                                handleConcluirLembrete={() => handleConcluirLembrete(lembrete.idReceita)}
                                handleReativarLembrete={() => handleReativarLembrete(lembrete.idReceita)}
                                handleRemoveLembrete={() => handleRemoveLembrete(lembrete.idReceita)}
                            />
                        ))
                    ) : (
                         !loading && !error && ( // Só mostra se não estiver carregando e sem erro
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center"
                                data-guide-step="4"
                                data-guide-title="Nenhum Lembrete"
                                data-guide-text="Quando você não tem lembretes, esta mensagem aparece. Use o botão 'Adicionar Lembrete' para criar um novo."
                                data-guide-arrow="up">
                                <p className="text-slate-600">Você não possui nenhum lembrete de medicamento.</p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Modal */}
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
                            {/* ## Ajuste 10: Nomes dos campos no formulário ## */}
                            <div>
                                <label htmlFor="nomeMedicamento" className="block text-sm font-medium text-slate-700 mb-1">Nome do Medicamento*</label>
                                <input type="text" id="nomeMedicamento" name="nomeMedicamento" value={formData.nomeMedicamento} onChange={handleInputChange} placeholder="Ex: Paracetamol 750mg" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="frequenciaHoras" className="block text-sm font-medium text-slate-700 mb-1">Frequência (em horas)*</label>
                                <select id="frequenciaHoras" name="frequenciaHoras" value={formData.frequenciaHoras} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
                                    {/* Valores numéricos */}
                                    <option value={4}>A cada 4 horas</option>
                                    <option value={6}>A cada 6 horas</option>
                                    <option value={8}>A cada 8 horas</option>
                                    <option value={12}>A cada 12 horas</option>
                                    <option value={24}>A cada 24 horas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dias da Semana*</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {diasDaSemana.map(dia => ( // Usando array definido
                                        <label key={dia} className="flex items-center">
                                            <input className="mr-2"
                                                type="checkbox"
                                                value={dia} // Valor do checkbox é o nome do dia
                                                checked={formData.dias.includes(dia)}
                                                onChange={handleInputChange} // Usando o handler geral
                                            />
                                            {dia}
                                        </label>
                                    ))}
                                </div>
                                {errorMessage.includes('dia da semana') && ( // Mostra erro específico dos dias
                                    <small className="text-red-600 text-xs mt-1">{errorMessage}</small>
                                )}
                            </div>

                            <div>
                                <label htmlFor="dataInicio" className="block text-sm font-medium text-slate-700 mb-1">Data de Início*</label>
                                <input type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="horaInicio" className="block text-sm font-medium text-slate-700 mb-1">Hora de Início*</label>
                                <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="numeroDiasTratamento" className="block text-sm font-medium text-slate-700 mb-1">Duração (dias)*</label>
                                <input type="number" id="numeroDiasTratamento" name="numeroDiasTratamento" value={formData.numeroDiasTratamento} onChange={handleInputChange} min="1" required className="w-full p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="observacoes" className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                                <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleInputChange} rows={3} placeholder="Ex: Tomar após as refeições, 1 comprimido" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
                            </div>
                            {errorMessage && !errorMessage.includes('dia da semana') && ( // Mostra erros gerais
                                <div className="text-red-600 text-sm">
                                    {errorMessage}
                                </div>
                            )}
                            {/* ... (Botões Cancelar/Salvar) ... */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingLembrete(null); setErrorMessage(''); }} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
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