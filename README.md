# SimplesHC - Sprint 4 - Front-End Design Engineering

## Sobre o Projeto

O [SimplesHC](https://github.com/Grupo-ELM-Challenge-4-Sprint/front-end-design-engineering) é uma plataforma web desenvolvida como parte da disciplina de Front-End Design Engineering. Seu principal objetivo é oferecer uma interface digital intuitiva e acessível para os serviços do Hospital das Clínicas, com foco especial em pacientes idosos ou com baixa familiaridade com tecnologia.

A solução busca simplificar processos como agendamento de consultas, acesso a resultados de exames, visualização de receitas médicas e participação em teleconsultas. Tudo isso é feito com base em uma abordagem centrada no usuário, prezando por clareza, simplicidade e inclusão digital.

Utilizando React, TailwindCSS, Vite e TypeScript, o projeto entrega uma experiência leve, responsiva e funcional, incluindo recursos avançados como um guia interativo, um FAQ prático, suporte via Watson Assistant, notificações push para lembretes, sistema de vinculação cuidador-paciente e API simulada para desenvolvimento.

Mais do que uma atividade acadêmica, o SimplesHC tem como missão promover impacto social real, facilitando o acesso à saúde digital e contribuindo para a redução do absenteísmo em consultas via teleconsulta no Hospital HC.

---

## Tecnologias Utilizadas

- React 19.1.1
- React Router DOM 7.9.4
- React Hook Form 7.65.0
- TailwindCSS 4.1.14
- Vite 7.1.7
- TypeScript 5.9.3
- Zod 4.1.12
- ESLint

---

## 👥 Integrantes da Equipe

<table>
  <tr>
    <th>Foto</th>
    <th>Nome</th>
    <th>RM</th>
    <th>Turma</th>
    <th>GitHub</th>
    <th>LinkedIn</th>
  </tr>
  <tr>
    <td align="center">
      <img src="public/img/imagens-integrantes/foto-enzo.jpeg" width="100px" alt="Foto de Enzo"/>
    </td>
    <td>Enzo Okuizumi</td>
    <td>561432</td>
    <td>1TDSPG</td>
    <td><a href="https://github.com/EnzoOkuizumiFiap">EnzoOkuizumiFiap</a></td>
    <td><a href="https://www.linkedin.com/in/enzo-okuizumi-b60292256/">Enzo Okuizumi</a></td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/img/imagens-integrantes/foto-lucas.jpg" width="100px" alt="Foto de Lucas"/>
    </td>
    <td>Lucas Barros Gouveia</td>
    <td>566422</td>
    <td>1TDSPG</td>
    <td><a href="https://github.com/LuzBGouveia">LuzBGouveia</a></td>
    <td><a href="https://www.linkedin.com/in/luz-barros-gouveia-09b147355/">Lucas Barros Gouveia</a></td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/img/imagens-integrantes/foto-milton.jpeg" width="100px" alt="Foto de Milton"/>
    </td>
    <td>Milton Marcelino</td>
    <td>564836</td>
    <td>1TDSPG</td>
    <td><a href="https://github.com/MiltonMarcelino">MiltonMarcelino</a></td>
    <td><a href="http://linkedin.com/in/milton-marcelino-250298142">Milton Marcelino</a></td>
  </tr>
</table>

---

## Imagens e Ícones

As imagens e ícones utilizados no projeto estão localizados na pasta `public/img`. A estrutura da pasta é organizada da seguinte forma:

```
public/img/
├── icons/              # Ícones do site, como favicon e outros elementos gráficos
├── imagem-index/       # Imagens usadas na página inicial, incluindo logos
├── imagens-hospitais/  # Fotos das unidades hospitalares do Hospital das Clínicas
├── imagens-integrantes/# Fotos dos membros da equipe de desenvolvimento
└── tutoriais/          # Imagens ilustrativas dos tutoriais de uso da plataforma
```

---

## Estrutura de Pastas do Projeto

```
/
├── public/
│   └── img/ # Imagens e ícones
├── src/
│   ├── components/ # Componentes React reutilizáveis
│   │   ├── Cabecalho/
│   │   ├── forms/
│   │   ├── GuiaInterativo/
│   │   ├── HospitalCard/
│   │   ├── LembreteCard/
│   │   ├── Loading/
│   │   ├── Painel/
│   │   ├── Rodape/
│   │   ├── TutorialCard/
│   │   ├── VinculacaoCuidador/
│   │   └── Watson/
│   ├── data/ # Dados estáticos (hospitais, tutoriais, FAQ)
│   ├── hooks/ # Hooks customizados para API, autenticação, validação
│   │   ├── useApiBase.ts
│   │   ├── useApiConsultas.ts
│   │   ├── useApiReceitas.ts
│   │   ├── useApiUsuarios.ts
│   │   ├── useAuthCheck.ts
│   │   ├── useConsultas.ts
│   │   ├── useContatoForm.ts
│   │   ├── useInputMasks.ts
│   │   ├── useReceitas.ts
│   │   └── index.ts
│   ├── routes/ # Páginas da aplicação
│   │   ├── Consultas/
│   │   ├── Contato/
│   │   ├── Entrar/
│   │   ├── Error/
│   │   ├── Faq/
│   │   ├── Home/
│   │   ├── Hospitais/
│   │   ├── Integrantes/
│   │   ├── Perfil/
│   │   ├── Receitas/
│   │   └── Tutoriais/
│   ├── schemas/ # Esquemas de validação com Zod
│   ├── types/ # Tipos TypeScript
│   ├── utils/ # Utilitários (datas, strings)
│   ├── App.tsx # Componente principal
│   ├── globals.css # Estilos globais
│   ├── main.tsx # Ponto de entrada
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── README.md
```

---

## Explicações do Sistema

### Seção 1: Rotas

#### `Home/index.tsx`
- **Função:** Página inicial do sistema, apresenta o propósito do site e acesso rápido.
- **Principais funcionalidades:**
  - Seção principal com resumo do propósito e botões para área do paciente e unidades.
  - Apresenta serviços principais oferecidos.
  - Seção de acessibilidade com guia interativo e linguagem acessível.
  - Depoimentos de pacientes.
- **Exemplo de uso:** Página inicial acessível a todos os usuários.

#### `Hospitais/index.tsx`
- **Função:** Página que apresenta as unidades hospitalares do Hospital das Clínicas.
- **Principais funcionalidades:**
  - Introdução às unidades hospitalares.
  - Mapa interativo com localização das unidades.
  - Cards com detalhes das unidades (endereço, telefone, horários).
  - Informações gerais sobre atendimento, documentos e agendamento.
- **Exemplo de uso:** Página para consulta das unidades hospitalares.


#### `Integrantes/index.tsx`
- **Função:** Página que apresenta os integrantes da equipe de desenvolvimento.
- **Principais funcionalidades:**
  - Apresentação da equipe com fotos, nomes, RM, turma e redes sociais.
  - Seção sobre o projeto, objetivos, tecnologias e impacto social.
- **Exemplo de uso:** Página para conhecer a equipe responsável pelo projeto.

#### `Faq/index.tsx`
- **Função:** Página de perguntas frequentes para esclarecer dúvidas comuns.
- **Principais funcionalidades:**
  - Lista de perguntas e respostas em formato de acordeão.
  - Link para contato caso a dúvida não seja resolvida.
- **Exemplo de uso:** Página para consulta rápida de dúvidas.

#### `Contato/index.tsx`
- **Função:** Página de contato para envio de mensagens e informações institucionais.
- **Principais funcionalidades:**
  - Formulário de contato com validação usando hook customizado `useContatoForm` e esquemas reutilizáveis de `validationSchemas.ts`.
  - Informações de endereço, telefones, email, horário e redes sociais.
- **Exemplo de uso:** Página para contato direto com a equipe.

---

### Seção 2: Componentes Principais do Sistema

#### `Cabecalho.tsx`
- **Função:** Componente de cabeçalho (header) da aplicação.
- **Principais funcionalidades:**
  - Logo e navegação principal do sistema.
  - Menu de navegação com links para páginas principais.
  - Design responsivo e acessível.
- **Exemplo de uso:** Utilizado em todas as páginas públicas do sistema.

#### `Rodape.tsx`
- **Função:** Componente de rodapé (footer) da aplicação.
- **Principais funcionalidades:**
  - Informações institucionais do Hospital das Clínicas.
  - Links para redes sociais e contato.
  - Informações de copyright e políticas.
- **Exemplo de uso:** Utilizado em todas as páginas do sistema.

#### `HospitalCard.tsx`
- **Função:** Componente para exibir informações de unidades hospitalares.
- **Principais funcionalidades:**
  - Exibe dados da unidade (nome, endereço, telefone, horários).
  - Design responsivo com hover effects.
  - Integração com dados de localização.
- **Exemplo de uso:** Utilizado na página de Hospitais para listar as unidades.


---


### Seção 3: Login e Cadastro

#### `Entrar/index.tsx`
- **Função:** Página que gerencia os formulários de login e cadastro.
- **Principais funcionalidades:**
  - Alterna entre formulários de login e cadastro.
  - Valida dados de entrada com regras customizadas usando esquemas reutilizáveis de `validationSchemas.ts`.
  - Gerencia estado dos formulários e mensagens de status.
  - Realiza autenticação e cadastro de pacientes.
- **Exemplo de uso:** Página para autenticação e criação de conta.

#### `LoginForm.tsx`
- **Função:** Componente de formulário de login.
- **Principais funcionalidades:**
  - Campos para CPF e senha.
  - Validação usando esquemas reutilizáveis de `validationSchemas.ts` e mensagens de erro.
  - Botão para alternar visibilidade da senha.
  - Navegação para cadastro.
- **Exemplo de uso:** Usado na página de login.

#### `CadastroForm.tsx`
- **Função:** Componente de formulário de cadastro de pacientes.
- **Principais funcionalidades:**
  - Campos para dados pessoais (nome, CPF, email, telefone).
  - Validação de dados em tempo real usando esquemas reutilizáveis de `validationSchemas.ts`.
  - Integração com sistema de autenticação.
- **Exemplo de uso:** Utilizado na página de cadastro/login.

#### `PasswordField.tsx`
- **Função:** Componente reutilizável para campos de senha com toggle de visibilidade.
- **Principais funcionalidades:**
  - Campo de input para senha.
  - Botão para mostrar ou ocultar a senha.
  - Exibe mensagens de erro.
- **Exemplo de uso:** Usado em formulários de login e cadastro.

---

## Rotas Principais do Sistema

O sistema possui as seguintes rotas principais, acessíveis na área do paciente após login:

- `/perfil`: Página para visualização e edição dos dados pessoais do paciente.
- `/tutoriais`: Lista de tutoriais para auxiliar o uso do portal.
- `/consultas`: Gerenciamento de lembretes de consultas, com funcionalidades para adicionar, editar, remover e marcar consultas como concluídas.
- `/receitas`: Gerenciamento de lembretes de medicamentos e receitas médicas, com funcionalidades para adicionar, editar e remover lembretes.

Cada rota utiliza o layout `PacientePage` para manter a consistência visual e inclui suporte para o guia interativo que auxilia o usuário na navegação.

---

### Seção 4: Área do Usuário e Perfil

#### `PacientePage.tsx`
- **Função:** Componente de layout para a área do paciente.
- **Principais funcionalidades:**
  - Renderiza a barra lateral de navegação (PacienteSidebar).
  - Exibe o conteúdo principal passado como filhos.
- **Exemplo de uso:** Usado para estruturar páginas da área restrita do paciente.

---

#### `PacienteSidebar.tsx`
- **Função:** Barra lateral de navegação da área do paciente.
- **Principais funcionalidades:**
  - Links para seções como Meus Dados, Tutoriais, Receitas e Consultas.
  - Botão de logout que limpa autenticação e redireciona para a página inicial.
  - Inclui atributos para guia interativo.
- **Exemplo de uso:** Usado em PacientePage para navegação do usuário.

---

#### `Perfil/index.tsx`
- **Função:** Página para visualização e edição dos dados do paciente.
- **Principais funcionalidades:**
  - Verifica autenticação e redireciona se não autenticado.
  - Carrega dados do paciente logado.
  - Permite editar email e telefone com botões de salvar e cancelar.
  - Sistema de notificações push para lembretes de consultas e medicamentos, com toggle para ativar/desativar.
  - Gerenciamento de permissões do navegador para notificações.
  - Verificação automática de lembretes a cada minuto quando o sistema está ativado.
  - Utiliza PacientePage para layout.
- **Exemplo de uso:** Página acessível na área do paciente para gerenciar perfil e configurações de notificações.

---

### Seção 5: Rotas de Tutoriais, Consultas e Receitas

#### `Tutoriais/index.tsx`
- **Função:** Página que exibe a lista de tutoriais para o usuário.
- **Principais funcionalidades:**
  - Verifica autenticação do usuário.
  - Exibe uma grade de cards de tutoriais.
  - Utiliza o layout PacientePage.
  - Inclui atributos para guia interativo.
- **Exemplo de uso:** Acessível na área do paciente para consulta de tutoriais.

#### `TutorialCard.tsx`
- **Função:** Componente de apresentação para exibir um card de tutorial.
- **Principais funcionalidades:**
  - Exibe título do tutorial.
  - Link para acessar o tutorial.
  - Estilização com efeitos de hover e responsividade.
- **Exemplo de uso:** Usado na página de tutoriais para listar os tutoriais disponíveis.

---

#### `Consultas/index.tsx`
- **Função:** Página para gerenciamento de lembretes de consultas.
- **Principais funcionalidades:**
  - Verifica autenticação do usuário.
  - Exibe lista de lembretes de consultas.
  - Permite adicionar, editar, remover e marcar lembretes como concluídos.
  - Utiliza modal para adicionar/editar lembretes.
  - Utiliza o layout PacientePage.
  - Inclui atributos para guia interativo.
- **Exemplo de uso:** Acessível na área do paciente para gerenciar consultas.

---

#### `Receitas/index.tsx`
- **Função:** Página para gerenciamento de lembretes de medicamentos e receitas.
- **Principais funcionalidades:**
  - Verifica autenticação do usuário.
  - Exibe lista de lembretes de medicamentos.
  - Permite adicionar, editar e remover lembretes.
  - Utiliza modal para adicionar/editar lembretes.
  - Utiliza o layout PacientePage.
  - Inclui atributos para guia interativo.
- **Exemplo de uso:** Acessível na área do paciente para gerenciar receitas e medicamentos.

---

### Seção 6: Hooks Customizados de Autenticação e Formulários e Hooks auxiliares

#### `useAuthCheck.ts`
- **Função:** Hook para gerenciar estado de autenticação do usuário.
- **Principais funcionalidades:**
  - Verifica se o usuário está logado via localStorage.
  - Fornece função para logout que limpa dados e redireciona para login.
  - Função para checar autenticação e redirecionar se não autenticado.
- **Exemplo de uso:** Usado em componentes que precisam controlar acesso e logout.

---

#### `useInputMasks.ts`
- **Função:** Hook para aplicar máscaras de entrada em campos de formulário.
- **Principais funcionalidades:**
  - Máscaras para CPF, telefone e data.
  - Função para aplicar a máscara correta com base no tipo de campo.
  - Função para identificar o tipo de máscara a partir do nome do campo.
- **Exemplo de uso:** Usado em formulários para formatar entradas de CPF, telefone e data em tempo real.

#### `useContatoForm.ts`
- **Função:** Hook customizado para gerenciar o formulário de contato.
- **Principais funcionalidades:**
  - Centraliza toda lógica do formulário de contato (validações, submissão, estados).
  - Exporta tipo `ContatoFormInputs` para tipagem consistente.
  - Implementa validações específicas para cada campo (nome, email, telefone, assunto, mensagem) usando esquemas reutilizáveis de `validationSchemas.ts`.
  - Gerencia estados de loading (`isSubmitting`) e sucesso (`isSubmitSuccessful`).
  - Função `onSubmit` com simulação de envio e reset automático do formulário.
- **Exemplo de uso:** Usado no componente `Contato/index.tsx` para gerenciar o formulário.

---

### Seção 7: Guia Interativo e Watson Assistant

#### `GuiaInterativo.tsx`
- **Função:** Implementa um guia interativo que destaca elementos da interface e orienta o usuário.
- **Principais funcionalidades:**
  - Detecta elementos com atributos específicos para criar passos do guia.
  - Exibe balão de informações com título, texto e setas posicionadas dinamicamente.
  - Permite navegação entre passos, conclusão e opção de pular o guia.
  - Garante acessibilidade e foco nos elementos destacados.
- **Exemplo de uso:** Incluído em páginas que possuem o guia interativo para ajudar na navegação.

#### `Watson.tsx`
- **Função:** Componente que integra o assistente Watson para suporte ao usuário.
- **Principais funcionalidades:**
  - Exibe interface de chat para interação com o assistente.
  - Gerencia estado da conversa e respostas.
  - Fornece suporte contextual para dúvidas dos usuários.
- **Exemplo de uso:** Usado para oferecer suporte interativo dentro do sistema.

---

## Credenciais para Teste

Para testar o sistema, utilize as seguintes credenciais de login:

### Logar como CUIDADOR:
- **CPF:** 98181573030
- **Senha:** 123@Mudar

### Logar como PACIENTE:
- **CPF:** 89399370070
- **Senha:** 123@Mudar

Após o login, você poderá explorar as funcionalidades da área do paciente, como perfil, tutoriais, consultas e receitas.

--- 

## Links Importantes

- Repositório GitHub: [https://github.com/Grupo-ELM-Challenge-4-Sprint/front-end-design-engineering](https://github.com/Grupo-ELM-Challenge-4-Sprint/front-end-design-engineering)

- Link Vercel: [https://front-end-design-engineering-one.vercel.app/](https://front-end-design-engineering-one.vercel.app/)

- Vídeo no YouTube: [https://www.youtube.com/watch?v=9jOQ2IKvZqk](https://youtu.be/M4-xU4W9nk4)

---
## Como instalar / rodar o SimplesHC?

Para rodar o projeto localmente, siga os passos abaixo:

1. Clone o repositório:
   `git clone https://github.com/Grupo-ELM-Challenge-4-Sprint/front-end-design-engineering.git`

2. Instale as dependências:
   `npm install`

3. Inicie o servidor de desenvolvimento:
   `npm run dev`

4. Abra o navegador e acesse:
   `http://localhost:5173`
