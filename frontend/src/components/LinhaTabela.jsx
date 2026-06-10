import React from "react";
import { useNavigate } from "react-router-dom";
import { formataReal, formataData } from "../utils/formatadores.js";

const LinhaTabela = ({ fechamento, selecionados, setSelecionados }) => {
  const navigate = useNavigate();
  return (
    <tr
      key={fechamento.data}
      className="border-b hover:cursor-pointer hover:bg-gray-700"
      onClick={() => navigate(`/Lancamento/${fechamento.data}`)}
    >
      <td className="p-3">
        <input
          type="checkbox"
          onClick={
            (e) => e.stopPropagation() //impede que o comportamento do evento de click da linha se propague para este elemento em específico
          }
          onChange={() => {
            if (selecionados.includes(fechamento.data)) {
              // DESMARCA
              setSelecionados(
                selecionados.filter(
                  (dataSalva) => dataSalva !== fechamento.data,
                ),
              );
            } else {
              // MARCA
              setSelecionados([...selecionados, fechamento.data]);
            }
          }}
          checked={selecionados.includes(fechamento.data) ? true : false}
        />
      </td>
      <td className="p-3 font-semibold  ">{formataData(fechamento.data)}</td>
      <td className="p-3">{formataReal.format(fechamento.total_entradas)}</td>
      <td className="p-3">{formataReal.format(fechamento.total_saidas)}</td>
      <td className="p-3">{formataReal.format(fechamento.saldo)}</td>
    </tr>
  );
};

export default LinhaTabela;
