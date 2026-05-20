import express from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const app = express();
app.use(express.json());

let db;

async function iniciarBanco() {
    db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS metodos_pagamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            tipo TEXT NOT NULL
        );
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS transacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        metodo_id INTEGER NOT NULL,
        valor REAL NOT NULL DEFAULT 0,
        FOREIGN KEY (metodo_id) references metodos_pagamento(id),
        UNIQUE(data, metodo_id)
        );
    `);

// Alimenta a tabela com os métodos fixos usando aspas simples para os valores SQL
    await db.exec(`
        INSERT OR IGNORE INTO metodos_pagamento (nome, tipo) VALUES
        ('C6', 'entrada'),
        ('Laranjinha', 'entrada'),
        ('Stone G', 'entrada'),
        ('Getnet', 'entrada'),
        ('Pix', 'entrada'),
        ('Moedas', 'entrada'),
        ('Cédulas', 'entrada'),
        ('Retirada (Sangria)', 'entrada'),
        ('RecargaPay', 'saida'),
        ('Fundo Caixa', 'saida');
    `);

  console.log(
    "Banco de dados SQLite conectado com sucesso! Tabela Inicializada.",
  );
  return db;
}


app.get("/", (req, res) => {
  res.send("Bem vindo ao Sistema de Caixa da MC Serviços e Variedades!");
});

app.get("/transacoes", async (req, res) => {
    try {
        // consulta e vincula as duas tabelas, trazendo o NOME do método de pagamento em vez do ID
        const dados = await db.all(`
            SELECT t.data, m.nome AS metodo, m.tipo, t.valor
            FROM transacoes t JOIN metodos_pagamento m ON t.metodo_id = m.id
            ORDER BY t.data DESC
            `);
        res.json(dados)
    } catch(erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar transações no banco." });
    }
});

app.post("/transacoes", async (req, res) => {
    const { data, valores } = req.body;

    try {
        //Percorre cada método de pagamento enviado no JSON
        for (const [nomeMetodo, valor] of Object.entries(valores)) {
            
            //1º: busca o ID do método de pagamento baseado no nomeMetodo dentro do sub-objeto "valores"
            const metodo = await db.get(
                "SELECT id FROM metodos_pagamento WHERE nome = ?", [nomeMetodo]
            );

            if (metodo) {
                //2º: insere OU ATUALIZA a transação associando a data e o id que foi encontrado
                await db.run(
                    "INSERT OR REPLACE INTO transacoes (data, metodo_id, valor) VALUES (?, ?, ?)",[data,metodo.id, valor]
                );
            }
        }
        res.status(201).json({ mensagem: "Fechamento de caixa salvo com sucesso!" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro interno ao salvar as transações." });
    }
});


async function conectarBanco() {
  await iniciarBanco();

  app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000...`);
  });
}

conectarBanco();
