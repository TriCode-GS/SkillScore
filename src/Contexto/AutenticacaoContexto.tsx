import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TipoUsuario } from '../Types/AutenticacaoLogin'

interface User {
  id?: string
  idUsuario?: number
  nome?: string
  nomeUsuario?: string
  email?: string
  tipoUsuario?: TipoUsuario | string
  isAdmin?: boolean
}

interface AutenticacaoContextoType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

const AutenticacaoContexto = createContext<AutenticacaoContextoType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AutenticacaoContexto)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = (userData: User) => {
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AutenticacaoContexto.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AutenticacaoContexto.Provider>
  )
}

