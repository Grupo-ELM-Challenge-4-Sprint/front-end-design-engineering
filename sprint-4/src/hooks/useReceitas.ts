import { useState, useEffect, useCallback } from 'react';
import { useApiReceitas } from './useApiReceitas';
import { useAuthCheck } from './useAuthCheck';
import type { LembreteReceita, Usuario } from '../types/lembretes';

export const useReceitas = () => {
    const { listarReceitas } = useApiReceitas();
    const { usuarioApi } = useAuthCheck();

    const [lembretesReceitas, setLembretesReceitas] = useState<LembreteReceita[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchReceitas = useCallback(async (user: Usuario) => {
        setLoading(true);
        setError(null);

        try {
            const receitasData = await listarReceitas(user.idUser);
            setLembretesReceitas(receitasData);
        } catch (err) {
            console.error('Erro ao buscar receitas:', err);
            setError('Erro ao carregar receitas');
        } finally {
            setLoading(false);
        }
    }, [listarReceitas]);

    useEffect(() => {
        if (usuarioApi && !hasFetched) {
            setHasFetched(true);
            fetchReceitas(usuarioApi);
        }
    }, [usuarioApi, hasFetched]);

    const refreshReceitas = useCallback(() => {
        if (usuarioApi) {
            fetchReceitas(usuarioApi);
        }
    }, [usuarioApi, fetchReceitas]);

    return {
        usuarioApi,
        lembretesReceitas,
        loading,
        error,
        refreshReceitas
    };
};
