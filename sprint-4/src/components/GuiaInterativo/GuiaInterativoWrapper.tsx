import { useState } from 'react';
import GuiaInterativo from './GuiaInterativo';
import FloatingButton from './FloatingButton';

export default function GuiaInterativoWrapper() {
  const [guiaAtivo, setGuiaAtivo] = useState(false);

  const iniciarGuia = () => {
    setGuiaAtivo(true);
  };

  const concluirGuia = () => {
    setGuiaAtivo(false);
  };

  return (
    <>
      <FloatingButton onClick={iniciarGuia} />
      <GuiaInterativo iniciar={guiaAtivo} onConcluir={concluirGuia} />
    </>
  );
}
