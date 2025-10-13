import { useCallback } from 'react';

// Funções de máscara
export const masks = {
  cpf: (value: string) => {
    let masked = value.replace(/\D/g, "");
    masked = masked.substring(0, 11);
    masked = masked.replace(/(\d{3})(\d)/, "$1.$2");
    masked = masked.replace(/(\d{3})(\d)/, "$1.$2");
    masked = masked.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return masked;
  },

  telefone: (value: string) => {
    let masked = value.replace(/\D/g, "");
    masked = masked.substring(0, 11);
    if (masked.length > 10) {
      masked = masked.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (masked.length > 6) {
      masked = masked.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (masked.length > 2) {
      masked = masked.replace(/^(\d{2})(\d*)/, "($1) $2");
    } else if (masked.length > 0) {
      masked = masked.replace(/^(\d*)/, "($1");
    }
    return masked;
  },

  date: (value: string) => {
    let masked = value.replace(/\D/g, "");
    masked = masked.substring(0, 8);
    if (masked.length > 4) {
      masked = masked.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    } else if (masked.length > 2) {
      masked = masked.replace(/(\d{2})(\d{2})/, "$1/$2");
    }
    return masked;
  }
};

// Hook para aplicar máscaras
export const useInputMasks = () => {
  const applyMask = useCallback((value: string, maskType: keyof typeof masks) => {
    return masks[maskType](value);
  }, []);

  const getMaskType = useCallback((fieldName: string): keyof typeof masks | null => {
    if (fieldName.includes('Cpf') || fieldName.includes('cpf')) return 'cpf';
    if (fieldName.includes('Telefone') || fieldName.includes('telefone')) return 'telefone';
    if (fieldName === 'dataNascimento') return 'date';
    return null;
  }, []);

  return { applyMask, getMaskType };
};
