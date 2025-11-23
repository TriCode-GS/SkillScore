import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../../Components/Cabecalho/Cabecalho'
import Botao from '../../../Components/Botao/Botao'
import ListaSelecao from '../../../Components/ListaSelecao/ListaSelecao'
import Rodape from '../../../Components/Rodape/Rodape'
import { cadastrarDepartamento, listarDepartamentos, editarDepartamento, excluirDepartamento, type DepartamentoData, type DepartamentoResponse } from '../../../Types/Departamento'
import { buscarUsuarioPorId, getBaseUrl, type UsuarioResponse } from '../../../Types/AutenticacaoLogin'
import type { ApiErrorResponse } from '../../../Types/Diagnostico'

interface DepartamentoFormData {
  nomeDepartamento: string
}

interface AssociarGestorFormData {
  idGestor: string
}

interface GestorOption {
  idUsuario: number
  nomeUsuario: string
}

interface DepartamentoComGestor extends DepartamentoResponse {
  nomeGestor?: string
  idGestor?: number
}

const GerenciarDepartamentos = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [departamentos, setDepartamentos] = useState<DepartamentoComGestor[]>([])
  const [carregando, setCarregando] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [carregandoEdicao, setCarregandoEdicao] = useState(false)
  const [carregandoExclusao, setCarregandoExclusao] = useState(false)
  const [carregandoAssociacao, setCarregandoAssociacao] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false)
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false)
  const [mostrarModalAssociarGestor, setMostrarModalAssociarGestor] = useState(false)
  const [mostrarModalDesvincularGestor, setMostrarModalDesvincularGestor] = useState(false)
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<DepartamentoResponse | null>(null)
  const [departamentoParaEditar, setDepartamentoParaEditar] = useState<DepartamentoComGestor | null>(null)
  const [departamentoParaExcluir, setDepartamentoParaExcluir] = useState<DepartamentoComGestor | null>(null)
  const [gestorParaDesvincular, setGestorParaDesvincular] = useState<{ idUsuario: number; nomeUsuario: string; idDepartamento: number } | null>(null)
  const [gestoresDisponiveis, setGestoresDisponiveis] = useState<GestorOption[]>([])
  const [carregandoGestores, setCarregandoGestores] = useState(false)
  const [carregandoDesvinculacao, setCarregandoDesvinculacao] = useState(false)
  const [idEmpresa, setIdEmpresa] = useState<number | null>(null)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, formState: { errors: errorsCadastro } } = useForm<DepartamentoFormData>()
  const { register: registerEdicao, handleSubmit: handleSubmitEdicao, reset: resetEdicao, formState: { errors: errorsEdicao } } = useForm<DepartamentoFormData>()
  const { handleSubmit: handleSubmitAssociarGestor, reset: resetAssociarGestor, control: controlAssociarGestor, formState: { errors: errorsAssociarGestor } } = useForm<AssociarGestorFormData>()

  useEffect(() => {
    if (!isAuthenticated || user?.tipoUsuario !== 'ADMINISTRADOR EMP') {
      const timer = setTimeout(() => {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    
    const buscarIdEmpresa = async () => {
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          if (usuarioCompleto.idEmpresa) {
            setIdEmpresa(usuarioCompleto.idEmpresa)
            await carregarDepartamentos(usuarioCompleto.idEmpresa)
          }
        } catch (error) {
          setErro('Erro ao buscar informações da empresa')
        }
      }
    }
    
    buscarIdEmpresa()
  }, [isAuthenticated, user, navigate])

  const carregarDepartamentos = async (empresaId: number) => {
    setCarregando(true)
    setErro('')
    try {
      const departamentosListados = await listarDepartamentos(empresaId)
      
      try {
        const baseUrl = getBaseUrl()
        const urlStringGestores = `${baseUrl}/usuarios/gestores`
        const resGestores = await fetch(urlStringGestores, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
        })
        
        if (resGestores.ok) {
          const gestores = await resGestores.json() as UsuarioResponse[]
          const departamentosComGestor = departamentosListados.map((departamento) => {
            const gestor = gestores.find((g) => {
              const gIdDepartamento = g.idDepartamento
              const departamentoId = departamento.idDepartamento
              return gIdDepartamento != null && departamentoId != null && 
                     Number(gIdDepartamento) === Number(departamentoId)
            })
            
            if (gestor) {
              return {
                ...departamento,
                nomeGestor: gestor.nomeUsuario || '-',
                idGestor: gestor.idUsuario || undefined
              }
            }
            
            return { ...departamento, nomeGestor: undefined, idGestor: undefined }
          })
          
          setDepartamentos(departamentosComGestor)
        } else {
          setDepartamentos(departamentosListados)
        }
      } catch (error) {
        setDepartamentos(departamentosListados)
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar departamentos')
    } finally {
      setCarregando(false)
    }
  }

  const carregarGestoresDisponiveis = async () => {
    setCarregandoGestores(true)
    try {
      const baseUrl = getBaseUrl()
      const urlString = `${baseUrl}/usuarios/gestores`
      const res = await fetch(urlString, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      })
      
      if (res.ok) {
        const gestores = await res.json() as UsuarioResponse[]
        const gestoresFiltrados = gestores
          .filter((g) => {
            if (!idEmpresa) return false
            return g.idEmpresa === idEmpresa
          })
          .map((g) => ({
            idUsuario: g.idUsuario || 0,
            nomeUsuario: g.nomeUsuario || '-'
          }))
        
        setGestoresDisponiveis(gestoresFiltrados)
      } else {
        setGestoresDisponiveis([])
      }
    } catch (error) {
      setGestoresDisponiveis([])
    } finally {
      setCarregandoGestores(false)
    }
  }

  const abrirModalAssociarGestor = (departamento: DepartamentoResponse) => {
    setDepartamentoSelecionado(departamento)
    resetAssociarGestor()
    setErro('')
    setMostrarModalAssociarGestor(true)
    carregarGestoresDisponiveis()
  }

  const abrirModalDesvincularGestor = (departamento: DepartamentoComGestor) => {
    const idGestor = departamento.idGestor
    const idDepartamento = departamento.idDepartamento
    if (idGestor !== undefined && idDepartamento !== undefined && departamento.nomeGestor) {
      setGestorParaDesvincular({
        idUsuario: idGestor,
        nomeUsuario: departamento.nomeGestor,
        idDepartamento: idDepartamento
      })
      setErro('')
      setMostrarModalDesvincularGestor(true)
    }
  }

  const handleDesvincularGestor = async () => {
    if (!gestorParaDesvincular) {
      setErro('Erro ao identificar o gestor')
      return
    }

    setErro('')
    setCarregandoDesvinculacao(true)

    try {
      const baseUrl = getBaseUrl()
      const urlString = `${baseUrl}/usuarios/${gestorParaDesvincular.idUsuario}/departamento`
      
      const res = await fetch(urlString, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idDepartamento: null }),
        mode: 'cors',
      })

      if (res.ok) {
        setMostrarModalDesvincularGestor(false)
        setGestorParaDesvincular(null)
        setErro('')
        if (idEmpresa) {
          await carregarDepartamentos(idEmpresa)
        }
      } else {
        let backendMessage: string | undefined

        try {
          const text = await res.text()
          if (text && text.trim().length > 0) {
            backendMessage = text.trim()
          }
        } catch (_) {}

        if (!backendMessage) {
          try {
            const data = await res.clone().json() as unknown
            if (typeof data === 'string') backendMessage = data
            else if (data && typeof data === 'object') {
              const errorData = data as ApiErrorResponse
              backendMessage = errorData.message || errorData.error || errorData.detalhe || errorData.erro
            }
          } catch (_) {}
        }

        const statusText = res.statusText || 'Erro'
        const message = backendMessage || `Falha ao desvincular gestor (status ${res.status} ${statusText})`
        setErro(message)
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao desvincular gestor')
    } finally {
      setCarregandoDesvinculacao(false)
    }
  }

  const onSubmitAssociarGestor = async (data: AssociarGestorFormData) => {
    if (!departamentoSelecionado?.idDepartamento || !data.idGestor) {
      setErro('Selecione um gestor')
      return
    }

    setErro('')
    setCarregandoAssociacao(true)

    try {
      const baseUrl = getBaseUrl()
      const idGestorNum = parseInt(data.idGestor, 10)
      const urlString = `${baseUrl}/usuarios/${idGestorNum}/departamento`
      
      const res = await fetch(urlString, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idDepartamento: departamentoSelecionado.idDepartamento }),
        mode: 'cors',
      })

      if (res.ok) {
        resetAssociarGestor()
        setMostrarModalAssociarGestor(false)
        setDepartamentoSelecionado(null)
        setErro('')
        if (idEmpresa) {
          await carregarDepartamentos(idEmpresa)
        }
      } else {
        let backendMessage: string | undefined

        try {
          const text = await res.text()
          if (text && text.trim().length > 0) {
            backendMessage = text.trim()
          }
        } catch (_) {}

        if (!backendMessage) {
          try {
            const data = await res.clone().json() as unknown
            if (typeof data === 'string') backendMessage = data
            else if (data && typeof data === 'object') {
              const errorData = data as ApiErrorResponse
              backendMessage = errorData.message || errorData.error || errorData.detalhe || errorData.erro
            }
          } catch (_) {}
        }

        let message = backendMessage || `Falha ao associar gestor (status ${res.status} ${res.statusText || 'Erro'})`
        
        if (backendMessage && (backendMessage.includes('já está vinculado') || backendMessage.includes('já está vinculado ao departamento'))) {
          message = 'Este gestor já está vinculado a um departamento'
        }
        
        setErro(message)
      }
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Erro ao associar gestor'
      
      if (errorMessage.includes('já está vinculado') || errorMessage.includes('já está vinculado ao departamento')) {
        errorMessage = 'Este gestor já está vinculado a um departamento'
      }
      
      setErro(errorMessage)
    } finally {
      setCarregandoAssociacao(false)
    }
  }

  const onSubmitCadastro = async (data: DepartamentoFormData) => {
    if (!idEmpresa) {
      setErro('Não foi possível identificar a empresa')
      return
    }
    
    setErro('')
    setCarregandoCadastro(true)
    
    try {
      const departamentoData: DepartamentoData = {
        idEmpresa: idEmpresa,
        nomeDepartamento: data.nomeDepartamento.trim(),
        descricao: null
      }
      
      await cadastrarDepartamento(departamentoData)
      
      resetCadastro()
      setErro('')
      await carregarDepartamentos(idEmpresa)
      setMostrarModalCadastro(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao cadastrar departamento'
      setErro(mensagemErro)
    } finally {
      setCarregandoCadastro(false)
    }
  }

  const abrirModalEdicao = (departamento: DepartamentoComGestor) => {
    setDepartamentoParaEditar(departamento)
    resetEdicao({
      nomeDepartamento: departamento.nomeDepartamento || ''
    })
    setErro('')
    setMostrarModalEdicao(true)
  }

  const onSubmitEdicao = async (data: DepartamentoFormData) => {
    if (!departamentoParaEditar?.idDepartamento || !idEmpresa) {
      setErro('Não foi possível identificar o departamento')
      return
    }
    
    setErro('')
    setCarregandoEdicao(true)
    
    try {
      const departamentoData: DepartamentoData = {
        idEmpresa: idEmpresa,
        nomeDepartamento: data.nomeDepartamento.trim(),
        descricao: null
      }
      
      await editarDepartamento(departamentoParaEditar.idDepartamento, departamentoData)
      
      resetEdicao()
      setErro('')
      await carregarDepartamentos(idEmpresa)
      setMostrarModalEdicao(false)
      setDepartamentoParaEditar(null)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao editar departamento'
      setErro(mensagemErro)
    } finally {
      setCarregandoEdicao(false)
    }
  }

  const abrirModalExclusao = (departamento: DepartamentoComGestor) => {
    setDepartamentoParaExcluir(departamento)
    setErro('')
    setMostrarModalExclusao(true)
  }

  const handleExcluir = async () => {
    if (!departamentoParaExcluir?.idDepartamento) return
    
    setErro('')
    setCarregandoExclusao(true)
    
    try {
      await excluirDepartamento(departamentoParaExcluir.idDepartamento)
      setDepartamentoParaExcluir(null)
      await carregarDepartamentos(idEmpresa!)
      setMostrarModalExclusao(false)
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Erro ao excluir departamento'
      
      if (errorMessage.includes('Existem usuários vinculados') || errorMessage.includes('usuários vinculados a este departamento')) {
        errorMessage = 'Não é possível deletar o departamento pois existe um gestor vinculado.'
      }
      
      setErro(errorMessage)
    } finally {
      setCarregandoExclusao(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login-corporativo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || user?.tipoUsuario !== 'ADMINISTRADOR EMP') {
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
      <Cabecalho isHomeAdminEmp={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-2 sm:px-3 md:px-4 relative">
          <div className="max-w-full mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => {
                    handleNavigate('/admin-emp/home')
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
                      Gerenciar Departamentos
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-start gap-0 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                        Cadastre e gerencie os departamentos da empresa
                      </p>
                      <button
                        onClick={() => {
                          resetCadastro()
                          setMostrarModalCadastro(true)
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl flex-shrink-0 md:ml-10 self-start md:self-start mt-2 md:-mt-8"
                        aria-label="Novo Departamento"
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
                    handleNavigate('/admin-emp/home')
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

            {carregando && departamentos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Carregando departamentos...</p>
              </div>
            ) : departamentos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Nenhum departamento cadastrado</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto -mx-2 sm:-mx-3 md:-mx-4">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Nome do Departamento</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Gestor</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {departamentos.map((departamento) => (
                          <tr key={departamento.idDepartamento} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              <div className="truncate md:whitespace-normal" title={departamento.nomeDepartamento || '-'}>
                                {departamento.nomeDepartamento || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center">
                              {departamento.nomeGestor ? (
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                                    {departamento.nomeGestor}
                                  </span>
                                  <button
                                    onClick={() => abrirModalDesvincularGestor(departamento)}
                                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    aria-label="Desvincular Gestor"
                                  >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => abrirModalAssociarGestor(departamento)}
                                  className="p-1.5 sm:p-2 md:p-2.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  aria-label="Associar Gestor"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              )}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center">
                              <div className="flex flex-row justify-center items-center gap-1.5 sm:gap-2 md:gap-2.5">
                                <button
                                  onClick={() => abrirModalEdicao(departamento)}
                                  className="p-2 sm:p-2.5 md:p-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                  aria-label="Editar"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => abrirModalExclusao(departamento)}
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
                Cadastrar Departamento
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
                    Nome do Departamento *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('nomeDepartamento', { required: 'Nome do departamento é obrigatório' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Nome do departamento"
                    disabled={carregandoCadastro}
                  />
                  {errorsCadastro.nomeDepartamento && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.nomeDepartamento.message}
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

      {mostrarModalEdicao && departamentoParaEditar && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-indigo-200 dark:border-indigo-800 max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] flex flex-col m-2 sm:m-3 md:m-0">
            <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                Editar Departamento
              </h2>
              <button
                onClick={() => {
                  if (!carregandoEdicao) {
                    setMostrarModalEdicao(false)
                    setDepartamentoParaEditar(null)
                    resetEdicao()
                    setErro('')
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
                    Nome do Departamento *
                  </label>
                  <input
                    type="text"
                    {...registerEdicao('nomeDepartamento', { required: 'Nome do departamento é obrigatório' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Nome do departamento"
                    disabled={carregandoEdicao}
                  />
                  {errorsEdicao.nomeDepartamento && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.nomeDepartamento.message}
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
                      setDepartamentoParaEditar(null)
                      resetEdicao()
                      setErro('')
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

      {mostrarModalExclusao && departamentoParaExcluir && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-red-200 dark:border-red-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Excluir Departamento
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoExclusao) {
                      setMostrarModalExclusao(false)
                      setDepartamentoParaExcluir(null)
                      setErro('')
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

              {erro && (
                <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 md:p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-xs sm:text-sm md:text-base text-red-600 dark:text-red-400 font-semibold break-words">
                    {erro}
                  </p>
                </div>
              )}

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 break-words text-center">
                Tem certeza que deseja excluir o departamento <strong className="break-words text-gray-900 dark:text-white">{departamentoParaExcluir.nomeDepartamento}</strong>?
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
                      setDepartamentoParaExcluir(null)
                      setErro('')
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

      {mostrarModalAssociarGestor && departamentoSelecionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-indigo-200 dark:border-indigo-800 max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] flex flex-col m-2 sm:m-3 md:m-0">
            <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                Associar Gestor
              </h2>
              <button
                onClick={() => {
                  if (!carregandoAssociacao) {
                    setMostrarModalAssociarGestor(false)
                    setDepartamentoSelecionado(null)
                    resetAssociarGestor()
                    setErro('')
                  }
                }}
                disabled={carregandoAssociacao}
                className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${carregandoAssociacao ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    Nome do Departamento
                  </label>
                  <input
                    type="text"
                    value={departamentoSelecionado.nomeDepartamento || ''}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmitAssociarGestor(onSubmitAssociarGestor)} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  {carregandoGestores ? (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gestor *
                      </label>
                      <div className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                        Carregando gestores...
                      </div>
                    </div>
                  ) : (
                    <Controller
                      name="idGestor"
                      control={controlAssociarGestor}
                      rules={{ required: 'Selecione um gestor' }}
                      render={({ field }) => {
                        const nomesGestores = gestoresDisponiveis.map(gestor => gestor.nomeUsuario)
                        const nomeSelecionado = gestoresDisponiveis.find(
                          gestor => gestor.idUsuario.toString() === field.value
                        )?.nomeUsuario || ''
                        
                        return (
                          <ListaSelecao
                            options={nomesGestores}
                            value={nomeSelecionado}
                            onChange={(nomeSelecionado) => {
                              const gestorSelecionado = gestoresDisponiveis.find(
                                gestor => gestor.nomeUsuario === nomeSelecionado
                              )
                              field.onChange(gestorSelecionado?.idUsuario.toString() || '')
                            }}
                            placeholder="Selecione um gestor"
                            label="Gestor *"
                            required
                            id="gestor-departamento"
                          />
                        )
                      }}
                    />
                  )}
                  {errorsAssociarGestor.idGestor && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsAssociarGestor.idGestor.message}
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
                  disabled={carregandoAssociacao}
                  onClick={() => {
                    if (!carregandoAssociacao) {
                      setMostrarModalAssociarGestor(false)
                      setDepartamentoSelecionado(null)
                      resetAssociarGestor()
                      setErro('')
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
                  onClick={handleSubmitAssociarGestor(onSubmitAssociarGestor)}
                  disabled={carregandoAssociacao || carregandoGestores}
                >
                  {carregandoAssociacao ? 'Associando...' : 'Associar'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalDesvincularGestor && gestorParaDesvincular && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-red-200 dark:border-red-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Desvincular Gestor
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoDesvinculacao) {
                      setMostrarModalDesvincularGestor(false)
                      setGestorParaDesvincular(null)
                      setErro('')
                    }
                  }}
                  disabled={carregandoDesvinculacao}
                  className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${carregandoDesvinculacao ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {erro && (
                <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 md:p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-xs sm:text-sm md:text-base text-red-600 dark:text-red-400 font-semibold break-words">
                    {erro}
                  </p>
                </div>
              )}

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 break-words text-center">
                Tem certeza que deseja desvincular o gestor <strong className="break-words text-gray-900 dark:text-white">{gestorParaDesvincular.nomeUsuario}</strong> deste departamento?
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                <Botao
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  disabled={carregandoDesvinculacao}
                  onClick={() => {
                    if (!carregandoDesvinculacao) {
                      setMostrarModalDesvincularGestor(false)
                      setGestorParaDesvincular(null)
                      setErro('')
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
                  disabled={carregandoDesvinculacao}
                  onClick={handleDesvincularGestor}
                >
                  {carregandoDesvinculacao ? 'Desvinculando...' : 'Desvincular'}
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/admin-emp/home', onClick: () => handleNavigate('/admin-emp/home') },
          { label: 'Gerenciar Gestores', path: '/admin-emp/gestores', onClick: () => handleNavigate('/admin-emp/gestores') },
          { label: 'Gerenciar Departamentos', path: '/admin-emp/departamentos', onClick: () => handleNavigate('/admin-emp/departamentos') }
        ]}
        onLinkClick={(path) => handleNavigate(path)}
      />
    </div>
  )
}

export default GerenciarDepartamentos

