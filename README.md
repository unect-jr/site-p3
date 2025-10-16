# Site Institucional - P3 Agro

Este é o repositório do site institucional para a Empresa P3 Agro, desenvolvido com Next.js, TypeScript, Tailwind CSS e Firebase.
 
## Índice

- [Stack de Tecnologia](#stack-de-tecnologia)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente Local](#configuração-do-ambiente-local)
  - [Passo 1: Clonar o Repositório](#passo-1-clonar-o-repositório)
  - [Passo 2: Instalar as Dependências](#passo-2-instalar-as-dependências)
- [Configuração Inicial do Projeto no Firebase](#passo-zero-configuração-inicial-do-projeto-no-firebase)
- [Configuração do Firebase](#configuração-do-firebase)
  - [Obtendo as Credenciais do Cliente (Client SDK)](#obtendo-as-credenciais-do-cliente-client-sdk)
  - [Obtendo as Credenciais de Administrador (Admin SDK)](#obtendo-as-credenciais-de-administrador-admin-sdk)
- [Rodando o Projeto](#rodando-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Deploy](#deploy)

## Stack de Tecnologia

- **Framework:** [Next.js](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Back-end e Banco de Dados:** [Firebase](https://firebase.google.com/) (Firestore, Storage)

## Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão LTS recomendada, ex: 18.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Acesso de colaborador ao projeto no Firebase e no repositório do GitHub.
  **Nota para a primeira configuração:** Se você está configurando o projeto pela primeira vez e ainda não existe um projeto no Firebase, siga primeiro as instruções em [Configuração Inicial do Projeto no Firebase](#passo-zero-configuração-inicial-do-projeto-no-firebase).

## Configuração do Ambiente Local

Siga estes passos para configurar o projeto em sua máquina local.

### Passo 1: Clonar o Repositório

```bash
git clone [URL_DO_REPOSITORIO_AQUI]
cd [NOME_DA_PASTA_DO_PROJETO]
```

### Passo 2: Instalar as Dependências

Este projeto usa `npm` como gerenciador de pacotes. Execute o seguinte comando para instalar todas as dependências listadas no `package.json`:

```bash
npm install
```

### Passo 3: Configurar as Variáveis de Ambiente

As credenciais e chaves de API são armazenadas em variáveis de ambiente para segurança.

1.  Crie uma cópia do arquivo de exemplo `.env.example` e renomeie-a para `.env.local`:

    ```bash
    cp .env.example .env.local
    ```

2.  Abra o arquivo `.env.local` recém-criado. Ele terá a seguinte estrutura:

    ```env
    # Firebase Client SDK Config
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

    # Firebase Admin SDK Config
    FIREBASE_ADMIN_SDK_BASE64=

    ```

3.  Preencha os valores para cada variável. Veja a seção [Configuração do Firebase](#configuração-do-firebase) abaixo para instruções detalhadas sobre como obter essas chaves.

## (Passo Zero) Configuração Inicial do Projeto no Firebase

Se você é o primeiro desenvolvedor a configurar este projeto ou se está criando uma nova instância para testes, siga estes passos para criar e configurar um novo projeto no Firebase do zero.

### 1. Criar o Projeto no Firebase

1.  **Acesse o Console:** Vá para o [Console do Firebase](https://console.firebase.google.com/) e faça login com sua conta Google.
2.  **Adicionar Projeto:** Clique em **"Adicionar projeto"**.
3.  **Nome do Projeto:** Dê um nome único e descritivo, como `site-agricola-dev-[seu-nome]`.
4.  **Google Analytics:** **Ative o Google Analytics** para este projeto. É altamente recomendado para obter insights sobre o uso do site. Continue e selecione ou crie uma nova conta do Analytics.
5.  **Aguarde a Criação:** Aguarde o Firebase provisionar seu novo projeto.

### 2. Ativar os Serviços Essenciais

Dentro do seu novo projeto, você precisa ativar os serviços que a aplicação utiliza.

#### a) Ativar o Firestore (Banco de Dados)

1.  No menu lateral esquerdo, vá para **Build > Firestore Database**.
2.  Clique em **"Criar banco de dados"**.
3.  **Modo de Segurança:** Selecione **"Iniciar em modo de produção"**. Isso é crucial para a segurança. As regras padrão bloquearão todo o acesso, e nós as abriremos seletivamente depois.
4.  **Localização:** Escolha uma localização para os seus servidores. Se o público-alvo principal for o Brasil, selecione **`southamerica-east1 (São Paulo)`**.
5.  Clique em **"Ativar"**.

#### b) Ativar o Storage (Armazenamento de Arquivos)

1.  No menu lateral, vá para **Build > Storage**.
2.  Clique em **"Primeiros passos"**.
3.  Você será apresentado às regras de segurança. Clique em **"Próxima"**.
4.  A localização será a mesma do Firestore. Clique em **"Concluído"**.

### 3. Criar as Coleções e Regras de Segurança

#### a) Configurar Regras do Firestore

1.  Volte para **Build > Firestore Database** e clique na aba **"Regras"**.
2.  Substitua o conteúdo padrão pelo seguinte código. Isso permite leitura pública para a coleção `products` e bloqueia qualquer escrita não autorizada.

    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Regra para a coleção 'products'
        match /products/{productId} {
          allow get, list: if true;
          allow create, update, delete: if false;
        }
        // Adicione regras para outras coleções aqui (ex: applications, contacts)
      }
    }
    ```

3.  Clique em **"Publicar"**.

#### b) Configurar Regras do Storage

1.  Vá para **Build > Storage** e clique na aba **"Regras"**.
2.  Substitua o conteúdo padrão pelo seguinte código. Isso permite que qualquer pessoa leia imagens da pasta `products/` (necessário para o site), mas bloqueia a escrita.

    ```javascript
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        // Regra para imagens de produtos
        match /products/{allPaths=**} {
          allow read: if true;
          allow write: if false;
        }
        // Adicione regras para outras pastas aqui (ex: /resumes para currículos)
      }
    }
    ```

3.  Clique em **"Publicar"**.

### 4. Criar Dados de Exemplo (Opcional, mas Recomendado)

Para poder rodar o projeto e ver conteúdo, você precisa de alguns dados no banco.

1.  Vá para **Build > Firestore Database**.
2.  Clique em **"+ Iniciar coleção"**.
3.  **ID da coleção:** `products`.
4.  Crie seu primeiro documento clicando em **"ID automático"** e preenchendo os campos conforme o contrato de dados do projeto (consulte a interface `Product` no código para os nomes e tipos corretos dos campos: `nome`, `preco`, `imagemURL`, `ativo`).
5.  Adicione mais 2 ou 3 produtos para ter uma lista para testar.

**Parabéns!** Seu projeto Firebase agora está configurado e pronto. Prossiga para a seção **[Configuração do Ambiente Local](#configuração-do-ambiente-local)** para obter as credenciais e rodar a aplicação.

## Configuração do Firebase

Para que o projeto se conecte ao Firebase, você precisa de dois conjuntos de credenciais.

### Obtendo as Credenciais do Cliente (Client SDK)

Estas são as chaves públicas que permitem que o navegador se comunique com o Firebase.

1.  Acesse o [Console do Firebase](https://console.firebase.google.com/).
2.  Selecione o projeto.
3.  Clique no ícone de engrenagem (⚙️) no canto superior esquerdo e vá para **"Configurações do projeto"**.
4.  Na aba **"Geral"**, role para baixo até a seção **"Seus apps"**.
5.  Selecione o aplicativo da web.
6.  Na seção "SDK do Firebase", clique em **"Configuração"** e copie os valores do objeto `firebaseConfig` para as variáveis `NEXT_PUBLIC_*` correspondentes no seu arquivo `.env.local`.

### Obtendo as Credenciais de Administrador (Admin SDK)

Estas são as credenciais secretas que permitem que o nosso servidor (Next.js rodando no back-end) acesse o Firebase com privilégios de administrador.

1.  No Console do Firebase, vá para **"Configurações do projeto" > "Contas de serviço"**.
2.  Clique no botão **"Gerar nova chave privada"**. Um arquivo JSON será baixado.
3.  **Atenção: Trate este arquivo como uma senha!** Não o adicione ao Git.
4.  Você precisa converter o conteúdo deste arquivo JSON para uma string Base64. Abra seu terminal e execute um dos seguintes comandos:

    ```bash
    # No macOS ou Linux
    cat /caminho/para/seu/arquivo.json | base64

    # No Windows (usando PowerShell)
    [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\caminho\para\seu\arquivo.json"))
    ```

5.  Copie a longa string resultante e cole-a como o valor da variável `FIREBASE_ADMIN_SDK_BASE64` no seu arquivo `.env.local`.

## Rodando o Projeto

Após instalar as dependências e configurar as variáveis de ambiente, você está pronto para rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o projeto em execução.
