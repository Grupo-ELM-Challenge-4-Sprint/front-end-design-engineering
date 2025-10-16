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

    const [hours, minutes] = lembrete.horaPrimeiraDose.split(':').map(Number);
    let doseTime = new Date(nextDate);
    doseTime.setHours(hours, minutes, 0, 0);

    if (daysAhead === 0 && doseTime <= now) {
      const freqMatch = lembrete.frequencia.match(/A cada (\d+) horas/);
      if (freqMatch) {
        const freqHours = parseInt(freqMatch[1]);
        const diffHours = (now.getTime() - doseTime.getTime()) / (1000 * 60 * 60);
        const intervalsPassed = Math.ceil(diffHours / freqHours);
        doseTime.setHours(hours + intervalsPassed * freqHours, minutes);
      }
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
