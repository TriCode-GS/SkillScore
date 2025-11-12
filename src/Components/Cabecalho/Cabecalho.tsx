import { useState } from 'react'

interface CabecalhoProps {
  onNavigate?: (pagina: string) => void
}

const Cabecalho = ({ onNavigate }: CabecalhoProps) => {
  const [menuAberto, setMenuAberto] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, pagina: string) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(pagina)
    }
    setMenuAberto(false)
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            onClick={(e) => handleClick(e, 'home')}
            className="text-xl sm:text-2xl font-bold text-indigo-600"
          >
            <img 
              src="/LogoSkillScore.png" 
              alt="SkillScore" 
              className="h-8 sm:h-10 w-auto"
            />
            </a>
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="/" 
              onClick={(e) => handleClick(e, 'home')}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </a>
            <a 
              href="/sobre" 
              onClick={(e) => handleClick(e, 'sobre')}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Sobre
            </a>
            <a 
              href="/integrantes" 
              onClick={(e) => handleClick(e, 'integrantes')}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Integrantes
            </a>
            <a 
              href="/faq" 
              onClick={(e) => handleClick(e, 'faq')}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              FAQ
            </a>
          </div>
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50"
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
        {menuAberto && (
          <div className="md:hidden mt-4 border-t-2 border-gray-300 pt-4">
            <div className="flex flex-col bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden">
              <a 
                href="/" 
                onClick={(e) => handleClick(e, 'home')}
                className="px-4 py-4 text-gray-700 hover:text-white hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200"
              >
                Home
              </a>
              <a 
                href="/sobre" 
                onClick={(e) => handleClick(e, 'sobre')}
                className="px-4 py-4 text-gray-700 hover:text-white hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200"
              >
                Sobre
              </a>
              <a 
                href="/integrantes" 
                onClick={(e) => handleClick(e, 'integrantes')}
                className="px-4 py-4 text-gray-700 hover:text-white hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium border-b-2 border-gray-200"
              >
                Integrantes
              </a>
              <a 
                href="/faq" 
                onClick={(e) => handleClick(e, 'faq')}
                className="px-4 py-4 text-gray-700 hover:text-white hover:bg-indigo-600 active:bg-indigo-700 active:text-white transition-all duration-200 font-medium"
              >
                FAQ
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Cabecalho