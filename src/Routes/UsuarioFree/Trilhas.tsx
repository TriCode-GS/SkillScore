import { useEffect } from 'react'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'

interface TrilhasProps {
  onNavigate?: (pagina: string) => void
}

const Trilhas = ({ onNavigate }: TrilhasProps) => {
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        onNavigate?.('login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, onNavigate])

  const handleLogout = () => {
    logout()
    onNavigate?.('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} isHomeFree={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <div className="text-center mb-4 sm:mb-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  Minhas Trilhas
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                  Acesse suas trilhas de aprendizado
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('homeFree')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap sm:absolute sm:top-8 sm:right-24"
              >
                Voltar ao Menu
              </button>
            </div>

            <div className="flex justify-center items-center py-12 sm:py-16">
              <button
                className="px-8 py-4 sm:px-12 sm:py-5 text-base sm:text-lg md:text-xl font-semibold text-white bg-indigo-600 dark:bg-indigo-500 border-2 border-indigo-600 dark:border-indigo-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:border-indigo-700 dark:hover:border-indigo-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Descobrir Competências para Melhorar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Trilhas

