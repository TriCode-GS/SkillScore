import { useState } from 'react'
import Home from './Routes/Home'
import Sobre from './Routes/Sobre'

function App() {
 const [paginaAtual, setPaginaAtual] = useState('home')

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'sobre':
        return <Sobre onNavigate={setPaginaAtual} />
      case 'home':
      default:
        return <Home onNavigate={setPaginaAtual} />
    }
  }

    return renderizarPagina()
}
export default App