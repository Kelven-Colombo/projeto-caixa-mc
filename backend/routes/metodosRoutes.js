import express from "express";
import { getDb } from "../database/database.js";

const router = express.Router();

router.put("/metodos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, tipo } = req.body;
    await getDb().run(
      `
        UPDATE metodos_pagamento
        SET nome = ?, tipo = ?
        WHERE id = ?`,
      [nome, tipo, id],
    );
    const metodoAtualizado = await getDb().get(
      `
        SELECT id, nome, tipo
        FROM metodos_pagamento
        WHERE id = ?`,
      [id],
    );
    res.status(200).json({
      mensagem: "Método atualizado com sucesso!",
      metodoAtualizado,
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res
        .status(409)
        .json({ mensagem: "Método já existente!", error: error.message });
    } else {
      return res.status(500).json({ erro: error.message });
    }
  }
});

router.delete("/metodos/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await getDb().run(
      `UPDATE metodos_pagamento
        SET ativo = 0
        WHERE id = ?`,
      [id],
    );
    res.status(200).json({ mensagem: "Método inativado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

router.get("/metodos/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const metodo = await getDb().get(
      `
      SELECT id, nome, tipo, ativo
      FROM metodos_pagamento
      WHERE ativo = 1 AND id = ?`,
      [id],
    );
    if (!metodo) {
      return res.status(404).json({ mensagem: "Método não encontrado" });
    } else {
      return res
        .status(200)
        .json({ mensagem: "Aqui está seu método: ", metodo });
    }
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

router.get("/metodos", async (req, res) => {
  try {
    const dados = await getDb().all(`
            SELECT id, nome, tipo, ativo
            FROM metodos_pagamento
            WHERE ativo = 1`);
    res.json(dados);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

router.post("/metodos", async (req, res) => {
  const { nome, tipo } = req.body;

  try {
    // Verifica se o método já existe e está inativo
    const existeInativo = await getDb().get(
      "SELECT id FROM metodos_pagamento WHERE nome = ? AND ativo = 0",
      [nome],
    );

    if (existeInativo) {
      // Reativa em vez de criar novo
      await getDb().run(
        "UPDATE metodos_pagamento SET ativo = 1, tipo = ? WHERE id = ?",
        [tipo, existeInativo.id],
      );
      return res
        .status(200)
        .json({ mensagem: "Método reativado com sucesso!" });
    }

    // Adiciona novo método normalmente
    await getDb().run(
      "INSERT INTO metodos_pagamento (nome, tipo) VALUES (?, ?)",
      [nome, tipo],
    );
    res.status(201).json({ mensagem: "Novo método adicionado com sucesso!" });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res
        .status(409)
        .json({ mensagem: "Método já existente!", error: error.message });
    } else {
      return res.status(500).json({ erro: error.message });
    }
  }
});

export default router;
