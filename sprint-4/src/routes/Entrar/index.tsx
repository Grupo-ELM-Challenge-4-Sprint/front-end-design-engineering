import { useState, useCallback, useMemo } from "react";
import { useFormValidation, validators, useInputMasks, useFormState } from "../../hooks";
import type { ValidationRules } from "../../hooks";
import { LoginForm, CadastroForm } from "../../components/forms";
import { addPaciente, getPacientePorCpf } from "../../data/dados";


export default function Entrar() {
    // Estados principais
    const [formAtual, setFormAtual] = useState('login');
    const [cadastroSucesso, setCadastroSucesso] = useState(false);

    // Hooks customizados
    const { formData, statusMessage, showPasswords, updateField, resetForm, setStatus, clearStatus, togglePasswordVisibility } = useFormState();
    const { applyMask, getMaskType } = useInputMasks();

    // Regras de validação simplificadas
    const validationRules = useMemo((): ValidationRules => ({
        // Login
        loginCpf: { required: true, custom: validators.cpf },
        loginSenha: { required: true },
        
        // Cadastro
        cadastroNomeCompleto: { required: true, custom: validators.name },
        cadastroCpf: { required: true, custom: validators.cpf },
        dataNascimento: { required: true, custom: validators.date },
        cadastroEmail: { required: true, custom: validators.email },
        cadastroSenha: { required: true, custom: validators.password },
        confirmarSenha: { 
            required: true, 
            custom: (value: string) => value !== formData.cadastroSenha ? 'As senhas não coincidem.' : null 
        }
    }), [formData.cadastroSenha]);

    // Hook de validação
    const { errors, validateForm, clearError, clearAllErrors } = useFormValidation(validationRules);

    // Handlers otimizados
    const handleInputChange = useCallback((field: string, value: string) => {
        const maskType = getMaskType(field);
        const maskedValue = maskType ? applyMask(value, maskType) : value;
        
        updateField(field as keyof typeof formData, maskedValue);
        
        if (errors[field]) {
            clearError(field);
        }
    }, [getMaskType, applyMask, updateField, errors, clearError]);

    const handleFormChange = useCallback((newForm: string) => {
        setFormAtual(newForm);
        clearAllErrors();
        clearStatus();
        if (newForm === 'cadastro') {
            setCadastroSucesso(false);
        }
    }, [clearAllErrors, clearStatus]);

    // Handlers de submissão
    const handleLoginSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const loginData = {
            loginCpf: formData.loginCpf,
            loginSenha: formData.loginSenha
        };

        if (validateForm(loginData)) {
            const paciente = getPacientePorCpf(loginData.loginCpf);
            if (paciente && paciente.senha === loginData.loginSenha) {
                localStorage.setItem('cpfLogado', loginData.loginCpf); // Salva o CPF do usuário logado
                setStatus('success', 'Login bem-sucedido! Redirecionando...');
                setTimeout(() => {
                    window.location.href = '/perfil';
                }, 1500);
            } else {
                setStatus('error', 'CPF ou senha inválidos.');
            }
        } else {
            setStatus('error', 'CPF ou senha inválidos.');
        }
    }, [formData, validateForm, setStatus]);

    const handleCadastroSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const cadastroData = {
            cadastroNomeCompleto: formData.cadastroNomeCompleto,
            cadastroCpf: formData.cadastroCpf,
            dataNascimento: formData.dataNascimento,
            cadastroEmail: formData.cadastroEmail,
            cadastroTelefone: formData.cadastroTelefone,
            cadastroSenha: formData.cadastroSenha,
            confirmarSenha: formData.confirmarSenha
        };

        if (validateForm(cadastroData)) {
            // Verifica se já existe paciente com esse CPF
            const jaExiste = getPacientePorCpf(cadastroData.cadastroCpf);
            if (jaExiste) {
                setStatus('error', 'Já existe um cadastro com este CPF.');
                return;
            }
            // Monta novo paciente
            const novoPaciente = {
                nomeCompleto: cadastroData.cadastroNomeCompleto,
                cpf: cadastroData.cadastroCpf,
                dataNascimento: cadastroData.dataNascimento,
                email: cadastroData.cadastroEmail,
                telefone: formData.cadastroTelefone,
                senha: cadastroData.cadastroSenha,
                lembretesConsulta: [],
                lembretesReceita: [],
            };
            addPaciente(novoPaciente);
            setCadastroSucesso(true);
            resetForm();
        } else {
            setStatus('error', 'Por favor, corrija os erros no formulário.');
        }
    }, [formData, validateForm, resetForm, setStatus]);

    return (
        <main className="flex justify-center items-start min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="w-full max-w-md">
                {formAtual === 'login' && (
                    <LoginForm
                        formData={formData}
                        errors={errors}
                        statusMessage={statusMessage}
                        showPasswords={showPasswords}
                        onInputChange={handleInputChange}
                        onTogglePassword={togglePasswordVisibility}
                        onSubmit={handleLoginSubmit}
                        onFormChange={handleFormChange}
                    />
                )}

                {formAtual === 'cadastro' && (
                    <CadastroForm
                        formData={formData}
                        errors={errors}
                        statusMessage={statusMessage}
                        showPasswords={showPasswords}
                        cadastroSucesso={cadastroSucesso}
                        onInputChange={handleInputChange}
                        onTogglePassword={togglePasswordVisibility}
                        onSubmit={handleCadastroSubmit}
                        onFormChange={handleFormChange}
                    />
                )}
            </div>
        </main>
    );
}