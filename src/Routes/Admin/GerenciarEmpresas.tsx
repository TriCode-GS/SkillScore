import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Botao from '../../Components/Botao/Botao'
import ListaSelecao from '../../Components/ListaSelecao/ListaSelecao'
import { listarEmpresas, cadastrarEmpresa, editarEmpresa, excluirEmpresa, type EmpresaData, type UsuarioApiResponse } from '../../Types/Empresa'
import { atualizarUsuario, getBaseUrl, type UsuarioData } from '../../Types/AutenticacaoLogin'

interface EmpresaFormData {
  razaoSocial: string
  cnpj: string
  setor: string
}

interface AssociarAdministradorFormData {
  idAdministrador: string
}

interface AdministradorOption {
  idUsuario: number
  nomeUsuario: string
}

const GerenciarEmpresas = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [empresas, setEmpresas] = useState<EmpresaData[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false)
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false)
  const [mostrarModalAssociarAdmin, setMostrarModalAssociarAdmin] = useState(false)
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaData | null>(null)
  const [administradoresDisponiveis, setAdministradoresDisponiveis] = useState<AdministradorOption[]>([])
  const [carregandoAdministradores, setCarregandoAdministradores] = useState(false)
  const [carregandoAssociacao, setCarregandoAssociacao] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [carregandoEdicao, setCarregandoEdicao] = useState(false)
  const [carregandoExclusao, setCarregandoExclusao] = useState(false)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, control: controlCadastro, formState: { errors: errorsCadastro } } = useForm<EmpresaFormData>()
  const { register: registerEdicao, handleSubmit: handleSubmitEdicao, reset: resetEdicao, formState: { errors: errorsEdicao } } = useForm<EmpresaFormData>()
  const { handleSubmit: handleSubmitAssociarAdmin, reset: resetAssociarAdmin, control: controlAssociarAdmin, formState: { errors: errorsAssociarAdmin } } = useForm<AssociarAdministradorFormData>()

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      const timer = setTimeout(() => {
        navigate('/admin/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    carregarEmpresas()
  }, [isAuthenticated, user, navigate])

  const carregarEmpresas = async () => {
    setCarregando(true)
    setErro('')
    try {
      const empresasListadas = await listarEmpresas()
      
      try {
        const baseUrl = getBaseUrl()
        const urlString = `${baseUrl}/usuarios`
        const res = await fetch(urlString, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
        })
        
        if (res.ok) {
          const usuarios = await res.json() as UsuarioApiResponse[]
          const empresasComAdministrador = empresasListadas.map((empresa) => {
            const administrador = usuarios.find((u) => {
              const uIdEmpresa = u.idEmpresa
              const empresaId = empresa.idEmpresa
              const tipoUsuario = u.tipoUsuario || ''
              
              return uIdEmpresa != null && empresaId != null && 
                     Number(uIdEmpresa) === Number(empresaId) &&
                     (tipoUsuario === 'ADMINISTRADOR EMP' || tipoUsuario === 'ADMINITRADOR EMP')
            })
            
            if (administrador) {
              return {
                ...empresa,
                nomeAdministrador: administrador.nomeUsuario || '-'
              }
            }
            
            return { ...empresa, nomeAdministrador: undefined }
          })
          
          setEmpresas(empresasComAdministrador)
        } else {
          setEmpresas(empresasListadas)
        }
      } catch (error) {
        setEmpresas(empresasListadas)
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar empresas')
    } finally {
      setCarregando(false)
    }
  }

  const carregarAdministradoresDisponiveis = async () => {
    setCarregandoAdministradores(true)
    try {
      const baseUrl = getBaseUrl()
      const urlString = `${baseUrl}/usuarios`
      const res = await fetch(urlString, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      })
      
      if (res.ok) {
        const usuarios = await res.json() as UsuarioApiResponse[]
        const administradores = usuarios
          .filter((u) => {
            const tipoUsuario = (u.tipoUsuario || '').trim().toUpperCase()
            return tipoUsuario === 'ADMINISTRADOR EMP' || tipoUsuario === 'ADMINITRADOR EMP'
          })
          .map((u) => ({
            idUsuario: u.idUsuario || 0,
            nomeUsuario: u.nomeUsuario || '-'
          }))
        
        setAdministradoresDisponiveis(administradores)
      } else {
        setAdministradoresDisponiveis([])
      }
    } catch (error) {
      setAdministradoresDisponiveis([])
    } finally {
      setCarregandoAdministradores(false)
    }
  }

  const abrirModalAssociarAdmin = (empresa: EmpresaData) => {
    setEmpresaSelecionada(empresa)
    resetAssociarAdmin()
    setErro('')
    setMostrarModalAssociarAdmin(true)
    carregarAdministradoresDisponiveis()
  }

  const onSubmitAssociarAdmin = async (data: AssociarAdministradorFormData) => {
    if (!empresaSelecionada?.idEmpresa || !data.idAdministrador) {
      setErro('Selecione um administrador')
      return
    }

    setErro('')
    setCarregandoAssociacao(true)

    try {
      const baseUrl = getBaseUrl()
      const urlString = `${baseUrl}/usuarios`
      const res = await fetch(urlString, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      })

      if (res.ok) {
        const usuarios = await res.json() as UsuarioApiResponse[]
        const idAdministradorNum = parseInt(data.idAdministrador, 10)
        const administrador = usuarios.find((u) => {
          const uId = u.idUsuario
          return uId != null && Number(uId) === idAdministradorNum
        })

        if (administrador) {
          const usuarioDataAtualizado: UsuarioData = {
            idEmpresa: empresaSelecionada.idEmpresa,
            nomeUsuario: administrador.nomeUsuario || '',
            tipoUsuario: administrador.tipoUsuario || 'ADMINISTRADOR EMP',
            areaAtuacao: administrador.areaAtuacao || null,
            nivelSenioridade: administrador.nivelSenioridade || null,
            competencias: administrador.competencias || null
          }

          await atualizarUsuario(idAdministradorNum, usuarioDataAtualizado)
          
          resetAssociarAdmin()
          setMostrarModalAssociarAdmin(false)
          setEmpresaSelecionada(null)
          setErro('')
          await carregarEmpresas()
        } else {
          setErro('Administrador não encontrado')
        }
      } else {
        setErro('Erro ao buscar administrador')
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao associar administrador')
    } finally {
      setCarregandoAssociacao(false)
    }
  }

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

  const onSubmitCadastro = async (data: EmpresaFormData) => {
    setErro('')
    
    if (!data.setor || !data.setor.trim()) {
      setErro('Setor de Atuação é obrigatório')
      return
    }
    
    setCarregandoCadastro(true)
    
    try {
      const empresaData: EmpresaData = {
        nomeEmpresa: data.razaoSocial.trim(),
        cnpj: data.cnpj.replace(/\D/g, ''),
        setor: data.setor.trim(),
        email: null,
        telefone: null
      }
      
      await cadastrarEmpresa(empresaData)
      
      resetCadastro()
      setErro('')
      await carregarEmpresas()
      setMostrarModalCadastro(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao cadastrar empresa'
      setErro(mensagemErro)
    } finally {
      setCarregandoCadastro(false)
    }
  }

  const onSubmitEdicao = async (data: EmpresaFormData) => {
    if (!empresaSelecionada?.idEmpresa) return
    
    setErro('')
    setCarregandoEdicao(true)
    
    try {
      const empresaData: EmpresaData = {
        nomeEmpresa: data.razaoSocial.trim(),
        cnpj: empresaSelecionada.cnpj.replace(/\D/g, ''),
        setor: data.setor && data.setor.trim() ? data.setor.trim() : null,
        email: null,
        telefone: null
      }
      await editarEmpresa(empresaSelecionada.idEmpresa, empresaData)
      resetEdicao()
      setEmpresaSelecionada(null)
      await carregarEmpresas()
      setMostrarModalEdicao(false)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao editar empresa')
    } finally {
      setCarregandoEdicao(false)
    }
  }

  const handleExcluir = async () => {
    if (!empresaSelecionada?.idEmpresa) return
    
    setErro('')
    setCarregandoExclusao(true)
    
    try {
      await excluirEmpresa(empresaSelecionada.idEmpresa)
      setEmpresaSelecionada(null)
      await carregarEmpresas()
      setMostrarModalExclusao(false)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir empresa')
    } finally {
      setCarregandoExclusao(false)
    }
  }

  const abrirModalEdicao = (empresa: EmpresaData) => {
    setEmpresaSelecionada(empresa)
    resetEdicao({
      razaoSocial: empresa.nomeEmpresa || empresa.razaoSocial || '',
      cnpj: formatCNPJ(empresa.cnpj),
      setor: empresa.setor || ''
    })
    setMostrarModalEdicao(true)
  }

  const abrirModalExclusao = (empresa: EmpresaData) => {
    setEmpresaSelecionada(empresa)
    setMostrarModalExclusao(true)
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
                      Gerenciar Empresas
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-start gap-0 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                        Cadastre, edite e exclua empresas da plataforma
                      </p>
                      <button
                        onClick={() => {
                          resetCadastro()
                          setMostrarModalCadastro(true)
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl flex-shrink-0 md:ml-5 self-start md:self-start mt-2 md:-mt-8"
                        aria-label="Nova Empresa"
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

            {carregando && empresas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Carregando empresas...</p>
              </div>
            ) : empresas.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Nenhuma empresa cadastrada</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Razão Social</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">CNPJ</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">Setor</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">Administrador</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {empresas.map((empresa) => (
                          <tr key={empresa.idEmpresa} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              <div className="truncate md:whitespace-normal" title={empresa.nomeEmpresa || empresa.razaoSocial || '-'}>
                                {empresa.nomeEmpresa || empresa.razaoSocial || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {formatCNPJ(empresa.cnpj)}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words hidden md:table-cell">
                              {empresa.setor || '-'}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center hidden md:table-cell">
                              {empresa.nomeAdministrador ? (
                                <span className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                                  {empresa.nomeAdministrador}
                                </span>
                              ) : (
                                <button
                                  onClick={() => abrirModalAssociarAdmin(empresa)}
                                  className="p-1.5 sm:p-2 md:p-2.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  aria-label="Associar Administrador"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              )}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center">
                              <div className="flex flex-col sm:flex-row justify-center gap-1.5 sm:gap-2 md:gap-2.5">
                                <button
                                  onClick={() => abrirModalEdicao(empresa)}
                                  className="p-2 sm:p-2.5 md:p-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                  aria-label="Editar"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => abrirModalExclusao(empresa)}
                                  className="p-2 sm:p-2.5 md:p-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  aria-label="Excluir"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="md:hidden mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <div>Setor: {empresa.setor || '-'}</div>
                                <div>
                                  Administrador: {empresa.nomeAdministrador ? (
                                    <span>{empresa.nomeAdministrador}</span>
                                  ) : (
                                    <button
                                      onClick={() => abrirModalAssociarAdmin(empresa)}
                                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold"
                                    >
                                      Associar
                                    </button>
                                  )}
                                </div>
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
                Cadastrar Empresa
              </h2>
              <button
                onClick={() => {
                  if (!carregandoCadastro) {
                    setMostrarModalCadastro(false)
                    resetCadastro()
                    setErro('')
                  }
                }}
                disabled={carregandoCadastro}
                className={`text-gray-500 dark:text-gray-400 transition-colors ${carregandoCadastro ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
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
                    Razão Social *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('razaoSocial', { required: 'Razão Social é obrigatória' })}
                    disabled={carregandoCadastro}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Nome da empresa"
                  />
                  {errorsCadastro.razaoSocial && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.razaoSocial.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    CNPJ *
                  </label>
                  <Controller
                    name="cnpj"
                    control={controlCadastro}
                    rules={{
                      required: 'CNPJ é obrigatório',
                      validate: (value) => {
                        const numbers = value.replace(/\D/g, '')
                        return numbers.length === 14 || 'CNPJ deve ter 14 dígitos'
                      }
                    }}
                    render={({ field }) => (
                      <input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => {
                          const formatted = formatCNPJ(e.target.value)
                          field.onChange(formatted)
                        }}
                        maxLength={18}
                        disabled={carregandoCadastro}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="00.000.000/0000-00"
                      />
                    )}
                  />
                  {errorsCadastro.cnpj && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.cnpj.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Setor de Atuação *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('setor', { required: 'Setor de Atuação é obrigatório' })}
                    disabled={carregandoCadastro}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ex: Tecnologia, Saúde, Educação..."
                  />
                  {errorsCadastro.setor && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.setor.message}
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
                  onClick={() => {
                    if (!carregandoCadastro) {
                      setMostrarModalCadastro(false)
                      resetCadastro()
                      setErro('')
                    }
                  }}
                  disabled={carregandoCadastro}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  onClick={handleSubmitCadastro(onSubmitCadastro)}
                  disabled={carregandoCadastro}
                >
                  {carregandoCadastro ? 'Cadastrando...' : 'Cadastrar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalEdicao && empresaSelecionada && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-indigo-200 dark:border-indigo-800 max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] flex flex-col m-2 sm:m-3 md:m-0">
            <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                Editar Empresa
              </h2>
              <button
                onClick={() => {
                  if (!carregandoEdicao) {
                    setMostrarModalEdicao(false)
                    setEmpresaSelecionada(null)
                    resetEdicao()
                  }
                }}
                disabled={carregandoEdicao}
                className={`text-gray-500 dark:text-gray-400 transition-colors ${carregandoEdicao ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5">
              <form onSubmit={handleSubmitEdicao(onSubmitEdicao)} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Razão Social *
                  </label>
                  <input
                    type="text"
                    {...registerEdicao('razaoSocial', { required: 'Razão Social é obrigatória' })}
                    disabled={carregandoEdicao}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Nome da empresa"
                  />
                  {errorsEdicao.razaoSocial && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.razaoSocial.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    value={formatCNPJ(empresaSelecionada.cnpj)}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Setor de Atuação
                  </label>
                  <input
                    type="text"
                    {...registerEdicao('setor')}
                    disabled={carregandoEdicao}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ex: Tecnologia, Saúde, Educação..."
                  />
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
                  onClick={() => {
                    if (!carregandoEdicao) {
                      setMostrarModalEdicao(false)
                      setEmpresaSelecionada(null)
                      resetEdicao()
                    }
                  }}
                  disabled={carregandoEdicao}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  onClick={handleSubmitEdicao(onSubmitEdicao)}
                  disabled={carregandoEdicao}
                >
                  {carregandoEdicao ? 'Salvando...' : 'Salvar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalExclusao && empresaSelecionada && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-red-200 dark:border-red-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Excluir Empresa
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoExclusao) {
                      setMostrarModalExclusao(false)
                      setEmpresaSelecionada(null)
                    }
                  }}
                  disabled={carregandoExclusao}
                  className={`text-gray-500 dark:text-gray-400 transition-colors ${carregandoExclusao ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 break-words">
                Tem certeza que deseja excluir a empresa <strong className="break-words text-gray-900 dark:text-white">{empresaSelecionada.razaoSocial}</strong>?
                Esta ação não pode ser desfeita.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                <Botao
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  onClick={() => {
                    if (!carregandoExclusao) {
                      setMostrarModalExclusao(false)
                      setEmpresaSelecionada(null)
                    }
                  }}
                  disabled={carregandoExclusao}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                  onClick={handleExcluir}
                  disabled={carregandoExclusao}
                >
                  {carregandoExclusao ? 'Deletando...' : 'Deletar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalAssociarAdmin && empresaSelecionada && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-indigo-200 dark:border-indigo-800 max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] flex flex-col m-2 sm:m-3 md:m-0">
            <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                Associar Administrador
              </h2>
              <button
                onClick={() => {
                  setMostrarModalAssociarAdmin(false)
                  setEmpresaSelecionada(null)
                  resetAssociarAdmin()
                  setErro('')
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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

              <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-5 md:mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    value={empresaSelecionada.nomeEmpresa || empresaSelecionada.razaoSocial || ''}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={formatCNPJ(empresaSelecionada.cnpj)}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Setor
                  </label>
                  <input
                    type="text"
                    value={empresaSelecionada.setor || ''}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmitAssociarAdmin(onSubmitAssociarAdmin)} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  {carregandoAdministradores ? (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Administrador da Empresa *
                      </label>
                      <div className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                        Carregando administradores...
                      </div>
                    </div>
                  ) : (
                    <Controller
                      name="idAdministrador"
                      control={controlAssociarAdmin}
                      rules={{ required: 'Selecione um administrador' }}
                      render={({ field }) => {
                        const nomesAdministradores = administradoresDisponiveis.map(admin => admin.nomeUsuario)
                        const nomeSelecionado = administradoresDisponiveis.find(
                          admin => admin.idUsuario.toString() === field.value
                        )?.nomeUsuario || ''
                        
                        return (
                          <ListaSelecao
                            options={nomesAdministradores}
                            value={nomeSelecionado}
                            onChange={(nomeSelecionado) => {
                              const adminSelecionado = administradoresDisponiveis.find(
                                admin => admin.nomeUsuario === nomeSelecionado
                              )
                              field.onChange(adminSelecionado?.idUsuario.toString() || '')
                            }}
                            placeholder="Selecione um administrador"
                            label="Administrador da Empresa *"
                            required
                            id="administrador-empresa"
                          />
                        )
                      }}
                    />
                  )}
                  {errorsAssociarAdmin.idAdministrador && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsAssociarAdmin.idAdministrador.message}
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
                  onClick={() => {
                    setMostrarModalAssociarAdmin(false)
                    setEmpresaSelecionada(null)
                    resetAssociarAdmin()
                    setErro('')
                  }}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  onClick={handleSubmitAssociarAdmin(onSubmitAssociarAdmin)}
                  disabled={carregandoAssociacao || carregandoAdministradores}
                >
                  {carregandoAssociacao ? 'Associando...' : 'Associar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GerenciarEmpresas

