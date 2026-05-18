import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Bem vindo ao Sistema de Caixa da MC Serviços e Variedades!");
})





app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000...`);
});


