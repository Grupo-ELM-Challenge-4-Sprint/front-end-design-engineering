import type { LembreteConsulta, LembreteReceita } from '../../types/lembretes';

export const getProximosLembretes = (
  lembretesConsultas: LembreteConsulta[],
  lembretesReceitas: LembreteReceita[]
): { consultas: LembreteConsulta[]; receitas: LembreteReceita[] } => {
  console.log('Input consultas:', lembretesConsultas);
  console.log('Input receitas:', lembretesReceitas);

  const lembretesConsultaFiltrados = (lembretesConsultas || [])
    ?.filter((lembrete: LembreteConsulta) => {
      const isAgendada = lembrete.status.toLowerCase() === 'agendada';
      console.log(`Consulta ${lembrete.idConsulta}: status="${lembrete.status}", isAgendada=${isAgendada}`);
      return isAgendada;
    })
    .sort((a: LembreteConsulta, b: LembreteConsulta) => {
      const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`);
      const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}`);
      return dateA.getTime() - dateB.getTime();
    });

  const lembretesReceitaFiltrados = (lembretesReceitas || [])
    ?.filter((lembrete: LembreteReceita) => {
      const isAtivo = lembrete.status.toLowerCase() === 'ativo';
      console.log(`Receita ${lembrete.idReceita}: status="${lembrete.status}", isAtivo=${isAtivo}`);
      return isAtivo;
    });

  console.log('Output consultas:', lembretesConsultaFiltrados);
  console.log('Output receitas:', lembretesReceitaFiltrados);

  return {
    consultas: lembretesConsultaFiltrados,
    receitas: lembretesReceitaFiltrados
  };
};