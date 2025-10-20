import { useState, useCallback } from "react";
import { loginSchema, cadastroSchema } from "../../schemas/validationSchemas";
import type { LoginFormData, CadastroFormData } from "../../schemas/validationSchemas";
import { useInputMasks, useApiUsuarios, useZodForm } from "../../hooks";
import { LoginForm, CadastroForm } from "../../components/forms";


export default function Entrar() {
    // Estados principais
    const [formAtual, setFormAtual] = useState<'login' | 'cadastro'>('login');
    const [cadastroSucesso, setCadastroSucesso] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Hooks customizados
    const { applyMask, getMaskType } = useInputMasks();
    const { criarUsuario, getUsuarioPorCpf } = useApiUsuarios();

    // Hooks Zod para formulários
    const loginZod = useZodForm(loginSchema);
    const cadastroZod = useZodForm(cadastroSchema);

    // Estados para senhas visíveis
    const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({
        loginSenha: false,
        cadastroSenha: false,
        confirmarSenha: false,
    });

    // Handlers otimizados
    const handleInputChange = useCallback((field: string, value: string, form: 'login' | 'cadastro') => {
        const maskType = getMaskType(field);
        const maskedValue = maskType ? applyMask(value, maskType) : value;

        if (form === 'login') {
            loginZod.setValue(field as keyof LoginFormData, maskedValue as unknown as LoginFormData[keyof LoginFormData]);
        } else {
            cadastroZod.setValue(field as keyof CadastroFormData, maskedValue as unknown as CadastroFormData[keyof CadastroFormData]);
        }
    }, [applyMask, getMaskType, loginZod, cadastroZod]);

    const togglePasswordVisibility = useCallback((field: string) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    }, []);

    const setStatus = useCallback((type: 'success' | 'error' | 'info', message: string) => {
        setStatusMessage({ type, message });
    }, []);

    const clearStatus = useCallback(() => {
        setStatusMessage(null);
    }, []);

    const handleFormChange = useCallback((newForm: 'login' | 'cadastro') => {
        setFormAtual(newForm);
        clearStatus();
        if (newForm === 'cadastro') {
            setCadastroSucesso(false);
            cadastroZod.reset();
        } else {
            loginZod.reset();
        }
    }, [clearStatus, loginZod, cadastroZod]);

    // Handlers de submissão
    const handleLoginSubmit = useCallback(async (data: LoginFormData) => {
        setStatus('info', 'Verificando credenciais...');
        const usuario = await getUsuarioPorCpf(data.loginCpf);
        if (usuario && usuario.senha === data.loginSenha) {
            localStorage.setItem('cpfLogado', data.loginCpf);
            setStatus('success', 'Login bem-sucedido! Redirecionando...');
            setTimeout(() => {
                window.location.href = '/perfil';
            }, 1500);
        } else {
            setStatus('error', 'CPF ou senha inválidos.');
        }
    }, [setStatus, getUsuarioPorCpf]);

    const handleCadastroSubmit = useCallback(async (data: CadastroFormData) => {
        setStatus('info', 'Verificando disponibilidade...');
        const jaExiste = await getUsuarioPorCpf(data.cadastroCpf);
        if (jaExiste) {
            setStatus('error', 'Já existe um cadastro com este CPF.');
            return;
        }

        const novoUsuario = {
            nomeCompleto: data.cadastroNomeCompleto,
            cpf: data.cadastroCpf,
            dataNascimento: data.dataNascimento,
            tipoUsuario: data.tipoUsuario,
            email: data.cadastroEmail,
            telefone: data.cadastroTelefone || '',
            senha: data.cadastroSenha,
            lembretesConsulta: [],
            lembretesReceita: [],
        };

        setStatus('info', 'Criando conta...');
        const usuarioCriado = await criarUsuario(novoUsuario);
        if (usuarioCriado) {
            setCadastroSucesso(true);
            cadastroZod.reset();
        } else {
            setStatus('error', 'Erro ao criar conta. Tente novamente.');
        }
    }, [setStatus, getUsuarioPorCpf, criarUsuario, cadastroZod]);

    return (
        <main className="flex justify-center items-start min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="w-full max-w-md">
                {formAtual === 'login' && (
                    <LoginForm
                        formData={loginZod.data}
                        errors={loginZod.errors}
                        statusMessage={statusMessage}
                        showPasswords={showPasswords}
                        onInputChange={(field, value) => handleInputChange(field, value, 'login')}
                        onTogglePassword={togglePasswordVisibility}
                        onSubmit={(e) => {
                            e.preventDefault();
                            loginZod.handleSubmit(handleLoginSubmit);
                        }}
                        onFormChange={handleFormChange}
                    />
                )}

                {formAtual === 'cadastro' && (
                    <CadastroForm
                        formData={{
                            cadastroNomeCompleto: cadastroZod.data.cadastroNomeCompleto || '',
                            cadastroCpf: cadastroZod.data.cadastroCpf || '',
                            dataNascimento: cadastroZod.data.dataNascimento || '',
                            tipoUsuario: cadastroZod.data.tipoUsuario || '',
                            cadastroEmail: cadastroZod.data.cadastroEmail || '',
                            cadastroTelefone: cadastroZod.data.cadastroTelefone || '',
                            cadastroSenha: cadastroZod.data.cadastroSenha || '',
                            confirmarSenha: cadastroZod.data.confirmarSenha || '',
                        }}
                        errors={cadastroZod.errors}
                        statusMessage={statusMessage}
                        showPasswords={showPasswords}
                        cadastroSucesso={cadastroSucesso}
                        onInputChange={(field, value) => handleInputChange(field, value, 'cadastro')}
                        onTogglePassword={togglePasswordVisibility}
                        onSubmit={(e) => {
                            e.preventDefault();
                            cadastroZod.handleSubmit(handleCadastroSubmit);
                        }}
                        onFormChange={handleFormChange}
                    />
                )}
            </div>
        </main>
    );
}
