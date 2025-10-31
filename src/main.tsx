import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home/index.tsx';
import Error from './routes/Error/index.tsx';
import Faq from './routes/Faq/index.tsx';
import Contato from './routes/Contato/index.tsx';
import Integrantes from './routes/Integrantes/index.tsx';
import Hospitais from './routes/Hospitais/index.tsx';
import Entrar from './routes/Entrar/index.tsx';
import Servicos from './routes/Servicos/index.tsx';
import Perfil from './routes/Perfil/index.tsx';
import Tutoriais from './routes/Tutoriais/index.tsx';
import TutorialContent from './components/TutorialCard/TutorialContent.tsx';
import Consultas from './routes/Consultas/index.tsx';
import Receitas from './routes/Receitas/index.tsx';


const router = createBrowserRouter([
  {path:"/", element:<App/>, errorElement:<Error/>, children:[
    {path:"/", element: <Home/>},
    {path:"/servicos", element: <Servicos/>},
    {path:"/hospitais", element: <Hospitais/>},
    {path:"/integrantes", element: <Integrantes/>},
    {path:"/faq", element: <Faq/>},
    {path:"/contato", element: <Contato/>},
    {path:"/entrar", element: <Entrar/>},
    {path:"/perfil", element: <Perfil/>},
    {path:"/tutoriais", element: <Tutoriais/>},
    {path:"/tutoriais/:id", element: <TutorialContent/>},
    {path:"/consultas", element: <Consultas/>},
    {path:"/receitas", element: <Receitas/>},
  ]}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
