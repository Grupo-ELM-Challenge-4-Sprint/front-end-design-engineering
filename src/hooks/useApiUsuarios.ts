import { useState, useCallback } from 'react';
import { cleanCpf } from '../utils/stringUtils';
// Interface Usuario alinhada com UsuarioTO.java
export interface Usuario {
  idUser: number; // No Java é Long, aqui pode ser number
  cpf: string;
  nome: string; // Era nomeCompleto no db.json original
  senha?: string; // Senha geralmente não é retornada pela API após login/busca
  email: string;
  telefone: string;
  dataNascimento: string; // Formato YYYY-MM-DD (LocalDate)
  tipoUsuario: 'PACIENTE' | 'CUIDADOR';
  cpfPaciente?: string | null;
  cpfCuidador?: string | null;
}

// Interface LembreteConsulta alinhada com ConsultaTO.java
export interface LembreteConsulta {
    idConsulta: number;
    especialidade: string;
    medico: string; // Era nomeCuidador
    data: string; // Formato YYYY-MM-DD (LocalDate)
    hora: string; // Formato YYYY-MM-DDTHH:mm:ss ou similar (LocalDateTime) -> Ajustar parse/format
    tipo: 'Presencial' | 'Teleconsulta';
    local: string; // Era localLink
    observacoes: string;
    status: 'Agendada' | 'Concluída';
    idUser: number;
};

// Interface LembreteReceita alinhada com ReceitaTO.java
export interface LembreteReceita {
    idReceita: number;
    nomeMedicamento: string; // Era nome
    frequenciaHoras: number; // Era frequencia (string ou number?) e agora é int
    dias: string[]; // Vem como string separada por vírgula do backend
    numeroDiasTratamento: number; // Era numeroDias
    dataInicio: string; // Formato YYYY-MM-DD (LocalDate)
    horaInicio: string; // Formato YYYY-MM-DDTHH:mm:ss ou similar (LocalDateTime) -> Ajustar parse/format
    observacoes: string;
    status: 'Ativo' | 'Inativo';
    idUser: number;
};

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
      if (endpoint.includes('usuario') || endpoint.includes('consulta') || endpoint.includes('receita')) return null;
      if (options?.method === 'DELETE') return false;
      return []; // Para listas
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
          // Não precisa enviar idUser
          // dataNascimento já está YYYY-MM-DD
      };
      return fetchApi('/usuario', {
          method: 'POST',
          body: JSON.stringify(payload),
      });
  }, [fetchApi]);

  const atualizarUsuario = useCallback(async (idUser: number, usuarioData: Partial<Omit<Usuario, 'idUser' | 'senha'>>): Promise<Usuario | null> => {
      // Ajustar o payload
      const payload = { ...usuarioData };
      // Remover campos não editáveis se existirem
      delete payload.cpf;
      delete payload.nome;
      delete payload.tipoUsuario;
      // dataNascimento precisa estar no formato YYYY-MM-DD se for alterável

      return fetchApi(`/usuario/${idUser}`, {
          method: 'PUT', // Java Resource usa PUT para update
          body: JSON.stringify(payload),
      });
  }, [fetchApi]);


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


    const atualizarConsulta = useCallback(async (consultaId: number, dadosAtualizados: Partial<Omit<LembreteConsulta, 'idConsulta' | 'idUser'>>): Promise<LembreteConsulta | null> => {
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
            dias: novaReceita.dias.join(','), // Enviar como string para o backend
            // Ajustar formato de horaInicio se necessário
        };
        return fetchApi('/receita', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }, [fetchApi]);


    const atualizarReceita = useCallback(async (receitaId: number, dadosAtualizados: Partial<Omit<LembreteReceita, 'idReceita' | 'idUser'>>): Promise<LembreteReceita | null> => {
        const payload = {
            ...dadosAtualizados,
            // Se 'dias' foi atualizado, converte para string
            ...(dadosAtualizados.dias && { dias: dadosAtualizados.dias.join(',') }),
            // Ajustar formato de horaInicio se necessário
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
    getUsuarioPorCpf,
    getUsuarioPorId,
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