import { useState, useCallback } from 'react';

// Tipos para validação
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

// Funções de validação utilitárias
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Email inválido.';
  },

  cpf: (cpf: string) => {
    const cleanCpf = cpf.replace(/[^\d]+/g, '');
    if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return 'CPF inválido.';
    
    let sum = 0;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return 'CPF inválido.';
    
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cleanCpf.substring(10, 11)) ? null : 'CPF inválido.';
  },

  date: (dateString: string) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return 'Data inválida (dd/mm/yyyy).';
    
    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (year < 1900 || year > new Date().getFullYear() || month === 0 || month > 12) {
      return 'Data inválida.';
    }
    
    const monthLength = [31, (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day > 0 && day <= monthLength[month - 1] ? null : 'Data inválida.';
  },

  password: (password: string) => {
    if (password.length < 8) return 'Senha deve ter no mínimo 8 caracteres.';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(password)) {
      return 'Senha fraca. Use letras maiúsculas, minúsculas e números.';
    }
    return null;
  },

  name: (name: string) => {
    return name.trim().length < 3 ? 'Nome deve ter pelo menos 3 caracteres.' : null;
  }
};

// Hook para validação de formulário
export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return 'Este campo é obrigatório.';
    }

    if (value.trim() && rule.minLength && value.length < rule.minLength) {
      return `Mínimo de ${rule.minLength} caracteres.`;
    }

    if (value.trim() && rule.pattern && !rule.pattern.test(value)) {
      return 'Formato inválido.';
    }

    if (value.trim() && rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((data: {[key: string]: string}) => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar apenas os campos que estão sendo passados
    Object.keys(data).forEach(field => {
      if (rules[field]) {
        const error = validateField(field, data[field] || '');
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules, validateField]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors
  };
};
