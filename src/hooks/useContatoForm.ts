import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contatoSchema = z.object({
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  assunto: z.string().min(1, "Assunto é obrigatório"),
  mensagem: z.string().min(1, "Mensagem é obrigatória"),
});

export type ContatoFormInputs = z.infer<typeof contatoSchema>;

export const useContatoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContatoFormInputs>({
    resolver: zodResolver(contatoSchema),
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    reset();
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isSubmitSuccessful,
    onSubmit,
    reset,
  };
};