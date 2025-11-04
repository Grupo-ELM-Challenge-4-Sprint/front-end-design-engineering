import { useCallback } from 'react';
import type { LembreteConsulta } from '../types/lembretes';
import { useApiBase } from './useApiBase';

export const useApiConsultas = () => {
  const { loading, error, fetchApi } = useApiBase();

  // --- Funções CONSULTA ---
  const listarConsultas = useCallback(async (usuarioId: number): Promise<LembreteConsulta[]> => {
      // Usa o endpoint /consulta/usuario/{idUser} criado no Java
      const consultasDoUsuario = await fetchApi(`/consulta/usuario/${usuarioId}`) as LembreteConsulta[] | null;
      return consultasDoUsuario || []; // Retorna a lista filtrada pela API ou um array vazio

  }, [fetchApi]);


   const adicionarConsulta = useCallback(async (usuarioId: number, novaConsulta: Omit<LembreteConsulta, 'idConsulta' | 'idUser'>): Promise<LembreteConsulta | null> => {
        const payload = {
            ...novaConsulta,
            idUser: usuarioId,
        };
        return fetchApi('/consulta', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }, [fetchApi]);


    const atualizarConsulta = useCallback(async (consultaId: number, dadosAtualizados: Omit<LembreteConsulta, 'idConsulta'>): Promise<LembreteConsulta | null> => {
        const payload = { ...dadosAtualizados };
        // Ajustar formato de hora se necessário
        return fetchApi(`/consulta/${consultaId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }, [fetchApi]);

  const removerConsulta = useCallback(async (consultaId: number): Promise<boolean> => {
      return fetchApi(`/consulta/${consultaId}`, { method: 'DELETE' }) as Promise<boolean>;
  }, [fetchApi]);

  return {
    loading,
    error,
    listarConsultas,
    adicionarConsulta,
    atualizarConsulta,
    removerConsulta,
  };
};
