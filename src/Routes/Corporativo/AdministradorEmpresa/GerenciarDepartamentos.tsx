import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Contexto/AutenticacaoContexto'
import Cabecalho from '../../../Components/Cabecalho/Cabecalho'
import Botao from '../../../Components/Botao/Botao'
import { cadastrarDepartamento, listarDepartamentos, type DepartamentoData, type DepartamentoResponse } from '../../../Types/Departamento'
import { buscarUsuarioPorId } from '../../../Types/AutenticacaoLogin'

interface DepartamentoFormData {
  nomeDepartamento: string
}

const GerenciarDepartamentos = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [departamentos, setDepartamentos] = useState<DepartamentoResponse[]>([])
  const [carregando, setCarregando] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false)
  const [idEmpresa, setIdEmpresa] = useState<number | null>(null)

  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, formState: { errors: errorsCadastro } } = useForm<DepartamentoFormData>()

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
      setDepartamentos(departamentosListados)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar departamentos')
    } finally {
      setCarregando(false)
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
        <section className="container mx-auto px-4 sm:px-6 md:px-8 relative">
          <div className="max-w-6xl mx-auto">
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
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Nome do Departamento</th>
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
    </div>
  )
}

export default GerenciarDepartamentos

