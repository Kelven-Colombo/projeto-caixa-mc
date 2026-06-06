import { Routes, Route, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Fechamentos from "./components/Fechamentos";
import Lancamento from "./components/Lancamento";
import Configuracoes from "./components/Configuracoes";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />

      <div className="flex min-h-screen bg-slate-900 p-5 text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/Fechamentos" />} />
          <Route path="/Fechamentos" element={<Fechamentos />} />
          <Route path="/Lancamento/:data?" element={<Lancamento />} />
          <Route path="/Configuracoes" element={<Configuracoes />} />
          <Route path="/*" element={<Navigate to="/Fechamentos" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
