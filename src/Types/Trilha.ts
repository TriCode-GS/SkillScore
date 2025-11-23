import { getBaseUrl } from './AutenticacaoLogin'
import type { ApiErrorResponse } from './Diagnostico'

export interface TrilhaData {
  idTrilha?: number
  nomeTrilha: string
  numFases?: number | null
  dataCriacao?: string
}

export interface TrilhaResponse {
  idTrilha: number
  nomeTrilha: string
  numFases: number
  dataCriacao?: string
}

export async function listarTrilhas(): Promise<TrilhaResponse[]> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas`
  
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
    throw new Error(`Não foi possível conectar à API. Detalhes: ${errorMessage}`)
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
    const message = backendMessage || `Falha ao listar trilhas (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function cadastrarTrilha(trilhaData: TrilhaData): Promise<TrilhaResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  // Garantir que dataCriacao seja a data atual se não fornecida
  // Usar timezone local para evitar problemas de fuso horário
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  const dataAtual = `${ano}-${mes}-${dia}` // Formato YYYY-MM-DD
  
  // SEMPRE garantir que numFases seja 5 se não fornecido, null, undefined ou 0
  let numFases: number = 5 // Valor padrão SEMPRE 5
  if (trilhaData.numFases !== undefined && 
      trilhaData.numFases !== null && 
      typeof trilhaData.numFases === 'number' && 
      !isNaN(trilhaData.numFases) &&
      trilhaData.numFases > 0) {
    numFases = trilhaData.numFases
  }
  
  // Criar objeto garantindo que numFases seja SEMPRE um número válido (5)
  // Garantir que numFases seja um número inteiro válido
  const numFasesFinal = Number.isInteger(numFases) && numFases > 0 ? numFases : 5
  
  const trilhaDataComData = {
    nomeTrilha: trilhaData.nomeTrilha,
    numFases: numFasesFinal, // SEMPRE será 5 ou um número válido > 0 (camelCase para o backend)
    dataCriacao: trilhaData.dataCriacao || dataAtual
  }
  
  if (trilhaDataComData.numFases === null || trilhaDataComData.numFases === undefined) {
    trilhaDataComData.numFases = 5
  }

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(trilhaDataComData),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    throw new Error(`Não foi possível conectar à API. Detalhes: ${errorMessage}`)
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
    const message = backendMessage || `Falha ao cadastrar trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function editarTrilha(idTrilha: number, trilhaData: TrilhaData): Promise<TrilhaResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas/${idTrilha}`
  
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
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(trilhaData),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    throw new Error(`Não foi possível conectar à API. Detalhes: ${errorMessage}`)
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
    const message = backendMessage || `Falha ao editar trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function excluirTrilha(idTrilha: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas/${idTrilha}`
  
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
    throw new Error(`Não foi possível conectar à API. Detalhes: ${errorMessage}`)
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
    const message = backendMessage || `Falha ao excluir trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}

