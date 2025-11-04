import { useCallback } from 'react';
import type { LembreteReceita } from '../types/lembretes';
import { useApiBase } from './useApiBase';

export const useApiReceitas = () => {
  const { loading, error, fetchApi } = useApiBase();

  // --- Funções RECEITA ---
  const listarReceitas = useCallback(async (usuarioId: number): Promise<LembreteReceita[]> => {
      // Usa o endpoint /receita/usuario/{idUser} criado no Java
      const receitasDoUsuario = await fetchApi(`/receita/usuario/${usuarioId}`) as LembreteReceita[] | null;
      return receitasDoUsuario || [];

  }, [fetchApi]);


    const adicionarReceita = useCallback(async (usuarioId: number, novaReceita: Omit<LembreteReceita, 'idReceita' | 'idUser'>): Promise<LembreteReceita | null> => {
        const payload = {
            ...novaReceita,
            idUser: usuarioId,
        };
        return fetchApi('/receita', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }, [fetchApi]);


    const atualizarReceita = useCallback(async (receitaId: number, dadosAtualizados: Partial<Omit<LembreteReceita, 'idReceita'>>): Promise<LembreteReceita | null> => {
        const payload = {
            ...dadosAtualizados,
            idReceita: receitaId,
        };
         return fetchApi(`/receita/${receitaId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }, [fetchApi]);

  const removerReceita = useCallback(async (receitaId: number): Promise<boolean> => {
      return fetchApi(`/receita/${receitaId}`, { method: 'DELETE' }) as Promise<boolean>;
  }, [fetchApi]);

  return {
    loading,
    error,
    listarReceitas,
    adicionarReceita,
    atualizarReceita,
    removerReceita,
  };
};
