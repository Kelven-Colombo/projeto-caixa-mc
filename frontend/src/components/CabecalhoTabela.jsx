import React from "react";

const CabecalhoTabela = ({ lancamentosFiltrados, selecionados, setSelecionados }) => {
  return (
    <tr>
      <th className="w-12 rounded-tl-lg bg-gray-700 p-3">
        <input
          type="checkbox"
          checked={
            lancamentosFiltrados.length === selecionados.length ? true : false
          }
          onChange={() => {
            if (lancamentosFiltrados.length === selecionados.length) {
              setSelecionados([]);
            } else {
              setSelecionados(
                lancamentosFiltrados.map((lancamento) => lancamento.id),
              );
            }
          }}
        />
      </th>
      <th className="bg-gray-700 p-3">Data</th>
      <th className="bg-gray-700 p-3">Entradas</th>
      <th className="bg-gray-700 p-3">Saídas</th>
      <th className="bg-gray-700 p-3">Saldo</th>
      <th className="w-12 rounded-tr-lg bg-gray-700 p-3"></th>
    </tr>
  );
};

export default CabecalhoTabela;
