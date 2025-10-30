import { useState, useEffect, useCallback } from 'react';
import { useApiConsultas } from './useApiConsultas';
import { useAuthCheck } from './useAuthCheck';
import type { LembreteConsulta, Usuario } from '../types/lembretes';

export const useConsultas = () => {
    const { listarConsultas } = useApiConsultas();
    const { usuarioApi } = useAuthCheck();

    const [lembretesConsultas, setLembretesConsultas] = useState<LembreteConsulta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchConsultas = useCallback(async (user: Usuario) => {
        setLoading(true);
        setError(null);

        try {
            const consultasData = await listarConsultas(user.idUser);
            setLembretesConsultas(consultasData);
        } catch (err) {
            console.error('Erro ao buscar consultas:', err);
            setError('Erro ao carregar consultas');
        } finally {
            setLoading(false);
        }
    }, [listarConsultas]);

    useEffect(() => {
        if (usuarioApi && !hasFetched) {
            setHasFetched(true);
            fetchConsultas(usuarioApi);
        }
    }, [usuarioApi, hasFetched]);

    const refreshConsultas = useCallback(() => {
        if (usuarioApi) {
            fetchConsultas(usuarioApi);
        }
    }, [usuarioApi, fetchConsultas]);

    return {
        usuarioApi,
        lembretesConsultas,
        loading,
        error,
        refreshConsultas
    };
};
