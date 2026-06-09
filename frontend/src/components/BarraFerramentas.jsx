import React from "react";
import { useNavigate } from "react-router-dom";
import BotaoAcao from "./BotaoAcao";

const BarraFerramentas = ({
  dataInicial,
  setDataInicial,
  dataFinal,
  setDataFinal,
  selecionados,
  onExcluirSelecionados,
  ordem,
  setOrdem,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-4">
        <span className="font-bold">De:</span>
        <input
          type="date"
          className="rounded-lg bg-gray-300 p-2 text-slate-900 outline-none"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
        />
        <span className="font-bold">Até:</span>
        <input
          type="date"
          className="rounded-lg bg-gray-300 p-2 text-slate-900 outline-none"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
        />
      </div>

      <div className="mb-2 flex justify-end">
        <button
          onClick={() => setOrdem(ordem === "desc" ? "asc" : "desc")}
          className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
        >
          Data {ordem === "desc" ? "↓" : "↑"}
        </button>
      </div>

      {selecionados.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="font-bold">Selecionados: {selecionados.length}</span>
          <button
            className="hover:cursor-pointer"
            onClick={onExcluirSelecionados}
          >
            ❌
          </button>
        </div>
      )}
      <BotaoAcao onClick={() => navigate("/lancamento")}>
        Novo Lançamento
      </BotaoAcao>
    </nav>
  );
};

export default BarraFerramentas;
