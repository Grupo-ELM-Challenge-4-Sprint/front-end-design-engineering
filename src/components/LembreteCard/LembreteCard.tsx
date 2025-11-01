import type { LembreteConsulta, LembreteReceita } from '../../hooks/useApiUsuarios';
import { parseDate, formatDate, getNextDose } from '../../utils/dateUtils';

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
        <p><strong>Data:</strong> {formatDate(lembrete.data)} às {lembrete.hora}</p>
        <p><strong>Local:</strong> {lembrete.local}</p>
        {lembrete.observacoes && <p><strong>Obs:</strong> {lembrete.observacoes}</p>}
      </div>
    </div>
  );
};

export const CardReceita = ({ lembrete }: { lembrete: LembreteReceita }) => {
  const nextDose = getNextDose(lembrete);

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

// Componente genérico para cards de lembretes com ações
interface LembreteCardProps<T> {
  lembrete: T;
  title: string;
  status: string;
  bodyContent: React.ReactNode;
  handleOpenEditModal: (lembrete: T) => void;
  handleConcluirLembrete: (id: number) => void;
  handleReverterLembrete: (id: number) => void;
  handleRemoveLembrete: (id: number) => void;
  activeStatus: string;
  concluirButtonText: string;
  reverterButtonText: string;
}

export const LembreteCard = <T extends { id: number; status: string }>({
  lembrete,
  title,
  status,
  bodyContent,
  handleOpenEditModal,
  handleConcluirLembrete,
  handleReverterLembrete,
  handleRemoveLembrete,
  activeStatus,
  concluirButtonText,
  reverterButtonText
}: LembreteCardProps<T>) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Cabeçalho do Card */}
      <div className="p-4 md:p-5 flex justify-between items-center bg-slate-50/80 border-b border-slate-200">
        <h3 className="text-lg font-bold text-indigo-800">
          {title}
        </h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status === activeStatus ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
          {status}
        </span>
      </div>

      {/* Corpo do Card */}
      <div className="p-4 md:p-5 space-y-3 text-slate-700">
        {bodyContent}
      </div>

      {/* Rodapé do Card */}
      <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col md:flex-row justify-end items-center gap-3">
        {lembrete.status === activeStatus ? (
          <>
            <button onClick={() => handleOpenEditModal(lembrete)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              Alterar
            </button>
            <button onClick={() => handleConcluirLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              {concluirButtonText}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleReverterLembrete(lembrete.id)} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto cursor-pointer">
              {reverterButtonText}
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

// Componentes específicos usando o genérico
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
  // Parse data and hora to create startDateTime
  const [year, month, day] = parseDate(lembrete.data);
  const [hour, minute] = lembrete.hora.split(':').map(Number);
  const startDateTime = new Date(year, month - 1, day, hour, minute);

  const bodyContent = (
    <>
      <p><strong className="card-body">Frequência:</strong> {lembrete.frequencia}</p>
      <p><strong className="card-body">Dias:</strong> {lembrete.dias.sort((a, b) => ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].indexOf(a) - ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].indexOf(b)).join(', ')}</p>
      <p><strong className="card-body">Data e Hora de Início:</strong> {startDateTime.toLocaleDateString('pt-BR')} às {lembrete.hora}</p>
      <p><strong className="card-body">Duração:</strong> {lembrete.numeroDias} dias</p>
      {lembrete.observacoes && (
        <p><strong className="card-body">Observações:</strong> {lembrete.observacoes}</p>
      )}
      {(() => {
        const nextDose = getNextDose(lembrete);
        return <p className="text-indigo-600 font-semibold bg-indigo-50 p-2 rounded-md"><strong>Próxima Dose:</strong> {nextDose.date === 'Concluído' ? 'Tratamento Concluído' : `${nextDose.date} às ${nextDose.time}`}</p>;
      })()}
    </>
  );

  return (
    <LembreteCard
      lembrete={lembrete}
      title={lembrete.nome}
      status={lembrete.status}
      bodyContent={bodyContent}
      handleOpenEditModal={handleOpenEditModal}
      handleConcluirLembrete={handleConcluirLembrete}
      handleReverterLembrete={handleReativarLembrete}
      handleRemoveLembrete={handleRemoveLembrete}
      activeStatus="Ativo"
      concluirButtonText="Desativar"
      reverterButtonText="Reativar"
    />
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
  const bodyContent = (
    <>
      <p><strong className="card-body">Médico:</strong> {lembrete.medico}</p>
      <p><strong className="card-body">Data e Horário:</strong> {formatDate(lembrete.data)} às {lembrete.hora}</p>
      <p><strong className="card-body">Local:</strong> {lembrete.local}</p>
      {lembrete.observacoes && (
        <p><strong className="card-body">Observações:</strong> {lembrete.observacoes}</p>
      )}
    </>
  );

  return (
    <LembreteCard
      lembrete={lembrete}
      title={`${lembrete.especialidade} ${lembrete.tipo === 'Teleconsulta' ? '(Teleconsulta)' : ''}`}
      status={lembrete.status}
      bodyContent={bodyContent}
      handleOpenEditModal={handleOpenEditModal}
      handleConcluirLembrete={handleConcluirLembrete}
      handleReverterLembrete={handleReverterLembrete}
      handleRemoveLembrete={handleRemoveLembrete}
      activeStatus="Agendada"
      concluirButtonText="Marcar como Concluída"
      reverterButtonText="Reverter"
    />
  );
};