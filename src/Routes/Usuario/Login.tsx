import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import { autenticarUsuario, buscarUsuarioPorId } from '../../Types/AutenticacaoLogin'

interface LoginProps {
  onNavigate?: (pagina: string) => void
}

interface LoginFormData {
  email: string
  senha: string
}

const Login = ({ onNavigate }: LoginProps) => {
  const [erroLogin, setErroLogin] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setErroLogin('')
    
    const emailTrimmed = data.email.trim()
    const senhaTrimmed = data.senha.trim()
    
    setCarregando(true)

    try {
      const response = await autenticarUsuario({ email: emailTrimmed, senha: senhaTrimmed }) as any
      
      const idUsuarioNum = response.idUsuario || response.id_usuario || parseInt(response.id?.toString() || '0')
      
      let nomeUsuarioCompleto = response.nomeUsuario || response.nome || emailTrimmed.split('@')[0]
      
      try {
        const usuarioCompleto = await buscarUsuarioPorId(idUsuarioNum)
        nomeUsuarioCompleto = usuarioCompleto.nomeUsuario
      } catch (error) {
      }
      
      const userData = {
        id: idUsuarioNum.toString(),
        idUsuario: idUsuarioNum,
        nome: nomeUsuarioCompleto,
        nomeUsuario: nomeUsuarioCompleto,
        email: response.email || emailTrimmed
      }
      
      login(userData)
      
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
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
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
                    {...register('senha', {
                      required: 'Senha é obrigatória'
                    })}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                  {errors.senha && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.senha.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-end">
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
