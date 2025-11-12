interface RodapeProps {
  onNavigate?: (pagina: string) => void
}

const Rodape = ({ onNavigate }: RodapeProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, pagina: string) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(pagina)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
              <li>
                <a 
                  href="/" 
                  onClick={(e) => handleClick(e, 'home')}
                  className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/sobre" 
                  onClick={(e) => handleClick(e, 'sobre')}
                  className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a 
                  href="/integrantes" 
                  onClick={(e) => handleClick(e, 'integrantes')}
                  className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors"
                >
                  Integrantes
                </a>
              </li>
              <li>
                <a 
                  href="/faq" 
                  onClick={(e) => handleClick(e, 'faq')}
                  className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="/contato" 
                  onClick={(e) => handleClick(e, 'contato')}
                  className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors"
                >
                  Contato
                </a>
              </li>
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
            <a
              href="/contato"
              onClick={(e) => handleClick(e, 'contato')}
              className="text-sm sm:text-base text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Entre em contato conosco para mais informações sobre nossos planos e serviços.
            </a>
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
