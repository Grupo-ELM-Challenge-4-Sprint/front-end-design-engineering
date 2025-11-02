import { useState, useEffect, useMemo } from 'react';
import type { LembreteConsulta, LembreteReceita, FormDataConsulta, FormDataReceita, ModalLembreteProps } from '../../types/lembretes';

export default function ModalLembrete({
  isOpen,
  onClose,
  editingLembrete,
  onSubmit,
  type,
  setErrorMessage
}: ModalLembreteProps) {
  const diasDaSemana = useMemo(() => ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'], []);

  const [formData, setFormData] = useState<FormDataConsulta | FormDataReceita>(
    type === 'consulta'
      ? {
          tipoConsulta: 'Presencial',
          especialidadeConsulta: '',
          medicoConsulta: '',
          dataConsulta: '',
          horaConsulta: '',
          localConsulta: '',
          observacoesConsulta: '',
        }
      : {
          nomeMedicamento: '',
          frequenciaHoras: 24,
          dias: [...diasDaSemana],
          numeroDiasTratamento: 7,
          dataInicio: new Date().toISOString().split('T')[0],
          horaInicio: new Date().toTimeString().substring(0, 5),
          observacoes: '',
        }
  );

  useEffect(() => {
    if (editingLembrete) {
      if (type === 'consulta') {
        const lem = editingLembrete as LembreteConsulta;
        setFormData({
          tipoConsulta: lem.tipo,
          especialidadeConsulta: lem.especialidade,
          medicoConsulta: lem.medico,
          dataConsulta: lem.data,
          horaConsulta: lem.hora,
          localConsulta: lem.local,
          observacoesConsulta: lem.observacoes,
        });
      } else {
        const lem = editingLembrete as LembreteReceita;
        setFormData({
          nomeMedicamento: lem.nomeMedicamento,
          frequenciaHoras: lem.frequenciaHoras,
          dias: lem.dias.sort((a: string, b: string) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b)),
          numeroDiasTratamento: lem.numeroDiasTratamento,
          dataInicio: lem.dataInicio,
          horaInicio: lem.horaInicio,
          observacoes: lem.observacoes,
        });
      }
    } else {
      // Reset to defaults
      setFormData(
        type === 'consulta'
          ? {
              tipoConsulta: 'Presencial',
              especialidadeConsulta: '',
              medicoConsulta: '',
              dataConsulta: '',
              horaConsulta: '',
              localConsulta: '',
              observacoesConsulta: '',
            }
          : {
              nomeMedicamento: '',
              frequenciaHoras: 24,
              dias: [...diasDaSemana],
              numeroDiasTratamento: 7,
              dataInicio: new Date().toISOString().split('T')[0],
              horaInicio: new Date().toTimeString().substring(0, 5),
              observacoes: '',
            }
      );
    }
  }, [editingLembrete, type, diasDaSemana]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type: inputType } = e.target;
    if (inputType === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const day = value;
      setFormData((prev) => {
        if ('dias' in prev) {
          return {
            ...prev,
            dias: checked
              ? [...prev.dias, day].sort((a: string, b: string) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b))
              : prev.dias.filter((d: string) => d !== day),
          };
        }
        return prev;
      });
    } else {
      const newValue = (name === 'frequenciaHoras' || name === 'numeroDiasTratamento')
        ? parseInt(value) || 0
        : value;
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setErrorMessage) setErrorMessage('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (_error) {
      console.error('Erro ao salvar lembrete:', _error);
      if (setErrorMessage) {
        setErrorMessage('Erro ao salvar lembrete. Tente novamente.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-start z-60 overflow-y-auto py-8" aria-labelledby="modalTitle">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative m-4">
        <button type="button" className="absolute top-4 right-4 text-2xl font-semibold text-slate-500 hover:text-slate-800" aria-label="Fechar modal" onClick={onClose}>
          &times;
        </button>
        <h3 id="modalTitle" className="text-2xl font-bold text-slate-900 mb-4">
          {editingLembrete ? 'Alterar Lembrete' : 'Adicionar Lembrete'}
        </h3>
        <form key={editingLembrete ? 'edit-' + (type === 'consulta' ? (editingLembrete as LembreteConsulta).idConsulta : (editingLembrete as LembreteReceita).idReceita) : 'new'} onSubmit={handleFormSubmit} className="space-y-4">
          {type === 'consulta' ? (
            <>
              <div>
                <label htmlFor="tipoConsulta" className="form-consultas">Tipo de Consulta*:</label>
                <select id="tipoConsulta" name="tipoConsulta" value={(formData as FormDataConsulta).tipoConsulta} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
                  <option value="Presencial">Presencial</option>
                  <option value="Teleconsulta">Teleconsulta</option>
                </select>
              </div>
              <div>
                <label htmlFor="especialidadeConsulta" className="form-consultas">Especialidade*:</label>
                <input type="text" id="especialidadeConsulta" name="especialidadeConsulta" value={(formData as FormDataConsulta).especialidadeConsulta} onChange={handleInputChange} placeholder="Ex: Cardiologia" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="medicoConsulta" className="form-consultas">Médico (Opcional):</label>
                <input type="text" id="medicoConsulta" name="medicoConsulta" value={(formData as FormDataConsulta).medicoConsulta} onChange={handleInputChange} placeholder="Nome do médico" className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="dataConsulta" className="form-consultas">Data*:</label>
                <input type="date" id="dataConsulta" name="dataConsulta" value={(formData as FormDataConsulta).dataConsulta} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="horaConsulta" className="form-consultas">Hora*:</label>
                <input type="time" id="horaConsulta" name="horaConsulta" value={(formData as FormDataConsulta).horaConsulta} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="localConsulta" className="form-consultas">Local/Link*:</label>
                <input type="text" id="localConsulta" name="localConsulta" value={(formData as FormDataConsulta).localConsulta} onChange={handleInputChange} placeholder="Ex: Unidade Paulista ou link da sala" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="observacoesConsulta" className="form-consultas">Observações:</label>
                <textarea id="observacoesConsulta" name="observacoesConsulta" value={(formData as FormDataConsulta).observacoesConsulta} onChange={handleInputChange} rows={3} placeholder="Ex: Trazer exames anteriores" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="nomeMedicamento" className="block text-sm font-medium text-slate-700 mb-1">Nome do Medicamento*</label>
                <input type="text" id="nomeMedicamento" name="nomeMedicamento" value={(formData as FormDataReceita).nomeMedicamento} onChange={handleInputChange} placeholder="Ex: Paracetamol 750mg" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="frequenciaHoras" className="block text-sm font-medium text-slate-700 mb-1">Frequência (em horas)*</label>
                <select id="frequenciaHoras" name="frequenciaHoras" value={(formData as FormDataReceita).frequenciaHoras} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
                  <option value={4}>A cada 4 horas</option>
                  <option value={6}>A cada 6 horas</option>
                  <option value={8}>A cada 8 horas</option>
                  <option value={12}>A cada 12 horas</option>
                  <option value={24}>A cada 24 horas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dias da Semana*</label>
                <div className="grid grid-cols-2 gap-2">
                  {diasDaSemana.map(dia => (
                    <label key={dia} className="flex items-center">
                      <input
                        className="mr-2"
                        type="checkbox"
                        value={dia}
                        checked={(formData as FormDataReceita).dias.includes(dia)}
                        onChange={handleInputChange}
                      />
                      {dia}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="dataInicio" className="block text-sm font-medium text-slate-700 mb-1">Data de Início*</label>
                <input type="date" id="dataInicio" name="dataInicio" value={(formData as FormDataReceita).dataInicio} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="horaInicio" className="block text-sm font-medium text-slate-700 mb-1">Hora de Início*</label>
                <input type="time" id="horaInicio" name="horaInicio" value={(formData as FormDataReceita).horaInicio} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="numeroDiasTratamento" className="block text-sm font-medium text-slate-700 mb-1">Duração (dias)*</label>
                <input type="number" id="numeroDiasTratamento" name="numeroDiasTratamento" value={(formData as FormDataReceita).numeroDiasTratamento} onChange={handleInputChange} min="1" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea id="observacoes" name="observacoes" value={(formData as FormDataReceita).observacoes} onChange={handleInputChange} rows={3} placeholder="Ex: Tomar após as refeições, 1 comprimido" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
              </div>
            </>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-center border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}