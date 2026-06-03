import { useEffect, useState } from "react";
import BarraFerramentas from "./BarraFerramentas.jsx";
import CabecalhoTabela from "./CabecalhoTabela.jsx";
import LinhaTabela from "./LinhaTabela.jsx";
import Resumo from "./Resumo.jsx";

// dados
const Fechamentos = () => {
  const mockLancamentos = [
    { id: 1, data: "2026-05-01", entradas: 1500.0, saidas: 0, saldo: 1500.0 },
    { id: 2, data: "2026-05-05", entradas: 0, saidas: 300.5, saldo: 1199.5 },
    { id: 3, data: "2026-05-10", entradas: 200.0, saidas: 0, saldo: 1399.5 },
  ];
  // ESTADOS
  // checkbox
  const [selecionados, setSelecionados] = useState([]);

  // date
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  //hook
  useEffect(() => {
    setSelecionados([]);
  }, [dataInicial, dataFinal]);

  // lógica de atualização da seção Resumo
  const lancamentosFiltrados = mockLancamentos.filter((lancamento) => {
    if (dataInicial && lancamento.data < dataInicial) return false;
    if (dataFinal && lancamento.data > dataFinal) return false;
    return true;
  });

  const listaResumo =
    selecionados.length > 0
      ? lancamentosFiltrados.filter((lancamento) =>
          selecionados.includes(lancamento.id),
        )
      : lancamentosFiltrados;

  let somaEntradas = listaResumo.reduce((soma, valorAtual) => {
    return soma + valorAtual.entradas;
  }, 0);

  let somaSaidas = listaResumo.reduce((soma, valorAtual) => {
    return soma + valorAtual.saidas;
  }, 0);

  let somaSaldo = listaResumo.reduce((soma, valorAtual) => {
    return soma + valorAtual.saldo;
  }, 0);

  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 lg:grid-cols-4">
      {/* lista */}
      <div className="rounded-xl bg-gray-800 p-4 lg:col-span-3">
        {/* Barra de ferramentas */}
        <BarraFerramentas
          dataInicial={dataInicial}
          setDataInicial={setDataInicial}
          dataFinal={dataFinal}
          setDataFinal={setDataFinal}
          selecionados={selecionados}
        ></BarraFerramentas>

        {/* Tabela Lista */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-separate border-spacing-0 text-left">
            <thead className="text-gray-200">
              <CabecalhoTabela
                lancamentosFiltrados={lancamentosFiltrados}
                selecionados={selecionados}
                setSelecionados={setSelecionados}
              />
            </thead>
            <tbody>
              {lancamentosFiltrados.map((lancamento) => (
                <LinhaTabela
                  key={lancamento.id}
                  lancamento={lancamento}
                  selecionados={selecionados}
                  setSelecionados={setSelecionados}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Resumo */}
      <Resumo
        somaEntradas={somaEntradas}
        somaSaidas={somaSaidas}
        somaSaldo={somaSaldo}
      />{" "}
    </div>
  );
};

export default Fechamentos;
