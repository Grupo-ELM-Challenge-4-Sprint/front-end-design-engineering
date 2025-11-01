import { useCallback } from 'react';
import { cleanCpf } from '../utils/stringUtils';
import type { Usuario } from '../types/lembretes';
import { useApiBase } from './useApiBase';

export type { Usuario };

export const useApiUsuarios = () => {
  const { loading, error, fetchApi } = useApiBase();

  // --- Funções USUARIO ---
  const getUsuarioPorCpf = useCallback(async (cpf: string): Promise<Usuario | null> => {
      // Usa o endpoint /usuario/cpf/{cpf} criado no Java
      const cpfLimpo = cleanCpf(cpf);
      return fetchApi(`/usuario/cpf/${cpfLimpo}`);
  }, [fetchApi]);

   const getUsuarioPorId = useCallback(async (id: number): Promise<Usuario | null> => {
       return fetchApi(`/usuario/${id}`);
   }, [fetchApi]);

  const criarUsuario = useCallback(async (usuarioData: Omit<Usuario, 'idUser'>): Promise<Usuario | null> => {
      // Ajustar o payload para corresponder ao backend
      const payload = {
          ...usuarioData,
      };
      return fetchApi('/usuario', {
          method: 'POST',
          body: JSON.stringify(payload),
      });
  }, [fetchApi]);

  const atualizarUsuario = useCallback(async (idUser: number, usuarioData: Partial<Omit<Usuario, 'idUser' | 'senha'>>): Promise<Usuario | null> => {
      const payload = { ...usuarioData };
      return fetchApi(`/usuario/${idUser}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
      });
  }, [fetchApi]);

  return {
    loading,
    error,
    getUsuarioPorCpf,
    getUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
  };
};