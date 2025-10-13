import React from 'react';
import { Link } from 'react-router-dom';
import type { Hospital } from '../../data/hospitais';

export default React.memo(function HospitalCard({ hospital, index }: { hospital: Hospital; index: number }) {
  return (
    <article className="unidade-card" role="article" aria-labelledby={`hospital-${hospital.id}-title`}>
      <img src={hospital.imagem} className="fachada-hospitais" alt={hospital.alt} loading="lazy" />

      <div className="unidade-card-content">
        <h3 id={`hospital-${index}-title`} className="unidade-card-title">
          {hospital.nome}
        </h3>

        <p className="unidade-card-info">
          <img src="https://www.svgrepo.com/show/294650/location.svg" alt="ícone localização" className="info-icon" />
          {hospital.endereco}
        </p>

        <p className="unidade-card-info">
          <img src="https://www.svgrepo.com/show/435962/telephone.svg" alt="ícone telefone" className="info-icon" />
          {hospital.telefone}
        </p>

        <p className="unidade-card-info">
          <img src="https://www.svgrepo.com/show/521539/calendar-time.svg" alt="ícone horário" className="info-icon" />
          {hospital.horario}
        </p>

        <Link to={hospital.mapaUrl} className="btn-ver-no-mapa" target="_blank" rel="noopener noreferrer" aria-label={`Ver ${hospital.nome} no mapa`} >
          Ver no mapa <span className="arrow-icon">↗</span>
        </Link>
      </div>
    </article>
  );
});
