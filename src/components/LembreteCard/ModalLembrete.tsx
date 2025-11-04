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
          tipo: 'Presencial',
          especialidade: '',
          medico: '',
          data: '',
          hora: '',
          local: '',
          observacoes: '',
        }
      : {
          nome: '',
          frequencia: 24,
          dias: [...diasDaSemana],
          numeroDias: 7,
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
          tipo: lem.tipo,
          especialidade: lem.especialidade,
          medico: lem.medico,
          data: lem.data,
          hora: lem.hora,
          local: lem.local,
          observacoes: lem.observacoes,
        });
      } else {
        const lem = editingLembrete as LembreteReceita;
        // Handle dias that might be stored as comma-separated string
        const diasArray = Array.isArray(lem.dias)
          ? lem.dias.flatMap(d => typeof d === 'string' ? d.split(',').map(day => day.trim()) : [d])
          : [];
        setFormData({
          nome: lem.nome,
          frequencia: lem.frequencia,
          dias: diasArray.sort((a: string, b: string) => diasDaSemana.indexOf(a) - diasDaSemana.indexOf(b)),
          numeroDias: lem.numeroDias,
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
              tipo: 'Presencial',
              especialidade: '',
              medico: '',
              data: '',
              hora: '',
              local: '',
              observacoes: '',
            }
          : {
              nome: '',
              frequencia: 24,
              dias: [...diasDaSemana],
              numeroDias: 7,
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
      const newValue = (name === 'frequencia' || name === 'numeroDias')
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
                <label htmlFor="tipo" className="form-consultas">Tipo de Consulta*:</label>
                <select id="tipo" name="tipo" value={(formData as FormDataConsulta).tipo} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
                  <option value="Presencial">Presencial</option>
                  <option value="Teleconsulta">Teleconsulta</option>
                </select>
              </div>
              <div>
                <label htmlFor="especialidade" className="form-consultas">Especialidade*:</label>
                <input type="text" id="especialidade" name="especialidade" value={(formData as FormDataConsulta).especialidade} onChange={handleInputChange} placeholder="Ex: Cardiologia" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="medico" className="form-consultas">Médico (Opcional):</label>
                <input type="text" id="medico" name="medico" value={(formData as FormDataConsulta).medico} onChange={handleInputChange} placeholder="Nome do médico" className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="data" className="form-consultas">Data*:</label>
                <input type="date" id="data" name="data" value={(formData as FormDataConsulta).data} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="hora" className="form-consultas">Hora*:</label>
                <input type="time" id="hora" name="hora" value={(formData as FormDataConsulta).hora} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="local" className="form-consultas">Local/Link*:</label>
                <input type="text" id="local" name="local" value={(formData as FormDataConsulta).local} onChange={handleInputChange} placeholder="Ex: Unidade Paulista ou link da sala" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="observacoes" className="form-consultas">Observações:</label>
                <textarea id="observacoes" name="observacoes" value={(formData as FormDataConsulta).observacoes} onChange={handleInputChange} rows={3} placeholder="Ex: Trazer exames anteriores" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome do Medicamento*</label>
                <input type="text" id="nome" name="nome" value={(formData as FormDataReceita).nome} onChange={handleInputChange} placeholder="Ex: Paracetamol 750mg" required className="w-full p-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="frequencia" className="block text-sm font-medium text-slate-700 mb-1">Frequência (em horas)*</label>
                <select id="frequencia" name="frequencia" value={(formData as FormDataReceita).frequencia} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded-md">
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
                <label htmlFor="numeroDias" className="block text-sm font-medium text-slate-700 mb-1">Duração (dias)*</label>
                <input type="number" id="numeroDias" name="numeroDias" value={(formData as FormDataReceita).numeroDias} onChange={handleInputChange} min="1" required className="w-full p-2 border border-slate-300 rounded-md" />
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