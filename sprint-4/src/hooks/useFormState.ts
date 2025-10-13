import { useState, useCallback } from 'react';

export interface FormData {
  loginCpf: string;
  loginSenha: string;
  cadastroNomeCompleto: string;
  cadastroCpf: string;
  dataNascimento: string;
  cadastroEmail: string;
  cadastroTelefone: string;
  cadastroSenha: string;
  confirmarSenha: string;
}

export interface StatusMessage {
  type: 'success' | 'error' | '';
  message: string;
}

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    loginCpf: '',
    loginSenha: '',
    cadastroNomeCompleto: '',
    cadastroCpf: '',
    dataNascimento: '',
    cadastroEmail: '',
    cadastroTelefone: '',
    cadastroSenha: '',
    confirmarSenha: ''
  });

  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ type: '', message: '' });
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      loginCpf: '',
      loginSenha: '',
      cadastroNomeCompleto: '',
      cadastroCpf: '',
      dataNascimento: '',
      cadastroEmail: '',
      cadastroTelefone: '',
      cadastroSenha: '',
      confirmarSenha: ''
    });
  }, []);

  const setStatus = useCallback((type: StatusMessage['type'], message: string) => {
    setStatusMessage({ type, message });
  }, []);

  const clearStatus = useCallback(() => {
    setStatusMessage({ type: '', message: '' });
  }, []);

  const togglePasswordVisibility = useCallback((field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  return {
    formData,
    statusMessage,
    showPasswords,
    updateField,
    resetForm,
    setStatus,
    clearStatus,
    togglePasswordVisibility
  };
};
