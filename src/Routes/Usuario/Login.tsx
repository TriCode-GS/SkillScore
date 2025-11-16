import { useState } from 'react'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import { autenticarLogin } from '../../Types/AutenticacaoLogin'

interface LoginProps {
  onNavigate?: (pagina: string) => void
}

const Login = ({ onNavigate }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrarMe, setLembrarMe] = useState(false)
  const [erroLogin, setErroLogin] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErroLogin('')
    setCarregando(true)

    try {
      const response = await autenticarLogin({ email, senha }) as { id?: string; nome?: string; email?: string }
      
      login({
        id: response.id,
        nome: response.nome,
        email: response.email || email
      })

      setCarregando(false)
      
      if (onNavigate) {
        onNavigate('homeFree')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      setCarregando(false)
      setErroLogin(error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.')
    }
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
                Login
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
                Entre com suas credenciais para acessar sua conta
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {erroLogin && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                      {erroLogin}
                    </p>
                  </div>
                )}
                
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
                    placeholder="seu@email.com"
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
                
                <div className="flex items-center justify-between">
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
                  <a
                    href="#"
                    className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                
                <Botao
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={carregando}
                >
                  {carregando ? 'Entrando...' : 'Entrar'}
                </Botao>
              </form>
              
              <div className="mt-6 sm:mt-8 space-y-4 text-center">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => {
                      onNavigate?.('cadastro')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Cadastre-se
                  </button>
                </p>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <button
                    onClick={() => {
                      onNavigate?.('loginCorporativo')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="w-full px-4 py-2.5 text-sm sm:text-base font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200"
                  >
                    Login Corporativo
                  </button>
                  <button
                    onClick={() => onNavigate?.('loginAdmin')}
                    className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Acesso Administrador
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Rodape onNavigate={onNavigate} />
    </div>
  )
}

export default Login

