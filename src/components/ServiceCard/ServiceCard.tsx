import React from 'react';
import { Link } from 'react-router-dom';
import type { Servico } from '../../data/servicos';

export default React.memo(function ServiceCard({ servico }: { servico: Servico; index: number }) {
  return (
    <article className="servico-card-pagina" role="article" aria-labelledby={`servico-${servico.id}-title`}>
      <div className="servico-card-icon-wrapper">
        <img src={servico.imagem} alt={servico.alt} className="servico-icon" loading="lazy" />
      </div>

      <div className="servico-card-content">
        <h3 id={`servico-${servico.id}-title`}>{servico.titulo}</h3>
        <p>{servico.descricao}</p>

        <Link to={servico.link} className="btn-saiba-mais" aria-label={`Acessar ${servico.titulo}`}>
          {servico.linkTexto} <span className="arrow-icon" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
});

