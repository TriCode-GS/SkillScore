import Cabecalho from '../Components/Cabecalho/Cabecalho'
import Rodape from '../Components/Rodape/Rodape'
import Botao from '../Components/Botao/Botao'

interface HomeProps {
  onNavigate?: (pagina: string) => void
}

const Home = ({ onNavigate }: HomeProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100">
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              SkillScore
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 px-4">
              Transforme seu desenvolvimento profissional em uma jornada gamificada e progressiva
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Botao variant="primary" size="md">
                Começar Agora
              </Botao>
              <Botao variant="secondary" size="md">
                Saiba Mais
              </Botao>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center px-4">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center">
                  Trilhas de Desenvolvimento
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Cada trilha é composta por cinco módulos de capacitação e três avaliações socioemocionais
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center">
                  Gamificação
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Avance por fases, desbloqueie novas etapas e visualize seu progresso de forma contínua
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center">
                  Feedback Estruturado
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Receba avaliações socioemocionais com feedback estruturado para sua evolução
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center px-4">
              Modelos de Operação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="border-2 border-indigo-200 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-4">
                    <span className="text-base sm:text-xl font-bold text-white">B2C</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Plano Individual (FREE)
                  </h3>
                </div>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Acesso gratuito a até três trilhas de desenvolvimento</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Acompanhamento do progresso básico de conclusão</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Suporte</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-yellow-600 rounded-lg p-6 sm:p-8 hover:shadow-xl transition-shadow bg-white relative">
                <div className="absolute top-2 right-4 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">
                  RECOMENDADO
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-4">
                    <span className="text-base sm:text-xl font-bold text-white">B2C</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Plano Individual (PRO)
                  </h3>
                </div>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-700 mr-2">✓</span>
                    <span>Trilhas de desenvolvimento ilimitadas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-700 mr-2">✓</span>
                    <span>Gráficos personalizados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-700 mr-2">✓</span>
                    <span>Acompanhamento completo do progresso</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-700 mr-2">✓</span>
                    <span>Avaliações socioemocionais completas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-700 mr-2">✓</span>
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-indigo-200 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                  <div className="w-14 h-10 sm:w-16 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-4">
                    <span className="text-base sm:text-xl font-bold text-white">B2B</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Plano Corporativo (Contrato)
                  </h3>
                </div>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Trilhas ilimitadas para diversas áreas do merdado de trabalho</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Painel gerencial com indicadores de engajamento</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Acompanhamento de progresso de competências comportamentais</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Gestão de colaboradores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Painel para acompanhamento de progresso de funcionários</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Gráficos personalizados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">✓</span>
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 px-4">
              Por que escolher o SkillScore?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-12 px-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Melhores Cursos</h3>
                <p className="text-sm sm:text-base text-indigo-100">
                  Selecionamos os melhores cursos disponíveis no mercado atual
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Experiência Gamificada</h3>
                <p className="text-sm sm:text-base text-indigo-100">
                  Aprendizado transformado em uma jornada motivadora e progressiva
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Dashboard Analítico</h3>
                <p className="text-sm sm:text-base text-indigo-100">
                  Acompanhe métricas e indicadores de desenvolvimento
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-white">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Comece sua jornada de desenvolvimento hoje
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Transforme o aprendizado em uma experiência gamificada e mensurável
            </p>
            <Botao variant="primary" size="lg">
              Criar Conta Gratuita
            </Botao>
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  )
}

export default Home