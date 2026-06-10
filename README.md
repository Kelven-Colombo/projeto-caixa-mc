# 🧾 Caixa MC — Sistema de Gestão de Fechamento de Caixa

Sistema web full-stack desenvolvido para a **MC Serviços e Variedades** (Manaus/AM), substituindo planilhas Excel manuais por uma solução digital de controle financeiro diário.

Projeto de Extensão Universitária — Análise e Desenvolvimento de Sistemas (Wyden/Martha Falcão).

---

## ✨ Funcionalidades

- **Fechamentos:** histórico de fechamentos diários com filtro por período, ordenação por data e painel de resumo financeiro (entradas, saídas, saldo)
- **Lançamento:** formulário dinâmico com campos por método de pagamento, indicadores visuais de entrada/saída, resumo em tempo real e cálculo automático do Fundo de Caixa com base no dia anterior
- **Configurações:** gerenciamento de métodos de pagamento (adicionar, editar, desativar)

---

## 🛠️ Stack

**Backend**
- Node.js + Express
- SQLite (via `sqlite` + `sqlite3`)
- Nodemon (desenvolvimento)

**Frontend**
- React + Vite
- Tailwind CSS
- React Router DOM

---

## 🗄️ Modelagem do Banco de Dados

```sql
-- Métodos de pagamento cadastrados
CREATE TABLE metodos_pagamento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL,  -- 'entrada' ou 'saida'
  ativo INTEGER NOT NULL DEFAULT 1
);

-- Transações do fechamento diário
CREATE TABLE transacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  metodo_id INTEGER NOT NULL,
  valor REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (metodo_id) REFERENCES metodos_pagamento(id),
  UNIQUE(data, metodo_id)
);
```

---

## 🚀 Como executar

**Pré-requisitos:** Node.js instalado

```bash
# Clone o repositório
git clone https://github.com/Kelven-Colombo/projeto-caixa-mc.git
cd projeto-caixa-mc

# Backend
cd backend
npm install
npm run dev

# Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

O backend sobe na porta `3000` e o frontend na porta `5173`.

---

## 📁 Estrutura do Projeto

```
projeto-caixa-mc/
├── backend/
│   ├── index.js              # Servidor Express
│   ├── database.js           # Conexão SQLite e seed inicial
│   ├── transacoesRoutes.js   # Rotas de transações e fechamentos
│   └── metodosRoutes.js      # Rotas de métodos de pagamento
└── frontend/
    └── src/
        ├── components/
        │   ├── Fechamentos.jsx
        │   ├── Lancamento.jsx
        │   ├── Configuracoes.jsx
        │   ├── NavBar.jsx
        │   ├── Resumo.jsx
        │   ├── BarraFerramentas.jsx
        │   ├── CabecalhoTabela.jsx
        │   ├── LinhaTabela.jsx
        │   └── BotaoAcao.jsx
        └── utils/
            └── formatadores.js
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/fechamentos` | Lista todos os fechamentos agrupados por dia |
| GET | `/transacoes` | Lista transações (filtro opcional: `?data=YYYY-MM-DD`) |
| GET | `/transacoes/resumo` | Resumo financeiro de um dia específico |
| GET | `/transacoes/:id` | Busca transação por ID |
| POST | `/transacoes` | Salva fechamento do dia |
| PUT | `/transacoes/:id` | Atualiza uma transação |
| DELETE | `/transacoes/:id` | Remove uma transação |
| DELETE | `/fechamentos/:data` | Remove todas as transações de uma data |
| GET | `/metodos` | Lista métodos de pagamento ativos |
| GET | `/metodos/:id` | Busca método por ID |
| POST | `/metodos` | Cria novo método (ou reativa se existir inativo) |
| PUT | `/metodos/:id` | Atualiza nome e tipo do método |
| DELETE | `/metodos/:id` | Desativa método (soft delete) |

---

## 👨‍💻 Autor

**Kelven Colombo**
- GitHub: [@Kelven-Colombo](https://github.com/Kelven-Colombo)
- Curso: Análise e Desenvolvimento de Sistemas — Wyden/Martha Falcão (EAD)

---

## 📋 Próximos passos

- [ ] Exportação para CSV/XLSX via SheetJS
- [ ] Migração para PostgreSQL + Supabase
- [ ] Empacotamento desktop com Electron
- [ ] Modal de confirmação com resumo antes de salvar