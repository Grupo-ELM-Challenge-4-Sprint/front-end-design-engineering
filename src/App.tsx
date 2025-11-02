import { Outlet } from "react-router-dom";
import Cabecalho from "./components/Cabecalho/Cabecalho";
import Rodape from "./components/Rodape/Rodape";
import "./globals.css"
import GuiaInterativoWrapper from "./components/GuiaInterativo/GuiaInterativoWrapper";
import WatsonChat from "./components/Watson/Watson";
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {

  return (
    <div>
      <Cabecalho/>
        <Outlet/>
        <GuiaInterativoWrapper />
        <WatsonChat />
      <Rodape/>
      <SpeedInsights />
    </div>
  );
}
