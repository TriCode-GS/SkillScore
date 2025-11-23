import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Botao from '../../Components/Botao/Botao'
import ListaSelecao from '../../Components/ListaSelecao/ListaSelecao'
import { listarCursos, cadastrarCurso, editarCurso, excluirCurso, type CursoData, type CursoResponse } from '../../Types/Curso'
import { listarTrilhas, type TrilhaResponse } from '../../Types/Trilha'
import Rodape from '../../Components/Rodape/Rodape'

interface CursoFormData {
  titulo: string
  descricao: string
  linkCurso: string
  areaRelacionada: string
  nivelRecomendado: string
  duracaoHoras: string
}

const GerenciarCursos = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const [cursos, setCursos] = useState<CursoResponse[]>([])
  const [trilhas, setTrilhas] = useState<TrilhaResponse[]>([])
  const niveisRecomendados = ['Iniciante', 'Intermediário', 'Avançado']
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false)
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false)
  const [mostrarModalDescricao, setMostrarModalDescricao] = useState(false)
  const [mostrarModalLink, setMostrarModalLink] = useState(false)
  const [cursoSelecionado, setCursoSelecionado] = useState<CursoResponse | null>(null)
  const [cursoParaVisualizar, setCursoParaVisualizar] = useState<CursoResponse | null>(null)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [carregandoEdicao, setCarregandoEdicao] = useState(false)
  const [carregandoExclusao, setCarregandoExclusao] = useState(false)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, control: controlCadastro, formState: { errors: errorsCadastro } } = useForm<CursoFormData>()
  const { register: registerEdicao, handleSubmit: handleSubmitEdicao, reset: resetEdicao, control: controlEdicao, formState: { errors: errorsEdicao } } = useForm<CursoFormData>()

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      const timer = setTimeout(() => {
        navigate('/admin/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    carregarCursos()
    carregarTrilhas()
  }, [isAuthenticated, user, navigate])

  const carregarCursos = async () => {
    setCarregando(true)
    setErro('')
    try {
      const cursosListados = await listarCursos()
      setCursos(cursosListados)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao carregar cursos'
      setErro(mensagemErro)
    } finally {
      setCarregando(false)
    }
  }

  const carregarTrilhas = async () => {
    try {
      const trilhasListadas = await listarTrilhas()
      setTrilhas(trilhasListadas)
    } catch (error) {
    }
  }

  const onSubmitCadastro = async (data: CursoFormData) => {
    setErro('')
    setCarregandoCadastro(true)
    
    try {
      const cursoData: CursoData = {
        titulo: data.titulo.trim(),
        descricao: data.descricao.trim(),
        linkCurso: data.linkCurso.trim(),
        areaRelacionada: data.areaRelacionada.trim(),
        nivelRecomendado: data.nivelRecomendado.trim(),
        duracaoHoras: data.duracaoHoras.trim()
      }
      
      await cadastrarCurso(cursoData)
      
      resetCadastro()
      setErro('')
      await carregarCursos()
      setMostrarModalCadastro(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao cadastrar curso'
      setErro(mensagemErro)
    } finally {
      setCarregandoCadastro(false)
    }
  }

  const onSubmitEdicao = async (data: CursoFormData) => {
    if (!cursoSelecionado?.idCurso) return
    
    setErro('')
    setCarregandoEdicao(true)
    
    try {
      const cursoData: CursoData = {
        titulo: data.titulo.trim(),
        descricao: data.descricao.trim(),
        linkCurso: data.linkCurso.trim(),
        areaRelacionada: data.areaRelacionada.trim(),
        nivelRecomendado: data.nivelRecomendado.trim(),
        duracaoHoras: data.duracaoHoras.trim()
      }
      
      await editarCurso(cursoSelecionado.idCurso, cursoData)
      
      resetEdicao()
      setCursoSelecionado(null)
      await carregarCursos()
      setMostrarModalEdicao(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao editar curso'
      setErro(mensagemErro)
    } finally {
      setCarregandoEdicao(false)
    }
  }

  const handleExcluir = async () => {
    if (!cursoSelecionado?.idCurso) return
    
    setErro('')
    setCarregandoExclusao(true)
    
    try {
      await excluirCurso(cursoSelecionado.idCurso)
      setCursoSelecionado(null)
      await carregarCursos()
      setMostrarModalExclusao(false)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao excluir curso'
      setErro(mensagemErro)
    } finally {
      setCarregandoExclusao(false)
    }
  }

  const abrirModalEdicao = (curso: CursoResponse) => {
    setCursoSelecionado(curso)
    resetEdicao({
      titulo: curso.titulo,
      descricao: curso.descricao,
      linkCurso: curso.linkCurso,
      areaRelacionada: curso.areaRelacionada,
      nivelRecomendado: curso.nivelRecomendado,
      duracaoHoras: curso.duracaoHoras
    })
    setMostrarModalEdicao(true)
  }

  const abrirModalExclusao = (curso: CursoResponse) => {
    setCursoSelecionado(curso)
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
        <section className="container mx-auto px-2 sm:px-6 md:px-8 relative">
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
                      Gerenciar Cursos
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-start gap-0 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                        Cadastre, edite e exclua cursos da plataforma
                      </p>
                      <button
                        onClick={() => {
                          resetCadastro()
                          carregarTrilhas()
                          setMostrarModalCadastro(true)
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl flex-shrink-0 md:ml-5 self-start md:self-start mt-2 md:-mt-8"
                        aria-label="Novo Curso"
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
              <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-semibold break-words">
                  {erro}
                </p>
              </div>
            )}

            {carregando && cursos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Carregando cursos...</p>
              </div>
            ) : cursos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Nenhum curso cadastrado</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-2 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="pl-4 sm:pl-5 md:pl-6 lg:pl-7 pr-3 sm:pr-4 md:pr-5 lg:pr-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Título</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Descrição</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Link do Curso</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Área Relacionada</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Nível Recomendado</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Duração</th>
                          <th className="pl-3 sm:pl-4 md:pl-5 lg:pl-6 pr-4 sm:pr-5 md:pr-6 lg:pr-7 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {cursos.map((curso) => (
                          <tr key={curso.idCurso} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="pl-4 sm:pl-5 md:pl-6 lg:pl-7 pr-3 sm:pr-4 md:pr-5 lg:pr-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              <div className="whitespace-normal break-words" title={curso.titulo}>
                                {curso.titulo}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              <button
                                onClick={() => {
                                  setCursoParaVisualizar(curso)
                                  setMostrarModalDescricao(true)
                                }}
                                className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors mx-auto"
                                aria-label="Ver descrição completa"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              <button
                                onClick={() => {
                                  setCursoParaVisualizar(curso)
                                  setMostrarModalLink(true)
                                }}
                                className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors mx-auto"
                                aria-label="Ver link completo"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              {curso.areaRelacionada}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              {curso.nivelRecomendado}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              {curso.duracaoHoras}
                            </td>
                            <td className="pl-3 sm:pl-4 md:pl-5 lg:pl-6 pr-4 sm:pr-5 md:pr-6 lg:pr-7 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center">
                              <div className="flex flex-row justify-center gap-1.5 sm:gap-2 md:gap-2.5">
                                <button
                                  onClick={() => abrirModalEdicao(curso)}
                                  className="p-2 sm:p-2.5 md:p-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                  aria-label="Editar"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => abrirModalExclusao(curso)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl md:max-w-3xl lg:max-w-4xl w-full border-2 border-indigo-200 dark:border-indigo-800 m-2 sm:m-3 md:m-0 max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Cadastrar Curso
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoCadastro) {
                      setMostrarModalCadastro(false)
                      resetCadastro()
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

              <form onSubmit={handleSubmitCadastro(onSubmitCadastro)} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <label 
                    htmlFor="titulo" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    {...registerCadastro('titulo', {
                      required: 'Título é obrigatório',
                      maxLength: {
                        value: 100,
                        message: 'Título deve ter no máximo 100 caracteres'
                      }
                    })}
                    disabled={carregandoCadastro}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Digite o título do curso"
                  />
                  {errorsCadastro.titulo && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsCadastro.titulo.message}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="descricao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    maxLength={600}
                    {...registerCadastro('descricao', {
                      required: 'Descrição é obrigatória',
                      maxLength: {
                        value: 600,
                        message: 'Descrição deve ter no máximo 600 caracteres'
                      }
                    })}
                    disabled={carregandoCadastro}
                    rows={4}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                    placeholder="Digite a descrição do curso"
                  />
                  {errorsCadastro.descricao && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsCadastro.descricao.message}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="linkCurso" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Link do Curso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="linkCurso"
                    maxLength={200}
                    {...registerCadastro('linkCurso', {
                      required: 'Link do curso é obrigatório',
                      maxLength: {
                        value: 200,
                        message: 'Link deve ter no máximo 200 caracteres'
                      }
                    })}
                    disabled={carregandoCadastro}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://exemplo.com/curso"
                  />
                  {errorsCadastro.linkCurso && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsCadastro.linkCurso.message}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="areaRelacionada" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Área Relacionada <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="areaRelacionada"
                    control={controlCadastro}
                    rules={{
                      required: 'Área relacionada é obrigatória'
                    }}
                    render={({ field }) => {
                      return (
                        <ListaSelecao
                          options={['Administração', 'Tecnologia', 'Recursos Humanos']}
                          value={field.value || ''}
                          onChange={(nomeSelecionado) => {
                            field.onChange(nomeSelecionado)
                          }}
                          placeholder="Selecione uma área"
                          required
                          id="areaRelacionada"
                        />
                      )
                    }}
                  />
                </div>
                {errorsCadastro.areaRelacionada && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errorsCadastro.areaRelacionada.message}
                  </p>
                )}

                <div>
                  <label 
                    htmlFor="nivelRecomendado" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nível Recomendado <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="nivelRecomendado"
                    control={controlCadastro}
                    rules={{
                      required: 'Nível recomendado é obrigatório'
                    }}
                    render={({ field }) => (
                      <ListaSelecao
                        options={niveisRecomendados}
                        value={field.value || ''}
                        onChange={(nivelSelecionado) => {
                          field.onChange(nivelSelecionado)
                        }}
                        placeholder="Selecione um nível"
                        required
                        id="nivelRecomendado"
                      />
                    )}
                  />
                </div>
                {errorsCadastro.nivelRecomendado && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errorsCadastro.nivelRecomendado.message}
                  </p>
                )}

                <div>
                  <label 
                    htmlFor="duracaoHoras" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Duração (horas) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="duracaoHoras"
                    {...registerCadastro('duracaoHoras', {
                      required: 'Duração é obrigatória',
                      maxLength: {
                        value: 10,
                        message: 'Duração deve ter no máximo 10 caracteres'
                      }
                    })}
                    disabled={carregandoCadastro}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ex: 40 horas"
                  />
                  {errorsCadastro.duracaoHoras && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsCadastro.duracaoHoras.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4">
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
                      }
                    }}
                  >
                    Cancelar
                  </Botao>
                  <Botao
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1 w-full sm:w-auto"
                    disabled={carregandoCadastro}
                  >
                    {carregandoCadastro ? 'Cadastrando...' : 'Cadastrar'}
                  </Botao>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {mostrarModalEdicao && cursoSelecionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl md:max-w-3xl lg:max-w-4xl w-full border-2 border-indigo-200 dark:border-indigo-800 m-2 sm:m-3 md:m-0 max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Editar Curso
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoEdicao) {
                      setMostrarModalEdicao(false)
                      setCursoSelecionado(null)
                      resetEdicao()
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

              <form onSubmit={handleSubmitEdicao(onSubmitEdicao)} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <label 
                    htmlFor="tituloEdicao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tituloEdicao"
                    {...registerEdicao('titulo', {
                      required: 'Título é obrigatório',
                      maxLength: {
                        value: 100,
                        message: 'Título deve ter no máximo 100 caracteres'
                      }
                    })}
                    disabled={carregandoEdicao}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Digite o título do curso"
                  />
                  {errorsEdicao.titulo && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsEdicao.titulo.message}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="descricaoEdicao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="descricaoEdicao"
                    maxLength={600}
                    {...registerEdicao('descricao', {
                      required: 'Descrição é obrigatória',
                      maxLength: {
                        value: 600,
                        message: 'Descrição deve ter no máximo 600 caracteres'
                      }
                    })}
                    disabled={carregandoEdicao}
                    rows={4}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                    placeholder="Digite a descrição do curso"
                  />
                  {errorsEdicao.descricao && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsEdicao.descricao.message}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="linkCursoEdicao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Link do Curso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="linkCursoEdicao"
                    maxLength={200}
                    {...registerEdicao('linkCurso', {
                      required: 'Link do curso é obrigatório',
                      maxLength: {
                        value: 200,
                        message: 'Link deve ter no máximo 200 caracteres'
                      }
                    })}
                    disabled={carregandoEdicao}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://exemplo.com/curso"
                  />
                  {errorsEdicao.linkCurso && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsEdicao.linkCurso.message}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="areaRelacionadaEdicao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Área Relacionada <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="areaRelacionada"
                    control={controlEdicao}
                    rules={{
                      required: 'Área relacionada é obrigatória'
                    }}
                    render={({ field }) => {
                      const nomesTrilhas = trilhas.map(trilha => trilha.nomeTrilha)
                      return (
                        <ListaSelecao
                          options={nomesTrilhas}
                          value={field.value || ''}
                          onChange={(nomeSelecionado) => {
                            field.onChange(nomeSelecionado)
                          }}
                          placeholder="Selecione uma trilha"
                          required
                          id="areaRelacionadaEdicao"
                        />
                      )
                    }}
                  />
                </div>
                {errorsEdicao.areaRelacionada && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errorsEdicao.areaRelacionada.message}
                  </p>
                )}

                <div>
                  <label 
                    htmlFor="nivelRecomendadoEdicao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nível Recomendado <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="nivelRecomendado"
                    control={controlEdicao}
                    rules={{
                      required: 'Nível recomendado é obrigatório'
                    }}
                    render={({ field }) => (
                      <ListaSelecao
                        options={niveisRecomendados}
                        value={field.value || ''}
                        onChange={(nivelSelecionado) => {
                          field.onChange(nivelSelecionado)
                        }}
                        placeholder="Selecione um nível"
                        required
                        id="nivelRecomendadoEdicao"
                      />
                    )}
                  />
                </div>
                {errorsEdicao.nivelRecomendado && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errorsEdicao.nivelRecomendado.message}
                  </p>
                )}

                <div>
                  <label 
                    htmlFor="duracaoHorasEdicao" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Duração (horas) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="duracaoHorasEdicao"
                    {...registerEdicao('duracaoHoras', {
                      required: 'Duração é obrigatória',
                      maxLength: {
                        value: 10,
                        message: 'Duração deve ter no máximo 10 caracteres'
                      }
                    })}
                    disabled={carregandoEdicao}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ex: 40 horas"
                  />
                  {errorsEdicao.duracaoHoras && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errorsEdicao.duracaoHoras.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4">
                  <Botao
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1 w-full sm:w-auto"
                    disabled={carregandoEdicao}
                    onClick={() => {
                      if (!carregandoEdicao) {
                        setMostrarModalEdicao(false)
                        setCursoSelecionado(null)
                        resetEdicao()
                      }
                    }}
                  >
                    Cancelar
                  </Botao>
                  <Botao
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1 w-full sm:w-auto"
                    disabled={carregandoEdicao}
                  >
                    {carregandoEdicao ? 'Salvando...' : 'Salvar'}
                  </Botao>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {mostrarModalDescricao && cursoParaVisualizar && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl md:max-w-3xl lg:max-w-4xl w-full border-2 border-indigo-200 dark:border-indigo-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Descrição do Curso
                </h2>
                <button
                  onClick={() => {
                    setMostrarModalDescricao(false)
                    setCursoParaVisualizar(null)
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {cursoParaVisualizar.titulo}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                  {cursoParaVisualizar.descricao}
                </p>
              </div>
              <div className="flex justify-end">
                <Botao
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setMostrarModalDescricao(false)
                    setCursoParaVisualizar(null)
                  }}
                >
                  Fechar
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalLink && cursoParaVisualizar && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl md:max-w-3xl lg:max-w-4xl w-full border-2 border-indigo-200 dark:border-indigo-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Link do Curso
                </h2>
                <button
                  onClick={() => {
                    setMostrarModalLink(false)
                    setCursoParaVisualizar(null)
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {cursoParaVisualizar.titulo}
                </h3>
                <div className="break-words">
                  <a 
                    href={cursoParaVisualizar.linkCurso} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline text-xs sm:text-sm md:text-base break-all"
                  >
                    {cursoParaVisualizar.linkCurso}
                  </a>
                </div>
              </div>
              <div className="flex justify-end">
                <Botao
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setMostrarModalLink(false)
                    setCursoParaVisualizar(null)
                  }}
                >
                  Fechar
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalExclusao && cursoSelecionado && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md md:max-w-lg lg:max-w-xl w-full border-2 border-red-200 dark:border-red-800 m-2 sm:m-3 md:m-0">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words pr-2">
                  Excluir Curso
                </h2>
                <button
                  onClick={() => {
                    if (!carregandoExclusao) {
                      setMostrarModalExclusao(false)
                      setCursoSelecionado(null)
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

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 break-words">
                Tem certeza que deseja excluir o curso <strong className="break-words text-gray-900 dark:text-white">{cursoSelecionado.titulo}</strong>?
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
                      setCursoSelecionado(null)
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
                  {carregandoExclusao ? 'Excluindo...' : 'Excluir'}
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

export default GerenciarCursos

