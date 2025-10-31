import { Link } from 'react-router-dom';

export default function Error(){
    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-6xl font-bold text-[#1a237e] mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto"> Ops! A página que você está procurando não existe ou foi movida. Não se preocupe, isso acontece às vezes.</p>
                </div>

                <div className="space-y-4">
                    <Link to="/" className="inline-block bg-[#1a237e] text-white px-6 py-3 rounded-lg hover:bg-[#0d1562] transition-colors font-medium"> ← Voltar ao início</Link>
                    <div className="text-sm text-gray-500 mt-6">
                        <p>Precisa de ajuda? Visite nossa <Link to="/faq" className="text-[#1a237e] hover:underline">FAQ</Link></p>
                    </div>
                </div>
            </div>
        </main>
    );
}
