
// Definições de tipos para nossos lembretes
export interface LembreteConsulta {
    id: number;
    especialidade: string;
    medico: string;
    data: string; // Formato: DD-MM-AAAA
    hora: string; // Formato: HH:mm
    tipo: 'Presencial' | 'Teleconsulta';
    local: string;
    observacoes: string;
    status: 'Agendada' | 'Concluída';
};

export interface LembreteReceita {
    id: number;
    nome: string;
    instrucao: string;
};

export interface Paciente {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  senha: string;
  lembretesConsulta: LembreteConsulta[];
  lembretesReceita: LembreteReceita[];
}

// Objeto com dados dos pacientes, usando o CPF como chave
export const dadosPacientes: Record<string, Paciente> = {
  "39294208052": {
    nomeCompleto: "Enzo Okuizumi",
    cpf: "392.942.080-52",
    dataNascimento: "30/10/2006",
    email: "enzo.okuizumi@gmail.com",
    telefone: "(11) 98765-4321",
    senha: "123@mudar",
    lembretesConsulta: [
      {
        id: 1,
        especialidade: "Cardiologia",
        medico: "Dr. Ricardo Alves",
        data: "28/06/2025",
        hora: "10:00",
        tipo: 'Presencial',
        local: "HC Clínicas - Unidade Central",
        observacoes: "Trazer exames anteriores.",
        status: 'Agendada'
      },
      {
        id: 2,
        especialidade: "Clínica Geral",
        medico: "Dra. Ana Martins",
        data: "25/06/2025",
        hora: "14:30",
        tipo: 'Teleconsulta',
        local: "Teleconsulta",
        observacoes: "Verificar conexão antes.",
        status: 'Agendada'
      },
    ],
    lembretesReceita: [
      {
        id: 1,
        nome: "Losartana Potássica 50mg",
        instrucao: "1 comprimido, 1x ao dia",
      },
      {
        id: 2,
        nome: "Metformina 500mg",
        instrucao: "1 comprimido, 2x ao dia após as refeições",
      },
    ],
  },

  "76913995881": {
    nomeCompleto: "Lucas Barros Gouveia",
    cpf: "769.139.958-81",
    dataNascimento: "22/09/1992",
    email: "lucas.barros@example.com",
    telefone: "(11) 91234-5678",
    senha: "123@mudar",
    lembretesConsulta: [
      {
        id: 3,
        especialidade: "Dermatologia",
        medico: "Dra. Sofia Pereira",
        data: "25/03/2025",
        hora: "15:30",
        tipo: 'Teleconsulta',
        local: "Teleconsulta",
        observacoes: "Tenha boa iluminação no ambiente.",
        status: 'Agendada'
      },
    ],
    lembretesReceita: [
      {
        id: 3,
        nome: "Isotretinoína 20mg",
        instrucao: "1 cápsula ao dia, após o almoço",
      },
    ],
  },
  "60363928855": {
    nomeCompleto: "Milton Marcelino",
    cpf: "603.639.288-55",
    dataNascimento: "05/03/1978",
    email: "milton.marcelino@example.com",
    telefone: "(11) 90987-6543",
    senha: "123@mudar",
    lembretesConsulta: [],
    lembretesReceita: [],
  },
};

// Utilitários para persistência dos pacientes no localStorage
const PACIENTES_KEY = 'pacientes';

export function getPacientes(): Record<string, Paciente> {
  const local = localStorage.getItem(PACIENTES_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return { ...dadosPacientes };
    }
  }
  return { ...dadosPacientes };
}

export function setPacientes(pacientes: Record<string, Paciente>) {
  localStorage.setItem(PACIENTES_KEY, JSON.stringify(pacientes));
}

export function addPaciente(novo: Paciente) {
  const pacientes = getPacientes();
  // Remove pontos e traço do CPF para chave
  const cpfKey = novo.cpf.replace(/\D/g, '');
  pacientes[cpfKey] = novo;
  setPacientes(pacientes);
}

export function getPacientePorCpf(cpf: string): Paciente | undefined {
  const pacientes = getPacientes();
  // Aceita CPF com ou sem máscara
  const cpfKey = cpf.replace(/\D/g, '');
  return pacientes[cpfKey];
}