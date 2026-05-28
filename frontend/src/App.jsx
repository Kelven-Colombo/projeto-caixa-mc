import { useState, useEffect } from "react";

function App() {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    async function carregarTransacoes() {
      //faz a requisição pro back-end
      const resposta = await fetch("http://localhost:3000/transacoes");
      //converte a resposta bruta pra JSON
      const dados = await resposta.json();
      //guarda os dados na memoria do useState
      setTransacoes(dados);
    }
    //chama a função de atualiza a tela
    carregarTransacoes();
  }, []);

  return (
    <div>
      <h1>Caixa MC Serviços</h1>
      <div>
        {transacoes.map((t) => (<p key={t.id}>{t.metodo}: R$ {t.valor}</p>))}
      </div>
    </div>
  );
}

export default App;
