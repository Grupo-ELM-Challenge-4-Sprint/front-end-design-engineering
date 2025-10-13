import { Link } from 'react-router-dom';

interface TutorialCardProps {
  title: string;
  to: string;
}

export default function TutorialCard({ title, to }: TutorialCardProps) {
  return (
    <div className="border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <h3 className="text-slate-800 text-base md:text-lg font-semibold leading-relaxed mb-6 group-hover:text-blue-600 transition-colors duration-200">{title}</h3>
      <Link to={to} className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
        Clique aqui para aprender!
      </Link>
    </div>
  );
}