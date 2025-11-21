import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Contexto/AutenticacaoContexto'
import { buscarUsuarioPorId } from '../../../Types/AutenticacaoLogin'
import Cabecalho from '../../../Components/Cabecalho/Cabecalho'

const HomeFuncionario = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [nomeFuncionario, setNomeFuncionario] = useState<string>('')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      
      if (isAuthenticated && user?.tipoUsuario !== 'FUNCIONARIO') {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const buscarNomeFuncionario = async () => {
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          if (usuarioCompleto.nomeUsuario) {
            setNomeFuncionario(usuarioCompleto.nomeUsuario)
          }
        } catch (error) {
        }
      }
    }

    if (isAuthenticated && user?.idUsuario) {
      buscarNomeFuncionario()
    }
  }, [isAuthenticated, user])

  const handleLogout = () => {
    logout()
    navigate('/login-corporativo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || user?.tipoUsuario !== 'FUNCIONARIO') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const getPrimeiroNome = () => {
    if (nomeFuncionario) {
      const primeiroNome = nomeFuncionario.trim().split(' ')[0]
      return primeiroNome || 'Funcionário'
    }
    if (user?.nomeUsuario) {
      const primeiroNome = user.nomeUsuario.trim().split(' ')[0]
      return primeiroNome || 'Funcionário'
    }
    if (user?.nome) {
      const primeiroNome = user.nome.trim().split(' ')[0]
      return primeiroNome || 'Funcionário'
    }
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      const nomePart = emailPart.split('.')[0]
      return nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
    }
    return 'Funcionário'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho isHomeFuncionario={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-12 lg:py-16">
        <section className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2 break-words">
                Bem-vindo, {getPrimeiroNome()}!
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-2">
                Plataforma de Desenvolvimento
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <button 
                disabled
                className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed transition-all duration-200 text-left hover:opacity-70"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                  Formulário para Definição de Trilha
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                  Defina sua trilha de desenvolvimento profissional
                </p>
              </button>

              <button 
                disabled
                className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed transition-all duration-200 text-left hover:opacity-70"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                  Trilha de Administração
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                  Explore conteúdos e desafios da área administrativa
                </p>
              </button>

              <button 
                disabled
                className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed transition-all duration-200 text-left hover:opacity-70"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                  Trilha de Tecnologia
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                  Desenvolva suas habilidades técnicas e tecnológicas
                </p>
              </button>

              <button 
                disabled
                className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed transition-all duration-200 text-left hover:opacity-70"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                  Trilha de Recursos Humanos
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                  Aprenda sobre gestão de pessoas e RH
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomeFuncionario

