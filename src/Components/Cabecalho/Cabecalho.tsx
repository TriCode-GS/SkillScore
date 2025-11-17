import { useState } from 'react'
import { useTheme } from '../../Contexto/TemaContexto'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Botao from '../Botao/Botao'

interface CabecalhoProps {
  onNavigate?: (pagina: string) => void
  isHomeFree?: boolean
  isHomeAdmin?: boolean
  onLogout?: () => void
}

const Cabecalho = ({ onNavigate, isHomeFree = false, isHomeAdmin = false, onLogout }: CabecalhoProps) => {
  const [menuAberto, setMenuAberto] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, pagina: string) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(pagina)
    }
    setMenuAberto(false)
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
    return 'Usuário'
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {isHomeAdmin ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <a 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.('homeAdmin')
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
                </a>
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
                <button
                  onClick={() => {
                    onNavigate?.('homeAdmin')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Home
                </button>
                <button
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Gerenciar Usuários
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('gerenciarEmpresas')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Gerenciar Empresas
                </button>
                <button
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Relatórios
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
          ) : isHomeFree ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <a 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.('homeFree')
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
                </a>
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
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.('login')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 lg:p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Perfil"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </a>
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
                <button
                  onClick={() => {
                    onNavigate?.('homeFree')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate?.('trilhas')}
                  className="text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  Minhas Trilhas
                </button>
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
              <a 
                href="/" 
                onClick={(e) => handleClick(e, 'home')}
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
              </a>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <a
                    href="/login"
                    onClick={(e) => handleClick(e, 'login')}
                    className="hidden lg:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                    aria-label="Login"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </a>
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
                  <a 
                    href="/" 
                    onClick={(e) => handleClick(e, 'home')}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Home
                  </a>
                  <a 
                    href="/sobre" 
                    onClick={(e) => handleClick(e, 'sobre')}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Sobre
                  </a>
                  <a 
                    href="/integrantes" 
                    onClick={(e) => handleClick(e, 'integrantes')}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Integrantes
                  </a>
                  <a 
                    href="/faq" 
                    onClick={(e) => handleClick(e, 'faq')}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    FAQ
                  </a>
                  <a 
                    href="/contato" 
                    onClick={(e) => handleClick(e, 'contato')}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Contato
                  </a>
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
        {menuAberto && isHomeAdmin && (
          <div className="lg:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
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
              <button
                onClick={() => {
                  onNavigate?.('homeAdmin')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </button>
              <button
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Gerenciar Usuários
              </button>
              <button
                onClick={() => {
                  onNavigate?.('gerenciarEmpresas')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Gerenciar Empresas
              </button>
              <button
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Relatórios
              </button>
              <button
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                Configurações
              </button>
            </div>
          </div>
        )}
        {menuAberto && isHomeFree && (
          <div className="lg:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate?.('login')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </a>
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
              <button
                onClick={() => {
                  onNavigate?.('homeFree')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate?.('trilhas')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setMenuAberto(false)
                }}
                className="px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Minhas Trilhas
              </button>
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
              <a 
                href="/login" 
                onClick={(e) => handleClick(e, 'login')}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </a>
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
              <a 
                href="/" 
                onClick={(e) => handleClick(e, 'home')}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Home
              </a>
              <a 
                href="/sobre" 
                onClick={(e) => handleClick(e, 'sobre')}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Sobre
              </a>
              <a 
                href="/integrantes" 
                onClick={(e) => handleClick(e, 'integrantes')}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                Integrantes
              </a>
              <a 
                href="/faq" 
                onClick={(e) => handleClick(e, 'faq')}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200 dark:border-gray-700"
              >
                FAQ
              </a>
              <a 
                href="/contato" 
                onClick={(e) => handleClick(e, 'contato')}
                className="px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                Contato
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Cabecalho
