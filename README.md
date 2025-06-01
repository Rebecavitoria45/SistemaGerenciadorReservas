
# 🏨 Sistema de Gerenciamento de Reservas de Hotel

Este projeto é um sistema de **gerenciamento de reservas de hotel** desenvolvido utilizando **Node.js** com arquitetura de **microsserviços**, onde cada serviço é responsável por uma parte específica da aplicação.

## 🎯 Objetivo

O sistema permite realizar:

- Cadastro de usuários
- Cadastro e gerenciamento de quartos
- Criação, listagem, atualização e exclusão de reservas
- Cálculo automático do valor da reserva com base nas datas e no preço do quarto
- Comunicação entre microsserviços de forma assíncrona via **RabbitMQ** para a realizar a atualização da disponibilidade do quarto

---

## 🏗️ Arquitetura do Projeto

O sistema está dividido em três microsserviços principais:

1. **Usuários Service** – Gerenciamento de usuários.
2. **Quartos Service** – Cadastro e gerenciamento de quartos.
3. **Reservas Service** – Gerenciamento das reservas de hospedagem.

### 🔗 Comunicação entre serviços

- **AXIOS** para operações síncronas (ex.: verificar se um usuário existe, buscar informações de um quarto).
- **RabbitMQ** para eventos assíncronos (ex.: atualizar disponibilidade de quartos quando uma reserva é criada ou excluida).

---

## 🧠 Tecnologias Utilizadas

- Node.js / Express
- Sequelize ORM
- MySQL
- RabbitMQ
- Docker e Docker Compose
- Axios
- Frontend: VUE

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker
- Docker Compose

### Subindo o Backend

```bash
docker-compose up --build
```
## Subindo o Frontend

```bash
npm install
npm run serve
```


### 🐇 Acesso ao RabbitMQ

- URL: http://localhost:15672  
- Usuário: guest  
- Senha: guest

---

## 📦 Endpoints Principais

### 🔹 Usuários Service

| Método | Endpoint                          | Descrição                      |
|--------|---------------------------------- |--------------------------------|
| POST   | `/cadastrar`                      | Cadastrar usuário              |
| POST   | `/login`                          | Realizar login do usuário      |
| PUT    | `/atualizar/:usuario_id`          | Atualizar dados do usuário     |
| DELETE | `/deletar/:usuario_id`            | Deletar usuário                |
| GET    | `/listar`                         | Listar todos os usuários       |
| GET    | `/buscar/:usuario_id`             | Buscar usuário por ID          |

---

### 🔹 Quartos Service

| Método | Endpoint             | Descrição                          |
|--------|-----------------------|-------------------------------------|
| GET    | `/listar `            | Listar todos os quartos            |
| GET    | `/buscar /:id`        | Buscar quarto por ID               |
| POST   | `/cadastrar`          | Cadastrar quarto                   |
| PUT    | `/atualizar/:id`      | Atualizar dados do quarto          |
| DELETE | `/deletar/:id`        | Excluir quarto                     |

---

### 🔹 Reservas Service

| Método | Endpoint                           | Descrição                                  |
|--------|-------------------------------------|----------------------------------------------|
| GET    | `/listar`                           | Listar todas as reservas                    |
| GET    | `/reservas/:id_reserva`             | Buscar reserva por ID                       |
| GET    | `/reservasusuario/:usuario_id`      | Listar reservas de um usuário               |
| POST   | `/cadastrar`                        | Criar uma nova reserva                      |
| PUT    | `/atualizar/:id_reserva`            | Atualizar dados de uma reserva              |
| DELETE | `/deletar/:id_reserva`              | Cancelar (excluir) uma reserva              |

---

## 🔧 Funcionalidades Implementadas

- Verificação de disponibilidade do quarto
- Validação da capacidade (quantidade de pessoas)
- Cálculo automático do preço da reserva (preço do quarto × quantidade de dias)
- Alteração automática do status de disponibilidade do quarto

---

## 👤 Autoras

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/gabriellamarinho">
        <img src="https://avatars.githubusercontent.com/u/186753301?v=4" width="100px;" alt="Marilia"/>
        <br>
        <b>Marilia Gabriella</b>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/Rebecavitoria45">
        <img src="https://avatars.githubusercontent.com/u/117654851?v=4" width="100px;" alt="Rebeca"/>
        <br>
        <b>Rebeca vitória</b>
      </a>
    </td>
</table>



---

## 🏆 Status do Projeto

🚀 Projeto em desenvolvimento, com funcionalidades principais implementadas e arquitetura baseada em microsserviços funcionando via Docker e RabbitMQ.
