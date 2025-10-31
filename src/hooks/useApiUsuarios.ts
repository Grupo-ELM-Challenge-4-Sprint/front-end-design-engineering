import { useState, useCallback } from 'react';

export interface Usuario {
  id: number;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  senha: string;
  lembretesConsulta: any[];
  lembretesReceita: any[];
}

const API_URL = import.meta.env.VITE_API_URL_USUARIOS;

export const useApiUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async (): Promise<Usuario[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar usuários');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsuarioPorCpf = useCallback(async (cpf: string): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?cpf=${cpf}`);
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      const usuarios = await response.json();
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarUsuario = useCallback(async (usuario: Omit<Usuario, 'id'>): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error('Erro ao criar usuário');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarUsuario = useCallback(async (id: number, usuario: Partial<Usuario>): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error('Erro ao atualizar usuário');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchUsuarios,
    getUsuarioPorCpf,
    criarUsuario,
    atualizarUsuario,
  };
};
