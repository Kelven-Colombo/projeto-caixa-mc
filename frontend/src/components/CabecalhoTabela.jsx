import React from "react";

const CabecalhoTabela = ({ fechamentosFiltrados, selecionados, setSelecionados }) => {
  return (
    <tr>
      <th className="w-12 rounded-tl-lg bg-gray-700 p-3">
        <input
          type="checkbox"
          checked={
            fechamentosFiltrados.length === selecionados.length ? true : false
          }
          onChange={() => {
            if (fechamentosFiltrados.length === selecionados.length) {
              setSelecionados([]);
            } else {
              setSelecionados(
                fechamentosFiltrados.map((fechamento) => fechamento.data),
              );
            }
          }}
        />
      </th>
      <th className="bg-gray-700 p-3">Data</th>
      <th className="bg-gray-700 p-3">Entradas</th>
      <th className="bg-gray-700 p-3">Saídas</th>
      <th className="rounded-tr-lg bg-gray-700 p-3">Saldo</th>
    </tr>
  );
};

export default CabecalhoTabela;
