import { getBaseUrl } from './AutenticacaoLogin'

export interface CursoData {
  idCurso?: number
  titulo: string
  descricao: string
  linkCurso: string
  areaRelacionada: string
  nivelRecomendado: string
  duracaoHoras: string
}

export interface CursoResponse {
  idCurso: number
  titulo: string
  descricao: string
  linkCurso: string
  areaRelacionada: string
  nivelRecomendado: string
  duracaoHoras: string
}

export async function listarCursos(): Promise<CursoResponse[]> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/cursos`
  
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
    const message = backendMessage || `Falha ao listar cursos (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function cadastrarCurso(cursoData: CursoData): Promise<CursoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/cursos`
  
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
      body: JSON.stringify(cursoData),
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
    const message = backendMessage || `Falha ao cadastrar curso (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function editarCurso(idCurso: number, cursoData: CursoData): Promise<CursoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/cursos/${idCurso}`
  
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
      body: JSON.stringify(cursoData),
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
    const message = backendMessage || `Falha ao editar curso (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function excluirCurso(idCurso: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/cursos/${idCurso}`
  
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
    const message = backendMessage || `Falha ao excluir curso (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}

