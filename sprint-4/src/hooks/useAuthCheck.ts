import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiUsuarios } from './useApiUsuarios';
import type { Usuario } from './useApiUsuarios';

export const useAuthCheck = () => {
    const navigate = useNavigate();
    const { getUsuarioPorCpf } = useApiUsuarios();
    const [usuarioApi, setUsuarioApi] = useState<Usuario | null>(null);

    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (!cpfLogado) {
            navigate('/entrar');
            return;
        }

        // Tentar buscar usuário do localStorage primeiro
        const usuarioStorage = localStorage.getItem('usuarioApi');
        if (usuarioStorage) {
            try {
                const usuario = JSON.parse(usuarioStorage);
                setUsuarioApi(usuario);
            } catch (error) {
                console.error('Erro ao parsear usuário do localStorage:', error);
                localStorage.removeItem('usuarioApi');
            }
        } else {
            // Buscar da API e armazenar
            getUsuarioPorCpf(cpfLogado).then((usuario) => {
                if (usuario) {
                    setUsuarioApi(usuario);
                    localStorage.setItem('usuarioApi', JSON.stringify(usuario));
                }
            }).catch((error) => {
                console.error('Erro ao buscar usuário:', error);
            });
        }
    }, [navigate, getUsuarioPorCpf]);

    const setUsuarioApiAndStorage = (usuario: Usuario | null) => {
        setUsuarioApi(usuario);
        if (usuario) {
            localStorage.setItem('usuarioApi', JSON.stringify(usuario));
        } else {
            localStorage.removeItem('usuarioApi');
        }
    };

    return { usuarioApi, setUsuarioApi: setUsuarioApiAndStorage };
};
