import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

export type ContatoFormInputs = {
  nomeCompleto: string;
  email: string;
  telefone?: string;
  assunto: string;
  mensagem: string;
};

export const useContatoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContatoFormInputs>();

  const onSubmit: SubmitHandler<ContatoFormInputs> = async () => {
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