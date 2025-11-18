import { useState } from 'react'
import { ThemeProvider } from './Contexto/TemaContexto'
import { AuthProvider } from './Contexto/AutenticacaoContexto'
import Home from './Routes/Usuario/Home'
import Sobre from './Routes/Usuario/Sobre'
import Integrantes from './Routes/Usuario/Integrantes'
import FAQ from './Routes/Usuario/FAQ'
import Contato from './Routes/Usuario/Contato'
import Login from './Routes/Usuario/Login'
import Cadastro from './Routes/Usuario/Cadastro'
import HomeFree from './Routes/UsuarioFree/HomeFree'
import Trilhas from './Routes/UsuarioFree/Trilhas'
import LoginAdmin from './Routes/Admin/LoginAdmin'
import HomeAdmin from './Routes/Admin/HomeAdmin'
import GerenciarEmpresas from './Routes/Admin/GerenciarEmpresas'
import GerenciarAdministradores from './Routes/Admin/GerenciarAdministradores'
import LoginCorporativo from './Routes/Corporativo/LoginCorporativo'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('home')

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'sobre':
        return <Sobre onNavigate={setPaginaAtual} />
      case 'integrantes':
        return <Integrantes onNavigate={setPaginaAtual} />
      case 'faq':
        return <FAQ onNavigate={setPaginaAtual} />
      case 'contato':
        return <Contato onNavigate={setPaginaAtual} />
      case 'login':
        return <Login onNavigate={setPaginaAtual} />
      case 'cadastro':
        return <Cadastro onNavigate={setPaginaAtual} />
          case 'homeFree':
            return <HomeFree onNavigate={setPaginaAtual} />
          case 'trilhas':
            return <Trilhas onNavigate={setPaginaAtual} />
          case 'loginAdmin':
            return <LoginAdmin onNavigate={setPaginaAtual} />
          case 'homeAdmin':
            return <HomeAdmin onNavigate={setPaginaAtual} />
          case 'gerenciarEmpresas':
            return <GerenciarEmpresas onNavigate={setPaginaAtual} />
          case 'gerenciarAdministradores':
            return <GerenciarAdministradores onNavigate={setPaginaAtual} />
          case 'loginCorporativo':
            return <LoginCorporativo onNavigate={setPaginaAtual} />
      case 'home':
      default:
        return <Home onNavigate={setPaginaAtual} />
    }
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        {renderizarPagina()}
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
