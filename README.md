# pocket_trainer

Sistema de auxílio ao treinamento físico com foco em personalização e análise de desempenho.

![prototipo](https://user-images.githubusercontent.com/85709318/227787732-05de175e-cea9-4d6e-98ad-3564e1ba9788.png)

## Proposta

Plataforma para acompanhamento de treinos que oferece:

- Cadastro e login de usuários (alunos e administradores)
- Registro de treinos (exercício, carga, repetições, duração)
- Listagem, edição e exclusão de treinos
- Painel administrativo com estatísticas e gráficos
- Integração com OpenAI para feedback inteligente

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Knex
- JWT
- Bcrypt
- Day.js
- OpenAI API
- React (frontend em desenvolvimento)

## Protótipos

Link: <https://www.figma.com/file/j0cOacTYhlA3kuqLLu6IiZ/Pocket-Trainer-team-library?node-id=0%3A1&t=iFdN9FNMog5dAz31-1>

![protótipo 1](https://user-images.githubusercontent.com/85709318/227787666-b63ccd14-c653-4eb6-9f8d-05fa44bb515a.png)  
![protótipo 2](https://user-images.githubusercontent.com/85709318/227787684-d2c582a2-92cf-4e97-847f-37d29a39bad6.png)  
![protótipo 3](https://user-images.githubusercontent.com/85709318/227787703-65b5df1e-4d7e-415e-bad9-12fd9f0d7933.png)

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pocket_trainer.git
cd pocket_trainer/backend
```

### 2. Instale as dependências

```bash
npm install express cors dotenv knex pg jsonwebtoken bcrypt dayjs openai
npm install -D nodemon
npm install -g knex
```

### 3. Configure o `.env`

```env
PORT=5000
DATABASE_URL=postgres://usuario:senha@localhost:5432/pocket_trainer
JWT_SECRET=sua_chave_secreta
OPENAI_API_KEY=sua_api_key_aqui
```

### 4. Execute as migrations

```bash
knex migrate:latest
```

### 5. Inicie o servidor

```bash
nodemon index.js
# ou
node index.js
```

Servidor ativo em `http://localhost:5000`.

## Rotas principais da API

Prefixo: `/api`

### Autenticação

| Método | Rota            | Descrição            |
|--------|-----------------|----------------------|
| POST   | `/users/register` | Cria usuário        |
| POST   | `/users/login`    | Login e token JWT   |

### Treinos (aluno logado)

| Método | Rota          | Descrição                |
|--------|---------------|--------------------------|
| POST   | `/treinos`    | Cadastra treino          |
| GET    | `/treinos`    | Lista treinos do aluno   |
| PUT    | `/treinos/:id`| Atualiza treino          |
| DELETE | `/treinos/:id`| Remove treino            |

### Admin

| Método | Rota                                   | Descrição                            |
|--------|----------------------------------------|--------------------------------------|
| GET    | `/admin/treinos`                       | Lista todos os treinos               |
| GET    | `/admin/treinos/:aluno_id`             | Lista treinos de um aluno            |
| GET    | `/admin/estatisticas`                  | Estatísticas gerais                  |
| GET    | `/admin/estatisticas/exercicio/:nome`  | Estatísticas de um exercício         |
| GET    | `/admin/evolucao/:aluno_id/:exercicio` | Evolução de carga por exercício      |

## Funcionalidades implementadas

- Cadastro e login com JWT
- CRUD de treinos
- Estatísticas gerais e por exercício
- Painel admin com filtros
- Feedback via OpenAI (endpoint `/chat`)

## Futuras melhorias

- Gráficos no front-end (Recharts)
- Treinamento da IA com dados históricos
- Feedback automático sobre evolução do aluno
- Testes automatizados

---

Desenvolvido por Fábio Albino, Ruan da Cunha
