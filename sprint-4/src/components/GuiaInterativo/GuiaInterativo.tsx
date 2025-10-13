import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import '../../globals.css';

// --- Interfaces e Tipos ---
interface GuiaInterativoProps {
  iniciar?: boolean;
  onConcluir?: () => void;
  chaveGuia?: string;
}

interface PassoGuia {
  elemento: HTMLElement;
  passo: number;
  titulo: string;
  texto: string;
  posicaoSetaPreferida: string;
}

interface Posicao {
  top: number;
  left: number;
}

// --- Funções Auxiliares ---
const marcarGuiaComoVisto = (chave: string): void => localStorage.setItem(chave, 'true');

// Uma margem para garantir que o balão não cole nas bordas da tela
const MARGEM_VIEWPORT = 10;

export default function GuiaInterativo({ iniciar = false, onConcluir, chaveGuia = 'guiaPrincipal' }: GuiaInterativoProps) {
    const [passos, setPassos] = useState<PassoGuia[]>([]);
    const [passoAtualIndex, setPassoAtualIndex] = useState<number>(0);
    const [estaAtivo, setEstaAtivo] = useState<boolean>(false);
    const [posicaoBalao, setPosicaoBalao] = useState<Posicao>({ top: -9999, left: -9999 }); // Inicia fora da tela
    const [posicaoSetaFinal, setPosicaoSetaFinal] = useState<string>('down');
    
    const elementoDestacadoRef = useRef<HTMLElement | null>(null);
    const balaoRef = useRef<HTMLDivElement | null>(null);
    // Ref para o timeout de fallback, para podermos limpá-lo
    const fallbackTimeoutRef = useRef<number | null>(null);

    // --- LÓGICA PRINCIPAL ---

    // Função robusta para calcular a posição do balão
    const calcularEPosicionarBalao = useCallback(() => {
      if (!estaAtivo || passos.length === 0 || !balaoRef.current) return;

      const passoAtual = passos[passoAtualIndex];
      const elementoAlvo = passoAtual.elemento;
      const balaoEl = balaoRef.current;

      const rect = elementoAlvo.getBoundingClientRect();
      // Usamos getComputedStyle para obter as dimensões reais, que é mais confiável
      const balaoRect = balaoEl.getBoundingClientRect();
      
      let posicaoSeta = passoAtual.posicaoSetaPreferida;
      let top = 0, left = 0;

      // 1. LÓGICA DE FLIP AUTOMÁTICO: Decide se inverte a posição para caber na tela
      if (posicaoSeta === 'down' && rect.top - balaoRect.height - MARGEM_VIEWPORT < 0) {
        posicaoSeta = 'up'; // Não cabe em cima, inverte para baixo
      } else if (posicaoSeta === 'up' && rect.bottom + balaoRect.height + MARGEM_VIEWPORT > window.innerHeight) {
        posicaoSeta = 'down'; // Não cabe embaixo, inverte para cima
      }
      
      setPosicaoSetaFinal(posicaoSeta);

      // 2. CÁLCULO INICIAL DA POSIÇÃO
      const gap = 15;
      switch (posicaoSeta) {
          case 'up':
              top = rect.bottom + gap;
              left = rect.left + (rect.width / 2) - (balaoRect.width / 2);
              break;
          // Adicionar casos 'left' e 'right' se necessário, com lógica de flip similar
          default: // down
              top = rect.top - balaoRect.height - gap;
              left = rect.left + (rect.width / 2) - (balaoRect.width / 2);
              break;
      }

      // 3. CORREÇÃO DE BOUNDARY (LIMITES): Garante que NUNCA saia da tela
      if (left < MARGEM_VIEWPORT) {
        left = MARGEM_VIEWPORT;
      }
      if (left + balaoRect.width > window.innerWidth - MARGEM_VIEWPORT) {
        left = window.innerWidth - balaoRect.width - MARGEM_VIEWPORT;
      }
      if (top < MARGEM_VIEWPORT) {
        top = MARGEM_VIEWPORT;
      }
      if (top + balaoRect.height > window.innerHeight - MARGEM_VIEWPORT) {
        top = window.innerHeight - balaoRect.height - MARGEM_VIEWPORT;
      }

      setPosicaoBalao({ top, left });
    }, [estaAtivo, passoAtualIndex, passos]);

    // Efeito para iniciar e coletar os passos
    useEffect(() => {
        if (iniciar) {
            const elementosDoGuia = document.querySelectorAll<HTMLElement>('[data-guide-step]');
            const passosData: PassoGuia[] = Array.from(elementosDoGuia).map(el => ({
                elemento: el,
                passo: parseInt(el.dataset.guideStep || '0', 10),
                titulo: el.dataset.guideTitle || 'Dica Rápida',
                texto: el.dataset.guideText || 'Veja este elemento importante.',
                posicaoSetaPreferida: el.dataset.guideArrow || 'down',
            })).sort((a, b) => a.passo - b.passo);

            if (passosData.length > 0) {
                setPassos(passosData);
                setPassoAtualIndex(0);
                setEstaAtivo(true);
                document.body.classList.add('guia-ativo-no-scroll');
            }
        }
    }, [iniciar]);

    // Efeito principal que gerencia o passo atual
    useEffect(() => {
        if (!estaAtivo || passos.length === 0) return;

        // Limpa destaque anterior
        if (elementoDestacadoRef.current) {
            elementoDestacadoRef.current.classList.remove('guia-elemento-destacado');
        }

        const passoAtual = passos[passoAtualIndex];
        const elementoAlvo = passoAtual.elemento;

        elementoAlvo.classList.add('guia-elemento-destacado');
        elementoDestacadoRef.current = elementoAlvo;

        // O evento 'scrollend' dispara QUANDO a rolagem TERMINA.
        const onScrollEnd = () => {
          if(fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current); // Limpa o fallback
          calcularEPosicionarBalao();
        };

        // Adicionamos o listener ANTES de rolar
        document.addEventListener('scrollend', onScrollEnd, { once: true });

        elementoAlvo.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        
        // Adicionamos um fallback caso o evento 'scrollend' não dispare (ex: elemento já visível)
        fallbackTimeoutRef.current = window.setTimeout(() => {
          document.removeEventListener('scrollend', onScrollEnd);
          calcularEPosicionarBalao();
        }, 400);

        // Listener para redimensionamento da tela (importante para mobile)
        window.addEventListener('resize', calcularEPosicionarBalao);
        
        // Função de limpeza do useEffect: remove os listeners para evitar memory leaks
        return () => {
            if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
            document.removeEventListener('scrollend', onScrollEnd);
            window.removeEventListener('resize', calcularEPosicionarBalao);
        };
    }, [passoAtualIndex, estaAtivo, passos, calcularEPosicionarBalao]);
    
    // --- Handlers de Ação ---

    const handleConcluir = (marcarComoVisto: boolean) => {
        if (marcarComoVisto) {
            marcarGuiaComoVisto(chaveGuia);
        }
        if (elementoDestacadoRef.current) {
            elementoDestacadoRef.current.classList.remove('guia-elemento-destacado');
        }
        document.body.classList.remove('guia-ativo-no-scroll');
        setEstaAtivo(false);
        if (onConcluir) onConcluir();
    };

    const handleProximo = () => {
        if (passoAtualIndex < passos.length - 1) {
            setPassoAtualIndex(passoAtualIndex + 1);
        } else {
            handleConcluir(true);
        }
    };

    const handleAnterior = () => {
        if (passoAtualIndex > 0) {
            setPassoAtualIndex(passoAtualIndex - 1);
        }
    };

    if (!estaAtivo || passos.length === 0) {
        return null;
    }

    const passoAtual = passos[passoAtualIndex];
    const estiloBalao: React.CSSProperties = {
    top: `${posicaoBalao.top}px`,
    left: `${posicaoBalao.left}px`,
    visibility: posicaoBalao.top === -9999 ? 'hidden' : 'visible',
    };

    return createPortal(
        <div className="guia-overlay">
            <div ref={balaoRef} id="guia-balao" className="guia-balao" style={estiloBalao}>
                <div className={`guia-seta guia-seta-${posicaoSetaFinal}`}></div>
                <div className="guia-conteudo">
                    <h3 className="guia-titulo">{passoAtual.titulo}</h3>
                    <p className="guia-texto">{passoAtual.texto}</p>
                </div>
                <div className="guia-navegacao">
                    <button onClick={handleAnterior} className="guia-btn-anterior" disabled={passoAtualIndex === 0}>
                        Anterior
                    </button>
                    <span className="guia-contador">{passoAtualIndex + 1} / {passos.length}</span>
                    <button onClick={handleProximo} className="guia-btn-proximo">
                        {passoAtualIndex === passos.length - 1 ? 'Concluir' : 'Próximo'}
                    </button>
                </div>
                <div className="guia-pular">
                    <button onClick={() => handleConcluir(true)}>Pular Guia / Não mostrar novamente</button>
                </div>
            </div>
        </div>,
        document.body
    );
}