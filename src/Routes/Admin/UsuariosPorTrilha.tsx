import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import { listarUsuarios, getBaseUrl, type UsuarioResponse } from '../../Types/AutenticacaoLogin'
import { listarTrilhas } from '../../Types/Trilha'
import type { DiagnosticoUsuario } from '../../Types/Diagnostico'

interface LoginApiResponse {
  idLogin?: number
  idUsuario?: number
  email?: string
  tipoLogin?: string
}

interface TrilhaVinculada {
  nomeTrilha: string
  idTrilha: number
}

interface UsuarioComTrilha extends UsuarioResponse {
  email?: string
  tipoLogin?: string
  trilhas: TrilhaVinculada[]
}

const UsuariosPorTrilha = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [usuarios, setUsuarios] = useState<UsuarioComTrilha[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      const timer = setTimeout(() => {
        navigate('/admin/login')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    carregarDados()
  }, [isAuthenticated, user, navigate])

  const carregarDados = async () => {
    setCarregando(true)
    setErro('')
    try {
      const [usuariosListados, trilhasListadas] = await Promise.all([
        listarUsuarios(),
        listarTrilhas()
      ])
      
      const baseUrl = getBaseUrl()
      const loginsResponse = await fetch(`${baseUrl}/logins`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      })

      if (!loginsResponse.ok) {
        throw new Error('Erro ao carregar logins')
      }

      const logins: LoginApiResponse[] = await loginsResponse.json()

      const usuariosFiltrados = usuariosListados.filter(usuario => {
        const login = logins.find(l => l.idUsuario === usuario.idUsuario)
        return login && 
               (login.tipoLogin === 'USUARIO' || login.tipoLogin === 'FUNCIONARIO') &&
               (usuario.tipoUsuario === 'USUARIO' || usuario.tipoUsuario === 'FUNCIONARIO')
      })

      const usuariosComTrilha = await Promise.all(
        usuariosFiltrados.map(async (usuario) => {
          const login = logins.find(l => l.idUsuario === usuario.idUsuario)
          
          try {
            let diagnosticoResponse: Response | null = null
            let diagnosticosData: DiagnosticoUsuario | DiagnosticoUsuario[] | null = null
            
            try {
              diagnosticoResponse = await fetch(`${baseUrl}/diagnosticos-usuario/usuario/${usuario.idUsuario}`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                },
                mode: 'cors',
              })
              
              if (diagnosticoResponse.ok) {
                diagnosticosData = await diagnosticoResponse.json() as DiagnosticoUsuario | DiagnosticoUsuario[]
              }
            } catch (error) {}
            
            if (!diagnosticoResponse || !diagnosticoResponse.ok) {
              try {
                diagnosticoResponse = await fetch(`${baseUrl}/diagnosticos-usuario?usuario=${usuario.idUsuario}`, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                  mode: 'cors',
                })
                
                if (diagnosticoResponse.ok) {
                  diagnosticosData = await diagnosticoResponse.json() as DiagnosticoUsuario | DiagnosticoUsuario[]
                }
              } catch (error) {}
            }
            
            if (!diagnosticoResponse || !diagnosticoResponse.ok) {
              try {
                diagnosticoResponse = await fetch(`${baseUrl}/diagnosticos-usuario`, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                  mode: 'cors',
                })
                
                if (diagnosticoResponse.ok) {
                  const todosDiagnosticos = await diagnosticoResponse.json() as DiagnosticoUsuario[]
                  if (Array.isArray(todosDiagnosticos)) {
                    diagnosticosData = todosDiagnosticos.filter((d: DiagnosticoUsuario) => 
                      d.idUsuario === usuario.idUsuario
                    )
                  }
                }
              } catch (error) {}
            }

            const trilhasVinculadas: TrilhaVinculada[] = []

            if (diagnosticoResponse && diagnosticoResponse.ok && diagnosticosData) {
              let diagnosticos: DiagnosticoUsuario[] = []
              
              if (Array.isArray(diagnosticosData)) {
                diagnosticos = diagnosticosData
              } else if (diagnosticosData) {
                diagnosticos = [diagnosticosData]
              }

              const idsTrilhasUnicos = new Set<number>()
              
              diagnosticos.forEach((diagnostico) => {
                const idTrilha = diagnostico.idTrilha
                
                if (idTrilha && !idsTrilhasUnicos.has(idTrilha)) {
                  idsTrilhasUnicos.add(idTrilha)
                  
                  const trilhaEncontrada = trilhasListadas.find(t => t.idTrilha === idTrilha)
                  if (trilhaEncontrada) {
                    trilhasVinculadas.push({
                      nomeTrilha: trilhaEncontrada.nomeTrilha,
                      idTrilha: idTrilha
                    })
                  }
                }
              })
            }

            return {
              ...usuario,
              email: login?.email,
              tipoLogin: login?.tipoLogin,
              trilhas: trilhasVinculadas.length > 0 ? trilhasVinculadas : []
            }
          } catch (error) {
            return {
              ...usuario,
              email: login?.email,
              tipoLogin: login?.tipoLogin,
              trilhas: []
            }
          }
        })
      )

      setUsuarios(usuariosComTrilha)
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao carregar dados'
      setErro(mensagemErro)
    } finally {
      setCarregando(false)
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
        <section className="container mx-auto px-2 sm:px-3 md:px-4 relative">
          <div className="max-w-full mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => handleNavigate('/admin/home')}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors whitespace-nowrap"
                >
                  Voltar ao Menu
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 md:gap-5 mb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-0 flex-1 min-w-0">
                  <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words">
                      Usuários
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 break-words mt-1 sm:mt-2 md:mt-0">
                      Visualize usuários e funcionários cadastrados e suas trilhas
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('/admin/home')}
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

            {carregando && usuarios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Carregando usuários...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto -mx-2 sm:-mx-3 md:-mx-4">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Nome</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Email</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Tipo de Login</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Trilha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {usuarios.map((usuario) => (
                          <tr key={usuario.idUsuario} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              <div className="truncate md:whitespace-normal" title={usuario.nomeUsuario}>
                                {usuario.nomeUsuario}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              <div className="truncate md:whitespace-normal" title={usuario.email}>
                                {usuario.email || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words">
                              {usuario.tipoLogin || '-'}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words">
                              {usuario.trilhas && usuario.trilhas.length > 0 ? (
                                <div className="flex flex-col gap-2 items-center">
                                  {usuario.trilhas.map((trilha, index) => (
                                    <span 
                                      key={`${trilha.idTrilha}-${index}`}
                                      className="inline-block px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 whitespace-normal"
                                    >
                                      {trilha.nomeTrilha}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="inline-block px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  Sem trilha
                                </span>
                              )}
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
      <Rodape
        linksRapidos={[
          { label: 'Home', path: '/admin/home', onClick: () => handleNavigate('/admin/home') },
          { label: 'Gerenciar Administradores', path: '/admin/administradores', onClick: () => handleNavigate('/admin/administradores') },
          { label: 'Gerenciar Empresas', path: '/admin/empresas', onClick: () => handleNavigate('/admin/empresas') },
          { label: 'Gerenciar Cursos', path: '/admin/cursos', onClick: () => handleNavigate('/admin/cursos') },
          { label: 'Gerenciar Trilhas', path: '/admin/trilhas', onClick: () => handleNavigate('/admin/trilhas') },
          { label: 'Usuários por Trilha', path: '/admin/usuarios-por-trilha', onClick: () => handleNavigate('/admin/usuarios-por-trilha') }
        ]}
        onLinkClick={(path) => handleNavigate(path)}
      />
    </div>
  )
}

export default UsuariosPorTrilha

