import { useState } from 'react';
import PacientePage from '../../components/Painel/PacientePage';
import { useApiReceitas } from '../../hooks/useApiReceitas';
import { ReceitaCard } from '../../components/LembreteCard/LembreteCard';
import { useReceitas } from '../../hooks/useReceitas';
import ModalLembrete from '../../components/LembreteCard/ModalLembrete';
import Loading from '../../components/Loading/Loading';
import type { LembreteReceita, FormDataConsulta, FormDataReceita } from '../../types/lembretes';

export default function Receitas() {
    const { adicionarReceita, atualizarReceita, removerReceita } = useApiReceitas();
    const { lembretesReceitas, loading, error, refreshReceitas, usuarioApi, paciente } = useReceitas();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLembrete, setEditingLembrete] = useState<LembreteReceita | null>(null);

    const canEdit = usuarioApi?.tipoUsuario === 'CUIDADOR' || usuarioApi?.pacienteEditar !== false;

    const handleFormSubmit = async (formData: FormDataConsulta | FormDataReceita) => {
        if (!usuarioApi || !canEdit) return;

        const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.idUser : usuarioApi.idUser;

        if ('nome' in formData) {
            const receitaData = {
                nome: formData.nome,
                frequencia: Number(formData.frequencia),
                dias: formData.dias,
                numeroDias: Number(formData.numeroDias),
                dataInicio: formData.dataInicio,
                horaInicio: formData.horaInicio,
                observacoes: formData.observacoes,
            };

            try {
                if (editingLembrete) {
                    await atualizarReceita(editingLembrete.idReceita, {
                        ...receitaData,
                        idUser: usuarioId,
                        status: editingLembrete.status,
                    });
                } else {
                    await adicionarReceita(usuarioId, {
                        ...receitaData,
                        status: 'Ativo',
                    });
                }
                refreshReceitas();
            } catch (_error) {
                 console.error("Erro ao salvar receita:", _error);
            }
        }
    };

    const handleRemoveLembrete = async (id: number) => {
        await removerReceita(id);
        refreshReceitas();
    };

    const handleConcluirLembrete = async (id: number) => {
        const lembreteAtual = lembretesReceitas.find(l => l.idReceita === id);
        if (!lembreteAtual) return;
        
        await atualizarReceita(id, {
            ...lembreteAtual,
            status: 'Inativo',
        });
        refreshReceitas();
    };

    const handleReativarLembrete = async (id: number) => {
        const lembreteAtual = lembretesReceitas.find(l => l.idReceita === id);
        if (!lembreteAtual) return;

        await atualizarReceita(id, {
            ...lembreteAtual,
            status: 'Ativo',
        });
        refreshReceitas();
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
            <section className="py-2"
                    data-guide-step="1"
                    data-guide-title="Bem-vindo às Receitas!"
                    data-guide-text="Esta é a página onde você gerencia seus lembretes de medicamentos e receitas médicas."
                    data-guide-arrow="down">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-left">Meus Lembretes de Medicamentos</h1>
                    {canEdit && (
                        <button onClick={handleOpenAddModal}
                                className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer"
                                data-guide-step="2"
                                data-guide-title="Adicionar Lembrete"
                                data-guide-text="Clique aqui para adicionar um novo lembrete de medicamento ou receita."
                                data-guide-arrow="up">
                            Adicionar Lembrete
                        </button>
                    )}
                </div>

                <div id="lembretes-receitas-content" className="space-y-6"
                     data-guide-step="3"
                     data-guide-title="Seus Lembretes"
                     data-guide-text="Aqui você vê todos os seus lembretes de medicamentos. Cada card mostra o nome do medicamento e suas instruções."
                     data-guide-arrow="up">
                    {loading && <Loading loading={loading} message="Carregando lembretes de medicamentos..." />}
                    {error && <p className="text-center text-red-600">Erro ao carregar lembretes: {error}</p>}
                    {!loading && !error && lembretesReceitas.length > 0 ? (
                        lembretesReceitas.map((lembrete) => (
                            <ReceitaCard
                                key={lembrete.idReceita} // Usa idReceita
                                lembrete={lembrete}
                                handleOpenEditModal={canEdit ? handleOpenEditModal : () => {}}
                                // Passa idReceita para os handlers
                                handleConcluirLembrete={canEdit ? () => handleConcluirLembrete(lembrete.idReceita) : () => {}}
                                handleReativarLembrete={canEdit ? () => handleReativarLembrete(lembrete.idReceita) : () => {}}
                                handleRemoveLembrete={canEdit ? () => handleRemoveLembrete(lembrete.idReceita) : () => {}}
                                readOnly={!canEdit}
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

            <ModalLembrete
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingLembrete={editingLembrete}
                onSubmit={handleFormSubmit}
                type="receita"
            />
        </PacientePage>
    );
}