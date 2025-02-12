# API REST de Gerenciamento de Tarefas com Node.js e SQL Server 

Esta é uma API de gerenciamento de tarefas, desenvolvida com Node.js, Express e Microsoft SQL Server. Através dela é possível a **criação**, **leitura**, **atualização** e **exclusão** de tarefas. A API suporta realizar filtros baseados em um ou mais status, gravando cada tarefa em uma tabela do banco de dados.

___

## Tecnologias usadas:

- **Node.js**: Plataforma de execução do JavaScript no Backend;
- **Express**: Framework para a criação do servidor HTTP;
- **Microsoft SQL Server**: Banco de dados relacional; 
- **dotenv**: Gerenciamento de variáveis de ambiente;
- **mssql**: Pacote do _npm_ para conectar-se ao Microsoft SQL Server.
___

## Requisitos para rodar o projeto:
Antes de rodar o projeto localmente, é necessário fazer as configurações iniciais:
1. Instalação do Node.js;
2. Instalação e configuração prévia do Microsoft SQL Server;
3. Criar um banco de dados no SQL Server com o nome de sua preferência;
4. Definir as variáveis de ambiente em um arquivo `.env`;

## Como Rodar o projeto localmente:
1. Clone o repositório para a sua máquina local.
`git clone <url-do-repositório>`
`cd <nome da pasta local>`
2. Instale as dependências:
`npm install`
3. Configuração do Banco de Dados
No arquivo `.env`, adicionar as informações de conexão do seu banco de dados.
```
    DB_USER=seu_usuário
    DB_PASSWORD=sua_senha
    DB_SERVER=localhost/...
    DB_DATABASE= Nome_do_Banco_criado
    DB_PORT=Porta_exposta_do_banco_de_dados
```
4. Rodar a API
Inicie o servidor localmente, que irá se conectar ao Banco de Dados e ligar o servidor HTTP em sequência.

A API estará disponível em: http://localhost:<porta_escolhida_ou_5000>.

___

# Endpoints
## POST /tasks
### Descrição: 
Cria uma nova tarefa.
### Body: 
{ "title": "Título da Tarefa", "description": "Descrição da Tarefa", "status": "not_started" }
### Resposta:
201: Tarefa criada com sucesso.
400: Status inválido fornecido.
500: Erro interno ao tentar criar a tarefa.

## GET /tasks
### Descrição:
Recupera todas as tarefas ou filtra por status.
### Parâmetros de Query:
status (ex: not_started, in_progress, completed).
### Resposta:
200: Retorna as tarefas.
400: Erro de status inválido.
500: Erro ao tentar buscar tarefas.

## GET /tasks/:id
Descrição: Recupera uma tarefa específica pelo ID.
### Parâmetros:
id (ID da tarefa).
### Resposta:
200: Tarefa encontrada.
404: Tarefa não encontrada.
500: Erro ao tentar buscar a tarefa.

## PUT /tasks/:id
### Descrição:
Atualiza uma tarefa existente pelo ID.
### Body:
{ "title": "Novo Título", "description": "Nova Descrição", "status": "in_progress" }
### Resposta:
200: Tarefa atualizada com sucesso.
400: Parâmetros inválidos ou tarefa não encontrada.
500: Erro ao tentar atualizar a tarefa.

## PATCH /tasks/:id
### Descrição:
Atualiza apenas o status de uma tarefa pelo ID.
### Body:
{ "status": "completed" }
### Resposta:
200: Status atualizado com sucesso.
400: Status inválido ou não fornecido.
404: Tarefa não encontrada.
500: Erro ao tentar atualizar o status da tarefa.

## DELETE /tasks/:id
### Descrição: 
Deleta uma tarefa pelo ID.
### Resposta:
204: Tarefa deletada com sucesso.
404: Tarefa não encontrada.
500: Erro ao tentar deletar a tarefa.

___