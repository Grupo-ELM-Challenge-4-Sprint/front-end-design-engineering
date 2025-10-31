import { z } from 'zod';

// Validações utilitárias
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

const validateCpf = (cpf: string) => {
  const cleanCpf = cpf.replace(/[^\d]+/g, '');
  if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false;

  let sum = 0;
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cleanCpf.substring(10, 11));
};

const validateDate = (dateString: string) => {
  if (!dateRegex.test(dateString)) return false;

  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (year < 1900 || year > new Date().getFullYear() || month === 0 || month > 12) {
    return false;
  }

  const monthLength = [31, (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day > 0 && day <= monthLength[month - 1];
};

// Esquema para Login
export const loginSchema = z.object({
  loginCpf: z
    .string()
    .min(1, { message: 'CPF é obrigatório.' })
    .refine((cpf) => cpfRegex.test(cpf), { message: 'CPF deve estar no formato 000.000.000-00.' })
    .refine(validateCpf, { message: 'CPF inválido.' }),
  loginSenha: z
    .string()
    .min(1, { message: 'Senha é obrigatória.' }),
});

// Esquema para Cadastro
export const cadastroSchema = z
  .object({
    cadastroNomeCompleto: z
      .string()
      .min(1, { message: 'Nome completo é obrigatório.' })
      .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
    cadastroCpf: z
      .string()
      .min(1, { message: 'CPF é obrigatório.' })
      .refine((cpf) => cpfRegex.test(cpf), { message: 'CPF deve estar no formato 000.000.000-00.' })
      .refine(validateCpf, { message: 'CPF inválido.' }),
    dataNascimento: z
      .string()
      .min(1, { message: 'Data de nascimento é obrigatória.' })
      .refine((date) => dateRegex.test(date), { message: 'Data deve estar no formato dd/mm/yyyy.' })
      .refine(validateDate, { message: 'Data inválida.' }),
    tipoUsuario: z.enum(['PACIENTE', 'CUIDADOR'], {
      message: 'Tipo de usuário deve ser PACIENTE ou CUIDADOR.',
    }),
    cadastroEmail: z
      .string()
      .min(1, { message: 'Email é obrigatório.' })
      .email({ message: 'Email inválido.' }),
    cadastroTelefone: z
      .string()
      .min(1, { message: 'Telefone é obrigatório.' }),
    cadastroSenha: z
      .string()
      .min(1, { message: 'Senha é obrigatória.' })
      .max(10, { message: 'Senha deve ter no máximo 10 caracteres.' })
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Senha deve conter letras maiúsculas, minúsculas e números.' }),
    confirmarSenha: z
      .string()
      .min(1, { message: 'Confirmação de senha é obrigatória.' }),
  })
  .refine((data) => data.cadastroSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

// Tipos inferidos
export type LoginFormData = z.infer<typeof loginSchema>;
export type CadastroFormData = z.infer<typeof cadastroSchema>;
