import { useState } from 'react'
import { useTheme } from '../../Contexto/TemaContexto'

interface CabecalhoProps {
  onNavigate?: (pagina: string) => void
}

const Cabecalho = ({ onNavigate }: CabecalhoProps) => {
  const [menuAberto, setMenuAberto] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, pagina: string) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(pagina)
    }
    setMenuAberto(false)
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
            <div className="hidden md:flex items-center gap-6">
              <a 
                href="/" 
                onClick={(e) => handleClick(e, 'home')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Home
              </a>
              <a 
                href="/sobre" 
                onClick={(e) => handleClick(e, 'sobre')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sobre
              </a>
              <a 
                href="/integrantes" 
                onClick={(e) => handleClick(e, 'integrantes')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Integrantes
              </a>
              <a 
                href="/faq" 
                onClick={(e) => handleClick(e, 'faq')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                FAQ
              </a>
              <a 
                href="/contato" 
                onClick={(e) => handleClick(e, 'contato')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
        </div>
        {menuAberto && (
          <div className="md:hidden mt-4 border-t-2 border-gray-300 dark:border-gray-700 pt-4">
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
