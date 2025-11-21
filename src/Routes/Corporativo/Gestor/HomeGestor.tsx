import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Contexto/AutenticacaoContexto'
import { buscarUsuarioPorId } from '../../../Types/AutenticacaoLogin'
import Cabecalho from '../../../Components/Cabecalho/Cabecalho'
import Rodape from '../../../Components/Rodape/Rodape'

const HomeGestor = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [nomeGestor, setNomeGestor] = useState<string>('')

  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      
      if (isAuthenticated && user?.tipoUsuario !== 'GESTOR') {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const buscarNomeGestor = async () => {
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          if (usuarioCompleto.nomeUsuario) {
            setNomeGestor(usuarioCompleto.nomeUsuario)
          }
        } catch (error) {
        }
      }
    }

    if (isAuthenticated && user?.idUsuario) {
      buscarNomeGestor()
    }
  }, [isAuthenticated, user])

  const handleLogout = () => {
    logout()
    navigate('/login-corporativo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || user?.tipoUsuario !== 'GESTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const getPrimeiroNome = () => {
    if (nomeGestor) {
      const primeiroNome = nomeGestor.trim().split(' ')[0]
      return primeiroNome || 'Gestor'
    }
    if (user?.nomeUsuario) {
      const primeiroNome = user.nomeUsuario.trim().split(' ')[0]
      return primeiroNome || 'Gestor'
    }
    if (user?.nome) {
      const primeiroNome = user.nome.trim().split(' ')[0]
      return primeiroNome || 'Gestor'
    }
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      const nomePart = emailPart.split('.')[0]
      return nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
    }
    return 'Gestor'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho isHomeGestor={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Bem-vindo, {getPrimeiroNome()}!
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Painel de Gestão do Departamento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <button 
                onClick={() => handleNavigate('/gestor/funcionarios')}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 text-left hover:shadow-lg"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gerenciar Funcionários
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Faça o cadastro de novos funcionários para vinculação ao seu departamento
                </p>
              </button>

              <button 
                disabled
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed transition-all duration-200 text-left"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gerenciar Departamento
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Administre seu departamento
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/gestor/home', onClick: () => handleNavigate('/gestor/home') },
          { label: 'Gerenciar Funcionários', path: '/gestor/funcionarios', onClick: () => handleNavigate('/gestor/funcionarios') }
        ]}
        onLinkClick={(path) => handleNavigate(path)}
      />
    </div>
  )
}

export default HomeGestor

