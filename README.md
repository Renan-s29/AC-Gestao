# AC-Gestão

Protótipo full stack de gestão para **Associação Comercial** — dashboard, ficha digital, benefícios/saúde, financeiro, relatórios e controles de acesso (JWT/RBAC), com modelo relacional em português.

> Repositório demonstrativo (P1). Focado em fluxo completo, não em cenários de produção.

## Stack

| Camada    | Tecnologias |
|-----------|-------------|
| Frontend  | Angular 17, TypeScript, SCSS, Angular Material |
| Backend   | Node.js, Express, JWT, RBAC |
| Banco     | MySQL 8 (`database/`) |

## Funcionalidades

- Dashboard com busca, alertas e indicadores
- Ficha digital do associado (cadastro, histórico, PDFs)
- Saúde/benefícios: dependentes, plano, carência
- Financeiro: mensalidades, juros, multa, bloqueio por inadimplência
- Relatórios com filtros e exportação Excel
- Autenticação JWT, papéis RBAC e logs de acesso

## Como executar

**Pré-requisitos:** Node.js 18+, npm, MySQL 8+

### 1. Banco de dados

```bash
mysql -u root -p < database/create_database.sql
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

API: `http://localhost:3000/api` · Health: `GET /api/health`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

App: `http://localhost:4200` — defina `CORS_ORIGINS=http://localhost:4200` no `.env` do backend.

## Contas de teste

| E-mail | Senha | Papel |
|--------|-------|-------|
| admin@acgestao.local | password | admin |
| financeiro@acgestao.local | password | financeiro |
| atendimento@acgestao.local | password | atendimento |
| gestor@acgestao.local | password | gestor |

## Estrutura do projeto

```
├── frontend/     # SPA Angular
├── backend/      # API REST
└── database/     # create_database.sql, schema.sql, seed.sql
```

Regras de negócio (taxa administrativa, bloqueios, juros) em `backend/src/config/constants.js`, configuráveis via `.env`. Uploads de PDF em `backend/uploads/associados/{id}/`.

## Segurança

Senhas com bcrypt, autorização por papéis e exclusão de `senha_hash` nas respostas. Pontos para criptografia de dados sensíveis e endurecimento em produção estão indicados no código.
