import { useState, useEffect, useCallback } from 'react';
import { useApiReceitas } from './useApiReceitas';
import { useAuthCheck } from './useAuthCheck';
import type { LembreteReceita, Usuario } from '../types/lembretes';
import { useApiUsuarios } from './useApiUsuarios';

export const useReceitas = () => {
    const { listarReceitas } = useApiReceitas();
    const { usuarioApi } = useAuthCheck();
    const { getUsuarioPorCpf } = useApiUsuarios();

    const [lembretesReceitas, setLembretesReceitas] = useState<LembreteReceita[]>([]);
    const [paciente, setPaciente] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (usuarioApi && !hasFetched) {
            setHasFetched(true);
            setLoading(true);
            setError(null);
            setPaciente(null);

            const fetchDados = async () => {
                try {
                    if (usuarioApi.tipoUsuario === 'CUIDADOR' && usuarioApi.cpfPaciente) {
                        // É CUIDADOR, buscar dados do paciente
                        const pacienteEncontrado = await getUsuarioPorCpf(usuarioApi.cpfPaciente);
                        if (pacienteEncontrado) {
                            setPaciente(pacienteEncontrado);
                            const receitasData = await listarReceitas(pacienteEncontrado.idUser);
                            setLembretesReceitas(receitasData || []);
                        } else {
                            setError('Paciente vinculado não encontrado.');
                        }
                    } else if (usuarioApi.tipoUsuario === 'PACIENTE') {
                        // É PACIENTE, buscar próprios dados
                        const receitasData = await listarReceitas(usuarioApi.idUser);
                        setLembretesReceitas(receitasData || []);
                    }
                } catch {
                    console.error('Erro ao buscar receitas');
                    setError('Erro ao carregar receitas');
                } finally {
                    setLoading(false);
                }
            };
            
            fetchDados();
        } else if (!usuarioApi) {
             const cpfLogado = localStorage.getItem('cpfLogado');
             if (!cpfLogado) {
                  setLoading(false);
             }
        }
    }, [usuarioApi, hasFetched, getUsuarioPorCpf, listarReceitas]);

    const refreshReceitas = useCallback(async () => {
        setLoading(true);
        setError(null);
        const idParaBuscar = (usuarioApi?.tipoUsuario === 'CUIDADOR' && paciente) 
                             ? paciente.idUser 
                             : usuarioApi?.idUser;

        if (idParaBuscar) {
            try {
                const receitasData = await listarReceitas(idParaBuscar);
                setLembretesReceitas(receitasData || []);
            } catch {
                setError('Erro ao atualizar receitas');
            } finally {
                setLoading(false);
            }
        } else {
            setLembretesReceitas([]);
            setLoading(false);
        }
    }, [usuarioApi, paciente, listarReceitas]);

    return {
        usuarioApi,
        paciente,
        lembretesReceitas,
        loading,
        error,
        refreshReceitas
    };
};