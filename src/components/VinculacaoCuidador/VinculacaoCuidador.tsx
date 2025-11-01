import { useState } from 'react';
import { useApiUsuarios } from '../../hooks/useApiUsuarios';
import { useInputMasks } from '../../hooks/useInputMasks';
import { useUser } from '../../hooks/useUser';
import { cleanCpf } from '../../utils/stringUtils';
import type { Usuario, LembreteConsulta, LembreteReceita } from '../../hooks/useApiUsuarios';
interface VinculacaoCuidadorProps {
  pacienteVinculado: (Usuario & { lembretesConsulta: LembreteConsulta[]; lembretesReceita: LembreteReceita[] }) | null;
  setPacienteVinculado: React.Dispatch<React.SetStateAction<(Usuario & { lembretesConsulta: LembreteConsulta[]; lembretesReceita: LembreteReceita[] }) | null>>;
}

export default function VinculacaoCuidador({ pacienteVinculado, setPacienteVinculado }: VinculacaoCuidadorProps) {
  const { atualizarUsuario, listarConsultas, listarReceitas, getUsuarioPorCpf } = useApiUsuarios();
  const { applyMask } = useInputMasks();
  const { usuarioApi, setUsuarioApi } = useUser();
  const [linkMessage, setLinkMessage] = useState<string>('');
  const [linkingLoading, setLinkingLoading] = useState(false);

  const handleDesvincular = async () => {
    if (usuarioApi && pacienteVinculado) {
      try {
        await atualizarUsuario(usuarioApi.idUser, { cpfPaciente: null });
        await atualizarUsuario(pacienteVinculado.idUser, { cpfCuidador: null });
        setPacienteVinculado(null);
        setUsuarioApi({ ...usuarioApi, cpfPaciente: null });
      } catch (error) {
        console.error('Erro ao desvincular:', error);
      }
    }
  };

  const handleVincular = async () => {
    const cpfInput = document.getElementById('cpfPacienteInput') as HTMLInputElement;
    const cpfPaciente = cpfInput.value;
    setLinkMessage('Carregando dados do usuário...');
    setLinkingLoading(true);

    if (!cpfPaciente || cpfPaciente.length !== 14) {
      setLinkMessage('Por favor, digite um CPF válido.');
      setLinkingLoading(false);
      return;
    }

    try {
      const cpfLimpo = cleanCpf(cpfPaciente);
      const paciente = await getUsuarioPorCpf(cpfLimpo);
      if (!paciente) {
        setLinkMessage('Paciente não encontrado.');
        setLinkingLoading(false);
        return;
      }

      if (paciente.tipoUsuario !== 'PACIENTE') {
        setLinkMessage('Este usuário não é um paciente.');
        setLinkingLoading(false);
        return;
      }

      if (paciente.cpfCuidador) {
        setLinkMessage('Este paciente já está vinculado a outro cuidador.');
        setLinkingLoading(false);
        return;
      }

      await atualizarUsuario(usuarioApi!.idUser, { cpfPaciente: cpfLimpo });
      await atualizarUsuario(paciente.idUser, { cpfCuidador: usuarioApi!.cpf });

      const consultasPaciente = await listarConsultas(paciente.idUser);
      const receitasPaciente = await listarReceitas(paciente.idUser);
      const pacienteComLembretes = {
        ...paciente,
        lembretesConsulta: consultasPaciente,
        lembretesReceita: receitasPaciente,
      };

      setPacienteVinculado(pacienteComLembretes);
      setUsuarioApi({ ...usuarioApi!, cpfPaciente: cpfLimpo });

      setLinkMessage('Vinculação realizada com sucesso!');
    } catch (error) {
      setLinkMessage('Erro ao vincular paciente.');
    } finally {
      setLinkingLoading(false);
    }
  };

  return (
    <div className="info-section mt-6">
      <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-[#e0e0e0]">Vinculação com Paciente</h4>

      {pacienteVinculado ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">✅ Vinculado com: {pacienteVinculado.nome}</p>
          <p className="text-green-600 text-sm mt-1">CPF: {applyMask(pacienteVinculado.cpf, 'cpf')}</p>
          <button
            type="button"
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            onClick={handleDesvincular}
          >
            Desvincular
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 mb-3">Você não está vinculado a nenhum paciente.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Digite o CPF do paciente"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              id="cpfPacienteInput"
              onChange={(e) => {
                const value = applyMask(e.target.value, 'cpf');
                e.target.value = value;
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              onClick={handleVincular}
            >
              {linkingLoading ? 'Vinculando...' : 'Vincular'}
            </button>
          </div>
          {linkMessage && (
            <p className={`mt-3 text-sm ${linkMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {linkMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}