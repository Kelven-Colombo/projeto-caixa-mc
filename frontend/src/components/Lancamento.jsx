import React, { useEffect, useState } from "react";
import { formataData } from "../utils/formatadores";
import BotaoAcao from "./BotaoAcao";
import Resumo from "./Resumo";

const Lancamento = () => {
  //Cria o estado(memória) que vai guardar os dados que chegam da requisição
  const [tabelaMetodos, setTabelaMetodos] = useState([]);

  //Faz a requisição
  useEffect(() => {
    async function carregarTabelaMetodos() {
      const resposta = await fetch("http://localhost:3000/metodos");
      const dados = await resposta.json();
      setTabelaMetodos(dados);
    }
    carregarTabelaMetodos();
  }, []);

  //cria o estado para a versão condensada da tabelaMetodos
  const [metodos, setMetodos] = useState({});

  // extrai apenas os nomes dos métodos e cria um novo objeto {nomeMetodo: valor}
  useEffect(() => {
    setMetodos(
      tabelaMetodos.reduce((acumulador, metodoAtual) => {
        return { ...acumulador, [metodoAtual.nome]: 0 };
      }, {}),
    );
  }, [tabelaMetodos]);
  console.log(metodos);

  const hoje = new Date().toISOString().split("T")[0];
  const [data, setData] = useState(hoje);

  const somaEntradas = tabelaMetodos
    .filter((metodo) => metodo.tipo === "entrada") //retorna um novo array filtrado (Sem chaves ou entre (parênteses), o retorno é automático)
    .reduce((acumulador, metodoAtual) => {
      return acumulador + (metodos[metodoAtual.nome] || 0);
    }, 0);

  const somaSaidas = tabelaMetodos
    .filter((metodo) => metodo.tipo === "saida")
    .reduce((acumulador, metodoAtual) => {
      return acumulador + (metodos[metodoAtual.nome] || 0);
    }, 0);

  const saldo = somaEntradas - somaSaidas;

  async function handleSalvar() {
    try {
      const resposta = await fetch("http://localhost:3000/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, valores: metodos }),
      });

      if (!resposta.ok) {
        console.error("Erro do servidor: ", resposta.status);
        return;
      }

      console.log("Salvo com sucesso!");
    } catch (error) {
      return console.error("Erro ao salvar transação", error);
    }
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 lg:grid-cols-4">
      {/* lista de inputs dos métodos */}
      <div className="rounded-xl bg-gray-800 p-4 lg:col-span-3">
        <nav className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-bold">Lançamento</span>

          <input
            type="date"
            className="rounded-lg bg-gray-300 p-2 text-slate-900 outline-none"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <span className="font-bold">{formataData(data)}</span>
        </nav>

        {Object.entries(metodos).map(([nomeMetodo, valor]) => (
          <div key={nomeMetodo}>
            <label htmlFor={nomeMetodo}>{nomeMetodo}</label>
            <input
              id={nomeMetodo}
              type="number"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => {
                setMetodos({
                  ...metodos,
                  [nomeMetodo]: parseFloat(e.target.value) || 0,
                });
                console.log(metodos);
              }}
            />
          </div>
        ))}
        <BotaoAcao onClick={handleSalvar}>Salvar</BotaoAcao>
      </div>
      <Resumo
        somaEntradas={somaEntradas}
        somaSaidas={somaSaidas}
        somaSaldo={saldo}
      />
    </div>
  );
};

export default Lancamento;
