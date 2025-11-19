import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../Contexto/TemaContexto'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Botao from '../Botao/Botao'

interface CabecalhoProps {
  isHomeFree?: boolean
  isHomeAdmin?: boolean
  isHomeAdminEmp?: boolean
  onLogout?: () => void
}

const Cabecalho = ({ isHomeFree = false, isHomeAdmin = false, isHomeAdminEmp = false, onLogout }: CabecalhoProps) => {
  const [menuAberto, setMenuAberto] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const getPrimeiroNome = () => {
    if (user?.nomeUsuario) {
      const primeiroNome = user.nomeUsuario.trim().split(' ')[0]
      return primeiroNome || 'Usuário'
    }
    if (user?.nome) {
      const primeiroNome = user.nome.trim().split(' ')[0]
      return primeiroNome || 'Usuário'
    }
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      const nomePart = emailPart.split('.')[0]
      return nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
    }
    return 'Usuário'
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {isHomeAdminEmp ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <Link 
                  to="/admin-emp/home"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex-shrink-0"
                >
                  {theme === 'dark' ? (
                    <img 
                      src="/LogoSkillScoreWhite.png" 
                      alt="SkillScore" 
                      className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  ) : (
                    <img 
                      src="/LogoSkillScoreBlack.png" 
                      alt="SkillScore" 
                      className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  )}
                </Link>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {getPrimeiroNome()}
                </span>
                {onLogout && (
                  <Botao
                    variant="primary"
                    size="sm"
                    onClick={onLogout}
                  >
                    Sair
                  </Botao>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-3 lg:gap-4">
                <Link
                  to="/login-corporativo"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Perfil"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <Link
                  to="/admin-emp/home"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Home
                </Link>
                <span
                  className="text-sm lg:text-base font-semibold text-gray-400 dark:text-gray-500 px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap cursor-not-allowed opacity-60"
                >
                  Gerenciar Gestores
                </span>
                <span
                  className="text-sm lg:text-base font-semibold text-gray-400 dark:text-gray-500 px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap cursor-not-allowed opacity-60"
                >
                  Gerenciar Departamentos
                </span>
              </div>
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuAberto ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : isHomeAdmin ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <Link 
                  to="/admin/home"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex-shrink-0"
                >
                  {theme === 'dark' ? (
                    <img 
                      src="/LogoSkillScoreWhite.png" 
                      alt="SkillScore" 
                      className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  ) : (
                    <img 
                      src="/LogoSkillScoreBlack.png" 
                      alt="SkillScore" 
                      className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  )}
                </Link>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {getPrimeiroNome()}
                </span>
                {onLogout && (
                  <Botao
                    variant="primary"
                    size="sm"
                    onClick={onLogout}
                  >
                    Sair
                  </Botao>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-3 lg:gap-4">
                <Link
                  to="/admin/login"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Perfil"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <Link
                  to="/admin/home"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Home
                </Link>
                <Link
                  to="/admin/administradores"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Gerenciar Administradores
                </Link>
                <Link
                  to="/admin/empresas"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Gerenciar Empresas
                </Link>
              </div>
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuAberto ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : isHomeFree ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <Link 
                  to="/home-free"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex-shrink-0"
                >
                  {theme === 'dark' ? (
                    <img 
                      src="/LogoSkillScoreWhite.png" 
                      alt="SkillScore" 
                      className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  ) : (
                    <img 
                      src="/LogoSkillScoreBlack.png" 
                      alt="SkillScore" 
                      className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  )}
                </Link>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {getPrimeiroNome()}
                </span>
                {onLogout && (
                  <Botao
                    variant="primary"
                    size="sm"
                    onClick={onLogout}
                  >
                    Sair
                  </Botao>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-3 lg:gap-4">
                <Link
                  to="/login"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Perfil"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <Link
                  to="/home-free"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Home
                </Link>
                <Link
                  to="/trilhas"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Minhas Trilhas
                </Link>
                <button
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Meu Progresso
                </button>
                <button
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Perfil
                </button>
                <button
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Configurações
                </button>
              </div>
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuAberto ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/"
                className="flex-shrink-0"
              >
                {theme === 'dark' ? (
                  <img 
                    src="/LogoSkillScoreWhite.png" 
                    alt="SkillScore" 
                    className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                  />
                ) : (
                  <img 
                    src="/LogoSkillScoreBlack.png" 
                    alt="SkillScore" 
                    className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                    />
                  )}
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden lg:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                    aria-label="Login"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="hidden lg:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                    aria-label="Alternar tema"
                  >
                    {theme === 'dark' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="hidden lg:flex items-center gap-6">
                  <Link 
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/sobre"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Sobre
                  </Link>
                  <Link 
                    to="/integrantes"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Integrantes
                  </Link>
                  <Link 
                    to="/faq"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    FAQ
                  </Link>
                  <Link 
                    to="/contato"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Contato
                  </Link>
                </div>
                <button
                  onClick={() => setMenuAberto(!menuAberto)}
                  className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {menuAberto ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
        {menuAberto && isHomeAdminEmp && (
          <div className="lg:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <Link
                to="/login-corporativo"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                <span className="font-medium">Perfil</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <div className="px-4 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Tema</span>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
              <Link
                to="/admin-emp/home"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </Link>
              <span
                className="px-4 py-4 text-left text-gray-400 dark:text-gray-500 font-medium border-b-2 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60"
              >
                Gerenciar Gestores
              </span>
              <span
                className="px-4 py-4 text-left text-gray-400 dark:text-gray-500 font-medium cursor-not-allowed opacity-60"
              >
                Gerenciar Departamentos
              </span>
            </div>
          </div>
        )}
        {menuAberto && isHomeAdmin && (
          <div className="lg:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <Link
                to="/admin/login"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                <span className="font-medium">Perfil</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <div className="px-4 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Tema</span>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
              <Link
                to="/admin/home"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </Link>
              <Link
                to="/admin/administradores"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Gerenciar Administradores
              </Link>
              <Link
                to="/admin/empresas"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                Gerenciar Empresas
              </Link>
            </div>
          </div>
        )}
        {menuAberto && isHomeFree && (
          <div className="lg:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <Link
                to="/login"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </Link>
              <div className="px-4 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Tema</span>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
              <Link
                to="/home-free"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </Link>
              <Link
                to="/trilhas"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Minhas Trilhas
              </Link>
              <button
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Meu Progresso
              </button>
              <button
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Perfil
              </button>
              <button
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                Configurações
              </button>
            </div>
          </div>
        )}
        {menuAberto && !isHomeFree && !isHomeAdmin && (
          <div className="lg:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <Link 
                to="/login"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Link>
              <div className="px-4 py-4 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Tema</span>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
              <Link 
                to="/"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </Link>
              <Link 
                to="/sobre"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Sobre
              </Link>
              <Link 
                to="/integrantes"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Integrantes
              </Link>
              <Link 
                to="/faq"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                FAQ
              </Link>
              <Link 
                to="/contato"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                Contato
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Cabecalho
