import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import { autenticarAdministrador } from '../../Types/AutenticacaoLogin'

interface LoginAdminProps {
  onNavigate?: (pagina: string) => void
}

interface LoginAdminFormData {
  email: string
  senha: string
}

const LoginAdmin = ({ onNavigate }: LoginAdminProps) => {
  const [erroLogin, setErroLogin] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginAdminFormData>()

  const onSubmit = async (data: LoginAdminFormData) => {
    setErroLogin('')
    setCarregando(true)

    try {
      const emailTrimmed = data.email.trim()
      const senhaTrimmed = data.senha.trim()

      if (!emailTrimmed) {
        setErroLogin('Email é obrigatório')
        setCarregando(false)
        return
      }

      if (!senhaTrimmed) {
        setErroLogin('Senha é obrigatória')
        setCarregando(false)
        return
      }

      const response = await autenticarAdministrador({ email: emailTrimmed, senha: senhaTrimmed }) as any
      
      const adminData = {
        id: response.idUsuario?.toString() || response.id_usuario?.toString() || '',
        idUsuario: response.idUsuario || response.id_usuario || 0,
        email: response.email || emailTrimmed,
        nome: response.nomeUsuario || response.nome || emailTrimmed.split('@')[0],
        nomeUsuario: response.nomeUsuario || response.nome || emailTrimmed.split('@')[0],
        isAdmin: true,
        tipoUsuario: 'ADMINISTRADOR'
      }
      
      login(adminData)
      
      setCarregando(false)
      
      if (onNavigate) {
        onNavigate('homeAdmin')
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
                Login Administrador
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
                Acesso restrito ao painel administrativo
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
                    placeholder="admin@email.com"
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
