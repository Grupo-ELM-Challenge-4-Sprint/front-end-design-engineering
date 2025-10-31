import { useState, useEffect } from 'react';
import { useApiUsuarios } from './useApiUsuarios';
import type { Usuario } from './useApiUsuarios';

export const useUser = () => {
    const { getUsuarioPorCpf } = useApiUsuarios();
    const [usuarioApi, setUsuarioApi] = useState<Usuario | null>(null);

    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (cpfLogado) {
            getUsuarioPorCpf(cpfLogado).then(setUsuarioApi);
        }
    }, [getUsuarioPorCpf]);

    return { usuarioApi, setUsuarioApi };
};
