import { useState } from 'react'
import { ThemeProvider } from './Contexto/TemaContexto'
import Home from './Routes/Home'
import Sobre from './Routes/Sobre'
import Integrantes from './Routes/Integrantes'
import FAQ from './Routes/FAQ'
import Contato from './Routes/Contato'
import Login from './Routes/Login'

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
