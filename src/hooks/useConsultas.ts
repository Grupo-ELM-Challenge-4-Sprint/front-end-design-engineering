import { useState, useEffect, useCallback } from 'react';
import { useApiConsultas } from './useApiConsultas';
import { useAuthCheck } from './useAuthCheck';
import type { LembreteConsulta, Usuario } from '../types/lembretes';
import { useApiUsuarios } from './useApiUsuarios';

export const useConsultas = () => {
    const { listarConsultas } = useApiConsultas();
    const { usuarioApi } = useAuthCheck();
    const { getUsuarioPorCpf } = useApiUsuarios();

    const [lembretesConsultas, setLembretesConsultas] = useState<LembreteConsulta[]>([]);
    const [paciente, setPaciente] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (usuarioApi && !hasFetched) {
            setHasFetched(true);
            setLoading(true);
            setError(null);
            setPaciente(null); // Reseta o paciente

            const fetchDados = async () => {
                try {
                    if (usuarioApi.tipoUsuario === 'CUIDADOR' && usuarioApi.cpfPaciente) {
                        // É CUIDADOR, buscar dados do paciente
                        const pacienteEncontrado = await getUsuarioPorCpf(usuarioApi.cpfPaciente);
                        if (pacienteEncontrado) {
                            setPaciente(pacienteEncontrado);
                            const consultasData = await listarConsultas(pacienteEncontrado.idUser);
                            setLembretesConsultas(consultasData || []);
                        } else {
                            setError('Paciente vinculado não encontrado.');
                        }
                    } else if (usuarioApi.tipoUsuario === 'PACIENTE') {
                        // É PACIENTE, buscar próprios dados
                        const consultasData = await listarConsultas(usuarioApi.idUser);
                        setLembretesConsultas(consultasData || []);
                    }
                    // Se for cuidador sem paciente, não faz nada, listas ficam vazias
                } catch {
                    console.error('Erro ao buscar consultas');
                    setError('Erro ao carregar consultas');
                } finally {
                    setLoading(false);
                }
            };
            
            fetchDados();
        } else if (!usuarioApi) {
             // Se o usuário não estiver carregado, pare o loading
             const cpfLogado = localStorage.getItem('cpfLogado');
             if (!cpfLogado) {
                  setLoading(false);
             }
        }
    }, [usuarioApi, hasFetched, getUsuarioPorCpf, listarConsultas]);

    const refreshConsultas = useCallback(async () => {
        setLoading(true);
        setError(null);
        // Determina qual ID usar (paciente se existir, senão o próprio usuário)
        const idParaBuscar = (usuarioApi?.tipoUsuario === 'CUIDADOR' && paciente) 
                             ? paciente.idUser 
                             : usuarioApi?.idUser;

        if (idParaBuscar) {
            try {
                const consultasData = await listarConsultas(idParaBuscar);
                setLembretesConsultas(consultasData || []);
            } catch {
                setError('Erro ao atualizar consultas');
            } finally {
                setLoading(false);
            }
        } else {
            setLembretesConsultas([]);
            setLoading(false);
        }
    }, [usuarioApi, paciente, listarConsultas]);

    return {
        usuarioApi,
        paciente,
        lembretesConsultas,
        loading,
        error,
        refreshConsultas
    };
};