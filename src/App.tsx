import { Routes, Route, Navigate } from 'react-router-dom'
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
import HomeAdministradorEmpresa from './Routes/Corporativo/AdministradorEmpresa/HomeAdministradorEmpresa'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/integrantes" element={<Integrantes />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login-corporativo" element={<LoginCorporativo />} />
          <Route path="/home-free" element={<HomeFree />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/trilhas/:id" element={<Trilhas />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/home" element={<HomeAdmin />} />
          <Route path="/admin/empresas" element={<GerenciarEmpresas />} />
          <Route path="/admin/empresas/:id" element={<GerenciarEmpresas />} />
          <Route path="/admin/administradores" element={<GerenciarAdministradores />} />
          <Route path="/admin/administradores/:id" element={<GerenciarAdministradores />} />
          <Route path="/admin-emp/home" element={<HomeAdministradorEmpresa />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
