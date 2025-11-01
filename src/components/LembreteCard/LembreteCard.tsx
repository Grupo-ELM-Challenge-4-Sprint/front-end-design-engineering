import type { LembreteConsulta, LembreteReceita } from '../../hooks/useApiUsuarios';

export const CardConsulta = ({ lembrete }: { lembrete: LembreteConsulta }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <img src="https://www.svgrepo.com/show/528080/calendar.svg" alt="ícone consulta" className="w-6 h-6 mr-3 text-indigo-600" />
        <h4 className="text-lg font-semibold text-indigo-800">{lembrete.especialidade}</h4>
        {lembrete.tipo === 'Teleconsulta' && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Teleconsulta</span>
        )}
      </div>
      <div className="space-y-2 text-sm text-slate-700">
        <p><strong>Médico:</strong> {lembrete.medico}</p>
        <p><strong>Data:</strong> {lembrete.data} às {lembrete.hora}</p>
        <p><strong>Local:</strong> {lembrete.local}</p>
        {lembrete.observacoes && <p><strong>Obs:</strong> {lembrete.observacoes}</p>}
      </div>
    </div>
  );
};

export const CardReceita = ({ lembrete }: { lembrete: LembreteReceita }) => {
  const getNextDose = () => {
    const now = new Date();
    const startDateTime = new Date(lembrete.dataHoraInicio);
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const selectedDays = lembrete.dias.map(d => daysOfWeek.indexOf(d));

    let nextDayIndex = now.getDay();
    let daysAhead = 0;
    while (!selectedDays.includes(nextDayIndex)) {
      nextDayIndex = (nextDayIndex + 1) % 7;
      daysAhead++;
      if (daysAhead > 7) break;
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysAhead);

    let doseTime = new Date(nextDate);
    doseTime.setHours(startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);

    if (daysAhead === 0 && doseTime <= now) {
      const freqHours = lembrete.frequencia;
      const diffHours = (now.getTime() - doseTime.getTime()) / (1000 * 60 * 60);
      const intervalsPassed = Math.ceil(diffHours / freqHours);
      doseTime.setHours(startDateTime.getHours() + intervalsPassed * freqHours, startDateTime.getMinutes());
    }

    return {
      date: nextDate.toLocaleDateString('pt-BR'),
      time: doseTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const nextDose = getNextDose();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <img src="https://www.svgrepo.com/show/527687/document-add.svg" alt="ícone receita" className="w-6 h-6 mr-3 text-green-600" />
        <h4 className="text-lg font-semibold text-green-800">{lembrete.nome}</h4>
      </div>
      <div className="space-y-2 text-sm text-slate-700">
        <p><strong>Frequência:</strong> {lembrete.frequencia}</p>
        <p><strong>Próxima Dose:</strong> {nextDose.date} às {nextDose.time}</p>
        {lembrete.observacoes && <p><strong>Obs:</strong> {lembrete.observacoes}</p>}
      </div>
    </div>
  );
};

export const ReceitaCard = ({
  lembrete,
  handleOpenEditModal,
  handleConcluirLembrete,
  handleReativarLembrete,
  handleRemoveLembrete
}: {
  lembrete: LembreteReceita;
  handleOpenEditModal: (lembrete: LembreteReceita) => void;
  handleConcluirLembrete: (id: number) => void;
  handleReativarLembrete: (id: number) => void;
  handleRemoveLembrete: (id: number) => void;
}) => {
  const getNextDose = (lembrete: LembreteReceita): { date: string; time: string } => {
    const now = new Date(); // Hora local atual
    // Assume que a string armazenada representa a hora local de início correta
    const startDateTime = new Date(lembrete.dataHoraInicio);

    // Calcula a data/hora final do tratamento
    const endDateTime = new Date(startDateTime);
    endDateTime.setDate(endDateTime.getDate() + lembrete.numeroDias);

    // 1. Verifica se o tratamento já foi concluído
    if (now >= endDateTime) {
        return { date: 'Concluído', time: '' };
    }

    // 2. Verifica se o tratamento ainda não começou
    if (now < startDateTime) {
        return {
            date: startDateTime.toLocaleDateString('pt-BR'),
            time: startDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
    }

    // 3. Calcula a próxima dose válida a partir de agora
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const selectedDayIndices = lembrete.dias.map(d => daysOfWeek.indexOf(d));
    const freqHours = lembrete.frequencia; // Usa o número diretamente

    // Começa o cálculo a partir da hora de início
    let nextDoseTime = new Date(startDateTime);

    // Adiciona a frequência em horas até encontrar uma dose que:
    // a) Seja no futuro (posterior a 'agora')
    // b) Caia em um dia da semana selecionado
    let iterations = 0;
    // Limite de segurança para evitar loops infinitos (ex: 1 ano de doses)
    const maxIterations = Math.ceil((365 * 24) / (freqHours > 0 ? freqHours : 24));

    while ( (nextDoseTime <= now || !selectedDayIndices.includes(nextDoseTime.getDay())) && iterations < maxIterations ) {
        // Se a frequência for 0 ou inválida, quebra o loop para evitar erro
        if (freqHours <= 0) {
           console.error("Frequência inválida (<= 0) para o lembrete:", lembrete.id);
           return { date: 'Erro Freq.', time: '' };
        }
        nextDoseTime.setHours(nextDoseTime.getHours() + freqHours);

        // Se ao adicionar a frequência, passamos do fim do tratamento, marca como concluído
        if (nextDoseTime >= endDateTime) {
            return { date: 'Concluído', time: '' };
        }
        iterations++;
    }

    // Se atingir o limite de iterações, algo deu errado
    if (iterations >= maxIterations) {
         console.error("Não foi possível encontrar a próxima dose dentro do limite para o lembrete:", lembrete.id);
         return { date: 'Erro Calc.', time: '' };
    }

    // Encontrou a próxima dose válida
    return {
        date: nextDoseTime.toLocaleDateString('pt-BR'),
        time: nextDoseTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
};

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Cabeçalho do Card */}
      <div className="p-4 md:p-5 flex justify-between items-center bg-slate-50/80 border-b border-slate-200">
        <h3 className="text-lg font-bold text-indigo-800">
          {lembrete.nome}
        </h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${lembrete.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
          {lembrete.status}
        </span>
      </div>

      {/* Corpo do Card */}
      <div className="p-4 md:p-5 space-y-3 text-slate-700">
        <p><strong className="card-body">Frequência:</strong> {lembrete.frequencia}</p>
        <p><strong className="card-body">Dias:</strong> {lembrete.dias.sort((a, b) => ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].indexOf(a) - ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].indexOf(b)).join(', ')}</p>
        <p><strong className="card-body">Data e Hora de Início:</strong> {new Date(lembrete.dataHoraInicio).toLocaleString('pt-BR')}</p>
        <p><strong className="card-body">Duração:</strong> {lembrete.numeroDias} dias</p>
        {lembrete.observacoes && (
          <p><strong className="card-body">Observações:</strong> {lembrete.observacoes}</p>
        )}
        {(() => {
          const nextDose = getNextDose(lembrete);
          return <p className="text-indigo-600 font-semibold bg-indigo-50 p-2 rounded-md"><strong>Próxima Dose:</strong> {nextDose.date} às {nextDose.time}</p>;
        })()}
      </div>

      {/* Rodapé do Card */}
      <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col md:flex-row justify-end items-center gap-3">
        {lembrete.status === 'Ativo' ? (
          <>
            <button onClick={() => handleOpenEditModal(lembrete)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Alterar
            </button>
            <button onClick={() => handleConcluirLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Desativar
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleReativarLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Reativar
            </button>
            <button onClick={() => handleRemoveLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full md:w-auto cursor-pointer">
              Remover Lembrete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const ConsultaCard = ({
  lembrete,
  handleOpenEditModal,
  handleConcluirLembrete,
  handleReverterLembrete,
  handleRemoveLembrete
}: {
  lembrete: LembreteConsulta;
  handleOpenEditModal: (lembrete: LembreteConsulta) => void;
  handleConcluirLembrete: (id: number) => void;
  handleReverterLembrete: (id: number) => void;
  handleRemoveLembrete: (id: number) => void;
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Cabeçalho do Card */}
      <div className="p-4 md:p-5 flex justify-between items-center bg-slate-50/80 border-b border-slate-200">
        <h3 className="text-lg font-bold text-indigo-800">
          {lembrete.especialidade} {lembrete.tipo === 'Teleconsulta' && '(Teleconsulta)'}
        </h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${lembrete.status === 'Agendada' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
          {lembrete.status}
        </span>
      </div>

      {/* Corpo do Card */}
      <div className="p-4 md:p-5 space-y-3 text-slate-700">
        <p><strong className="card-body">Médico:</strong> {lembrete.medico}</p>
        <p><strong className="card-body">Data e Horário:</strong> {lembrete.data} às {lembrete.hora}</p>
        <p><strong className="card-body">Local:</strong> {lembrete.local}</p>
        {lembrete.observacoes && (
          <p><strong className="card-body">Observações:</strong> {lembrete.observacoes}</p>
        )}
      </div>

      {/* Rodapé do Card */}
      <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col md:flex-row justify-end items-center gap-3">
        {lembrete.status === 'Agendada' ? (
          <>
            <button onClick={() => handleOpenEditModal(lembrete)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Alterar
            </button>
            <button onClick={() => handleConcluirLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Marcar como Concluída
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleReverterLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Reverter
            </button>
            <button onClick={() => handleRemoveLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full md:w-auto cursor-pointer">
              Remover Lembrete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
