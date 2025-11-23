import { getBaseUrl } from './AutenticacaoLogin'
import type { UsuarioData, TipoUsuario } from './AutenticacaoLogin'
import type { ApiErrorResponse } from './Diagnostico'

export type EmpresaData = {
  idEmpresa?: number
  nomeEmpresa?: string
  razaoSocial?: string
  cnpj: string
  setor?: string | null
  email?: string | null
  telefone?: string | null
  nomeAdministrador?: string
}

export interface UsuarioApiResponse {
  idUsuario?: number
  nomeUsuario?: string
  tipoUsuario?: TipoUsuario | string
  idEmpresa?: number | null
  idDepartamento?: number | null
  nivelSenioridade?: string | null
  competencias?: string | null
}

export type EmpresaResponse = EmpresaData & {
  idEmpresa: number
}

export type CadastroEmpresaCompletoData = {
  razaoSocial: string
  cnpj: string
  setor: string
  email: string
  nomeAdministrador: string
  senha: string
}

export async function listarEmpresas(): Promise<EmpresaResponse[]> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/empresas`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio.')
    }
    throw new Error(`Não foi possível conectar à API. URL: ${url.toString()}. Erro: ${errorMessage}`)
  }

  if (!res.ok) {
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
    const message = backendMessage || `Falha ao listar empresas (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function cadastrarEmpresaCompleto(dados: CadastroEmpresaCompletoData): Promise<EmpresaResponse> {
  const nomeEmpresa = dados.razaoSocial.trim()
  
  if (!nomeEmpresa || nomeEmpresa.length === 0) {
    throw new Error('Nome da empresa é obrigatório')
  }
  
  const empresaData: EmpresaData = {
    nomeEmpresa: nomeEmpresa,
    cnpj: dados.cnpj.replace(/\D/g, ''),
    setor: dados.setor && dados.setor.trim() ? dados.setor.trim() : null,
    email: dados.email && dados.email.trim() ? dados.email.trim() : null
  }
  
  const empresaCriada = await cadastrarEmpresa(empresaData)
  
  const { criarUsuario, atualizarUsuario } = await import('./AutenticacaoLogin')
  
  const usuarioDataInicial: UsuarioData = {
    nomeUsuario: dados.nomeAdministrador.trim(),
    tipoUsuario: 'ADMINISTRADOR EMP',
    nivelSenioridade: null,
    competencias: null
  }
  
  const usuarioCriado = await criarUsuario(usuarioDataInicial)
  
  const usuarioDataAtualizado: UsuarioData = {
    idEmpresa: empresaCriada.idEmpresa,
    nomeUsuario: dados.nomeAdministrador.trim(),
    tipoUsuario: 'ADMINISTRADOR EMP',
    nivelSenioridade: null,
    competencias: null
  }
  
  await atualizarUsuario(usuarioCriado.idUsuario, usuarioDataAtualizado)
  
  const { criarLogin } = await import('./AutenticacaoLogin')
  const loginData = {
    idUsuario: usuarioCriado.idUsuario,
    email: dados.email && dados.email.trim() ? dados.email.trim() : dados.nomeAdministrador.trim(),
    senha: dados.senha,
    tipoLogin: 'ADMINISTRADOR EMP'
  }
  
  await criarLogin(loginData)
  
  return empresaCriada
}

export async function cadastrarEmpresa(empresaData: EmpresaData): Promise<EmpresaResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/empresas`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empresaData),
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio.')
    }
    throw new Error(`Não foi possível conectar à API. URL: ${url.toString()}. Erro: ${errorMessage}`)
  }

  if (!res.ok) {
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
    const message = backendMessage || `Falha ao cadastrar empresa (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function editarEmpresa(idEmpresa: number, empresaData: EmpresaData): Promise<EmpresaResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/empresas/${idEmpresa}`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empresaData),
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio.')
    }
    throw new Error(`Não foi possível conectar à API. URL: ${url.toString()}. Erro: ${errorMessage}`)
  }

  if (!res.ok) {
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
    const message = backendMessage || `Falha ao editar empresa (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function excluirEmpresa(idEmpresa: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/empresas/${idEmpresa}`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio.')
    }
    throw new Error(`Não foi possível conectar à API. URL: ${url.toString()}. Erro: ${errorMessage}`)
  }

  if (!res.ok) {
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
    const message = backendMessage || `Falha ao excluir empresa (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}

export async function buscarEmpresaPorCNPJ(cnpj: string): Promise<EmpresaData> {
  const baseUrl = getBaseUrl()
  const cnpjLimpo = cnpj.replace(/\D/g, '')
  const urlString = `${baseUrl}/empresas/cnpj/${cnpjLimpo}`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio.')
    }
    throw new Error(`Não foi possível conectar à API. URL: ${url.toString()}. Erro: ${errorMessage}`)
  }

  if (!res.ok) {
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

    if (!backendMessage && res.status === 404) {
      backendMessage = 'Empresa não encontrada'
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao buscar empresa (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

