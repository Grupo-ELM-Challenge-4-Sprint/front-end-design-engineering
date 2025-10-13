import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PacientePage from '../Painel/PacientePage';
import { tutorialDetails } from '../../data/tutoriais';

export default function TutorialContent() {
  const navigate = useNavigate();
  useEffect(() => {
      const cpfLogado = localStorage.getItem('cpfLogado');
      if (!cpfLogado) {
          navigate('/entrar');
      }
  }, [navigate]);

  const { id } = useParams();
  const data = tutorialDetails.find(t => t.id === id)!;

  return (
    <PacientePage>
      <article className="py-2 space-y-8">
        <div>
          <Link to="/tutoriais" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">← Voltar para a lista</Link>
        </div>
        
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{data.heading}</h1>
          {data.intro && <p className="text-slate-600">{data.intro}</p>}

        {data.videoUrl && (
          <section className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
            {data.videoTitle && <h2 className="text-slate-800 font-semibold mb-4 text-sm">{data.videoTitle}</h2>}
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe className="w-full h-full" src={data.videoUrl} title={data.videoTitle || data.heading} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
          </section>
        )}

        <section className="space-y-6">
          {data.steps.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">{idx + 1}</div>
                <div className="flex-1">
                  <h3 className="text-slate-800 font-semibold mb-2">{s.title}</h3>
                  <p className="text-slate-600 mb-4">{s.description}</p>
                  {s.image && (
                    <img src={s.image} alt="Ilustração do passo" className="w-full max-w-2xl rounded-lg border border-slate-200 md:w-[300px] md:h-[300px]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
        <div>
          <Link to="/tutoriais" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">← Voltar para a lista</Link>
        </div>
      </article>
    </PacientePage>
  );
}


