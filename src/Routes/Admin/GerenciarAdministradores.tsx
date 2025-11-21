import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Botao from '../../Components/Botao/Botao'
import Rodape from '../../Components/Rodape/Rodape'
import { criarUsuario, atualizarUsuario, listarUsuarios, excluirUsuario, excluirLogin, criarLogin, atualizarLogin, type UsuarioResponse, type LoginData, type LoginUpdateData, type UsuarioData, type LoginApiResponse, getBaseUrl } from '../../Types/AutenticacaoLogin'

interface AdministradorFormData {
  nomeUsuario: string
  email: string
  senha: string
  confirmarSenha: string
}

interface AdministradorEdicaoFormData {
  nomeUsuario: string
  email: string
  senha: string
  confirmarSenha: string
}

const GerenciarAdministradores = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [administradores, setAdministradores] = useState<(UsuarioResponse & { nomeEmpresa?: string; email?: string; idLogin?: number })[]>([])
  const [carregando, setCarregando] = useState(false)
  const [carregandoEdicao, setCarregandoEdicao] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [carregandoExclusao, setCarregandoExclusao] = useState(false)
  const [erro, setErro] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [erroValidacoesSenha, setErroValidacoesSenha] = useState(false)
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false)
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false)
  const [administradorSelecionado, setAdministradorSelecionado] = useState<UsuarioResponse | null>(null)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, watch, formState: { errors: errorsCadastro } } = useForm<AdministradorFormData>()
  const { register: registerEdicao, handleSubmit: handleSubmitEdicao, reset: resetEdicao, watch: watchEdicao, formState: { errors: errorsEdicao } } = useForm<AdministradorEdicaoFormData>()

  const senhaEdicao = watchEdicao('senha', '')
  const confirmarSenhaEdicao = watchEdicao('confirmarSenha', '')

  useEffect(() => {
    if (senhaEdicao && confirmarSenhaEdicao && senhaEdicao !== confirmarSenhaEdicao) {
      setErroSenha(true)
    } else {
      setErroSenha(false)
    }
  }, [senhaEdicao, confirmarSenhaEdicao])

  const validarSenhaEdicao = (senhaAtual: string) => {
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

  const validacoesSenhaEdicao = validarSenhaEdicao(senhaEdicao)

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
    if (!isAuthenticated || !user?.isAdmin) {
      const timer = setTimeout(() => {
        navigate('/admin/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    carregarAdministradores()
  }, [isAuthenticated, user, navigate])

  const carregarAdministradores = async () => {
    setCarregando(true)
    setErro('')
    try {
      const usuariosListados = await listarUsuarios()
      
      const administradoresFiltrados = usuariosListados.filter((usuario) => {
        const tipoUsuario = (usuario.tipoUsuario || '').trim().toUpperCase()
        return tipoUsuario === 'ADMINISTRADOR EMP'
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
        
        const administradoresComEmail = administradoresFiltrados.map((administrador) => {
          const login = loginsListados.find((l) => {
            const loginIdUsuario = l.idUsuario
            return loginIdUsuario != null && Number(loginIdUsuario) === Number(administrador.idUsuario)
          })
          
          const email = login?.email || '-'
          const idLogin = login?.idLogin
          return { ...administrador, email, idLogin }
        })
        
        setAdministradores(administradoresComEmail)
      } catch (error) {
        setAdministradores(administradoresFiltrados.map(a => ({ ...a, email: '-' })))
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar administradores')
    } finally {
      setCarregando(false)
    }
  }

  const onSubmitCadastro = async (data: AdministradorFormData) => {
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
      setErro('Você precisa atender a todos os requisitos de senha para criar um administrador')
      return
    }
    
    setCarregandoCadastro(true)
    
    try {
      const usuarioData: UsuarioData = {
        nomeUsuario: data.nomeUsuario.trim(),
        tipoUsuario: 'ADMINISTRADOR EMP',
        nivelSenioridade: null,
        competencias: null,
        idEmpresa: null
      }
      
      const usuarioCriado = await criarUsuario(usuarioData)
      const idUsuario = usuarioCriado.idUsuario
      
      const loginData: LoginData = {
        idUsuario: idUsuario,
        email: data.email.trim(),
        senha: data.senha,
        tipoLogin: 'ADMINISTRADOR EMP'
      }
      
      await criarLogin(loginData)
      
      resetCadastro()
      setErro('')
      await carregarAdministradores()
      setMostrarModalCadastro(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao cadastrar administrador'
      setErro(mensagemErro)
    } finally {
      setCarregandoCadastro(false)
    }
  }

  const abrirModalEdicao = (administrador: UsuarioResponse & { email?: string }) => {
    setAdministradorSelecionado(administrador)
    resetEdicao({
      nomeUsuario: administrador.nomeUsuario || '',
      email: administrador.email || '',
      senha: '',
      confirmarSenha: ''
    })
    setMostrarModalEdicao(true)
  }

  const onSubmitEdicao = async (data: AdministradorEdicaoFormData) => {
    if (!administradorSelecionado) return
    
    setErro('')
    setErroSenha(false)
    setErroValidacoesSenha(false)
    
    if (data.senha && data.senha !== data.confirmarSenha) {
      setErroSenha(true)
      setErro('As senhas não coincidem')
      return
    }
    
    if (data.senha && data.senha.trim() !== '') {
      const todasValidacoesSenha = 
        validacoesSenhaEdicao.maxCaracteres &&
        validacoesSenhaEdicao.maiusculasMinusculas &&
        validacoesSenhaEdicao.temNumero &&
        validacoesSenhaEdicao.temCaractereEspecial &&
        validacoesSenhaEdicao.semEspacos &&
        validacoesSenhaEdicao.semInfoPessoal
      
      if (!todasValidacoesSenha) {
        setErroValidacoesSenha(true)
        setErro('Você precisa atender a todos os requisitos de senha para atualizar')
        return
      }
    }
    
    setCarregandoEdicao(true)
    
    try {
      const tipoUsuarioAtual = administradorSelecionado.tipoUsuario || 'ADMINISTRADOR EMP'
      
      const usuarioData: UsuarioData = {
        nomeUsuario: data.nomeUsuario.trim(),
        tipoUsuario: tipoUsuarioAtual,
        nivelSenioridade: administradorSelecionado.nivelSenioridade || null,
        competencias: administradorSelecionado.competencias || null,
        idEmpresa: administradorSelecionado.idEmpresa || null
      }
      
      await atualizarUsuario(administradorSelecionado.idUsuario, usuarioData)
      
      const adminComLogin = administradorSelecionado as UsuarioResponse & { idLogin?: number }
      if (adminComLogin.idLogin) {
        const loginUpdateData: LoginUpdateData = {
          idUsuario: administradorSelecionado.idUsuario,
          tipoLogin: 'ADMINISTRADOR EMP'
        }
        if (data.email && data.email.trim() !== '') {
          loginUpdateData.email = data.email.trim()
        }
        if (data.senha && data.senha.trim() !== '') {
          loginUpdateData.senha = data.senha
        }
        
        await atualizarLogin(adminComLogin.idLogin, loginUpdateData)
      }
      
      resetEdicao()
      setErro('')
      await carregarAdministradores()
      setMostrarModalEdicao(false)
      setAdministradorSelecionado(null)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao editar administrador'
      setErro(mensagemErro)
    } finally {
      setCarregandoEdicao(false)
    }
  }

  const abrirModalExclusao = (administrador: UsuarioResponse) => {
    setAdministradorSelecionado(administrador)
    setMostrarModalExclusao(true)
  }

  const handleExcluir = async () => {
    if (!administradorSelecionado) return
    
    setErro('')
    setCarregandoExclusao(true)
    
    try {
      const adminComLogin = administradorSelecionado as UsuarioResponse & { idLogin?: number }
      
      if (adminComLogin.idLogin) {
        await excluirLogin(adminComLogin.idLogin)
      }
      
      await excluirUsuario(administradorSelecionado.idUsuario)
      setMostrarModalExclusao(false)
      setAdministradorSelecionado(null)
      setErro('')
      await carregarAdministradores()
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao excluir administrador'
      setErro(mensagemErro)
    } finally {
      setCarregandoExclusao(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || !user?.isAdmin) {
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
      <Cabecalho isHomeAdmin={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => {
                    handleNavigate('/admin/home')
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
                      Gerenciar Administradores
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-start gap-0 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                        Visualize e gerencie todos os administradores da plataforma
                      </p>
                      <button
                        onClick={() => {
                          resetCadastro()
                          setMostrarModalCadastro(true)
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl flex-shrink-0 md:ml-5 self-start md:self-start mt-2 md:-mt-8"
                        aria-label="Novo Administrador"
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
                    handleNavigate('/admin/home')
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

            {carregando && administradores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Carregando administradores...</p>
              </div>
            ) : administradores.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Nenhum administrador cadastrado</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Nome do Administrador</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Email</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {administradores.map((administrador) => (
                          <tr key={administrador.idUsuario} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              <div className="truncate md:whitespace-normal" title={administrador.nomeUsuario || '-'}>
                                {administrador.nomeUsuario || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              <div className="truncate md:whitespace-normal" title={administrador.email || '-'}>
                                {administrador.email || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center">
                              <div className="flex flex-col sm:flex-row justify-center gap-1.5 sm:gap-2 md:gap-2.5">
                                <button
                                  onClick={() => abrirModalEdicao(administrador)}
                                  className="p-2 sm:p-2.5 md:p-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                  aria-label="Editar"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => abrirModalExclusao(administrador)}
                                  className="p-2 sm:p-2.5 md:p-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  aria-label="Excluir"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
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
                Cadastrar Administrador
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
                    Nome do Administrador *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('nomeUsuario', { required: 'Nome do administrador é obrigatório' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Nome completo"
                  />
                  {errorsCadastro.nomeUsuario && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.nomeUsuario.message}
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
                        Você precisa atender a todos os requisitos de senha para criar um administrador
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

      {mostrarModalEdicao && administradorSelecionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-indigo-200 dark:border-indigo-800 max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] flex flex-col m-2 sm:m-3 md:m-0">
            <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                Editar Administrador
              </h2>
              <button
                onClick={() => {
                  if (!carregandoEdicao) {
                    setMostrarModalEdicao(false)
                    setAdministradorSelecionado(null)
                    resetEdicao()
                    setErro('')
                    setErroSenha(false)
                    setErroValidacoesSenha(false)
                  }
                }}
                disabled={carregandoEdicao}
                className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${carregandoEdicao ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <form onSubmit={handleSubmitEdicao(onSubmitEdicao)} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Administrador *
                  </label>
                  <input
                    type="text"
                    {...registerEdicao('nomeUsuario', { required: 'Nome do administrador é obrigatório' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Nome completo"
                  />
                  {errorsEdicao.nomeUsuario && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.nomeUsuario.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...registerEdicao('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="email@exemplo.com"
                  />
                  {errorsEdicao.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.email.message}
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
                        Você precisa atender a todos os requisitos de senha para atualizar
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenhaEdicao.maxCaracteres)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenhaEdicao.maxCaracteres)}
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
                        <div className={getCheckboxInstrucaoClasses(validacoesSenhaEdicao.maiusculasMinusculas)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenhaEdicao.maiusculasMinusculas)}
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
                        <div className={getCheckboxInstrucaoClasses(validacoesSenhaEdicao.temNumero)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenhaEdicao.temNumero)}
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
                        <div className={getCheckboxInstrucaoClasses(validacoesSenhaEdicao.temCaractereEspecial)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenhaEdicao.temCaractereEspecial)}
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
                        <div className={getCheckboxInstrucaoClasses(validacoesSenhaEdicao.semEspacos)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenhaEdicao.semEspacos)}
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
                        <div className={getCheckboxInstrucaoClasses(validacoesSenhaEdicao.semInfoPessoal)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenhaEdicao.semInfoPessoal)}
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
                    Senha (deixe em branco para não alterar)
                  </label>
                  
                  <input
                    type="password"
                    {...registerEdicao('senha', {
                      maxLength: {
                        value: 16,
                        message: 'A senha deve ter no máximo 16 caracteres'
                      },
                      minLength: {
                        value: 8,
                        message: 'A senha deve ter no mínimo 8 caracteres'
                      },
                      validate: (value) => {
                        if (value && value.trim() !== '') {
                          const senhaAtual = value
                          const validacoes = validarSenhaEdicao(senhaAtual)
                          return (validacoes.maxCaracteres &&
                            validacoes.maiusculasMinusculas &&
                            validacoes.temNumero &&
                            validacoes.temCaractereEspecial &&
                            validacoes.semEspacos &&
                            validacoes.semInfoPessoal) || 'Senha não atende aos requisitos'
                        }
                        return true
                      },
                      onChange: () => {
                        setErroValidacoesSenha(false)
                      }
                    })}
                    maxLength={16}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="••••••••"
                  />
                  {errorsEdicao.senha && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.senha.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    {...registerEdicao('confirmarSenha', {
                      validate: (value) => {
                        const senha = watchEdicao('senha')
                        if (senha && senha.trim() !== '') {
                          return value === senha || 'As senhas não coincidem'
                        }
                        return true
                      }
                    })}
                    maxLength={16}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm ${
                      erroSenha 
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-400'
                    }`}
                    placeholder="••••••••"
                  />
                  {erroSenha && confirmarSenhaEdicao && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      As senhas não coincidem
                    </p>
                  )}
                  {errorsEdicao.confirmarSenha && !erroSenha && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.confirmarSenha.message}
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
                  disabled={carregandoEdicao}
                  onClick={() => {
                    if (!carregandoEdicao) {
                      setMostrarModalEdicao(false)
                      setAdministradorSelecionado(null)
                      resetEdicao()
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
                  disabled={carregandoEdicao}
                  onClick={handleSubmitEdicao(onSubmitEdicao)}
                >
                  {carregandoEdicao ? 'Salvando...' : 'Salvar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalExclusao && administradorSelecionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-red-200 dark:border-red-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Excluir Administrador
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoExclusao) {
                      setMostrarModalExclusao(false)
                      setAdministradorSelecionado(null)
                    }
                  }}
                  disabled={carregandoExclusao}
                  className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${carregandoExclusao ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 break-words text-center">
                Tem certeza que deseja excluir o administrador <strong className="break-words text-gray-900 dark:text-white">{administradorSelecionado.nomeUsuario}</strong>?
                Esta ação não pode ser desfeita.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                <Botao
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  disabled={carregandoExclusao}
                  onClick={() => {
                    if (!carregandoExclusao) {
                      setMostrarModalExclusao(false)
                      setAdministradorSelecionado(null)
                    }
                  }}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                  disabled={carregandoExclusao}
                  onClick={handleExcluir}
                >
                  {carregandoExclusao ? 'Deletando...' : 'Deletar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/admin/home', onClick: () => handleNavigate('/admin/home') },
          { label: 'Gerenciar Administradores', path: '/admin/administradores', onClick: () => handleNavigate('/admin/administradores') },
          { label: 'Gerenciar Empresas', path: '/admin/empresas', onClick: () => handleNavigate('/admin/empresas') },
          { label: 'Gerenciar Cursos', path: '/admin/cursos', onClick: () => handleNavigate('/admin/cursos') },
          { label: 'Gerenciar Trilhas', path: '/admin/trilhas', onClick: () => handleNavigate('/admin/trilhas') }
        ]}
        onLinkClick={(path) => handleNavigate(path)}
      />
    </div>
  )
}

export default GerenciarAdministradores

