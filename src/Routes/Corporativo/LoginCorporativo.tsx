import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import { buscarEmpresaPorCNPJ } from '../../Types/Empresa'
import { autenticarAdministradorEmpresa, autenticarGestor, autenticarFuncionario, buscarUsuarioPorId } from '../../Types/AutenticacaoLogin'

type TipoLogin = 'menu' | 'admin' | 'gestor' | 'funcionario'

interface AdminFormData {
  cnpj: string
  razaoSocial: string
  email: string
  senha: string
}

interface GestorFormData {
  email: string
  senha: string
}

interface FuncionarioFormData {
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
          const idUsuarioNum = response.idUsuario || 0
          
          let nomeUsuarioCompleto = response.nomeUsuario || response.nome
          
          if (!nomeUsuarioCompleto && idUsuarioNum > 0) {
            try {
              const usuarioCompleto = await buscarUsuarioPorId(idUsuarioNum)
              nomeUsuarioCompleto = usuarioCompleto.nomeUsuario || nomeUsuarioCompleto
            } catch (error) {
            }
          }
          
          if (!nomeUsuarioCompleto) {
            const emailPart = data.email.split('@')[0]
            const nomePart = emailPart.split('.')[0]
            nomeUsuarioCompleto = nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
          }
          
          const userData = {
            idUsuario: idUsuarioNum,
            nomeUsuario: nomeUsuarioCompleto,
            nome: nomeUsuarioCompleto,
            email: data.email,
            tipoUsuario: response.tipoUsuario || 'ADMINISTRADOR EMP',
            isAdmin: false
          }
          
          login(userData)
          
