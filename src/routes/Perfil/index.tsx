import { useEffect, useState, useRef } from "react";
import PacientePage from "../../components/Painel/PacientePage";
import { useApiUsuarios } from "../../hooks/useApiUsuarios";
import { useApiConsultas } from "../../hooks/useApiConsultas";
import { useApiReceitas } from "../../hooks/useApiReceitas";
import type { Usuario, LembreteConsulta, LembreteReceita } from "../../types/lembretes";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import { formatDate, getNextDose } from "../../utils/dateUtils";
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
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [notificationEnabled, setNotificationEnabled] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const notificationIntervalRef = useRef<number | null>(null);
    const checkCounterRef = useRef(0);

    const lembretesRef = useRef<{
        consultas: LembreteConsulta[];
        receitas: LembreteReceita[];
    }>({ consultas: [], receitas: [] });

    // Buscar lembretes do próprio usuário (paciente)
    useEffect(() => {
        const buscarMeusLembretes = async (idUser: number) => {
            setLoading(true);
            try {
                const consultas = await listarConsultas(idUser);
                const receitas = await listarReceitas(idUser);
                const lembretes = {
                    lembretesConsulta: consultas || [],
                    lembretesReceita: receitas || [],
                };
                
                setMeusLembretes(lembretes);
                // 2. Atualize o Ref aqui
                lembretesRef.current = { consultas: lembretes.lembretesConsulta, receitas: lembretes.lembretesReceita };
                
            } catch (error) {
                console.error('Erro ao buscar lembretes do paciente:', error);
            } finally {
                setLoading(false);
            }
        };

        if (usuarioApi?.tipoUsuario === 'PACIENTE' && usuarioApi.idUser) {
            buscarMeusLembretes(usuarioApi.idUser);
        } else if (usuarioApi?.tipoUsuario === 'CUIDADOR' && !usuarioApi.cpfPaciente) {
            setLoading(false);
            // Limpa o ref se for cuidador sem paciente
            lembretesRef.current = { consultas: [], receitas: [] };
        }
    }, [usuarioApi?.idUser, usuarioApi?.tipoUsuario, listarConsultas, listarReceitas]);

    // Buscar dados do paciente vinculado (cuidador)
    useEffect(() => {
        const buscarDadosPacienteVinculado = async (cpfPaciente: string) => {
            setLoading(true);
            try {
                const paciente = await getUsuarioPorCpf(cpfPaciente);
                if (paciente) {
                    const consultasPaciente = await listarConsultas(paciente.idUser);
                    const receitasPaciente = await listarReceitas(paciente.idUser);

                    const pacienteComLembretes = {
                        ...paciente,
                        lembretesConsulta: consultasPaciente || [],
                        lembretesReceita: receitasPaciente || [],
                    };
                    setPacienteVinculado(pacienteComLembretes);
                    // 3. Atualize o Ref aqui também
                    lembretesRef.current = { consultas: pacienteComLembretes.lembretesConsulta, receitas: pacienteComLembretes.lembretesReceita };
                }
            } catch (error) {
                console.error('Erro ao buscar dados do paciente:', error);
                lembretesRef.current = { consultas: [], receitas: [] }; // Limpa em caso de erro
            } finally {
                setLoading(false);
            }
        };

        if (usuarioApi?.tipoUsuario === 'CUIDADOR' && usuarioApi.cpfPaciente) {
            buscarDadosPacienteVinculado(usuarioApi.cpfPaciente);
        }
    }, [usuarioApi?.tipoUsuario, usuarioApi?.cpfPaciente, getUsuarioPorCpf, listarConsultas, listarReceitas]);

    // ... (Seus outros useEffects e handlers handleEdit, handleCancel, handleSave, sendNotification, handleNotificationToggle... estão corretos) ...
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
 
    // Inicializar estado das notificações
    useEffect(() => {
        const enabled = localStorage.getItem('notificationEnabled') === 'true';
        setNotificationEnabled(enabled);
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);
 
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
        } else {
        setStatusMessage("Falha ao atualizar o perfil. Tente novamente.");
        }
        setUpdating(false);
    }).catch(() => {
        setStatusMessage("Erro ao salvar. Verifique sua conexão e tente novamente.");
        setUpdating(false);
    });
  };
 
    // FUNÇÃO DE ENVIO DE NOTIFICAÇÃO
    const sendNotification = (title: string, body: string) => {
        // Verificar se o usuário permitiu notificações
        const notificationEnabled = localStorage.getItem('notificationEnabled') === 'true';
 
        if (notificationEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/img/icons/icone-site.ico',
                tag: 'healthcare-reminder'
            });
        }
    };
 
    // HANDLER DO TOGGLE TOTALMENTE REFEITO
    const handleNotificationToggle = async () => {
        const isEnabling = !notificationEnabled; // O usuário está tentando ATIVAR?
 
        if (isEnabling) {
            // --- Caso 1: Tentando ATIVAR ---
            if (!('Notification' in window)) {
                alert('Este navegador não suporta notificações.');
                return;
            }
 
            if (notificationPermission === 'granted') {
                // Permissão já concedida, apenas ative
                setNotificationEnabled(true);
                localStorage.setItem('notificationEnabled', 'true');
                startNotificationSystem();
            } else if (notificationPermission === 'denied') {
                // Permissão negada, informe o usuário
                alert('As notificações estão bloqueadas nas configurações do navegador. Você precisa ativá-las manualmente.');
            } else {
                // Permissão 'default', Pede a permissão
                const permission = await Notification.requestPermission();
 
                // Atualiza o estado da permissão
                setNotificationPermission(permission); 
 
                if (permission === 'granted') {
                    // Concedido! Ativa o toggle.
                    setNotificationEnabled(true);
                    localStorage.setItem('notificationEnabled', 'true');
                    startNotificationSystem();
                } else {
                    // Negado. O toggle permanece desligado.
                    alert('Permissão para notificações negada.');
                }
            }
        } else {
            // --- Caso 2: Tentando DESATIVAR ---
            // Não precisa de permissão, apenas desative.
            setNotificationEnabled(false);
            localStorage.setItem('notificationEnabled', 'false');
            stopNotificationSystem();
        }
    };
 
    // Iniciar sistema de notificações
    const startNotificationSystem = () => {
        if (notificationIntervalRef.current) return; // Já está rodando
 
        notificationIntervalRef.current = setInterval(checkReminders, 60000); // A cada 1 minuto
        console.log('🔔 Notification system started');
    };
 
    // Parar sistema de notificações
    const stopNotificationSystem = () => {
        if (notificationIntervalRef.current) {
            clearInterval(notificationIntervalRef.current);
            notificationIntervalRef.current = null;
            console.log('🔕 Notification system stopped');
        }
    };


    // FUNÇÃO DE VERIFICAÇÃO DE LEMBRETES
    const checkReminders = () => {
        const notificationEnabled = localStorage.getItem('notificationEnabled') === 'true';
        if (!notificationEnabled || Notification.permission !== 'granted') {
            return; 
        }

        checkCounterRef.current += 1;
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        const currentDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format local

        console.log(`🔍 [${checkCounterRef.current}] Checking reminders at:`, currentTime, currentDate);

        // LEIA OS LEMBRETES DO REF, não do state!
        const { consultas, receitas } = lembretesRef.current;

        console.log('📅 Consultas to check:', consultas.length);

        // Verificar consultas
        consultas.forEach((consulta) => {
            console.log('Consulta:', consulta.data, consulta.hora, consulta.status, 'vs', currentDate, currentTime);
            if (consulta.status === 'Agendada' && consulta.data === currentDate && consulta.hora === currentTime) {
                console.log('🎯 MATCH! Sending notification for consulta');
                sendNotification(
                    'Lembrete de Consulta',
                    `Você tem uma consulta de ${consulta.especialidade} com ${consulta.medico} às ${consulta.hora}.`
                );
            }
        });

        console.log('💊 Receitas to check:', receitas.length);

        // Verificar receitas
        receitas.forEach((receita) => {
            if (receita.status === 'Ativo') {
                const nextDose = getNextDose({
                    data: receita.dataInicio,
                    hora: receita.horaInicio,
                    frequencia: receita.frequenciaHoras,
                    dias: receita.dias,
                    numeroDias: receita.numeroDiasTratamento
                });
                console.log('Receita next dose:', nextDose?.time, 'vs', currentTime);
                if (nextDose && nextDose.time === currentTime) {
                    console.log('🎯 MATCH! Sending notification for receita');
                    sendNotification(
                        'Lembrete de Medicamento',
                        `Hora de tomar ${receita.nomeMedicamento}. Próxima dose em ${receita.frequenciaHoras} horas.`
                    );
                }
            }
        });
    };

    // Iniciar/verificar o intervalo de notificações quando o componente monta
    useEffect(() => {
        const notificationEnabled = localStorage.getItem('notificationEnabled') === 'true';
        let perm: NotificationPermission = 'default';
        if ('Notification' in window) {
            perm = Notification.permission;
        }

        if (notificationEnabled && perm === 'granted') {
            startNotificationSystem();
        }

        return () => {
            stopNotificationSystem();
        };
    }, [startNotificationSystem, stopNotificationSystem]);

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

                            {statusMessage && (
                                <div className={`status-message ${statusMessage.includes('sucesso') ? 'success' : 'error'}`}>
                                    {statusMessage}
                                </div>
                            )}

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

            {/* Opções Extras */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Opções Extras</h3>
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div>
                        <p className="text-sm text-slate-700">{notificationEnabled ? 'Desativar notificações do navegador' : 'Ativar notificações do navegador'}</p>
                        {/*MENSAGEM DINÂMICA*/}
                        <p className="text-xs text-slate-500 mt-1">{notificationPermission === 'denied' ? 'As notificações estão bloqueadas pelo navegador.' : 'Receba lembretes de consultas e receitas diretamente.'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        {/* ATUALIZADO para desabilitar o toggle se a permissão for negada */}
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificationEnabled} 
                            onChange={handleNotificationToggle} 
                            disabled={notificationPermission === 'denied'}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:bg-gray-200 peer-disabled:after:bg-gray-100 peer-disabled:cursor-not-allowed"></div>
                    </label>
                </div>

                {/* Botão de teste temporário */}
                {notificationEnabled && notificationPermission === 'granted' && (
                    <div className="mt-4">
                        <button className="btn btn-secondary cursor-pointer" onClick={() => sendNotification('Teste de Notificação', 'Esta é uma notificação de teste para verificar se o sistema está funcionando!')}>Testar Notificação</button>
                    </div>
                )}
            </div>

        </PacientePage>
    );
}