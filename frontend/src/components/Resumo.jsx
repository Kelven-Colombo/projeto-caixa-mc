import React from "react";
import { formataReal, formataData } from "../utils/formatadores.js";

const Resumo = ({
  somaEntradas,
  somaSaidas,
  somaSaldo,
  fundoCaixa,
  fundoSeguinte,
  ...props
}) => {
  return (
    <aside className="flex flex-col gap-3 rounded-xl bg-gray-800 p-4 lg:col-span-1">
      <div className="mb-3 text-lg font-bold">Resumo</div>
      <div className="flex justify-between">
        <span className="font-semibold text-green-400">Entradas</span>
        <span>{formataReal.format(somaEntradas)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-red-400">Saídas</span>
        <span>{formataReal.format(somaSaidas)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">Saldo</span>
        <span className="font-bold">{formataReal.format(somaSaldo)}</span>
      </div>

      {fundoCaixa !== undefined && (
        <div className="flex justify-between">
          <span className="font-semibold italic">Fundo Caixa</span>
          <span className="italic">{formataReal.format(fundoCaixa)}</span>
        </div>
      )}

      {fundoSeguinte !== undefined && (
        <div className="flex justify-between">
          <span className="font-semibold italic">Fundo Seguinte</span>
          <span className="italic">{formataReal.format(fundoSeguinte)}</span>
        </div>
      )}
    </aside>
  );
};

export default Resumo;
