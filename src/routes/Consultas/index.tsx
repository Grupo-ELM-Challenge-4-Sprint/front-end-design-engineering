import { useState } from 'react';
import PacientePage from '../../components/Painel/PacientePage';
import type { LembreteConsulta } from '../../types/lembretes';
import { useApiConsultas } from '../../hooks/useApiConsultas';
import { ConsultaCard } from '../../components/LembreteCard/LembreteCard';
//import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useConsultas } from '../../hooks/useConsultas';
import ModalLembrete from '../../components/LembreteCard/ModalLembrete';
import Loading from '../../components/Loading/Loading';
export default function Consultas() {
    //useAuthCheck();
    const { adicionarConsulta, atualizarConsulta, removerConsulta } = useApiConsultas();
    const { lembretesConsultas, loading, error, refreshConsultas, usuarioApi } = useConsultas();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLembrete, setEditingLembrete] = useState<LembreteConsulta | null>(null);

    const handleFormSubmit = async (formData: any) => {
        if (!usuarioApi) return;

        // ## Ajuste 4: Usa idUser do backend ##
        const usuarioId = usuarioApi.idUser;

        // ## Ajuste 5: Payload alinhado com a API (campo 'hora' recebe a string ISO) ##
        const consultaData = {
            especialidade: formData.especialidadeConsulta,
            medico: formData.medicoConsulta || 'Não especificado',
            data: formData.dataConsulta,
            hora: formData.horaConsulta,
            tipo: formData.tipoConsulta,
            local: formData.localConsulta,
            observacoes: formData.observacoesConsulta,
        };


        if (editingLembrete) {
            // ## Ajuste 6: Usa idConsulta ##
            await atualizarConsulta(editingLembrete.idConsulta, {
                ...consultaData,
                idUser: usuarioId, // Inclui idUser na atualização
                status: editingLembrete.status,
            });
        } else {
            await adicionarConsulta(usuarioId, {
                ...consultaData,
                status: 'Agendada',
            });
        }

        refreshConsultas();
    };

    // ## Ajuste 7: Funções de manipulação usam idConsulta ##
    const handleRemoveLembrete = async (id: number) => {
        await removerConsulta(id); // id aqui é idConsulta
        refreshConsultas();
    };

    const handleConcluirLembrete = async (id: number) => {
        if (!usuarioApi) return;
        // Buscar o lembrete atual para obter todos os dados necessários
        const lembreteAtual = lembretesConsultas.find(l => l.idConsulta === id);
        if (!lembreteAtual) return;
        await atualizarConsulta(id, {
            ...lembreteAtual,
            status: 'Concluída',
            idUser: usuarioApi.idUser
        });
        refreshConsultas();
    };

    const handleReverterLembrete = async (id: number) => {
        if (!usuarioApi) return;
        // Buscar o lembrete atual para obter todos os dados necessários
        const lembreteAtual = lembretesConsultas.find(l => l.idConsulta === id);
        if (!lembreteAtual) return;
        await atualizarConsulta(id, {
            ...lembreteAtual,
            status: 'Agendada',
            idUser: usuarioApi.idUser
        });
        refreshConsultas();
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
                    {loading && <Loading loading={loading} message="Carregando lembretes de consultas..." />}
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
                        <div className=" border border-slate-200 rounded-xl p-6 shadow-sm text-center">
                            <p className="text-slate-600">Você não possui nenhum lembrete de consulta.</p>
                        </div>
                    )}
                </div>
            </section>

            <ModalLembrete
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingLembrete(null); }}
                editingLembrete={editingLembrete}
                onSubmit={handleFormSubmit}
                type="consulta"
            />
        </PacientePage>
    );
}