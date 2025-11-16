import { useState } from 'react'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'

interface LoginAdminProps {
  onNavigate?: (pagina: string) => void
}

const LoginAdmin = ({ onNavigate }: LoginAdminProps) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrarMe, setLembrarMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const getCheckboxClasses = () => {
    const baseClasses = 'w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center'
    if (lembrarMe) {
      return `${baseClasses} bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500`
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-400`
  }

  const getCheckIconClasses = () => {
    const baseClasses = 'w-3.5 h-3.5 text-white transition-opacity duration-200'
    return lembrarMe ? `${baseClasses} opacity-100` : `${baseClasses} opacity-0`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
                Login Administrador
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
                Acesso restrito ao painel administrativo
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="admin@email.com"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="senha" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={lembrarMe}
                        onChange={(e) => setLembrarMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={getCheckboxClasses()}>
                        <svg 
                          className={getCheckIconClasses()}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Lembrar-me
                    </span>
                  </label>
                </div>
                
                <Botao
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Entrar
                </Botao>
              </form>
              
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={() => onNavigate?.('login')}
                  className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                >
                  Voltar para login de usuário
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Rodape onNavigate={onNavigate} />
    </div>
  )
}

export default LoginAdmin

