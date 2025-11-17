export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  const baseUrl = envUrl || 'https://skillscore-java.onrender.com'
  const cleanedUrl = baseUrl.trim().replace(/\/$/, '')
  return cleanedUrl
}

export type UsuarioData = {
  idEmpresa?: number | null
  nomeUsuario: string
  tipoUsuario: string
  areaAtuacao?: string | null
  nivelSenioridade?: string | null
  competencias?: string | null
}

export type LoginData = {
  idUsuario: number
  email: string
  senha: string
  tipoLogin: string
}

export type LoginUpdateData = {
  idUsuario?: number
  email?: string
  senha?: string
  tipoLogin?: string
}

export type CadastroCredentials = {
  nome_usuario: string
  email: string
  senha: string
  tipo_usuario: string
  tipo_login: string
  id_empresa: number | null
  area_atuacao: string | null
  competencias: string | null
  nivel_senioridade: string | null
}

export type CadastroResponse = unknown

export type LoginCredentials = {
  email: string
  senha: string
}

export type LoginResponse = unknown

export type UsuarioResponse = {
  idUsuario: number
  idEmpresa: number | null
  nomeUsuario: string
  tipoUsuario: string
  areaAtuacao: string | null
  nivelSenioridade: string | null
  competencias: string | null
}

export async function criarUsuario(usuarioData: UsuarioData): Promise<{ id_usuario: number }> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuarios`
  
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
      body: JSON.stringify(usuarioData),
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio. Verifique a configuração do backend.')
    }
    throw new Error(`Não foi possível conectar à API. URL: ${url.toString()}. Erro: ${errorMessage}`)
  }

  if (!res.ok) {
    let backendMessage: string | undefined

    try {
      const responseClone = res.clone()
      const contentType = res.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const data = await responseClone.json() as unknown
        if (typeof data === 'string') {
          backendMessage = data
        } else if (data && typeof data === 'object') {
          const anyData = data as { 
            message?: string
            error?: string
            detalhe?: string
            mensagem?: string
            erro?: string
            campo?: string
          }
          backendMessage = anyData.message || anyData.mensagem || anyData.error || anyData.erro || anyData.detalhe
        }
      } else {
        const text = await responseClone.text()
        if (text && text.trim().length > 0) {
          backendMessage = text.trim()
        }
      }
    } catch (error) {
      try {
        const text = await res.text()
        if (text && text.trim().length > 0) {
          backendMessage = text.trim()
        }
      } catch (_) {}
    }

    if (!backendMessage && res.status === 400) {
      backendMessage = 'Dados inválidos para criação do usuário'
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao criar usuário (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  const response = await res.json() as UsuarioData & { idUsuario?: number }
  return {
    id_usuario: response.idUsuario || 0
  }
}

export async function criarLogin(loginData: LoginData): Promise<CadastroResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/logins`
  
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
      body: JSON.stringify(loginData),
      mode: 'cors',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
      throw new Error('Erro de CORS: O servidor não está configurado corretamente para aceitar requisições deste domínio. Verifique a configuração do backend.')
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    if (!backendMessage && res.status === 400) {
      backendMessage = 'Dados inválidos para criação do login'
    }

    if (!backendMessage && res.status === 409) {
      backendMessage = 'Login já cadastrado'
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao criar login (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function cadastrarUsuario(credentials: CadastroCredentials): Promise<CadastroResponse> {
  if (!credentials.nome_usuario || credentials.nome_usuario.trim() === '') {
    throw new Error('Nome do usuário é obrigatório')
  }
  
  if (!credentials.tipo_usuario || credentials.tipo_usuario.trim() === '') {
    throw new Error('Tipo de usuário é obrigatório')
  }
  
  if (!credentials.tipo_login || credentials.tipo_login.trim() === '') {
    throw new Error('Tipo de login é obrigatório')
  }
  
  const usuarioData: UsuarioData = {
    idEmpresa: credentials.id_empresa,
    nomeUsuario: credentials.nome_usuario.trim(),
    tipoUsuario: credentials.tipo_usuario.trim(),
    areaAtuacao: credentials.area_atuacao,
    nivelSenioridade: credentials.nivel_senioridade,
    competencias: credentials.competencias
  }

  const usuarioCriado = await criarUsuario(usuarioData)

  const loginData: LoginData = {
    idUsuario: usuarioCriado.id_usuario,
    email: credentials.email.trim(),
    senha: credentials.senha,
    tipoLogin: credentials.tipo_login.trim()
  }

  return await criarLogin(loginData)
}

export async function autenticarLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  const baseUrl = getBaseUrl()
  let url: URL
  
  try {
    url = new URL(`${baseUrl}/logins/autenticar`)
  } catch (error) {
    throw new Error(`URL inválida: ${baseUrl}/logins/autenticar`)
  }

  url.searchParams.set('email', credentials.email)
  url.searchParams.set('senha', credentials.senha)

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    throw new Error(`Não foi possível conectar à API (rede/CORS/servidor inativo). Detalhes: ${errorMessage}`)
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

    if (!backendMessage && res.status === 401) {
      backendMessage = 'Credenciais inválidas'
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha na autenticação (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function autenticarUsuario(credentials: LoginCredentials): Promise<LoginResponse> {
  const baseUrl = getBaseUrl()
  let url: URL
  
  try {
    url = new URL(`${baseUrl}/logins/autenticar/usuario`)
  } catch (error) {
    throw new Error(`URL inválida: ${baseUrl}/logins/autenticar/usuario`)
  }

  url.searchParams.set('email', credentials.email)
  url.searchParams.set('senha', credentials.senha)

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    throw new Error(`Não foi possível conectar à API (rede/CORS/servidor inativo). Detalhes: ${errorMessage}`)
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

    if (!backendMessage && res.status === 401) {
      backendMessage = 'Credenciais inválidas'
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha na autenticação (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function autenticarAdministrador(credentials: LoginCredentials): Promise<LoginResponse> {
  const baseUrl = getBaseUrl()
  let url: URL
  
  try {
    url = new URL(`${baseUrl}/logins/autenticar/administrador`)
  } catch (error) {
    throw new Error(`URL inválida: ${baseUrl}/logins/autenticar/administrador`)
  }

  url.searchParams.set('email', credentials.email)
  url.searchParams.set('senha', credentials.senha)

  let res: Response

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    throw new Error(`Não foi possível conectar à API (rede/CORS/servidor inativo). Detalhes: ${errorMessage}`)
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

    if (!backendMessage && res.status === 401) {
      backendMessage = 'Credenciais inválidas'
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha na autenticação (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json()
}

export async function atualizarUsuario(idUsuario: number, usuarioData: UsuarioData): Promise<UsuarioResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuarios/${idUsuario}`
  
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
      body: JSON.stringify(usuarioData),
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao atualizar usuário (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json() as Promise<UsuarioResponse>
}

export async function atualizarLogin(idLogin: number, loginData: LoginUpdateData): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/logins/${idLogin}`
  
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
      body: JSON.stringify(loginData),
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao atualizar login (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}

export async function buscarUsuarioPorId(idUsuario: number): Promise<UsuarioResponse> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuarios`
  
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao buscar usuário (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  const usuarios = await res.json() as UsuarioResponse[]
  const usuario = usuarios.find(u => u.idUsuario === idUsuario)
  
  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  return usuario
}

export async function listarUsuarios(): Promise<UsuarioResponse[]> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuarios`
  
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao listar usuários (status ${res.status} ${statusText})`

    throw new Error(message)
  }

  return res.json() as Promise<UsuarioResponse[]>
}

export async function excluirUsuario(idUsuario: number): Promise<void> {
  const baseUrl = getBaseUrl()
  const urlString = `${baseUrl}/usuarios/${idUsuario}`
  
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
          const anyData = data as { message?: string; error?: string; detalhe?: string }
          backendMessage = anyData.message || anyData.error || anyData.detalhe
        }
      } catch (_) {}
    }

    const statusText = res.statusText || 'Erro'
    const message = backendMessage || `Falha ao excluir usuário (status ${res.status} ${statusText})`

    throw new Error(message)
  }
}
