import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'

const HomeAdmin = () => {
  const navigate = useNavigate()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      const timer = setTimeout(() => {
        navigate('/admin/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const getPrimeiroNome = () => {
    if (user?.nomeUsuario) {
      return user.nomeUsuario.split(' ')[0]
    }
    if (user?.nome) {
      return user.nome.split(' ')[0]
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Administrador'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho isHomeAdmin={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Bem-vindo, {getPrimeiroNome()}!
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Painel Administrativo SkillScore
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <button 
                onClick={() => handleNavigate('/admin/administradores')}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gerenciar Administradores
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Visualize e gerencie todos os administradores da plataforma
                </p>
              </button>

              <button 
                onClick={() => handleNavigate('/admin/empresas')}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gerenciar Empresas
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Administre empresas e planos corporativos
                </p>
              </button>

              <button className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Relatórios e Estatísticas
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Visualize métricas e relatórios da plataforma
                </p>
              </button>

              <button className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Configurações do Sistema
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Configure parâmetros e preferências do sistema
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomeAdmin

