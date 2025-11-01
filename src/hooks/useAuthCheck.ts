import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApiUsuarios } from './useApiUsuarios';
import type { Usuario } from './useApiUsuarios';

let fetchPromise: Promise<Usuario | null> | null = null;

// Definir rotas públicas que não exigem login
const PUBLIC_PATHS = ['/', '/entrar', '/hospitais', '/tutoriais', '/integrantes', '/faq', '/contato'];

export const useAuthCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

        // Verificar se a rota atual é pública (incluindo sub-rotas de /tutoriais)
        const isPublicPath = PUBLIC_PATHS.includes(location.pathname) || location.pathname.startsWith('/tutoriais/');

        if (!cpfLogado) {
            // Só redirecionar se NÃO ESTIVER em uma rota pública
            if (!isPublicPath) {
                navigate('/entrar');
            }
            return; // Parar a execução se não estiver logado
        }

        // Se estiver logado (cpfLogado existe)
        if (usuarioApi) {
            return; // Já temos os dados do usuário
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
                // Se falhar (ex: 404), limpe tudo
                localStorage.removeItem('cpfLogado');
                localStorage.removeItem('usuarioApi');
                // E só redirecione se não estiver numa página pública
                if (!isPublicPath) {
                    navigate('/entrar');
                }
            }
            fetchPromise = null; // Libera a trava
        }).catch((error) => {
            console.error('Erro crítico ao buscar usuário:', error);
            fetchPromise = null; // Libera a trava
            if (!isPublicPath) {
                navigate('/entrar');
            }
        });

    }, [navigate, getUsuarioPorCpf, usuarioApi, location.pathname]);

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

    const logout = () => {
        setUsuarioApiAndStorage(null);
        navigate('/entrar');
    };

    return { usuarioApi, setUsuarioApi: setUsuarioApiAndStorage, logout };
};