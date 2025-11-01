import { useState, useCallback } from 'react';

const API_URL = 'https://projeto-simpleshc.onrender.com';

export const useApiBase = () => {
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
      if (response.status === 404 && endpoint.includes('/usuario/cpf/')) {
        return null;
      }
      if (!response.ok) {
        const errorBody = await response.text();
        if (!(response.status === 404 && endpoint.includes('/usuario/cpf/'))) {
          console.error(`Erro ${response.status} em ${endpoint}: ${errorBody}`);
        }
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
      if (endpoint.includes('usuario')) return null;
      if (endpoint.includes('consulta')) return null;
      if (endpoint.includes('receita')) return null;
      if (options?.method === 'DELETE') return false;
      return []; // Para listas
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchApi,
  };
};
