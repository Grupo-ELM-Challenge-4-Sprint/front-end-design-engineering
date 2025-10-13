export interface Hospital {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  horario: string;
  mapaUrl: string;
  imagem: string;
  alt: string;
}

export const hospitais: Hospital[] = [
  {
    id: 'vila-mariana',
    nome: 'IMREA Vila Mariana',
    endereco: 'Rua Domingo de Soto, 100 - Vila Mariana São Paulo/SP - CEP: 04026-080',
    telefone: '(11) 5549-0111',
    horario: 'Segunda a Sexta: 7h às 19h',
    mapaUrl: 'https://maps.app.goo.gl/yJ8ErztdASvJBuz17',
    imagem: '/img/imagens-hospitais/imrea-vila-mariana.png',
    alt: 'Fachada IMREA Vila Mariana'
  },
  {
    id: 'umarizal',
    nome: 'IMREA Umarizal',
    endereco: 'Rua Guaramembé, 589 - Umarizal São Paulo/SP - CEP: 05754-060',
    telefone: '(11) 3719-6060',
    horario: 'Segunda a Sexta: 7h às 19h',
    mapaUrl: 'https://maps.app.goo.gl/qSQCG7WwCpAy47w89',
    imagem: '/img/imagens-hospitais/imrea-umarizal.png',
    alt: 'Fachada IMREA Umarizal'
  },
  {
    id: 'lapa',
    nome: 'IMREA Lapa',
    endereco: 'Rua Guaicurus, 1274 - Lapa São Paulo/SP - CEP: 05033-002',
    telefone: '(11) 3838-7555',
    horario: 'Segunda a Sexta: 7h às 19h',
    mapaUrl: 'https://maps.app.goo.gl/R3sU1STb2zPuhboR6',
    imagem: '/img/imagens-hospitais/imrea-lapa.png',
    alt: 'Fachada IMREA Lapa'
  },
  {
    id: 'clinicas',
    nome: 'IMREA Clínicas',
    endereco: 'Rua Particular - Portão 3 do INRAD - Cerqueira César São Paulo/SP - CEP: 05403-010',
    telefone: '(11) 2661-1000',
    horario: 'Segunda a Sexta: 7h às 19h',
    mapaUrl: 'https://maps.app.goo.gl/ok3phCwsGKuYQLFL6',
    imagem: '/img/imagens-hospitais/imrea-clinicas.jpg',
    alt: 'Fachada IMREA Clínicas'
  }
];
