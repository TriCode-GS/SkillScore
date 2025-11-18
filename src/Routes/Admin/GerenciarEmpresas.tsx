import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from '../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Botao from '../../Components/Botao/Botao'
import ListaSelecao from '../../Components/ListaSelecao/ListaSelecao'
import { listarEmpresas, cadastrarEmpresa, editarEmpresa, excluirEmpresa, type EmpresaData } from '../../Types/Empresa'
import { getBaseUrl } from '../../Types/AutenticacaoLogin'

interface GerenciarEmpresasProps {
  onNavigate?: (pagina: string) => void
}

interface EmpresaFormData {
  razaoSocial: string
  cnpj: string
  setor: string
  idAdministrador: string
}

interface AdministradorOption {
  idUsuario: number
  nomeUsuario: string
}

const GerenciarEmpresas = ({ onNavigate }: GerenciarEmpresasProps) => {
  const { user, isAuthenticated } = useAuth()
  const [empresas, setEmpresas] = useState<EmpresaData[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [administradores, setAdministradores] = useState<AdministradorOption[]>([])
  const [carregandoAdministradores, setCarregandoAdministradores] = useState(false)
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false)
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false)
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaData | null>(null)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, control: controlCadastro, formState: { errors: errorsCadastro } } = useForm<EmpresaFormData>()
  const { register: registerEdicao, handleSubmit: handleSubmitEdicao, reset: resetEdicao, control: controlEdicao, formState: { errors: errorsEdicao } } = useForm<EmpresaFormData>()

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      const timer = setTimeout(() => {
        onNavigate?.('loginAdmin')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
    carregarEmpresas()
    carregarAdministradores()
  }, [isAuthenticated, user, onNavigate])

  const carregarAdministradores = async () => {
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
        const usuarios = await res.json() as any[]
        const administradoresDisponiveis = usuarios
          .filter((u: any) => {
            const tipoUsuario = (u.tipoUsuario || u.tipo_usuario || '').trim().toUpperCase()
            const idEmpresa = u.idEmpresa || u.id_empresa
            return (tipoUsuario === 'ADMINISTRADOR EMP' || tipoUsuario === 'ADMINITRADOR EMP') && 
                   (idEmpresa == null || idEmpresa === null)
          })
          .map((u: any) => ({
            idUsuario: u.idUsuario || u.id_usuario,
            nomeUsuario: u.nomeUsuario || u.nome_usuario || '-'
          }))
        
        setAdministradores(administradoresDisponiveis)
      }
    } catch (error) {
      setAdministradores([])
    } finally {
      setCarregandoAdministradores(false)
    }
  }

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
          const usuarios = await res.json() as any[]
          
          try {
            const loginUrlString = `${baseUrl.trim().replace(/\/$/, '')}/logins`
            const loginRes = await fetch(loginUrlString, {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
              mode: 'cors',
            })
            
            let empresasComAdministrador: any[] = []
            
            if (loginRes.ok) {
              const logins = await loginRes.json() as any[]
              
              empresasComAdministrador = empresasListadas.map((empresa) => {
                let administrador = null
                
                if (empresa.email) {
                  const loginAdmin = logins.find((l: any) => {
                    const loginEmail = l.email || ''
                    const loginTipo = l.tipoLogin || l.tipo_login || ''
                    return loginEmail === empresa.email && 
                           (loginTipo === 'ADMINISTRADOR EMP' || loginTipo === 'ADMINITRADOR EMP')
                  })
                  
                  if (loginAdmin) {
                    const loginIdUsuario = loginAdmin.idUsuario || loginAdmin.id_usuario
                    administrador = usuarios.find((u: any) => {
                      const uId = u.idUsuario || u.id_usuario
                      return uId != null && loginIdUsuario != null && Number(uId) === Number(loginIdUsuario)
                    })
                  }
                }
                
                if (!administrador) {
                  administrador = usuarios.find((u: any) => {
                    const uIdEmpresa = u.idEmpresa || u.id_empresa
                    const empresaId = empresa.idEmpresa
                    
                    const idEmpresaMatch = uIdEmpresa != null && empresaId != null && 
                                          (Number(uIdEmpresa) === Number(empresaId))
                    
                    const tipoUsuario = u.tipoUsuario || u.tipo_usuario || ''
                    const tipoUsuarioMatch = 
                      tipoUsuario === 'ADMINISTRADOR EMP' || 
                      tipoUsuario === 'ADMINITRADOR EMP' ||
                      tipoUsuario.trim().toUpperCase() === 'ADMINISTRADOR EMP' ||
                      tipoUsuario.trim().toUpperCase() === 'ADMINITRADOR EMP'
                    
                    return idEmpresaMatch && tipoUsuarioMatch
                  })
                }
                
                if (administrador) {
                  const nomeAdmin = administrador.nomeUsuario || 
                                   administrador.nome_usuario || 
                                   '-'
                  return { 
                    ...empresa, 
                    nomeAdministrador: nomeAdmin
                  }
                }
                
                return { ...empresa, nomeAdministrador: '-' }
              })
            } else {
              empresasComAdministrador = empresasListadas.map((empresa) => {
                const administrador = usuarios.find((u: any) => {
                  const uIdEmpresa = u.idEmpresa || u.id_empresa
                  const empresaId = empresa.idEmpresa
                  
                  const idEmpresaMatch = uIdEmpresa != null && empresaId != null && 
                                        (Number(uIdEmpresa) === Number(empresaId))
                  
                  const tipoUsuario = u.tipoUsuario || u.tipo_usuario || ''
                  const tipoUsuarioMatch = 
                    tipoUsuario === 'ADMINISTRADOR EMP' || 
                    tipoUsuario === 'ADMINITRADOR EMP' ||
                    tipoUsuario.trim().toUpperCase() === 'ADMINISTRADOR EMP' ||
                    tipoUsuario.trim().toUpperCase() === 'ADMINITRADOR EMP'
                  
                  return idEmpresaMatch && tipoUsuarioMatch
                })
                
                if (administrador) {
                  const nomeAdmin = administrador.nomeUsuario || 
                                   administrador.nome_usuario || 
                                   '-'
                  return { 
                    ...empresa, 
                    nomeAdministrador: nomeAdmin
                  }
                }
                
                return { ...empresa, nomeAdministrador: '-' }
              })
            }
            
            setEmpresas(empresasComAdministrador)
          } catch (loginError) {
            const empresasComAdministrador = empresasListadas.map((empresa) => {
              const administrador = usuarios.find((u: any) => {
                const uIdEmpresa = u.idEmpresa || u.id_empresa
                const empresaId = empresa.idEmpresa
                
                const idEmpresaMatch = uIdEmpresa != null && empresaId != null && 
                                      (Number(uIdEmpresa) === Number(empresaId))
                
                const tipoUsuario = u.tipoUsuario || u.tipo_usuario || ''
                const tipoUsuarioMatch = 
                  tipoUsuario === 'ADMINISTRADOR EMP' || 
                  tipoUsuario === 'ADMINITRADOR EMP' ||
                  tipoUsuario.trim().toUpperCase() === 'ADMINISTRADOR EMP' ||
                  tipoUsuario.trim().toUpperCase() === 'ADMINITRADOR EMP'
                
                return idEmpresaMatch && tipoUsuarioMatch
              })
              
              if (administrador) {
                const nomeAdmin = administrador.nomeUsuario || 
                                 administrador.nome_usuario || 
                                 '-'
                return { 
                  ...empresa, 
                  nomeAdministrador: nomeAdmin
                }
              }
              
              return { ...empresa, nomeAdministrador: '-' }
            })
            
            setEmpresas(empresasComAdministrador)
          }
        } else {
          setEmpresas(empresasListadas.map(e => ({ ...e, nomeAdministrador: '-' })))
        }
      } catch (error) {
        setEmpresas(empresasListadas.map(e => ({ ...e, nomeAdministrador: '-' })))
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar empresas')
    } finally {
      setCarregando(false)
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
    
    if (!data.idAdministrador || data.idAdministrador === '') {
      setErro('Selecione um administrador')
      return
    }
    
    if (!data.setor || !data.setor.trim()) {
      setErro('Setor de Atuação é obrigatório')
      return
    }
    
    try {
      const empresaData: any = {
        nomeEmpresa: data.razaoSocial.trim(),
        nome_empresa: data.razaoSocial.trim(),
        cnpj: data.cnpj.replace(/\D/g, ''),
        setor: data.setor.trim(),
        email: null,
        telefone: null
      }
      
      const empresaCriada = await cadastrarEmpresa(empresaData)
      
      if (data.idAdministrador && empresaCriada.idEmpresa) {
        try {
          const { atualizarUsuario } = await import('../../Types/AutenticacaoLogin')
          const idAdministradorNum = parseInt(data.idAdministrador, 10)
          
          const administradorSelecionado = administradores.find(a => a.idUsuario === idAdministradorNum)
          if (administradorSelecionado) {
            const baseUrl = getBaseUrl()
            const urlString = `${baseUrl}/usuarios`
            const res = await fetch(urlString, {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
              mode: 'cors',
            })
            
            if (res.ok) {
              const usuarios = await res.json() as any[]
              const usuario = usuarios.find((u: any) => {
                const uId = u.idUsuario || u.id_usuario
                return uId != null && Number(uId) === idAdministradorNum
              })
              
              if (usuario) {
                const usuarioDataAtualizado: any = {
                  idEmpresa: empresaCriada.idEmpresa,
                  id_empresa: empresaCriada.idEmpresa,
                  nomeUsuario: usuario.nomeUsuario || usuario.nome_usuario || administradorSelecionado.nomeUsuario,
                  nome_usuario: usuario.nomeUsuario || usuario.nome_usuario || administradorSelecionado.nomeUsuario,
                  tipoUsuario: usuario.tipoUsuario || usuario.tipo_usuario || 'ADMINISTRADOR EMP',
                  tipo_usuario: usuario.tipoUsuario || usuario.tipo_usuario || 'ADMINISTRADOR EMP',
                  areaAtuacao: usuario.areaAtuacao || usuario.area_atuacao || null,
                  area_atuacao: usuario.areaAtuacao || usuario.area_atuacao || null,
                  nivelSenioridade: usuario.nivelSenioridade || usuario.nivel_senioridade || null,
                  nivel_senioridade: usuario.nivelSenioridade || usuario.nivel_senioridade || null,
                  competencias: usuario.competencias || null
                }
                
                await atualizarUsuario(idAdministradorNum, usuarioDataAtualizado)
              }
            }
          }
        } catch (errorAtualizacao) {
        }
      }
      
      resetCadastro()
      setMostrarModalCadastro(false)
      setErro('')
      await carregarEmpresas()
      await carregarAdministradores()
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao cadastrar empresa'
      setErro(mensagemErro)
    }
  }

  const onSubmitEdicao = async (data: EmpresaFormData) => {
    if (!empresaSelecionada?.idEmpresa) return
    
    setErro('')
    
    try {
      const empresaData: any = {
        nomeEmpresa: data.razaoSocial.trim(),
        nome_empresa: data.razaoSocial.trim(),
        cnpj: data.cnpj.replace(/\D/g, ''),
        setor: data.setor && data.setor.trim() ? data.setor.trim() : null,
        email: null,
        telefone: null
      }
      await editarEmpresa(empresaSelecionada.idEmpresa, empresaData)
      resetEdicao()
      setMostrarModalEdicao(false)
      setEmpresaSelecionada(null)
      await carregarEmpresas()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao editar empresa')
    }
  }

  const handleExcluir = async () => {
    if (!empresaSelecionada?.idEmpresa) return
    
    setErro('')
    try {
      await excluirEmpresa(empresaSelecionada.idEmpresa)
      setMostrarModalExclusao(false)
      setEmpresaSelecionada(null)
      await carregarEmpresas()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir empresa')
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
    onNavigate?.('home')
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
      <Cabecalho onNavigate={onNavigate} isHomeAdmin={true} onLogout={handleLogout} />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <div className="flex justify-end mb-3 md:hidden">
                <button
                  onClick={() => {
                    onNavigate?.('homeAdmin')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                          carregarAdministradores()
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
                    onNavigate?.('homeAdmin')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Razão Social</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">CNPJ</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">Administrador</th>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-right text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {empresas.map((empresa) => (
                          <tr key={empresa.idEmpresa} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white break-words max-w-[120px] sm:max-w-[180px] md:max-w-[250px] lg:max-w-none">
                              <div className="truncate md:whitespace-normal" title={empresa.nomeEmpresa || empresa.razaoSocial || '-'}>
                                {empresa.nomeEmpresa || empresa.razaoSocial || '-'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {formatCNPJ(empresa.cnpj)}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 break-words hidden md:table-cell">
                              {empresa.nomeAdministrador || '-'}
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-right">
                              <div className="flex flex-col sm:flex-row justify-end gap-1.5 sm:gap-2 md:gap-2.5">
                                <button
                                  onClick={() => abrirModalEdicao(empresa)}
                                  className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors whitespace-nowrap"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => abrirModalExclusao(empresa)}
                                  className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors whitespace-nowrap"
                                >
                                  Excluir
                                </button>
                              </div>
                              <div className="md:hidden mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Admin: {empresa.nomeAdministrador || '-'}
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
                  setMostrarModalCadastro(false)
                  resetCadastro()
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
              <form onSubmit={handleSubmitCadastro(onSubmitCadastro)} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Razão Social *
                  </label>
                  <input
                    type="text"
                    {...registerCadastro('razaoSocial', { required: 'Razão Social é obrigatória' })}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Ex: Tecnologia, Saúde, Educação..."
                  />
                  {errorsCadastro.setor && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsCadastro.setor.message}
                    </p>
                  )}
                </div>

                <div>
                  {carregandoAdministradores ? (
                    <>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Administrador *
                      </label>
                      <div className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                        Carregando administradores...
                      </div>
                    </>
                  ) : (
                    <Controller
                      name="idAdministrador"
                      control={controlCadastro}
                      rules={{ required: 'Selecione um administrador' }}
                      render={({ field }) => {
                        const opcoesAdministradores = administradores.map(admin => admin.nomeUsuario)
                        
                        const nomeSelecionado = field.value 
                          ? administradores.find(admin => admin.idUsuario.toString() === field.value)?.nomeUsuario || ''
                          : ''
                        
                        return (
                          <>
                            <ListaSelecao
                              options={opcoesAdministradores}
                              value={nomeSelecionado}
                              onChange={(nomeSelecionado) => {
                                const adminSelecionado = administradores.find(admin => admin.nomeUsuario === nomeSelecionado)
                                field.onChange(adminSelecionado ? adminSelecionado.idUsuario.toString() : '')
                              }}
                              placeholder="Selecione um administrador"
                              label="Administrador *"
                              required
                              id="idAdministrador"
                            />
                            {errorsCadastro.idAdministrador && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errorsCadastro.idAdministrador.message}
                              </p>
                            )}
                            {administradores.length === 0 && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                Nenhum administrador disponível. Certifique-se de que existem administradores cadastrados sem empresa vinculada.
                              </p>
                            )}
                          </>
                        )
                      }}
                    />
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
                    setMostrarModalCadastro(false)
                    resetCadastro()
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
                  onClick={handleSubmitCadastro(onSubmitCadastro)}
                >
                  Cadastrar
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
                  setMostrarModalEdicao(false)
                  setEmpresaSelecionada(null)
                  resetEdicao()
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                  <Controller
                    name="cnpj"
                    control={controlEdicao}
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
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="00.000.000/0000-00"
                      />
                    )}
                  />
                  {errorsEdicao.cnpj && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errorsEdicao.cnpj.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Setor de Atuação
                  </label>
                  <input
                    type="text"
                    {...registerEdicao('setor')}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                    setMostrarModalEdicao(false)
                    setEmpresaSelecionada(null)
                    resetEdicao()
                  }}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto"
                  onClick={handleSubmitEdicao(onSubmitEdicao)}
                >
                  Salvar
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
                    setMostrarModalExclusao(false)
                    setEmpresaSelecionada(null)
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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
                    setMostrarModalExclusao(false)
                    setEmpresaSelecionada(null)
                  }}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1 w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                  onClick={handleExcluir}
                >
                  Excluir
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

