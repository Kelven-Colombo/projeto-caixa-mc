import express from "express";
import { db, iniciarBanco } from "./database.js";
import transacoesRoutes from"./transacoesRoutes.js";


const app = express();
app.use(express.json());
app.use(transacoesRoutes);

app.get("/", (req, res) => {
  res.send("Bem vindo ao Sistema de Caixa da MC Serviços e Variedades!");
});

async function conectarBanco() {
  await iniciarBanco();

  app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000...`);
  });
}

conectarBanco();
