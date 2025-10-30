export interface Usuario {
  idUser: number;
  cpf: string;
  nome: string;
  senha?: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  tipoUsuario: 'PACIENTE' | 'CUIDADOR';
  cpfPaciente?: string | null;
  cpfCuidador?: string | null;
}

export type LembreteConsulta = {
  idConsulta: number;
  especialidade: string;
  medico: string;
  data: string;
  hora: string;
  tipo: 'Presencial' | 'Teleconsulta';
  local: string;
  observacoes: string;
  status: 'Agendada' | 'Concluída';
  idUser: number;
};

export type LembreteReceita = {
  idReceita: number;
  nomeMedicamento: string;
  frequenciaHoras: number;
  dias: string[];
  numeroDiasTratamento: number;
  dataInicio: string;
  horaInicio: string;
  observacoes: string;
  status: 'Ativo' | 'Inativo';
  idUser: number;
};

export type FormDataConsulta = {
  tipoConsulta: 'Presencial' | 'Teleconsulta';
  especialidadeConsulta: string;
  medicoConsulta: string;
  dataConsulta: string;
  horaConsulta: string;
  localConsulta: string;
  observacoesConsulta: string;
};

export type FormDataReceita = {
  nomeMedicamento: string;
  frequenciaHoras: number;
  dias: string[];
  numeroDiasTratamento: number;
  dataInicio: string;
  horaInicio: string;
  observacoes: string;
};
