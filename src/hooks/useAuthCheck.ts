import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiUsuarios } from './useApiUsuarios';
import type { Usuario } from './useApiUsuarios';

let fetchPromise: Promise<Usuario | null> | null = null;

export const useAuthCheck = () => {
    const navigate = useNavigate();
    const { getUsuarioPorCpf } = useApiUsuarios();
    const [usuarioApi, setUsuarioApi] = useState<Usuario | null>(() => {
        const usuarioStorage = localStorage.getItem('usuarioApi');
        if (usuarioStorage) {
            try {
                return JSON.parse(usuarioStorage);
            } catch {
                localStorage.removeItem('usuarioApi');
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const cpfLogado = localStorage.getItem('cpfLogado');
        if (!cpfLogado) {
            navigate('/entrar');
            return;
        }

        if (usuarioApi) {
            return;
        }

        if (!fetchPromise) {
            // Se nenhuma busca estiver em andamento, inicie uma:
            fetchPromise = getUsuarioPorCpf(cpfLogado);
        }

        // Todas as instâncias do hook vão "escutar" a mesma promise
        fetchPromise.then((usuario) => {
            if (usuario) {
                setUsuarioApi(usuario);
                localStorage.setItem('usuarioApi', JSON.stringify(usuario));
            } else {
                // Se falhar (ex: 404), limpe tudo e mande para o login
                localStorage.removeItem('cpfLogado');
                localStorage.removeItem('usuarioApi');
                navigate('/entrar');
            }
            fetchPromise = null; // Libera a trava
        }).catch((error) => {
            console.error('Erro crítico ao buscar usuário:', error);
            fetchPromise = null; // Libera a trava
            navigate('/entrar');
        });

 }, [navigate, getUsuarioPorCpf, usuarioApi]); // Adiciona usuarioApi à dependência

    const setUsuarioApiAndStorage = (usuario: Usuario | null) => {
        setUsuarioApi(usuario);
        if (usuario) {
            localStorage.setItem('usuarioApi', JSON.stringify(usuario));
        } else {
            localStorage.removeItem('usuarioApi');
            localStorage.removeItem('cpfLogado'); // Também remove o CPF
            fetchPromise = null; // Limpa a trava no logout
        }
    };

 return { usuarioApi, setUsuarioApi: setUsuarioApiAndStorage };
};