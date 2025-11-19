import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import ListaSelecao from '../../Components/ListaSelecao/ListaSelecao'
import { buscarEmpresaPorCNPJ } from '../../Types/Empresa'
import { autenticarAdministradorEmpresa } from '../../Types/AutenticacaoLogin'

type TipoLogin = 'menu' | 'admin' | 'gestor' | 'funcionario'

interface AdminFormData {
  cnpj: string
  razaoSocial: string
  email: string
  senha: string
}

interface GestorFormData {
  empresa: string
  departamento: string
  email: string
  senha: string
}

interface FuncionarioFormData {
  empresa: string
  departamento: string
  email: string
  senha: string
}

const LoginCorporativo = () => {
  const navigate = useNavigate()
  const [tipoLogin, setTipoLogin] = useState<TipoLogin>('menu')
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  const empresas: string[] = []
  const departamentos: string[] = []

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return value
  }

  const FormularioAdmin = () => {
    const { login } = useAuth()
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<AdminFormData>({
      defaultValues: {
        razaoSocial: ''
      }
    })

    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)
    const cnpj = watch('cnpj', '')

    useEffect(() => {
      const buscarEmpresa = async () => {
        const cnpjLimpo = cnpj.replace(/\D/g, '')
        if (cnpjLimpo.length === 14) {
          setErro('')
          try {
            const empresa = await buscarEmpresaPorCNPJ(cnpj)
            setValue('razaoSocial', empresa.nomeEmpresa || empresa.razaoSocial || '')
          } catch (error) {
            const mensagemErro = error instanceof Error ? error.message : 'Erro ao buscar empresa'
            setErro(mensagemErro)
            setValue('razaoSocial', '')
          }
        } else if (cnpjLimpo.length > 0 && cnpjLimpo.length < 14) {
          setValue('razaoSocial', '')
          setErro('')
        }
      }

      const timeoutId = setTimeout(() => {
        buscarEmpresa()
      }, 500)

      return () => clearTimeout(timeoutId)
    }, [cnpj, setValue])

    const onSubmit = async (data: AdminFormData) => {
      setErro('')
      setCarregando(true)
      
      try {
        const response = await autenticarAdministradorEmpresa({
          email: data.email,
          senha: data.senha
        })
        
        if (response) {
          login({
            idUsuario: response.idUsuario,
            nomeUsuario: response.nomeUsuario,
            email: data.email,
            tipoUsuario: response.tipoUsuario,
            isAdmin: false
          })
          
          navigate('/admin/home')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao autenticar'
        setErro(mensagemErro)
      } finally {
        setCarregando(false)
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
          Administrador da Empresa
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
          Acesso completo ao painel administrativo
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {erro && (
            <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold break-words">
                {erro}
              </p>
            </div>
          )}
          
          <div>
            <label 
              htmlFor="cnpj" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              CNPJ
            </label>
            <Controller
              name="cnpj"
              control={control}
              rules={{ required: 'CNPJ é obrigatório' }}
              render={({ field }) => (
                <input
                  type="text"
                  id="cnpj"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(formatCNPJ(e.target.value))}
                  maxLength={18}
                  disabled={carregando}
                  className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="00.000.000/0000-00"
                />
              )}
            />
            {errors.cnpj && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.cnpj.message}
              </p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="razaoSocial" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Razão Social
            </label>
            <Controller
              name="razaoSocial"
              control={control}
              rules={{ required: 'Razão Social é obrigatória' }}
              render={({ field }) => (
                <input
                  type="text"
                  id="razaoSocial"
                  value={field.value || ''}
                  disabled
                  className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm sm:text-base cursor-not-allowed"
                  placeholder="Inclua o CNPJ e aguarde"
                />
              )}
            />
            {errors.razaoSocial && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.razaoSocial.message}
              </p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="emailAdmin" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="emailAdmin"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              disabled={carregando}
              className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
              htmlFor="senhaAdmin" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="senhaAdmin"
              {...register('senha', {
                required: 'Senha é obrigatória'
              })}
              disabled={carregando}
              className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
            onClick={() => setTipoLogin('menu')}
            className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
          >
            Voltar ao menu de seleção
          </button>
        </div>
      </div>
    )
  }

  const FormularioGestor = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<GestorFormData>()

    const onSubmit = (_data: GestorFormData) => {
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
          Gestor
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
          Acesso ao painel de gestão do departamento
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <Controller
            name="empresa"
            control={control}
            rules={{ required: 'Empresa é obrigatória' }}
            render={({ field }) => (
              <ListaSelecao
                options={empresas}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Selecione a empresa"
                label="Empresa"
                required
                id="empresaGestor"
              />
            )}
          />
          {errors.empresa && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.empresa.message}
            </p>
          )}
          
          <Controller
            name="departamento"
            control={control}
            rules={{ required: 'Departamento é obrigatório' }}
            render={({ field }) => (
              <ListaSelecao
                options={departamentos}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Nome do departamento"
                label="Departamento"
                required
                id="departamento"
              />
            )}
          />
          {errors.departamento && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.departamento.message}
            </p>
          )}
          
          <div>
            <label 
              htmlFor="emailGestor" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="emailGestor"
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
              htmlFor="senhaGestor" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="senhaGestor"
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
          >
            Entrar
          </Botao>
        </form>
        
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => setTipoLogin('menu')}
            className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
          >
            Voltar ao menu de seleção
          </button>
        </div>
      </div>
    )
  }

  const FormularioFuncionario = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<FuncionarioFormData>()

    const onSubmit = (_data: FuncionarioFormData) => {
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
          Funcionário
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
          Acesso à plataforma de desenvolvimento
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <Controller
            name="empresa"
            control={control}
            rules={{ required: 'Empresa é obrigatória' }}
            render={({ field }) => (
              <ListaSelecao
                options={empresas}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Selecione a empresa"
                label="Empresa"
                required
                id="empresaFuncionario"
              />
            )}
          />
          {errors.empresa && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.empresa.message}
            </p>
          )}
          
          <Controller
            name="departamento"
            control={control}
            rules={{ required: 'Departamento é obrigatório' }}
            render={({ field }) => (
              <ListaSelecao
                options={departamentos}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Nome do departamento"
                label="Departamento"
                required
                id="departamentoFuncionario"
              />
            )}
          />
          {errors.departamento && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.departamento.message}
            </p>
          )}
          
          <div>
            <label 
              htmlFor="emailFuncionario" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="emailFuncionario"
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
              htmlFor="senhaFuncionario" 
              className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="senhaFuncionario"
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
          >
            Entrar
          </Botao>
        </form>
        
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => setTipoLogin('menu')}
            className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
          >
            Voltar ao menu de seleção
          </button>
        </div>
      </div>
    )
  }

  const renderMenuSelecao = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
        Login Corporativo
      </h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
        Selecione o tipo de acesso
      </p>
      
      <div className="space-y-3 sm:space-y-4">
        <button
          onClick={() => setTipoLogin('admin')}
          className="w-full px-4 py-3 sm:py-4 text-left bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm sm:text-base mb-1">
            Administrador da Empresa
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Acesso completo ao painel administrativo
          </div>
        </button>
        
        <button
          onClick={() => setTipoLogin('gestor')}
          className="w-full px-4 py-3 sm:py-4 text-left bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm sm:text-base mb-1">
            Gestor
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Acesso ao painel de gestão do departamento
          </div>
        </button>
        
        <button
          onClick={() => setTipoLogin('funcionario')}
          className="w-full px-4 py-3 sm:py-4 text-left bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm sm:text-base mb-1">
            Funcionário
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Acesso à plataforma de desenvolvimento
          </div>
        </button>
      </div>
      
      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={() => handleNavigate('/login')}
          className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
        >
          Voltar para login de usuário
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {tipoLogin === 'menu' && renderMenuSelecao()}
            {tipoLogin === 'admin' && <FormularioAdmin />}
            {tipoLogin === 'gestor' && <FormularioGestor />}
            {tipoLogin === 'funcionario' && <FormularioFuncionario />}
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  )
}

export default LoginCorporativo
