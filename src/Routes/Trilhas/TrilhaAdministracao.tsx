import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import { useTheme } from '../../Contexto/TemaContexto'
import { getBaseUrl } from '../../Types/AutenticacaoLogin'
import { listarTrilhas } from '../../Types/Trilha'
import { listarCursosPorTrilha, atualizarStatusFase, type CursoComStatus } from '../../Types/TrilhaCurso'
import type { DiagnosticoUsuario } from '../../Types/Diagnostico'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import cadeadoPretoFechado from '../../assets/img/Icones/CadeadoPretoFechado.png'
import cadeadoPretoAberto from '../../assets/img/Icones/CadeadoPretoAberto.png'
import cadeadoBrancoFechado from '../../assets/img/Icones/CadeadoBrancoFechado.png'
import cadeadoBrancoAberto from '../../assets/img/Icones/CadeadoBrancoAberto.png'

const TrilhaAdministracao = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const [cursos, setCursos] = useState<CursoComStatus[]>([])
  const [idTrilha, setIdTrilha] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [atualizandoStatus, setAtualizandoStatus] = useState(false)
  const [cursoSelecionado, setCursoSelecionado] = useState<CursoComStatus | null>(null)

  const formatarTitulo = (titulo: string | undefined | null): { primeiraLinha: string; segundaLinha: string } => {
    if (!titulo) return { primeiraLinha: 'Curso', segundaLinha: '' }
    
    const palavras = titulo.trim().split(/\s+/)
    if (palavras.length <= 4) {
      return { primeiraLinha: titulo, segundaLinha: '' }
    }
    
    const primeiraLinha = palavras.slice(0, 4).join(' ')
    const segundaLinha = palavras.slice(4).join(' ')
    return { primeiraLinha, segundaLinha }
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        const loginRoute = window.location.pathname.includes('/usuario/') ? '/login' : '/login-corporativo'
        navigate(loginRoute)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      
      if (isAuthenticated && user?.tipoUsuario !== 'FUNCIONARIO' && user?.tipoUsuario !== 'USUARIO') {
        const loginRoute = '/login'
        navigate(loginRoute)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const buscarTrilhaECursos = async () => {
      if (!user?.idUsuario) return

      setCarregando(true)
      try {
        const baseUrl = getBaseUrl()
        let diagnosticoResponse: Response | null = null

        try {
          diagnosticoResponse = await fetch(`${baseUrl}/diagnosticos-usuario/usuario/${user.idUsuario}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
          })
        } catch (error) {
          try {
            diagnosticoResponse = await fetch(`${baseUrl}/diagnosticos-usuario?usuario=${user.idUsuario}`, {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
              mode: 'cors',
            })
          } catch (error2) {
            setCarregando(false)
            return
          }
        }

        if (diagnosticoResponse && diagnosticoResponse.ok) {
          const diagnosticos = await diagnosticoResponse.json() as DiagnosticoUsuario | DiagnosticoUsuario[]
          let diagnosticosDoUsuario: DiagnosticoUsuario[] = []
          
          if (Array.isArray(diagnosticos)) {
            diagnosticosDoUsuario = diagnosticos.filter((d: DiagnosticoUsuario) => 
              d.idUsuario === user.idUsuario
            )
          } else if (diagnosticos && diagnosticos.idUsuario === user.idUsuario) {
            diagnosticosDoUsuario = [diagnosticos]
          }

          if (diagnosticosDoUsuario.length > 0) {
            const trilhasListadas = await listarTrilhas()
            
            const diagnosticosComTrilha = diagnosticosDoUsuario.filter(d => 
              d.idTrilha
            )
            
            if (diagnosticosComTrilha.length > 0) {
              const idsTrilhasDoUsuario = new Set<number>()
              diagnosticosComTrilha.forEach((d: DiagnosticoUsuario) => {
                const idTrilha = d.idTrilha
                if (idTrilha) {
                  idsTrilhasDoUsuario.add(idTrilha)
                }
              })
              
              const trilhaEncontrada = trilhasListadas.find(t => {
                if (!idsTrilhasDoUsuario.has(t.idTrilha)) return false
                
                const nomeTrilhaLower = t.nomeTrilha.toLowerCase()
                return nomeTrilhaLower.includes('administração') || 
                       nomeTrilhaLower.includes('administracao') ||
                       nomeTrilhaLower.includes('admin')
              })

              if (trilhaEncontrada) {
                setIdTrilha(trilhaEncontrada.idTrilha)
                const cursosDaTrilha = await listarCursosPorTrilha(trilhaEncontrada.idTrilha, user.idUsuario)
                setCursos(cursosDaTrilha)
              }
            }
          }
        }
      } catch (error) {
      } finally {
        setCarregando(false)
      }
    }

    if (isAuthenticated && user?.idUsuario) {
      buscarTrilhaECursos()
    }
  }, [isAuthenticated, user])

  const handleLogout = () => {
    logout()
    const loginRoute = user?.tipoUsuario === 'USUARIO' ? '/' : '/login-corporativo'
    navigate(loginRoute)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isUsuarioComum = user?.tipoUsuario === 'USUARIO'
  const homeRoute = isUsuarioComum ? '/home-free' : '/funcionario/home'

  const handleIniciarTrilha = async () => {
    if (cursos.length === 0 || !idTrilha) return

    const primeiroCurso = cursos[0]
    if (!primeiroCurso.idTrilhaCurso) {
      return
    }

    setAtualizandoStatus(true)
    try {
      if (!user?.idUsuario) {
        alert('Usuário não identificado. Por favor, faça login novamente.')
        return
      }
      if (!primeiroCurso.idTrilhaCurso) {
        alert('Erro: Curso não identificado.')
        return
      }
      await atualizarStatusFase(primeiroCurso.idTrilhaCurso, user.idUsuario, 'EM ANDAMENTO', idTrilha || undefined)
      
      setCursos(prevCursos => 
        prevCursos.map((curso, index) => 
          index === 0 
            ? { ...curso, statusFase: 'EM ANDAMENTO' }
            : curso
        )
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao iniciar trilha: ${errorMessage}. Tente novamente.`)
    } finally {
      setAtualizandoStatus(false)
    }
  }

  const handleConcluirCurso = async () => {
    if (!cursoSelecionado?.idTrilhaCurso) return

    setAtualizandoStatus(true)
    try {
      const indiceAtual = cursos.findIndex(c => c.idTrilhaCurso === cursoSelecionado.idTrilhaCurso)
      const proximoCurso = indiceAtual + 1 < cursos.length ? cursos[indiceAtual + 1] : null

      if (!user?.idUsuario) {
        alert('Usuário não identificado. Por favor, faça login novamente.')
        return
      }
      await atualizarStatusFase(cursoSelecionado.idTrilhaCurso, user.idUsuario, 'CONCLUIDA', idTrilha || undefined)

      if (proximoCurso?.idTrilhaCurso) {
        const statusProximo = proximoCurso.statusFase?.toUpperCase().trim() || ''
        const proximoNaoEstaConcluido = statusProximo !== 'CONCLUIDA' && statusProximo !== 'CONCLUIDO'
        
        if (proximoNaoEstaConcluido) {
          await atualizarStatusFase(proximoCurso.idTrilhaCurso, user.idUsuario, 'EM ANDAMENTO', idTrilha || undefined)
        }
      }

      setCursos(prevCursos => 
        prevCursos.map((curso, index) => {
          if (index === indiceAtual) {
            return { ...curso, statusFase: 'CONCLUIDA', dataConclusao: new Date().toISOString().split('T')[0] }
          }
          if (index === indiceAtual + 1 && proximoCurso) {
            const statusProximo = proximoCurso.statusFase?.toUpperCase().trim() || ''
            const proximoNaoEstaConcluido = statusProximo !== 'CONCLUIDA' && statusProximo !== 'CONCLUIDO'
            if (proximoNaoEstaConcluido) {
              return { ...curso, statusFase: 'EM ANDAMENTO' }
            }
          }
          return curso
        })
      )

      setCursoSelecionado(null)
    } catch (error) {
      alert('Erro ao concluir curso. Tente novamente.')
    } finally {
      setAtualizandoStatus(false)
    }
  }

  if (!isAuthenticated || (user?.tipoUsuario !== 'FUNCIONARIO' && user?.tipoUsuario !== 'USUARIO')) {
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
      <Cabecalho 
        isHomeFuncionario={!isUsuarioComum} 
        isHomeFree={isUsuarioComum}
        ocultarFormulario={true} 
        onLogout={handleLogout} 
      />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-12 lg:py-16">
        <section className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2 break-words">
                Trilha de Administração
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-2 mb-4 sm:mb-6">
                Explore conteúdos e desafios da área administrativa
              </p>
              {!carregando && cursos.length > 0 && (
                !cursos[0].statusFase || 
                cursos[0].statusFase === '' || 
                cursos[0].statusFase?.toUpperCase().trim() === 'NAO INICIADA' || 
                cursos[0].statusFase?.toUpperCase().trim() === 'NAO INICIADO'
              ) && (
                <div className="flex justify-center mb-6 sm:mb-8">
                  <button
                    onClick={handleIniciarTrilha}
                    disabled={atualizandoStatus}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {atualizandoStatus ? 'Iniciando...' : 'Iniciar Trilha'}
                  </button>
                </div>
              )}
              {carregando ? (
                <div className="flex justify-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Carregando cursos...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {cursos.length > 0 ? (
                    cursos.map((curso, index) => {
                      const ordemFase = curso.ordemFase || index + 1
                      const statusFase = curso.statusFase?.toUpperCase().trim() || ''
                      const bloqueada = !statusFase || 
                                       statusFase === '' ||
                                       statusFase === 'NAO INICIADA' || 
                                       statusFase === 'NAO INICIADO' ||
                                       statusFase === 'NULL' ||
                                       statusFase === 'UNDEFINED'
                      const cadeadoAberto = theme === 'dark' ? cadeadoBrancoAberto : cadeadoPretoAberto
                      const cadeadoFechado = theme === 'dark' ? cadeadoBrancoFechado : cadeadoPretoFechado
                      const imagemCadeado = bloqueada ? cadeadoFechado : cadeadoAberto
                      
                      return (
                        <div key={curso.idCurso || index} className="relative">
                          <button
                            onClick={() => {
                              if (!bloqueada) {
                                setCursoSelecionado(curso)
                              }
                            }}
                            disabled={bloqueada}
                            className={`relative rounded-full border-4 bg-transparent p-2 sm:p-2.5 md:p-3 lg:p-3.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 ${
                              bloqueada
                                ? 'border-gray-400 dark:border-gray-600 cursor-not-allowed opacity-60 pointer-events-none'
                                : 'border-purple-800 dark:border-purple-900 cursor-pointer hover:scale-110'
                            }`}
                          >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-lg ${
                              bloqueada
                                ? 'bg-gray-400 dark:bg-gray-600'
                                : 'bg-purple-700 dark:bg-purple-800'
                            }`}>
                              <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">{ordemFase}</span>
                            </div>
                          </button>
                          <img
                            src={imagemCadeado}
                            alt={bloqueada ? 'Bloqueado' : 'Desbloqueado'}
                            className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transform -translate-y-1/2 translate-x-1/2"
                          />
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">Nenhum curso encontrado para esta trilha.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      {cursoSelecionado && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setCursoSelecionado(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8">
              <div className="relative mb-6">
                <button
                  onClick={() => setCursoSelecionado(null)}
                  className="absolute top-0 right-0 translate-x-2 -translate-y-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words text-center">
                  {(() => {
                    const { primeiraLinha, segundaLinha } = formatarTitulo(cursoSelecionado.titulo)
                    return (
                      <>
                        {primeiraLinha}
                        {segundaLinha && (
                          <>
                            <br />
                            {segundaLinha}
                          </>
                        )}
                      </>
                    )
                  })()}
                </h2>
              </div>
              <div className="space-y-4">
                {cursoSelecionado.linkCurso && (
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Link:</h3>
                    <a
                      href={cursoSelecionado.linkCurso}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
                    >
                      Clique Aqui
                    </a>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nível Recomendado</h3>
                  <p className="text-base text-gray-900 dark:text-white">{cursoSelecionado.nivelRecomendado || '-'}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Duração (Horas)</h3>
                  <p className="text-base text-gray-900 dark:text-white">{cursoSelecionado.duracaoHoras || '-'}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <button
                    onClick={handleConcluirCurso}
                    disabled={atualizandoStatus || cursoSelecionado.statusFase?.toUpperCase() === 'CONCLUIDA'}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 dark:bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {atualizandoStatus ? 'Concluindo...' : cursoSelecionado.statusFase?.toUpperCase() === 'CONCLUIDA' ? 'Curso Concluído' : 'Concluir o Curso'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Rodape
        linksRapidos={[
          { label: 'Home', path: homeRoute, onClick: () => { handleNavigate(homeRoute) } }
        ]}
        onLinkClick={(path) => handleNavigate(path)}
      />
    </div>
  )
}

export default TrilhaAdministracao

