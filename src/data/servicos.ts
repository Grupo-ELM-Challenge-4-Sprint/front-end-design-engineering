export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  link: string;
  linkTexto: string;
  imagem: string;
  alt: string;
}

export const servicos: Servico[] = [
  {
    id: 'receitas',
    titulo: 'Receitas',
    descricao: 'Acesse e gerencie suas receitas de forma digital, com lembretes automáticos para não esquecer seus medicamentos.',
    link: '/receitas',
    linkTexto: 'Adicione agora',
    imagem: 'https://www.svgrepo.com/show/533389/calendar-days.svg',
    alt: 'Ícone Receitas'
  },
  {
    id: 'teleconsulta',
    titulo: 'Teleconsulta',
    descricao: 'Adicione Lembretes para suas consultas online e receba notificações para não perder seus atendimentos.',
    link: '/consultas',
    linkTexto: 'Conhecer serviço',
    imagem: 'https://www.svgrepo.com/show/529662/laptop.svg',
    alt: 'Ícone Teleconsulta'
  },
  {
    id: 'tutoriais',
    titulo: 'Tutoriais',
    descricao: 'Aprenda a usar todos os recursos do Portal do PacienteHC. Desde o cadastro até o agendamento de consultas.',
    link: '/tutoriais',
    linkTexto: 'Ver Tutoriais',
    imagem: 'https://www.svgrepo.com/show/421931/medical-medical-record.svg',
    alt: 'Ícone Tutoriais'
  },
  {
    id: 'atendimento-24h',
    titulo: 'Atendimento 24h',
    descricao: 'Emergências médicas atendidas 24 horas por dia, em todas as unidades HC.',
    link: '/hospitais',
    linkTexto: 'Ver unidades',
    imagem: 'https://www.svgrepo.com/show/425565/costumer-service-customer-helpdesk.svg',
    alt: 'Ícone Atendimento 24h'
  },
  {
    id: 'especialidades',
    titulo: 'Especialidades',
    descricao: 'Mais de 40 especialidades médicas com profissionais renomados e equipamentos de última geração.',
    link: '/hospitais',
    linkTexto: 'Conhecer especialidades',
    imagem: 'https://www.svgrepo.com/show/453043/doctor-f.svg',
    alt: 'Ícone Especialidades'
  },
  {
    id: 'unidades-hc',
    titulo: 'Unidades HC',
    descricao: 'Conheça todas as unidades do Hospital das Clínicas espalhadas pela cidade.',
    link: '/hospitais',
    linkTexto: 'Ver no mapa',
    imagem: 'https://www.svgrepo.com/show/533487/hospital.svg',
    alt: 'Ícone Unidades HC'
  }
];
