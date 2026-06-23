import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import Header from '@/components/Header';

export default function NotFound() {
  const { isAuthenticated, checkingAuth } = useAuth();

  if (checkingAuth) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Página não encontrada</h2>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            A página que você tentou acessar não existe, foi removida ou você não tem permissão para vê-la.
          </p>
          <Link
            to="/panel"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Voltar para o Painel
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-400 text-sm tracking-widest uppercase">
        404 | Recurso Indisponível
      </p>
    </div>
  );
}