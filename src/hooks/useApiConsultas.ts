import { useState, useCallback } from 'react';
import type { LembreteConsulta } from '../types/lembretes';

const API_URL = 'https://projeto-simpleshc.onrender.com';

export const useApiConsultas = () => {
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
      if (endpoint.includes('consulta')) return null;
      if (options?.method === 'DELETE') return false;
      return []; // Para listas
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Funções CONSULTA ---
  const listarConsultas = useCallback(async (usuarioId: number): Promise<LembreteConsulta[]> => {
      // Usa o endpoint /consulta/usuario/{userId} criado no Java
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
