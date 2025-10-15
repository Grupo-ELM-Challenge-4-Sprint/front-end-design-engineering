import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PacientePage from "../../components/Painel/PacientePage";
import { getPacientePorCpf, getPacientes, setPacientes } from "../../data/dados";
import { CardConsulta, CardReceita } from "../../components/LembreteCard/LembreteCard";

export default function Perfil() {
    const navigate = useNavigate();
    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (!cpfLogado) {
            navigate('/entrar');
        }
    }, [navigate]);

    const cpfUsuarioLogado = localStorage.getItem('cpfLogado') || '';
    const pacienteLogado = cpfUsuarioLogado ? getPacientePorCpf(cpfUsuarioLogado) : undefined;

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(() => ({
        nomeCompleto: pacienteLogado?.nomeCompleto || '',
        cpf: pacienteLogado?.cpf || '',
        dataNascimento: pacienteLogado?.dataNascimento || '',
        email: pacienteLogado?.email || '',
        telefone: pacienteLogado?.telefone || ''
    }));
    const [original, setOriginal] = useState(() => ({
        nomeCompleto: pacienteLogado?.nomeCompleto || '',
        cpf: pacienteLogado?.cpf || '',
        dataNascimento: pacienteLogado?.dataNascimento || '',
        email: pacienteLogado?.email || '',
        telefone: pacienteLogado?.telefone || ''
    }));

    // Só atualiza se trocar de usuário logado
    useEffect(() => {
        if (pacienteLogado) {
            setForm({
                nomeCompleto: pacienteLogado.nomeCompleto,
                cpf: pacienteLogado.cpf,
                dataNascimento: pacienteLogado.dataNascimento,
                email: pacienteLogado.email,
                telefone: pacienteLogado.telefone
            });
            setOriginal({
                nomeCompleto: pacienteLogado.nomeCompleto,
                cpf: pacienteLogado.cpf,
                dataNascimento: pacienteLogado.dataNascimento,
                email: pacienteLogado.email,
                telefone: pacienteLogado.telefone
            });
        }
    }, [cpfUsuarioLogado]);

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
        if (!pacienteLogado) return;
        const pacientes = getPacientes();
        const cpfKey = pacienteLogado.cpf.replace(/\D/g, '');
        pacientes[cpfKey] = {
            ...pacienteLogado,
            email: form.email,
            telefone: form.telefone
        };
        setPacientes(pacientes);
        setOriginal(form);
        setEditMode(false);
    };

    return (
        <PacientePage>
            <div className="content-header">
                <h2>Meus Dados</h2>
                <div className="form-actions-header"
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

            <div className="flex flex-col lg:flex-row">

                <form id="formInformacoesPessoais" onSubmit={handleSave}>
                    <div className="meus-dados-grid">
                        <div className="info-section"
                            data-guide-step="1"
                            data-guide-title="Suas Informações Pessoais"
                            data-guide-text="Confira seus dados cadastrais. Alguns campos como nome e CPF não podem ser alterados por aqui."
                            data-guide-arrow="down">
                            <h3 className="text-xl font-semibold">Informações Pessoais</h3>
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
                                <input type="text" id="userDob" name="dataNascimento" value={form.dataNascimento} disabled title="Data de Nascimento" placeholder="DD/MM/AAAA" />
                            </div>
                            <div className="info-item">
                                <strong>Email:</strong>
                                <input type="email" id="userEmail" name="email" value={form.email} onChange={handleChange} disabled={!editMode} title="Email" placeholder="Email usuário" />
                            </div>
                            <div className="info-item">
                                <strong>Telefone:</strong>
                                <input type="tel" id="userTelefone" name="telefone" value={form.telefone} onChange={handleChange} disabled={!editMode} title="Telefone" placeholder="(XX) XXXXX-XXXX" />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Cards exibindo Consultas e Receitas que vão acontecer */}
                <div className="justify-center lg:mr-5 flex-1 notificacoes-section">
                    <h3 className="text-xl font-semibold text-[#1a237e] mb-4 lg:mt-0 mt-8">Próximos Lembretes</h3>
                    <div className="grid grid-cols-1  gap-4">
                        {/* Consultas Agendadas */}
                        {pacienteLogado?.lembretesConsulta
                            .filter(lembrete => lembrete.status === 'Agendada')
                            .sort((a, b) => {
                                const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`);
                                const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}`);
                                return dateA.getTime() - dateB.getTime();
                            })
                            .slice(0, 3)
                            .map(lembrete => (
                                <CardConsulta key={lembrete.id} lembrete={lembrete} />
                            ))}

                        {/* Receitas Ativas */}
                        {pacienteLogado?.lembretesReceita
                            .filter(lembrete => lembrete.status === 'Ativo')
                            .slice(0, 3)
                            .map(lembrete => (
                                <CardReceita key={lembrete.id} lembrete={lembrete} />
                            ))}
                    </div>
                    {(pacienteLogado?.lembretesConsulta.filter(l => l.status === 'Agendada').length === 0 &&
                    pacienteLogado?.lembretesReceita.filter(l => l.status === 'Ativo').length === 0) && (
                        <div className="text-center py-8 text-slate-500">
                            <p>Você não possui lembretes ativos no momento.</p>
                        </div>
                    )}
                </div>                
            </div>
        </PacientePage>
    );
}