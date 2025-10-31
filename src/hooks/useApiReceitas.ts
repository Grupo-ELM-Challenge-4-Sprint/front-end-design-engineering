import { useState, useCallback } from 'react';
import type { LembreteReceita } from '../types/lembretes';

const API_URL = 'https://projeto-simpleshc.onrender.com';

export const useApiReceitas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useCallback(async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options?.headers,
        },
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Erro ${response.status} em ${endpoint}: ${errorBody}`);
        throw new Error(`Erro ${response.status} ao ${options?.method || 'buscar'} dados.`);
      }
      // Se a resposta for 204 No Content (DELETE), retorna null ou true
       if (response.status === 204) {
           return options?.method === 'DELETE' ? true : null;
       }
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido na API';
      setError(message);
      console.error(message, err);
      // Retornar um valor padrão apropriado para o tipo de retorno esperado
      if (endpoint.includes('receita')) return null;
      if (options?.method === 'DELETE') return false;
      return []; // Para listas
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Funções RECEITA ---
  const listarReceitas = useCallback(async (usuarioId: number): Promise<LembreteReceita[]> => {
      // Usa o endpoint /receita/usuario/{userId} criado no Java
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
