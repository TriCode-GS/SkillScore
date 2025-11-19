import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import ListaSelecao from '../../Components/ListaSelecao/ListaSelecao'

type TipoLogin = 'menu' | 'admin' | 'gestor' | 'funcionario'

interface AdminFormData {
  cnpj: string
  razaoSocial: string
  senha: string
  lembrarMe: boolean
}

interface GestorFormData {
  empresa: string
  departamento: string
  email: string
  senha: string
  lembrarMe: boolean
}

interface FuncionarioFormData {
  empresa: string
  departamento: string
  email: string
  senha: string
  lembrarMe: boolean
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

  const getCheckboxClasses = (checked: boolean) => {
    const baseClasses = 'w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center'
    if (checked) {
      return `${baseClasses} bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500`
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-400`
  }

  const getCheckIconClasses = (checked: boolean) => {
    const baseClasses = 'w-3.5 h-3.5 text-white transition-opacity duration-200'
    return checked ? `${baseClasses} opacity-100` : `${baseClasses} opacity-0`
  }

  const FormularioAdmin = () => {
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<AdminFormData>({
      defaultValues: {
        lembrarMe: false
      }
    })

    const lembrarMe = watch('lembrarMe', false)

    const onSubmit = (_data: AdminFormData) => {
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
                  className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
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
          
          <Controller
            name="razaoSocial"
            control={control}
            rules={{ required: 'Razão Social é obrigatória' }}
            render={({ field }) => (
              <ListaSelecao
                options={empresas}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Nome da empresa"
                label="Razão Social"
                required
                id="razaoSocial"
              />
            )}
          />
          {errors.razaoSocial && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.razaoSocial.message}
            </p>
          )}
          
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
              className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              placeholder="••••••••"
            />
            {errors.senha && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.senha.message}
              </p>
            )}
          </div>
          
          <div className="flex items-center">
            <Controller
              name="lembrarMe"
              control={control}
              render={({ field }) => (
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={getCheckboxClasses(lembrarMe)}>
                      <svg 
                        className={getCheckIconClasses(lembrarMe)}
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
              )}
            />
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

  const FormularioGestor = () => {
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<GestorFormData>({
      defaultValues: {
        lembrarMe: false
      }
    })

    const lembrarMe = watch('lembrarMe', false)

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
          
          <div className="flex items-center">
            <Controller
              name="lembrarMe"
              control={control}
              render={({ field }) => (
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={getCheckboxClasses(lembrarMe)}>
                      <svg 
                        className={getCheckIconClasses(lembrarMe)}
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
              )}
            />
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
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FuncionarioFormData>({
      defaultValues: {
        lembrarMe: false
      }
    })

    const lembrarMe = watch('lembrarMe', false)

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
          
          <div className="flex items-center">
            <Controller
              name="lembrarMe"
              control={control}
              render={({ field }) => (
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={getCheckboxClasses(lembrarMe)}>
                      <svg 
                        className={getCheckIconClasses(lembrarMe)}
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
              )}
            />
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
