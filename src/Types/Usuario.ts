export type TipoUsuario = 'USUARIO' | 'FUNCIONARIO' | 'ADMIN' | 'GESTOR' | 'ADMINISTRADOR EMP' | 'ADMINISTRADOR_EMPRESA'

export type TipoLogin = 'USUARIO' | 'FUNCIONARIO' | 'ADMIN' | 'GESTOR' | 'ADMINISTRADOR EMP' | 'ADMINISTRADOR_EMPRESA'

export type StatusFase = 'NAO INICIADA' | 'NAO INICIADO' | 'EM ANDAMENTO' | 'CONCLUIDA' | 'CONCLUÍDA' | 'CONCLUIDO'

export interface UserBase {
  id?: string
  idUsuario?: number
  nome?: string
  nomeUsuario?: string
  email?: string
  tipoUsuario?: TipoUsuario
  isAdmin?: boolean
}

export type UserComum = UserBase & {
  tipoUsuario: 'USUARIO'
  isAdmin?: false
}

export type UserFuncionario = UserBase & {
  tipoUsuario: 'FUNCIONARIO'
  isAdmin?: false
}

export type UserAdmin = UserBase & {
  tipoUsuario: 'ADMIN'
  isAdmin: true
}

export type User = UserComum | UserFuncionario | UserAdmin | UserBase


