import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PacientePage from '../../components/Painel/PacientePage';
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
    const [lembretes, setLembretes] = useState(
        pacienteLogado?.lembretesReceita || []
    );
    const [editingLembrete, setEditingLembrete] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        instrucao: '',
    });

    useEffect(() => {
        if (editingLembrete) {
            setFormData({
                nome: editingLembrete.nome,
                instrucao: editingLembrete.instrucao,
            });
        } else {
            setFormData({
                nome: '',
                instrucao: '',
            });
        }
    }, [editingLembrete]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
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
        if (!formData.nome || !formData.instrucao) return;

        if (editingLembrete) {
            const novos = lembretes.map(l => l.id === editingLembrete.id ? { ...l, ...formData } : l);
            setLembretes(novos);
            persistLembretes(novos);
        } else {
            const novoLembrete = {
                id: Date.now(),
                ...formData,
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

    const handleOpenAddModal = () => {
        setEditingLembrete(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (lembrete: any) => {
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

                <div className="space-y-6"
                     data-guide-step="3"
                     data-guide-title="Seus Lembretes"
                     data-guide-text="Aqui você vê todos os seus lembretes de medicamentos. Cada card mostra o nome do medicamento e suas instruções."
                     data-guide-arrow="up">
                    {lembretes.length > 0 ? (
                        lembretes.map((lembrete) => (
                            <div key={lembrete.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 md:p-5">
                                    <h3 className="text-lg font-bold text-indigo-800 mb-2">{lembrete.nome}</h3>
                                    <p className="text-slate-700">{lembrete.instrucao}</p>
                                </div>
                                <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col md:flex-row justify-end items-center gap-3">
                                    <button onClick={() => handleOpenEditModal(lembrete)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
                                        Alterar
                                    </button>
                                    <button onClick={() => handleRemoveLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full md:w-auto cursor-pointer">
                                        Remover
                                    </button>
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
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-start z-50 overflow-y-auto py-8">
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
                                <label htmlFor="instrucao" className="block text-sm font-medium text-slate-700 mb-1">Instruções (Dosagem, Frequência)*</label>
                                <textarea id="instrucao" name="instrucao" value={formData.instrucao} onChange={handleInputChange} rows={3} placeholder="Ex: 1 comprimido a cada 8 horas" required className="w-full p-2 border border-slate-300 rounded-md"></textarea>
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