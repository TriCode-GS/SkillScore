import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'

const Trilhas = () => {
  const navigate = useNavigate()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
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
      <Cabecalho isHomeFree={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => handleNavigate('/home-free')}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap"
                >
                  Voltar ao Menu
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 md:gap-5 mb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-0 flex-1 min-w-0">
                  <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words">
                      Minhas Trilhas
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                      Acesse suas trilhas de aprendizado
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('/home-free')}
                  className="hidden md:block px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap self-auto"
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
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/home-free', onClick: () => handleNavigate('/home-free') },
          { label: 'Minhas Trilhas', path: '/trilhas', onClick: () => handleNavigate('/trilhas') }
        ]}
        onLinkClick={(path) => handleNavigate(path)}
      />
    </div>
  )
}

export default Trilhas

