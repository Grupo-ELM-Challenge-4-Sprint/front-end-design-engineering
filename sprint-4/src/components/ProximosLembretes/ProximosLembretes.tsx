import { CardConsulta, CardReceita } from "../LembreteCard/LembreteCard";
import type { Usuario, LembreteConsulta, LembreteReceita } from "../../hooks/useApiUsuarios";

interface ProximosLembretesProps {
    lembretesConsultas: LembreteConsulta[];
    lembretesReceitas: LembreteReceita[];
    usuarioApi: Usuario | null;
    pacienteVinculado: Usuario | null;
}

export default function ProximosLembretes({ lembretesConsultas, lembretesReceitas, usuarioApi, pacienteVinculado }: ProximosLembretesProps) {
    const lembretesConsultaFiltrados = (lembretesConsultas || [])
        ?.filter((lembrete: LembreteConsulta) => lembrete.status === 'Agendada')
        .sort((a: LembreteConsulta, b: LembreteConsulta) => {
            const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`);
            const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}`);
            return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 3);

    const lembretesReceitaFiltrados = (lembretesReceitas || [])
        ?.filter((lembrete: LembreteReceita) => lembrete.status === 'Ativo')
        .slice(0, 3);

    return (
        <div className="w-full justify-center lg:mr-5 notificacoes-section">
            <h3 className="text-xl font-semibold text-[#1a237e] mb-4 lg:mt-0 mt-8 pb-2.5 border-b">
                {usuarioApi?.tipoUsuario === 'CUIDADOR' && pacienteVinculado
                    ? `Próximos Lembretes de ${pacienteVinculado.nome}`
                    : 'Próximos Lembretes'
                }
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {/* Consultas Agendadas */}
                {lembretesConsultaFiltrados.map((lembrete: LembreteConsulta) => (
                    <CardConsulta key={lembrete.id} lembrete={lembrete} />
                ))}

                {/* Receitas Ativas */}
                {lembretesReceitaFiltrados.map((lembrete: LembreteReceita) => (
                    <CardReceita key={lembrete.id} lembrete={lembrete} />
                ))}
            </div>
            {lembretesConsultaFiltrados.length === 0 && lembretesReceitaFiltrados.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <p>
                        {usuarioApi?.tipoUsuario === 'CUIDADOR' && pacienteVinculado
                            ? `${pacienteVinculado.nome} não tem nenhuma consulta agendada ou receita ativa no momento.`
                            : 'Você não tem nenhuma consulta agendada ou receita ativa no momento.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
