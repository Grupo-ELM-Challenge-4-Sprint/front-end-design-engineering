import { useState, useCallback } from 'react';
import { cleanCpf } from '../utils/stringUtils';
import type { Usuario } from '../types/lembretes';
export type { Usuario };

const API_URL = '/api';

export const useApiUsuarios = () => {
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
      if (options?.method === 'DELETE') return false;
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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