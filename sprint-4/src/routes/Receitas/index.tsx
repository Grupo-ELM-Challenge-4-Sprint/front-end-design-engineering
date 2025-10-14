import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PacientePage from '../../components/Painel/PacientePage';
import type { LembreteReceita } from '../../data/dados';
import { getPacientePorCpf, getPacientes, setPacientes } from '../../data/dados';

export default function Receitas() {
    const navigate = useNavigate();
    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (!cpfLogado) {
            navigate('/entrar');
        }
    }, [navigate]);
    const cpfUsuarioLogado = localStorage.getItem('cpfLogado') || '';
    const pacienteLogado = cpfUsuarioLogado ? getPacientePorCpf(cpfUsuarioLogado) : undefined;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lembretes, setLembretes] = useState<LembreteReceita[]>(
        pacienteLogado?.lembretesReceita || []
    );
    const [editingLembrete, setEditingLembrete] = useState<LembreteReceita | null>(null);
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

    useEffect(() => {
        if (editingLembrete) {
            setFormData({
                nome: editingLembrete.nome,
                frequencia: editingLembrete.frequencia,
                dias: editingLembrete.dias,
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

    // Atualiza os lembretes de receita do paciente logado no localStorage
    const persistLembretes = (novosLembretes: any[]) => {
        if (!pacienteLogado) return;
        const pacientes = getPacientes();
        const cpfKey = pacienteLogado.cpf.replace(/\D/g, '');
        pacientes[cpfKey] = {
            ...pacienteLogado,
            lembretesReceita: novosLembretes
        };
        setPacientes(pacientes);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nome) return;

        if (editingLembrete) {
            const novos = lembretes.map(l => l.id === editingLembrete.id ? { ...l, ...formData } : l);
            setLembretes(novos);
            persistLembretes(novos);
        } else {
            const novoLembrete: LembreteReceita = {
                id: Date.now(),
                ...formData,
                status: 'Ativo',
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
        const novos = lembretes.map(l => l.id === id ? { ...l, status: 'Inativo' as 'Inativo' } : l);
        setLembretes(novos);
        persistLembretes(novos);
    };

    const handleReativarLembrete = (id: number) => {
        const novos = lembretes.map(l => l.id === id ? { ...l, status: 'Ativo' as 'Ativo' } : l);
        setLembretes(novos);
        persistLembretes(novos);
    };

    const handleOpenAddModal = () => {
        setEditingLembrete(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: any) => {
        setEditingLembrete(lembrete);
        setIsModalOpen(true);
    };

    const getNextDose = (lembrete: LembreteReceita) => {
        const now = new Date();
        const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const selectedDays = lembrete.dias.map(d => daysOfWeek.indexOf(d));

        // Find next day
        let nextDayIndex = now.getDay();
        let daysAhead = 0;
        while (!selectedDays.includes(nextDayIndex)) {
            nextDayIndex = (nextDayIndex + 1) % 7;
            daysAhead++;
            if (daysAhead > 7) break; // Prevent infinite loop
        }

        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + daysAhead);

        // Parse first dose time
        const [hours, minutes] = lembrete.horaPrimeiraDose.split(':').map(Number);
        let doseTime = new Date(nextDate);
        doseTime.setHours(hours, minutes, 0, 0);

        // If today and time has passed, find next interval
        if (daysAhead === 0 && doseTime <= now) {
            const freqMatch = lembrete.frequencia.match(/A cada (\d+) horas/);
            if (freqMatch) {
                const freqHours = parseInt(freqMatch[1]);
                const diffHours = (now.getTime() - doseTime.getTime()) / (1000 * 60 * 60);
                const intervalsPassed = Math.ceil(diffHours / freqHours);
                doseTime.setHours(hours + intervalsPassed * freqHours, minutes);
            }
        }

        return {
            date: nextDate.toLocaleDateString('pt-BR'),
            time: doseTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
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

                <div className="space-y-6"
                     data-guide-step="3"
                     data-guide-title="Seus Lembretes"
                     data-guide-text="Aqui você vê todos os seus lembretes de medicamentos. Cada card mostra o nome do medicamento e suas instruções."
                     data-guide-arrow="up">
                    {lembretes.length > 0 ? (
                        lembretes.map((lembrete) => (
                            <div key={lembrete.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="p-4 md:p-5 flex justify-between items-center bg-slate-50/80 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-indigo-800">
                                        {lembrete.nome}
                                    </h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${lembrete.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {lembrete.status}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 md:p-5 space-y-3 text-slate-700">
                                    <p><strong className="card-body">Frequência:</strong> {lembrete.frequencia}</p>
                                    <p><strong className="card-body">Dias:</strong> {lembrete.dias.sort((a, b) => ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].indexOf(a) - ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].indexOf(b)).join(', ')}</p>
                                    <p><strong className="card-body">Primeira Dose:</strong> {lembrete.horaPrimeiraDose}</p>
                                    <p><strong className="card-body">Duração:</strong> {lembrete.numeroDias} dias</p>
                                    {lembrete.observacoes && (
                                        <p><strong className="card-body">Observações:</strong> {lembrete.observacoes}</p>
                                    )}
                                    {(() => {
                                        const nextDose = getNextDose(lembrete);
                                        return <p className="text-indigo-600 font-semibold bg-indigo-50 p-2 rounded-md"><strong>Próxima Dose:</strong> {nextDose.date} às {nextDose.time}</p>;
                                    })()}
                                </div>

                                {/* Card Footer */}
                                <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col md:flex-row justify-end items-center gap-3">
                                    {lembrete.status === 'Ativo' ? (
                                        <>
                                            <button onClick={() => handleOpenEditModal(lembrete)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                                Alterar
                                            </button>
                                            <button onClick={() => handleConcluirLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                                Desativar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleReativarLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                                Reativar
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
                                            <input
                                                type="checkbox"
                                                checked={formData.dias.includes(dia)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData(prev => ({ ...prev, dias: [...prev.dias, dia] }));
                                                    } else {
                                                        setFormData(prev => ({ ...prev, dias: prev.dias.filter(d => d !== dia) }));
                                                    }
                                                }}
                                                className="mr-2"
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
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
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