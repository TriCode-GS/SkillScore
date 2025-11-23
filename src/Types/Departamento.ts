import { getBaseUrl } from './AutenticacaoLogin'
import type { ApiErrorResponse } from './Diagnostico'

export type DepartamentoData = {
  idDepartamento?: number
  idEmpresa: number
  nomeDepartamento: string
  descricao?: string | null
  dataCriacao?: string
}

export interface DepartamentoResponse {
  idDepartamento?: number
  idEmpresa?: number
  nomeDepartamento?: string
  descricao?: string | null
  dataCriacao?: string
}

export async function listarDepartamentos(idEmpresa: number): Promise<DepartamentoResponse[]> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/departamentos/empresa/${idEmpresa}`
  
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
    const message = backendMessage || `Falha ao listar departamentos (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function cadastrarDepartamento(departamentoData: DepartamentoData): Promise<DepartamentoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/departamentos`
  
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
      body: JSON.stringify(departamentoData),
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
    const message = backendMessage || `Falha ao cadastrar departamento (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function editarDepartamento(idDepartamento: number, departamentoData: DepartamentoData): Promise<DepartamentoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/departamentos/${idDepartamento}`
  
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
      body: JSON.stringify(departamentoData),
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
    const message = backendMessage || `Falha ao editar departamento (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function excluirDepartamento(idDepartamento: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/departamentos/${idDepartamento}`
  
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

    let message = backendMessage || `Falha ao excluir departamento (status ${res.status} ${res.statusText || 'Erro'})`
    
    if (backendMessage && (backendMessage.includes('Existem usuários vinculados') || backendMessage.includes('usuários vinculados a este departamento'))) {
      message = 'Não é possível deletar o departamento pois existe um gestor vinculado.'
    }
    
    throw new Error(message)
  }
}

