import { useEffect, useState } from 'react'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import { buscarUsuarioPorId } from '../../Types/AutenticacaoLogin'

interface HomeFreeProps {
  onNavigate?: (pagina: string) => void
}

const HomeFree = ({ onNavigate }: HomeFreeProps) => {
  const { user, logout, isAuthenticated, login } = useAuth()
  const [nomeUsuario, setNomeUsuario] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        onNavigate?.('login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, onNavigate])

  useEffect(() => {
    const buscarNomeUsuario = async () => {
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          setNomeUsuario(usuarioCompleto.nomeUsuario)
          login({
            ...user,
            nomeUsuario: usuarioCompleto.nomeUsuario,
            nome: usuarioCompleto.nomeUsuario
          })
        } catch (error) {
          setNomeUsuario(user.nomeUsuario || user.nome || 'Usuário')
        }
      } else {
        setNomeUsuario(user?.nomeUsuario || user?.nome || 'Usuário')
      }
    }

    if (isAuthenticated && user) {
      buscarNomeUsuario()
    }
  }, [isAuthenticated, user, login])

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

  const getPrimeiroNome = () => {
    if (nomeUsuario) {
      return nomeUsuario.split(' ')[0]
    }
    if (user?.nomeUsuario) {
      return user.nomeUsuario.split(' ')[0]
    }
    if (user?.nome) {
      return user.nome.split(' ')[0]
    }
    return 'Usuário'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} isHomeFree={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Bem-vindo, {getPrimeiroNome()}!
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <button className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Minhas Trilhas
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Acesse suas trilhas de aprendizado
                </p>
              </button>

              <button className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Meu Progresso
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Visualize seu progresso e conquistas
                </p>
              </button>

              <button className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Perfil
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Gerencie suas informações pessoais
                </p>
              </button>

              <button className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Configurações
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Ajuste suas preferências
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomeFree

