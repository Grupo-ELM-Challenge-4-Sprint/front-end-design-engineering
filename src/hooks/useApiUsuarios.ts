import { useState, useCallback } from 'react';

// Definições de tipos para nossos lembretes
export interface LembreteConsulta {
    id: number;
    especialidade: string;
    medico: string;
    data: string; // Formato: DD/MM/AAAA
    hora: string; // Formato: HH:mm
    tipo: 'Presencial' | 'Teleconsulta';
    local: string;
    observacoes: string;
    status: 'Agendada' | 'Concluída';
};

export interface LembreteReceita {
    id: number;
    nome: string;
    frequencia: number;
    dias: string[];
    data: string; // Formato: DD/MM/YYYY
    hora: string; // Formato: HH:mm
    numeroDias: number;
    observacoes: string;
    status: 'Ativo' | 'Inativo';
};

export interface Usuario {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  tipoUsuario: 'PACIENTE' | 'CUIDADOR';
  email: string;
  telefone: string;
  senha: string;
  cpfPaciente?: string | null; // Para cuidadores: CPF do paciente vinculado
  cpfCuidador?: string | null; // Para pacientes: CPF do cuidador vinculado
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
      const response = await fetch(`${API_URL}/usuarios?cpf=${cpf}`);
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

  const criarUsuario = useCallback(async (usuario: Omit<Usuario, 'id' | 'lembretesConsulta' | 'lembretesReceita'>): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
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

  const atualizarUsuario = useCallback(async (id: string, usuario: Partial<Usuario>): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error('Erro ao atualizar usuário');
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
        setLoading(false);
    } 
  }, []);

  // Funções para Consultas
  const listarConsultas = useCallback(async (usuarioId: string): Promise<LembreteConsulta[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/consultas?usuarioId=${usuarioId}`);
      if (!response.ok) throw new Error('Erro ao listar consultas');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return [];
    } finally {
      setLoading(false);
    } 
  }, []);

  const adicionarConsulta = useCallback(async (usuarioId: string, novaConsulta: Omit<LembreteConsulta, 'id'>): Promise<LembreteConsulta | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/consultas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...novaConsulta, usuarioId }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar consulta');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    } 
  }, []);

  const atualizarConsulta = useCallback(async (consultaId: number, dadosAtualizados: Partial<LembreteConsulta>): Promise<LembreteConsulta | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/consultas/${consultaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });
      if (!response.ok) throw new Error('Erro ao atualizar consulta');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    } 
  }, []);

  const removerConsulta = useCallback(async (consultaId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/consultas/${consultaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao remover consulta');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setLoading(false);
    } 
  }, []);

  // Funções para Receitas
  const listarReceitas = useCallback(async (usuarioId: string): Promise<LembreteReceita[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/receitas?usuarioId=${usuarioId}`);
      if (!response.ok) throw new Error('Erro ao listar receitas');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return [];
    } finally {
      setLoading(false);
    } 
  }, []);

  const adicionarReceita = useCallback(async (usuarioId: string, novaReceita: Omit<LembreteReceita, 'id'>): Promise<LembreteReceita | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/receitas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...novaReceita, usuarioId }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar receita');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    } 
  }, []);

  const atualizarReceita = useCallback(async (receitaId: number, dadosAtualizados: Partial<LembreteReceita>): Promise<LembreteReceita | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/receitas/${receitaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });
      if (!response.ok) throw new Error('Erro ao atualizar receita');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    } 
  }, []);

  const removerReceita = useCallback(async (receitaId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/receitas/${receitaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao remover receita');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
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
    listarConsultas,
    adicionarConsulta,
    atualizarConsulta,
    removerConsulta,
    listarReceitas,
    adicionarReceita,
    atualizarReceita,
    removerReceita,
  };
};