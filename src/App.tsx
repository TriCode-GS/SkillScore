import { useState } from 'react'
import { ThemeProvider } from './Contexto/TemaContexto'
import Home from './Routes/Usuario/Home'
import Sobre from './Routes/Usuario/Sobre'
import Integrantes from './Routes/Usuario/Integrantes'
import FAQ from './Routes/Usuario/FAQ'
import Contato from './Routes/Usuario/Contato'
import Login from './Routes/Usuario/Login'
import LoginAdmin from './Routes/Admin/LoginAdmin'
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
      case 'loginAdmin':
        return <LoginAdmin onNavigate={setPaginaAtual} />
      case 'loginCorporativo':
        return <LoginCorporativo onNavigate={setPaginaAtual} />
      case 'home':
      default:
        return <Home onNavigate={setPaginaAtual} />
    }
  }

  return (
    <ThemeProvider>
      {renderizarPagina()}
    </ThemeProvider>
  )
}

export default App
