import Cabecalho from '../Components/Cabecalho/Cabecalho'
import Rodape from '../Components/Rodape/Rodape'
import { useTheme } from '../Contexto/TemaContexto'
import fotoLucas from '../assets/img/Integrantes/LucasSilvaGastãoPinheiro.jpg'
import fotoGeovanne from '../assets/img/Integrantes/GeovanneConeglianPassos.png'
import fotoGuilherme from '../assets/img/Integrantes/GuilhermeSoaresdeAlmeida.jpg'
import iconGithubBlack from '../assets/img/RedesSociais/GithubBlack.png'
import iconGithubWhite from '../assets/img/RedesSociais/GithubWhite.png'
import iconLinkedin from '../assets/img/RedesSociais/linkedin.png'

interface IntegrantesProps {
  onNavigate?: (pagina: string) => void
}

interface Integrante {
  nome: string
  foto: string
  rm: string
  turma: string
  github: string
  linkedin: string
}

const integrantes: Integrante[] = [
  {
    nome: 'Lucas Silva Gastão Pinheiro',
    foto: fotoLucas,
    rm: '563960',
    turma: '1TDSPY',
    github: 'https://github.com/Lucasgastaop',
    linkedin: 'https://www.linkedin.com/in/lucas-pinheiro-1a7154291/'
  },
  {
    nome: 'Geovanne Coneglian Passos',
    foto: fotoGeovanne,
    rm: '562673',
    turma: '1TDSPY',
    github: 'https://github.com/GeovanneCP',
    linkedin: 'https://www.linkedin.com/in/geovanne-coneglian-775472353/'
  },
  {
    nome: 'Guilherme Soares de Almeida',
    foto: fotoGuilherme,
    rm: '563143',
    turma: '1TDSPY',
    github: 'https://github.com/GuuiSOares',
    linkedin: 'https://www.linkedin.com/in/guilherme-soares-de-almeida/'
  }
]

const Integrantes = ({ onNavigate }: IntegrantesProps) => {
  const { theme } = useTheme()
  
  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} />
      <main className="flex-grow bg-white dark:bg-gray-900">
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center px-4">
              Integrantes
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {integrantes.map((integrante, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                      {integrante.foto ? (
                        <img 
                          src={integrante.foto} 
                          alt={integrante.nome}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                          {integrante.nome.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 px-2">
                      {integrante.nome}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-1">
                      <span className="font-semibold">RM:</span> {integrante.rm}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                      <span className="font-semibold">Turma:</span> {integrante.turma}
                    </p>
                    <div className="flex gap-4">
                      <a 
                        href={integrante.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <img 
                          src={theme === 'dark' ? iconGithubWhite : iconGithubBlack} 
                          alt="GitHub" 
                          className="w-6 h-6"
                        />
                      </a>
                      <a 
                        href={integrante.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <img 
                          src={iconLinkedin} 
                          alt="LinkedIn" 
                          className="w-6 h-6"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Rodape onNavigate={onNavigate} />
    </div>
  )
}

export default Integrantes
