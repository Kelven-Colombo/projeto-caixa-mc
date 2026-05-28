import express from "express";
import cors from "cors";
import { iniciarBanco } from "./database.js";
import transacoesRoutes from "./transacoesRoutes.js";
import metodosRoutes from "./metodosRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(transacoesRoutes);
app.use(metodosRoutes);

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
