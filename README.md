# 🏥 SkillScore

# 📋 Sobre o Projeto

O **SkillScore** é uma plataforma de desenvolvimento profissional gamificada que guia usuários por trilhas de aprendizado personalizadas. Através de um diagnóstico inicial, a plataforma identifica o perfil do colaborador e recomenda a trilha ideal em Administração, Tecnologia ou Recursos Humanos. Cada trilha contém cursos e progresso visual, tornando o aprendizado mais motivador. Para empresas, atualmente, a plataforma permite que gestores casdastrados registrem seus funcionários, que então podem acessar suas trilhas e acompanhar seu próprio progresso.

## ⚙️ Login de Administrador do SkillScore

- **Username** Skillscore@gmail.com
- **Senha** Sks01

## 🛠️ Como Manipular o Sistema (Pelo GitHub)

### 📋 Pré-requisitos (Para Execução no Github)
- **Node.js** (Caso não tenha **não será possível** executar os comandos npm)
- **Git** (Necessário para clonar o repositorio)
- **É necessário um ambiente para executar o projeto, remomendamos o Visual Studio Code**

### ⚠️ ATENÇÃO

Caso não possua algum dos pré-requisitos listados acima, recomendamos que siga a seguinte ordem de instalação:

1. **Visual Studio Code** → https://code.visualstudio.com/Download

2. **Git** → https://git-scm.com/downloads

3. **Node.js** → https://nodejs.org/en/download



- Se qualquer um desses itens não estiver devidamente instalado, não será possível executar a aplicação.

- Após concluir todas as instalações, reinicie o computador para garantir que as configurações sejam aplicadas corretamente.



### 🚀 Instalação e Execução (Passo a Passo - GitHub)

#### **Passo 1: Clone o repositório**
```bash
git clone https://github.com/TriCode-GS/SkillScore.git
```

#### **Passo 2: Entre na pasta do projeto**
```bash
cd SKILLSCORE
```

#### **Passo 3: Instalar dependências (TERMINAL PROMPT DE COMANDO)**
```bash
npm install
```

#### **CASO NÃO APAREÇA ERRO NO TERMINAL VÁ DIRETO AO PASSO 4**

#### **CASO OCORRA UM ERRO NO PASSO 3, insira o código abaixo no (TERMINAL PROMPT DE COMANDO)**

#### **Instalar Tailwind v4 (TERMINAL PROMPT DE COMANDO)**
```bash
npm i tailwindcss @tailwindcss/vite
```

#### **Passo 4: Executar o projeto**
```bash
npm run dev
```

#### **Passo 5: Abrir no navegador**
1. Abra seu navegador
2. Digite na barra de endereço: `http://localhost:5173`
3. Pressione Enter
4. O projeto deve abrir!

## 🛠️ Como Manipular o Sistema (Pela Vercel)

### 🚀 Execução (Passo a Passo - Vercel)

#### **Passo 1: Abrir no navegador**
1. Abra seu navegador
2. Digite na barra de endereço: `https://skillscore.vercel.app/`
3. Pressione Enter
4. O projeto deve abrir!

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão |

| **React** | 19.2.0 |
| **TypeScript** | 5.9.3 |
| **Vite** | 7.2.2 |
| **Tailwind CSS** | v4 |
| **React Router DOM** | 7.9.5 |
| **React Hook Form** | 7.66.0 |

## 👥 Integrantes da Equipe

| Nome | RM | Turma | GitHub | LinkedIn |

