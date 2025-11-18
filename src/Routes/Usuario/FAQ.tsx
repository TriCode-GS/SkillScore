import { useState, useEffect } from 'react'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'

interface FAQProps {
  onNavigate?: (pagina: string) => void
}

interface PerguntaResposta {
  pergunta: string
  resposta: string
}

const faqs: PerguntaResposta[] = [
  {
    pergunta: 'O que é o SkillScore?',
    resposta: 'O SkillScore é uma plataforma digital de trilhas de desenvolvimento profissional gamificado desenvolvida pela startup TriCode. Transformamos o processo de capacitação em uma jornada progressiva e motivadora, utilizando mecânicas inspiradas em jogos.'
  },
  {
    pergunta: 'Como funciona o SkillScore?',
    resposta: 'Cada trilha é composta por cinco módulos de capacitação e três avaliações socioemocionais. O usuário avança por fases, desbloqueia novas etapas e visualiza seu progresso de forma contínua, tornando o aprendizado uma experiência gamificada.'
  },
  {
    pergunta: 'Quais são os planos disponíveis?',
    resposta: 'Oferecemos dois modelos de operação: B2C (plano individual) com acesso gratuito a até três trilhas e opção de plano Pro com trilhas ilimitadas, e B2B (plano corporativo) com trilhas personalizadas e painel gerencial para empresas.'
  },
  {
    pergunta: 'O SkillScore é gratuito?',
    resposta: 'Sim! Oferecemos acesso gratuito a até três trilhas de desenvolvimento no plano individual. Para acesso ilimitado e recursos adicionais, disponibilizamos o plano Pro com assinatura mensal.'
  },
  {
    pergunta: 'Como posso acompanhar meu progresso?',
    resposta: 'O SkillScore oferece acompanhamento visual do progresso de conclusão. No plano Pro, você também tem acesso a gráficos personalizados para análise detalhada do seu desenvolvimento.'
  },
  {
    pergunta: 'O SkillScore oferece certificados?',
    resposta: 'Sim, ao completar cada trilha de desenvolvimento, você recebe certificados que comprovam suas competências desenvolvidas e podem ser utilizados para enriquecer seu currículo profissional.'
  },
  {
    pergunta: 'Como funciona o plano corporativo?',
    resposta: 'O plano B2B permite que empresas contratem a plataforma para disponibilizar trilhas corporativas personalizadas aos colaboradores. Inclui painel gerencial com indicadores de engajamento, acompanhamento de competências comportamentais e gestão de colaboradores.'
  },
  {
    pergunta: 'Quais tipos de competências são desenvolvidas?',
    resposta: 'O SkillScore trabalha tanto com competências técnicas quanto socioemocionais, essenciais para o mercado de trabalho atual. As trilhas são desenvolvidas com base nas melhores práticas e cursos disponíveis no mercado.'
  }
]

const FAQ = ({ onNavigate }: FAQProps) => {
  const [botaoClicado, setBotaoClicado] = useState<'sim' | 'nao' | null>(null)
  const [mostrarMensagem, setMostrarMensagem] = useState(false)

  const handleSim = () => {
    setBotaoClicado('sim')
    setMostrarMensagem(true)
  }

  useEffect(() => {
    if (mostrarMensagem) {
      const timer = setTimeout(() => {
        setMostrarMensagem(false)
        setBotaoClicado(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [mostrarMensagem])

  const handleNao = () => {
    setBotaoClicado('nao')
    onNavigate?.('contato')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho onNavigate={onNavigate} />
      <main className="flex-grow bg-white dark:bg-gray-900">
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center px-4">
              Perguntas Frequentes
            </h1>
            <div className="space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 sm:mb-3">
                    {faq.pergunta}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.resposta}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 sm:mt-12 bg-indigo-50 dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Ainda tem dúvidas?
              </h2>
              {mostrarMensagem ? (
                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    Que bom que conseguimos responder suas dúvidas!
                  </p>
                </div>
              ) : (
                <div className="flex gap-4 justify-center">
                  <Botao
                    variant="azul"
                    size="md"
                    onClick={handleSim}
                    isActive={botaoClicado === 'sim'}
                  >
                    Sim
                  </Botao>
                  <Botao
                    variant="azul"
                    size="md"
                    onClick={handleNao}
                    isActive={botaoClicado === 'nao'}
                  >
                    Não
                  </Botao>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Rodape onNavigate={onNavigate} />
    </div>
  )
}

export default FAQ

