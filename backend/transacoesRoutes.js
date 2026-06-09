import express from "express";
import { getDb } from "./database.js";

const router = express.Router();

router.put("/transacoes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { data, metodo_id, valor } = req.body;
    await getDb().run(
      `
        UPDATE transacoes 
        SET data = ?, metodo_id = ?, valor = ? 
        WHERE id = ?`,
      [data, metodo_id, valor, id],
    );
    const transacaoAtualizada = await getDb().get(
      `
        SELECT t.id, t.data, m.nome AS metodo, m.tipo, t.valor
        FROM transacoes t JOIN metodos_pagamento m ON t.metodo_id = m.id
        WHERE t.id = ?`,
      id,
    );
    res.status(200).json({
      mensagem: "Transação atualizada com sucesso!",
      transacaoAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar transação no banco." });
  }
});

router.delete("/fechamentos/:data", async (req, res) => {
  try {
    const { data } = req.params;

    await getDb().run(`DELETE FROM transacoes WHERE data = ?`, data);

    res.status(200).json({ mensagem: "Fechamento deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar fechamento." });
  }
});

router.delete("/transacoes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await getDb().run(`DELETE FROM transacoes WHERE id = ?`, id);
    res.status(200).json({ mensagem: "Transação deletada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

router.get("/transacoes/resumo", async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({ erro: "A data é obrigatória." });
    }

    //sql
    const resumo = await getDb().get(
      `SELECT
        SUM(CASE WHEN m.tipo = 'entrada' THEN t.valor ELSE 0 END) AS total_entradas,
        SUM(CASE WHEN m.tipo = 'saida' THEN t.valor ELSE 0 END) AS total_saidas,
        SUM(CASE WHEN m.nome IN ('Cédulas', 'Moedas') THEN t.valor ELSE 0 END) AS dinheiro_fisico
      FROM transacoes t 
      JOIN metodos_pagamento m ON t.metodo_id = m.id
      WHERE t.data = ?`,
      data,
    );
    res
      .status(200)
      .json({ mensagem: "Operação realizada com sucesso.", resumo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar resumo do caixa." });
  }
});

router.get("/fechamentos", async (req, res) => {
  try {
    //sql
    const fechamentos = await getDb().all(
      `SELECT
        t.data,
        SUM(CASE WHEN m.tipo = 'entrada' THEN t.valor ELSE 0 END) AS total_entradas,
        SUM(CASE WHEN m.tipo = 'saida' THEN t.valor ELSE 0 END) AS total_saidas,
        SUM(CASE WHEN m.tipo = 'entrada' THEN t.valor ELSE 0 END) -
        SUM(CASE WHEN m.tipo = 'saida' THEN t.valor ELSE 0 END) AS saldo
      FROM transacoes t 
      JOIN metodos_pagamento m ON t.metodo_id = m.id
      group by t.data`,
    );
    res
      .status(200)
      .json({ mensagem: "Operação realizada com sucesso.", fechamentos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar fechamentos." });
  }
});

router.get("/transacoes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const transacao = await getDb().get(
      `
      SELECT t.id, t.data, m.nome AS metodo, m.tipo, t.valor
      FROM transacoes t JOIN metodos_pagamento m ON t.metodo_id = m.id
      WHERE t.id = ?`,
      id,
    );
    if (!transacao) {
      return res.status(404).json({ mensagem: "Transação não encontrada" });
    } else {
      return res
        .status(200)
        .json({ mensagem: "Aqui está sua transação: ", transacao });
    }
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

router.get("/transacoes", async (req, res) => {
  if (req.query.data) {
    try {
      const data = req.query.data;
      const transacoes = await getDb().all(
        `SELECT t.id, t.data, m.nome AS metodo, m.tipo, t.valor
        FROM transacoes t JOIN metodos_pagamento m ON t.metodo_id = m.id
        WHERE t.data = ?`,
        data,
      );
      res
        .status(200)
        .json({ mensagem: `Consulta realizada com sucesso!`, transacoes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar transações no banco." });
    }
  } else {
    try {
      // consulta e vincula as duas tabelas, trazendo o NOME do método de pagamento em vez do ID
      const dados = await getDb().all(`
            SELECT t.id, t.data, m.nome AS metodo, m.tipo, t.valor
            FROM transacoes t JOIN metodos_pagamento m ON t.metodo_id = m.id
            ORDER BY t.data DESC
            `);
      res.json(dados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar transações no banco." });
    }
  }
});

router.post("/transacoes", async (req, res) => {
  const { data, valores } = req.body;

  try {
    //Percorre cada método de pagamento enviado no JSON
    for (const [nomeMetodo, valor] of Object.entries(valores)) {
      //1º: busca o ID do método de pagamento baseado no nomeMetodo dentro do sub-objeto "valores"
      const metodo = await getDb().get(
        "SELECT id FROM metodos_pagamento WHERE nome = ?",
        [nomeMetodo],
      );

      if (metodo) {
        //2º: INSERE OU ATUALIZA a transação associando a data e o id que foi encontrado
        await getDb().run(
          "INSERT OR REPLACE INTO transacoes (data, metodo_id, valor) VALUES (?, ?, ?)",
          [data, metodo.id, valor],
        );
      }
    }
    res
      .status(201)
      .json({ mensagem: "Fechamento de caixa salvo com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno ao salvar as transações." });
  }
});

export default router;
