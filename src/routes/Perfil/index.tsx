import { useEffect, useState } from "react";
import PacientePage from "../../components/Painel/PacientePage";
import { useApiUsuarios } from "../../hooks/useApiUsuarios";
import type { Usuario, LembreteConsulta, LembreteReceita } from "../../hooks/useApiUsuarios";
import { CardConsulta, CardReceita } from "../../components/LembreteCard/LembreteCard";
import { useInputMasks } from "../../hooks/useInputMasks";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import { useUser } from "../../hooks/useUser";
import { cleanCpf } from "../../utils/stringUtils";
import { formatDate } from "../../utils/dateUtils";
import Loading from "../../components/Loading/Loading";

export default function Perfil() {
    useAuthCheck();
    const { atualizarUsuario, listarConsultas, listarReceitas, getUsuarioPorCpf } = useApiUsuarios();
    const { applyMask } = useInputMasks();
    const { usuarioApi, setUsuarioApi } = useUser();
    const [pacienteVinculado, setPacienteVinculado] = useState<(Usuario & { lembretesConsulta: LembreteConsulta[]; lembretesReceita: LembreteReceita[] }) | null>(null);
    const [meusLembretes, setMeusLembretes] = useState<{ lembretesConsulta: LembreteConsulta[]; lembretesReceita: LembreteReceita[] } | null>(null);
    const [linkMessage, setLinkMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [linkingLoading, setLinkingLoading] = useState(false);

    // Buscar usuário da API ao carregar
    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (cpfLogado) {
            setLoading(true);
            // CPF já está limpo no localStorage, mas garantir limpeza se necessário
            const cpfLimpo = cleanCpf(cpfLogado);
            getUsuarioPorCpf(cpfLimpo).then(async (usuario) => {
                if (usuario) {
                    setUsuarioApi(usuario);

                    // Se for paciente, buscar seus próprios lembretes
                    if (usuario.tipoUsuario === 'PACIENTE') {
                        const consultas = await listarConsultas(usuario.id);
                        const receitas = await listarReceitas(usuario.id);
                        setMeusLembretes({
                            lembretesConsulta: consultas,
                            lembretesReceita: receitas,
                        });
                    }

                    // Se for cuidador e tiver paciente vinculado, buscar dados do paciente
                    if (usuario.tipoUsuario === 'CUIDADOR' && usuario.cpfPaciente) {
                        const paciente = await getUsuarioPorCpf(usuario.cpfPaciente);
                        if (paciente) {
                            const consultasPaciente = await listarConsultas(paciente.id);
                            const receitasPaciente = await listarReceitas(paciente.id);
                            const pacienteComLembretes = {
                                ...paciente,
                                lembretesConsulta: consultasPaciente,
                                lembretesReceita: receitasPaciente,
                            };
                            setPacienteVinculado(pacienteComLembretes);
                        }
                    }
                }
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [getUsuarioPorCpf, listarConsultas, listarReceitas]);

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(() => ({
        nomeCompleto: usuarioApi?.nome || '',
        cpf: usuarioApi?.cpf || '',
        dataNascimento: usuarioApi?.dataNascimento || '',
        email: usuarioApi?.email || '',
        telefone: usuarioApi?.telefone || ''
    }));
    const [original, setOriginal] = useState(() => ({
        nomeCompleto: usuarioApi?.nome || '',
        cpf: usuarioApi?.cpf || '',
        dataNascimento: usuarioApi?.dataNascimento || '',
        email: usuarioApi?.email || '',
        telefone: usuarioApi?.telefone || ''
    }));

    // Só atualiza se trocar de usuário logado
    useEffect(() => {
        if (usuarioApi) {
            setForm({
                nomeCompleto: usuarioApi.nome,
                cpf: usuarioApi.cpf,
                dataNascimento: usuarioApi.dataNascimento,
                email: usuarioApi.email,
                telefone: usuarioApi.telefone
            }); 
            setOriginal({
                nomeCompleto: usuarioApi.nome,
                cpf: usuarioApi.cpf,
                dataNascimento: usuarioApi.dataNascimento,
                email: usuarioApi.email,
                telefone: usuarioApi.telefone
            });
        }
    }, [usuarioApi]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setEditMode(true);
    };
    const handleCancel = () => {
        setForm(original);
        setEditMode(false);
    };
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioApi) return;
        atualizarUsuario(usuarioApi.id, {
            email: form.email,
            telefone: form.telefone
        }).then((sucesso) => {
            if (sucesso) {
                setUsuarioApi({ ...usuarioApi, email: form.email, telefone: form.telefone });
                setOriginal(form);
                setEditMode(false);
            }
        });
    };

    return (
        <PacientePage>
            <Loading loading={loading} message="Carregando dados do perfil..." />
            <div className="content-header">
                <h2>Meus Dados</h2>
            </div>

            <div className="flex flex-col lg:flex-row">

                <form id="formInformacoesPessoais" onSubmit={handleSave}>
                    <div className="meus-dados-grid">
                        <div className="info-section"
                            data-guide-step="1"
                            data-guide-title="Suas Informações Pessoais"
                            data-guide-text="Confira seus dados cadastrais. Alguns campos como nome e CPF não podem ser alterados por aqui."
                            data-guide-arrow="down">

                            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#e0e0e0] flex-col sm:flex-row">
                                <h3 className="text-xl font-semibold">Informações Pessoais</h3>
                                <div className="form-actions-header pl-2"
                                    data-guide-step="2"
                                    data-guide-title="Editar Informações"
                                    data-guide-text="Clique em 'Editar' para modificar seus dados de contato e preferências. Lembre-se de 'Salvar' as alterações."
                                    data-guide-arrow="up">
                                    {!editMode && (
                                        <button id="editProfileButton" className="btn btn-secondary" type="button" onClick={handleEdit}>Editar</button>
                                    )}
                                    {editMode && (
                                        <>
                                            <button id="saveProfileButton" className="btn btn-primary cursor-pointer" type="submit" form="formInformacoesPessoais">Salvar</button>
                                            <button id="cancelEditButton" className="btn cursor-pointer hover:bg-red-200" type="button" onClick={handleCancel}>Cancelar</button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <strong>Nome Completo:</strong>
                                <input type="text" id="userName" name="nomeCompleto" value={form.nomeCompleto} disabled title="Nome Completo" placeholder="Nome usuário" />
                            </div>
                            <div className="info-item">
                                <strong>CPF:</strong>
                                <input type="text" id="userCpf" name="cpf" value={form.cpf} disabled title="CPF" placeholder="CPF usuário" />
                            </div>
                            <div className="info-item">
                                <strong>Data de Nascimento:</strong>
                                <input type="text" id="userDob" name="dataNascimento" value={form.dataNascimento ? formatDate(form.dataNascimento) : ''} disabled title="Data de Nascimento" placeholder="DD/MM/AAAA" />
                            </div>
                            <div className="info-item">
                                <strong>Email:</strong>
                                <input type="email" id="userEmail" name="email" value={form.email} onChange={handleChange} disabled={!editMode} title="Email" placeholder="Email usuário" />
                            </div>
                            <div className="info-item">
                                <strong>Telefone:</strong>
                                <input type="tel" id="userTelefone" name="telefone" value={form.telefone} onChange={handleChange} disabled={!editMode} title="Telefone" placeholder="(XX) XXXXX-XXXX" />
                            </div>

                            {/* Seção de Vinculação para Cuidadores */}
                            {usuarioApi?.tipoUsuario === 'CUIDADOR' && (
                                <div className="info-section mt-6">
                                    <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-[#e0e0e0]">Vinculação com Paciente</h4>

                                    {pacienteVinculado ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                            <p className="text-green-800 font-medium">✅ Vinculado com: {pacienteVinculado.nome}</p>
                                            <p className="text-green-600 text-sm mt-1">CPF: {pacienteVinculado.cpf}</p>
                                            <button type="button" className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                                                onClick={async () => {
                                                    if (usuarioApi && pacienteVinculado) {
                                                        try {
                                                            // Desvincular: remover cpfPaciente do cuidador e cpfCuidador do paciente
                                                            await atualizarUsuario(usuarioApi.id, { cpfPaciente: null });
                                                            await atualizarUsuario(pacienteVinculado.id, { cpfCuidador: null });
                                                            setPacienteVinculado(null);
                                                            setUsuarioApi({ ...usuarioApi, cpfPaciente: null });
                                                        } catch (error) {
                                                            console.error('Erro ao desvincular:', error);
                                                        }
                                                    }
                                                }}
                                            >
                                                Desvincular
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <p className="text-gray-700 mb-3">Você não está vinculado a nenhum paciente.</p>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <input type="text" placeholder="Digite o CPF do paciente" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" id="cpfPacienteInput"
                                                    onChange={(e) => {
                                                        const value = applyMask(e.target.value, 'cpf');
                                                        e.target.value = value;
                                                    }}
                                                />
                                                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                                                    onClick={async () => {
                                                        const cpfInput = document.getElementById('cpfPacienteInput') as HTMLInputElement;
                                                        const cpfPaciente = cpfInput.value;
                                                        setLinkMessage('Carregando dados do usuário...');
                                                        setLinkingLoading(true);

                                                        if (!cpfPaciente || cpfPaciente.length !== 14) {
                                                            setLinkMessage('Por favor, digite um CPF válido.');
                                                            setLinkingLoading(false);
                                                            return;
                                                        }

                                                        try {
                                                            // Limpar CPF para busca (remover pontos e traços)
                                                            const cpfLimpo = cleanCpf(cpfPaciente);
                                                            const paciente = await getUsuarioPorCpf(cpfLimpo);
                                                            if (!paciente) {
                                                                setLinkMessage('Paciente não encontrado.');
                                                                setLinkingLoading(false);
                                                                return;
                                                            }

                                                            if (paciente.tipoUsuario !== 'PACIENTE') {
                                                                setLinkMessage('Este usuário não é um paciente.');
                                                                setLinkingLoading(false);
                                                                return;
                                                            }

                                                            if (paciente.cpfCuidador) {
                                                                setLinkMessage('Este paciente já está vinculado a outro cuidador.');
                                                                setLinkingLoading(false);
                                                                return;
                                                            }

                                                            // Vincular: adicionar cpfPaciente ao cuidador e cpfCuidador ao paciente
                                                            await atualizarUsuario(usuarioApi!.id, { cpfPaciente: cpfLimpo });
                                                            await atualizarUsuario(paciente.id, { cpfCuidador: usuarioApi!.cpf });

                                                            // Buscar lembretes do paciente recém-vinculado
                                                            const consultasPaciente = await listarConsultas(paciente.id);
                                                            const receitasPaciente = await listarReceitas(paciente.id);
                                                            const pacienteComLembretes = {
                                                                ...paciente,
                                                                lembretesConsulta: consultasPaciente,
                                                                lembretesReceita: receitasPaciente,
                                                            };

                                                            setPacienteVinculado(pacienteComLembretes);
                                                            setUsuarioApi({ ...usuarioApi!, cpfPaciente: cpfLimpo });

                                                            setLinkMessage('Vinculação realizada com sucesso!');
                                                        } catch (error) {
                                                            setLinkMessage('Erro ao vincular paciente.');
                                                        } finally {
                                                            setLinkingLoading(false);
                                                        }
                                                    }}
                                                >
                                                    {linkingLoading ? 'Vinculando...' : 'Vincular'}
                                                </button>
                                            </div>
                                            {linkMessage && (
                                                <p className={`mt-3 text-sm ${linkMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                                                    {linkMessage}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Cards exibindo Consultas e Receitas que vão acontecer */}
                <div className="w-full justify-center lg:mr-5 notificacoes-section">
                    <h3 className="text-xl font-semibold text-[#1a237e] mb-4 lg:mt-0 mt-8 pb-2.5 border-b">
                        {usuarioApi?.tipoUsuario === 'CUIDADOR' && pacienteVinculado
                            ? `Próximos Lembretes de ${pacienteVinculado.nome}`
                            : 'Próximos Lembretes'
                        }
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Consultas Agendadas */}
                        {(pacienteVinculado?.lembretesConsulta || meusLembretes?.lembretesConsulta || [])
                            ?.filter((lembrete: LembreteConsulta) => lembrete.status === 'Agendada')
                            .sort((a: LembreteConsulta, b: LembreteConsulta) => {
                                const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`);
                                const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}`);
                                return dateA.getTime() - dateB.getTime();
                            })
                            .slice(0, 3)
                            .map((lembrete: LembreteConsulta) => (
                                <CardConsulta key={lembrete.id} lembrete={lembrete} />
                            ))}

                        {/* Receitas Ativas */}
                        {(pacienteVinculado?.lembretesReceita || meusLembretes?.lembretesReceita || [])
                            ?.filter((lembrete: LembreteReceita) => lembrete.status === 'Ativo')
                            .slice(0, 3)
                            .map((lembrete: LembreteReceita) => (
                                <CardReceita key={lembrete.id} lembrete={lembrete} />
                            ))}
                    </div>
                    {((pacienteVinculado?.lembretesConsulta?.filter((l: LembreteConsulta) => l.status === 'Agendada').length === 0 &&
                    pacienteVinculado?.lembretesReceita?.filter((l: LembreteReceita) => l.status === 'Ativo').length === 0) ||
                    (meusLembretes?.lembretesConsulta?.filter((l: LembreteConsulta) => l.status === 'Agendada').length === 0 &&
                    meusLembretes?.lembretesReceita?.filter((l: LembreteReceita) => l.status === 'Ativo').length === 0)) && (
                        <div className="text-center py-8 text-slate-500">
                            <p>
                                {usuarioApi?.tipoUsuario === 'CUIDADOR' && pacienteVinculado
                                    ? `${pacienteVinculado.nome} não tem nenhuma consulta agendada ou receita ativa no momento.`
                                    : 'Você não tem nenhuma consulta agendada ou receita ativa no momento.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PacientePage>
    );
}