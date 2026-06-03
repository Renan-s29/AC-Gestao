# AC-Gestão — Protótipo Full Stack

Sistema de gestão para **Associação Comercial** (protótipo demonstrativo), refeito para seguir o documento do P1: Dashboard, Ficha Digital, Benefícios/Saúde, Financeiro, Relatórios, segurança/LGPD e DER relacional em português.

## Estrutura

- `frontend/` — Angular 17 + TypeScript + SCSS + Angular Material  
- `backend/` — Node.js + Express (JavaScript) + JWT + RBAC + MySQL  
- `database/` — `create_database.sql`, `schema.sql`, `seed.sql`

## Pré-requisitos

- Node.js 18+ e npm  
- MySQL 8+  
- Angular CLI (opcional; o `package.json` já inclui `@angular/cli` localmente)

## Banco de dados (MySQL)

O banco foi ajustado para usar as entidades do documento: `associado`, `dependente`, `plano_saude`, `faturamento`, `consulta_scpc`, `log_acesso`, `usuario` e `documento`.

1. Crie o banco e as tabelas:

```bash
mysql -u root -p < database/create_database.sql  # apaga e recria ac_gestao
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

2. Ajuste credenciais no backend: copie `backend/.env.example` para `backend/.env`.

## Backend (API)

```bash
cd backend
npm install
copy .env.example .env   # Windows — edite DB_PASSWORD e JWT_SECRET
npm run dev
```

API padrão: `http://localhost:3000/api`  
Healthcheck: `GET http://localhost:3000/api/health`

### Usuários de teste (seed)

| E-mail                     | Senha    | Papel        |
|---------------------------|----------|--------------|
| admin@acgestao.local      | password | admin        |
| financeiro@acgestao.local | password | financeiro   |
| atendimento@acgestao.local| password | atendimento  |
| gestor@acgestao.local     | password | gestor       |

> O hash bcrypt no `seed.sql` corresponde à senha **`password`**.

### Exemplos de chamadas (com JWT)

1. Login:

```bash
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@acgestao.local\",\"senha\":\"password\"}"
```

2. Listar associados (substitua `TOKEN`):

```bash
curl -s http://localhost:3000/api/associados ^
  -H "Authorization: Bearer TOKEN"
```

3. Gerar faturamento mensal:

```bash
curl -s -X POST http://localhost:3000/api/faturamentos/gerar-mensal ^
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" ^
  -d "{\"referencia_mes\":\"2026-05\"}"
```

4. Exportar Excel:

```bash
curl -s "http://localhost:3000/api/relatorios/excel?status=pendente" ^
  -H "Authorization: Bearer TOKEN" --output faturamentos.xlsx
```

## Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Aplicação: `http://localhost:4200`  
Configure CORS no `.env` do backend (`CORS_ORIGINS=http://localhost:4200`).

## Funcionalidades alinhadas ao protótipo

- Dashboard com busca inteligente, alertas, pendências e indicadores.
- Ficha digital do associado com dados cadastrais, histórico e upload de PDFs.
- Módulo de saúde/benefícios com dependentes, plano, status e carência.
- Módulo financeiro com mensalidades, juros, multa e bloqueio por inadimplência.
- Relatórios com filtros e exportação.
- JWT + RBAC + logs para atender os pontos de segurança/LGPD do P1.

## Regras de negócio (backend)

Constantes em `backend/src/config/constants.js` (sobrescrevíveis por `.env`):

- `TAXA_ADMINISTRATIVA` (padrão **40** reais por beneficiário ativo)  
- `DIAS_BLOQUEIO_BENEFICIOS` (**5** dias) — bloqueio de benefícios  
- `DIAS_SUSPENSAO_TOTAL` (**30** dias) — suspensão do associado  
- `PERCENTUAL_JUROS_DIA`, `PERCENTUAL_MULTA` — cálculo em faturas pendentes  

O serviço `financeiroAssociadoService` sincroniza o **status** do associado após operações de faturamento.

## LGPD / segurança (protótipo)

- Senhas com **bcrypt**; autenticação **JWT**; autorização **RBAC** (`admin`, `financeiro`, `atendimento`, `gestor`).  
- `senha_hash` **não** é retornado nas respostas de usuário.  
- Comentários no código indicam pontos para **criptografia de dados sensíveis** (CPF/CNPJ/e-mail) e controles adicionais em produção.

## Pastas importantes

- Uploads de PDF: `backend/uploads/associados/{id}/` (criada em runtime).

---

Este repositório é um **protótipo** para apresentação: prioriza clareza e fluxo completo em detrimento de casos extremos de produção.


## Observação importante

Este ZIP foi limpo para entrega: não inclui `node_modules`. Rode `npm install` dentro de `backend/` e `frontend/` antes de testar.
