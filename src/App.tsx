import { useState } from 'react'
import Home from './Routes/Home'

function App() {
 const [paginaAtual, setPaginaAtual] = useState('home')

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'home':
      default:
        return <Home onNavigate={setPaginaAtual} />
    }
  }

    return renderizarPagina()
}
export default App