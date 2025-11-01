import { useState, useEffect } from 'react';
import { useApiUsuarios } from './useApiUsuarios';
import { useUser } from './useUser';
import type { LembreteConsulta, LembreteReceita, Usuario } from './useApiUsuarios';

export const useLembretes = () => {
    const { listarConsultas, listarReceitas, getUsuarioPorCpf } = useApiUsuarios();
    const { usuarioApi } = useUser();

    const [paciente, setPaciente] = useState<Usuario | null>(null);
    const [lembretesConsultas, setLembretesConsultas] = useState<LembreteConsulta[]>([]);
    const [lembretesReceitas, setLembretesReceitas] = useState<LembreteReceita[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Buscar lembretes ao carregar
    useEffect(() => {
        if (usuarioApi) {
            setLoading(true);
            setError(null);

            // Se for cuidador e tiver paciente vinculado, buscar lembretes do paciente
            if (usuarioApi.tipoUsuario === 'CUIDADOR' && usuarioApi.cpfPaciente) {
                getUsuarioPorCpf(usuarioApi.cpfPaciente).then((paciente) => {
                    if (paciente) {
                        setPaciente(paciente);
                        Promise.all([
                            listarConsultas(paciente.id),
                            listarReceitas(paciente.id)
                        ]).then(([consultas, receitas]) => {
                            setLembretesConsultas(consultas);
                            setLembretesReceitas(receitas);
                            setLoading(false);
                        }).catch(() => {
                            setError('Erro ao carregar lembretes');
                            setLoading(false);
                        });
                    } else {
                        setLoading(false);
                    }
                });
            } else {
                Promise.all([
                    listarConsultas(usuarioApi.id),
                    listarReceitas(usuarioApi.id)
                ]).then(([consultas, receitas]) => {
                    setLembretesConsultas(consultas);
                    setLembretesReceitas(receitas);
                    setLoading(false);
                }).catch(() => {
                    setError('Erro ao carregar lembretes');
                    setLoading(false);
                });
            }
        }
    }, [usuarioApi, getUsuarioPorCpf, listarConsultas, listarReceitas]);

    const refreshLembretes = () => {
        if (usuarioApi) {
            const usuarioId = (usuarioApi.tipoUsuario === 'CUIDADOR' && paciente) ? paciente.id : usuarioApi.id;
            Promise.all([
                listarConsultas(usuarioId),
                listarReceitas(usuarioId)
            ]).then(([consultas, receitas]) => {
                setLembretesConsultas(consultas);
                setLembretesReceitas(receitas);
            }).catch(() => {
                setError('Erro ao atualizar lembretes');
            });
        }
    };

    return {
        paciente,
        lembretesConsultas,
        lembretesReceitas,
        loading,
        error,
        refreshLembretes
    };
};