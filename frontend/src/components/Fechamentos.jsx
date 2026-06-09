import { useEffect, useState } from "react";
import BarraFerramentas from "./BarraFerramentas.jsx";
import CabecalhoTabela from "./CabecalhoTabela.jsx";
import LinhaTabela from "./LinhaTabela.jsx";
import Resumo from "./Resumo.jsx";

const Fechamentos = () => {
  // ─── Estados ─────────────────────────────────────────────────────────────
  const [fechamentos, setFechamentos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // ─── Carregamento de dados ────────────────────────────────────────────────
  async function carregarFechamentos() {
    const resposta = await fetch("http://localhost:3000/fechamentos");
    const dados = await resposta.json();
    setFechamentos(dados.fechamentos);
  }

  useEffect(() => {
    carregarFechamentos();
  }, []);

  // ─── Limpa seleção ao mudar filtro de data ────────────────────────────────
  useEffect(() => {
    setSelecionados([]);
  }, [dataInicial, dataFinal]);

  // ─── Handler: excluir fechamentos selecionados ────────────────────────────
  async function handleExcluirSelecionados() {
    const confirma = window.confirm(
      `Tem certeza que deseja excluir ${selecionados.length} fechamento(s)?`,
    );
    if (!confirma) return;

    try {
      // Deleta cada data selecionada em paralelo
      await Promise.all(
        selecionados.map((data) =>
          fetch(`http://localhost:3000/fechamentos/${data}`, {
            method: "DELETE",
          }),
        ),
      );

      setSelecionados([]);
      carregarFechamentos();
    } catch (error) {
      console.error("Erro ao excluir fechamentos:", error);
    }
  }

  // ─── Lógica de filtro e cálculos do resumo ────────────────────────────────
  const fechamentosFiltrados = fechamentos.filter((fechamento) => {
    if (dataInicial && fechamento.data < dataInicial) return false;
    if (dataFinal && fechamento.data > dataFinal) return false;
    return true;
  });

  const listaResumo =
    selecionados.length > 0
      ? fechamentosFiltrados.filter((f) => selecionados.includes(f.data))
      : fechamentosFiltrados;

  const somaEntradas = listaResumo.reduce(
    (soma, f) => soma + f.total_entradas,
    0,
  );
  const somaSaidas = listaResumo.reduce((soma, f) => soma + f.total_saidas, 0);
  const somaSaldo = listaResumo.reduce((soma, f) => soma + f.saldo, 0);

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 lg:grid-cols-4">
      {/* Tabela de fechamentos */}
      <div className="rounded-xl bg-gray-800 p-4 lg:col-span-3">
        <BarraFerramentas
          dataInicial={dataInicial}
          setDataInicial={setDataInicial}
          dataFinal={dataFinal}
          setDataFinal={setDataFinal}
          selecionados={selecionados}
          onExcluirSelecionados={handleExcluirSelecionados}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-separate border-spacing-0 text-left">
            <thead className="text-gray-200">
              <CabecalhoTabela
                fechamentosFiltrados={fechamentosFiltrados}
                selecionados={selecionados}
                setSelecionados={setSelecionados}
              />
            </thead>
            <tbody>
              {fechamentosFiltrados.map((fechamento) => (
                <LinhaTabela
                  key={fechamento.data}
                  fechamento={fechamento}
                  selecionados={selecionados}
                  setSelecionados={setSelecionados}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Painel de resumo */}
      <Resumo
        somaEntradas={somaEntradas}
        somaSaidas={somaSaidas}
        somaSaldo={somaSaldo}
      />
    </div>
  );
};

export default Fechamentos;
