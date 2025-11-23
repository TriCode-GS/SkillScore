import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../../Components/Cabecalho/Cabecalho'
import Botao from '../../../Components/Botao/Botao'
import Rodape from '../../../Components/Rodape/Rodape'
import { listarTrilhas, type TrilhaResponse } from '../../../Types/Trilha'
import { getBaseUrl } from '../../../Types/AutenticacaoLogin'
import type { ApiErrorResponse } from '../../../Types/Diagnostico'

interface Pergunta {
  id: number
  texto: string
  alternativas: {
    letra: string
    texto: string
    trilha: 'ADMINISTRACAO' | 'TECNOLOGIA' | 'RH'
  }[]
}

const DefinirTrilha = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [respostas, setRespostas] = useState<{ [key: number]: string }>({})
  const [trilhaRecomendada, setTrilhaRecomendada] = useState<string | null>(null)
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [trilhas, setTrilhas] = useState<TrilhaResponse[]>([])
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')
  const [sucessoEnvio, setSucessoEnvio] = useState(false)
  const [contagemTrilhas, setContagemTrilhas] = useState<{ ADMINISTRACAO: number; TECNOLOGIA: number; RH: number }>({
    ADMINISTRACAO: 0,
    TECNOLOGIA: 0,
    RH: 0
  })

  const perguntas: Pergunta[] = [
    {
      id: 1,
      texto: 'Você prefere lidar com processos internos, organização e fluxo operacional?',
      alternativas: [
        { letra: 'a', texto: 'Sim, gosto de organizar e estruturar tarefas.', trilha: 'ADMINISTRACAO' },
        { letra: 'b', texto: 'Talvez, dependendo da situação.', trilha: 'RH' },
        { letra: 'c', texto: 'Não, prefiro resolver problemas técnicos.', trilha: 'TECNOLOGIA' }
      ]
    },
    {
      id: 2,
      texto: 'Você se sente confortável analisando documentos, dados administrativos e relatórios?',
      alternativas: [
        { letra: 'a', texto: 'Sim, faço isso com facilidade.', trilha: 'ADMINISTRACAO' },
        { letra: 'b', texto: 'Faço, mas prefiro trabalhar com pessoas.', trilha: 'RH' },
        { letra: 'c', texto: 'Prefiro lidar com tecnologia e sistemas.', trilha: 'TECNOLOGIA' }
      ]
    },
    {
      id: 3,
      texto: 'Quando surge um problema interno, como você tende a agir?',
      alternativas: [
        { letra: 'a', texto: 'Busco reorganizar e estruturar as tarefas.', trilha: 'ADMINISTRACAO' },
        { letra: 'b', texto: 'Converso com a equipe para entender o contexto.', trilha: 'RH' },
        { letra: 'c', texto: 'Tento identificar soluções técnicas.', trilha: 'TECNOLOGIA' }
      ]
    },
    {
      id: 4,
      texto: 'Você gosta de resolver problemas utilizando ferramentas digitais?',
      alternativas: [
        { letra: 'a', texto: 'Sim, me sinto à vontade com tecnologia.', trilha: 'TECNOLOGIA' },
        { letra: 'b', texto: 'Sim, mas não sempre.', trilha: 'ADMINISTRACAO' },
        { letra: 'c', texto: 'Prefiro lidar com pessoas.', trilha: 'RH' }
      ]
    },
    {
      id: 5,
      texto: 'Você costuma testar novas ferramentas, softwares e soluções digitais?',
      alternativas: [
        { letra: 'a', texto: 'Quase sempre.', trilha: 'TECNOLOGIA' },
        { letra: 'b', texto: 'Raramente.', trilha: 'ADMINISTRACAO' },
        { letra: 'c', texto: 'Prefiro atividades relacionadas a equipes.', trilha: 'RH' }
      ]
    },
    {
      id: 6,
      texto: 'Quando encontra uma dificuldade, seu primeiro impulso é:',
      alternativas: [
        { letra: 'a', texto: 'Pesquisar soluções técnicas.', trilha: 'TECNOLOGIA' },
        { letra: 'b', texto: 'Entender o impacto administrativo.', trilha: 'ADMINISTRACAO' },
        { letra: 'c', texto: 'Buscar apoio de colegas.', trilha: 'RH' }
      ]
    },
    {
      id: 7,
      texto: 'Você gosta de mediar conflitos e ajudar pessoas a se desenvolverem?',
      alternativas: [
        { letra: 'a', texto: 'Sim, gosto de ajudar pessoas diretamente.', trilha: 'RH' },
        { letra: 'b', texto: 'Sim, mas prefiro organização.', trilha: 'ADMINISTRACAO' },
        { letra: 'c', texto: 'Não, prefiro resolver tecnicamente.', trilha: 'TECNOLOGIA' }
      ]
    },
    {
      id: 8,
      texto: 'Você costuma observar comportamentos e tentar melhorar o bem-estar do time?',
      alternativas: [
        { letra: 'a', texto: 'Frequentemente.', trilha: 'RH' },
        { letra: 'b', texto: 'Às vezes.', trilha: 'ADMINISTRACAO' },
        { letra: 'c', texto: 'Prefiro focar em tecnologias.', trilha: 'TECNOLOGIA' }
      ]
    },
    {
      id: 9,
      texto: 'Em uma equipe, seu papel natural é:',
      alternativas: [
        { letra: 'a', texto: 'Ouvir, entender e apoiar as pessoas.', trilha: 'RH' },
        { letra: 'b', texto: 'Organizar e direcionar tarefas.', trilha: 'ADMINISTRACAO' },
        { letra: 'c', texto: 'Resolver questões técnicas.', trilha: 'TECNOLOGIA' }
      ]
    },
    {
      id: 10,
      texto: 'Se você pudesse escolher uma área para crescer nos próximos meses, qual seria?',
      alternativas: [
        { letra: 'a', texto: 'Administração', trilha: 'ADMINISTRACAO' },
        { letra: 'b', texto: 'Tecnologia', trilha: 'TECNOLOGIA' },
        { letra: 'c', texto: 'Recursos Humanos', trilha: 'RH' }
      ]
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      
      if (isAuthenticated && user?.tipoUsuario !== 'FUNCIONARIO') {
        navigate('/login-corporativo')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const carregarTrilhas = async () => {
      try {
        const trilhasListadas = await listarTrilhas()
        setTrilhas(trilhasListadas)
      } catch (error) {
      }
    }
    
    if (isAuthenticated && user?.tipoUsuario === 'FUNCIONARIO') {
      carregarTrilhas()
    }
  }, [isAuthenticated, user])

  const handleRespostaChange = (perguntaId: number, letra: string) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: letra
    }))
  }

  const vincularTrilhaAoUsuario = async (idUsuario: number, idTrilha: number) => {
    try {
      const baseUrl = getBaseUrl()
      const urlString = `${baseUrl}/usuarios/${idUsuario}/trilha`
      
      let url: URL
      try {
        url = new URL(urlString)
      } catch (error) {
        return
      }

      await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ idTrilha }),
      })
    } catch (error) {
    }
  }

  const mapearNomeParaIdTrilha = (nomeTrilha: string): number | null => {
    const nomeNormalizado = nomeTrilha.toLowerCase().trim()
    
    const mapeamento: { [key: string]: string[] } = {
      'administração': ['administração', 'administracao', 'admin'],
      'tecnologia': ['tecnologia', 'tech', 'ti'],
      'recursos humanos': ['recursos humanos', 'rh', 'recursos humanos', 'rrhh']
    }
    for (const [, variacoes] of Object.entries(mapeamento)) {
      if (variacoes.some(v => nomeNormalizado.includes(v) || v.includes(nomeNormalizado))) {
        const trilha = trilhas.find(t => {
          const nomeTrilhaNormalizado = t.nomeTrilha.toLowerCase().trim()
          return variacoes.some(v => nomeTrilhaNormalizado.includes(v) || v.includes(nomeTrilhaNormalizado))
        })
        if (trilha) return trilha.idTrilha
      }
    }

    const trilha = trilhas.find(t => {
      const nomeTrilhaNormalizado = t.nomeTrilha.toLowerCase().trim()
      return nomeTrilhaNormalizado === nomeNormalizado ||
             nomeTrilhaNormalizado.includes(nomeNormalizado) ||
             nomeNormalizado.includes(nomeTrilhaNormalizado)
    })
    
    return trilha?.idTrilha || null
  }

  const enviarDiagnostico = async (idTrilha: number | null, contagem: { ADMINISTRACAO: number; TECNOLOGIA: number; RH: number }) => {
    if (!idTrilha || !user?.idUsuario) {
      setErroEnvio('Não foi possível identificar a trilha ou o usuário')
      return false
    }

    setEnviando(true)
    setErroEnvio('')
    setSucessoEnvio(false)

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'O diagnóstico está sendo salvo. Tem certeza que deseja sair?'
      return 'O diagnóstico está sendo salvo. Tem certeza que deseja sair?'
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    try {
      const baseUrl = getBaseUrl()
      const urlString = `${baseUrl}/diagnosticos-usuario`
      
      let url: URL
      try {
        url = new URL(urlString)
      } catch (error) {
        throw new Error(`URL inválida: ${urlString}`)
      }
      
      const diagnosticoData = {
        idUsuario: user.idUsuario,
        idTrilha: idTrilha,
        pontuacaoAdmin: contagem.ADMINISTRACAO || 0,
        pontuacaoTech: contagem.TECNOLOGIA || 0,
        pontuacaoRh: contagem.RH || 0
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(diagnosticoData),
      })

      if (!response.ok) {
        let backendMessage: string | undefined
        let responseData: ApiErrorResponse | string | null = null

        try {
          const text = await response.text()
          if (text && text.trim().length > 0) {
            try {
              const parsed = JSON.parse(text) as ApiErrorResponse | string
              if (typeof parsed === 'string') {
                backendMessage = parsed
                responseData = parsed
              } else if (parsed && typeof parsed === 'object') {
                responseData = parsed
                backendMessage = parsed.message || parsed.error || parsed.detalhe || parsed.erro
              }
            } catch {
              backendMessage = text.trim()
              responseData = text.trim()
            }
          }
        } catch (_) {}

        if (!backendMessage && responseData && typeof responseData === 'object') {
          backendMessage = responseData.message || responseData.error || responseData.detalhe || responseData.erro
        }

        const statusText = response.statusText || 'Erro'
        const message = backendMessage || `Falha ao salvar diagnóstico (status ${response.status} ${statusText})`
        
        throw new Error(message)
      }

      await vincularTrilhaAoUsuario(user.idUsuario, idTrilha)

      setSucessoEnvio(true)
      setErroEnvio('')
      return true
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao salvar diagnóstico'
      setErroEnvio(mensagemErro)
      setSucessoEnvio(false)
      return false
    } finally {
      setEnviando(false)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }

  const calcularTrilhaRecomendada = async () => {
    const contagem = {
      ADMINISTRACAO: 0,
      TECNOLOGIA: 0,
      RH: 0
    }

    perguntas.forEach(pergunta => {
      const respostaSelecionada = respostas[pergunta.id]
      if (respostaSelecionada) {
        const alternativa = pergunta.alternativas.find(alt => alt.letra === respostaSelecionada)
        if (alternativa) {
          contagem[alternativa.trilha]++
        }
      }
    })

    setContagemTrilhas(contagem)

    const maiorContagem = Math.max(contagem.ADMINISTRACAO, contagem.TECNOLOGIA, contagem.RH)
    
    let trilhaRecomendada = ''
    if (contagem.ADMINISTRACAO === maiorContagem) {
      trilhaRecomendada = 'Administração'
    } else if (contagem.TECNOLOGIA === maiorContagem) {
      trilhaRecomendada = 'Tecnologia'
    } else if (contagem.RH === maiorContagem) {
      trilhaRecomendada = 'Recursos Humanos'
    }

    setTrilhaRecomendada(trilhaRecomendada)
    setMostrarResultado(true)

    // Enviar diagnóstico ao backend
    const idTrilha = mapearNomeParaIdTrilha(trilhaRecomendada)
    if (idTrilha) {
      await enviarDiagnostico(idTrilha, contagem)
    } else {
      setErroEnvio('Trilha recomendada não encontrada no sistema')
    }
  }

  const todasPerguntasRespondidas = perguntas.every(pergunta => respostas[pergunta.id])

  const handleLogout = () => {
    logout()
    navigate('/login-corporativo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || user?.tipoUsuario !== 'FUNCIONARIO') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col relative ${enviando ? 'pointer-events-none' : ''}`}>
      {enviando && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center pointer-events-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 md:p-10 max-w-md mx-4 border-2 border-indigo-200 dark:border-indigo-800">
            <div className="text-center space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Salvando diagnóstico...
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Por favor, aguarde. Não feche esta página.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className={enviando ? 'opacity-50 pointer-events-none' : ''}>
        <Cabecalho isHomeFuncionario={true} isDefinirTrilha={true} formularioDesabilitado={false} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-2 sm:px-3 md:px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => handleNavigate('/funcionario/home')}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap"
                >
                  Voltar
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 md:gap-5 mb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-0 flex-1 min-w-0">
                  <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words">
                      Formulário para Definição de Trilha
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                      Responda as perguntas para descobrir sua trilha ideal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('/funcionario/home')}
                  className="hidden md:block px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap self-auto"
                >
                  Voltar
                </button>
              </div>
            </div>

            {!mostrarResultado ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 space-y-6 sm:space-y-8">
                {perguntas.map((pergunta, index) => (
                  <div key={pergunta.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-sm">
                        {pergunta.id}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {pergunta.texto}
                        </h3>
                        <div className="space-y-2">
                          {pergunta.alternativas.map((alternativa) => (
                            <label
                              key={alternativa.letra}
                              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                respostas[pergunta.id] === alternativa.letra
                                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`pergunta-${pergunta.id}`}
                                value={alternativa.letra}
                                checked={respostas[pergunta.id] === alternativa.letra}
                                onChange={() => handleRespostaChange(pergunta.id, alternativa.letra)}
                                className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                              />
                              <div className="flex-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">
                                  {alternativa.letra.toUpperCase()})
                                </span>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                  {alternativa.texto}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < perguntas.length - 1 && (
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Botao
                    type="button"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                    onClick={calcularTrilhaRecomendada}
                    disabled={!todasPerguntasRespondidas}
                  >
                    Enviar
                  </Botao>
                  {!todasPerguntasRespondidas && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Por favor, responda todas as perguntas antes de enviar.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Sua trilha recomendada é:
                  </h2>
                  
                  <div className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      {trilhaRecomendada}
                    </p>
                  </div>

                  {enviando && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Salvando diagnóstico...
                    </div>
                  )}

                  {erroEnvio && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                        {erroEnvio}
                      </p>
                    </div>
                  )}

                  {sucessoEnvio && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        Diagnóstico salvo com sucesso! Sua trilha foi vinculada ao seu perfil.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                      Detalhamento das respostas:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Administração</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{contagemTrilhas.ADMINISTRACAO}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tecnologia</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{contagemTrilhas.TECNOLOGIA}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recursos Humanos</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{contagemTrilhas.RH}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      </div>
      <div className={enviando ? 'opacity-50 pointer-events-none' : ''}>
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/funcionario/home', onClick: () => { handleNavigate('/funcionario/home'); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
          { label: 'Formulário para Definição de Trilha', path: '/funcionario/definir-trilha', onClick: () => { handleNavigate('/funcionario/definir-trilha'); window.scrollTo({ top: 0, behavior: 'smooth' }) } }
        ]}
        onLinkClick={(path) => { handleNavigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      />
      </div>
    </div>
  )
}

export default DefinirTrilha
