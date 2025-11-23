import { getBaseUrl } from './AutenticacaoLogin'
import type { CursoResponse } from './Curso'
import type { ApiErrorResponse } from './Diagnostico'

export type StatusFase = 'NAO INICIADA' | 'NAO INICIADO' | 'EM ANDAMENTO' | 'CONCLUIDA' | 'CONCLUÍDA' | 'CONCLUIDO'

export interface UsuarioTrilhaCursoResponse {
  idUsuarioTrilhaCurso?: number
  idUsuario: number
  idTrilhaCurso: number
  statusFase?: StatusFase | string
  dataConclusao?: string | null
}

export interface TrilhaCursoData {
  idTrilha: number
  idCurso: number
  ordemFase: number
}

export interface TrilhaCursoCadastroData {
  idTrilha: number
  idCurso: number
  ordemFase: number
  statusFase: string
  dataConclusao: null
}

export interface TrilhaCursoResponse {
  idTrilhaCurso: number
  idTrilha: number
  idCurso: number
  ordemFase: number
  statusFase?: StatusFase | string
  dataConclusao?: string | null
}

export interface CursoComStatus extends CursoResponse {
  idTrilhaCurso?: number
  ordemFase: number
  statusFase?: StatusFase | string
  dataConclusao?: string | null
}

async function buscarStatusUsuarioTrilhaCursos(idUsuario: number): Promise<Map<number, { statusFase?: string; dataConclusao?: string | null }>> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuario-trilha-cursos/usuario/${idUsuario}`
  
  const statusMap = new Map<number, { statusFase?: string; dataConclusao?: string | null }>()
  
  try {
    const url = new URL(urlString)
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    })

    if (res.ok) {
      const usuarioTrilhaCursos = await res.json() as UsuarioTrilhaCursoResponse[]
      if (Array.isArray(usuarioTrilhaCursos)) {
        usuarioTrilhaCursos.forEach((utc: UsuarioTrilhaCursoResponse) => {
          if (utc.idTrilhaCurso) {
            statusMap.set(utc.idTrilhaCurso, {
              statusFase: utc.statusFase,
              dataConclusao: utc.dataConclusao
            })
          }
        })
      }
    }
  } catch (error) {
  }

  return statusMap
}

export async function listarCursosPorTrilha(idTrilha: number, idUsuario?: number): Promise<CursoComStatus[]> {
  const baseUrl = getBaseUrl()
  
  if (idUsuario) {
    const urlStringComUsuario = `${baseUrl}/trilha-cursos/trilha/${idTrilha}/usuario/${idUsuario}`
    
    try {
      const url = new URL(urlStringComUsuario)
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      })

      if (res.ok) {
        const cursos = await res.json()
        return cursos
      }
    } catch (error) {
    }
  }
  
  const urlString = `${baseUrl}/trilha-cursos/trilha/${idTrilha}`
  
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
    const message = backendMessage || `Falha ao listar cursos da trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  let cursos: CursoComStatus[] = await res.json()
  
  if (idUsuario && cursos.length > 0) {
    const statusMap = await buscarStatusUsuarioTrilhaCursos(idUsuario)
    
    cursos = cursos.map(curso => {
      if (curso.idTrilhaCurso && statusMap.has(curso.idTrilhaCurso)) {
        const status = statusMap.get(curso.idTrilhaCurso)!
        return {
          ...curso,
          statusFase: status.statusFase || curso.statusFase,
          dataConclusao: status.dataConclusao !== undefined ? status.dataConclusao : curso.dataConclusao
        }
      }
      return curso
    })
  }

  return cursos
}

export async function associarCursoATrilha(trilhaCursoData: TrilhaCursoData): Promise<TrilhaCursoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas/${trilhaCursoData.idTrilha}/cursos`
  
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
      body: JSON.stringify({
        idCurso: trilhaCursoData.idCurso,
        ordemFase: trilhaCursoData.ordemFase
      }),
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
    const message = backendMessage || `Falha ao associar curso à trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function removerCursoDaTrilha(idTrilha: number, idCurso: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas/${idTrilha}/cursos/${idCurso}`
  
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
    const message = backendMessage || `Falha ao remover curso da trilha (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}

export async function atualizarOrdemFase(idTrilha: number, idCurso: number, novaOrdemFase: number): Promise<TrilhaCursoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilhas/${idTrilha}/cursos/${idCurso}`
  
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
      body: JSON.stringify({
        ordemFase: novaOrdemFase
      }),
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
    const message = backendMessage || `Falha ao atualizar ordem da fase (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

async function criarUsuarioTrilhaCursoSeNaoExistir(idTrilhaCurso: number, idUsuario: number, statusFase: string): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuario-trilha-cursos`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  const requestBody = {
    idUsuario: idUsuario,
    idTrilhaCurso: idTrilhaCurso,
    statusFase: statusFase,
    dataConclusao: null
  }

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(requestBody),
    })

    if (res.ok || res.status === 409) {
      return
    }

    if (res.status === 400) {
      return
    }
  } catch (error) {
  }
}

async function vincularTrilhaAoUsuario(idUsuario: number, idTrilha: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuarios/${idUsuario}/trilha`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    return
  }

  try {
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

export async function atualizarStatusFase(idTrilhaCurso: number, idUsuario: number, statusFase: string, idTrilha?: number): Promise<TrilhaCursoResponse> {
  const baseUrl = getBaseUrl()
  
  if (idTrilha) {
    await vincularTrilhaAoUsuario(idUsuario, idTrilha)
  }
  
  const urlString = `${baseUrl}/usuario-trilha-cursos/usuario/${idUsuario}/trilha-curso/${idTrilhaCurso}/status-fase`
  
  let url: URL
  try {
    url = new URL(urlString)
  } catch (error) {
    throw new Error(`URL inválida: ${urlString}`)
  }

  let res: Response

  try {
    const requestBody = {
      statusFase: statusFase
    }
    
    res = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(requestBody),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    if (errorMessage.includes('Failed to fetch')) {
      throw new Error(`Não foi possível conectar à API. Verifique se o servidor está online. URL: ${url.toString()}`)
    }
    throw new Error(`Não foi possível conectar à API. Detalhes: ${errorMessage}. URL: ${url.toString()}`)
  }

  if (res.status === 404) {
    try {
      await criarUsuarioTrilhaCursoSeNaoExistir(idTrilhaCurso, idUsuario, statusFase)
      
      res = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ statusFase: statusFase }),
      })
    } catch (error) {
    }
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
    const message = backendMessage || `Falha ao atualizar status da fase (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function cadastrarTrilhaCurso(trilhaCursoData: { idTrilha: number; idCurso: number; ordemFase: number; statusFase: string; dataConclusao: null }): Promise<TrilhaCursoResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/trilha-cursos`
  
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
      body: JSON.stringify({
        idTrilha: trilhaCursoData.idTrilha,
        idCurso: trilhaCursoData.idCurso,
        ordemFase: trilhaCursoData.ordemFase,
        statusFase: trilhaCursoData.statusFase,
        dataConclusao: trilhaCursoData.dataConclusao
      }),
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
    const message = backendMessage || `Falha ao cadastrar trilha-curso (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}
