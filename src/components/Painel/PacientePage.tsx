import type { ReactNode } from 'react';
import PacienteSidebar from './PacienteSidebar';

interface PacientePageProps {
  children: ReactNode;
}

export default function PacientePage({ children }: PacientePageProps) {
  return (
    <main className="paciente-main-container container">
      <PacienteSidebar />
      <section className="paciente-content-area">
        {children}
      </section>
    </main>
  );
}