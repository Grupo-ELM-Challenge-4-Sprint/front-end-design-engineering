/**
 * Utilitários para manipulação de datas
 */

export const parseDate = (dateString: string): number[] => {
  const [year, month, day] = dateString.split('-').map(Number);
  return [year, month, day];
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const convertToISODate = (dateString: string): string => {
  // Converte de DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};


export const getNextDose = (lembrete: {
  data: string;
  hora: string;
  frequencia: number;
  dias: string[];
  numeroDias: number;
}): { date: string; time: string } => {
  // 1. Verifica se o tratamento já foi concluído
  const [year, month, day] = parseDate(lembrete.data);
  const [hour, minute] = lembrete.hora.split(':').map(Number);
  const startDateTime = new Date(year, month - 1, day, hour, minute);
  const endDateTime = new Date(startDateTime);
  endDateTime.setDate(endDateTime.getDate() + lembrete.numeroDias);

  const now = new Date();
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
  const selectedDayIndices = lembrete.dias.map(d => daysOfWeek.indexOf(d)).filter(i => i >= 0 && i <= 6);
  const freqHours = lembrete.frequencia;

  if (freqHours <= 0) {
    return { date: 'Erro Freq.', time: '' };
  }

  if (selectedDayIndices.length === 0) {
    return { date: 'Erro Dias', time: '' };
  }

  // Encontra a próxima dose verificando os próximos dias
  const current = new Date(now);
  current.setHours(0, 0, 0, 0); // Início do dia atual

  for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
    if (selectedDayIndices.includes(current.getDay())) {
      // Este é um dia selecionado, encontra a próxima dose neste dia
      const doseTime = new Date(current);
      doseTime.setHours(startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);


      // Avança para a próxima dose válida neste dia
      while (doseTime <= now) {
        doseTime.setHours(doseTime.getHours() + freqHours);
        if (doseTime >= endDateTime) break;
      }

      if (doseTime > now && doseTime < endDateTime) {
        return {
          date: doseTime.toLocaleDateString('pt-BR'),
          time: doseTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }
    current.setDate(current.getDate() + 1);
  }

  // Se não encontrou dose nos próximos 7 dias, assume concluído
  return { date: 'Concluído', time: '' };
};

// --- Funções utilitárias de data (exemplo, podem precisar de ajustes) ---
// Colocar em src/utils/dateUtils.ts

export const formatLocalDateTimeForInput = (dateTimeString: string): string => {
  // Converte YYYY-MM-DDTHH:mm:ss para YYYY-MM-DDTHH:mm (formato do input datetime-local)
  if (!dateTimeString) return '';
  return dateTimeString.substring(0, 16); // Pega até os minutos
};

export const formatLocalDateForInput = (dateString: string): string => {
   // Formato YYYY-MM-DD já é compatível com input date
   return dateString || '';
};

export const formatLocalTimeForInput = (dateTimeString: string): string => {
   // Extrai HH:mm de YYYY-MM-DDTHH:mm:ss
   if (!dateTimeString || dateTimeString.length < 16) return '';
   return dateTimeString.substring(11, 16);
};

export const combineDateAndTime = (date: string, time: string): string => {
    // Combina YYYY-MM-DD e HH:mm para YYYY-MM-DDTHH:mm:ss (ou o formato esperado pelo backend)
    if (!date || !time) return '';
    return `${date}T${time}:00`; // Adiciona segundos :00
};

export const formatISODateTimeLocal = (dateTimeLocal: string): string => {
    // Converte YYYY-MM-DDTHH:mm para YYYY-MM-DDTHH:mm:ss
    if (!dateTimeLocal) return '';
    return `${dateTimeLocal}:00`; // Adiciona segundos :00
};
