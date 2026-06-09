import { useEffect, useState } from "react";
import BarraFerramentas from "./BarraFerramentas.jsx";
import CabecalhoTabela from "./CabecalhoTabela.jsx";
import LinhaTabela from "./LinhaTabela.jsx";
import Resumo from "./Resumo.jsx";

// dados
const Fechamentos = () => {

  //Cria o estado(memória) que vai guardar os dados que chegam da requisição
  const [fechamentos, setFechamentos] = useState([]);
  //Faz a requisição
  useEffect(() => {
    async function carregarFechamentos() {
      const resposta = await fetch("http://localhost:3000/fechamentos");
      const dados = await resposta.json();
      setFechamentos(dados.fechamentos);
    }
    carregarFechamentos();
  }, []);

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
  const fechamentosFiltrados = fechamentos.filter((fechamento) => {
    if (dataInicial && fechamento.data < dataInicial) return false;
    if (dataFinal && fechamento.data > dataFinal) return false;
    return true;
  });

  const listaResumo =
    selecionados.length > 0
      ? fechamentosFiltrados.filter((fechamento) =>
          selecionados.includes(fechamento.data),
        )
      : fechamentosFiltrados;

  let somaEntradas = listaResumo.reduce((soma, valorAtual) => {
    return soma + valorAtual.total_entradas;
  }, 0);

  let somaSaidas = listaResumo.reduce((soma, valorAtual) => {
    return soma + valorAtual.total_saidas;
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
