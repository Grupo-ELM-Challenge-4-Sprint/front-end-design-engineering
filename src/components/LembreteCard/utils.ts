import type { LembreteConsulta, LembreteReceita } from '../../types/lembretes';

export const getProximosLembretes = (
  lembretesConsultas: LembreteConsulta[],
  lembretesReceitas: LembreteReceita[]
): { consultas: LembreteConsulta[]; receitas: LembreteReceita[] } => {
  const lembretesConsultaFiltrados = (lembretesConsultas || [])
    ?.filter((lembrete: LembreteConsulta) => lembrete.status.toLowerCase() === 'agendada')
    .sort((a: LembreteConsulta, b: LembreteConsulta) => {
      const dateA = new Date(`${a.data}T${a.hora}`);
      const dateB = new Date(`${b.data}T${b.hora}`);
      return dateA.getTime() - dateB.getTime();
    });

  const lembretesReceitaFiltrados = (lembretesReceitas || [])
    ?.filter((lembrete: LembreteReceita) => lembrete.status.toLowerCase() === 'ativo');

  return {
    consultas: lembretesConsultaFiltrados,
    receitas: lembretesReceitaFiltrados
  };
};