| Geovanne Coneglian Passos | 562673 | 1TDSPY |
[@GeovanneCP](https://github.com/GeovanneCP) | 
[LinkedIn](https://www.linkedin.com/in/geovanne-coneglian-775472353/)

| Guilherme Soares de Almeida | 563143 | 1TDSPY | 
[@GuuiSOares](https://github.com/GuuiSOares) | 
[LinkedIn](https://www.linkedin.com/in/guilherme-soares-de-almeida)

| Lucas Silva Gastão Pinheiro | 563960 | 1TDSPY | 
[@Lucasgastaop](https://github.com/Lucasgastaop) | 
[LinkedIn](https://www.linkedin.com/in/lucas-pinheiro-1a7154291/) |


## 🖼️ Imagens e Ícones do Projeto

O projeto utiliza as seguintes imagens e ícones:

### 🎨 Logo (public/)
- **LogoSkillScoreBlack.png** - Logo do SkillScore (versão preta/tema claro)
- **LogoSkillScoreWhite.png** - Logo do SkillScore (versão branca/tema escuro)

### 📁 Ícones (Icones/)
- **CadeadoBrancoAberto.png** - Ícone de cadeado branco aberto (curso desbloqueado)
- **CadeadoBrancoFechado.png** - Ícone de cadeado branco fechado (curso bloqueado)
- **CadeadoPretoAberto.png** - Ícone de cadeado preto aberto (curso desbloqueado)
- **CadeadoPretoFechado.png** - Ícone de cadeado preto fechado (curso bloqueado)

### 👥 Integrantes (Integrantes/)
- **GeovanneConeglianPassos.png** - Foto do integrante Geovanne
- **GuilhermeSoaresdeAlmeida.jpg** - Foto do integrante Guilherme
- **LucasSilvaGastãoPinheiro.jpg** - Foto do integrante Lucas

### 🌐 Redes Sociais (RedesSociais/)
- **GithubBlack.png** - Logo do GitHub (tema claro)
- **GithubWhite.png** - Logo do GitHub (tema escuro)
- **linkedin.png** - Logo do LinkedIn
- **WhatsApp.png** - Logo do WhatsApp


## 📁 Estrutura das Pastas
```bash
SkillScore/
├── 📁 public/
│   ├── 📄 LogoSkillScoreBlack.png                  # Logo do SkillScore (versão preta)
│   └── 📄 LogoSkillScoreWhite.png                  # Logo do SkillScore (versão branca)
├── 📁 src/
│   ├── 📁 assets/
│   │   └── 📁 img/
│   │       ├── 📁 Icones/
│   │       │   ├── 📄 CadeadoBrancoAberto.png      # Ícone de cadeado branco aberto
│   │       │   ├── 📄 CadeadoBrancoFechado.png     # Ícone de cadeado branco fechado
│   │       │   ├── 📄 CadeadoPretoAberto.png       # Ícone de cadeado preto aberto
│   │       │   └── 📄 CadeadoPretoFechado.png      # Ícone de cadeado preto fechado
│   │       ├── 📁 Integrantes/
│   │       │   ├── 📄 GeovanneConeglianPassos.png  # Foto do integrante Geovanne
│   │       │   ├── 📄 GuilhermeSoaresdeAlmeida.jpg # Foto do integrante Guilherme
│   │       │   └── 📄 LucasSilvaGastãoPinheiro.jpg # Foto do integrante Lucas
│   │       └── 📁 RedesSociais/
│   │           ├── 📄 GithubBlack.png              # Logo do GitHub (tema claro)
│   │           ├── 📄 GithubWhite.png              # Logo do GitHub (tema escuro)
│   │           ├── 📄 linkedin.png                 # Logo do LinkedIn
│   │           └── 📄 WhatsApp.png                 # Logo do WhatsApp
│   ├── 📁 Components/
│   │   ├── 📁 Botao/
│   │   │   └── 📄 Botao.tsx                        # Componente de botão reutilizável
│   │   ├── 📁 Cabecalho/
│   │   │   └── 📄 Cabecalho.tsx                    # Cabeçalho com navegação responsiva
│   │   ├── 📁 ListaSelecao/
│   │   │   └── 📄 ListaSelecao.tsx                 # Componente de lista de seleção
│   │   └── 📁 Rodape/
│   │       └── 📄 Rodape.tsx                       # Rodapé
│   ├── 📁 Contexto/
│   │   ├── 📄 AutenticacaoContexto.tsx             # Contexto de autenticação
│   │   └── 📄 TemaContexto.tsx                     # Contexto de tema (claro/escuro)
│   ├── 📁 Routes/
│   │   ├── 📁 Admin/
│   │   │   ├── 📄 GerenciarAdministradores.tsx     # Gerenciamento de administradores
│   │   │   ├── 📄 GerenciarCursos.tsx              # Gerenciamento de cursos
│   │   │   ├── 📄 GerenciarEmpresas.tsx            # Gerenciamento de empresas
│   │   │   ├── 📄 GerenciarTrilhas.tsx             # Gerenciamento de trilhas
│   │   │   ├── 📄 HomeAdmin.tsx                    # Home do administrador
│   │   │   ├── 📄 LoginAdmin.tsx                   # Login de administrador
│   │   │   └── 📄 UsuariosPorTrilha.tsx            # Visualização de usuários por trilha
│   │   ├── 📁 Corporativo/
│   │   │   ├── 📁 AdministradorEmpresa/
│   │   │   │   ├── 📄 GerenciarDepartamentos.tsx   # Gerenciamento de departamentos
│   │   │   │   ├── 📄 GerenciarGestores.tsx        # Gerenciamento de gestores
│   │   │   │   └── 📄 HomeAdministradorEmpresa.tsx # Home do administrador de empresa
│   │   │   ├── 📁 Funcionario/
│   │   │   │   ├── 📄 DefinirTrilha.tsx            # Formulário de definição de trilha
│   │   │   │   └── 📄 HomeFuncionario.tsx          # Home do funcionário
│   │   │   ├── 📁 Gestor/
│   │   │   │   ├── 📄 GerenciarFuncionarios.tsx    # Gerenciamento de funcionários
│   │   │   │   └── 📄 HomeGestor.tsx               # Home do gestor
│   │   │   └── 📄 LoginCorporativo.tsx             # Login corporativo
│   │   ├── 📁 Trilhas/
│   │   │   ├── 📄 TrilhaAdministracao.tsx          # Página da trilha de Administração
│   │   │   ├── 📄 TrilhaRecursosHumanos.tsx        # Página da trilha de Recursos Humanos
│   │   │   └── 📄 TrilhaTecnologia.tsx             # Página da trilha de Tecnologia
│   │   ├── 📁 Usuario/
│   │   │   ├── 📄 Cadastro.tsx                     # Página de cadastro
│   │   │   ├── 📄 Contato.tsx                      # Página de contato
│   │   │   ├── 📄 FAQ.tsx                          # Perguntas frequentes
│   │   │   ├── 📄 Home.tsx                         # Página inicial pública
│   │   │   ├── 📄 Integrantes.tsx                  # Página dos desenvolvedores
│   │   │   ├── 📄 Login.tsx                        # Página de login
│   │   │   └── 📄 Sobre.tsx                        # Página sobre o projeto
│   │   └── 📁 UsuarioFree/
│   │       ├── 📄 DefinirTrilhaFree.tsx            # Formulário de definição de trilha (usuário comum)
│   │       └── 📄 HomeFree.tsx                     # Home do usuário comum
│   ├── 📁 Types/
│   │   ├── 📄 AutenticacaoLogin.ts                 # Tipos e funções de autenticação
│   │   ├── 📄 Curso.ts                             # Tipos e funções de cursos
│   │   ├── 📄 Departamento.ts                      # Tipos e funções de departamentos
│   │   ├── 📄 Diagnostico.ts                       # Tipos de diagnóstico
│   │   ├── 📄 Empresa.ts                           # Tipos e funções de empresas
│   │   ├── 📄 Trilha.ts                            # Tipos e funções de trilhas
│   │   ├── 📄 TrilhaCurso.ts                       # Tipos e funções de trilha-curso
│   │   └── 📄 Usuario.ts                           # Tipos de usuário
│   ├── 📄 App.tsx                                  # Componente principal (rotas)
│   ├── 📄 globals.css                              # Estilos globais
│   └── 📄 main.tsx                                 # Ponto de entrada
├── 📄 .env                                         # Variáveis de ambiente
├── 📄 .gitignore                                   # Arquivos ignorados pelo Git
├── 📄 eslint.config.js                             # Configuração ESLint
├── 📄 index.html                                   # Arquivo HTML principal
├── 📄 package.json                                 # Configurações do projeto
├── 📄 package-lock.json                            # Lock file das dependências
├── 📄 README.md                                    # Documentação do projeto
├── 📄 tsconfig.app.json                            # Configuração do TypeScript (app)
├── 📄 tsconfig.json                                # Configuração do TypeScript
├── 📄 tsconfig.node.json                           # Configuração do TypeScript (node)
└── 📄 vite.config.ts                               # Configuração do Vite
```

## 🔗 Links Obrigatórios

### 📱 GitHub
**Repositório do Projeto**: [https://github.com/TriCode-GS/SkillScore]

### 🎥 Vídeo do YouTube
**Vídeo de Apresentação**: [cbeibiubcibcbicicbcbicbicbcicbbcibcibicbicbic]

**Desenvolvido pela equipe TriCode**
