import React from "react";
import { formataReal, formataData } from "../utils/formatadores.js";

const LinhaTabela = ({ fechamento, selecionados, setSelecionados }) => {
  return (
    <tr
      key={fechamento.data}
      className="border-b hover:cursor-pointer hover:bg-gray-700"
    >
      <td className="p-3">
        <input
          type="checkbox"
          onChange={() => {
            if (selecionados.includes(fechamento.data)) {
              // DESMARCA
              setSelecionados(
                selecionados.filter((dataSalva) => dataSalva !== fechamento.data),
              );
            } else {
              // MARCA
              setSelecionados([...selecionados, fechamento.data]);
            }
          }}
          checked={selecionados.includes(fechamento.data) ? true : false}
        />
      </td>
      <td className="p-3">{formataData(fechamento.data)}</td>
      <td className="p-3">{formataReal.format(fechamento.total_entradas)}</td>
      <td className="p-3">{formataReal.format(fechamento.total_saidas)}</td>
      <td className="p-3">{formataReal.format(fechamento.saldo)}</td>
      <td className="p-3">
        <button className="text-xl font-bold hover:cursor-pointer">⋮</button>
      </td>
    </tr>
  );
};

export default LinhaTabela;
