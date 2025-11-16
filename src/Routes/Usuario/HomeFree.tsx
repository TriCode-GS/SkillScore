import { useEffect } from 'react'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'

interface HomeFreeProps {
  onNavigate?: (pagina: string) => void
}

const HomeFree = ({ onNavigate }: HomeFreeProps) => {
  const { user, logout, isAuthenticated } = useAuth()

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
      <Cabecalho onNavigate={onNavigate} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Home Free
                </h1>
                <Botao
                  variant="outline"
                  size="md"
                  onClick={handleLogout}
                >
                  Sair
                </Botao>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bem-vindo, {user?.nome || 'Usuário'}!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Email: {user?.email}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Minhas Trilhas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Acesse suas trilhas de aprendizado
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Meu Progresso
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visualize seu progresso e conquistas
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Perfil
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gerencie suas informações pessoais
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Configurações
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ajuste suas preferências
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Rodape onNavigate={onNavigate} />
    </div>
  )
}

export default HomeFree

