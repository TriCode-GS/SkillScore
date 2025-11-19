import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Cabecalho from '../../Components/Cabecalho/Cabecalho'
import Rodape from '../../Components/Rodape/Rodape'
import Botao from '../../Components/Botao/Botao'
import { cadastrarUsuario } from '../../Types/AutenticacaoLogin'

interface CadastroFormData {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  aceitarTermos: boolean
}

const Cadastro = () => {
  const navigate = useNavigate()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const [mostrarTermos, setMostrarTermos] = useState(false)
  const [erroTermos, setErroTermos] = useState(false)
  const [erroSenha, setErroSenha] = useState(false)
  const [erroValidacoesSenha, setErroValidacoesSenha] = useState(false)
  const [erroApi, setErroApi] = useState('')
  const [carregando, setCarregando] = useState(false)
  
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<CadastroFormData>({
    defaultValues: {
      aceitarTermos: false
    }
  })
  
  const senha = watch('senha', '')
  const confirmarSenha = watch('confirmarSenha', '')
  const aceitarTermos = watch('aceitarTermos', false)

  useEffect(() => {
    if (senha && confirmarSenha && senha !== confirmarSenha) {
      setErroSenha(true)
    } else {
      setErroSenha(false)
    }
  }, [senha, confirmarSenha])

  const validarSenha = (senhaAtual: string) => {
    const temConteudo = senhaAtual.length > 0
    return {
      maxCaracteres: temConteudo && senhaAtual.length >= 8 && senhaAtual.length <= 16,
      maiusculasMinusculas: temConteudo && /[a-z]/.test(senhaAtual) && /[A-Z]/.test(senhaAtual),
      temNumero: temConteudo && /\d/.test(senhaAtual),
      temCaractereEspecial: temConteudo && /[!@#$%&*]/.test(senhaAtual),
      semEspacos: temConteudo && !/\s/.test(senhaAtual),
      semInfoPessoal: true
    }
  }

  const validacoesSenha = validarSenha(senha)

  const getCheckboxClasses = () => {
    const baseClasses = 'w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center'
    if (aceitarTermos) {
      return `${baseClasses} bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500`
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-400`
  }

  const getCheckIconClasses = () => {
    const baseClasses = 'w-3.5 h-3.5 text-white transition-opacity duration-200'
    return aceitarTermos ? `${baseClasses} opacity-100` : `${baseClasses} opacity-0`
  }

  const getCheckboxInstrucaoClasses = (validado: boolean) => {
    const baseClasses = 'w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center'
    if (validado) {
      return `${baseClasses} bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500`
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700`
  }

  const getCheckIconInstrucaoClasses = (validado: boolean) => {
    const baseClasses = 'w-3.5 h-3.5 text-white transition-opacity duration-200'
    return validado ? `${baseClasses} opacity-100` : `${baseClasses} opacity-0`
  }

  const onSubmit = async (data: CadastroFormData) => {
    setErroTermos(false)
    setErroSenha(false)
    setErroApi('')
    
    if (!data.nome || data.nome.trim() === '') {
      setErroApi('Nome completo é obrigatório')
      return
    }
    
    if (!data.aceitarTermos) {
      setErroTermos(true)
      return
    }
    
    if (data.senha !== data.confirmarSenha) {
      setErroSenha(true)
      return
    }
    
    const todasValidacoesSenha = 
      validacoesSenha.maxCaracteres &&
      validacoesSenha.maiusculasMinusculas &&
      validacoesSenha.temNumero &&
      validacoesSenha.temCaractereEspecial &&
      validacoesSenha.semEspacos &&
      validacoesSenha.semInfoPessoal
    
    if (!todasValidacoesSenha) {
      setErroValidacoesSenha(true)
      return
    }
    
    setErroValidacoesSenha(false)
    setCarregando(true)
    
    try {
      const dadosCadastro = {
        nomeUsuario: data.nome.trim(),
        email: data.email.trim(),
        senha: data.senha,
        tipoUsuario: 'USUARIO',
        tipoLogin: 'USUARIO',
        idEmpresa: null,
        areaAtuacao: null,
        competencias: null,
        nivelSenioridade: null
      }
      
      await cadastrarUsuario(dadosCadastro)
      
      setCarregando(false)
      navigate('/login')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setCarregando(false)
      setErroApi(error instanceof Error ? error.message : 'Erro ao cadastrar usuário. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Cabecalho />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 sm:py-12 md:py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-800">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
                Criar Conta
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
                Preencha os dados abaixo para criar sua conta
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {erroApi && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                      {erroApi}
                    </p>
                  </div>
                )}
                
                <div>
                  <label 
                    htmlFor="nome" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    {...register('nome', {
                      required: 'Nome completo é obrigatório',
                      validate: (value) => value.trim() !== '' || 'Nome completo é obrigatório'
                    })}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="Seu nome completo"
                  />
                  {errors.nome && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.nome.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className={`mb-4 p-4 rounded-lg border ${
                    erroValidacoesSenha 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Instruções para Criação da Senha
                    </p>
                    {erroValidacoesSenha && (
                      <p className="mb-3 text-sm text-red-600 dark:text-red-400 font-semibold">
                        Você precisa atender a todos os requisitos de senha para criar uma conta
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.maxCaracteres)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.maxCaracteres)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          A senha deve ter entre 8 e 16 caracteres
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.maiusculasMinusculas)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.maiusculasMinusculas)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Utilize letras maiúsculas e minúsculas
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.temNumero)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.temNumero)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Inclua pelo menos um número
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.temCaractereEspecial)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.temCaractereEspecial)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Inclua pelo menos um caractere especial (! @ # $ % & * …)
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.semEspacos)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.semEspacos)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Não utilize espaços
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={getCheckboxInstrucaoClasses(validacoesSenha.semInfoPessoal)}>
                          <svg 
                            className={getCheckIconInstrucaoClasses(validacoesSenha.semInfoPessoal)}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Evite informações pessoais, como nome ou data de nascimento (Opcional)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <label 
                    htmlFor="senha" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Senha
                  </label>
                  
                  <input
                    type="password"
                    id="senha"
                    {...register('senha', {
                      required: 'Senha é obrigatória',
                      maxLength: {
                        value: 16,
                        message: 'A senha deve ter no máximo 16 caracteres'
                      },
                      minLength: {
                        value: 8,
                        message: 'A senha deve ter no mínimo 8 caracteres'
                      },
                      onChange: () => {
                        setErroValidacoesSenha(false)
                      }
                    })}
                    maxLength={16}
                    className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                  {errors.senha && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.senha.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="confirmarSenha" 
                    className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    {...register('confirmarSenha', {
                      required: 'Confirmação de senha é obrigatória',
                      validate: (value) => value === senha || 'As senhas não coincidem'
                    })}
                    maxLength={16}
                    className={`w-full px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                      erroSenha 
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-400'
                    }`}
                    placeholder="••••••••"
                  />
                  {erroSenha && confirmarSenha && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      As senhas não coincidem
                    </p>
                  )}
                  {errors.confirmarSenha && !erroSenha && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmarSenha.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-start w-full">
                    <Controller
                      name="aceitarTermos"
                      control={control}
                      rules={{ required: 'Você precisa aceitar os termos de uso' }}
                      render={({ field }) => (
                        <label className="cursor-pointer group">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked)
                                setErroTermos(false)
                              }}
                              className="sr-only"
                            />
                            <div className={`${getCheckboxClasses()} ${erroTermos ? 'border-red-500 dark:border-red-500' : ''}`}>
                              <svg 
                                className={getCheckIconClasses()}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        </label>
                      )}
                    />
                    <div className="ml-3 flex-1">
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Aceito os{' '}
                        <button
                          type="button"
                          onClick={() => setMostrarTermos(true)}
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors underline"
                        >
                          termos de uso
                        </button>
                        {' '}e política de privacidade
                      </span>
                      {erroTermos && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          Você precisa aceitar os termos de uso para criar uma conta
                        </p>
                      )}
                      {errors.aceitarTermos && !erroTermos && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.aceitarTermos.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Botao
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={carregando}
                >
                  {carregando ? 'Cadastrando...' : 'Criar Conta'}
                </Botao>
              </form>
              
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => handleNavigate('/login')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Fazer Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
      
      {mostrarTermos && (
        <div className="fixed inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-indigo-200 dark:border-indigo-800 relative">
            <button
              onClick={() => setMostrarTermos(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                TERMO DE USO – SKILLSCORE (TRICODE)
              </h2>
              <div className="space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Este Termo de Uso regula as condições para criação e utilização de contas de usuário na plataforma SkillScore, desenvolvida pela TriCode. Ao criar uma conta, o usuário declara que leu, compreendeu e concorda integralmente com as condições abaixo.
                </p>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Aceitação do Termo</h3>
                  <p>
                    Ao criar uma conta no SkillScore, o usuário aceita automaticamente todas as regras e políticas aqui descritas, bem como eventuais atualizações futuras. Caso não concorde com algum item, recomendamos que não prossiga com o cadastro.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Elegibilidade</h3>
                  <p className="mb-2">Para utilizar o SkillScore, o usuário declara que:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Possui 16 anos ou mais;</li>
                    <li>Fornecerá informações verdadeiras, completas e atualizadas;</li>
                    <li>Será o único responsável pelo uso da conta.</li>
                  </ul>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Cadastro e Responsabilidade da Conta</h3>
                  <p className="mb-2">O usuário é responsável por:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Manter seu e-mail e senha em sigilo;</li>
                    <li>Não compartilhar sua conta com terceiros;</li>
                    <li>Notificar a TriCode imediatamente em caso de acesso indevido;</li>
                    <li>Garantir que suas informações estejam sempre atualizadas.</li>
                  </ul>
                  <p className="mt-2">
                    A TriCode não se responsabiliza por danos decorrentes de uso indevido da conta pelo próprio usuário ou por terceiros com quem o usuário compartilhou seus dados de acesso.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Planos e Acessos</h3>
                  <p className="mb-2">O SkillScore oferece dois tipos de contas:</p>
                  <div className="ml-4 space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">4.1 Conta Free</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Acesso a até 3 trilhas gratuitas;</li>
                        <li>Visualização apenas do progresso básico;</li>
                        <li>Sem acesso a gráficos, relatórios ou análises avançadas.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">4.2 Conta Pro (Assinatura)</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Acesso ilimitado a todas as trilhas;</li>
                        <li>Visualização de gráficos e análises personalizadas;</li>
                        <li>Acesso a histórico e recomendações inteligentes.</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-2">
                    A contratação do plano Pro implica cobrança recorrente, mediante aceite do usuário no ato da assinatura.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">5. Privacidade e Tratamento de Dados</h3>
                  <p className="mb-2">
                    Ao criar uma conta, o usuário concorda que seus dados pessoais serão tratados conforme a LGPD (Lei nº 13.709/2018), exclusivamente para:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Gerar sua experiência na plataforma;</li>
                    <li>Armazenar progresso e trilhas concluídas;</li>
                    <li>Gerar recomendações personalizadas;</li>
                    <li>Melhorar funcionalidades internas da plataforma;</li>
                    <li>Cumprir obrigações legais e de segurança.</li>
                  </ul>
                  <p className="mt-2">
                    A TriCode não vende nem compartilha dados pessoais com terceiros para fins comerciais.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">6. Conteúdos e Trilhas de Aprendizado</h3>
                  <p className="mb-2">As trilhas oferecidas pelo SkillScore consistem em:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Recomendações de cursos externos;</li>
                    <li>Avaliações socioemocionais;</li>
                    <li>Orientações de estudo;</li>
                    <li>Progresso baseado em fases.</li>
                  </ul>
                  <p className="mt-2">
                    O SkillScore não é responsável pelo conteúdo hospedado fora da plataforma (como cursos externos).
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">7. Conduta do Usuário</h3>
                  <p className="mb-2">O usuário compromete-se a:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Não tentar invadir, explorar falhas ou causar danos à plataforma;</li>
                    <li>Não utilizar o sistema para fins ilegais;</li>
                    <li>Não criar contas falsas ou utilizar informações de terceiros;</li>
                    <li>Não violar direitos autorais, políticos ou de propriedade intelectual.</li>
                  </ul>
                  <p className="mt-2">
                    A TriCode poderá suspender ou excluir contas envolvidas em violações deste Termo de Uso, bem como adotar todas as medidas legais cabíveis em caso de uso indevido, compartilhamento indevido de dados, tentativas de fraude, acessos não autorizados ou qualquer conduta que comprometa a segurança da plataforma ou de outros usuários.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">8. Alterações nos Termos</h3>
                  <p>
                    A TriCode poderá atualizar este Termo a qualquer momento. Alterações relevantes serão comunicadas por e-mail ou notificações dentro da plataforma. A continuidade do uso implica aceite automático.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">9. Cancelamento de Conta</h3>
                  <p>
                    O usuário pode solicitar o cancelamento de sua conta a qualquer momento.
                  </p>
                  <p className="mt-2">
                    Caso tenha o plano Pro ativo, deve cancelar a assinatura antes de excluir a conta.
                  </p>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 my-6"></div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">10. Limitação de Responsabilidade</h3>
                  <p className="mb-2">
                    O SkillScore é uma plataforma de apoio ao desenvolvimento profissional. Assim, a TriCode não garante:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Emprego, promoção ou resultados específicos;</li>
                    <li>Disponibilidade ininterrupta dos serviços;</li>
                    <li>Execução de conteúdos externos.</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Botao
                  variant="primary"
                  size="md"
                  onClick={() => setMostrarTermos(false)}
                >
                  Fechar
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cadastro
