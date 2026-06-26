import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function iniciarBanco() {
  db = await open({
    filename: path.join(__dirname, "database.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS metodos_pagamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            tipo TEXT NOT NULL,
            ativo INTEGER NOT NULL DEFAULT 1
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

function getDb() {
  return db;
}

export { getDb, iniciarBanco };
