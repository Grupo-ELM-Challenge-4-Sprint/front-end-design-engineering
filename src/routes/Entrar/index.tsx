import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, cadastroSchema } from "../../schemas/validationSchemas";
import type { LoginFormData, CadastroFormData } from "../../schemas/validationSchemas";
import { useInputMasks, useApiUsuarios } from "../../hooks";
import { LoginForm, CadastroForm } from "../../components/forms";
import { convertToISODate } from "../../utils/dateUtils";
import { cleanCpf } from "../../utils/stringUtils";
import { useNavigate } from "react-router-dom";


export default function Entrar() {

    const navigate = useNavigate();

    // Estados principais
    const [formAtual, setFormAtual] = useState<'login' | 'cadastro'>('login');
    const [cadastroSucesso, setCadastroSucesso] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Hooks customizados
    const { applyMask, getMaskType } = useInputMasks();
    const { criarUsuario, getUsuarioPorCpf } = useApiUsuarios();

    // Hooks react-hook-form com zodResolver
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    const cadastroForm = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroSchema),
    });

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
            loginForm.setValue(field as keyof LoginFormData, maskedValue as unknown as LoginFormData[keyof LoginFormData]);
        } else {
            cadastroForm.setValue(field as keyof CadastroFormData, maskedValue as unknown as CadastroFormData[keyof CadastroFormData]);
        }
    }, [applyMask, getMaskType, loginForm, cadastroForm]);

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
            cadastroForm.reset();
        } else {
            loginForm.reset();
        }
    }, [clearStatus, loginForm, cadastroForm]);

    // Handlers de submissão
    const handleLoginSubmit = useCallback(async (data: LoginFormData) => {
        setStatus('info', 'Verificando credenciais...');
        // Limpar CPF para busca (remover pontos e traços)
        const cpfLimpo = cleanCpf(data.loginCpf);
        const usuario = await getUsuarioPorCpf(cpfLimpo);
        if (usuario && usuario.senha === data.loginSenha) {
            localStorage.setItem('cpfLogado', cpfLimpo); // Salvar CPF limpo no localStorage
            setStatus('success', 'Login bem-sucedido! Redirecionando...');
            setTimeout(() => {
                navigate('/perfil');
            }, 1500);
        } else {
            setStatus('error', 'CPF ou senha inválidos.');
        }
    }, [setStatus, getUsuarioPorCpf, navigate]);

    const handleCadastroSubmit = useCallback(async (data: CadastroFormData) => {
        setStatus('info', 'Verificando disponibilidade...');
        // Limpar CPF para busca (remover pontos e traços)
        const cpfLimpo = cleanCpf(data.cadastroCpf);
        const jaExiste = await getUsuarioPorCpf(cpfLimpo);
        if (jaExiste) {
            setStatus('error', 'Já existe um cadastro com este CPF.');
            return;
        }

        const novoUsuario = {
            nome: data.cadastroNomeCompleto,
            cpf: cpfLimpo, // Enviar CPF sem máscara
            dataNascimento: convertToISODate(data.dataNascimento), // Converter para yyyy-mm-dd
            tipoUsuario: data.tipoUsuario,
            email: data.cadastroEmail,
            telefone: data.cadastroTelefone,
            senha: data.cadastroSenha,
        };

        setStatus('info', 'Criando conta...');
        const usuarioCriado = await criarUsuario(novoUsuario);
        if (usuarioCriado) {
            setCadastroSucesso(true);
            cadastroForm.reset();
        } else {
            setStatus('error', 'Erro ao criar conta. Tente novamente.');
        }
    }, [setStatus, getUsuarioPorCpf, criarUsuario, cadastroForm]);



    return (
        <main className="flex justify-center items-start min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="w-full max-w-md">
                {formAtual === 'login' && (
                    <LoginForm
                        formData={loginForm.watch()}
                        errors={Object.fromEntries(Object.entries(loginForm.formState.errors).map(([key, error]) => [key, error?.message || '']))}
                        statusMessage={statusMessage}
                        showPasswords={showPasswords}
                        onInputChange={(field, value) => handleInputChange(field, value, 'login')}
                        onTogglePassword={togglePasswordVisibility}
                        onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                        onFormChange={handleFormChange}
                    />
                )}

                {formAtual === 'cadastro' && (
                    <CadastroForm
                        formData={cadastroForm.watch()}
                        errors={Object.fromEntries(Object.entries(cadastroForm.formState.errors).map(([key, error]) => [key, error?.message || '']))}
                        statusMessage={statusMessage}
                        showPasswords={showPasswords}
                        cadastroSucesso={cadastroSucesso}
                        onInputChange={(field, value) => handleInputChange(field, value, 'cadastro')}
                        onTogglePassword={togglePasswordVisibility}
                        onSubmit={cadastroForm.handleSubmit(handleCadastroSubmit)}
                        onFormChange={handleFormChange}
                    />
                )}
            </div>
        </main>
    );
}
