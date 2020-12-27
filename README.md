# Delivery Much Tech Challenge

Código criado para o desafio relacionado à vaga de Backend NodeJS na Delivery Much.

Repositório do Desafio: https://github.com/delivery-much/challenge

&nbsp;

## Quem Sou

Projeto realizado por Tibério Ferreira Lima Brasil [tiberiobrasil@gmail.com](mailto:tiberiobrasil@gmail.com)

&nbsp;

## Ferramentas Utilziadas

Para desenvolvimento desse aplicativo foram utilizadas as ferramentas à seguir:

- NestJS (framework) utilizando Typescript
- Jest (testes unitários e de integração)
- Swagger (documentação da api)
- Lint e Prettier (formatação e qualidade do código)

&nbsp;

## Workflow

Foram criadas duas principais branches no GitHub:

- `develop` - Branch principal. Sempre que um novo merge é enviado ao repositório por padrão será feito nela.
- `master` - Branch de produção. O código deve ser testado na branch específica de onde foi criado e após os testes deve ser mergeado na develop. Caso esteja tudo OK deve ser feito um Release da branch develop para a master, inserindo as atualizações no servidor de produção.

Sempre que uma nova MR for feita a mesma deve estar em uma branch específica utilizando o `gitmoji` e `git flow`.

O GitHub actions entra em ação sempre que uma novo pull ou merge request é feito no repositório. Serão realizados os testes unitários, garantindo o funcionamento das alterações e o linting do projeto, garantindo a formatação e qualidade do código.

&nbsp;

## Instalação

Executar o comando para instalar as dependências

```bash
$ yarn
# ou
$ npm install
```

&nbsp;

## Arquivo de configuração

Criar um arquivo `.env` baseado no arquivo `.env.example`, editando os valores que já existem, caso necessário, e inserindo os que estão vazios.

&nbsp;

## Executar o projeto sem Docker

Executar o comando:

```bash
$ yarn start:dev
# ou
$ npm run start:dev
```

&nbsp;

## Executar o projeto com Docker

Executar o comando:

```bash
$ docker-compose build
$ docker-compose up
```

&nbsp;

## Acesso ao projeto

Após executar o projeto o mesmo poderá ser visualizado através da URL:

`http://localhost:{PORT}/recipes/i?=onion,tomato`

Onde `{PORT}` é o valor da porta configurada no arquivo `.env` e o `i` são os ingredientes a serem procurados. Os ingredientes devem ser enviados separados por vírgula, no mínimo 1 e no máximo 3.
Mais detalhes podem ser vistos na [Documentação da API](#Documentação-da-API).

&nbsp;

## Testes Unitários

Executar testes unitários nos services e controllers:

```bash
yarn test
# ou
npm run test
```

&nbsp;

## Testes de Integração

Executar testes unitários no endpoint de retorno das receitas:

```bash
yarn test:e2e
# ou
npm run test:e2e
```

&nbsp;

## Cobertura de Testes Unitários (100% de cobertura)

Executar o comando abaixo para gerar o relatório de coberta de testes unitários. Foi atingido o percentual de 100% de cobertura nos services e controlles do projeto.

```bash
yarn test:cov
# ou
npm run test:cov
```

Após executado será criada uma pasta `coverage` na raiz do projeto. Para visualizar o relatório basta abrir o arquivo a seguir no navegador:
`coverage/lcov-report/index.html`

&nbsp;

## Documentação da API

Foi utilizada a lib Swagger para documentar a API. A mesma pode ser vista em:

`http://localhost:{PORT}/api`

Onde `{PORT}` é o valor da porta configurada no arquivo `.env`.

&nbsp;

## GitHub Actions

Criado worflow no GitHub Actions para que sempre que um novo `push` ou `merge` for feito ao repositório uma série de comando serão executados.

Dentre os comandos estão a garantis que os testes não contém erros e que também não há erros de linting no projeto, garantindo a padronização do código.

Para mais informações acessar o arquivo:

`.github/worflows/main.yml`

&nbsp;

## Desafio em Produção no Heroku

Segue link para acesso ao aplicativo hospedado no heroku. Segue exemplo de requisição:

https://delivery-much-tech-challenge.herokuapp.com/recipes?i=onion,tomato(https://delivery-much-tech-challenge.herokuapp.com/recipes?i=onion,tomato)
