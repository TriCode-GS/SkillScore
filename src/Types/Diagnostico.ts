export interface DiagnosticoUsuario {
  idDiagnostico?: number
  idUsuario: number
  idTrilha?: number
  pontuacaoAdmin?: number
  pontuacaoTech?: number
  pontuacaoRh?: number
  dataCriacao?: string
}

export interface DiagnosticoUsuarioResponse extends DiagnosticoUsuario {
  idDiagnostico: number
  idUsuario: number
  idTrilha?: number
}

export interface ApiErrorResponse {
  message?: string
  error?: string
  detalhe?: string
  erro?: string
  campo?: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}

export type BackendErrorResponse = ApiErrorResponse | string

