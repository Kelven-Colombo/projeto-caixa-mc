import React from "react";
import { formataReal, formataData } from "../utils/formatadores.js";

const LinhaTabela = ({ lancamento, selecionados, setSelecionados }) => {
  return (
    <tr
      key={lancamento.id}
      className="border-b hover:cursor-pointer hover:bg-gray-700"
    >
      <td className="p-3">
        <input
          type="checkbox"
          onChange={() => {
            if (selecionados.includes(lancamento.id)) {
              // DESMARCA
              setSelecionados(
                selecionados.filter((idSalvo) => idSalvo !== lancamento.id),
              );
            } else {
              // MARCA
              setSelecionados([...selecionados, lancamento.id]);
            }
          }}
          checked={selecionados.includes(lancamento.id) ? true : false}
        />
      </td>
      <td className="p-3">{formataData(lancamento.data)}</td>
      <td className="p-3">{formataReal.format(lancamento.entradas)}</td>
      <td className="p-3">{formataReal.format(lancamento.saidas)}</td>
      <td className="p-3">{formataReal.format(lancamento.saldo)}</td>
      <td className="p-3">
        <button className="text-xl font-bold hover:cursor-pointer">⋮</button>
      </td>
    </tr>
  );
};

export default LinhaTabela;
