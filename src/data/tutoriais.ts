export interface TutorialItem {
  id: string;
  title: string;
  to: string;
}

export const tutorials: TutorialItem[] = [
  { id: 'cadastro', title: 'Como se cadastrar no app HC?', to: '/tutoriais/cadastro' },
  { id: 'login', title: 'Como fazer login no app HC?', to: '/tutoriais/login' },
  { id: 'esqueceu-senha', title: 'Esqueceu a sua senha?', to: '/tutoriais/esqueceu-senha' },
  { id: 'teleconsulta', title: 'Como acessar a teleconsulta no app HC?', to: '/tutoriais/teleconsulta' },
  { id: 'resultados-exames', title: 'Como acessar os meus resultados de exames?', to: '/tutoriais/resultados-exames' },
  { id: 'receitas', title: 'Como acessar as minhas receitas?', to: '/tutoriais/receitas' },
  { id: 'agendas', title: 'Como acessar minhas agendas?', to: '/tutoriais/agendas' },
  { id: 'solicitar-exames', title: 'Como solicitar exames no app HC?', to: '/tutoriais/solicitar-exames' },
  { id: 'documentos', title: 'Como acessar os meus documentos no app HC', to: '/tutoriais/documentos' },
];

export interface TutorialStep {
  title: string;
  description: string;
  image?: string;
}

export interface TutorialDetail {
  id: string;
  heading: string;
  videoTitle?: string;
  videoUrl?: string;
  intro?: string;
  steps: TutorialStep[];
}

