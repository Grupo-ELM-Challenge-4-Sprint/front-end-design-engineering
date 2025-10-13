export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    id: 'cadastro',
    question: "Como faço para me cadastrar no Portal do Paciente HC?",
    answer: "Para se cadastrar no Portal do Paciente HC, você precisa comparecer a uma unidade IMREA do Hospital das Clínicas com seus documentos pessoais (RG e CPF) e cartão do SUS. Após confirmar seus dados, você receberá um código de acesso para criar sua conta online."
  },
  {
    id: 'senha',
    question: "Esqueci minha senha, como recupero o acesso?",
    answer: "Na tela de login do Portal do Paciente HC, clique em \"Esqueci minha senha\". Você receberá um link de recuperação no e-mail cadastrado. Caso não tenha acesso ao e-mail, entre em contato com o suporte ou compareça a uma unidade IMREA com seus documentos."
  },
  {
    id: 'receitas',
    question: "Posso adicionar lembretes para minhas receitas médicas pelo SimplesHC?",
    answer: "Sim, as suas receitas médicas podem ser adicionadas no SimplesHC na seção \"Receitas\" depois de entrar no sistema. Você pode visualizá-las, adicionar novas receitas e configurar lembretes para renovação."
  },
  {
    id: 'teleconsulta',
    question: "Como adicionar lembretes para minhas teleconsultas?",
    answer: "Para adicionar um lembrete para sua teleconsulta, clique em Entrar no SimplesHC, insira seus dados de Login e acesse a seção \"consulta\" e clique em \"Adicionar Lembrete\". Adicione as informações da consulta e configure o lembrete para ser notificado com antecedência."
  },
  {
    id: 'guia-interativo',
    question: "O que é o guia interativo e como funciona?",
    answer: "O guia interativo é um assistente visual que explica cada função e recurso disponível, ajudando especialmente quem tem pouca familiaridade com tecnologia. Você pode ativá-lo ou desativá-lo a qualquer momento clicando no ícone de acessibilidade (♿) no canto inferior esquerdo."
  },
  {
    id: 'tutoriais',
    question: "Onde encontro os tutoriais para usar o Portal?",
    answer: "Os tutoriais estão disponíveis na seção \"Tutoriais\" do SimplesHC. Lá você encontra guias passo a passo sobre como instalar o App HC, fazer login, acessar os serviços, participar de teleconsultas e usar todas as funcionalidades. Os tutoriais são escritos em linguagem simples e incluem imagens explicativas."
  },
  {
    id: 'dispositivos',
    question: "Posso usar o SimplesHC em qualquer dispositivo?",
    answer: "Sim, o SimplesHC é responsivo e funciona em computadores, tablets e smartphones. Basta acessar o site ou baixar o aplicativo, disponível para Android e iOS."
  }
];
