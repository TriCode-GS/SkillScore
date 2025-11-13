import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'

interface SobreProps {
  onNavigate?: (pagina: string) => void
}

const Sobre = ({ onNavigate }: SobreProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} />
      <main className="flex-grow bg-white dark:bg-gray-900">
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
              Sobre o SkillScore
            </h1>
            <div className="prose prose-lg max-w-none px-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                O trabalho tem exigido das pessoas e organizações uma adaptação constante às novas tecnologias. 
                O desenvolvimento contínuo de competências técnicas e socioemocionais tornou-se indispensável, 
                tanto para manter a empregabilidade quanto para promover crescimento nas empresas.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                A startup <strong className="text-indigo-600 dark:text-indigo-400">TriCode</strong> desenvolveu o <strong className="text-indigo-600 dark:text-indigo-400">SkillScore</strong>, 
                uma plataforma digital de trilhas de desenvolvimento profissional gamificado, que transforma o processo 
                de capacitação em uma jornada progressiva e motivadora.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                A solução utiliza mecânicas inspiradas em jogos como o "Score Hero", onde o usuário avança por fases, 
                desbloqueia novas etapas e visualiza seu progresso de forma contínua.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Rodape onNavigate={onNavigate} />
    </div>
  )
}

export default Sobre

