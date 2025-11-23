import { Link } from 'react-router-dom'

interface LinkRapido {
  label: string
  path: string
  onClick?: () => void
  disabled?: boolean
}

interface RodapeProps {
  linksRapidos?: LinkRapido[]
  onLinkClick?: (path: string) => void
}

const Rodape = ({ linksRapidos, onLinkClick }: RodapeProps) => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const linksPadrao: LinkRapido[] = [
    { label: 'Home', path: '/' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Integrantes', path: '/integrantes' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contato', path: '/contato' }
  ]

  const linksParaUsar = linksRapidos || linksPadrao

  const handleLink = (link: LinkRapido) => {
    if (link.onClick) {
      link.onClick()
    } else if (onLinkClick) {
      onLinkClick(link.path)
    } else {
      handleLinkClick()
    }
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 dark:text-indigo-600 mb-3 sm:mb-4">
              SkillScore
            </h3>
            <p className="text-sm sm:text-base text-gray-400 dark:text-gray-600">
              Transforme seu desenvolvimento profissional em uma jornada gamificada e progressiva.
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {linksParaUsar.map((link, index) => (
                <li key={index}>
                  {link.disabled ? (
                    <span className="text-gray-400 dark:text-gray-600 opacity-60 cursor-not-allowed text-left">
                      {link.label}
                    </span>
                  ) : onLinkClick || link.onClick ? (
                    <button
                      onClick={() => {
                        if (!link.disabled) {
                          handleLink(link)
                        }
                      }}
                      disabled={link.disabled}
                      className={`text-left transition-colors ${
                        link.disabled
                          ? 'text-gray-400 dark:text-gray-600 opacity-60 cursor-not-allowed pointer-events-none'
                          : 'text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600'
                      }`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link 
                      to={link.path} 
                      onClick={(e) => {
                        if (link.disabled) {
                          e.preventDefault()
                          return
                        }
                        handleLinkClick()
                      }}
                      className={`transition-colors ${
                        link.disabled
                          ? 'text-gray-400 dark:text-gray-600 opacity-60 cursor-not-allowed pointer-events-none'
                          : 'text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm sm:text-base text-gray-400 dark:text-gray-600">TriCode</span>
              </li>
              <li>
                <span className="text-sm sm:text-base text-gray-400 dark:text-gray-600">São Paulo, 2025</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contato</h4>
            {onLinkClick ? (
              <button
                onClick={() => onLinkClick('/contato')}
                className="text-sm sm:text-base text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors cursor-pointer text-left"
              >
                Entre em contato conosco para mais informações sobre nossos planos e serviços.
              </button>
            ) : (
              <Link
                to="/contato"
                onClick={handleLinkClick}
                className="text-sm sm:text-base text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Entre em contato conosco para mais informações sobre nossos planos e serviços.
              </Link>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-300 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 dark:text-gray-600">
          <p className="text-xs sm:text-sm">&copy; 2025 TriCode - SkillScore. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Rodape
