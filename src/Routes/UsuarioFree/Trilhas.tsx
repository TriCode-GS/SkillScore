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
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
              <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 break-words">
                  Minhas Trilhas
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-400 break-words px-2 sm:px-4 md:px-6">
                  Acesse suas trilhas de aprendizado
                </p>
              </div>
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <button
                  onClick={() => {
                    onNavigate?.('homeFree')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap"
                >
                  Voltar ao Menu
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
              <button
                className="px-6 sm:px-8 md:px-10 lg:px-14 xl:px-20 py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-white bg-indigo-600 dark:bg-indigo-500 border-2 border-indigo-600 dark:border-indigo-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:border-indigo-700 dark:hover:border-indigo-600 transition-colors shadow-lg hover:shadow-xl break-words"
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