          setTimeout(() => {
            navigate('/admin-emp/home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 200)
        }
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao autenticar'
        setErro(mensagemErro)
      } finally {
        setCarregando(false)
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 text-center break-words px-2">
          Administrador da Empresa
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 text-center px-2">
          Acesso completo ao painel administrativo
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-6">
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
    const { login } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<GestorFormData>({
      defaultValues: {
        email: '',
        senha: ''
      },
      mode: 'onSubmit'
    })
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    const onSubmit = async (data: GestorFormData) => {
      setErro('')
      setCarregando(true)
      
      const emailTrimmed = data.email.trim()
      const senhaTrimmed = data.senha.trim()
      
      if (!emailTrimmed) {
        setErro('Email é obrigatório')
        setCarregando(false)
        return
      }
      
      if (!senhaTrimmed) {
        setErro('Senha é obrigatória')
        setCarregando(false)
        return
      }
      
      try {
        const response = await autenticarGestor({
          email: emailTrimmed,
          senha: senhaTrimmed
        })
        
        if (response) {
          const idUsuarioNum = response.idUsuario || 0
          
          if (idUsuarioNum <= 0) {
            setErro('Erro ao obter dados do usuário')
            setCarregando(false)
            return
          }
          
          let nomeUsuarioCompleto = response.nomeUsuario || response.nome || ''
          let tipoUsuarioVerificado = ''
          
          try {
            const usuarioCompleto = await buscarUsuarioPorId(idUsuarioNum)
            tipoUsuarioVerificado = usuarioCompleto.tipoUsuario || ''
            nomeUsuarioCompleto = usuarioCompleto.nomeUsuario || nomeUsuarioCompleto
          } catch (error) {
            setErro('Erro ao buscar dados do usuário')
            setCarregando(false)
            return
          }
          
          if (tipoUsuarioVerificado.toUpperCase().trim() !== 'GESTOR') {
            setErro('Acesso negado. Apenas gestores podem fazer login aqui.')
            setCarregando(false)
            return
          }
          
          const tipoLogin = response.tipoLogin || ''
          if (tipoLogin.toUpperCase().trim() !== 'GESTOR') {
            setErro('Acesso negado. Apenas gestores podem fazer login aqui.')
            setCarregando(false)
            return
          }
          
          if (!nomeUsuarioCompleto) {
            const emailPart = emailTrimmed.split('@')[0]
            const nomePart = emailPart.split('.')[0]
            nomeUsuarioCompleto = nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
          }
          
          const userData = {
            idUsuario: idUsuarioNum,
            nomeUsuario: nomeUsuarioCompleto,
            nome: nomeUsuarioCompleto,
            email: emailTrimmed,
            tipoUsuario: 'GESTOR',
            isAdmin: false
          }
          
          login(userData)
          
          setTimeout(() => {
            navigate('/gestor/home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 200)
        }
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao autenticar'
        setErro(mensagemErro)
      } finally {
        setCarregando(false)
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 text-center break-words px-2">
          Gestor
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 text-center px-2">
          Acesso ao painel de gestão do departamento
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-6">
          {erro && (
            <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold break-words">
                {erro}
              </p>
            </div>
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

  const FormularioFuncionario = () => {
    const { login } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<FuncionarioFormData>({
      defaultValues: {
        email: '',
        senha: ''
      },
      mode: 'onSubmit'
    })
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    const onSubmit = async (data: FuncionarioFormData) => {
      setErro('')
      setCarregando(true)
      
      const emailTrimmed = data.email.trim()
      const senhaTrimmed = data.senha.trim()
      
      if (!emailTrimmed) {
        setErro('Email é obrigatório')
        setCarregando(false)
        return
      }
      
      if (!senhaTrimmed) {
        setErro('Senha é obrigatória')
        setCarregando(false)
        return
      }
      
      try {
        const response = await autenticarFuncionario({
          email: emailTrimmed,
          senha: senhaTrimmed
        })
        
        if (response) {
          const idUsuarioNum = response.idUsuario || 0
          
          if (idUsuarioNum <= 0) {
            setErro('Erro ao obter dados do usuário')
            setCarregando(false)
            return
          }
          
          let nomeUsuarioCompleto = response.nomeUsuario || response.nome || ''
          let tipoUsuarioVerificado = ''
          
          try {
            const usuarioCompleto = await buscarUsuarioPorId(idUsuarioNum)
            tipoUsuarioVerificado = usuarioCompleto.tipoUsuario || ''
            nomeUsuarioCompleto = usuarioCompleto.nomeUsuario || nomeUsuarioCompleto
          } catch (error) {
            setErro('Erro ao buscar dados do usuário')
            setCarregando(false)
            return
          }
          
          if (tipoUsuarioVerificado.toUpperCase().trim() !== 'FUNCIONARIO') {
            setErro('Acesso negado. Apenas funcionários podem fazer login aqui.')
            setCarregando(false)
            return
          }
          
          const tipoLogin = response.tipoLogin || ''
          if (tipoLogin.toUpperCase().trim() !== 'FUNCIONARIO') {
            setErro('Acesso negado. Apenas funcionários podem fazer login aqui.')
            setCarregando(false)
            return
          }
          
          if (!nomeUsuarioCompleto) {
            const emailPart = emailTrimmed.split('@')[0]
            const nomePart = emailPart.split('.')[0]
            nomeUsuarioCompleto = nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
          }
          
          const userData = {
            idUsuario: idUsuarioNum,
            nomeUsuario: nomeUsuarioCompleto,
            nome: nomeUsuarioCompleto,
            email: emailTrimmed,
            tipoUsuario: 'FUNCIONARIO',
            isAdmin: false
          }
          
          login(userData)
          
          setTimeout(() => {
            navigate('/funcionario/home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 200)
        }
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao autenticar'
        setErro(mensagemErro)
      } finally {
        setCarregando(false)
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 text-center break-words px-2">
          Funcionário
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 text-center px-2">
          Acesso à plataforma de desenvolvimento
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-6">
          {erro && (
            <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold break-words">
                {erro}
              </p>
            </div>
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

  const renderMenuSelecao = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 border-2 border-indigo-200 dark:border-indigo-800">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 text-center break-words px-2">
        Login Corporativo
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 text-center px-2">
        Selecione o tipo de acesso
      </p>
      
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        <button
          onClick={() => setTipoLogin('admin')}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 text-left bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm md:text-base mb-1 break-words">
            Administrador da Empresa
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
            Acesso completo ao painel administrativo
          </div>
        </button>
        
        <button
          onClick={() => setTipoLogin('gestor')}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 text-left bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm md:text-base mb-1 break-words">
            Gestor
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
            Acesso ao painel de gestão do departamento
          </div>
        </button>
        
        <button
          onClick={() => setTipoLogin('funcionario')}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 text-left bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm md:text-base mb-1 break-words">
            Funcionário
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
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
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16">
        <section className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-md mx-auto w-full">
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
