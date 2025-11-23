import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import { buscarUsuarioPorId, getBaseUrl } from '../../Types/AutenticacaoLogin'
import { listarTrilhas, type TrilhaResponse } from '../../Types/Trilha'
import { listarCursosPorTrilha, type CursoComStatus } from '../../Types/TrilhaCurso'
import type { DiagnosticoUsuario } from '../../Types/Diagnostico'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'

const HomeFree = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [nomeUsuario, setNomeUsuario] = useState<string>('')
  const [trilhasUsuario, setTrilhasUsuario] = useState<TrilhaResponse[]>([])
  const [carregandoTrilha, setCarregandoTrilha] = useState(true)
  const [trilhaCompleta, setTrilhaCompleta] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      
      if (isAuthenticated && user?.tipoUsuario && user.tipoUsuario !== 'USUARIO') {
        navigate('/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const buscarNomeUsuario = async () => {
      if (user?.idUsuario) {
        try {
          const usuarioCompleto = await buscarUsuarioPorId(user.idUsuario)
          if (usuarioCompleto.nomeUsuario) {
            setNomeUsuario(usuarioCompleto.nomeUsuario)
          }
        } catch (error) {
        }
      }
    }

    if (isAuthenticated && user?.idUsuario) {
      buscarNomeUsuario()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    const buscarTrilhaDoUsuario = async () => {
      if (!user?.idUsuario) return

      setCarregandoTrilha(true)
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
            try {
              diagnosticoResponse = await fetch(`${baseUrl}/diagnosticos-usuario`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
              })
            } catch (error3) {
              setCarregandoTrilha(false)
              return
            }
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
              const idsTrilhasUnicos = new Set<number>()
              const trilhasEncontradas: TrilhaResponse[] = []
              
              diagnosticosComTrilha.forEach((diagnostico) => {
                const idTrilha = diagnostico.idTrilha
                if (idTrilha && !idsTrilhasUnicos.has(idTrilha)) {
                  idsTrilhasUnicos.add(idTrilha)
                  const trilhaEncontrada = trilhasListadas.find(t => t.idTrilha === idTrilha)
                  if (trilhaEncontrada) {
                    trilhasEncontradas.push(trilhaEncontrada)
                  }
                }
              })
              
              if (trilhasEncontradas.length > 0) {
                setTrilhasUsuario(trilhasEncontradas)
              
                try {
                  let todasTrilhasCompletas = true
                  
                  for (const trilha of trilhasEncontradas) {
                    try {
                      const cursosDaTrilha = await listarCursosPorTrilha(trilha.idTrilha, user.idUsuario)
                      
                      if (cursosDaTrilha && cursosDaTrilha.length > 0) {
                        const todosConcluidos = cursosDaTrilha.every((curso: CursoComStatus) => {
                          const status = curso.statusFase?.toUpperCase().trim() || ''
                          return status === 'CONCLUIDA' || status === 'CONCLUÍDA' || status === 'CONCLUIDO'
                        })
                        
                        if (!todosConcluidos) {
                          todasTrilhasCompletas = false
                          break
                        }
                      } else {
                        todasTrilhasCompletas = false
                        break
                      }
                    } catch (error) {
                      todasTrilhasCompletas = false
                      break
                    }
                  }
                  
                  setTrilhaCompleta(todasTrilhasCompletas)
                } catch (error) {
                  setTrilhaCompleta(false)
                }
              } else {
                setTrilhasUsuario([])
                setTrilhaCompleta(true)
              }
            } else {
              setTrilhasUsuario([])
              setTrilhaCompleta(true)
            }
          } else {
            setTrilhasUsuario([])
            setTrilhaCompleta(true)
          }
        } else {
          setTrilhasUsuario([])
          setTrilhaCompleta(true)
        }
      } catch (error) {
        setTrilhasUsuario([])
        setTrilhaCompleta(true)
      } finally {
        setCarregandoTrilha(false)
      }
    }

    if (isAuthenticated && user?.idUsuario) {
      buscarTrilhaDoUsuario()
    }
  }, [isAuthenticated, user])

  const handleLogout = () => {
    logout()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated || user?.tipoUsuario !== 'USUARIO') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const getPrimeiroNome = () => {
    if (nomeUsuario) {
      const primeiroNome = nomeUsuario.trim().split(' ')[0]
      return primeiroNome || 'Usuário'
    }
    if (user?.nomeUsuario) {
      const primeiroNome = user.nomeUsuario.trim().split(' ')[0]
      return primeiroNome || 'Usuário'
    }
    if (user?.nome) {
      const primeiroNome = user.nome.trim().split(' ')[0]
      return primeiroNome || 'Usuário'
    }
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      const nomePart = emailPart.split('.')[0]
      return nomePart.charAt(0).toUpperCase() + nomePart.slice(1).toLowerCase()
    }
    return 'Usuário'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho isHomeFree={true} formularioDesabilitado={trilhasUsuario.length > 0 && !trilhaCompleta} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-12 lg:py-16">
        <section className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2 break-words">
                Bem-vindo, {getPrimeiroNome()}!
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-2">
                Plataforma de Desenvolvimento
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <button 
                onClick={() => {
                  if (carregandoTrilha) return
                  if (trilhasUsuario.length === 0 || trilhaCompleta) {
                    navigate('/usuario/definir-trilha')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                disabled={carregandoTrilha || (trilhasUsuario.length > 0 && !trilhaCompleta)}
                className={`p-4 sm:p-5 md:p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                  (carregandoTrilha || (trilhasUsuario.length > 0 && !trilhaCompleta))
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed pointer-events-none'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg'
                }`}
              >
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                  Formulário para Definição de Trilha
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                  Defina sua trilha de desenvolvimento profissional
                </p>
              </button>

              {trilhasUsuario.map((trilhaUsuario) => (
                <button 
                  key={trilhaUsuario.idTrilha}
                  onClick={() => {
                    const nomeTrilhaLower = trilhaUsuario.nomeTrilha.toLowerCase()
                    if (nomeTrilhaLower.includes('administração') || nomeTrilhaLower.includes('administracao') || nomeTrilhaLower.includes('admin')) {
                      navigate('/usuario/trilha-administracao')
                    } else if (nomeTrilhaLower.includes('tecnologia') || nomeTrilhaLower.includes('tech') || nomeTrilhaLower.includes('tecn')) {
                      navigate('/usuario/trilha-tecnologia')
                    } else if (nomeTrilhaLower.includes('recursos humanos') || nomeTrilhaLower.includes('recursos human') || nomeTrilhaLower.includes('rh')) {
                      navigate('/usuario/trilha-recursos-humanos')
                    } else {
                      navigate(`/usuario/trilha/${trilhaUsuario.idTrilha}`)
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 text-left hover:shadow-lg"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                    {trilhaUsuario.nomeTrilha}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                    {trilhaUsuario.nomeTrilha.toLowerCase().includes('administração') || trilhaUsuario.nomeTrilha.toLowerCase().includes('administracao') || trilhaUsuario.nomeTrilha.toLowerCase().includes('admin')
                      ? 'Explore conteúdos e desafios da área administrativa'
                      : trilhaUsuario.nomeTrilha.toLowerCase().includes('tecnologia') || trilhaUsuario.nomeTrilha.toLowerCase().includes('tech')
                      ? 'Desenvolva suas habilidades técnicas e tecnológicas'
                      : trilhaUsuario.nomeTrilha.toLowerCase().includes('recursos humanos') || trilhaUsuario.nomeTrilha.toLowerCase().includes('rh')
                      ? 'Aprenda sobre gestão de pessoas e RH'
                      : 'Acesse sua trilha de desenvolvimento profissional'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/home-free', onClick: () => { navigate('/home-free'); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
          { label: 'Formulário para Definição de Trilha', path: '/usuario/definir-trilha', onClick: () => { navigate('/usuario/definir-trilha'); window.scrollTo({ top: 0, behavior: 'smooth' }) }, disabled: trilhasUsuario.length > 0 && !trilhaCompleta }
        ]}
        onLinkClick={(path) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      />
    </div>
  )
}

export default HomeFree
