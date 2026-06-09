import React, { useEffect, useState } from "react";
import BotaoAcao from "./BotaoAcao";

const Configuracoes = () => {
  // ─── Estados ─────────────────────────────────────────────────────────────
  const [tabelaMetodos, setTabelaMetodos] = useState([]);
  const [menuAcao, setMenuAcao] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("entrada");

  // ─── Carregamento de dados ────────────────────────────────────────────────
  async function carregarTabelaMetodos() {
    const resposta = await fetch("http://localhost:3000/metodos");
    const dados = await resposta.json();
    setTabelaMetodos(dados);
  }

  useEffect(() => {
    carregarTabelaMetodos();
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────
  async function handleAdicionar() {
    try {
      const confirma = window.confirm(
        "Tem certeza que deseja adicionar o novo método?",
      );
      if (!confirma) return;

      const resposta = await fetch("http://localhost:3000/metodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tipo }),
      });

      if (!resposta.ok) {
        resposta.status === 409
          ? alert("Já existe um método com esse nome!")
          : console.error("Erro do servidor:", resposta.status);
        return;
      }

      carregarTabelaMetodos();
      setNome("");
    } catch (error) {
      console.error("Erro ao adicionar método:", error);
    }
  }

  async function handleEditar(id) {
    try {
      const resposta = await fetch(`http://localhost:3000/metodos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tipo }),
      });

      if (!resposta.ok) {
        resposta.status === 409
          ? alert("Já existe um método com esse nome!")
          : console.error("Erro do servidor:", resposta.status);
        return;
      }

      carregarTabelaMetodos();
      setModoEdicao(null);
    } catch (error) {
      console.error("Erro ao editar método:", error);
    }
  }

  async function handleExcluir(id) {
    try {
      const confirma = window.confirm(
        "Tem certeza que deseja excluir o método?",
      );
      if (!confirma) return;

      const resposta = await fetch(`http://localhost:3000/metodos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!resposta.ok) {
        console.error("Erro do servidor:", resposta.status);
        return;
      }

      carregarTabelaMetodos();
    } catch (error) {
      console.error("Erro ao excluir método:", error);
    }
  }

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 lg:grid-cols-4">
      {/* Tabela de métodos cadastrados */}
      <div className="rounded-xl bg-gray-800 p-4 lg:col-span-3">
        <table className="w-full min-w-max border-separate border-spacing-0 text-left">
          <thead className="text-gray-200">
            <tr>
              <th className="rounded-tl-lg bg-gray-700 p-3">Nome</th>
              <th className="bg-gray-700 p-3">Tipo</th>
              <th className="w-12 rounded-tr-lg bg-gray-700 p-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {tabelaMetodos.map((metodo) => (
              <tr key={metodo.id} className="border-b hover:bg-gray-700">
                <td className="p-3">{metodo.nome}</td>
                <td className="p-3">
                  {metodo.tipo === "entrada" ? "Entrada" : "Saída"}
                </td>
                <td className="relative p-3">
                  {/* Botão de ações ⋮ */}
                  <button
                    className="font-extrabold hover:cursor-pointer"
                    onClick={() =>
                      setMenuAcao(menuAcao === metodo.id ? null : metodo.id)
                    }
                  >
                    ⋮
                  </button>

                  {/* Dropdown de ações */}
                  {menuAcao === metodo.id && (
                    <div className="absolute right-0 z-10 mt-1 w-32 rounded-lg bg-gray-700 shadow-lg">
                      <button
                        className="block w-full cursor-pointer rounded-t-lg px-4 py-2 text-left hover:bg-gray-600"
                        onClick={() => {
                          setModoEdicao(metodo);
                          setNome(metodo.nome);
                          setTipo(metodo.tipo);
                          setMenuAcao(null);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="block w-full cursor-pointer rounded-b-lg px-4 py-2 text-left hover:bg-gray-600"
                        onClick={() => handleExcluir(metodo.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulário — Adicionar novo método */}
      <aside className="flex flex-col gap-3 rounded-xl bg-gray-800 p-4 lg:col-span-1">
        <div className="mb-3 text-lg font-bold">Adicionar novo método</div>
        <div className="flex justify-between">
          <label htmlFor="nome" className="font-bold">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-40 rounded-md bg-gray-700 p-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="tipo" className="font-bold">
            Tipo
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-40 cursor-pointer rounded-md bg-gray-700 p-2 outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div className="mt-2">
          <BotaoAcao onClick={handleAdicionar}>Adicionar</BotaoAcao>
        </div>
      </aside>

      {/* Modal — Editar método */}
      {modoEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-xl bg-gray-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold">Editar método</span>
              <button
                className="cursor-pointer text-lg font-bold"
                onClick={() => setModoEdicao(null)}
              >
                ✕
              </button>
            </div>
            <div className="mb-3 flex justify-between">
              <label htmlFor="nome-edicao">Nome</label>
              <input
                id="nome-edicao"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="mb-4 flex justify-between">
              <label htmlFor="tipo-edicao">Tipo</label>
              <select
                id="tipo-edicao"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <BotaoAcao onClick={() => handleEditar(modoEdicao.id)}>
              Salvar
            </BotaoAcao>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;
