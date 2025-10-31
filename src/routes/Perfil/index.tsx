import { useEffect, useState } from "react";
import PacientePage from "../../components/Painel/PacientePage";
import { useApiUsuarios } from "../../hooks/useApiUsuarios";
import { useApiConsultas } from "../../hooks/useApiConsultas";
import { useApiReceitas } from "../../hooks/useApiReceitas";
import type { Usuario, LembreteConsulta, LembreteReceita } from "../../types/lembretes";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import { formatDate } from "../../utils/dateUtils";
import { useInputMasks } from "../../hooks/useInputMasks";
import Loading from "../../components/Loading/Loading";
import { ProximosLembretes } from "../../components/LembreteCard/LembreteCard";
import VinculacaoCuidador from "../../components/VinculacaoCuidador/VinculacaoCuidador";
 

export default function Perfil() {
    useAuthCheck();
    const { atualizarUsuario, getUsuarioPorCpf } = useApiUsuarios();
    const { listarConsultas } = useApiConsultas();
    const { listarReceitas } = useApiReceitas();
    const { usuarioApi, setUsuarioApi } = useAuthCheck();
    const { applyMask } = useInputMasks();
    const [pacienteVinculado, setPacienteVinculado] = useState<(Usuario & { lembretesConsulta: LembreteConsulta[]; lembretesReceita: LembreteReceita[] }) | null>(null);
    const [meusLembretes, setMeusLembretes] = useState<{ lembretesConsulta: LembreteConsulta[]; lembretesReceita: LembreteReceita[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Buscar lembretes quando o usuário estiver disponível
    useEffect(() => {
        const buscarDadosDoPerfil = async (usuario: Usuario) => {
            setLoading(true);

            // Se for paciente, buscar seus próprios lembretes
            if (usuario.tipoUsuario === 'PACIENTE') {
                try {
                    const consultas = await listarConsultas(usuario.idUser);
                    const receitas = await listarReceitas(usuario.idUser);
                    
                    setMeusLembretes({
                        lembretesConsulta: consultas || [],
                        lembretesReceita: receitas || [],
                    });
                } catch (error) {
                    console.error('Erro ao buscar lembretes do paciente:', error);
                } finally {
                    setLoading(false);
                }
            }

            // Se for cuidador e tiver paciente vinculado, buscar dados do paciente
            else if (usuario.tipoUsuario === 'CUIDADOR' && usuario.cpfPaciente) {
                try {
                    const paciente = await getUsuarioPorCpf(usuario.cpfPaciente);
                    if (paciente) {
                        const consultasPaciente = await listarConsultas(paciente.idUser);
                        const receitasPaciente = await listarReceitas(paciente.idUser);
                        
                        const pacienteComLembretes = {
                            ...paciente,
                            lembretesConsulta: consultasPaciente || [],
                            lembretesReceita: receitasPaciente || [],
                        };
                        setPacienteVinculado(pacienteComLembretes);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do paciente:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (usuarioApi) {
            buscarDadosDoPerfil(usuarioApi);
        }
    }, [usuarioApi, getUsuarioPorCpf, listarConsultas, listarReceitas]);

    const [editMode, setEditMode] = useState(false);
    const [editEmail, setEditEmail] = useState('');
    const [editTelefone, setEditTelefone] = useState('');

    // Só atualiza se trocar de usuário logado
    useEffect(() => {
        if (usuarioApi) {
            setEditEmail(usuarioApi.email);
            setEditTelefone(usuarioApi.telefone);
        }
    }, [usuarioApi]);

    const handleEdit = () => {
        setEditMode(true);
    };
    const handleCancel = () => {
        if (usuarioApi) {
            setEditEmail(usuarioApi.email);
            setEditTelefone(usuarioApi.telefone);
        }
        setEditMode(false);
    };
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioApi) return;
        setUpdating(true);

        const payloadCompleto = {
            ...usuarioApi,
            email: editEmail,
            telefone: editTelefone
        };

        // Envia o objeto completo para o hook
        atualizarUsuario(usuarioApi.idUser, payloadCompleto)
            .then((usuarioAtualizado) => { 
        if (usuarioAtualizado) { 
        setUsuarioApi(usuarioAtualizado); 
        setEditMode(false);
        }
        setUpdating(false);
    }).catch(() => {
        setUpdating(false);
    });
  };
    return (
        <PacientePage>
            <Loading loading={loading} message="Carregando dados do perfil..." />
            <div className="content-header"><h2>Meus Dados</h2></div>

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
                                            <button id="saveProfileButton" className="btn btn-primary cursor-pointer" type="submit" form="formInformacoesPessoais" disabled={updating}>{updating ? 'Salvando...' : 'Salvar'}</button>
                                            <button id="cancelEditButton" className="btn cursor-pointer hover:bg-red-200" type="button" onClick={handleCancel} disabled={updating}>Cancelar</button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <strong>Nome Completo:</strong>
                                <input type="text" id="userName" name="nomeCompleto" value={usuarioApi?.nome || ''} disabled title="Nome Completo" placeholder="Nome usuário" />
                            </div>
                            <div className="info-item">
                                <strong>CPF:</strong>
                                <input type="text" id="userCpf" name="cpf" value={usuarioApi?.cpf ? applyMask(usuarioApi.cpf, 'cpf') : ''} disabled title="CPF" placeholder="CPF usuário" />
                            </div>
                            <div className="info-item">
                                <strong>Data de Nascimento:</strong>
                                <input type="text" id="userDob" name="dataNascimento" value={usuarioApi?.dataNascimento ? formatDate(usuarioApi.dataNascimento) : ''} disabled title="Data de Nascimento" placeholder="DD/MM/AAAA" />
                            </div>
                            <div className="info-item">
                                <strong>Email:</strong>
                                <input type="email" id="userEmail" name="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} disabled={!editMode} title="Email" placeholder="Email usuário" />
                            </div>
                            <div className="info-item">
                                <strong>Telefone:</strong>
                                <input type="tel" id="userTelefone" name="telefone" value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} disabled={!editMode} title="Telefone" placeholder="(XX) XXXXX-XXXX" />
                            </div>

                            {/* Seção de Vinculação para Cuidadores */}
                            {usuarioApi?.tipoUsuario === 'CUIDADOR' && (
                                <VinculacaoCuidador pacienteVinculado={pacienteVinculado} setPacienteVinculado={setPacienteVinculado} />
                            )}
                        </div>
                    </div>
                </form>

                {!loading && (
                    <ProximosLembretes
                        lembretesConsultas={pacienteVinculado?.lembretesConsulta || meusLembretes?.lembretesConsulta || []}
                        lembretesReceitas={pacienteVinculado?.lembretesReceita || meusLembretes?.lembretesReceita || []}
                        usuarioApi={usuarioApi}
                        pacienteVinculado={pacienteVinculado}
                    />
                )}
            </div>
        </PacientePage>
    );
}