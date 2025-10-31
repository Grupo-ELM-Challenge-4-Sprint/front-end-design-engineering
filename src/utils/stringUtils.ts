/**
 * Utilitários para manipulação de strings
 */

export const cleanCpf = (cpf: string): string => {
  // Remove todos os caracteres não numéricos
  return cpf.replace(/\D/g, '');
};
