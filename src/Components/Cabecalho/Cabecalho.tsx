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
              <div className="flex items-center gap-4">
                <a 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.('homeAdmin')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {theme === 'dark' ? (
                    <img 
                      src="/LogoSkillScoreWhite.png" 
                      alt="SkillScore" 
                      className="h-8 sm:h-10 w-auto"
                    />
                  ) : (
                    <img 
                      src="/LogoSkillScoreBlack.png" 
                      alt="SkillScore" 
                      className="h-8 sm:h-10 w-auto"
                    />
                  )}
                </a>
                <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
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
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
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
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Home
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Gerenciar Usuários
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Gerenciar Empresas
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Relatórios
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Configurações
                </button>
              </div>
            </>
          ) : isHomeFree ? (
            <>
              <div className="flex items-center gap-4">
                <a 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.('homeFree')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {theme === 'dark' ? (
                    <img 
                      src="/LogoSkillScoreWhite.png" 
                      alt="SkillScore" 
                      className="h-8 sm:h-10 w-auto"
                    />
                  ) : (
                    <img 
                      src="/LogoSkillScoreBlack.png" 
                      alt="SkillScore" 
                      className="h-8 sm:h-10 w-auto"
                    />
                  )}
                </a>
                <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
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
              <div className="hidden md:flex items-center gap-3">
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.('login')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  aria-label="Perfil"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </a>
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
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
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate?.('trilhas')}
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Minhas Trilhas
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Meu Progresso
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Perfil
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                  Configurações
                </button>
              </div>
            </>
          ) : (
            <>
              <a 
                href="/" 
                onClick={(e) => handleClick(e, 'home')}
                className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
              >
                {theme === 'dark' ? (
                  <img 
                    src="/LogoSkillScoreWhite.png" 
                    alt="SkillScore" 
                    className="h-8 sm:h-10 w-auto"
                  />
                ) : (
                  <img 
                    src="/LogoSkillScoreBlack.png" 
                    alt="SkillScore" 
                    className="h-8 sm:h-10 w-auto"
                  />
                )}
              </a>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <a
                    href="/login"
                    onClick={(e) => handleClick(e, 'login')}
                    className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                    aria-label="Login"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </a>
                  <button
                    onClick={toggleTheme}
                    className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
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
                <div className="hidden md:flex items-center gap-6">
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
                  className="md:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
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
        {menuAberto && !isHomeFree && !isHomeAdmin && (
          <div className="md:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
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
