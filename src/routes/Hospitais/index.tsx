import { hospitais } from '../../data/hospitais';
import HospitalCard from '../../components/HospitalCard';

export default function Hospitais() {
  return (
    <main>
      {/* Seção de introdução às unidades hospitalares */}
      <section
        className='bg-[#e9f3fb] py-10 text-center md:text-[17px] lg:text-[20px]'
        data-guide-step="1"
        data-guide-title="Bem-vindo às Nossas Unidades"
        data-guide-text="Esta seção apresenta uma visão geral das nossas unidades hospitalares."
        data-guide-arrow="up">
        <div className="container">
          <h2>Nossas Unidades</h2>
          <p className='text-center md:text-[18px]'>
            Conheça as unidades do Hospital das Clínicas e escolha a mais próxima de você.
          </p>
        </div>
      </section>

      {/* Mapa interativo das unidades, com iframe do Google Maps */}
      <section className="py-5 sm:py-8 md:py-10 xl:py-12"
        data-guide-step="2"
        data-guide-title="Mapa Interativo"
        data-guide-text="Utilize o mapa para visualizar a localização de todas as nossas unidades e planejar sua rota."
        data-guide-arrow="up">
        <div className="container max-w-7xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1493.9251962264836!2d-46.67025976576064!3d-23.558067770266657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59b00d3aa487%3A0xfe715b43e354f823!2sHospital%20das%20Cl%C3%ADnicas%20FMUSP!5e0!3m2!1spt-BR!2sbr!4v1747314059376!5m2!1spt-BR!2sbr"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className='w-full block h-[220px] min-h-[180px] border-0 rounded-lg shadow-sm bg-gray-200 sm:h-[280px] md:h-[350px] xl:h-[400px]'
            />
        </div>
      </section>

      {/* Lista de unidades hospitalares em formato de cards otimizados */}
      <section className="py-5 bg-gray-50 md:py-10"
        data-guide-step="3"
        data-guide-title="Detalhes das Unidades"
        data-guide-text="Explore os cards abaixo para encontrar informações detalhadas sobre cada unidade, como endereço, telefone e horários de funcionamento."
        data-guide-arrow="up">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] md:gap-8">
            {hospitais.map((hospital, index) => (
              <HospitalCard key={hospital.id} hospital={hospital} index={index}/>
            ))}
          </div>
        </div>
      </section>

      {/* Seção com informações gerais sobre atendimento, documentos e agendamento */}
      <section className='py-5 md:py-10'
        data-guide-step="4"
        data-guide-title="Informações Gerais Importantes"
        data-guide-text="Leia estas informações sobre atendimento, documentos necessários e como funciona o agendamento em nossas unidades."
        data-guide-arrow="up">
        <div className="container">
          <div className="info-gerais-content bg-gray-200 p-5 rounded-2xl">
            <h2 className='text-center mb-7'>Informações Gerais</h2>

            <h3>Atendimento</h3>
            <p className='text-sm text-gray-800 mb-4 leading-relaxed md:text-[17px]'>
              O Hospital das Clínicas da FMUSP oferece atendimento em diversas especialidades médicas.
              Os pacientes são atendidos mediante encaminhamento da rede pública de saúde, através do sistema
              CROSS (Central de Regulação de Ofertas de Serviços de Saúde).
            </p>

            <h3>Documentos Necessários</h3>
            <ul>
              <li>Cartão SUS</li>
              <li>Documento de identidade com foto (RG ou CNH)</li>
              <li>CPF</li>
              <li>Comprovante de residência</li>
              <li>Encaminhamento médico (quando aplicável)</li>
            </ul>

            <h3>Agendamento</h3>
            <p className='text-sm text-gray-800 mb-4 leading-relaxed md:text-[17px]'>
              O agendamento de consultas e exames pode ser realizado através da central telefônica ou pelo
              site/aplicativo SimplesHC, onde você também pode acompanhar seus resultados e histórico médico.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
