import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../../Components/Cabecalho/Cabecalho'
import Botao from '../../../Components/Botao/Botao'
import { criarUsuario, listarUsuarios, criarLogin, buscarUsuarioPorId, type UsuarioResponse, type LoginData, type UsuarioData, type LoginApiResponse, getBaseUrl } from '../../../Types/AutenticacaoLogin'

interface FuncionarioFormData {
  nomeUsuario: string
  nivelSenioridade: string
  email: string
  senha: string
  confirmarSenha: string
}

const GerenciarFuncionarios = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [funcionarios, setFuncionarios] = useState<(UsuarioResponse & { email?: string; idLogin?: number })[]>([])
  const [carregando, setCarregando] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [erro, setErro] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [erroValidacoesSenha, setErroValidacoesSenha] = useState(false)
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [idDepartamentoGestor, setIdDepartamentoGestor] = useState<number | null>(null)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, watch, formState: { errors: errorsCadastro } } = useForm<FuncionarioFormData>()

  const senha = watch('senha', '')
  const confirmarSenha = watch('confirmarSenha', '')

  useEffect(() => {
    if (senha && confirmarSenha && senha !== confirmarSenha) {
      setErroSenha(true)
    } else {
      setErroSenha(false)
    }
  }, [senha, confirmarSenha])

  const validarSenha = (senhaAtual: string) => {
    const temConteudo = senhaAtual.length > 0
    return {
      maxCaracteres: temConteudo && senhaAtual.length >= 8 && senhaAtual.length <= 16,
      maiusculasMinusculas: temConteudo && /[a-z]/.test(senhaAtual) && /[A-Z]/.test(senhaAtual),
      temNumero: temConteudo && /\d/.test(senhaAtual),
      temCaractereEspecial: temConteudo && /[!@#$%&*]/.test(senhaAtual),
      semEspacos: temConteudo && !/\s/.test(senhaAtual),
      semInfoPessoal: true
    }
  }

  const validacoesSenha = validarSenha(senha)

  const getCheckboxInstrucaoClasses = (validado: boolean) => {
    const baseClasses = 'w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center'
    if (validado) {
      return `${baseClasses} bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500`
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700`
  }

  const getCheckIconInstrucaoClasses = (validado: boolean) => {
    const baseClasses = 'w-3.5 h-3.5 text-white transition-opacity duration-200'
    return validado ? `${baseClasses} opacity-100` : `${baseClasses} opacity-0`
  }

  useEffect(() => {
    if (!isAuthenticated || user?.tipoUsuario !== 'GESTOR') {
      const timer = setTimeout(() => {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    
    const carregarDepartamentoGestor = async () => {
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          setIdDepartamentoGestor(usuarioCompleto.idDepartamento || null)
        } catch (error) {
        }
      }
    }
    
    carregarDepartamentoGestor()
    carregarFuncionarios()
  }, [isAuthenticated, user, navigate])

  const carregarFuncionarios = async () => {
    setCarregando(true)
    setErro('')
    try {
      let idDepartamento: number | null = null
      
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          idDepartamento = usuarioCompleto.idDepartamento || null
          setIdDepartamentoGestor(idDepartamento)
        } catch (error) {
        }
      }
      
      const usuariosListados = await listarUsuarios()
      
      const funcionariosFiltrados = usuariosListados.filter((usuario) => {
        const tipoUsuario = (usuario.tipoUsuario || '').trim().toUpperCase()
        if (tipoUsuario !== 'FUNCIONARIO') return false
        if (idDepartamento !== null) {
          return usuario.idDepartamento === idDepartamento
        }
        return false
      })
      
      try {
        const baseUrl = getBaseUrl()
        const urlStringLogins = `${baseUrl}/logins`
        const resLogins = await fetch(urlStringLogins, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
        })
        
        let loginsListados: LoginApiResponse[] = []
        if (resLogins.ok) {
          loginsListados = await resLogins.json() as LoginApiResponse[]
        }
        
        const funcionariosComEmail = funcionariosFiltrados.map((funcionario) => {
          const login = loginsListados.find((l) => {
            const loginIdUsuario = l.idUsuario
            return loginIdUsuario != null && Number(loginIdUsuario) === Number(funcionario.idUsuario)
          })
          
          const email = login?.email || '-'
          const idLogin = login?.idLogin
          return { ...funcionario, email, idLogin }
        })
        
        setFuncionarios(funcionariosComEmail)
      } catch (error) {
        setFuncionarios(funcionariosFiltrados.map(f => ({ ...f, email: '-' })))
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar funcionários')
    } finally {
      setCarregando(false)
    }
  }

  const onSubmitCadastro = async (data: FuncionarioFormData) => {
    setErro('')
    setErroSenha(false)
    setErroValidacoesSenha(false)
    
    if (data.senha !== data.confirmarSenha) {
      setErroSenha(true)
      setErro('As senhas não coincidem')
      return
    }
    
    const todasValidacoesSenha = 
      validacoesSenha.maxCaracteres &&
      validacoesSenha.maiusculasMinusculas &&
      validacoesSenha.temNumero &&
      validacoesSenha.temCaractereEspecial &&
      validacoesSenha.semEspacos &&
      validacoesSenha.semInfoPessoal
    
    if (!todasValidacoesSenha) {
      setErroValidacoesSenha(true)
      setErro('Você precisa atender a todos os requisitos de senha para criar um funcionário')
      return
    }
    
    let idDepartamento = idDepartamentoGestor
    
    if (!idDepartamento && user?.idUsuario) {
      try {
        const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
        idDepartamento = usuarioCompleto.idDepartamento || null
        setIdDepartamentoGestor(idDepartamento)
      } catch (error) {
        setErro('Erro ao buscar informações do departamento')
        return
      }
    }
    
    if (!idDepartamento) {
      setErro('Não foi possível identificar o departamento do gestor. Verifique se você está vinculado a um departamento.')
      return
    }
    
    setCarregandoCadastro(true)
    
    try {
      const usuarioData: UsuarioData = {
        nomeUsuario: data.nomeUsuario.trim(),
        tipoUsuario: 'FUNCIONARIO',
        nivelSenioridade: data.nivelSenioridade.trim() || null,
        competencias: null,
        idDepartamento: idDepartamento
      }
      
      const usuarioCriado = await criarUsuario(usuarioData)
      const idUsuario = usuarioCriado.idUsuario
      
      const loginData: LoginData = {
        idUsuario: idUsuario,
        email: data.email.trim(),
        senha: data.senha,
        tipoLogin: 'FUNCIONARIO'
      }
      
      await criarLogin(loginData)
      
      resetCadastro()
      setErro('')
      await carregarFuncionarios()
      setMostrarModalCadastro(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao cadastrar funcionário'
      setErro(mensagemErro)
    } finally {
      setCarregandoCadastro(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login-corporativo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || user?.tipoUsuario !== 'GESTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho isHomeGestor={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => {
                    handleNavigate('/gestor/home')
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap"
                >
                  Voltar ao Menu
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 md:gap-5 mb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-0 flex-1 min-w-0">
                  <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words">
                      Gerenciar Funcionários
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-start gap-0 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                        Visualize e gerencie todos os funcionários do departamento
                      </p>
                      <button
                        onClick={async () => {
                          if (!idDepartamentoGestor && user?.idUsuario) {
                            try {
                              const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
                              setIdDepartamentoGestor(usuarioCompleto.idDepartamento || null)
                            } catch (error) {
                              setErro('Erro ao carregar informações do departamento')
                            }
                          }
                          resetCadastro()
                          setMostrarModalCadastro(true)
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl flex-shrink-0 md:ml-5 self-start md:self-start mt-2 md:-mt-8"
                        aria-label="Novo Funcionário"
                      >
                        <svg 
                          className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M12 4v16m8-8H4" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleNavigate('/gestor/home')
                  }}
                  className="hidden md:block px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap self-auto"
                >
                  Voltar ao Menu
                </button>
              </div>
            </div>

            {erro && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  {erro}
                </p>
              </div>
            )}

            {carregando && funcionarios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Carregando funcionários...</p>
              </div>
            ) : funcionarios.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Nenhum funcionário cadastrado</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Nome do Funcionário</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Cargo Atual</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {funcionarios.map((funcionario) => (
                          <tr key={funcionario.idUsuario} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              <div className="truncate md:whitespace-normal" title={funcionario.nomeUsuario || '-'}>
                                {funcionario.nomeUsuario || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              <div className="truncate md:whitespace-normal" title={funcionario.nivelSenioridade || '-'}>
                                {funcionario.nivelSenioridade || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              <div className="truncate md:whitespace-normal" title={funcionario.email || '-'}>
                                {funcionario.email || '-'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {mostrarModalCadastro && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-indigo-200 dark:border-indigo-800 max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] flex flex-col m-2 sm:m-3 md:m-0">
            <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                Cadastrar Funcionário
              </h2>
              <button
                onClick={() => {
                  if (!carregandoCadastro) {
                    setMostrarModalCadastro(false)
                    resetCadastro()
                    setErro('')
                    setErroSenha(false)
                    setErroValidacoesSenha(false)
                  }
                }}
                disabled={carregandoCadastro}
                className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${carregandoCadastro ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5">
              {erro && (
                <div className="mb-3 sm:mb-4 md:mb-5 p-3 sm:p-4 md:p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-xs sm:text-sm md:text-base text-red-600 dark:text-red-400 font-semibold break-words">
                    {erro}
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmitCadastro(onSubmitCadastro)} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Funcionário *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('nomeUsuario', { required: 'Nome do funcionário é obrigatório' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Nome completo"
                    disabled={carregandoCadastro}
                  />
                  {errorsCadastro.nomeUsuario && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.nomeUsuario.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Cargo Atual *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('nivelSenioridade', { required: 'Cargo atual é obrigatório' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Ex: Desenvolvedor Júnior"
                    disabled={carregandoCadastro}
                  />
                  {errorsCadastro.nivelSenioridade && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.nivelSenioridade.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...registerCadastro('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="email@exemplo.com"
                    disabled={carregandoCadastro}
                  />
                  {errorsCadastro.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className={`mb-4 p-4 rounded-lg border ${
                    erroValidacoesSenha 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Instruções para Criação da Senha
                    </p>
                    {erroValidacoesSenha && (
                      <p className="mb-3 text-sm text-red-600 dark:text-red-400 font-semibold">
                        Você precisa atender a todos os requisitos de senha para criar um funcionário
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.maxCaracteres)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.maxCaracteres)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          A senha deve ter entre 8 e 16 caracteres
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.maiusculasMinusculas)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.maiusculasMinusculas)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Utilize letras maiúsculas e minúsculas
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.temNumero)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.temNumero)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Inclua pelo menos um número
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.temCaractereEspecial)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.temCaractereEspecial)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Inclua pelo menos um caractere especial (! @ # $ % & * …)
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.semEspacos)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.semEspacos)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Não utilize espaços
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.semInfoPessoal)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.semInfoPessoal)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Evite informações pessoais, como nome ou data de nascimento (Opcional)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Senha *
                  </label>
                  
                  <input
                    type="password"
                    {...registerCadastro('senha', {
                      required: 'Senha é obrigatória',
                      maxLength: {
                        value: 16,
                        message: 'A senha deve ter no máximo 16 caracteres'
                      },
                      minLength: {
                        value: 8,
                        message: 'A senha deve ter no mínimo 8 caracteres'
                      },
                      onChange: () => {
                        setErroValidacoesSenha(false)
                      }
                    })}
                    maxLength={16}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="••••••••"
                    disabled={carregandoCadastro}
                  />
                  {errorsCadastro.senha && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.senha.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    {...registerCadastro('confirmarSenha', {
                      required: 'Confirmação de senha é obrigatória',
                      validate: (value) => value === senha || 'As senhas não coincidem'
                    })}
                    maxLength={16}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm ${
                      erroSenha 
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-400'
                    }`}
                    placeholder="••••••••"
                    disabled={carregandoCadastro}
                  />
                  {erroSenha && confirmarSenha && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      As senhas não coincidem
                    </p>
                  )}
                  {errorsCadastro.confirmarSenha && !erroSenha && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.confirmarSenha.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 pt-3 sm:pt-4 md:pt-5 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                <Botao
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  disabled={carregandoCadastro}
                  onClick={() => {
                    if (!carregandoCadastro) {
                      setMostrarModalCadastro(false)
                      resetCadastro()
                      setErro('')
                      setErroSenha(false)
                      setErroValidacoesSenha(false)
                    }
                  }}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  disabled={carregandoCadastro}
                  onClick={handleSubmitCadastro(onSubmitCadastro)}
                >
                  {carregandoCadastro ? 'Cadastrando...' : 'Cadastrar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GerenciarFuncionarios

