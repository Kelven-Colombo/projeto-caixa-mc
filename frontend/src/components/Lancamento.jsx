import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formataData } from "../utils/formatadores";
import BotaoAcao from "./BotaoAcao";
import Resumo from "./Resumo";

const Lancamento = () => {
  // ─── Navegação e parâmetro de rota ───────────────────────────────────────
  const navigate = useNavigate();
  const dataParam = useParams().data;

  // ─── Estados ─────────────────────────────────────────────────────────────
  const hoje = new Date().toISOString().split("T")[0];
  const [data, setData] = useState(dataParam || hoje);
  const [tabelaMetodos, setTabelaMetodos] = useState([]);
  const [metodos, setMetodos] = useState({});
  const [fundoCaixa, setFundoCaixa] = useState(0);

  // ─── Data anterior (para cálculo do fundo) ───────────────────────────────
  const dataAnterior = new Date(data + "T00:00:00");
  dataAnterior.setDate(dataAnterior.getDate() - 1);
  const dataAnteriorFormatada = dataAnterior.toISOString().split("T")[0];

  // ─── Efeito 1: carrega lista de métodos do banco ─────────────────────────
  useEffect(() => {
    async function carregarTabelaMetodos() {
      const resposta = await fetch("http://localhost:3000/metodos");
      const dados = await resposta.json();
      setTabelaMetodos(dados);
    }
    carregarTabelaMetodos();
  }, []);

  // ─── Efeito 2: calcula fundo de caixa do dia anterior ────────────────────
  useEffect(() => {
    async function calcularFundo() {
      const resposta = await fetch(
        `http://localhost:3000/transacoes?data=${dataAnteriorFormatada}`,
      );
      const dados = await resposta.json();

      if (!dados.transacoes || dados.transacoes.length === 0) {
        setFundoCaixa(0);
        return;
      }

      const fundo = dados.transacoes
        .filter((t) => t.metodo === "Cédulas" || t.metodo === "Moedas")
        .reduce((soma, t) => soma + t.valor, 0);

      setFundoCaixa(fundo);
    }
    calcularFundo();
  }, [data]);

  // ─── Efeito 3: monta objeto de valores do formulário ─────────────────────
  // Depende de tabelaMetodos e fundoCaixa — roda quando qualquer um muda.
  // A guarda (length === 0) evita montar objeto vazio antes dos métodos chegarem.
  useEffect(() => {
    if (tabelaMetodos.length === 0) return;

    const objetoZerado = tabelaMetodos.reduce((acumulador, metodoAtual) => {
      const valorInicial = metodoAtual.nome === "Fundo Caixa" ? fundoCaixa : 0;
      return { ...acumulador, [metodoAtual.nome]: valorInicial };
    }, {});

    async function carregarTransacoesExistentes() {
      const resposta = await fetch(
        `http://localhost:3000/transacoes?data=${data}`,
      );
      const dados = await resposta.json();

      if (!dados.transacoes || dados.transacoes.length === 0) {
        setMetodos(objetoZerado);
        return;
      }

      const objetoPreenchido = dados.transacoes.reduce(
        (acumulador, transacao) => {
          return { ...acumulador, [transacao.metodo]: transacao.valor };
        },
        objetoZerado,
      );

      setMetodos(objetoPreenchido);
    }
    carregarTransacoesExistentes();
  }, [data, tabelaMetodos, fundoCaixa]);

  // ─── Cálculos do resumo ───────────────────────────────────────────────────
  const somaEntradas = tabelaMetodos
    .filter((m) => m.tipo === "entrada")
    .reduce((soma, m) => soma + (metodos[m.nome] || 0), 0);

  const somaSaidas = tabelaMetodos
    .filter((m) => m.tipo === "saida")
    .reduce((soma, m) => soma + (metodos[m.nome] || 0), 0);

  const saldo = somaEntradas - somaSaidas;
  const fundoSeguinte = (metodos["Cédulas"] || 0) + (metodos["Moedas"] || 0);

  // ─── Handler de salvar ────────────────────────────────────────────────────
  async function handleSalvar() {
    try {
      const confirma = window.confirm(
        "Tem certeza que deseja salvar o fechamento?",
      );
      if (!confirma) return;

      const resposta = await fetch("http://localhost:3000/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, valores: metodos }),
      });

      if (!resposta.ok) {
        console.error("Erro do servidor:", resposta.status);
        return;
      }

      navigate("/Fechamentos");
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  }

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 lg:grid-cols-4">
      {/* Formulário de lançamento */}
      <div className="rounded-xl bg-gray-800 p-4 lg:col-span-3">
        {/* Cabeçalho com título e seletor de data */}
        <nav className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-lg font-bold">Lançamento</span>
          <input
            type="date"
            className="rounded-lg bg-gray-300 p-2 text-slate-900 outline-none"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </nav>

        {/* Lista de inputs por método */}
        {Object.entries(metodos).map(([nomeMetodo, valor]) => {
          const metodoInfo = tabelaMetodos.find((m) => m.nome === nomeMetodo);
          return (
            <div
              key={nomeMetodo}
              className="flex items-center justify-between border-b border-gray-700 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    metodoInfo?.tipo === "entrada"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                />
                <label
                  htmlFor={nomeMetodo}
                  className="text-md w-40 font-semibold"
                >
                  {nomeMetodo}
                </label>
              </div>
              <input
                id={nomeMetodo}
                type="number"
                value={valor}
                onChange={(e) =>
                  setMetodos({
                    ...metodos,
                    [nomeMetodo]: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-36 rounded-md bg-gray-600 p-2 text-right outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          );
        })}

        <div className="mt-4">
          <BotaoAcao onClick={handleSalvar}>Salvar</BotaoAcao>
        </div>
      </div>

      {/* Painel de resumo */}
      <Resumo
        somaEntradas={somaEntradas}
        somaSaidas={somaSaidas}
        somaSaldo={saldo}
        fundoCaixa={fundoCaixa}
        fundoSeguinte={fundoSeguinte}
      />
    </div>
  );
};

export default Lancamento;
