import { getBaseUrl } from './AutenticacaoLogin'

export interface TrilhaData {
  idTrilha?: number
  nomeTrilha: string
  status: string | null
  dataCriacao?: string
}

export interface TrilhaResponse {
  idTrilha: number
  nomeTrilha: string
  status: string
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
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

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao excluir trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}

