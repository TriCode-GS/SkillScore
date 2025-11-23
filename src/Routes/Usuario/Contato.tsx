import { useNavigate } from 'react-router-dom'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import iconWhatsApp from '../../assets/img/RedesSociais/WhatsApp.png'

const Contato = () => {
  const navigate = useNavigate()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center px-4">
              Entre em Contato
            </h1>

            <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <div className="bg-indigo-50 dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Precisa de Ajuda?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
                  Consulte nossa página de FAQ para respostas rápidas às dúvidas mais comuns.
                </p>
                <Botao
                  variant="outline"
                  size="md"
                  onClick={() => handleNavigate('/faq')}
                  className="w-full bg-transparent"
                >
                  Ver FAQ
                </Botao>
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Informações de Contato
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      Empresa
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      TriCode
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      Localização
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      São Paulo, Brasil
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      Horário de Atendimento
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      Segunda a Sexta<br />
                      08h às 18h
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      E-mail
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      Você também pode entrar em contato conosco pelo e-mail:{' '}
                      <a
                        href="mailto:suporte.tricode@gmail.com"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline"
                      >
                        suporte.tricode@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-center px-4">
              Ainda tem alguma dúvida ou sugestão? Estamos aqui para ajudar!
            </p>

            <div className="flex justify-center mb-8 sm:mb-12 px-4">
              <a
                href="https://www.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 transition-colors shadow-md hover:shadow-lg"
              >
                <img
                  src={iconWhatsApp}
                  alt="WhatsApp"
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
                <span className="text-sm sm:text-base">Entre em Contato</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  )
}

export default Contato

