import React from "react";
import { formataReal, formataData} from "../utils/formatadores.js"

const Resumo = ({ somaEntradas, somaSaidas, somaSaldo }) => {
  return (
    <aside className="flex flex-col gap-3 rounded-xl bg-gray-800 p-4 lg:col-span-1">
      <div className="mb-3 text-lg font-bold">Resumo</div>
      <div className="flex justify-between">
        <span className="font-semibold">Entradas</span>
        <span>{formataReal.format(somaEntradas)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Saídas</span>
        <span>{formataReal.format(somaSaidas)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Saldo</span>
        <span>{formataReal.format(somaSaldo)}</span>
      </div>
    </aside>
  );
};

export default Resumo;