export const tutorialDetails: TutorialDetail[] = [
  {
    id: 'cadastro',
    heading: 'Como se cadastrar no app HC?',
    videoTitle: 'Tutorial em vídeo de cadastro no App HC',
    videoUrl: 'https://www.youtube.com/embed/FYQlRGjazhA',
    intro: 'Veja como criar sua conta rapidamente.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Informe seus dados pessoais', 
        description: 'Insira CPF e em seguida clique em Localizar Paciente.',
        image: '/img/tutoriais/cadastro-etapa02.png'
      },
      { 
        title: 'Dados de contato', 
        description: 'Adicione e-mail e telefone.',
        image: '/img/tutoriais/cadastro-etapa03.png'
      },
      { 
        title: 'Selecione o nome da mãe', 
        description: 'Em seguida selecione a alternativa correta que corresponde ao nome completo de sua mãe.',
        image: '/img/tutoriais/cadastro-etapa04.png'
      },
      { 
        title: 'Selecione o ano de nascimento', 
        description: 'Em seguida selecione qual alternativa correta é o ano de seu nascimento.',
        image: '/img/tutoriais/cadastro-etapa05.png'
      },
      { 
        title: 'Crie uma senha segura', 
        description: 'Crie uma senha de acesso e confirme a mesma no próximo campo. Para finalizar clique no botão CADASTRAR SENHA.',
        image: '/img/tutoriais/cadastro-etapa06.png'
      },
      { 
        title: 'Cadastro Concluído com sucesso!', 
        description: 'Ao concluir com sucesso a etapa de cadastro a tela será apresentada. Clique no botão ACESSAR AGORA.',
        image: '/img/tutoriais/cadastro-etapa07.png'
      },
    ],
  },
  {
    id: 'login',
    heading: 'Como fazer login no app HC?',
    videoTitle: 'Tutorial em vídeo de como fazer Login do App HC',
    videoUrl: 'https://youtube.com/embed/LMpKeZiGxSc',
    intro: 'Siga os passos abaixo para acessar sua conta com CPF e senha.',
    steps: [
      { 
        title: 'Acesse a tela de login', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Digite seu CPF e sua senha', 
        description: 'Informe o CPF e senha no campo indicado e clique em Acessar.',
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Acesso realizado com sucesso', 
        description: 'Você será redirecionado para a tela de Início.',
        image: '/img/tutoriais/login-etapa03.png'
      },
    ],
  },

  {
    id: 'esqueceu-senha',
    heading: 'Esqueceu a sua senha?',
    intro: 'Veja como redefinir sua senha com segurança.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Toque em Esqueci minha senha', 
        description: "Na tela de login, toque em 'Esqueci minha senha' para iniciar a recuperação.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Digite seu CPF', 
        description: 'Informe seu CPF corretamente para validação.',
      },
      { 
        title: 'Digite sua data de nascimento', 
        description: 'Preencha sua data de nascimento e toque em Localizar Paciente.',
      },
      { 
        title: 'Crie uma nova senha', 
        description: 'Defina e confirme uma nova senha forte para sua conta.',
      },
    ],
  },

  {
    id: 'teleconsulta',
    heading: 'Como acessar a teleconsulta no app HC?',
    videoTitle: 'Tutorial em vídeo de teleconsulta no App HC',
    videoUrl: 'https://youtube.com/embed/LMpKeZiGxSc',
    intro: 'Aprenda como agendar e participar de consultas online.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Faça login e acesse o Menu', 
        description: "Após fazer login no Portal do Paciente HC, clique em 'Menu'.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Clique na opção \'Teleconsultas\'', 
        description: "No menu do Portal, clique na opção 'Teleconsultas'.",
        image: '/img/tutoriais/teleconsulta-etapa03.png'
      },
      { 
        title: 'Verifique teleconsultas agendadas', 
        description: 'Verifique se há teleconsultas agendadas na sua agenda e clique em Entrar na consulta.',
        image: '/img/tutoriais/teleconsulta-etapa04.png'
      },
      { 
        title: 'Sala de espera virtual', 
        description: 'Aguarde na sala de espera virtual até o início da consulta com o profissional de saúde.',
        image: '/img/tutoriais/teleconsulta-etapa05.png'
      },
    ],
  },

  {
    id: 'resultados-exames',
    heading: 'Como acessar os meus resultados de exames?',
    videoTitle: 'Tutorial em vídeo de como acessar seus resultados de Exames do App HC',
    videoUrl: 'https://www.youtube.com/embed/cjJ9VXAIiy4?si=6Vi5FCQMw021xuWD',
    intro: 'Veja como visualizar seus resultados de exames de forma rápida e segura.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Faça login e acesse o Menu', 
        description: "Após fazer login no Portal do Paciente HC, clique em 'Menu'.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Clique em \'Meus Resultados\'', 
        description: "No menu do Portal, clique na opção 'Meus Resultados'.",
      },
      { 
        title: 'Selecione e Visualize os Resultados', 
        description: 'Selecione e Visualize os Resultados de Exames de Laboratório ou Imagem.',
      },
      { 
        title: 'Visualize os Resultados detalhadamente', 
        description: 'Visualize os Resultados de Exames com data, descrição e status do laudo.',
      },
    ],
  },

  {
    id: 'receitas',
    heading: 'Como acessar as minhas receitas?',
    intro: 'Aprenda como visualizar e gerenciar suas receitas médicas.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Faça login e acesse o Menu', 
        description: "Após fazer login no Portal do Paciente HC, clique em 'Menu'.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Clique na opção \'Minhas Receitas\'', 
        description: "No menu do Portal, clique na opção 'Minhas Receitas'.",
      },
      { 
        title: 'Veja a lista de prescrições', 
        description: 'Veja a lista de prescrições com medicamentos, dosagens e validade.',
      },
      { 
        title: 'Visualize prescrições ativas/Inativas', 
        description: 'Visualize prescrições ativas/Inativas e, quando aplicável, instruções de uso.',
      },
    ],
  },

  {
    id: 'agendas',
    heading: 'Como acessar minhas agendas?',
    intro: 'Veja como consultar e gerenciar seus agendamentos médicos.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Faça login e acesse o Menu', 
        description: "Após fazer login no Portal do Paciente HC, clique em 'Menu'.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Clique na opção \'Minhas Agendas\'', 
        description: "No menu do Portal, clique na opção 'Minhas Agendas'.",
      },
      { 
        title: 'Consulte data, hora, local e especialidade', 
        description: 'Consulte data, hora, local e especialidade dos atendimentos.',
      },
      { 
        title: 'Verifique orientações específicas', 
        description: 'Verifique orientações específicas do exame/consulta, quando houver.',
      },
    ],
  },

  {
    id: 'solicitar-exames',
    heading: 'Como solicitar exames no app HC?',
    intro: 'Aprenda como solicitar exames médicos de forma prática.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Faça login e acesse o Menu', 
        description: "Após fazer login no Portal do Paciente HC, clique em 'Menu'.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Clique na opção \'Solicitação de Exames\'', 
        description: "No menu do Portal, clique na opção 'Solicitação de Exames'.",
      },
      { 
        title: 'Verifique orientações', 
        description: 'Verifique orientações: alguns exames exigem guia médica e agendamento.',
      },
      { 
        title: 'Acompanhe solicitações', 
        description: "Acompanhe solicitações e, após a coleta/realização, consulte 'Resultados'.",
      },
    ],
  },

  {
    id: 'documentos',
    heading: 'Como acessar os meus documentos no app HC',
    intro: 'Veja como acessar e gerenciar seus documentos médicos.',
    steps: [
      { 
        title: 'Clique em Acessar Portal', 
        description: 'Abra o app e toque em Acessar Portal.',
        image: '/img/tutoriais/abrirHC-etapa01.png'
      },
      { 
        title: 'Faça login e acesse o Menu', 
        description: "Após fazer login no Portal do Paciente HC, clique em 'Menu'.",
        image: '/img/tutoriais/login-etapa02.png'
      },
      { 
        title: 'Clique na opção \'Documentos\'', 
        description: "No menu do Portal, clique na opção 'Documentos'.",
      },
      { 
        title: 'Em seguida clique em \'Meus Documentos\'', 
        description: "Em seguida clique em 'Meus Documentos'.",
      },
    ],
  },

];


